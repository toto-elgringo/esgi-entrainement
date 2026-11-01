import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { extraireTests } from '../serveur/processus.js';
import { analyserTestsRust, lireArguments } from '../serveur/tests-rust.js';

const SOURCE = `fn main() {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encadrement() {
        assert_eq!(
            encadrer("rust"),
            "[rust]",
            "encadrer(\\"rust\\") doit donner \\"[rust]\\""
        );
    }

    #[test]
    fn presentation() {
        assert_eq!(presenter(), "ok");
    }

    #[test]
    fn repetition() {
        assert_eq!("ab-ab-ab", repeter("ab", 3), "repeter(\\"ab\\", 3) doit donner \\"ab-ab-ab\\"");
    }

    #[test]
    fn longueur() {
        assert!(presenter().len() > 5, "trop court");
    }

    #[test]
    fn difference() {
        assert_ne!(presenter(), "ok");
    }

    #[test]
    fn vide() {
        let v: Vec<i32> = Vec::new();
        v.first().unwrap();
    }
}
`;

const SORTIE = `
running 6 tests
test tests::difference ... FAILED
test tests::encadrement ... FAILED
test tests::longueur ... FAILED
test tests::presentation ... ok
test tests::repetition ... FAILED
test tests::vide ... FAILED

failures:

---- tests::difference stdout ----

thread 'tests::difference' (1) panicked at src\\main.rs:33:9:
assertion \`left != right\` failed
  left: "ok"
 right: "ok"
note: run with \`RUST_BACKTRACE=1\` environment variable to display a backtrace

---- tests::encadrement stdout ----

thread 'tests::encadrement' (10376) panicked at src\\main.rs:9:9:
assertion \`left == right\` failed: encadrer("rust") doit donner "[rust]"
  left: "[mot]"
 right: "[rust]"
note: run with \`RUST_BACKTRACE=1\` environment variable to display a backtrace

---- tests::longueur stdout ----

thread 'tests::longueur' (2) panicked at src\\main.rs:28:9:
trop court

---- tests::repetition stdout ----

thread 'tests::repetition' (8440) panicked at src\\main.rs:23:9:
assertion \`left == right\` failed: repeter("ab", 3) doit donner "ab-ab-ab"
  left: "ab-ab-ab"
 right: ""

---- tests::vide stdout ----

thread 'tests::vide' (3) panicked at src\\main.rs:39:11:
called \`Option::unwrap()\` on a \`None\` value


failures:
    tests::difference

test result: FAILED. 1 passed; 5 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
`;

describe('rust : arguments d’une macro', () => {
  it('découpe sur les virgules du premier niveau', () => {
    assert.deepEqual(lireArguments('f(1, 2), vec![3, 4], "a,b", \')\')', 0), ['f(1, 2)', 'vec![3, 4]', '"a,b"', "')'"]);
  });

  it('ignore la virgule finale et les commentaires', () => {
    assert.deepEqual(lireArguments('a, // note, ici\n b,\n)', 0), ['a', 'b']);
  });
});

describe('rust : analyse des tests', () => {
  const tests = analyserTestsRust(SORTIE, SOURCE);
  const parNom = Object.fromEntries(tests.map((test) => [test.nom, test]));

  it('garde l’ordre et l’état de chaque test', () => {
    assert.deepEqual(tests.map((test) => [test.nom, test.reussi]), [
      ['difference', false],
      ['encadrement', false],
      ['longueur', false],
      ['presentation', true],
      ['repetition', false],
      ['vide', false],
    ]);
  });

  it('retrouve l’appel, la valeur obtenue et la valeur attendue', () => {
    assert.deepEqual(parNom.encadrement, {
      nom: 'encadrement',
      reussi: false,
      appel: 'encadrer("rust")',
      obtenu: '"[mot]"',
      attendu: '"[rust]"',
      different: false,
      indice: 'encadrer("rust") doit donner "[rust]"',
    });
  });

  it('remet l’appel à gauche quand le test écrit la valeur attendue en premier', () => {
    assert.equal(parNom.repetition.appel, 'repeter("ab", 3)');
    assert.equal(parNom.repetition.obtenu, '""');
    assert.equal(parNom.repetition.attendu, '"ab-ab-ab"');
  });

  it('reconnaît assert_ne!', () => {
    assert.equal(parNom.difference.different, true);
    assert.equal(parNom.difference.appel, 'presenter()');
  });

  it('donne la condition d’un assert! avec message', () => {
    assert.equal(parNom.longueur.condition, 'presenter().len() > 5');
    assert.equal(parNom.longueur.indice, 'trop court');
  });

  it('garde le texte d’une panique ordinaire', () => {
    assert.match(parNom.vide.erreur, /unwrap\(\)/);
  });

  it('marche sans le code source', () => {
    const [premier] = analyserTestsRust(SORTIE, '');
    assert.equal(premier.appel, null);
    assert.equal(premier.obtenu, '"ok"');
  });

  it('renvoie une liste vide quand il n’y a aucun test', () => {
    assert.deepEqual(analyserTestsRust('error: could not compile', SOURCE), []);
  });
});

describe('lignes @TEST', () => {
  it('sépare les enregistrements du reste de la sortie', () => {
    const { sortie, tests } = extraireTests('✓ a\n@TEST {"nom":"a","reussi":true}\nbonjour\n@TEST pas du json\nRESULTAT 1 0');
    assert.deepEqual(tests, [{ nom: 'a', reussi: true }]);
    assert.equal(sortie, '✓ a\nbonjour\n@TEST pas du json\nRESULTAT 1 0');
  });
});
