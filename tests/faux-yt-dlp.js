import fs from 'node:fs';

const args = process.argv.slice(2);
if (args.includes('--version')) {
  console.log('2026.01.01');
  process.exit(0);
}
const modele = args[args.indexOf('-o') + 1];
const fichier = modele.replace('%(ext)s', 'mp4');
fs.writeFileSync(fichier, `vidéo ${args.at(-1)}`);
console.log(fichier);
