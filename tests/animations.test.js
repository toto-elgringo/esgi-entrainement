import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { dureeLisible, FONCTIONS_CROISSANCE, repereDuree } from '../js/animations/combinatoire.js';
import { ANIMATIONS, lireBloc } from '../js/animations/index.js';
import { aleatoire, echelle } from '../js/animations/outils.js';

describe('blocs d’animation du cours', () => {
  it('lit le nom de l’animation', () => {
    assert.deepEqual(lireBloc('croissance\n'), { nom: 'croissance', options: {} });
  });

  it('lit les options en nombres, booléens et textes', () => {
    assert.deepEqual(lireBloc('croissance\r\nn: 12\nauto: oui\ntitre: La course : épisode 2\n'), {
      nom: 'croissance',
      options: { n: 12, auto: true, titre: 'La course : épisode 2' },
    });
  });

  it('ignore les lignes vides et sans deux-points', () => {
    assert.deepEqual(lireBloc('\n  croissance  \n\nbizarre\n'), { nom: 'croissance', options: {} });
  });

  it('chaque animation a un titre et une fonction de création', () => {
    for (const [nom, animation] of Object.entries(ANIMATIONS)) {
      assert.equal(typeof animation.titre, 'string', nom);
      assert.equal(typeof animation.creer, 'function', nom);
    }
  });
});

describe('outils des animations', () => {
  it('le hasard avec graine est reproductible', () => {
    const a = aleatoire(42);
    const b = aleatoire(42);
    const tirages = [a(), a(), a()];
    assert.deepEqual(tirages, [b(), b(), b()]);
    assert.ok(tirages.every((valeur) => valeur >= 0 && valeur < 1));
  });

  it('une échelle convertit dans les deux sens', () => {
    const versX = echelle([0, 10], [100, 200]);
    assert.equal(versX(5), 150);
    assert.equal(versX.inverse(150), 5);
  });
});

describe('course des complexités', () => {
  const valeur = (cle, n) => FONCTIONS_CROISSANCE.find((fonction) => fonction.cle === cle).calculer(n);

  it('calcule les coûts à n = 10', () => {
    assert.equal(valeur('n2', 10), 100);
    assert.equal(valeur('2n', 10), 1024);
    assert.equal(valeur('fact', 10), 3628800);
  });

  it('écrit une durée dans la bonne unité', () => {
    assert.equal(dureeLisible(4e-7), '400 ns');
    assert.equal(dureeLisible(0.0012), '1,2 ms');
    assert.equal(dureeLisible(120), '2 min');
    assert.equal(dureeLisible(20 * 3.15e7), '20 ans');
  });

  it('compare une durée à un repère parlant', () => {
    assert.equal(repereDuree(1e-6), 'instantané');
    assert.equal(repereDuree(2.4e9), 'plus d’un an');
    assert.equal(repereDuree(1e20), 'plus que l’âge de l’Univers');
  });
});
