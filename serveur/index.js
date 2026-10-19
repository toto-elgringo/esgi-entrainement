import { exec } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { creerServeur } from './serveur.js';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 3000;

function ouvrirNavigateur(adresse) {
  const commandes = { win32: `start "" "${adresse}"`, darwin: `open "${adresse}"` };
  exec(commandes[process.platform] ?? `xdg-open "${adresse}"`, () => {});
}

const serveur = creerServeur({ racine, dossierContenu: path.join(racine, 'contenu') });

process.on('SIGINT', () => process.exit(0));

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
});
