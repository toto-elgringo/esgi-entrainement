import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  animationsCode,
  colorerLigne,
  creerListe,
  decouper,
  derouler,
  disposerMemoire,
  ecrireListe,
  ecrireTranche,
  enrichir,
  OPERATIONS_LISTE,
  reprPython,
  SCENARIOS_ITERATEURS,
  SCENARIOS_MEMOIRE,
  simulerIterateur,
  valeursListe,
} from '../js/animations/code.js';

describe('animations du code : registre', () => {
  it('chaque animation a un titre, une consigne et une fonction de création', () => {
    for (const [nom, animation] of Object.entries(animationsCode)) {
      assert.equal(typeof animation.titre, 'string', nom);
      assert.equal(typeof animation.consigne, 'string', nom);
      assert.equal(typeof animation.creer, 'function', nom);
    }
    assert.ok(Object.keys(animationsCode).length >= 6);
  });
});

describe('coloration du code affiché', () => {
  it('colore mots-clés, chaînes et nombres en échappant le HTML', () => {
    const rendu = colorerLigne('int *p = &n; if (a < 3) return "x";', 'c');
    assert.match(rendu, /<span class="anim-jeton-mot">int<\/span>/);
    assert.match(rendu, /&amp;n/);
    assert.match(rendu, /&lt;/);
    assert.match(rendu, /<span class="anim-jeton-nombre">3<\/span>/);
    assert.match(rendu, /<span class="anim-jeton-chaine">&quot;x&quot;<\/span>/);
  });

  it('reconnaît les macros, les durées de vie et les caractères en Rust', () => {
    const rendu = colorerLigne("fn f<'a>(s: &'a str) { println!(\"{s}\"); s.push('!'); }", 'rust');
    assert.match(rendu, /<span class="anim-jeton-fonction">println!<\/span>/);
    assert.match(rendu, /<span class="anim-jeton-type">'a<\/span>/);
    assert.match(rendu, /<span class="anim-jeton-chaine">'!'<\/span>/);
  });

  it('garde le texte intact une fois les balises retirées', () => {
    const ligne = '    print(Employee.emp_count, emp1.emp_count)  # fin';
    const texte = colorerLigne(ligne, 'python').replace(/<[^>]+>/g, '');
    assert.equal(texte, ligne);
  });

  it('enrichit les explications sans laisser passer de HTML', () => {
    assert.equal(enrichir('`*p` et **pile** <b>'), '<code>*p</code> et <strong>pile</strong> &lt;b&gt;');
    assert.equal(enrichir('`**x % 2`'), '<code>**x % 2</code>');
  });
});

describe('programmes pas à pas en mémoire', () => {
  const tous = Object.values(SCENARIOS_MEMOIRE).flat();
  const sortieFinale = (cle) => tous.find((scenario) => scenario.cle === cle).etapes.at(-1).sortie;

  it('chaque étape désigne une vraie ligne du programme', () => {
    for (const scenario of tous) {
      assert.ok(scenario.etapes.length > 3, scenario.cle);
      for (const etape of scenario.etapes) {
        assert.ok(etape.ligne >= 1 && etape.ligne <= scenario.code.length, `${scenario.cle} ligne ${etape.ligne}`);
        assert.ok(scenario.code[etape.ligne - 1].trim() !== '', `${scenario.cle} ligne vide ${etape.ligne}`);
        assert.ok(etape.texte, scenario.cle);
      }
    }
  });

  it('chaque flèche vise un élément existant, sauf une référence pendante', () => {
    for (const scenario of tous) {
      for (const [i, { memoire }] of scenario.etapes.entries()) {
        const ids = new Set(memoire.tas.map((bloc) => bloc.id));
        for (const cadre of memoire.cadres) for (const variable of cadre.variables) ids.add(`${cadre.nom}.${variable.nom}`);
        const sources = [
          ...memoire.cadres.flatMap((cadre) => cadre.variables),
          ...memoire.tas.flatMap((bloc) => bloc.champs ?? []),
        ].filter((element) => element.vers);
        for (const source of sources) {
          assert.ok(ids.has(source.vers) || source.etat === 'danger', `${scenario.cle} étape ${i + 1} : ${source.nom} → ${source.vers}`);
        }
      }
    }
  });

  it('les sorties affichées sont celles des vrais programmes', () => {
    assert.equal(sortieFinale('adresse'), 'après plusUnCopie : 5\naprès plusUnAdresse : 6\n');
    assert.equal(sortieFinale('clone'), '5 5 Hey Hey\n');
    assert.equal(sortieFinale('emprunts'), 'Hey Hey\nHey World\n');
    assert.equal(sortieFinale('plus-long'), 'bonjour\n');
    assert.equal(sortieFinale('alias'), '[1, 2, 3]\n[1, 2, 3] [1, 2, 3, 4]\n');
    assert.equal(sortieFinale('fonctions'), '[1, 2, 0]\n5\n');
    assert.equal(sortieFinale('defaut'), '[1, 2] [1, 2]\n[1] [2]\n');
    assert.equal(sortieFinale('classes'), '7 False\n2 100 2\n');
  });

  it('les programmes refusés par Rust finissent sur l’erreur du compilateur', () => {
    const move = tous.find((scenario) => scenario.cle === 'move').etapes.at(-1);
    assert.match(move.erreur, /^error\[E0382\]: borrow of moved value: `s`/);
    const pendante = tous.find((scenario) => scenario.cle === 'pendante').etapes.at(-1);
    assert.match(pendante.erreur, /^error\[E0597\]: `x` does not live long enough/);
  });

  it('une variable déplacée perd sa flèche et la mémoire libérée disparaît ensuite', () => {
    const { etapes } = tous.find((scenario) => scenario.cle === 'move');
    const main = etapes[2].memoire.cadres[0].variables.find((variable) => variable.nom === 's');
    assert.equal(main.etat, 'invalide');
    assert.equal(main.vers, undefined);
    assert.equal(etapes[4].memoire.tas[0].etat, 'libere');
    assert.equal(etapes[5].memoire.tas.length, 0);
  });

  it('le piège de la copie laisse un maillon perdu', () => {
    const { etapes } = tous.find((scenario) => scenario.cle === 'liste');
    const fin = etapes.at(-1).memoire;
    assert.deepEqual(fin.tas.filter((bloc) => bloc.etat !== 'libere').map((bloc) => bloc.id), ['c3']);
    assert.equal(fin.tas.find((bloc) => bloc.id === 'c3').etat, 'danger');
  });

  it('derouler efface les états passagers d’une étape à l’autre', () => {
    const etapes = derouler([
      { ligne: 1, faire: (m) => { m.appel('main'); m.variable('a', '1'); } },
      { ligne: 2, faire: (m) => m.variable('b', '2') },
    ]);
    assert.equal(etapes[0].memoire.cadres[0].variables[0].etat, 'nouveau');
    assert.equal(etapes[1].memoire.cadres[0].variables[0].etat, undefined);
    assert.equal(etapes[1].memoire.cadres[0].variables[1].etat, 'nouveau');
  });

  it('la mise en page relie un pointeur de la pile au tas et une référence à sa variable', () => {
    const plan = disposerMemoire({
      cadres: [{ nom: 'main', variables: [{ nom: 's', valeur: 'x', vers: 'bloc' }, { nom: 'r', valeur: '&s', vers: 'main.s' }] }],
      tas: [{ id: 'bloc', titre: 'String', cases: ['a', 'b'] }],
      sortie: '',
    });
    assert.equal(plan.fleches.length, 2);
    const [versTas, versPile] = plan.fleches;
    assert.ok(versTas.d.endsWith(`${plan.blocs[0].x} ${plan.blocs[0].y + 11}`));
    const boite = plan.cadres[0].variables[0].boite;
    assert.ok(versPile.d.endsWith(`${boite.x + boite.l} ${boite.y + boite.h / 2}`));
    assert.ok(plan.hauteur > plan.cadres[0].y + plan.cadres[0].h);
  });
});

describe('opérations sur la liste chaînée', () => {
  const executer = (cle, valeurs, valeur) => OPERATIONS_LISTE[cle].executer(creerListe(valeurs), valeur);

  it('construit une liste et l’écrit comme afficherListe', () => {
    assert.equal(ecrireListe(creerListe([0, 1, 2])), '0 -> 1 -> 2 -> NULL');
    assert.equal(ecrireListe(creerListe([])), 'NULL');
  });

  it('insère en tête, en queue, et dans une liste vide', () => {
    assert.deepEqual(valeursListe(executer('tete', [0, 1, 2], 3).fin), [3, 0, 1, 2]);
    assert.deepEqual(valeursListe(executer('queue', [0, 1, 2], 5).fin), [0, 1, 2, 5]);
    assert.deepEqual(valeursListe(executer('queue', [], 5).fin), [5]);
    assert.deepEqual(valeursListe(executer('tete', [], 5).fin), [5]);
  });

  it('l’insertion en tête accroche avant de déplacer la tête', () => {
    const { etapes } = executer('tete', [0, 1], 9);
    const accroche = etapes.find((etape) => etape.ligne === 3).liste;
    const nouveau = accroche.maillons.find((element) => element.valeur === 9);
    assert.equal(nouveau.next, accroche.start);
    assert.notEqual(accroche.start, nouveau.id);
  });

  it('supprime en tête, au milieu, la première valeur, et ignore une valeur absente', () => {
    assert.deepEqual(valeursListe(executer('supprimerDebut', [0, 1, 2]).fin), [1, 2]);
    assert.deepEqual(valeursListe(executer('supprimerDebut', []).fin), []);
    assert.deepEqual(valeursListe(executer('supprimerValeur', [1, 4, 2, 5], 2).fin), [1, 4, 5]);
    assert.deepEqual(valeursListe(executer('supprimerValeur', [1, 4, 2], 1).fin), [4, 2]);
    assert.deepEqual(valeursListe(executer('supprimerValeur', [1, 4, 2], 7).fin), [1, 4, 2]);
    assert.deepEqual(valeursListe(executer('supprimerValeur', [3, 3], 3).fin), [3]);
  });

  it('libère le maillon supprimé avant la fin de l’opération', () => {
    const { etapes } = executer('supprimerValeur', [1, 4, 2, 5], 2);
    const avantDerniere = etapes.at(-2).liste;
    assert.equal(avantDerniere.maillons.find((element) => element.valeur === 2).etat, 'libere');
    assert.ok(etapes.at(-1).liste.maillons.every((element) => element.etat !== 'libere'));
  });

  it('inverse la liste en retournant les flèches', () => {
    assert.deepEqual(valeursListe(executer('inverser', [1, 2, 3]).fin), [3, 2, 1]);
    assert.deepEqual(valeursListe(executer('inverser', []).fin), []);
  });

  it('le parcours calcule la somme sans changer la liste', () => {
    const { etapes, fin } = executer('parcourir', [0, 1, 2]);
    assert.deepEqual(valeursListe(fin), [0, 1, 2]);
    assert.match(etapes.find((etape) => etape.ligne === 8).texte, /vaut 3/);
  });

  it('chaque étape désigne une ligne du code de l’opération', () => {
    for (const [cle, operation] of Object.entries(OPERATIONS_LISTE)) {
      for (const valeurs of [[], [0], [1, 4, 2, 5]]) {
        for (const etape of operation.executer(creerListe(valeurs), 4).etapes) {
          assert.ok(etape.ligne >= 1 && etape.ligne <= operation.code.length, `${cle} ${etape.ligne}`);
          assert.ok(operation.code[etape.ligne - 1].trim() !== '', `${cle} ${etape.ligne}`);
        }
      }
    }
  });
});

describe('itérateurs paresseux', () => {
  const scenario = (cle) => SCENARIOS_ITERATEURS.find((element) => element.cle === cle);

  it('take(2) ne calcule que deux éléments, dans l’ordre du cours', () => {
    const paresse = scenario('paresse');
    assert.deepEqual(paresse.resultat, [10, 20]);
    assert.equal(paresse.consommes, 2);
    assert.equal(paresse.evenements.at(-1).sortie, "rien n'est encore calculé\nje calcule 1 × 10\nje calcule 2 × 10\n[10, 20]\n");
  });

  it('une suite infinie s’arrête grâce à take', () => {
    const infini = scenario('infini');
    assert.deepEqual(infini.resultat, [1, 9, 25, 49]);
    assert.equal(infini.consommes, 7);
    assert.ok(infini.evenements.some((evenement) => evenement.type === 'stop'));
  });

  it('filter puis map puis sum donnent la somme des carrés pairs', () => {
    const boucle = scenario('boucle');
    assert.equal(boucle.resultat, 56);
    assert.deepEqual(boucle.evenements.filter((evenement) => evenement.type === 'rejette').map((evenement) => evenement.valeur), [1, 3, 5]);
  });

  it('chaque élément traverse toute la chaîne avant le suivant', () => {
    const { evenements } = simulerIterateur({
      source: { nom: 'v', ligne: 1, valeur: (i) => [1, 2][i] },
      adaptateurs: [{ type: 'map', ligne: 1, f: (x) => x + 1 }],
      consommateur: { type: 'collect', nom: 'collect', ligne: 1 },
    });
    assert.deepEqual(evenements.map(({ type, valeur }) => `${type}:${valeur ?? ''}`), [
      'produit:1', 'transforme:2', 'recoit:2',
      'produit:2', 'transforme:3', 'recoit:3',
      'vide:', 'fin:',
    ]);
  });
});

describe('tranches Python', () => {
  const indices = (n, debut, fin, pas) => decouper(n, debut, fin, pas).indices;

  it('suit exactement Python, y compris indices négatifs et pas négatif', () => {
    const cas = [
      [[1, 4, null], [1, 2, 3]],
      [[null, 4, null], [0, 1, 2, 3]],
      [[2, null, null], [2, 3, 4]],
      [[null, null, 2], [0, 2, 4]],
      [[null, null, -1], [4, 3, 2, 1, 0]],
      [[-3, null, null], [2, 3, 4]],
      [[10, null, null], []],
      [[-10, 3, null], [0, 1, 2]],
      [[4, 1, -1], [4, 3, 2]],
      [[null, -6, -2], [4, 2, 0]],
      [[-1, -10, -2], [4, 2, 0]],
      [[3, 3, null], []],
      [[null, null, -3], [4, 1]],
      [[5, null, -1], [4, 3, 2, 1, 0]],
      [[-6, null, -1], []],
    ];
    for (const [[debut, fin, pas], attendu] of cas) {
      assert.deepEqual(indices(5, debut, fin, pas), attendu, ecrireTranche('l', debut, fin, pas));
    }
  });

  it('refuse un pas nul comme Python', () => {
    assert.equal(decouper(5, null, null, 0).erreur, 'ValueError: slice step cannot be zero');
  });

  it('écrit l’expression et le résultat comme Python', () => {
    assert.equal(ecrireTranche('l', null, null, -1), 'l[::-1]');
    assert.equal(ecrireTranche('l', -3, null, null), 'l[-3:]');
    assert.equal(ecrireTranche('s', 1, 4, null), 's[1:4]');
    const s = [...'Hello World'];
    assert.equal(reprPython(decouper(s.length, 1, 4, null).indices.map((i) => s[i]), true), "'ell'");
    assert.equal(reprPython(decouper(s.length, null, null, -1).indices.map((i) => s[i]), true), "'dlroW olleH'");
    assert.equal(reprPython([], false), '[]');
    assert.equal(reprPython([..."l'a"], true), '"l\'a"');
  });

  it('explique le calcul d’un indice négatif', () => {
    assert.ok(decouper(5, -3, null, null).explications.some((ligne) => ligne.includes('-3 + 5 = 2')));
  });
});
