import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { dollarsEquilibres, latexSain, validerChapitre, validerExercices, validerProgramme, validerQuiz } from '../js/maths/validation.js';

const exercice = {
  id: 'derivee',
  titre: 'Une dérivée',
  difficulte: 1,
  enonce: 'Dérive $f(x) = x^2$.',
  questions: [{ intitule: "$f'(x)$", type: 'expression', reponse: '2x', acceptes: ['x + x'], refuses: ['x^2'] }],
  indices: ['La dérivée de $x^n$ est $nx^{n-1}$.'],
  correction: "$f'(x) = 2x$.",
};

describe('validation du contenu', () => {
  it('accepte un programme bien formé et refuse les doublons', () => {
    const programme = { matieres: [{ id: 'info', titre: 'Info' }], chapitres: ['01-a', '02-b'] };
    assert.deepEqual(validerProgramme(programme), []);
    assert.equal(validerProgramme({ ...programme, chapitres: ['01-a', '01-a'] }).length, 1);
  });

  it('vérifie les matières d’un chapitre', () => {
    assert.deepEqual(validerChapitre({ titre: 'A', matieres: ['info'] }, ['info']), []);
    assert.equal(validerChapitre({ titre: 'A', matieres: ['autre'] }, ['info']).length, 1);
  });

  it('accepte un exercice correct', () => {
    assert.deepEqual(validerExercices([exercice]), []);
  });

  it('détecte une réponse de référence fausse et des exemples incohérents', () => {
    const casse = { ...exercice, questions: [{ type: 'expression', reponse: '2x', acceptes: ['3x'], refuses: ['2x'] }] };
    assert.equal(validerExercices([casse]).length, 2);
  });

  it('détecte les identifiants en double', () => {
    assert.match(validerExercices([exercice, exercice])[0], /double/);
  });

  it('détecte les formules cassées', () => {
    assert.equal(dollarsEquilibres('$x$ et $y'), false);
    assert.equal(latexSain('$\neq$'), false);
    assert.equal(latexSain('$\\neq$'), true);
    assert.equal(latexSain('$$\na\n$$'), true);
    assert.equal(latexSain('A $x$ b.\n- $y$ c'), true);
    assert.equal(latexSain('A $x\ny$'), false);
  });

  it('vérifie l’indice de la bonne réponse du quiz', () => {
    const quiz = [{ question: 'Q ?', choix: ['a', 'b'], reponse: 2, explication: 'E' }];
    assert.equal(validerQuiz(quiz).length, 1);
    assert.deepEqual(validerQuiz([{ ...quiz[0], reponse: 0 }]), []);
  });
});
