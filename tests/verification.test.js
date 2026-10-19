import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { decouperListe, lireSaisie, normaliserTexte, verifierQuestion } from '../js/maths/verification.js';

const juste = (question, saisie) => verifierQuestion(question, saisie).juste;

describe('vérification des réponses', () => {
  it('compare des nombres exacts ou approchés', () => {
    const exacte = { type: 'nombre', reponse: '(1+ln(7))/2' };
    assert.equal(juste(exacte, '(1 + ln 7) / 2'), true);
    assert.equal(juste(exacte, '1.47'), false);
    const approchee = { type: 'nombre', reponse: '2000(e^1.5-1)', tolerance: 1 };
    assert.equal(juste(approchee, '6963'), true);
    assert.equal(juste(approchee, '6970'), false);
  });

  it('refuse une variable dans une réponse numérique', () => {
    const resultat = verifierQuestion({ type: 'nombre', reponse: 3 }, 'x + 1');
    assert.equal(resultat.juste, false);
    assert.match(resultat.erreur, /doit être un nombre/);
  });

  it('accepte toutes les écritures équivalentes d’une expression', () => {
    const derivee = { type: 'expression', reponse: '15x^2-4x+1' };
    assert.equal(juste(derivee, '1 - 4x + 15x²'), true);
    assert.equal(juste(derivee, 'x(15x-4)+1'), true);
    assert.equal(juste(derivee, '15x^2-4x'), false);
  });

  it('accepte une primitive à une constante près', () => {
    const primitive = { type: 'expression', reponse: '2x^3', aUneConstantePres: true };
    assert.equal(juste(primitive, '2x^3 + 7'), true);
    assert.equal(juste(primitive, '6x^2'), false);
  });

  it('utilise des entiers pour la variable n', () => {
    assert.equal(juste({ type: 'expression', reponse: 'n(n+1)/2', variable: 'n' }, '(n^2+n)/2'), true);
  });

  it('compare des ensembles sans tenir compte de l’ordre', () => {
    const ensemble = { type: 'ensemble', reponse: [3, 4] };
    assert.equal(juste(ensemble, '{4, 3}'), true);
    assert.equal(juste(ensemble, '{3}'), false);
    assert.equal(juste({ type: 'ensemble', reponse: [] }, '∅'), true);
    assert.equal(juste({ type: 'ensemble', reponse: ['a', 'b'] }, '{B, A}'), true);
    assert.equal(juste({ type: 'ensemble', reponse: ['A', 'B', 'E'] }, '{a, b, e}'), true);
    assert.equal(juste({ type: 'vecteur', reponse: ['E', 'D'] }, '(e, d)'), true);
    assert.equal(juste({ type: 'ensemble', reponse: [0.5, 'e'] }, '{1/2, E}'), true);
    assert.equal(juste({ type: 'ensemble', reponse: ['A', 'B'] }, '{a, e}'), false);
  });

  it('compare des vecteurs dans l’ordre', () => {
    const vecteur = { type: 'vecteur', reponse: [2, 3, -5] };
    assert.equal(juste(vecteur, '(2, 3, -5)'), true);
    assert.equal(juste(vecteur, '(2,5 ; 3 ; -5)'), false);
    assert.equal(juste(vecteur, '(3, 2, -5)'), false);
  });

  it('gère les choix, les textes et les réponses auto-évaluées', () => {
    assert.equal(juste({ type: 'choix', choix: ['a', 'b'], reponse: 1 }, '1'), true);
    assert.equal(juste({ type: 'texte', reponse: ['Intersect'] }, '  INTERSECT '), true);
    assert.equal(juste({ type: 'auto', reponse: 'modèle' }, 'peu importe'), null);
  });

  it('signale une réponse vide', () => {
    assert.deepEqual(verifierQuestion({ type: 'nombre', reponse: 1 }, '  '), { juste: false, erreur: 'Réponse vide' });
  });

  it('découpe les listes avec virgules ou points-virgules', () => {
    assert.deepEqual(decouperListe('{1, 2, 3}'), ['1', '2', '3']);
    assert.deepEqual(decouperListe('(2,5 ; 3)'), ['2,5', '3']);
    assert.deepEqual(decouperListe('{}'), []);
  });

  it('normalise les textes', () => {
    assert.equal(normaliserTexte('  Équivalence. '), 'equivalence');
  });

  it('lit une saisie pour l’aperçu', () => {
    assert.ok(lireSaisie({ type: 'expression' }, '3x^2'));
    assert.equal(lireSaisie({ type: 'expression' }, '3x^'), null);
    assert.equal(lireSaisie({ type: 'ensemble' }, '{1}'), null);
  });
});
