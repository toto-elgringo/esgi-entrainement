import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validerExercice, validerMetaChapitre, validerQuiz } from '../serveur/validation-rust.js';

const exerciceValide = {
  titre: 'Le double',
  type: 'tests',
  difficulte: 1,
  indices: [],
  enonce: 'Écris double.',
  depart: 'fn main() {}',
  solution: 'fn main() {}',
  tests: 'mod tests {}',
  sortieAttendue: null,
};

describe('validation', () => {
  it('accepte un chapitre bien formé', () => {
    assert.deepEqual(validerMetaChapitre({ titre: 'Bases', source: 'cours' }), []);
  });

  it('refuse un chapitre sans titre ou avec une source inconnue', () => {
    assert.equal(validerMetaChapitre(null).length, 1);
    assert.equal(validerMetaChapitre({ titre: '', source: 'autre' }).length, 2);
  });

  it('vérifie l’indice de la bonne réponse du quiz', () => {
    const quiz = [{ question: 'Q ?', choix: ['a', 'b'], reponse: 2, explication: 'E' }];
    assert.match(validerQuiz(quiz)[0], /reponse/);
    assert.deepEqual(validerQuiz([{ ...quiz[0], reponse: 1 }]), []);
    assert.equal(validerQuiz({}).length, 1);
  });

  it('accepte un exercice bien formé', () => {
    assert.deepEqual(validerExercice(exerciceValide), []);
  });

  it('exige une fonction main et les tests', () => {
    const problemes = validerExercice({ ...exerciceValide, depart: 'fn autre() {}', tests: '' });
    assert.equal(problemes.length, 2);
  });

  it('exige sortie.txt pour un exercice de type sortie', () => {
    const problemes = validerExercice({ ...exerciceValide, type: 'sortie', tests: null });
    assert.deepEqual(problemes, ['sortie.txt manquant']);
  });
});
