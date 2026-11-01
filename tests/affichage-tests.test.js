import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rendreResultat } from '../js/code/resultat.js';

const ECHEC = {
  statut: 'echec',
  sortie: 'sortie brute',
  resume: { reussis: 1, echoues: 1 },
  tests: [
    { nom: 'presentation', reussi: true },
    { nom: 'encadrement', reussi: false, appel: 'encadrer("rust")', obtenu: '"[mot]"', attendu: '"[rust]"', indice: 'doit encadrer' },
  ],
};

describe('affichage des tests', () => {
  it('montre l’appel, la sortie obtenue et l’attendu avant la sortie complète', () => {
    const { html } = rendreResultat(ECHEC, { langage: 'rust', suivant: null });
    assert.match(html, /Appel \(valeur lue\)<\/dt><dd class=""><code>encadrer\(&quot;rust&quot;\)<\/code>/);
    assert.match(html, /Sortie obtenue<\/dt><dd class="obtenu">/);
    assert.match(html, /Attendu<\/dt><dd class="attendu">/);
    assert.match(html, /✓<\/span>presentation/);
    assert.ok(html.indexOf('Sortie obtenue') < html.indexOf('Sortie complète'));
    assert.doesNotMatch(html, /<details class="sortie-complete" open/);
  });

  it('échappe le HTML des valeurs', () => {
    const { html } = rendreResultat(
      { ...ECHEC, tests: [{ nom: 'a', reussi: false, appel: '<b>', obtenu: '1', attendu: '2' }] },
      { langage: 'c', suivant: null },
    );
    assert.match(html, /&lt;b&gt;/);
  });

  it('affiche la condition ou l’erreur quand il n’y a pas de valeurs', () => {
    const { html } = rendreResultat(
      {
        ...ECHEC,
        tests: [
          { nom: 'a', reussi: false, condition: 'x > 5' },
          { nom: 'b', reussi: false, erreur: 'ZeroDivisionError' },
        ],
      },
      { langage: 'python', suivant: null },
    );
    assert.match(html, /Condition non vérifiée/);
    assert.match(html, /Erreur<\/dt><dd class=""><code>ZeroDivisionError/);
  });

  it('ouvre la sortie complète quand aucun test ne détaille l’échec (plantage)', () => {
    const { html } = rendreResultat({ ...ECHEC, tests: [{ nom: 'a', reussi: true }] }, { langage: 'c', suivant: null });
    assert.match(html, /<details class="sortie-complete" open>/);
  });

  it('revient à la sortie brute sans liste de tests', () => {
    const { html } = rendreResultat(
      { statut: 'echec', sortie: 'ancienne sortie', resume: { reussis: 0, echoues: 1 } },
      { langage: 'rust', suivant: null },
    );
    assert.doesNotMatch(html, /class="tests"/);
    assert.match(html, /ancienne sortie/);
  });
});
