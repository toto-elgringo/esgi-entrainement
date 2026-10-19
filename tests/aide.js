import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const CODE_DEPART = 'fn double(x: i32) -> i32 {\n    todo!()\n}\n\nfn main() {}\n';
export const CODE_SOLUTION = 'fn double(x: i32) -> i32 {\n    x * 2\n}\n\nfn main() {}\n';
export const TESTS = '#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn double_de_deux() {\n        assert_eq!(double(2), 4);\n    }\n}\n';

export const PYTHON_DEPART = 'def double(x):\n    pass\n\n\nif __name__ == "__main__":\n    print(double(21))\n';
export const PYTHON_SOLUTION = 'def double(x):\n    return x * 2\n\n\nif __name__ == "__main__":\n    print(double(21))\n';
export const PYTHON_TESTS = 'def test_double_de_deux():\n    assert double(2) == 4, "double(2) doit valoir 4"\n\n\ndef test_double_de_zero():\n    assert double(0) == 0, "double(0) doit valoir 0"\n';

export const C_DEPART = '#include <stdio.h>\n\nint double_de(int x) {\n    return 0;\n}\n\nint main(void) {\n    printf("%d\\n", double_de(21));\n    return 0;\n}\n';
export const C_SOLUTION = '#include <stdio.h>\n\nint double_de(int x) {\n    return x * 2;\n}\n\nint main(void) {\n    printf("%d\\n", double_de(21));\n    return 0;\n}\n';
export const C_TESTS = 'int main(void) {\n    VERIFIER(double_de(2) == 4, "double_de(2) doit valoir 4");\n    VERIFIER(double_de(0) == 0, "double_de(0) doit valoir 0");\n    return BILAN();\n}\n';

async function ecrire(fichier, contenu) {
  await fs.mkdir(path.dirname(fichier), { recursive: true });
  await fs.writeFile(fichier, typeof contenu === 'string' ? contenu : JSON.stringify(contenu), 'utf8');
}

export async function creerDossierTemporaire() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'esgi-entrainement-test-'));
}

export async function supprimerDossier(dossier) {
  await fs.rm(dossier, { recursive: true, force: true, maxRetries: 3 });
}

async function creerExercice(dossier, meta, fichiers) {
  await ecrire(path.join(dossier, 'exercice.json'), meta);
  for (const [nom, contenu] of Object.entries(fichiers)) await ecrire(path.join(dossier, nom), contenu);
}

async function creerContenuRust(dossier) {
  const chapitre = path.join(dossier, '01-bases');
  await ecrire(path.join(chapitre, 'chapitre.json'), { titre: 'Les bases', description: 'Pour commencer', source: 'cours' });
  await ecrire(path.join(chapitre, 'cours.md'), '# Les bases\n');
  await ecrire(path.join(chapitre, 'quiz.json'), [
    { question: 'Combien font 1 + 1 ?', choix: ['1', '2'], reponse: 1, explication: 'Facile.' },
  ]);
  await creerExercice(path.join(chapitre, 'exercices', '01-double'), { titre: 'Le double', difficulte: 1, type: 'tests', indices: ['Multiplie par 2'] }, {
    'enonce.md': 'Écris `double`.',
    'depart.rs': CODE_DEPART,
    'solution.rs': CODE_SOLUTION,
    'tests.rs': TESTS,
  });
  await creerExercice(path.join(chapitre, 'exercices', '02-bonjour'), { titre: 'Bonjour', difficulte: 1, type: 'sortie', indices: [] }, {
    'enonce.md': 'Affiche Bonjour.',
    'depart.rs': 'fn main() {}\n',
    'solution.rs': 'fn main() {\n    println!("Bonjour");\n}\n',
    'sortie.txt': 'Bonjour\n',
  });
  await ecrire(path.join(dossier, '02-vide', 'chapitre.json'), { titre: 'Vide', source: 'fondamentaux' });
  await fs.mkdir(path.join(dossier, 'Dossier_Invalide'), { recursive: true });
}

async function creerContenuPython(dossier) {
  const chapitre = path.join(dossier, '01-bases');
  await ecrire(path.join(chapitre, 'chapitre.json'), { titre: 'Bases', source: 'cours' });
  await ecrire(path.join(chapitre, 'cours.md'), '# Bases\n');
  await creerExercice(path.join(chapitre, 'exercices', '01-double'), { titre: 'Le double', difficulte: 1, type: 'tests', indices: [] }, {
    'enonce.md': 'Écris `double`.',
    'depart.py': PYTHON_DEPART,
    'solution.py': PYTHON_SOLUTION,
    'tests.py': PYTHON_TESTS,
  });
  await creerExercice(path.join(chapitre, 'exercices', '02-saluer'), { titre: 'Saluer', difficulte: 1, type: 'sortie', indices: [] }, {
    'enonce.md': 'Salue la personne dont le nom est donné en entrée.',
    'depart.py': 'nom = input()\n',
    'solution.py': 'nom = input()\nprint(f"Bonjour {nom}")\n',
    'sortie.txt': 'Bonjour Ada\n',
    'entree.txt': 'Ada\n',
  });
}

async function creerContenuC(dossier) {
  const chapitre = path.join(dossier, '01-bases');
  await ecrire(path.join(chapitre, 'chapitre.json'), { titre: 'Bases', source: 'cours' });
  await ecrire(path.join(chapitre, 'cours.md'), '# Bases\n');
  await creerExercice(path.join(chapitre, 'exercices', '01-double'), { titre: 'Le double', difficulte: 1, type: 'tests', indices: [] }, {
    'enonce.md': 'Écris `double_de`.',
    'depart.c': C_DEPART,
    'solution.c': C_SOLUTION,
    'tests.c': C_TESTS,
  });
}

export async function creerContenuExemple(racine) {
  const contenu = path.join(racine, 'contenu');
  const dossiers = { rust: path.join(contenu, 'rust'), python: path.join(contenu, 'python'), c: path.join(contenu, 'c') };
  await creerContenuRust(dossiers.rust);
  await creerContenuPython(dossiers.python);
  await creerContenuC(dossiers.c);
  return { contenu, ...dossiers };
}
