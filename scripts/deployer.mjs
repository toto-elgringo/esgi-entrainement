import { spawnSync } from 'node:child_process';
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
    for (const support of chapitre.supports ?? []) fichiers.add(support.fichier);
  }
  return [...fichiers].sort();
}

export function supportsAEnvoyer(locaux, distants) {
  return locaux.filter(({ chemin, taille }) => distants.get(chemin) !== taille).map(({ chemin }) => chemin);
}

export function lotSftp(chemins, dossierLocal, dossierDistant) {
  const dossiers = new Set([dossierDistant]);
  const envois = [];
  for (const chemin of chemins) {
    if (chemin.includes('"')) throw new Error(`Nom de support refusé (guillemet) : ${chemin}`);
    const morceaux = chemin.split('/');
    for (let fin = 1; fin < morceaux.length; fin += 1) dossiers.add(`${dossierDistant}/${morceaux.slice(0, fin).join('/')}`);
    envois.push(`put "${dossierLocal}/${chemin}" "${dossierDistant}/${chemin}"`);
  }
  return [...[...dossiers].map((dossier) => `-mkdir "${dossier}"`), ...envois, ''].join('\n');
}

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

async function envoyerSupports(hote) {
  const dossierLocal = (process.env.DOSSIER_SUPPORTS || path.join(os.homedir(), 'Obsidian', 'Claude Note', 'Cours - ESGI')).replaceAll('\\', '/');
  const locaux = [];
  for (const chemin of await listerSupports(path.join(RACINE, 'contenu'))) {
    try {
      locaux.push({ chemin, taille: (await fs.stat(path.join(dossierLocal, chemin))).size });
    } catch {
      console.warn(`Support absent sur ce PC, ignoré : ${chemin}`);
    }
  }
  const aEnvoyer = supportsAEnvoyer(locaux, lireDistants(hote));
  console.log(`Supports : ${aEnvoyer.length} à envoyer sur ${locaux.length}.`);
  if (aEnvoyer.length === 0) return;
  lancer('sftp', [...OPTIONS_SSH, '-b', '-', hote], { input: lotSftp(aEnvoyer, dossierLocal, DOSSIER_SUPPORTS_DISTANT), stdio: ['pipe', 'inherit', 'inherit'] });
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
