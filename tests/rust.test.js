import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as rust from '../serveur/rust.js';
import { CODE_DEPART, CODE_SOLUTION, TESTS } from './aide.js';

const outils = await rust.outilsRust();
const sansCargo = outils.cargo ? false : 'cargo n’est pas installé';
const sansClippy = outils.clippy ? false : 'clippy n’est pas installé';

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

  it('trouve le binaire de test dans les messages de cargo', () => {
    const messages = [
      JSON.stringify({ reason: 'compiler-artifact', profile: { test: false }, executable: 'C:\\t\\exercice.exe' }),
      JSON.stringify({ reason: 'compiler-artifact', profile: { test: true }, executable: 'C:\\t\\deps\\exercice-123.exe' }),
      JSON.stringify({ reason: 'build-finished', success: true }),
    ].join('\n');
    assert.equal(rust.cheminExecutableTest(messages), 'C:\\t\\deps\\exercice-123.exe');
    assert.equal(rust.cheminExecutableTest('pas du json\n'), null);
  });
});

describe('rust : réserve de dossiers de travail', () => {
  it('ne prête jamais le même dossier à deux tâches en même temps', async () => {
    const utiliser = rust.creerReserve(['a', 'b']);
    const occupes = new Set();
    let maximum = 0;
    const tache = (numero) => utiliser(async (dossier) => {
      assert.equal(occupes.has(dossier), false);
      occupes.add(dossier);
      maximum = Math.max(maximum, occupes.size);
      await new Promise((resoudre) => setTimeout(resoudre, 10));
      occupes.delete(dossier);
      return numero;
    });
    assert.deepEqual(await Promise.all([1, 2, 3, 4, 5].map(tache)), [1, 2, 3, 4, 5]);
    assert.equal(maximum, 2);
  });

  it('rend le dossier même si la tâche échoue', async () => {
    const utiliser = rust.creerReserve(['a']);
    await assert.rejects(utiliser(async () => {
      throw new Error('raté');
    }));
    assert.equal(await utiliser(async (dossier) => dossier), 'a');
  });
});

describe('rust : compilation réelle avec cargo', { skip: sansCargo }, () => {
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

  it('signale une erreur de compilation au format de cargo', async () => {
    const resultat = await rust.verifierAvecTests('fn main() { let x: i32 = "texte"; }', TESTS);
    assert.equal(resultat.statut, 'erreur_compilation');
    assert.match(resultat.sortie, /mismatched types/);
    assert.match(resultat.sortie, /src.main\.rs/);
    assert.match(resultat.sortie, /could not compile/);
  });

  it('signale une erreur qui n’apparaît qu’avec les tests', async () => {
    const resultat = await rust.verifierAvecTests('fn triple(x: i32) -> i32 {\n    x * 3\n}\n\nfn main() {}\n', TESTS);
    assert.equal(resultat.statut, 'erreur_compilation');
    assert.match(resultat.sortie, /double/);
  });

  it('exécute un programme et récupère sa sortie', async () => {
    const resultat = await rust.executerProgramme('fn main() {\n    println!("Bonjour");\n}\n');
    assert.equal(resultat.statut, 'execute');
    assert.equal(resultat.sortie.trim(), 'Bonjour');
  });

  it('exécute plusieurs programmes en même temps sans les mélanger', async () => {
    const nombres = [1, 2, 3, 4, 5, 6];
    const resultats = await Promise.all(nombres.map((n) => rust.executerProgramme(`fn main() {\n    println!("{}", ${n});\n}\n`)));
    assert.deepEqual(resultats.map((resultat) => resultat.sortie.trim()), nombres.map(String));
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

  it('donne les avertissements du compilateur', async () => {
    const resultat = await rust.executerProgramme('fn main() {\n    let x = 5;\n}\n');
    assert.equal(resultat.statut, 'execute');
    assert.match(resultat.avertissements, /unused variable/);
  });
});

describe('rust : conseils de clippy', { skip: sansCargo || sansClippy }, () => {
  it('ajoute les conseils de clippy aux avertissements', async () => {
    const code = 'fn trois() -> i32 {\n    return 3;\n}\n\nfn main() {\n    println!("{}", trois());\n}\n';
    const resultat = await rust.executerProgramme(code);
    assert.equal(resultat.statut, 'execute');
    assert.equal(resultat.sortie.trim(), '3');
    assert.match(resultat.avertissements, /needless_return/);
  });
});
