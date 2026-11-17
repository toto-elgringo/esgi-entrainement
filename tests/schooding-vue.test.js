import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rendreEtatMyges, rendreEtatSchooding } from '../js/vues/myges.js';

const base = { etape: 'repos', total: 0, avance: 0, dejaPresents: 0, telecharges: [], rates: [], matieresCreees: [], notes: [], lignes: [], bilan: null, erreur: null };

describe('encadré Schooding', () => {
  it('a son propre bouton, séparé de MyGES', () => {
    const html = rendreEtatSchooding(base);
    assert.match(html, /<strong>Schooding<\/strong>/);
    assert.match(html, /Télécharger depuis Schooding/);
    assert.match(html, /data-schooding-action="lancer"/);
    assert.doesNotMatch(html, /data-myges-action/);
    assert.doesNotMatch(rendreEtatMyges(base), /data-schooding-action/);
  });

  it('montre l’avancement et les étapes', () => {
    assert.match(rendreEtatSchooding({ ...base, etape: 'connexion' }), /Connexion à Schooding…/);
    assert.match(rendreEtatSchooding({ ...base, etape: 'liste' }), /Lecture des cours et des séances…/);
    assert.match(rendreEtatSchooding({ ...base, etape: 'telechargement', total: 177, avance: 12 }), /Téléchargement… 12 \/ 177/);
  });

  it('donne le bilan avec les remarques', () => {
    const html = rendreEtatSchooding({ ...base, etape: 'terminee', bilan: 'Bilan', telecharges: ['a', 'b'], notes: ['3 séances encore verrouillées'] });
    assert.match(html, /2 éléments nouveaux ou mis à jour/);
    assert.match(html, /3 séances encore verrouillées/);
    assert.match(rendreEtatSchooding({ ...base, etape: 'terminee', bilan: 'Aucun nouveau cours', notes: ['1 vidéo gardée en lien'] }), /1 vidéo gardée en lien/);
  });

  it('explique les erreurs propres à Schooding', () => {
    assert.match(rendreEtatSchooding({ ...base, etape: 'erreur', erreur: { code: 'identifiants_manquants', message: 'x' } }), /SCHOODING_IDENTIFIANT/);
    assert.match(rendreEtatSchooding({ ...base, etape: 'erreur', erreur: { code: 'identifiants_refuses', message: 'x' } }), /login Schooding/);
    assert.match(rendreEtatSchooding({ ...base, etape: 'erreur', erreur: { code: 'trop_de_requetes', message: 'x' } }), /limite le nombre de requêtes/);
    assert.match(rendreEtatSchooding({ ...base, etape: 'erreur', erreur: { code: 'claude_echec', message: 'x' } }), /Claude n’a pas fini/);
  });
});
