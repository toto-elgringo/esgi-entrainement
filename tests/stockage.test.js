import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const memoire = new Map([['esgi-entrainement', JSON.stringify({ codes: { 'rust/01-a/x': 'fn main() {}' } })]]);
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (cle) => memoire.get(cle) ?? null,
    setItem: (cle, valeur) => memoire.set(cle, valeur),
  },
});

const { stockage } = await import('../js/stockage.js');
const enregistre = () => JSON.parse(memoire.get('esgi-entrainement'));

describe('stockage', () => {
  it('relit une ancienne progression et complète ce qui manque', () => {
    assert.equal(stockage.code('rust/01-a/x'), 'fn main() {}');
    assert.equal(stockage.partieQuiz('rust/01-a'), null);
    assert.deepEqual(stockage.affichage('rust/01-a/x'), {});
  });

  it('enregistre la partie de quiz en cours', () => {
    const partie = { ordres: [[1, 0]], reponses: { 0: 1 } };
    stockage.enregistrerPartieQuiz('rust/01-a', partie);
    assert.deepEqual(stockage.partieQuiz('rust/01-a'), partie);
    assert.deepEqual(enregistre().partiesQuiz['rust/01-a'], partie);
  });

  it('complète l’affichage d’un exercice sans effacer le reste', () => {
    stockage.enregistrerAffichage('rust/01-a/x', { indices: 2 });
    stockage.enregistrerAffichage('rust/01-a/x', { solution: true });
    assert.deepEqual(stockage.affichage('rust/01-a/x'), { indices: 2, solution: true });
    assert.deepEqual(enregistre().affichages['rust/01-a/x'], { indices: 2, solution: true });
  });

  it('efface aussi les parties et les affichages quand on réinitialise', () => {
    stockage.reinitialiser();
    assert.equal(stockage.partieQuiz('rust/01-a'), null);
    assert.deepEqual(stockage.affichage('rust/01-a/x'), {});
  });
});
