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

  it('retient si le menu est rangé', () => {
    assert.equal(stockage.menuRange(), false);
    stockage.rangerMenu(true);
    assert.equal(stockage.menuRange(), true);
    assert.equal(enregistre().menuRange, true);
  });

  it('est en mode sombre par défaut et retient le mode clair', () => {
    assert.equal(stockage.theme(), 'sombre');
    stockage.choisirTheme('clair');
    assert.equal(stockage.theme(), 'clair');
    assert.equal(enregistre().theme, 'clair');
  });

  it('efface aussi les parties et les affichages quand on réinitialise, mais garde le menu rangé et le thème', () => {
    stockage.reinitialiser();
    assert.equal(stockage.partieQuiz('rust/01-a'), null);
    assert.deepEqual(stockage.affichage('rust/01-a/x'), {});
    assert.equal(stockage.menuRange(), true);
    assert.equal(stockage.theme(), 'clair');
  });

  it('exporte toute la progression dans un fichier reconnaissable', () => {
    stockage.enregistrerCode('rust/01-a/x', 'fn main() { println!("ok"); }');
    const fichier = JSON.parse(stockage.exporter());
    assert.equal(fichier.format, 'esgi-entrainement');
    assert.equal(fichier.version, 1);
    assert.equal(fichier.progression.codes['rust/01-a/x'], 'fn main() { println!("ok"); }');
  });

  it('importe une progression exportée et remplace l’ancienne', () => {
    const exporte = stockage.exporter();
    stockage.reinitialiser();
    stockage.enregistrerCode('python/01-a/y', 'print(1)');
    stockage.importer(exporte);
    assert.equal(stockage.code('rust/01-a/x'), 'fn main() { println!("ok"); }');
    assert.equal(stockage.code('python/01-a/y'), null);
    assert.equal(enregistre().codes['rust/01-a/x'], 'fn main() { println!("ok"); }');
  });

  it('refuse un fichier illisible ou qui ne vient pas du site sans rien effacer', () => {
    assert.throws(() => stockage.importer('pas du json'), /illisible/);
    assert.throws(() => stockage.importer(JSON.stringify({ codes: {} })), /ne vient pas/);
    assert.equal(stockage.code('rust/01-a/x'), 'fn main() { println!("ok"); }');
  });

  it('ignore les parties mal formées d’un fichier importé', () => {
    stockage.importer(JSON.stringify({
      format: 'esgi-entrainement',
      version: 1,
      progression: { exercices: 'faux', codes: { 'c/01-a/z': 'int main(void) {}' }, theme: 'violet', menuRange: 'oui', matiere: 42 },
    }));
    assert.deepEqual(stockage.progression().exercices, {});
    assert.equal(stockage.code('c/01-a/z'), 'int main(void) {}');
    assert.equal(stockage.theme(), 'sombre');
    assert.equal(stockage.menuRange(), false);
    assert.equal(stockage.matiere(), null);
  });
});
