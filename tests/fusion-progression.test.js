import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PARTIES, progressionVide, changementValide, appliquerChangement } from '../js/fusion-progression.js';

const etatVide = () => ({ progression: progressionVide(), dates: {}, supprimes: {} });

describe('fusion de la progression', () => {
  it('liste les six parties', () => {
    assert.deepEqual(PARTIES, ['exercices', 'quiz', 'saisies', 'codes', 'partiesQuiz', 'affichages']);
    assert.deepEqual(progressionVide(), { exercices: {}, quiz: {}, saisies: {}, codes: {}, partiesQuiz: {}, affichages: {} });
  });

  it('supprime la clé et note la remise à zéro', () => {
    const etat = etatVide();
    etat.progression.exercices['rust/01/a'] = { essais: 2, reussi: false };
    const resultat = appliquerChangement(etat, { partie: 'exercices', cle: 'rust/01/a', valeur: null, faitLe: 10 });
    assert.equal(resultat.retenu, true);
    assert.equal(resultat.valeur, null);
    assert.equal('rust/01/a' in etat.progression.exercices, false);
    assert.equal(etat.supprimes['exercices/rust/01/a'], 10);
  });

  it("ignore un changement plus ancien qu'une remise à zéro", () => {
    const etat = etatVide();
    appliquerChangement(etat, { partie: 'exercices', cle: 'rust/01/a', valeur: null, faitLe: 10 });
    const ancien = appliquerChangement(etat, { partie: 'exercices', cle: 'rust/01/a', valeur: { essais: 6, reussi: true }, faitLe: 5 });
    assert.equal(ancien.retenu, false);
    assert.equal(ancien.valeur, null);
    assert.equal('rust/01/a' in etat.progression.exercices, false);
    const recent = appliquerChangement(etat, { partie: 'exercices', cle: 'rust/01/a', valeur: { essais: 6, reussi: true }, faitLe: 11 });
    assert.equal(recent.retenu, true);
    assert.deepEqual(etat.progression.exercices['rust/01/a'], { essais: 6, reussi: true });
    assert.equal(etat.supprimes['exercices/rust/01/a'], 10);
  });

  it("exercices : garde le plus grand nombre d'essais et la réussite", () => {
    const etat = etatVide();
    etat.progression.exercices.a = { essais: 3, reussi: true };
    const resultat = appliquerChangement(etat, { partie: 'exercices', cle: 'a', valeur: { essais: 2, reussi: false }, faitLe: 50 });
    assert.deepEqual(resultat.valeur, { essais: 3, reussi: true });
    assert.deepEqual(etat.progression.exercices.a, { essais: 3, reussi: true });
    assert.equal(etat.dates['exercices/a'], 50);
  });

  it('renvoyer deux fois ne change rien', () => {
    const etat = etatVide();
    const changement = { partie: 'exercices', cle: 'a', valeur: { essais: 4, reussi: false }, faitLe: 7 };
    appliquerChangement(etat, changement);
    appliquerChangement(etat, changement);
    assert.deepEqual(etat.progression.exercices.a, { essais: 4, reussi: false });
  });

  it('quiz : garde le meilleur rapport', () => {
    const etat = etatVide();
    etat.progression.quiz.c = { score: 3, total: 5 };
    const moins = appliquerChangement(etat, { partie: 'quiz', cle: 'c', valeur: { score: 4, total: 10 }, faitLe: 1 });
    assert.equal(moins.retenu, true);
    assert.deepEqual(moins.valeur, { score: 3, total: 5 });
    assert.deepEqual(etat.progression.quiz.c, { score: 3, total: 5 });
    const mieux = appliquerChangement(etat, { partie: 'quiz', cle: 'c', valeur: { score: 5, total: 5 }, faitLe: 2 });
    assert.equal(mieux.retenu, true);
    assert.deepEqual(mieux.valeur, { score: 5, total: 5 });
    assert.deepEqual(etat.progression.quiz.c, { score: 5, total: 5 });
  });

  it('autres parties : le plus récent gagne', () => {
    const etat = etatVide();
    etat.progression.codes.x = 'ancien';
    etat.dates['codes/x'] = 20;
    const vieux = appliquerChangement(etat, { partie: 'codes', cle: 'x', valeur: 'vieux', faitLe: 15 });
    assert.equal(vieux.retenu, false);
    assert.equal(vieux.valeur, 'ancien');
    assert.equal(etat.progression.codes.x, 'ancien');
    const neuf = appliquerChangement(etat, { partie: 'codes', cle: 'x', valeur: 'neuf', faitLe: 25 });
    assert.equal(neuf.retenu, true);
    assert.equal(etat.progression.codes.x, 'neuf');
    assert.equal(etat.dates['codes/x'], 25);
  });

  it('changementValide refuse ce qui est faux', () => {
    const bon = { partie: 'codes', cle: 'x', valeur: 'a', faitLe: 1 };
    assert.equal(changementValide(bon), true);
    assert.equal(changementValide({ ...bon, valeur: null }), true);
    assert.equal(changementValide({ ...bon, partie: 'theme' }), false);
    assert.equal(changementValide({ ...bon, partie: 'matiere' }), false);
    assert.equal(changementValide({ ...bon, cle: '__proto__' }), false);
    assert.equal(changementValide({ ...bon, cle: 'constructor' }), false);
    assert.equal(changementValide({ ...bon, cle: 'prototype' }), false);
    assert.equal(changementValide({ ...bon, cle: '' }), false);
    assert.equal(changementValide({ partie: 'codes', cle: 'x', valeur: 'a' }), false);
    assert.equal(changementValide({ ...bon, faitLe: Infinity }), false);
    assert.equal(changementValide(null), false);
  });

  it('refuse un ancien changement rejoué après une remise à zéro suivie d’une nouvelle valeur', () => {
    const etat = etatVide();
    appliquerChangement(etat, { partie: 'exercices', cle: 'a', valeur: null, faitLe: 10 });
    appliquerChangement(etat, { partie: 'exercices', cle: 'a', valeur: { essais: 1, reussi: false }, faitLe: 11 });
    const rejoue = appliquerChangement(etat, { partie: 'exercices', cle: 'a', valeur: { essais: 9, reussi: true }, faitLe: 5 });
    assert.equal(rejoue.retenu, false);
    assert.deepEqual(rejoue.valeur, { essais: 1, reussi: false });
    assert.deepEqual(etat.progression.exercices.a, { essais: 1, reussi: false });
    assert.equal(etat.supprimes['exercices/a'], 10);
  });

  it('une remise à zéro plus récente met à jour la date de suppression', () => {
    const etat = etatVide();
    appliquerChangement(etat, { partie: 'codes', cle: 'x', valeur: null, faitLe: 10 });
    appliquerChangement(etat, { partie: 'codes', cle: 'x', valeur: 'a', faitLe: 11 });
    appliquerChangement(etat, { partie: 'codes', cle: 'x', valeur: null, faitLe: 20 });
    assert.equal(etat.supprimes['codes/x'], 20);
    assert.equal('x' in etat.progression.codes, false);
  });

  it('changementValide contrôle le contenu des exercices et des quiz', () => {
    const exo = (valeur) => ({ partie: 'exercices', cle: 'a', valeur, faitLe: 1 });
    const quiz = (valeur) => ({ partie: 'quiz', cle: 'a', valeur, faitLe: 1 });
    assert.equal(changementValide(exo({ essais: 0, reussi: false })), true);
    assert.equal(changementValide(exo({ essais: 'abc', reussi: false })), false);
    assert.equal(changementValide(exo({ essais: -1, reussi: false })), false);
    assert.equal(changementValide(exo({ essais: 1.5, reussi: false })), false);
    assert.equal(changementValide(exo({ essais: 1, reussi: 'oui' })), false);
    assert.equal(changementValide(exo('texte')), false);
    assert.equal(changementValide(exo([])), false);
    assert.equal(changementValide(exo(undefined)), false);
    assert.equal(changementValide(quiz({ score: 3, total: 5 })), true);
    assert.equal(changementValide(quiz({})), false);
    assert.equal(changementValide(quiz({ score: 0, total: 0 })), false);
    assert.equal(changementValide(quiz({ score: 6, total: 5 })), false);
    assert.equal(changementValide(quiz({ score: -1, total: 5 })), false);
    assert.equal(changementValide(quiz({ score: 1, total: 2.5 })), false);
    assert.equal(changementValide(quiz('texte')), false);
    assert.equal(changementValide(quiz([])), false);
    assert.equal(changementValide(quiz(null)), true);
    assert.equal(changementValide({ partie: 'codes', cle: 'x', valeur: undefined, faitLe: 1 }), false);
  });
});
