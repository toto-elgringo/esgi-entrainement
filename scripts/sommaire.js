import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMAINES_CODE } from '../js/domaines.js';
import { construireSommaire } from '../serveur/contenu-code.js';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const langage of Object.keys(DOMAINES_CODE)) {
  const dossier = path.join(racine, 'contenu', langage);
  const sommaire = await construireSommaire(dossier, langage);
  await fs.mkdir(dossier, { recursive: true });
  await fs.writeFile(path.join(dossier, 'sommaire.json'), `${JSON.stringify(sommaire, null, 2)}\n`, 'utf8');
  const nbExercices = sommaire.chapitres.reduce((total, chapitre) => total + chapitre.exercices.length, 0);
  console.log(`contenu/${langage}/sommaire.json mis à jour : ${sommaire.chapitres.length} chapitres, ${nbExercices} exercices.`);
}
