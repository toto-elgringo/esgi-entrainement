import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { construireSommaire } from '../serveur/contenu-rust.js';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dossierRust = path.join(racine, 'contenu', 'rust');
const fichier = path.join(dossierRust, 'sommaire.json');

const sommaire = await construireSommaire(dossierRust);
await fs.writeFile(fichier, `${JSON.stringify(sommaire, null, 2)}\n`, 'utf8');
const nbExercices = sommaire.chapitres.reduce((total, chapitre) => total + chapitre.exercices.length, 0);
console.log(`contenu/rust/sommaire.json mis à jour : ${sommaire.chapitres.length} chapitres, ${nbExercices} exercices.`);
