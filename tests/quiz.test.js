import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compterBonnes, estTerminee, nouvellePartie, partieValide } from '../js/vues/quiz.js';

const questions = [
  { choix: ['a', 'b', 'c'], reponse: 2 },
  { choix: ['vrai', 'faux'], reponse: 0 },
];

describe('partie de quiz', () => {
  it('mélange les choix de chaque question sans en perdre', () => {
    const partie = nouvellePartie(questions);
    assert.deepEqual(partie.reponses, {});
    assert.deepEqual([...partie.ordres[0]].sort(), [0, 1, 2]);
    assert.deepEqual([...partie.ordres[1]].sort(), [0, 1]);
  });

  it('refuse une partie qui ne correspond plus aux questions', () => {
    assert.equal(partieValide(nouvellePartie(questions), questions), true);
    assert.equal(partieValide(null, questions), false);
    assert.equal(partieValide({ ordres: [[0, 1, 2]], reponses: {} }, questions), false);
    assert.equal(partieValide({ ordres: [[0, 1], [0, 1]], reponses: {} }, questions), false);
  });

  it('compte les bonnes réponses et sait quand tout est répondu', () => {
    const partie = { ordres: [[0, 1, 2], [1, 0]], reponses: { 0: 2 } };
    assert.equal(compterBonnes(partie, questions), 1);
    assert.equal(estTerminee(partie, questions), false);
    partie.reponses[1] = 1;
    assert.equal(compterBonnes(partie, questions), 1);
    assert.equal(estTerminee(partie, questions), true);
  });

  it('ne considère jamais un quiz vide comme terminé', () => {
    assert.equal(estTerminee({ ordres: [], reponses: {} }, []), false);
  });
});
