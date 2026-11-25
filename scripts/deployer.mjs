import { spawn, spawnSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RACINE = fileURLToPath(new URL('..', import.meta.url));
const OPTIONS_SSH = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=20'];
const DOSSIER_SUPPORTS_DISTANT = 'esgi-entrainement-supports';
const URL_SITE = 'http://hermes/esgi-entrainement/';

export function verifierBranche(nom) {
  if (nom !== 'main') throw new Error(`Déploiement refusé : branche "${nom}", il faut être sur main.`);
}

export function verifierDossierPropre(sortie) {
  if (typeof sortie !== 'string') throw new Error("Déploiement refusé : git status n'a pas pu être lu.");
  const modifications = sortie.trim();
  if (modifications !== '') {
    throw new Error(`Déploiement refusé : le dossier n'est pas propre (fichiers modifiés ou non suivis).\n${modifications}`);
  }
}

async function chapitres(dossier) {
  const trouves = [];
  for (const entree of await fs.readdir(dossier, { withFileTypes: true })) {
    const chemin = path.join(dossier, entree.name);
    if (entree.isDirectory()) trouves.push(...(await chapitres(chemin)));
    else if (entree.name === 'chapitre.json') trouves.push(chemin);
  }
  return trouves;
}

export async function listerSupports(dossierContenu) {
  const fichiers = new Set();
  for (const chemin of await chapitres(dossierContenu)) {
    const chapitre = JSON.parse(await fs.readFile(chemin, 'utf8'));
    for (const support of chapitre.supports ?? []) if (support.fichier) fichiers.add(support.fichier);
  }
  return [...fichiers].sort();
}

export function supportsAEnvoyer(locaux, distants) {
  return locaux.filter(({ chemin, taille }) => distants.get(chemin) !== taille).map(({ chemin }) => chemin);
}

export function enteteEnvoi(chemin, taille) {
  const morceaux = chemin.split('/');
  const interdit = /[\n\r\\]/.test(chemin) || morceaux.some((morceau) => morceau === '' || morceau === '.' || morceau === '..');
  if (!chemin || chemin.startsWith('/') || interdit) throw new Error(`Chemin de support refusé : ${JSON.stringify(chemin)}`);
  return `${taille} ${chemin}\n`;
}

export const RECEPTEUR = String.raw`
import os, sys
base = os.path.realpath(sys.argv[1])
entree = sys.stdin.buffer
recus = 0
while True:
    ligne = entree.readline()
    if not ligne:
        break
    taille, chemin = ligne.decode("utf-8").rstrip("\n").split(" ", 1)
    taille = int(taille)
    destination = os.path.realpath(os.path.join(base, chemin))
    if os.path.isabs(chemin) or not destination.startswith(base + os.sep):
        sys.exit("Chemin refusé : " + chemin)
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    temporaire = destination + ".envoi"
    with open(temporaire, "wb") as sortie:
        reste = taille
        while reste:
            bloc = entree.read(min(reste, 1 << 20))
            if not bloc:
                sys.exit("Envoi coupé : " + chemin)
            sortie.write(bloc)
            reste -= len(bloc)
    os.replace(temporaire, destination)
    recus += 1
print(str(recus) + " support(s) reçu(s)")
`;

export function commandeDistante({ dossier, branche }) {
  const miseDeCote = 'git diff --quiet && git diff --cached --quiet || git stash push -q -m avant-deploiement-$(date +%F-%H%M%S)';
  return [
    `cd ${dossier}`,
    'git fetch -q origin',
    `(${miseDeCote})`,
    `git checkout -q ${branche}`,
    `git pull -q --ff-only origin ${branche}`,
    'bash scripts/hermes/installer.sh',
    'git log --oneline -1',
  ].join(' && ');
}

function lancer(commande, args, options = {}) {
  const resultat = spawnSync(commande, args, { cwd: RACINE, stdio: 'inherit', ...options });
  if (resultat.status !== 0) {
    const raison = resultat.error ? ` (${resultat.error.message})` : '';
    throw new Error(`Échec : ${commande} ${args.join(' ')}${raison}`);
  }
}

function sortie(commande, args) {
  const resultat = spawnSync(commande, args, { cwd: RACINE, encoding: 'utf8' });
  return resultat.status === 0 ? resultat.stdout : null;
}

function lireDistants(hote) {
  const commande = `mkdir -p ~/${DOSSIER_SUPPORTS_DISTANT} && cd ~/${DOSSIER_SUPPORTS_DISTANT} && find . -type f -printf '%s %P\\n'`;
  const texte = sortie('ssh', [...OPTIONS_SSH, hote, commande]);
  if (texte === null) throw new Error('Impossible de lire les supports déjà présents sur hermes.');
  const distants = new Map();
  for (const ligne of texte.split('\n')) {
    const espace = ligne.indexOf(' ');
    if (espace > 0) distants.set(ligne.slice(espace + 1), Number(ligne.slice(0, espace)));
  }
  return distants;
}

function envoyer(hote, dossierLocal, aEnvoyer) {
  const recepteur = RECEPTEUR.replaceAll("'", `'\\''`);
  return new Promise((resoudre, rejeter) => {
    const ssh = spawn('ssh', [...OPTIONS_SSH, hote, `python3 -c '${recepteur}' ~/${DOSSIER_SUPPORTS_DISTANT}`], { stdio: ['pipe', 'inherit', 'inherit'] });
    ssh.on('error', rejeter);
    ssh.on('close', (code) => (code === 0 ? resoudre() : rejeter(new Error(`Échec de l'envoi des supports (code ${code})`))));
    (async () => {
      for (const { chemin, taille } of aEnvoyer) {
        ssh.stdin.write(enteteEnvoi(chemin, taille));
        for await (const bloc of createReadStream(path.join(dossierLocal, chemin))) {
          if (!ssh.stdin.write(bloc)) await new Promise((suite) => ssh.stdin.once('drain', suite));
        }
      }
      ssh.stdin.end();
    })().catch((erreur) => {
      ssh.kill();
      rejeter(erreur);
    });
  });
}

async function envoyerSupports(hote) {
  const dossierLocal = process.env.DOSSIER_SUPPORTS || path.join(os.homedir(), 'Obsidian', 'Claude Note', 'Cours - ESGI');
  const locaux = [];
  for (const chemin of await listerSupports(path.join(RACINE, 'contenu'))) {
    try {
      locaux.push({ chemin, taille: (await fs.stat(path.join(dossierLocal, chemin))).size });
    } catch {
      console.warn(`Support absent sur ce PC, ignoré : ${chemin}`);
    }
  }
  const chemins = new Set(supportsAEnvoyer(locaux, lireDistants(hote)));
  const aEnvoyer = locaux.filter(({ chemin }) => chemins.has(chemin));
  console.log(`Supports : ${aEnvoyer.length} à envoyer sur ${locaux.length}.`);
  if (aEnvoyer.length > 0) await envoyer(hote, dossierLocal, aEnvoyer);
}

async function deployer() {
  const branche = sortie('git', ['branch', '--show-current']);
  verifierBranche(branche === null ? '' : branche.trim());
  verifierDossierPropre(sortie('git', ['status', '--porcelain']));
  const reglages = JSON.parse(await fs.readFile(path.join(RACINE, 'scripts', 'deployer.json'), 'utf8'));
  await envoyerSupports(reglages.hote);
  lancer('ssh', [...OPTIONS_SSH, reglages.hote, commandeDistante(reglages)]);
  console.log(`Déploiement terminé : ${URL_SITE}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await deployer();
  } catch (erreur) {
    console.error(erreur.message);
    process.exit(1);
  }
}
