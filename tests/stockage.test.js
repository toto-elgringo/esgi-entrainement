import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

function fausseMemoire(depart = {}) {
  const valeurs = new Map(Object.entries(depart));
  return {
    valeurs,
    getItem: (cle) => valeurs.get(cle) ?? null,
    setItem: (cle, valeur) => valeurs.set(cle, valeur),
  };
}

const memoire = fausseMemoire({ 'esgi-entrainement': JSON.stringify({ codes: { 'rust/01-a/x': 'fn main() {}' } }) });
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: memoire });

const { creerStockage, stockage } = await import('../js/stockage.js');
const enregistre = () => {
  stockage.ecrireMaintenant();
  return JSON.parse(memoire.getItem('esgi-entrainement'));
};

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

  it('recommence un seul exercice sans toucher aux autres', () => {
    stockage.enregistrerEssai('maths/01-a/x', true);
    stockage.enregistrerSaisies('maths/01-a/x', { 0: '12' });
    stockage.enregistrerAffichage('maths/01-a/x', { indices: 2, correction: true });
    stockage.enregistrerCode('rust/01-a/y', 'fn main() {}');
    stockage.reinitialiserExercice('maths/01-a/x');
    assert.equal(stockage.progression().exercices['maths/01-a/x'], undefined);
    assert.deepEqual(stockage.saisies('maths/01-a/x'), {});
    assert.deepEqual(stockage.affichage('maths/01-a/x'), {});
    assert.equal(stockage.code('rust/01-a/y'), 'fn main() {}');
    assert.equal(enregistre().exercices['maths/01-a/x'], undefined);
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

describe('écritures regroupées', () => {
  it('attend 300 ms avant d’écrire le code, mais écrit tout de suite une réussite', (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const partagee = fausseMemoire();
    const onglet = creerStockage({ memoire: partagee });
    onglet.enregistrerCode('rust/01/a', 'un');
    onglet.enregistrerCode('rust/01/a', 'deux');
    assert.equal(partagee.getItem('esgi-entrainement'), null);
    t.mock.timers.tick(300);
    assert.equal(JSON.parse(partagee.getItem('esgi-entrainement')).codes['rust/01/a'], 'deux');

    onglet.enregistrerEssai('rust/01/a', true);
    assert.equal(JSON.parse(partagee.getItem('esgi-entrainement')).exercices['rust/01/a'].reussi, true);
  });

  it('écrit le score d’un quiz tout de suite', () => {
    const partagee = fausseMemoire();
    creerStockage({ memoire: partagee }).enregistrerQuiz('rust/01', 3, 4);
    assert.deepEqual(JSON.parse(partagee.getItem('esgi-entrainement')).quiz['rust/01'], { score: 3, total: 4 });
  });
});

describe('plusieurs onglets', () => {
  it('ne s’écrasent plus : chaque onglet ne change que sa propre clé', () => {
    const partagee = fausseMemoire();
    const premier = creerStockage({ memoire: partagee });
    const second = creerStockage({ memoire: partagee });
    premier.enregistrerCode('rust/01/a', 'code A');
    premier.ecrireMaintenant();
    second.enregistrerCode('python/01/b', 'code B');
    second.ecrireMaintenant();
    const final = JSON.parse(partagee.getItem('esgi-entrainement'));
    assert.equal(final.codes['rust/01/a'], 'code A');
    assert.equal(final.codes['python/01/b'], 'code B');
  });

  it('rechargent l’état écrit par un autre onglet sans perdre ce qui attend d’être écrit', () => {
    const partagee = fausseMemoire();
    const premier = creerStockage({ memoire: partagee });
    const second = creerStockage({ memoire: partagee });
    const avertir = mock.fn();
    second.surChangementExterne(avertir);
    second.enregistrerSaisies('maths/01/a', { 0: '12' });
    premier.enregistrerEssai('rust/01/a', true);
    second.recharger();
    assert.equal(second.progression().exercices['rust/01/a'].reussi, true);
    assert.deepEqual(second.saisies('maths/01/a'), { 0: '12' });
    assert.equal(avertir.mock.callCount(), 1);
  });

  it('additionne les essais des deux onglets', () => {
    const partagee = fausseMemoire();
    const premier = creerStockage({ memoire: partagee });
    const second = creerStockage({ memoire: partagee });
    premier.enregistrerEssai('c/01/a', false);
    second.enregistrerEssai('c/01/a', false);
    assert.equal(JSON.parse(partagee.getItem('esgi-entrainement')).exercices['c/01/a'].essais, 2);
  });
});

describe('stockage plein', () => {
  it('prévient une seule fois tant que l’écriture échoue', () => {
    const pleine = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } };
    const onglet = creerStockage({ memoire: pleine });
    const avertir = mock.fn();
    onglet.surErreurEcriture(avertir);
    onglet.enregistrerEssai('rust/01/a', true);
    onglet.enregistrerEssai('rust/01/b', true);
    assert.equal(avertir.mock.callCount(), 1);
    assert.equal(onglet.progression().exercices['rust/01/b'].reussi, true);
  });
});

describe('anciens résultats de compilation', () => {
  it('efface seulement les résultats et garde le reste de l’affichage', () => {
    const partagee = fausseMemoire();
    const onglet = creerStockage({ memoire: partagee });
    onglet.enregistrerAffichage('rust/01/a', { resultat: { statut: 'echec', sortie: 'x'.repeat(5000) }, indices: 2, entree: 'Ada' });
    onglet.enregistrerCode('rust/01/a', 'fn main() {}');
    const avant = onglet.tailleUtilisee();
    onglet.effacerResultats();
    assert.deepEqual(onglet.affichage('rust/01/a'), { indices: 2, entree: 'Ada' });
    assert.equal(onglet.code('rust/01/a'), 'fn main() {}');
    assert.ok(onglet.tailleUtilisee() < avant);
  });
});

describe('signalement des changements', () => {
  function espion(depart) {
    const onglet = creerStockage({ memoire: fausseMemoire(depart), delai: 0 });
    const appels = [];
    onglet.surChangementLocal((touches, options) => appels.push({ touches, options }));
    return { onglet, appels };
  }

  it('enregistrerEssai signale exercices/<cle> avec la valeur entière, tout de suite', () => {
    const { onglet, appels } = espion();
    onglet.enregistrerEssai('rust/01/a', true);
    assert.equal(appels.length, 1);
    assert.deepEqual(appels[0].touches, [{ partie: 'exercices', cle: 'rust/01/a', valeur: { essais: 1, reussi: true } }]);
    assert.equal(appels[0].options.immediat, true);
  });

  it('enregistrerCode signale codes/<cle> après le délai, une seule touche', async () => {
    const { onglet, appels } = espion();
    onglet.enregistrerCode('rust/01/a', 'un');
    onglet.enregistrerCode('rust/01/a', 'deux');
    assert.equal(appels.length, 0);
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.equal(appels.length, 1);
    assert.deepEqual(appels[0].touches, [{ partie: 'codes', cle: 'rust/01/a', valeur: 'deux' }]);
    assert.equal(appels[0].options.immediat, false);
  });

  it('reinitialiserExercice signale les quatre parties de la clé avec la valeur null', () => {
    const { onglet, appels } = espion();
    onglet.enregistrerCode('rust/01/a', 'x');
    onglet.ecrireMaintenant();
    appels.length = 0;
    onglet.reinitialiserExercice('rust/01/a');
    const touches = appels[0].touches;
    assert.deepEqual(touches.map((t) => t.partie).sort(), ['affichages', 'codes', 'exercices', 'saisies']);
    assert.ok(touches.every((t) => t.cle === 'rust/01/a' && t.valeur === null));
  });

  it('reinitialiser signale null pour chaque clé qui existait', () => {
    const { onglet, appels } = espion();
    onglet.enregistrerEssai('a', true);
    onglet.enregistrerQuiz('c', 1, 2);
    appels.length = 0;
    onglet.reinitialiser();
    const touches = appels.flatMap((a) => a.touches);
    assert.deepEqual(touches.map((t) => `${t.partie}/${t.cle}`).sort(), ['exercices/a', 'quiz/c']);
    assert.ok(touches.every((t) => t.valeur === null));
  });

  it('importer signale chaque clé du fichier importé, sans aucun null', () => {
    const { onglet, appels } = espion();
    onglet.enregistrerEssai('ancien', true);
    appels.length = 0;
    const fichier = JSON.stringify({ format: 'esgi-entrainement', version: 1, progression: { exercices: { b: { essais: 2, reussi: false } }, codes: { b: 'fn' } } });
    onglet.importer(fichier);
    const touches = appels.flatMap((a) => a.touches);
    assert.deepEqual(touches.map((t) => `${t.partie}/${t.cle}`).sort(), ['codes/b', 'exercices/b']);
    assert.ok(touches.every((t) => t.valeur !== null));
  });

  it('effacerResultats signale les affichages dont le résultat a été retiré', () => {
    const { onglet, appels } = espion();
    onglet.enregistrerAffichage('a', { resultat: { statut: 'ok' }, indices: 1 });
    onglet.enregistrerAffichage('b', { indices: 1 });
    onglet.ecrireMaintenant();
    appels.length = 0;
    onglet.effacerResultats();
    assert.deepEqual(appels.flatMap((x) => x.touches), [{ partie: 'affichages', cle: 'a', valeur: { indices: 1 } }]);
  });

  it('choisirTheme et choisirMatiere ne signalent rien', () => {
    const { onglet, appels } = espion();
    onglet.choisirTheme('clair');
    onglet.choisirMatiere('rust');
    onglet.ecrireMaintenant();
    assert.equal(appels.length, 0);
  });

  it('remplacerParties ne signale rien et garde theme, matiere et menuRange', () => {
    const { onglet, appels } = espion();
    onglet.choisirTheme('clair');
    onglet.choisirMatiere('rust');
    onglet.rangerMenu(true);
    const externes = [];
    onglet.surChangementExterne(() => externes.push(1));
    onglet.remplacerParties({ exercices: { a: { essais: 1, reussi: true } }, quiz: {}, saisies: {}, codes: { a: 'x' }, partiesQuiz: {}, affichages: {} });
    assert.equal(appels.length, 0);
    assert.equal(externes.length, 1);
    assert.equal(onglet.code('a'), 'x');
    assert.equal(onglet.theme(), 'clair');
    assert.equal(onglet.matiere(), 'rust');
    assert.equal(onglet.menuRange(), true);
    assert.deepEqual(onglet.progression().exercices, { a: { essais: 1, reussi: true } });
  });

  it('remplacerParties n’appelle pas les écouteurs externes si rien ne change', () => {
    const { onglet } = espion();
    const parties = { exercices: {}, quiz: {}, saisies: {}, codes: { a: 'x' }, partiesQuiz: {}, affichages: {} };
    onglet.remplacerParties(parties);
    let nombre = 0;
    onglet.surChangementExterne(() => nombre++);
    onglet.remplacerParties(parties);
    assert.equal(nombre, 0);
  });

  it('remplacerParties écrit tout de suite dans la mémoire', () => {
    const memoireLocale = fausseMemoire();
    const onglet = creerStockage({ memoire: memoireLocale, delai: 0 });
    onglet.remplacerParties({ exercices: {}, quiz: {}, saisies: {}, codes: { a: 'x' }, partiesQuiz: {}, affichages: {} });
    assert.equal(JSON.parse(memoireLocale.getItem('esgi-entrainement')).codes.a, 'x');
  });
});
