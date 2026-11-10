import { exec } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { creerSynchro } from './myges/synchro.js';
import { creerServeur } from './serveur.js';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 3000;

function ouvrirNavigateur(adresse) {
  const commandes = { win32: `start "" "${adresse}"`, darwin: `open "${adresse}"` };
  exec(commandes[process.platform] ?? `xdg-open "${adresse}"`, () => {});
}

const dossierSupports = process.env.DOSSIER_SUPPORTS || path.join(os.homedir(), 'Obsidian', 'Claude Note', 'Cours - ESGI');

function commandeClaude() {
  const commande = process.env.ESGI_CLAUDE;
  if (!commande) return { commande: 'claude', args: [] };
  if (/\.m?js$/i.test(commande)) return { commande: process.execPath, args: [path.resolve(racine, commande)] };
  return { commande, args: [] };
}

const synchro = creerSynchro({
  vault: dossierSupports,
  fichierEnv: path.join(racine, '.env'),
  fichierSuivi: path.join(racine, 'myges-suivi.json'),
  fichierMatieres: path.join(racine, 'myges-matieres.json'),
  fichierAttente: path.join(racine, 'myges-a-integrer.json'),
  dossierProjet: racine,
  claude: commandeClaude(),
});
const serveur = creerServeur({ racine, dossierContenu: path.join(racine, 'contenu'), dossierSupports, synchro });

function quitter() {
  synchro.couper();
  process.exit(0);
}

process.on('SIGINT', quitter);
process.on('SIGTERM', quitter);

serveur.on('error', (erreur) => {
  if (erreur.code === 'EADDRINUSE') {
    console.error(`Le port ${port} est déjà utilisé. Lance avec un autre port : PORT=3001 npm start`);
    process.exit(1);
  }
  throw erreur;
});

serveur.listen(port, '127.0.0.1', () => {
  const adresse = `http://localhost:${port}`;
  console.log(`ESGI Entraînement lancé sur ${adresse} (Ctrl + C pour arrêter)`);
  if (!process.argv.includes('--sans-navigateur')) ouvrirNavigateur(adresse);
  synchro.reprendreAuDemarrage().then((etat) => {
    if (etat.etape === 'claude') console.log(`Reprise de l’intégration des cours MyGES (${etat.enAttente.length} fichier(s)).`);
  }).catch((erreur) => console.error(`Reprise de la synchro MyGES impossible : ${erreur.message}`));
});
