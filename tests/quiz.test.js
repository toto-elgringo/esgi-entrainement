import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compterBonnes, estTerminee, nouvellePartie, partieValide, peutReinitialiser, questionsDeLaPartie, questionsRatees, texteCompteur } from '../js/vues/quiz.js';

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

describe('compteur et questions ratées', () => {
  const quatre = [
    { choix: ['a', 'b'], reponse: 0 },
    { choix: ['a', 'b'], reponse: 1 },
    { choix: ['a', 'b'], reponse: 0 },
    { choix: ['a', 'b'], reponse: 1 },
  ];

  it('affiche la question en cours et le nombre de bonnes réponses', () => {
    const partie = { ordres: quatre.map(() => [0, 1]), reponses: {} };
    assert.equal(texteCompteur(partie, quatre), 'Question 1 / 4 · 0 bonne');
    partie.reponses = { 0: 0, 1: 0, 2: 0 };
    assert.equal(texteCompteur(partie, quatre), 'Question 4 / 4 · 2 bonnes');
  });

  it('repère les questions ratées', () => {
    const partie = { ordres: quatre.map(() => [0, 1]), reponses: { 0: 0, 1: 0, 2: 0, 3: 0 } };
    assert.deepEqual(questionsRatees(partie, quatre), [1, 3]);
  });

  it('refait seulement les questions ratées, en gardant le format des parties', () => {
    const partie = nouvellePartie(quatre, [1, 3]);
    assert.deepEqual(partie.selection, [1, 3]);
    assert.equal(partieValide(partie, quatre), true);
    assert.deepEqual(questionsDeLaPartie(partie, quatre), [1, 3]);
    assert.equal(texteCompteur(partie, quatre), 'Question 1 / 2 · 0 bonne');
    partie.reponses = { 1: 1 };
    assert.equal(estTerminee(partie, quatre), false);
    partie.reponses[3] = 1;
    assert.equal(estTerminee(partie, quatre), true);
    assert.equal(compterBonnes(partie, quatre), 2);
    assert.deepEqual(questionsRatees(partie, quatre), []);
  });

  it('reprend une ancienne partie sans sélection et refuse une sélection invalide', () => {
    assert.deepEqual(questionsDeLaPartie({ ordres: [], reponses: {} }, quatre), [0, 1, 2, 3]);
    const partie = nouvellePartie(quatre);
    assert.equal(partieValide({ ...partie, selection: [7] }, quatre), false);
    assert.equal(partieValide({ ...partie, selection: [] }, quatre), false);
  });

  it('propose de réinitialiser dès qu’une réponse est donnée ou en revue des ratées', () => {
    const partie = nouvellePartie(questions);
    assert.equal(peutReinitialiser(partie), false);
    partie.reponses[0] = 1;
    assert.equal(peutReinitialiser(partie), true);
    assert.equal(peutReinitialiser(nouvellePartie(questions, [0])), true);
    assert.equal(peutReinitialiser(null), false);
  });
});
