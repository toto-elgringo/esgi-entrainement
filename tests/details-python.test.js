import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as python from '../serveur/python.js';

const { python: version } = await python.outilsPython();
const sansPython = version ? false : 'Python 3 n’est pas installé';

const CODE = 'def double(x):\n    return x + 1\n\n\ndef trier(l):\n    l.sort()\n    return l\n\n\ndef boom():\n    return 1 / 0\n';
const TESTS = [
  'def test_valeur():',
  '    assert double(2) == 4, "double(2) doit valoir 4"',
  '',
  'def test_valeur_attendue_a_gauche():',
  '    assert 10 == double(2)',
  '',
  'def test_liste_modifiee():',
  '    liste = [3, 1, 2]',
  '    assert trier(liste) == [1, 2, 4]',
  '',
  'def test_condition():',
  '    assert double(1) > 5, "trop petit"',
  '',
  'def test_reussi():',
  '    assert double(1) == 2',
  '',
  'def test_erreur():',
  '    assert boom() == 1',
  '',
].join('\n');

describe('python : détail des tests ratés', { skip: sansPython }, () => {
  it('donne l’appel, la valeur obtenue et la valeur attendue', async () => {
    const resultat = await python.verifierAvecTests(CODE, TESTS);
    const parNom = Object.fromEntries(resultat.tests.map((test) => [test.nom, test]));
    assert.deepEqual(parNom.valeur, {
      nom: 'valeur',
      reussi: false,
      indice: 'double(2) doit valoir 4',
      appel: 'double(2)',
      obtenu: '3',
      attendu: '4',
    });
    assert.equal(parNom.valeur_attendue_a_gauche.appel, 'double(2)');
    assert.equal(parNom.valeur_attendue_a_gauche.attendu, '10');
  });

  it('montre la valeur réellement obtenue, même si la fonction modifie son argument', async () => {
    const resultat = await python.verifierAvecTests(CODE, TESTS);
    const test = resultat.tests.find((entree) => entree.nom === 'liste_modifiee');
    assert.equal(test.obtenu, '[1, 2, 3]');
    assert.equal(test.attendu, '[1, 2, 4]');
  });

  it('donne la condition quand ce n’est pas une égalité, et l’erreur d’un plantage', async () => {
    const resultat = await python.verifierAvecTests(CODE, TESTS);
    assert.equal(resultat.tests.find((test) => test.nom === 'condition').condition, 'double(1) > 5');
    assert.match(resultat.tests.find((test) => test.nom === 'erreur').erreur, /ZeroDivisionError/);
    assert.deepEqual(resultat.tests.find((test) => test.nom === 'reussi'), { nom: 'reussi', reussi: true });
  });

  it('retire les lignes techniques de la sortie', async () => {
    const resultat = await python.verifierAvecTests(CODE, TESTS);
    assert.doesNotMatch(resultat.sortie, /@TEST/);
    assert.match(resultat.sortie, /✗ test_valeur : double\(2\) doit valoir 4/);
  });
});
