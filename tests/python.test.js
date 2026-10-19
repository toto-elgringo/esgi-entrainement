import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as python from '../serveur/python.js';
import { PYTHON_DEPART, PYTHON_SOLUTION, PYTHON_TESTS } from './aide.js';

const { python: version } = await python.outilsPython();
const sansPython = version ? false : 'Python 3 n’est pas installé';

describe('python : fonctions pures', () => {
  it('reconnaît une version de Python 3 suffisante', () => {
    assert.equal(python.versionPython('Python 3.13.14\n'), 'Python 3.13.14');
    assert.equal(python.versionPython('Python 3.6.0'), null);
    assert.equal(python.versionPython('Python 2.7.18'), null);
    assert.equal(python.versionPython('introuvable'), null);
  });

  it('importe le code de l’élève avant les tests', () => {
    const script = python.assemblerVerification('def test_a():\n    assert True\n');
    assert.match(script, /from exercice import \*/);
    assert.ok(script.indexOf('from exercice import *') < script.indexOf('def test_a'));
    assert.match(script, /RESULTAT/);
  });
});

describe('python : exécution réelle', { skip: sansPython }, () => {
  it('réussit quand les tests passent', async () => {
    const resultat = await python.verifierAvecTests(PYTHON_SOLUTION, PYTHON_TESTS);
    assert.equal(resultat.statut, 'reussi');
    assert.deepEqual(resultat.resume, { reussis: 2, echoues: 0 });
    assert.doesNotMatch(resultat.sortie, /RESULTAT/);
  });

  it('échoue avec le message du test raté', async () => {
    const resultat = await python.verifierAvecTests(PYTHON_DEPART, PYTHON_TESTS);
    assert.equal(resultat.statut, 'echec');
    assert.deepEqual(resultat.resume, { reussis: 0, echoues: 2 });
    assert.match(resultat.sortie, /double\(2\) doit valoir 4/);
  });

  it('ne lance pas le bloc main pendant les tests', async () => {
    const code = 'def double(x):\n    return 2 * x\n\n\nif __name__ == "__main__":\n    input()\n';
    const resultat = await python.verifierAvecTests(code, PYTHON_TESTS);
    assert.equal(resultat.statut, 'reussi');
  });

  it('signale une erreur de syntaxe sans lancer le programme', async () => {
    const resultat = await python.executerProgramme('def f(:\n    pass\n');
    assert.equal(resultat.statut, 'erreur_compilation');
    assert.match(resultat.sortie, /SyntaxError/);
    assert.match(resultat.sortie, /exercice\.py/);
  });

  it('signale une exception pendant l’exécution', async () => {
    const resultat = await python.executerProgramme('print(1 / 0)\n');
    assert.equal(resultat.statut, 'erreur_execution');
    assert.match(resultat.sortie, /ZeroDivisionError/);
    assert.doesNotMatch(resultat.sortie, /atelier-/);
  });

  it('donne une exception levée dans un test avec la ligne fautive', async () => {
    const code = 'def double(x):\n    return x / 0\n';
    const resultat = await python.verifierAvecTests(code, PYTHON_TESTS);
    assert.equal(resultat.statut, 'echec');
    assert.match(resultat.sortie, /ZeroDivisionError.*exercice\.py, ligne 2/);
  });

  it('exécute un programme avec une entrée et des accents', async () => {
    const resultat = await python.executerProgramme('nom = input()\nprint(f"Bonjour {nom} ! Ça va ?")\n', 'Zoé\n');
    assert.equal(resultat.statut, 'execute');
    assert.equal(resultat.sortie.trim(), 'Bonjour Zoé ! Ça va ?');
  });

  it('compare la sortie avec le texte attendu', async () => {
    const bon = await python.verifierSortie('print("Bonjour")\n', 'Bonjour\n');
    const mauvais = await python.verifierSortie('print("Salut")\n', 'Bonjour\n');
    assert.equal(bon.statut, 'reussi');
    assert.equal(mauvais.statut, 'echec');
  });

  it('repart d’un dossier vide à chaque lancement', async () => {
    const creer = 'with open("trace.txt", "w") as fichier:\n    fichier.write("ok")\n';
    const lire = 'import os\nprint(os.path.exists("trace.txt"))\n';
    for (let i = 0; i < 4; i++) await python.executerProgramme(creer);
    const resultats = await Promise.all([1, 2, 3, 4].map(() => python.executerProgramme(lire)));
    assert.deepEqual(resultats.map((resultat) => resultat.sortie.trim()), ['False', 'False', 'False', 'False']);
  });

  it('arrête une boucle infinie', { timeout: 30_000 }, async () => {
    const resultat = await python.executerProgramme('while True:\n    pass\n');
    assert.equal(resultat.statut, 'delai_depasse');
  });
});
