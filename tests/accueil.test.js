import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DOMAINES_CODE, langageDe } from '../js/domaines.js';
import { ALERTES_OUTILS, carteMatiere, rendreEtatOutils, texteTaille } from '../js/vues/accueil.js';

describe('état des outils', () => {
  it('chaque domaine de code a une alerte d’outil', () => {
    for (const domaine of Object.keys(DOMAINES_CODE)) assert.equal(typeof ALERTES_OUTILS[langageDe(domaine)], 'function', domaine);
  });

  it('ne dit rien quand l’outil est là', () => {
    assert.equal(rendreEtatOutils({ cargo: 'cargo 1.80', clippy: 'clippy 0.1' }, 'rust'), '');
    assert.equal(rendreEtatOutils({ python: 'Python 3.12' }, 'python'), '');
  });

  it('donne la bonne commande pour installer gcc et propose de revérifier', () => {
    const html = rendreEtatOutils({ gcc: null }, 'c');
    assert.match(html, /winget install BrechtSanders\.WinLibs\.POSIX\.UCRT/);
    assert.match(html, /Revérifier les outils/);
  });

  it('prévient quand le serveur ne répond pas', () => {
    assert.match(rendreEtatOutils(null, 'python'), /serveur local ne répond pas/);
  });
});

describe('place utilisée', () => {
  it('s’affiche en Ko puis en Mo', () => {
    assert.equal(texteTaille(10), '1 Ko');
    assert.equal(texteTaille(200 * 1024), '200 Ko');
    assert.equal(texteTaille(2.5 * 1024 * 1024), '2,5 Mo');
  });
});

describe('carte d’une matière', () => {
  const chapitres = [{ cle: 'rust/01-a', matieres: ['rust'], exercices: [{ id: 'x' }, { id: 'y' }] }];

  it('montre une barre de progression remplie selon les exercices réussis', () => {
    const html = carteMatiere({ id: 'rust', titre: 'Rust' }, chapitres, { exercices: { 'rust/01-a/x': { reussi: true } }, quiz: {} });
    assert.match(html, /1 \/ 2 exercices réussis/);
    assert.match(html, /class="barre-remplie" style="width: 50%"/);
  });

  it('passe la barre en vert quand tout est réussi', () => {
    const progression = { exercices: { 'rust/01-a/x': { reussi: true }, 'rust/01-a/y': { reussi: true } }, quiz: {} };
    assert.match(carteMatiere({ id: 'rust', titre: 'Rust' }, chapitres, progression), /barre-remplie complete" style="width: 100%"/);
  });
});
