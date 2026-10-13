import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const CODE_DEPART = 'fn double(x: i32) -> i32 {\n    todo!()\n}\n\nfn main() {}\n';
export const CODE_SOLUTION = 'fn double(x: i32) -> i32 {\n    x * 2\n}\n\nfn main() {}\n';
export const TESTS = '#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn double_de_deux() {\n        assert_eq!(double(2), 4);\n    }\n}\n';

async function ecrire(fichier, contenu) {
  await fs.mkdir(path.dirname(fichier), { recursive: true });
  await fs.writeFile(fichier, typeof contenu === 'string' ? contenu : JSON.stringify(contenu), 'utf8');
}

export async function creerDossierTemporaire() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'rust-entrainement-test-'));
}

export async function supprimerDossier(dossier) {
  await fs.rm(dossier, { recursive: true, force: true, maxRetries: 3 });
}

export async function creerContenuExemple(racine) {
  const contenu = path.join(racine, 'contenu');
  const chapitre = path.join(contenu, '01-bases');
  await ecrire(path.join(chapitre, 'chapitre.json'), { titre: 'Les bases', description: 'Pour commencer', source: 'cours' });
  await ecrire(path.join(chapitre, 'cours.md'), '# Les bases\n');
  await ecrire(path.join(chapitre, 'quiz.json'), [
    { question: 'Combien font 1 + 1 ?', choix: ['1', '2'], reponse: 1, explication: 'Facile.' },
  ]);

  const exercice = path.join(chapitre, 'exercices', '01-double');
  await ecrire(path.join(exercice, 'exercice.json'), { titre: 'Le double', difficulte: 1, type: 'tests', indices: ['Multiplie par 2'] });
  await ecrire(path.join(exercice, 'enonce.md'), 'Écris `double`.');
  await ecrire(path.join(exercice, 'depart.rs'), CODE_DEPART);
  await ecrire(path.join(exercice, 'solution.rs'), CODE_SOLUTION);
  await ecrire(path.join(exercice, 'tests.rs'), TESTS);

  const sortie = path.join(chapitre, 'exercices', '02-bonjour');
  await ecrire(path.join(sortie, 'exercice.json'), { titre: 'Bonjour', difficulte: 1, type: 'sortie', indices: [] });
  await ecrire(path.join(sortie, 'enonce.md'), 'Affiche Bonjour.');
  await ecrire(path.join(sortie, 'depart.rs'), 'fn main() {}\n');
  await ecrire(path.join(sortie, 'solution.rs'), 'fn main() {\n    println!("Bonjour");\n}\n');
  await ecrire(path.join(sortie, 'sortie.txt'), 'Bonjour\n');

  await ecrire(path.join(contenu, '02-vide', 'chapitre.json'), { titre: 'Vide', source: 'fondamentaux' });
  await fs.mkdir(path.join(contenu, 'Dossier_Invalide'), { recursive: true });
  return contenu;
}
