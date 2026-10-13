import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as rust from '../serveur/rust.js';
import { CODE_DEPART, CODE_SOLUTION, TESTS } from './aide.js';

const rustDisponible = (await rust.versionRust()) !== null;
const sansRust = rustDisponible ? false : 'rustc n’est pas installé';

describe('rust : fonctions pures', () => {
  it('colle les tests à la fin du code', () => {
    assert.equal(rust.assemblerCodeTest('fn main() {}\n\n', '  mod tests {}  '), 'fn main() {}\n\nmod tests {}\n');
  });

  it('lit le résumé des tests', () => {
    const sortie = 'running 3 tests\n...\ntest result: FAILED. 2 passed; 1 failed; 0 ignored; 0 measured';
    assert.deepEqual(rust.analyserResultatTests(sortie), { reussis: 2, echoues: 1 });
    assert.equal(rust.analyserResultatTests('rien'), null);
  });

  it('normalise une sortie de programme', () => {
    assert.equal(rust.normaliserSortie('\r\nBonjour   \r\nmonde\r\n\r\n'), 'Bonjour\nmonde');
  });
});

describe('rust : compilation réelle', { skip: sansRust }, () => {
  it('réussit quand les tests passent', async () => {
    const resultat = await rust.verifierAvecTests(CODE_SOLUTION, TESTS);
    assert.equal(resultat.statut, 'reussi');
    assert.deepEqual(resultat.resume, { reussis: 1, echoues: 0 });
  });

  it('échoue quand un test panique', async () => {
    const resultat = await rust.verifierAvecTests(CODE_DEPART, TESTS);
    assert.equal(resultat.statut, 'echec');
    assert.match(resultat.sortie, /not yet implemented/);
  });

  it('signale une erreur de compilation', async () => {
    const resultat = await rust.verifierAvecTests('fn main() { let x: i32 = "texte"; }', TESTS);
    assert.equal(resultat.statut, 'erreur_compilation');
    assert.match(resultat.sortie, /mismatched types/);
  });

  it('exécute un programme et récupère sa sortie', async () => {
    const resultat = await rust.executerProgramme('fn main() {\n    println!("Bonjour");\n}\n');
    assert.equal(resultat.statut, 'execute');
    assert.equal(resultat.sortie.trim(), 'Bonjour');
  });

  it('compare la sortie avec le texte attendu', async () => {
    const bon = await rust.verifierSortie('fn main() {\n    println!("Bonjour");\n}\n', 'Bonjour\n');
    const mauvais = await rust.verifierSortie('fn main() {\n    println!("Salut");\n}\n', 'Bonjour\n');
    assert.equal(bon.statut, 'reussi');
    assert.equal(mauvais.statut, 'echec');
    assert.equal(mauvais.attendu, 'Bonjour\n');
  });

  it('signale une panique pendant l’exécution', async () => {
    const resultat = await rust.executerProgramme('fn main() {\n    panic!("aïe");\n}\n');
    assert.equal(resultat.statut, 'erreur_execution');
    assert.match(resultat.sortie, /aïe/);
  });
});
