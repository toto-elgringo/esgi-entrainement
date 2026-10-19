import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as c from '../serveur/c.js';
import { C_DEPART, C_SOLUTION, C_TESTS } from './aide.js';

const { gcc } = await c.outilsC();
const sansGcc = gcc ? false : 'gcc n’est pas installé';

describe('c : fonctions pures', () => {
  it('renomme le main de l’élève et ajoute les tests après son code', () => {
    const source = c.assemblerCodeTest('int main(void) { return 0; }\n', 'int main(void) { return BILAN(); }');
    assert.match(source, /#define malloc[\s\S]*#define main main_eleve\n#line 1 "exercice\.c"\nint main\(void\)/);
    assert.match(source, /#undef main[\s\S]*#define VERIFIER[\s\S]*#line 1 "tests.c"\nint main\(void\) \{ return BILAN\(\); \}/);
  });

  it('explique les plantages connus', () => {
    assert.match(c.expliquerPlantage({ code: 3221225477, signal: null }), /segmentation/);
    assert.match(c.expliquerPlantage({ code: -1, signal: 'SIGSEGV' }), /segmentation/);
    assert.match(c.expliquerPlantage({ code: 3221225725, signal: null }), /pile/);
    assert.equal(c.expliquerPlantage({ code: 1, signal: null }), null);
  });
});

describe('c : compilation réelle avec gcc', { skip: sansGcc }, () => {
  it('réussit quand les vérifications passent', async () => {
    const resultat = await c.verifierAvecTests(C_SOLUTION, C_TESTS);
    assert.equal(resultat.statut, 'reussi', resultat.sortie);
    assert.deepEqual(resultat.resume, { reussis: 2, echoues: 0 });
  });

  it('échoue avec le message de la vérification ratée', async () => {
    const resultat = await c.verifierAvecTests(C_DEPART, C_TESTS);
    assert.equal(resultat.statut, 'echec');
    assert.deepEqual(resultat.resume, { reussis: 1, echoues: 1 });
    assert.match(resultat.sortie, /double_de\(2\) doit valoir 4/);
  });

  it('signale une erreur de compilation avec la bonne ligne', async () => {
    const resultat = await c.executerProgramme('#include <stdio.h>\n\nint main(void) {\n    printf("%d\\n", x);\n    return 0;\n}\n');
    assert.equal(resultat.statut, 'erreur_compilation');
    assert.match(resultat.sortie, /programme\.c.*4/);
  });

  it('indique la ligne de l’élève dans une erreur pendant les tests', async () => {
    const resultat = await c.verifierAvecTests('int double_de(int x) {\n    return y;\n}\n', C_TESTS);
    assert.equal(resultat.statut, 'erreur_compilation');
    assert.match(resultat.sortie, /exercice\.c.*2/);
  });

  it('repère une fuite mémoire dans les tests', async () => {
    const code = '#include <stdlib.h>\n\nint *creer(void) {\n    return malloc(sizeof(int));\n}\n';
    const tests = 'int main(void) {\n    int *a = creer();\n    int *b = creer();\n    free(a);\n    VERIFIER_SANS_FUITE();\n    free(b);\n    VERIFIER_SANS_FUITE();\n    return BILAN();\n}\n';
    const resultat = await c.verifierAvecTests(code, tests);
    assert.deepEqual(resultat.resume, { reussis: 1, echoues: 1 });
    assert.match(resultat.sortie, /mémoire allouée/);
  });

  it('ne signale pas un paramètre inutilisé dans le code de départ', async () => {
    const resultat = await c.executerProgramme('int f(int x) {\n    return 0;\n}\n\nint main(void) {\n    return f(1);\n}\n');
    assert.equal(resultat.statut, 'execute');
    assert.equal(resultat.avertissements.trim(), '');
  });

  it('donne les avertissements de gcc', async () => {
    const resultat = await c.executerProgramme('int main(void) {\n    int inutile = 3;\n    return 0;\n}\n');
    assert.equal(resultat.statut, 'execute');
    assert.match(resultat.avertissements, /unused variable/);
  });

  it('exécute un programme avec une entrée', async () => {
    const code = '#include <stdio.h>\n\nint main(void) {\n    int n = 0;\n    if (scanf("%d", &n) != 1) return 1;\n    printf("%d\\n", n * 3);\n    return 0;\n}\n';
    const resultat = await c.executerProgramme(code, '14\n');
    assert.equal(resultat.statut, 'execute');
    assert.equal(resultat.sortie.trim(), '42');
  });

  it('explique une erreur de segmentation et garde ce qui a été affiché avant', async () => {
    const code = '#include <stdio.h>\n\nint main(void) {\n    int *p = NULL;\n    printf("avant\\n");\n    *p = 1;\n    return 0;\n}\n';
    const resultat = await c.executerProgramme(code);
    assert.equal(resultat.statut, 'erreur_execution');
    assert.match(resultat.sortie, /avant/);
    assert.match(resultat.sortie, /segmentation/);
  });

  it('compare la sortie avec le texte attendu', async () => {
    const bon = await c.verifierSortie(C_SOLUTION, '42\n');
    const mauvais = await c.verifierSortie(C_DEPART, '42\n');
    assert.equal(bon.statut, 'reussi');
    assert.equal(mauvais.statut, 'echec');
  });
});
