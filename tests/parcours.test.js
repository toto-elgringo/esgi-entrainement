import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chapitresDeMatiere, cleExercice, compterProgression, lienExercice, prochainExercice, voisins } from '../js/parcours.js';

const chapitres = [
  { cle: 'rust/01-a', matieres: ['rust'], exercices: [{ id: 'x' }, { id: 'y' }] },
  { cle: 'maths/01-a', matieres: ['info', 'data'], exercices: [{ id: 'z' }] },
  { cle: 'maths/02-b', matieres: ['info'], exercices: [{ id: 'w' }] },
];
const progression = { exercices: { 'rust/01-a/x': { reussi: true } }, quiz: {} };

describe('parcours', () => {
  it('filtre les chapitres par matière et ne montre rien sans matière', () => {
    assert.deepEqual(chapitresDeMatiere(chapitres, 'info').map((chapitre) => chapitre.cle), ['maths/01-a', 'maths/02-b']);
    assert.deepEqual(chapitresDeMatiere(chapitres, null), []);
  });

  it('distingue deux chapitres de même nom dans deux domaines', () => {
    assert.equal(cleExercice('rust/01-a', 'x'), 'rust/01-a/x');
    assert.equal(lienExercice({ chapitreCle: 'maths/01-a', id: 'z' }), '#/exercice/maths/01-a/z');
  });

  it('trouve les exercices voisins entre deux chapitres', () => {
    const maths = chapitresDeMatiere(chapitres, 'info');
    const { precedent, suivant } = voisins(maths, 'maths/01-a', 'z');
    assert.equal(precedent, null);
    assert.equal(suivant.chapitreCle, 'maths/02-b');
  });

  it('propose le premier exercice non réussi et compte la progression', () => {
    const rust = chapitresDeMatiere(chapitres, 'rust');
    assert.equal(prochainExercice(rust, progression).id, 'y');
    assert.deepEqual(compterProgression(rust, progression), { reussis: 1, total: 2 });
  });
});
