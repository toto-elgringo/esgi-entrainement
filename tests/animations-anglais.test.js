import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  animationsAnglais,
  aireSurface,
  bilanPaquet,
  cadrage,
  cheminVague,
  COUCHES_CARTE,
  couchesSeChevauchent,
  decouperExemple,
  decouperPhrase,
  depuisLambert93,
  distanceKm,
  DUREE_LECTURE,
  etatShapefile,
  FICHIERS_SHAPEFILE,
  formatHorloge,
  kmParDegreLongitude,
  lireMots,
  matriceCouche,
  melanger,
  messageScore,
  mojibake,
  nouveauPaquet,
  ordreConseille,
  planLecture,
  pointAuBord,
  positionLecture,
  problemesOrdre,
  QUESTIONS_TEMPS,
  repondreCarte,
  TEMPS,
  versLambert93,
  VILLES,
} from '../js/animations/anglais.js';
import { ANIMATIONS, lireBloc } from '../js/animations/index.js';
import { aleatoire } from '../js/animations/outils.js';

describe('animations de l’anglais et du SIG', () => {
  it('sont enregistrées avec un titre, une consigne et une fonction de création', () => {
    for (const nom of ['frise-des-temps', 'cartes-vocabulaire', 'chrono-toeic', 'couches', 'shapefile', 'coordonnees']) {
      assert.equal(ANIMATIONS[nom], animationsAnglais[nom], nom);
      assert.equal(typeof animationsAnglais[nom].titre, 'string', nom);
      assert.equal(typeof animationsAnglais[nom].consigne, 'string', nom);
      assert.equal(typeof animationsAnglais[nom].creer, 'function', nom);
    }
  });

  it('mélange sans perdre ni dupliquer d’élément, de façon reproductible', () => {
    const liste = [1, 2, 3, 4, 5, 6, 7];
    const premier = melanger(liste, aleatoire(7));
    assert.deepEqual(premier, melanger(liste, aleatoire(7)));
    assert.deepEqual([...premier].sort((a, b) => a - b), liste);
    assert.deepEqual(liste, [1, 2, 3, 4, 5, 6, 7]);
  });
});

describe('frise des temps', () => {
  it('chaque temps a une forme, un exemple avec un verbe marqué et un dessin', () => {
    assert.equal(new Set(TEMPS.map(({ cle }) => cle)).size, TEMPS.length);
    for (const temps of TEMPS) {
      assert.ok(temps.forme && temps.quand && temps.indices.length, temps.cle);
      assert.ok(decouperExemple(temps.exemple).some(({ verbe }) => verbe), temps.cle);
      assert.ok(temps.dessin.length > 0, temps.cle);
    }
  });

  it('chaque question a un trou, une bonne réponse parmi des choix distincts, un temps connu et un indice présent', () => {
    const cles = new Set(TEMPS.map(({ cle }) => cle));
    for (const question of QUESTIONS_TEMPS) {
      assert.equal(question.phrase.split('___').length, 2, question.phrase);
      assert.ok(question.choix.includes(question.reponse), question.phrase);
      assert.equal(new Set(question.choix).size, question.choix.length, question.phrase);
      assert.ok(cles.has(question.temps), question.phrase);
      assert.ok(question.phrase.includes(question.indice), question.phrase);
    }
  });

  it('découpe un exemple en texte et verbes', () => {
    assert.deepEqual(decouperExemple('She [phoned] ten minutes ago.'), [
      { texte: 'She ', verbe: false },
      { texte: 'phoned', verbe: true },
      { texte: ' ten minutes ago.', verbe: false },
    ]);
  });

  it('découpe une phrase à trous et repère l’indice', () => {
    assert.deepEqual(decouperPhrase('I ___ him yesterday.', 'yesterday'), [
      { type: 'texte', texte: 'I ' },
      { type: 'trou', texte: '' },
      { type: 'texte', texte: ' him ' },
      { type: 'indice', texte: 'yesterday' },
      { type: 'texte', texte: '.' },
    ]);
    assert.deepEqual(decouperPhrase('Listen! Someone ___.', 'Listen!').map(({ type }) => type), ['indice', 'texte', 'trou', 'texte']);
  });

  it('trace une vague qui part et arrive aux bonnes abscisses', () => {
    const chemin = cheminVague(10, 70, 120);
    assert.ok(chemin.startsWith('M10.0,120.0'));
    assert.ok(chemin.includes('70.0,'));
  });

  it('commente le score', () => {
    assert.equal(messageScore(8, 8), 'Parfait, aucune erreur !');
    assert.match(messageScore(1, 8), /retravailler/);
  });
});

describe('cartes de vocabulaire', () => {
  it('lit les mots du bloc', () => {
    assert.deepEqual(lireMots('invoice = facture ; deadline = date limite ;; mauvais ; = rien'), [
      { anglais: 'invoice', francais: 'facture' },
      { anglais: 'deadline', francais: 'date limite' },
    ]);
  });

  it('lit les mots écrits dans l’option d’un bloc anim', () => {
    const { options } = lireBloc('cartes-vocabulaire\nmots: billion = milliard ; fee = frais, honoraires\n');
    assert.deepEqual(lireMots(options.mots), [
      { anglais: 'billion', francais: 'milliard' },
      { anglais: 'fee', francais: 'frais, honoraires' },
    ]);
  });

  it('remet une carte ratée en fin de paquet et compte les mots sus du premier coup', () => {
    let paquet = { file: [0, 1, 2], sues: [], ratees: [] };
    paquet = repondreCarte(paquet, true);
    paquet = repondreCarte(paquet, false);
    assert.deepEqual(paquet.file, [2, 1]);
    paquet = repondreCarte(paquet, true);
    paquet = repondreCarte(paquet, false);
    paquet = repondreCarte(paquet, true);
    assert.deepEqual(bilanPaquet(paquet), { premierCoup: 2, ratees: 1, restantes: 0, termine: true });
    assert.equal(repondreCarte(paquet, true), paquet);
  });

  it('crée un paquet mélangé avec toutes les cartes', () => {
    const paquet = nouveauPaquet([0, 1, 2, 3], aleatoire(3));
    assert.deepEqual([...paquet.file].sort(), [0, 1, 2, 3]);
    assert.deepEqual(bilanPaquet(paquet), { premierCoup: 0, ratees: 0, restantes: 4, termine: false });
  });

  it('les blocs des cours de vocabulaire contiennent des mots valides', async () => {
    const { readFile } = await import('node:fs/promises');
    for (const chapitre of ['04-vocabulaire-entreprise-et-bureau', '05-vocabulaire-finance-et-commerce', '06-vocabulaire-voyages-et-quotidien', '07-vocabulaire-verbes-adjectifs-liaison']) {
      const cours = await readFile(new URL(`../contenu/anglais/${chapitre}/cours.md`, import.meta.url), 'utf8');
      const bloc = cours.match(/```anim\n(cartes-vocabulaire[\s\S]*?)```/);
      assert.ok(bloc, chapitre);
      assert.ok(lireMots(lireBloc(bloc[1]).options.mots).length >= 10, chapitre);
    }
  });
});

describe('chrono du TOEIC', () => {
  it('le rythme conseillé tient dans les 75 minutes', () => {
    const plan = planLecture([30, 30, 50]);
    assert.equal(plan.avantPartie7, 23 * 60);
    assert.equal(plan.total, 68 * 60);
    assert.equal(plan.depasse, false);
    assert.equal(plan.alerte, false);
    assert.equal(plan.nonTraitees, 0);
  });

  it('trop lent en partie 5 : alerte et questions de partie 7 non traitées', () => {
    const plan = planLecture([60, 30, 50]);
    assert.equal(plan.avantPartie7, 38 * 60);
    assert.equal(plan.alerte, true);
    assert.equal(plan.depasse, true);
    assert.equal(plan.parties[2].traitees, Math.floor((DUREE_LECTURE - 38 * 60) / 50));
    assert.equal(plan.nonTraitees, 54 - 44);
  });

  it('situe un instant dans une partie et une question', () => {
    const plan = planLecture([30, 30, 50]);
    assert.deepEqual(positionLecture(plan, 0), { fini: false, partie: 5, question: 1, total: 30 });
    assert.deepEqual(positionLecture(plan, 905), { fini: false, partie: 6, question: 1, total: 16 });
    assert.equal(positionLecture(plan, 68 * 60).fini, true);
    assert.equal(positionLecture(planLecture([60, 60, 90]), DUREE_LECTURE).fini, true);
  });

  it('écrit une horloge mm:ss', () => {
    assert.equal(formatHorloge(4500), '75:00');
    assert.equal(formatHorloge(65.4), '01:05');
    assert.equal(formatHorloge(-3), '00:00');
  });
});

describe('couches de QGIS', () => {
  const couche = (id) => COUCHES_CARTE.find((element) => element.id === id);

  it('calcule l’aire d’un polygone', () => {
    assert.equal(aireSurface([[0, 0], [10, 0], [10, 5], [0, 5]]), 50);
  });

  it('range points, puis lignes, puis surfaces de la plus petite à la plus grande', () => {
    const ordre = ordreConseille(COUCHES_CARTE).map(({ geometrie }) => geometrie);
    assert.deepEqual(ordre, ['point', 'ligne', 'ligne', 'surface', 'surface', 'surface']);
    assert.equal(ordreConseille(COUCHES_CARTE).at(-1).id, 'arrondissement');
    assert.deepEqual(problemesOrdre(ordreConseille(COUCHES_CARTE)), []);
  });

  it('signale une grande surface posée sur les autres couches', () => {
    const problemes = problemesOrdre(COUCHES_CARTE);
    assert.ok(problemes.length > 0);
    assert.equal(problemes[0].dessus.id, 'arrondissement');
    assert.deepEqual(problemesOrdre(COUCHES_CARTE, new Set(['adresse', 'route'])), []);
  });

  it('ne signale pas deux couches qui ne se touchent pas', () => {
    assert.equal(couchesSeChevauchent(couche('vegetation'), couche('batiment')), false);
    assert.equal(couchesSeChevauchent(couche('arrondissement'), couche('adresse')), true);
  });

  it('passe de la vue du dessus à la vue éclatée', () => {
    const [a, , c, d, , f] = matriceCouche(0, 0, 6);
    assert.equal(c, 0);
    assert.equal(a, d);
    assert.equal(f, matriceCouche(0, 5, 6)[5]);
    const bas = matriceCouche(1, 0, 6);
    const haut = matriceCouche(1, 5, 6);
    assert.ok(bas[5] > haut[5]);
    assert.ok(bas[3] < 1);
  });
});

describe('coordonnées et Lambert 93', () => {
  it('projette le point d’origine et Paris aux bonnes coordonnées', () => {
    const origine = versLambert93(46.5, 3);
    assert.ok(Math.abs(origine.x - 700000) < 1e-6);
    assert.ok(Math.abs(origine.y - 6600000) < 1e-6);
    const paris = versLambert93(48.8566, 2.3522);
    assert.ok(Math.abs(paris.x - 652469) < 2);
    assert.ok(Math.abs(paris.y - 6862035) < 2);
  });

  it('revient aux degrés sans perte', () => {
    for (const { latitude, longitude } of VILLES) {
      const { x, y } = versLambert93(latitude, longitude);
      const retour = depuisLambert93(x, y);
      assert.ok(Math.abs(retour.latitude - latitude) < 1e-8);
      assert.ok(Math.abs(retour.longitude - longitude) < 1e-8);
    }
  });

  it('mesure Paris - Marseille en mètres, environ 660 km', () => {
    const [paris, marseille] = ['Paris', 'Marseille'].map((nom) => VILLES.find((ville) => ville.nom === nom));
    const km = distanceKm(versLambert93(paris.latitude, paris.longitude), versLambert93(marseille.latitude, marseille.longitude));
    assert.ok(km > 655 && km < 665, String(km));
  });

  it('un degré de longitude rétrécit vers les pôles', () => {
    assert.ok(Math.abs(kmParDegreLongitude(0) - 111.32) < 1e-9);
    assert.ok(kmParDegreLongitude(48.85) > 72 && kmParDegreLongitude(48.85) < 74);
  });

  it('des degrés lus comme des mètres tombent loin au sud', () => {
    const { latitude } = depuisLambert93(2.3522, 48.8566);
    assert.ok(latitude < 0);
  });

  it('cadre des points dans le dessin et revient en arrière', () => {
    const vue = cadrage([{ x: 0, y: 0 }, { x: 100, y: 50 }], 220, 120, 10);
    assert.deepEqual(vue.versSvg({ x: 0, y: 0 }), { x: 10, y: 110 });
    assert.deepEqual(vue.versSvg({ x: 100, y: 50 }), { x: 210, y: 10 });
    assert.deepEqual(vue.depuisSvg({ x: 110, y: 60 }), { x: 50, y: 25 });
  });

  it('arrête une flèche au bord du dessin', () => {
    const bord = pointAuBord({ x: 50, y: 50 }, { x: 50, y: 500 }, 100, 100, 10);
    assert.equal(bord.x, 50);
    assert.ok(Math.abs(bord.y - 90) < 1e-9);
    assert.deepEqual(pointAuBord({ x: 50, y: 50 }, { x: 60, y: 60 }, 100, 100), { x: 60, y: 60 });
  });
});

describe('Shapefile', () => {
  const tous = FICHIERS_SHAPEFILE.map(({ extension }) => extension);

  it('avec les cinq fichiers, tout fonctionne', () => {
    assert.deepEqual(etatShapefile(tous), { ouvrable: true, systeme: 'EPSG:2154', accents: true, raisons: [] });
  });

  it('sans .shp, .shx ou .dbf, la couche est inutilisable', () => {
    for (const manquant of ['shp', 'shx', 'dbf']) {
      const etat = etatShapefile(tous.filter((extension) => extension !== manquant));
      assert.equal(etat.ouvrable, false, manquant);
      assert.equal(etat.raisons.length, 1, manquant);
    }
  });

  it('sans .prj, pas de système ; sans .cpg, pas d’accents', () => {
    assert.equal(etatShapefile(tous.filter((extension) => extension !== 'prj')).systeme, null);
    assert.equal(etatShapefile(tous.filter((extension) => extension !== 'cpg')).accents, false);
  });

  it('abîme les accents comme un mauvais encodage', () => {
    assert.equal(mojibake('Église'), 'Ã‰glise');
    assert.equal(mojibake('Hôtel de Ville'), 'HÃ´tel de Ville');
    assert.equal(mojibake('Paris'), 'Paris');
  });
});
