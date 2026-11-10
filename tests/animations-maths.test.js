import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  animationsMaths,
  arrondirAu,
  carresEscalier,
  combinaison,
  coordonneesDansBase,
  deriveeNumerique,
  domaineTangente,
  droiteTangente,
  ecrireEnsemble,
  ecrireSomme,
  elementsDesZones,
  evaluerQuantificateurs,
  FONCTIONS_INTEGRALE,
  FONCTIONS_TANGENTE,
  fractionPi,
  memesZones,
  OPERATIONS_VENN,
  parametreLePlusProche,
  pasGraduation,
  pointeFleche,
  rectanglesRiemann,
  reflet,
  retournerCarre,
  sommeEntiers,
  sommeRiemann,
  sontColineaires,
  zonesDe,
} from '../js/animations/maths.js';

const proche = (valeur, attendu, tolerance = 1e-9) => assert.ok(Math.abs(valeur - attendu) < tolerance, `${valeur} ≠ ${attendu}`);

describe('animations des maths', () => {
  it('chaque animation a un titre, une consigne et une fonction de création', () => {
    for (const [nom, animation] of Object.entries(animationsMaths)) {
      assert.equal(typeof animation.titre, 'string', nom);
      assert.equal(typeof animation.consigne, 'string', nom);
      assert.equal(typeof animation.creer, 'function', nom);
    }
  });

  it('les cours de maths n’utilisent que des animations connues', async () => {
    const { readdir, readFile } = await import('node:fs/promises');
    const dossier = new URL('../contenu/maths/', import.meta.url);
    const chapitres = (await readdir(dossier, { withFileTypes: true })).filter((entree) => entree.isDirectory());
    const utilisees = [];
    for (const chapitre of chapitres) {
      const cours = await readFile(new URL(`${chapitre.name}/cours.md`, dossier), 'utf8');
      for (const [, nom] of cours.matchAll(/```anim\r?\n([^\r\n]+)/g)) utilisees.push(nom.trim());
    }
    assert.ok(utilisees.length >= 5);
    for (const nom of utilisees) assert.ok(animationsMaths[nom], nom);
  });
});

describe('outils de dessin', () => {
  it('écrit les multiples de π/2', () => {
    assert.equal(fractionPi(0), '0');
    assert.equal(fractionPi(Math.PI / 2), 'π/2');
    assert.equal(fractionPi(Math.PI), 'π');
    assert.equal(fractionPi((3 * Math.PI) / 2), '3π/2');
    assert.equal(fractionPi(2 * Math.PI), '2π');
    assert.equal(fractionPi(-Math.PI / 2), '−π/2');
    assert.equal(fractionPi(1), null);
  });

  it('choisit un pas de graduation lisible', () => {
    assert.equal(pasGraduation(6), 1);
    assert.equal(pasGraduation(11), 2);
    assert.equal(pasGraduation(3.2), 0.5);
  });

  it('arrondit sans produire de zéro négatif', () => {
    assert.equal(arrondirAu(1.26, 1), 1.3);
    assert.ok(Object.is(arrondirAu(-0.01, 1), 0));
  });
});

describe('diagramme de Venn', () => {
  it('retrouve les opérations de l’exemple du cours', () => {
    assert.deepEqual(elementsDesZones(zonesDe('union')), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(elementsDesZones(zonesDe('inter')), [3, 4]);
    assert.deepEqual(elementsDesZones(zonesDe('a-sauf-b')), [1, 2]);
    assert.deepEqual(elementsDesZones(zonesDe('b-sauf-a')), [5, 6]);
  });

  it('vérifie les lois de De Morgan', () => {
    assert.ok(memesZones(zonesDe('non-union'), zonesDe('inter-non')));
    assert.ok(memesZones(zonesDe('non-inter'), zonesDe('union-non')));
    assert.ok(!memesZones(zonesDe('non-union'), zonesDe('union-non')));
  });

  it('la différence n’est pas symétrique', () => {
    assert.ok(!memesZones(zonesDe('a-sauf-b'), zonesDe('b-sauf-a')));
  });

  it('chaque opération a une zone et un nom', () => {
    for (const operation of OPERATIONS_VENN) {
      assert.ok(zonesDe(operation.cle).length > 0, operation.cle);
      assert.ok(operation.nom.length > 0, operation.cle);
    }
  });

  it('écrit un ensemble ou l’ensemble vide', () => {
    assert.equal(ecrireEnsemble([3, 4]), '{3, 4}');
    assert.equal(ecrireEnsemble([]), '∅');
  });
});

describe('ordre des quantificateurs', () => {
  const lire = (cases) => cases.map((ligne) => ligne.map((valeur) => valeur === 1));

  it('chacun son manager : ∀∃ vrai, ∃∀ faux', () => {
    const resultat = evaluerQuantificateurs(lire([[1, 0, 0], [0, 1, 0], [0, 1, 0]]));
    assert.equal(resultat.pourToutIlExiste, true);
    assert.equal(resultat.ilExistePourTout, false);
    assert.deepEqual(resultat.temoins, [0, 1, 1]);
  });

  it('un chef pour tous rend les deux phrases vraies', () => {
    const resultat = evaluerQuantificateurs(lire([[0, 1, 0], [1, 1, 0], [0, 1, 1]]));
    assert.equal(resultat.pourToutIlExiste, true);
    assert.equal(resultat.ilExistePourTout, true);
    assert.deepEqual(resultat.colonnesPleines, [1]);
  });

  it('un employé sans manager est un contre-exemple', () => {
    const resultat = evaluerQuantificateurs(lire([[1, 0], [0, 0]]));
    assert.equal(resultat.pourToutIlExiste, false);
    assert.deepEqual(resultat.lignesSansTemoin, [1]);
  });
});

describe('somme de Gauss', () => {
  it('donne n(n + 1)/2', () => {
    for (let n = 1; n <= 30; n += 1) {
      const attendu = Array.from({ length: n }, (_, i) => i + 1).reduce((total, k) => total + k, 0);
      assert.equal(sommeEntiers(n), attendu);
    }
  });

  it('l’escalier a bien 1 + 2 + … + n carrés', () => {
    assert.equal(carresEscalier(6).length, 21);
  });

  it('l’escalier et sa copie retournée remplissent un rectangle n × (n + 1) sans se chevaucher', () => {
    for (const n of [1, 4, 9]) {
      const escalier = carresEscalier(n);
      const cases = [...escalier, ...escalier.map((carre) => retournerCarre(n, carre))].map(({ colonne, rang }) => `${colonne},${rang}`);
      assert.equal(new Set(cases).size, n * (n + 1));
      assert.ok(cases.every((cle) => {
        const [colonne, rang] = cle.split(',').map(Number);
        return colonne >= 0 && colonne < n && rang >= 0 && rang <= n;
      }));
    }
  });

  it('écrit la somme en entier quand elle est courte', () => {
    assert.equal(ecrireSomme(4), '1 + 2 + 3 + 4');
    assert.equal(ecrireSomme(10), '1 + 2 + … + 10');
  });
});

describe('exp et ln', () => {
  it('le reflet échange les coordonnées', () => {
    assert.deepEqual(reflet({ x: 1, y: Math.E }), { x: Math.E, y: 1 });
  });

  it('trouve le point de la courbe le plus proche du doigt', () => {
    const surExp = (t) => ({ x: t, y: Math.exp(t) });
    proche(parametreLePlusProche({ x: 0.02, y: 1.01 }, surExp, -3, 2, 500), 0, 0.02);
    proche(parametreLePlusProche({ x: 1.4, y: 3 }, surExp, -3, 2, 500), Math.log(3), 0.15);
  });
});

describe('tangente', () => {
  it('la dérivée de chaque fonction correspond à la pente calculée', () => {
    for (const fonction of FONCTIONS_TANGENTE) {
      const [debut, fin] = domaineTangente(fonction);
      for (let i = 1; i < 10; i += 1) {
        const x = debut + ((fin - debut) * i) / 10;
        if (fonction.pointe !== undefined && Math.abs(x - fonction.pointe) < 0.01) continue;
        proche(deriveeNumerique(fonction.f, x), fonction.fp(x), 1e-4);
      }
    }
  });

  it('calcule la droite tangente à x² en 1', () => {
    const carre = FONCTIONS_TANGENTE.find(({ cle }) => cle === 'carre');
    assert.deepEqual(droiteTangente(carre, 1), { pente: 2, ordonnee: -1 });
  });

  it('chaque point de départ est dans le domaine', () => {
    for (const fonction of FONCTIONS_TANGENTE) {
      const [debut, fin] = domaineTangente(fonction);
      assert.ok(fonction.depart >= debut && fonction.depart <= fin, fonction.cle);
    }
  });
});

describe('intégrale par les rectangles', () => {
  const identite = (x) => x;

  it('calcule les sommes à gauche et à droite de l’exemple du cours', () => {
    assert.equal(sommeRiemann(identite, 0, 4, 4, 'gauche'), 6);
    assert.equal(sommeRiemann(identite, 0, 4, 4, 'droite'), 10);
  });

  it('la méthode du milieu est exacte pour une fonction affine', () => {
    proche(sommeRiemann((x) => 2 * x + 1, 1, 3, 3, 'milieu'), 10);
  });

  it('les rectangles couvrent l’intervalle', () => {
    const rectangles = rectanglesRiemann(identite, 1, 3, 5, 'droite');
    assert.equal(rectangles.length, 5);
    proche(rectangles[0].x, 1);
    proche(rectangles.at(-1).x + rectangles.at(-1).largeur, 3);
    proche(rectangles[0].echantillon, 1.4);
  });

  it('la somme se rapproche de la valeur exacte quand n augmente', () => {
    for (const { cle, f, intervalle: [debut, fin], exacte } of FONCTIONS_INTEGRALE) {
      const grossier = Math.abs(sommeRiemann(f, debut, fin, 4, 'gauche') - exacte);
      const fin100 = Math.abs(sommeRiemann(f, debut, fin, 100, 'gauche') - exacte);
      assert.ok(fin100 < 0.1, cle);
      assert.ok(fin100 <= grossier + 1e-12, cle);
    }
  });

  it('une aire sous l’axe compte en négatif', () => {
    proche(sommeRiemann(Math.sin, Math.PI, 2 * Math.PI, 200, 'milieu'), -2, 1e-4);
  });
});

describe('vecteurs', () => {
  it('calcule une combinaison linéaire', () => {
    assert.deepEqual(combinaison(3, { x: 1, y: 0 }, -2, { x: 0, y: 1 }), { x: 3, y: -2 });
  });

  it('retrouve les coordonnées de (4, 2) dans la base (1, 1), (1, −1)', () => {
    assert.deepEqual(coordonneesDansBase({ x: 4, y: 2 }, { x: 1, y: 1 }, { x: 1, y: -1 }), { a: 3, b: 1 });
  });

  it('reconnaît une famille liée', () => {
    assert.ok(sontColineaires({ x: 1, y: 2 }, { x: 2, y: 4 }));
    assert.ok(sontColineaires({ x: 0, y: 0 }, { x: 3, y: 1 }));
    assert.ok(!sontColineaires({ x: 1, y: 0 }, { x: 0, y: 1 }));
    assert.equal(coordonneesDansBase({ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 4 }), null);
  });

  it('dessine une pointe de flèche au bout du vecteur', () => {
    const { base, pointe } = pointeFleche({ x: 0, y: 0 }, { x: 100, y: 0 }, 10);
    assert.deepEqual(base, { x: 90, y: 0 });
    assert.deepEqual(pointe[0], { x: 100, y: 0 });
    assert.equal(pointeFleche({ x: 5, y: 5 }, { x: 5, y: 5 }), null);
  });
});
