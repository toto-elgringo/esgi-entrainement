import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as c from '../serveur/c.js';

const { gcc } = await c.outilsC();
const sansGcc = gcc ? false : 'gcc n’est pas installé';

const CODE = [
  '#include <stdlib.h>',
  'int double_de(int x) { return x + 1; }',
  'char *salut(void) { return "bonjour\\n"; }',
  'double demi(int x) { return x / 2.0; }',
  "char lettre(void) { return 'z'; }",
  'int main(void) { return 0; }',
  '',
].join('\n');

const TESTS = [
  'int main(void) {',
  '    int x = 2;',
  '    VERIFIER_EGAL(double_de(2), 4, "double_de(2) doit valoir 4");',
  '    VERIFIER_EGAL(double_de(1), 2, "double_de(1) doit valoir 2");',
  '    VERIFIER_EGAL(salut(), "bonjour", "le texte");',
  '    VERIFIER_EGAL(salut(), "bonjour\\n", "le texte exact");',
  '    VERIFIER_EGAL(demi(3), 0.1 + 0.2, "le réel");',
  "    VERIFIER_EGAL(lettre(), 'a', \"la lettre\");",
  '    VERIFIER(x == 3 && x > 0, "condition composée");',
  '    return BILAN();',
  '}',
  '',
].join('\n');

describe('c : détail des vérifications ratées', { skip: sansGcc }, () => {
  it('donne l’appel, la valeur obtenue et la valeur attendue sans avertissement', async () => {
    const resultat = await c.verifierAvecTests(CODE, TESTS);
    assert.equal(resultat.statut, 'echec');
    assert.equal(resultat.avertissements, '');
    assert.deepEqual(resultat.resume, { reussis: 2, echoues: 5 });
    assert.deepEqual(resultat.tests[0], {
      reussi: false,
      nom: 'double_de(2) doit valoir 4',
      appel: 'double_de(2)',
      obtenu: '3',
      attendu: '4',
    });
  });

  it('écrit les textes, les réels et les caractères comme dans le code', async () => {
    const resultat = await c.verifierAvecTests(CODE, TESTS);
    const parNom = Object.fromEntries(resultat.tests.map((test) => [test.nom, test]));
    assert.equal(parNom['le texte'].obtenu, '"bonjour\\n"');
    assert.equal(parNom['le texte'].attendu, '"bonjour"');
    assert.equal(parNom['le texte exact'].reussi, true);
    assert.equal(parNom['le réel'].attendu, '0.30000000000000004');
    assert.equal(parNom['la lettre'].obtenu, "'z'");
    assert.equal(parNom['la lettre'].attendu, "'a'");
  });

  it('garde la condition écrite quand il n’y a pas de valeurs à comparer', async () => {
    const resultat = await c.verifierAvecTests(CODE, TESTS);
    const test = resultat.tests.find((entree) => entree.nom === 'condition composée');
    assert.equal(test.condition, 'x == 3 && x > 0');
    assert.equal(test.obtenu, undefined);
    assert.doesNotMatch(resultat.sortie, /@TEST/);
  });

  it('compte les blocs oubliés dans VERIFIER_SANS_FUITE', async () => {
    const resultat = await c.verifierAvecTests(
      '#include <stdlib.h>\nint main(void) { return 0; }\n',
      'int main(void) {\n    int *p = malloc(4);\n    (void)p;\n    VERIFIER_SANS_FUITE();\n    return BILAN();\n}\n',
    );
    assert.equal(resultat.tests[0].obtenu, '1');
    assert.equal(resultat.tests[0].attendu, '0');
  });
});
