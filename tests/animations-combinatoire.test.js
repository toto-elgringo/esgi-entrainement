import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  accepterVoisin,
  angleArret,
  animationsCombinatoire,
  appliquer2opt,
  ATELIER,
  corrigerClassement,
  couperPolygone,
  croisementOX,
  croisementUnPoint,
  descentePlne,
  emplacementsZone,
  estPermutation,
  FITNESS_ROULETTE,
  indiceRoulette,
  iterationRecuit,
  longueurTournee,
  melanger,
  mutationBit,
  mutationEchange,
  nouveauRecuit,
  optimumEntier,
  PAYSAGE_RECUIT,
  paliersNecessaires,
  plusProcheVoisin,
  POPULATION_TOURNOI,
  premiereAmelioration2opt,
  probabiliteAcceptation,
  probabiliteMeilleurGagne,
  probabilitesRoulette,
  PROBLEMES_CLASSES,
  profitPlne,
  realisablePlne,
  relaxationContinue,
  segmentDansBoite,
  simulerRecuit,
  sommetsPlne,
  temperatureGeometrique,
  temperatureInitiale,
  temperatureLineaire,
  tournoi,
  tourneeOptimale,
  toursDistincts,
  TOURNEES_ROULETTE,
  villesAuHasard,
  VILLES_COURS,
  voisins2opt,
  ZONES_CLASSES,
  zoneDuPoint,
} from '../js/animations/combinatoire.js';
import { aleatoire } from '../js/animations/outils.js';

const arrondi = (valeur, decimales = 2) => Number(valeur.toFixed(decimales));
const noms = (ordre) => ordre.map((ville) => VILLES_COURS[ville].nom).join(' ');

describe('animations de combinatoire', () => {
  it('déclare les animations avec un titre et une fonction de création', () => {
    for (const nom of ['croissance', 'voyageur', 'recuit', 'roulette', 'tournoi', 'croisement', 'plne', 'classes']) {
      assert.equal(typeof animationsCombinatoire[nom]?.titre, 'string', nom);
      assert.equal(typeof animationsCombinatoire[nom].creer, 'function', nom);
    }
  });
});

describe('voyageur de commerce', () => {
  it('le glouton du cours part de A et mesure 14,00', () => {
    const ordre = plusProcheVoisin(VILLES_COURS, 0);
    assert.equal(noms(ordre), 'A D C B E F');
    assert.equal(arrondi(longueurTournee(VILLES_COURS, ordre)), 14);
  });

  it('la descente 2-opt refait les deux pas du cours', () => {
    let ordre = plusProcheVoisin(VILLES_COURS, 0);
    const pas = [];
    for (let echange = premiereAmelioration2opt(VILLES_COURS, ordre); echange; echange = premiereAmelioration2opt(VILLES_COURS, ordre)) {
      ordre = appliquer2opt(ordre, echange.i, echange.j);
      pas.push({ tournee: noms(ordre), segment: `${VILLES_COURS[echange.b].nom}…${VILLES_COURS[echange.c].nom}`, longueur: arrondi(longueurTournee(VILLES_COURS, ordre)) });
    }
    assert.deepEqual(pas, [
      { tournee: 'A D E B C F', segment: 'C…E', longueur: 13.77 },
      { tournee: 'A D F C B E', segment: 'E…F', longueur: 12.61 },
    ]);
  });

  it('l’échange 2-opt compare d(a,c) + d(b,d) à d(a,b) + d(c,d)', () => {
    const echange = premiereAmelioration2opt(VILLES_COURS, plusProcheVoisin(VILLES_COURS, 0));
    assert.equal(arrondi(echange.avant), 7);
    assert.equal(arrondi(echange.apres), 6.77);
    assert.equal(arrondi(echange.gain), 0.23);
  });

  it('l’inversion de segment garde toutes les villes', () => {
    assert.deepEqual(appliquer2opt([0, 1, 2, 3, 4, 5], 1, 4), [0, 1, 4, 3, 2, 5]);
  });

  it('compte les tournées distinctes et les voisins 2-opt', () => {
    assert.equal(toursDistincts(6), 60);
    assert.equal(toursDistincts(8), 2520);
    assert.equal(voisins2opt(6), 9);
  });

  it('l’optimum global des 6 villes vaut 12,61', () => {
    assert.equal(arrondi(tourneeOptimale(VILLES_COURS).longueur), 12.61);
  });

  it('des villes au hasard sont reproductibles et une tournée 2-optimale n’a plus d’amélioration', () => {
    const villes = villesAuHasard(12, aleatoire(4));
    assert.deepEqual(villes, villesAuHasard(12, aleatoire(4)));
    let ordre = [0, ...melanger([...villes.keys()].slice(1), aleatoire(9))];
    const depart = longueurTournee(villes, ordre);
    for (let echange = premiereAmelioration2opt(villes, ordre); echange; echange = premiereAmelioration2opt(villes, ordre)) {
      ordre = appliquer2opt(ordre, echange.i, echange.j);
    }
    assert.ok(longueurTournee(villes, ordre) < depart);
    assert.deepEqual([...ordre].sort((a, b) => a - b), [...villes.keys()]);
  });
});

describe('recuit simulé', () => {
  it('la règle de Metropolis redonne le tableau du cours', () => {
    assert.equal(arrondi(probabiliteAcceptation(1, 100) * 100, 1), 99);
    assert.equal(arrondi(probabiliteAcceptation(5, 5) * 100, 1), 36.8);
    assert.equal(arrondi(probabiliteAcceptation(5, 1) * 100, 1), 0.7);
    assert.equal(arrondi(probabiliteAcceptation(50, 100) * 100, 1), 60.7);
    assert.equal(arrondi(probabiliteAcceptation(10, 1) * 100, 3), 0.005);
  });

  it('une amélioration est toujours acceptée, une dégradation jamais à T = 0', () => {
    assert.equal(probabiliteAcceptation(-3, 0.01), 1);
    assert.equal(probabiliteAcceptation(0, 5), 1);
    assert.equal(probabiliteAcceptation(2, 0), 0);
    assert.equal(accepterVoisin(-1, 1, 0.999), true);
    assert.equal(accepterVoisin(5, 5, 0.3), true);
    assert.equal(accepterVoisin(5, 5, 0.4), false);
  });

  it('calcule les lois de refroidissement et le nombre de paliers', () => {
    assert.equal(arrondi(temperatureGeometrique(100, 0.95, 10), 4), 59.8737);
    assert.equal(temperatureLineaire(100, 25, 100), 75);
    assert.equal(paliersNecessaires(100, 1, 0.95), 90);
    assert.ok(temperatureGeometrique(100, 0.95, 90) <= 1);
    assert.ok(temperatureGeometrique(100, 0.95, 89) > 1);
    assert.equal(arrondi(temperatureInitiale(10, Math.exp(-1))), 10);
  });

  it('le paysage a plusieurs creux et un minimum global loin du départ', () => {
    const minimaLocaux = PAYSAGE_RECUIT.filter((cout, i) => i > 0 && i < PAYSAGE_RECUIT.length - 1 && cout < PAYSAGE_RECUIT[i - 1] && cout < PAYSAGE_RECUIT[i + 1]);
    assert.ok(minimaLocaux.length >= 4);
    assert.equal(PAYSAGE_RECUIT.indexOf(Math.min(...PAYSAGE_RECUIT)), 58);
  });

  it('un essai renseigne ΔE, la probabilité et la décision', () => {
    const etat = nouveauRecuit({ t0: 20 });
    const essai = iterationRecuit(etat, aleatoire(2));
    assert.equal(essai.delta, PAYSAGE_RECUIT[essai.vers] - PAYSAGE_RECUIT[essai.depuis]);
    assert.equal(essai.probabilite, probabiliteAcceptation(essai.delta, 20));
    assert.equal(essai.accepte, essai.tirage < essai.probabilite);
    assert.equal(etat.position, essai.accepte ? essai.vers : essai.depuis);
  });

  it('la température baisse d’un facteur α à chaque palier', () => {
    const etat = nouveauRecuit({ t0: 40, alpha: 0.9, palier: 5 });
    const hasard = aleatoire(3);
    for (let i = 0; i < 10; i += 1) iterationRecuit(etat, hasard);
    assert.equal(arrondi(etat.temperature, 6), arrondi(40 * 0.9 ** 2, 6));
  });

  it('la descente reste bloquée dans le premier minimum local', () => {
    const etat = simulerRecuit({ mode: 'descente' }, 1);
    assert.equal(etat.termine, true);
    assert.equal(etat.meilleure, 7);
    assert.ok(PAYSAGE_RECUIT[etat.meilleure] > PAYSAGE_RECUIT[58] + 20);
  });

  it('un refroidissement lent trouve le minimum global et s’arrête gelé', () => {
    const etat = simulerRecuit({ alpha: 0.98 }, 1);
    assert.equal(etat.termine, true);
    assert.ok(etat.temperature < etat.reglages.tf);
    assert.ok(Math.abs(etat.meilleure - 58) <= 1);
    assert.equal(etat.iteration, paliersNecessaires(50, 0.05, 0.98) * 20);
  });

  it('la meilleure solution mémorisée n’est jamais pire que la courante', () => {
    const etat = nouveauRecuit();
    const hasard = aleatoire(5);
    for (let i = 0; i < 500; i += 1) {
      iterationRecuit(etat, hasard);
      assert.ok(PAYSAGE_RECUIT[etat.meilleure] <= PAYSAGE_RECUIT[etat.position]);
    }
  });
});

describe('sélection par roulette et par tournoi', () => {
  it('la roulette donne les probabilités du cours', () => {
    const [inverse, carre] = FITNESS_ROULETTE.map(({ calculer }) => probabilitesRoulette(TOURNEES_ROULETTE.map(calculer)));
    assert.deepEqual(inverse.map((p) => arrondi(p * 100, 1)), [31.5, 26.3, 22.5, 19.7]);
    assert.equal(arrondi(carre[0] * 100, 1), 38.5);
  });

  it('le tirage cumulé choisit le bon secteur', () => {
    const probabilites = [0.5, 0.3, 0.2];
    assert.equal(indiceRoulette(probabilites, 0), 0);
    assert.equal(indiceRoulette(probabilites, 0.49), 0);
    assert.equal(indiceRoulette(probabilites, 0.5), 1);
    assert.equal(indiceRoulette(probabilites, 0.85), 2);
    assert.equal(indiceRoulette(probabilites, 0.9999999), 2);
  });

  it('les fréquences de la roulette approchent la théorie', () => {
    const probabilites = probabilitesRoulette(TOURNEES_ROULETTE.map(FITNESS_ROULETTE[0].calculer));
    const hasard = aleatoire(8);
    const comptes = [0, 0, 0, 0];
    for (let i = 0; i < 20000; i += 1) comptes[indiceRoulette(probabilites, hasard())] += 1;
    comptes.forEach((compte, i) => assert.ok(Math.abs(compte / 20000 - probabilites[i]) < 0.015));
  });

  it('la roue s’arrête avec la flèche sur l’angle tiré', () => {
    const arrivee = angleArret(37, 100, 4);
    assert.ok(arrivee >= 37 + 4 * 360);
    assert.equal((((arrivee + 100) % 360) + 360) % 360, 0);
  });

  it('le meilleur gagne un tournoi avec 1 − ((N − 1)/N)^k', () => {
    assert.deepEqual([1, 2, 4, 8].map((k) => Math.round(probabiliteMeilleurGagne(10, k) * 100)), [10, 19, 34, 57]);
  });

  it('un tournoi tire k individus et garde le meilleur', () => {
    const { tires, gagnant } = tournoi(POPULATION_TOURNOI, 3, aleatoire(1));
    assert.equal(tires.length, 3);
    assert.equal(POPULATION_TOURNOI[gagnant], Math.max(...tires.map((i) => POPULATION_TOURNOI[i])));
  });

  it('la fréquence de victoire du meilleur suit la théorie', () => {
    const hasard = aleatoire(12);
    const meilleur = POPULATION_TOURNOI.indexOf(Math.max(...POPULATION_TOURNOI));
    let victoires = 0;
    for (let i = 0; i < 20000; i += 1) if (tournoi(POPULATION_TOURNOI, 4, hasard).gagnant === meilleur) victoires += 1;
    assert.ok(Math.abs(victoires / 20000 - probabiliteMeilleurGagne(10, 4)) < 0.015);
  });
});

describe('croisement et mutation', () => {
  it('le croisement un point redonne l’exemple du cours', () => {
    const enfants = croisementUnPoint([1, 1, 0, 1, 0, 0, 1, 0], [0, 1, 1, 0, 1, 1, 0, 0], 4);
    assert.deepEqual(enfants.map((enfant) => enfant.join('')), ['11011100', '01100010']);
  });

  it('le croisement OX redonne l’exemple du cours', () => {
    const { enfant, manquants, positions } = croisementOX([4, 2, 6, 1, 5, 3, 8, 7], [1, 3, 5, 7, 2, 4, 6, 8], 2, 4);
    assert.deepEqual(manquants, [3, 7, 2, 4, 8]);
    assert.deepEqual(positions, [5, 6, 7, 0, 1]);
    assert.deepEqual(enfant, [4, 8, 6, 1, 5, 3, 7, 2]);
    assert.ok(estPermutation(enfant));
  });

  it('le croisement OX donne toujours une permutation', () => {
    const hasard = aleatoire(6);
    for (let essai = 0; essai < 50; essai += 1) {
      const parent1 = melanger([1, 2, 3, 4, 5, 6, 7, 8], hasard);
      const parent2 = melanger([1, 2, 3, 4, 5, 6, 7, 8], hasard);
      const debut = Math.floor(hasard() * 8);
      const fin = debut + Math.floor(hasard() * (8 - debut));
      assert.ok(estPermutation(croisementOX(parent1, parent2, debut, fin).enfant));
    }
  });

  it('les mutations du cours', () => {
    assert.deepEqual(mutationEchange([4, 8, 6, 1, 5, 3, 7, 2], 1, 6), [4, 7, 6, 1, 5, 3, 8, 2]);
    assert.deepEqual(mutationBit([1, 0, 1], 1), [1, 1, 1]);
    assert.equal(estPermutation([1, 2, 2, 4]), false);
  });
});

describe('PLNE de l’atelier', () => {
  it('vérifie profit et contraintes', () => {
    assert.equal(profitPlne(ATELIER, [3, 3]), 45);
    assert.equal(realisablePlne(ATELIER, [1, 4]), true);
    assert.equal(realisablePlne(ATELIER, [2, 4]), false);
    assert.equal(realisablePlne(ATELIER, [0, 5]), false);
    assert.equal(realisablePlne(ATELIER, [-1, 0]), false);
  });

  it('la relaxation continue donne la borne 46 en (8/3, 10/3)', () => {
    const { x, y, z } = relaxationContinue(ATELIER);
    assert.equal(arrondi(x, 6), arrondi(8 / 3, 6));
    assert.equal(arrondi(y, 6), arrondi(10 / 3, 6));
    assert.equal(arrondi(z, 6), 46);
  });

  it('l’optimum entier est (3, 3) avec z = 45', () => {
    assert.deepEqual(optimumEntier(ATELIER), { x: 3, y: 3, z: 45 });
  });

  it('la descente en meilleure amélioration se bloque en (1, 4) comme dans le cours', () => {
    assert.deepEqual(descentePlne(ATELIER, [0, 0]), [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4]]);
  });

  it('le polygone des contraintes a quatre sommets', () => {
    const sommets = sommetsPlne(ATELIER).map(([x, y]) => [arrondi(x, 3), arrondi(y, 3)]);
    assert.equal(sommets.length, 4);
    for (const sommet of [[0, 0], [6, 0], [2.667, 3.333], [0, 4.4]]) assert.ok(sommets.some(([x, y]) => x === sommet[0] && y === sommet[1]));
  });

  it('coupe le polygone au-dessus de la droite de l’objectif', () => {
    const morceau = couperPolygone(sommetsPlne(ATELIER), ATELIER.objectif, 45);
    assert.ok(morceau.length >= 3);
    assert.ok(morceau.every((point) => profitPlne(ATELIER, point) >= 45 - 1e-9));
    assert.deepEqual(couperPolygone(sommetsPlne(ATELIER), ATELIER.objectif, 47), []);
  });

  it('coupe une droite aux bords du graphique', () => {
    assert.deepEqual(segmentDansBoite([6, 9], 45, [7.5, 5.2]), [[0, 5], [7.5, 0]]);
    assert.deepEqual(segmentDansBoite([1, 1], 6, [7.5, 5.2]).map(([x, y]) => [arrondi(x), arrondi(y)]), [[0.8, 5.2], [6, 0]]);
    assert.equal(segmentDansBoite([6, 9], 200, [7.5, 5.2]), null);
  });
});

describe('jeu des classes de complexité', () => {
  it('chaque problème du cours a une zone dans chaque hypothèse', () => {
    assert.equal(PROBLEMES_CLASSES.length, 13);
    for (const { zones } of PROBLEMES_CLASSES) {
      assert.ok(zones.different in ZONES_CLASSES.different);
      assert.ok(zones.egal in ZONES_CLASSES.egal);
    }
  });

  it('suit le tableau du cours', () => {
    const zone = (numero, hypothese) => PROBLEMES_CLASSES.find((probleme) => probleme.numero === numero).zones[hypothese];
    assert.equal(zone(1, 'different'), 'p');
    assert.equal(zone(1, 'egal'), 'npc');
    assert.equal(zone(4, 'egal'), 'triviaux');
    assert.equal(zone(5, 'different'), 'intermediaire');
    assert.equal(zone(13, 'egal'), 'npd');
  });

  it('reconnaît la zone d’un clic dans la figure', () => {
    assert.equal(zoneDuPoint('different', 135, 210), 'p');
    assert.equal(zoneDuPoint('different', 290, 215), 'intermediaire');
    assert.equal(zoneDuPoint('different', 405, 205), 'npc');
    assert.equal(zoneDuPoint('different', 600, 205), 'npd');
    assert.equal(zoneDuPoint('different', 5, 5), null);
    assert.equal(zoneDuPoint('egal', 115, 205), 'triviaux');
    assert.equal(zoneDuPoint('egal', 330, 215), 'npc');
    assert.equal(zoneDuPoint('egal', 600, 340), 'npd');
  });

  it('chaque zone a assez de place pour les 13 jetons', () => {
    for (const hypothese of ['different', 'egal']) {
      for (const cle of Object.keys(ZONES_CLASSES[hypothese])) {
        const emplacements = emplacementsZone(hypothese, cle);
        assert.ok(emplacements.length >= PROBLEMES_CLASSES.length, `${hypothese}/${cle}`);
        assert.ok(emplacements.every(([x, y]) => zoneDuPoint(hypothese, x, y) === cle));
      }
    }
  });

  it('corrige un classement', () => {
    const parfait = new Map(PROBLEMES_CLASSES.map(({ numero, zones }) => [numero, zones.different]));
    assert.equal(corrigerClassement('different', parfait).bons, 13);
    parfait.set(8, 'npd');
    parfait.delete(1);
    const { bons, erreurs } = corrigerClassement('different', parfait);
    assert.equal(bons, 11);
    assert.deepEqual(erreurs, [{ numero: 1, attendu: 'p', donne: null }, { numero: 8, attendu: 'npc', donne: 'npd' }]);
  });
});
