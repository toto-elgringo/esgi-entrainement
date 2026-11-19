import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DOMAINES_CODE, langageDe } from '../js/domaines.js';
import { ALERTES_OUTILS, rendreEtatOutils, texteTaille } from '../js/vues/accueil.js';

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
