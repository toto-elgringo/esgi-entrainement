import { exec } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { creerSynchro } from './myges/synchro.js';
import { creerSynchroSchooding } from './schooding/synchro.js';
import { verifierEnfermement } from './enfermement.js';
import { prechauffer } from './rust.js';
import { lireAdresses } from './reglages.js';
import { creerProgression } from './progression.js';
import { creerServeur } from './serveur.js';
import { creerSynchroDesactivee } from './synchro-desactivee.js';
import { creerVerrou } from './synchro.js';

try {
  verifierEnfermement();
} catch (erreur) {
  console.error(erreur.message);
  process.exit(1);
}

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

const verrou = creerVerrou();
const synchroDesactivee = process.env.ESGI_SYNCHRO === 'desactivee';
const myges = synchroDesactivee ? creerSynchroDesactivee('MyGES') : creerSynchro({
  vault: dossierSupports,
  fichierEnv: path.join(racine, '.env'),
  fichierSuivi: path.join(racine, 'myges-suivi.json'),
  fichierMatieres: path.join(racine, 'myges-matieres.json'),
  fichierAttente: path.join(racine, 'myges-a-integrer.json'),
  dossierProjet: racine,
  claude: commandeClaude(),
  verrou,
});
const schooding = synchroDesactivee ? creerSynchroDesactivee('Schooding') : creerSynchroSchooding({
  vault: dossierSupports,
  fichierEnv: path.join(racine, '.env'),
  fichierSuivi: path.join(racine, 'schooding-suivi.json'),
  fichierMatieres: path.join(racine, 'schooding-matieres.json'),
  fichierAttente: path.join(racine, 'schooding-a-integrer.json'),
  dossierProjet: racine,
  claude: commandeClaude(),
  verrou,
});
const progression = process.env.ESGI_PROGRESSION ? creerProgression(process.env.ESGI_PROGRESSION) : null;
const serveur = creerServeur({ racine, dossierContenu: path.join(racine, 'contenu'), dossierSupports, synchros: { myges, schooding }, adresses: lireAdresses(process.env.ESGI_ADRESSES), progression });

function quitter() {
  myges.couper();
  schooding.couper();
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
  prechauffer().catch(() => {});
  myges.reprendreAuDemarrage().then((etat) => {
    if (etat.etape === 'claude') console.log(`Reprise de l’intégration des cours MyGES (${etat.enAttente.length} fichier(s)).`);
  }).catch((erreur) => console.error(`Reprise de la synchro MyGES impossible : ${erreur.message}`));
  schooding.reprendreAuDemarrage().then((etat) => {
    if (etat.etape === 'claude') console.log(`Reprise de l’intégration des éléments Schooding (${etat.enAttente.length} fichier(s)).`);
  }).catch((erreur) => console.error(`Reprise de la synchro Schooding impossible : ${erreur.message}`));
});
