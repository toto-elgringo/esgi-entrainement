import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rendreEtatMyges } from '../js/vues/myges.js';

const base = { etape: 'repos', total: 0, dejaPresents: 0, telecharges: [], rates: [], matieresCreees: [], lignes: [], bilan: null, erreur: null };

describe('encadré MyGES', () => {
  it('propose de télécharger les nouveaux cours', () => {
    const html = rendreEtatMyges(base);
    assert.match(html, /Télécharger les nouveaux cours/);
    assert.match(html, /data-myges-action="lancer"/);
  });

  it('montre chaque étape avec un bouton pour arrêter', () => {
    assert.match(rendreEtatMyges({ ...base, etape: 'connexion' }), /Connexion à MyGES…/);
    assert.match(rendreEtatMyges({ ...base, etape: 'liste' }), /Recherche des nouveaux cours…/);
    const telechargement = rendreEtatMyges({ ...base, etape: 'telechargement', total: 4, telecharges: ['a', 'b'], rates: [{ nom: 'c', raison: 'x' }] });
    assert.match(telechargement, /Téléchargement… 3 \/ 4/);
    assert.match(telechargement, /data-myges-action="arreter"/);
  });

  it('montre le travail de Claude', () => {
    const html = rendreEtatMyges({ ...base, etape: 'claude', telecharges: ['Rust/Sources/<img>.pdf'], lignes: ['1', '2', '3', '4', '5', '6'] });
    assert.match(html, /Claude crée les notes et les exercices/);
    assert.match(html, /&lt;img&gt;\.pdf/);
    assert.doesNotMatch(html, /<img>/);
    assert.doesNotMatch(html, />1</);
    assert.match(html, />6</);
  });

  it('dit quand il n’y a aucun nouveau cours', () => {
    const html = rendreEtatMyges({ ...base, etape: 'terminee', bilan: 'Aucun nouveau cours', dejaPresents: 3 });
    assert.match(html, /Aucun nouveau cours/);
    assert.doesNotMatch(html, /Recharger le site/);
  });

  it('donne le bilan après le travail de Claude', () => {
    const html = rendreEtatMyges({ ...base, etape: 'terminee', bilan: 'Bilan : 2 notes', telecharges: ['a', 'b'], matieresCreees: ['SIG'], rates: [{ nom: 'Rust / x', raison: 'MyGES répond 404.' }] });
    assert.match(html, /2 nouveaux cours/);
    assert.match(html, /Bilan : 2 notes/);
    assert.match(html, /Nouvelle matière : SIG/);
    assert.match(html, /Rust \/ x/);
    assert.match(html, /Recharger le site/);
  });

  it('explique les erreurs', () => {
    assert.match(rendreEtatMyges({ ...base, etape: 'erreur', erreur: { code: 'identifiants_manquants', message: 'x' } }), /MYGES_IDENTIFIANT/);
    assert.match(rendreEtatMyges({ ...base, etape: 'erreur', erreur: { code: 'identifiants_refuses', message: 'x' } }), /identifiant MyGES/);
    assert.match(rendreEtatMyges({ ...base, etape: 'erreur', erreur: { code: 'autre', message: 'Détail <b>' } }), /Détail &lt;b&gt;/);
  });
});
