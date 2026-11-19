import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { creerBascule, creerIndices, etoiles, lienVoisin, navigationExercices } from '../js/exercice-commun.js';

const fauxBouton = () => ({ textContent: '', hidden: false });
const fausseZone = (hidden = false) => ({
  html: '',
  hidden,
  insertAdjacentHTML(_, morceau) {
    this.html += morceau;
  },
});

describe('affichage commun des exercices', () => {
  it('dessine la difficulté en ronds pleins et vides', () => {
    assert.match(etoiles(2), /●●○/);
    assert.match(etoiles(2), /Difficulté 2 sur 3/);
  });

  it('fait un lien vers l’exercice voisin, échappé', () => {
    const exercice = { chapitreCle: 'rust/01-bases', id: '02-b', titre: '<b>Suite</b>' };
    assert.equal(lienVoisin(null, 'suivant'), '<span></span>');
    assert.match(lienVoisin(exercice, 'suivant'), /href="#\/exercice\/rust\/01-bases\/02-b"/);
    assert.match(lienVoisin(exercice, 'suivant'), /&lt;b&gt;Suite&lt;\/b&gt; →/);
    assert.match(lienVoisin(exercice, 'precedent'), /← &lt;b&gt;/);
    assert.match(navigationExercices(null, exercice), /^<nav class="navigation-exercices"/);
  });
});

describe('indices', () => {
  const creer = (auChangement = () => {}) => {
    const bouton = fauxBouton();
    const zone = fausseZone();
    const indices = creerIndices({ bouton, zone, indices: ['un', 'deux', 'trois'], rendre: (texte) => texte.toUpperCase(), auChangement });
    return { bouton, zone, indices };
  };

  it('affiche les indices un par un et enregistre leur nombre', () => {
    const auChangement = mock.fn();
    const { bouton, zone, indices } = creer(auChangement);
    assert.equal(bouton.textContent, 'Afficher un indice (0 / 3)');
    indices.afficher();
    assert.match(zone.html, /UN/);
    assert.equal(bouton.textContent, 'Afficher un indice (1 / 3)');
    assert.deepEqual(auChangement.mock.calls.map((appel) => appel.arguments[0]), [1]);
  });

  it('cache le bouton quand tout est affiché', () => {
    const { bouton, indices } = creer();
    indices.afficher();
    indices.afficher();
    indices.afficher();
    indices.afficher();
    assert.equal(bouton.hidden, true);
    assert.equal(indices.nombre(), 3);
  });

  it('réaffiche les indices déjà vus sans enregistrer à chaque tour', () => {
    const auChangement = mock.fn();
    const { zone, indices } = creer(auChangement);
    indices.restaurer(2);
    assert.match(zone.html, /UN.*DEUX/s);
    assert.doesNotMatch(zone.html, /TROIS/);
    assert.equal(auChangement.mock.callCount(), 0);
    indices.restaurer(10);
    assert.equal(indices.nombre(), 3);
  });
});

describe('bascule de la solution', () => {
  const creer = ({ reussi = false, confirme = true, montrer = async () => true } = {}) => {
    const bouton = fauxBouton();
    const zone = fausseZone(true);
    const auChangement = mock.fn();
    const confirmer = mock.fn(() => confirme);
    const bascule = creerBascule({
      bouton,
      zone,
      libelleVoir: 'Voir la solution',
      libelleMasquer: 'Masquer la solution',
      confirmation: 'Sûr ?',
      estReussi: () => reussi,
      montrer,
      auChangement,
      confirmer,
    });
    return { bouton, zone, auChangement, confirmer, bascule };
  };

  it('demande confirmation tant que l’exercice n’est pas réussi', async () => {
    const { zone, confirmer, auChangement, bascule } = creer({ confirme: false });
    await bascule.basculer();
    assert.equal(confirmer.mock.callCount(), 1);
    assert.equal(zone.hidden, true);
    assert.equal(auChangement.mock.callCount(), 0);
  });

  it('ouvre sans confirmation après une réussite, puis referme', async () => {
    const { bouton, zone, confirmer, auChangement, bascule } = creer({ reussi: true });
    await bascule.basculer();
    assert.equal(confirmer.mock.callCount(), 0);
    assert.equal(zone.hidden, false);
    assert.equal(bouton.textContent, 'Masquer la solution');
    await bascule.basculer();
    assert.equal(zone.hidden, true);
    assert.equal(bouton.textContent, 'Voir la solution');
    assert.deepEqual(auChangement.mock.calls.map((appel) => appel.arguments[0]), [true, false]);
  });

  it('reste fermée si la solution n’a pas pu être chargée', async () => {
    const { zone, auChangement, bascule } = creer({ reussi: true, montrer: async () => false });
    await bascule.basculer();
    assert.equal(zone.hidden, true);
    assert.equal(auChangement.mock.callCount(), 0);
  });
});
