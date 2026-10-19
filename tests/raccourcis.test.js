import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { blocsDeLignes, configurerSouris, planDuplication } from '../js/code/raccourcis.js';

const curseur = (line, ch) => ({ anchor: { line, ch }, head: { line, ch } });
const selection = (debut, fin) => ({ anchor: { line: debut[0], ch: debut[1] }, head: { line: fin[0], ch: fin[1] } });

describe('blocs de lignes', () => {
  it('prend la ligne d’un simple curseur', () => {
    assert.deepEqual(blocsDeLignes([curseur(3, 5)]).map(({ debut, fin }) => [debut, fin]), [[3, 3]]);
  });

  it('prend toutes les lignes d’une sélection, même tirée vers le haut', () => {
    assert.deepEqual(blocsDeLignes([selection([6, 2], [4, 1])]).map(({ debut, fin }) => [debut, fin]), [[4, 6]]);
  });

  it('ignore la ligne où une sélection se termine en tout début de ligne', () => {
    assert.deepEqual(blocsDeLignes([selection([2, 0], [3, 0])]).map(({ debut, fin }) => [debut, fin]), [[2, 2]]);
  });

  it('regroupe les curseurs posés sur la même ligne', () => {
    const blocs = blocsDeLignes([curseur(1, 0), curseur(1, 4), curseur(5, 0)]);
    assert.deepEqual(blocs.map(({ debut, fin }) => [debut, fin]), [[1, 1], [5, 5]]);
    assert.equal(blocs[0].selections.length, 2);
  });
});

describe('duplication de lignes', () => {
  it('vers le bas, le curseur passe sur la copie', () => {
    const { blocs, selections } = planDuplication([curseur(2, 3)], true);
    assert.deepEqual(blocs, [{ debut: 2, fin: 2 }]);
    assert.deepEqual(selections, [curseur(3, 3)]);
  });

  it('vers le haut, le curseur reste sur la ligne du haut', () => {
    assert.deepEqual(planDuplication([curseur(2, 3)], false).selections, [curseur(2, 3)]);
  });

  it('décale les blocs suivants du nombre de lignes ajoutées', () => {
    const { selections } = planDuplication([selection([0, 0], [1, 2]), curseur(4, 1)], true);
    assert.deepEqual(selections, [selection([2, 0], [3, 2]), curseur(7, 1)]);
    assert.deepEqual(planDuplication([selection([0, 0], [1, 2]), curseur(4, 1)], false).selections, [selection([0, 0], [1, 2]), curseur(6, 1)]);
  });
});

describe('souris', () => {
  it('Alt + clic dépose un nouveau curseur', () => {
    assert.deepEqual(configurerSouris(null, 'single', { altKey: true, shiftKey: false }), { addNew: true, unit: 'char' });
    assert.deepEqual(configurerSouris(null, 'double', { altKey: true, shiftKey: false }), { addNew: true, unit: 'word' });
  });

  it('laisse le comportement normal sans Alt, et la sélection en colonne avec Maj + Alt', () => {
    assert.deepEqual(configurerSouris(null, 'single', { altKey: false, shiftKey: false }), {});
    assert.deepEqual(configurerSouris(null, 'single', { altKey: true, shiftKey: true }), {});
  });
});
