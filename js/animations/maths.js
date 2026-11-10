import { attendre, boucle, bornes, bouton, choix, commandes, creerSvg, curseur, echelle, glisser, html, info, nombre, svg } from './outils.js';

const PI = Math.PI;

let compteurIdentifiants = 0;

function identifiant(prefixe) {
  compteurIdentifiants += 1;
  return `${prefixe}-${compteurIdentifiants}`;
}

function arrondir(valeur) {
  return Math.round(valeur * 10) / 10;
}

export function arrondirAu(valeur, decimales) {
  const facteur = 10 ** decimales;
  return Math.round(valeur * facteur) / facteur + 0;
}

function lisser(t) {
  return t * t * (3 - 2 * t);
}

export function fractionPi(x, tolerance = 1e-6) {
  const k = Math.round(x / (PI / 2));
  if (Math.abs(x - (k * PI) / 2) > tolerance) return null;
  if (k === 0) return '0';
  const signe = k < 0 ? '−' : '';
  const multiple = Math.abs(k);
  if (multiple % 2 === 0) return `${signe}${multiple === 2 ? '' : multiple / 2}π`;
  return `${signe}${multiple === 1 ? '' : multiple}π/2`;
}

export function pasGraduation(etendue, maximum = 8) {
  return [0.25, 0.5, 1, 2, 5, 10, 20, 50].find((pas) => etendue / pas <= maximum) ?? 100;
}

function graduer(groupe, versX, versY, [xMin, xMax, yMin, yMax], options = {}) {
  const { pasX = pasGraduation(xMax - xMin), pasY = pasGraduation(yMax - yMin), formatX = (x) => nombre(x) } = options;
  const gauche = versX(xMin);
  const droite = versX(xMax);
  const haut = versY(yMax);
  const bas = versY(yMin);
  const ligneEtiquettesX = bornes(versY(0) + 15, haut + 12, bas - 3);
  const colonneEtiquettesY = bornes(versX(0) - 5, gauche + 24, droite - 3);
  for (let i = Math.ceil(xMin / pasX - 1e-9); i * pasX <= xMax + 1e-9; i += 1) {
    const x = versX(i * pasX);
    svg('line', { x1: x, x2: x, y1: haut, y2: bas, classe: 'anim-grille' }, groupe);
    if (i !== 0) svg('text', { x, y: ligneEtiquettesX, 'text-anchor': 'middle', classe: 'anim-graduation', texte: formatX(i * pasX) }, groupe);
  }
  for (let i = Math.ceil(yMin / pasY - 1e-9); i * pasY <= yMax + 1e-9; i += 1) {
    const y = versY(i * pasY);
    svg('line', { x1: gauche, x2: droite, y1: y, y2: y, classe: 'anim-grille' }, groupe);
    if (i !== 0) svg('text', { x: colonneEtiquettesY, y: y + 4, 'text-anchor': 'end', classe: 'anim-graduation', texte: nombre(i * pasY) }, groupe);
  }
  if (yMin <= 0 && yMax >= 0) svg('line', { x1: gauche, x2: droite, y1: versY(0), y2: versY(0), classe: 'anim-axe' }, groupe);
  if (xMin <= 0 && xMax >= 0) svg('line', { x1: versX(0), x2: versX(0), y1: haut, y2: bas, classe: 'anim-axe' }, groupe);
}

function tracerCourbe(groupe, f, [debut, fin], versX, versY, attributs, pas = 240) {
  const segments = [[]];
  for (let i = 0; i <= pas; i += 1) {
    const x = debut + ((fin - debut) * i) / pas;
    const y = f(x);
    if (!Number.isFinite(y)) {
      if (segments.at(-1).length) segments.push([]);
      continue;
    }
    segments.at(-1).push(`${arrondir(versX(x))},${arrondir(bornes(versY(y), -5000, 5000))}`);
  }
  for (const segment of segments) {
    if (segment.length > 1) svg('polyline', { points: segment.join(' '), ...attributs }, groupe);
  }
}

function groupeCoupe(parent, x, y, largeur, hauteur) {
  const id = identifiant('anim-maths-coupe');
  const definitions = svg('defs', {}, parent);
  const coupe = svg('clipPath', { id }, definitions);
  svg('rect', { x, y, width: largeur, height: hauteur }, coupe);
  return svg('g', { 'clip-path': `url(#${id})` }, parent);
}

function ligne(groupe, [x1, y1], [x2, y2], attributs) {
  return svg('line', { x1, y1, x2, y2, ...attributs }, groupe);
}

export const ZONES_VENN = [
  { cle: 'a', dansA: true, dansB: false, elements: [1, 2] },
  { cle: 'ab', dansA: true, dansB: true, elements: [3, 4] },
  { cle: 'b', dansA: false, dansB: true, elements: [5, 6] },
  { cle: 'e', dansA: false, dansB: false, elements: [7, 8] },
];

const barre = (texte) => `<span class="venn-barre">${texte}</span>`;

export const OPERATIONS_VENN = [
  { cle: 'union', nom: 'A ∪ B', lecture: 'les éléments de A <strong>ou</strong> de B (ou des deux)', sql: 'UNION', garde: (a, b) => a || b },
  { cle: 'inter', nom: 'A ∩ B', lecture: 'les éléments de A <strong>et</strong> de B', sql: 'INTERSECT', garde: (a, b) => a && b },
  { cle: 'a-sauf-b', nom: 'A \\ B', lecture: 'les éléments de A qui ne sont <strong>pas</strong> dans B', sql: 'A EXCEPT B', garde: (a, b) => a && !b },
  { cle: 'b-sauf-a', nom: 'B \\ A', lecture: 'les éléments de B qui ne sont pas dans A : ce n’est pas A \\ B', sql: 'B EXCEPT A', garde: (a, b) => b && !a },
  { cle: 'delta', nom: 'A Δ B', lecture: 'dans A ou dans B, mais pas dans les deux (différence symétrique)', garde: (a, b) => a !== b },
  { cle: 'non-a', nom: barre('A'), lecture: 'les éléments de E qui ne sont pas dans A', garde: (a) => !a },
  { cle: 'non-b', nom: barre('B'), lecture: 'les éléments de E qui ne sont pas dans B', garde: (a, b) => !b },
  { cle: 'non-union', nom: barre('A ∪ B'), lecture: 'ni dans A, ni dans B', garde: (a, b) => !(a || b) },
  { cle: 'non-inter', nom: barre('A ∩ B'), lecture: 'pas dans les deux à la fois', garde: (a, b) => !(a && b) },
  { cle: 'inter-non', nom: `${barre('A')} ∩ ${barre('B')}`, lecture: 'hors de A et hors de B', garde: (a, b) => !a && !b },
  { cle: 'union-non', nom: `${barre('A')} ∪ ${barre('B')}`, lecture: 'hors de A ou hors de B', garde: (a, b) => !a || !b },
];

function operationVenn(cle) {
  return OPERATIONS_VENN.find((operation) => operation.cle === cle);
}

export function zonesDe(cle) {
  const { garde } = operationVenn(cle);
  return ZONES_VENN.filter(({ dansA, dansB }) => garde(dansA, dansB)).map((zone) => zone.cle);
}

export function elementsDesZones(zones) {
  return ZONES_VENN.filter(({ cle }) => zones.includes(cle)).flatMap(({ elements }) => elements).sort((x, y) => x - y);
}

export function memesZones(premieres, secondes) {
  return premieres.length === secondes.length && premieres.every((zone) => secondes.includes(zone));
}

export function ecrireEnsemble(elements) {
  return elements.length ? `{${elements.join(', ')}}` : '∅';
}

const GEOMETRIE_VENN = { ax: 150, bx: 250, cy: 132, r: 82, cadre: { x: 8, y: 8, largeur: 384, hauteur: 248 } };

const POSITIONS_ELEMENTS = {
  1: [100, 116], 2: [114, 162], 3: [200, 116], 4: [200, 162],
  5: [300, 116], 6: [286, 162], 7: [38, 236], 8: [362, 38],
};

function cheminsVenn({ ax, bx, cy, r, cadre }) {
  const milieu = (ax + bx) / 2;
  const demiCorde = Math.sqrt(r * r - ((bx - ax) / 2) ** 2);
  const haut = `${milieu} ${cy - demiCorde}`;
  const bas = `${milieu} ${cy + demiCorde}`;
  const arc = (grand, sens, fin) => `A ${r} ${r} 0 ${grand} ${sens} ${fin}`;
  const contourUnion = `M ${haut} ${arc(1, 0, bas)} ${arc(1, 0, haut)} Z`;
  return {
    a: `M ${haut} ${arc(1, 0, bas)} ${arc(0, 1, haut)} Z`,
    ab: `M ${haut} ${arc(0, 1, bas)} ${arc(0, 1, haut)} Z`,
    b: `M ${haut} ${arc(1, 1, bas)} ${arc(0, 0, haut)} Z`,
    e: `M ${cadre.x} ${cadre.y} h ${cadre.largeur} v ${cadre.hauteur} h ${-cadre.largeur} Z ${contourUnion}`,
  };
}

function creerDiagrammeVenn(parent, auClic) {
  const { ax, bx, cy, r, cadre } = GEOMETRIE_VENN;
  const dessin = creerSvg(parent, 400, 264, 'venn');
  const chemins = cheminsVenn(GEOMETRIE_VENN);
  const couches = {};
  for (const { cle } of ZONES_VENN) {
    const base = svg('path', { d: chemins[cle], classe: 'venn-zone' }, dessin);
    couches[cle] = {
      base,
      calque1: svg('path', { d: chemins[cle], classe: 'venn-calque venn-calque-1' }, dessin),
      calque2: svg('path', { d: chemins[cle], classe: 'venn-calque venn-calque-2' }, dessin),
    };
    if (auClic) {
      base.classList.add('cliquable');
      base.addEventListener('click', () => auClic(cle));
    }
  }
  svg('rect', { x: cadre.x, y: cadre.y, width: cadre.largeur, height: cadre.hauteur, rx: 10, classe: 'venn-contour' }, dessin);
  svg('circle', { cx: ax, cy, r, classe: 'venn-contour' }, dessin);
  svg('circle', { cx: bx, cy, r, classe: 'venn-contour' }, dessin);
  svg('text', { x: ax - 64, y: cy - 66, classe: 'venn-nom', texte: 'A' }, dessin);
  svg('text', { x: bx + 54, y: cy - 66, classe: 'venn-nom', texte: 'B' }, dessin);
  svg('text', { x: cadre.x + 12, y: cadre.y + 22, classe: 'venn-nom', texte: 'E' }, dessin);
  for (const [element, [x, y]] of Object.entries(POSITIONS_ELEMENTS)) {
    svg('text', { x, y, 'text-anchor': 'middle', classe: 'venn-element', texte: element }, dessin);
  }
  return {
    element: dessin,
    colorier({ allumees = [], calque1 = [], calque2 = [] } = {}) {
      for (const [cle, couche] of Object.entries(couches)) {
        couche.base.classList.toggle('allume', allumees.includes(cle));
        couche.calque1.classList.toggle('visible', calque1.includes(cle));
        couche.calque2.classList.toggle('visible', calque2.includes(cle));
      }
    },
  };
}

const LOIS_DE_MORGAN = [
  { cle: 'loi-union', texte: 'Complémentaire d’une union', gauche: 'non-union', avant: 'union', droite: 'inter-non', garder: 'ce qui est colorié deux fois', logique: 'NOT (P OR Q) = NOT P AND NOT Q' },
  { cle: 'loi-inter', texte: 'Complémentaire d’une intersection', gauche: 'non-inter', avant: 'inter', droite: 'union-non', garder: 'ce qui est colorié au moins une fois', logique: 'NOT (P AND Q) = NOT P OR NOT Q' },
];

function creerVenn(zone, options) {
  const barreModes = commandes(zone);
  html('p', { classe: 'anim-info', html: 'E = {1, …, 8}, A = {1, 2, 3, 4}, B = {3, 4, 5, 6}' }, zone);
  const scene = html('div', { classe: 'venn-scene' }, zone);
  const message = info(zone);
  let jeton = 0;
  const modes = { explorer: modeExplorer, 'de-morgan': modeDeMorgan, defi: modeDefi };
  const depart = modes[options.mode] ? options.mode : 'explorer';
  choix(barreModes, {
    options: [{ valeur: 'explorer', texte: 'Explorer' }, { valeur: 'de-morgan', texte: 'De Morgan' }, { valeur: 'defi', texte: 'Défi' }],
    valeur: depart,
    auChangement: lancer,
  });

  function lancer(mode) {
    jeton += 1;
    scene.replaceChildren();
    message.textContent = '';
    modes[mode]();
  }

  function modeExplorer() {
    const puces = html('div', { classe: 'anim-choix venn-puces', role: 'group' }, scene);
    const diagramme = creerDiagrammeVenn(scene);
    const boutons = OPERATIONS_VENN.slice(0, 7).map((operation) => {
      const element = html('button', { type: 'button', classe: 'anim-puce', html: operation.nom }, puces);
      element.addEventListener('click', () => montrer(operation));
      return { operation, element };
    });
    function montrer(operation) {
      for (const { operation: autre, element } of boutons) element.classList.toggle('actif', autre === operation);
      const zones = zonesDe(operation.cle);
      diagramme.colorier({ allumees: zones });
      const sql = operation.sql ? ` En SQL : <code>${operation.sql}</code>.` : '';
      message.innerHTML = `${operation.nom} = <strong>${ecrireEnsemble(elementsDesZones(zones))}</strong> : ${operation.lecture}.${sql}`;
    }
    montrer(OPERATIONS_VENN[0]);
  }

  function modeDeMorgan() {
    const ligneLois = commandes(scene);
    let loiActuelle = LOIS_DE_MORGAN[0];
    choix(ligneLois, {
      options: LOIS_DE_MORGAN.map(({ cle, texte }) => ({ valeur: cle, texte })),
      valeur: loiActuelle.cle,
      auChangement: (cle) => rejouer(LOIS_DE_MORGAN.find((loi) => loi.cle === cle)),
    });
    bouton(ligneLois, 'Rejouer', () => rejouer(loiActuelle));
    const duo = html('div', { classe: 'venn-duo' }, scene);
    const moitie = () => {
      const conteneur = html('div', { classe: 'venn-moitie' }, duo);
      const titre = html('p', { classe: 'venn-legende' }, conteneur);
      const diagramme = creerDiagrammeVenn(conteneur);
      const etape = html('p', { classe: 'venn-etape' }, conteneur);
      return { titre, diagramme, etape };
    };
    const gauche = moitie();
    const droite = moitie();

    async function jouer(loi) {
      loiActuelle = loi;
      jeton += 1;
      const mien = jeton;
      const nom = (cle) => operationVenn(cle).nom;
      gauche.titre.innerHTML = nom(loi.gauche);
      droite.titre.innerHTML = nom(loi.droite);
      gauche.diagramme.colorier();
      droite.diagramme.colorier();
      gauche.etape.textContent = '';
      droite.etape.textContent = '';
      message.textContent = '';
      const etapes = [
        () => {
          gauche.diagramme.colorier({ calque1: zonesDe(loi.avant) });
          gauche.etape.innerHTML = `1. On colorie ${nom(loi.avant)}.`;
          droite.diagramme.colorier({ calque1: zonesDe('non-a') });
          droite.etape.innerHTML = `1. On colorie ${nom('non-a')}.`;
        },
        () => {
          gauche.diagramme.colorier({ allumees: zonesDe(loi.gauche) });
          gauche.etape.textContent = '2. On garde tout le reste de E.';
          droite.diagramme.colorier({ calque1: zonesDe('non-a'), calque2: zonesDe('non-b') });
          droite.etape.innerHTML = `2. On colorie ${nom('non-b')}.`;
        },
        () => {
          droite.diagramme.colorier({ allumees: zonesDe(loi.droite) });
          droite.etape.textContent = `3. On garde ${loi.garder}.`;
          const ensemble = ecrireEnsemble(elementsDesZones(zonesDe(loi.gauche)));
          message.innerHTML = `Mêmes zones des deux côtés : ${nom(loi.gauche)} = ${nom(loi.droite)} = <strong>${ensemble}</strong>. Le complémentaire échange ∪ et ∩, comme en logique : <code>${loi.logique}</code>.`;
        },
      ];
      for (const etape of etapes) {
        await attendre(scene, 1000);
        if (mien !== jeton) return;
        etape();
      }
    }
    function rejouer(loi) {
      jouer(loi).catch(() => {});
    }

    rejouer(loiActuelle);
  }

  function modeDefi() {
    const enonce = html('p', { classe: 'venn-enonce' }, scene);
    const selection = new Set();
    let cible = null;
    let reussis = 0;
    let dejaCompte = false;
    const diagramme = creerDiagrammeVenn(scene, (cle) => {
      if (selection.has(cle)) selection.delete(cle);
      else selection.add(cle);
      verifier();
    });
    const ligneDefi = commandes(scene);
    bouton(ligneDefi, 'Autre défi', nouveau, { principal: true });

    function nouveau() {
      const candidates = OPERATIONS_VENN.filter((operation) => operation !== cible);
      cible = candidates[Math.floor(Math.random() * candidates.length)];
      selection.clear();
      dejaCompte = false;
      enonce.innerHTML = `Colorie la zone ${cible.nom}`;
      verifier();
      message.textContent = 'Clique sur les zones du dessin pour les allumer ou les éteindre.';
    }

    function verifier() {
      const zones = [...selection];
      const reussi = memesZones(zones, zonesDe(cible.cle));
      diagramme.colorier({ allumees: zones });
      diagramme.element.classList.toggle('reussi', reussi);
      if (reussi && !dejaCompte) {
        reussis += 1;
        dejaCompte = true;
      }
      message.innerHTML = reussi
        ? `Bravo ! ${cible.nom} = <strong>${ecrireEnsemble(elementsDesZones(zones))}</strong>. Défis réussis : ${reussis}.`
        : `Zones allumées : ${ecrireEnsemble(elementsDesZones(zones))}.`;
    }
    nouveau();
  }

  lancer(depart);
}

export function evaluerQuantificateurs(relation) {
  const colonnes = relation[0]?.length ?? 0;
  const temoins = relation.map((ligneRelation) => ligneRelation.indexOf(true));
  const lignesSansTemoin = temoins.flatMap((temoin, x) => (temoin === -1 ? [x] : []));
  const colonnesPleines = Array.from({ length: colonnes }, (_, y) => y).filter((y) => relation.every((ligneRelation) => ligneRelation[y]));
  return {
    pourToutIlExiste: lignesSansTemoin.length === 0,
    ilExistePourTout: colonnesPleines.length > 0,
    temoins,
    lignesSansTemoin,
    colonnesPleines,
  };
}

const EMPLOYES = ['Alice', 'Bilal', 'Chloé', 'David'];
const MANAGERS = ['Emma', 'Farid', 'Gaëlle', 'Hugo'];

const RELATIONS_TYPES = [
  { cle: 'chacun', texte: 'Chacun son manager', cases: [[1, 0, 0, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 1]] },
  { cle: 'chef', texte: 'Un chef pour tous', cases: [[0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]] },
  { cle: 'oubli', texte: 'Un oublié', cases: [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 1]] },
];

function creerQuantificateurs(zone) {
  let relation = [];
  const barreTypes = commandes(zone);
  for (const type of RELATIONS_TYPES) {
    bouton(barreTypes, type.texte, () => charger(type.cases));
  }
  bouton(barreTypes, 'Au hasard', () => {
    relation = relation.map((ligneRelation) => ligneRelation.map(() => Math.random() < 0.3));
    actualiser();
  });
  bouton(barreTypes, 'Tout effacer', () => {
    relation = relation.map((ligneRelation) => ligneRelation.map(() => false));
    actualiser();
  });

  const corps = html('div', { classe: 'quantif' }, zone);
  const grille = html('div', { classe: 'quantif-grille', style: `--colonnes: ${MANAGERS.length}` }, corps);
  html('span', { classe: 'quantif-coin', texte: 'x ↓   y →' }, grille);
  for (const manager of MANAGERS) html('span', { classe: 'quantif-entete', texte: manager }, grille);
  const cases = EMPLOYES.map((employe, x) => {
    html('span', { classe: 'quantif-employe', texte: employe }, grille);
    return MANAGERS.map((manager, y) => {
      const element = html('button', { type: 'button', classe: 'anim-case quantif-case', title: `R(${employe}, ${manager}) : ${manager} est manager de ${employe}` }, grille);
      element.addEventListener('click', () => {
        relation[x][y] = !relation[x][y];
        actualiser();
      });
      return element;
    });
  });

  const cartes = html('div', { classe: 'quantif-cartes' }, corps);
  const creerCarte = (formule, phrase) => {
    const element = html('div', { classe: 'quantif-carte' }, cartes);
    const entete = html('div', { classe: 'quantif-carte-entete' }, element);
    html('span', { classe: 'quantif-formule', texte: formule }, entete);
    const verdict = html('span', { classe: 'quantif-verdict' }, entete);
    html('p', { classe: 'quantif-phrase', texte: phrase }, element);
    const detail = html('p', { classe: 'quantif-detail' }, element);
    return { element, verdict, detail };
  };
  const carteChacun = creerCarte('∀x ∃y R(x, y)', 'Chaque employé a (au moins) un manager.');
  const carteChef = creerCarte('∃y ∀x R(x, y)', 'Une même personne manage tout le monde.');
  const message = info(zone);

  function charger(modele) {
    relation = modele.map((ligneRelation) => ligneRelation.map((valeur) => valeur === 1));
    actualiser();
  }

  function remplirCarte(carte, vrai, detail) {
    carte.element.classList.toggle('vrai', vrai);
    carte.element.classList.toggle('faux', !vrai);
    carte.verdict.textContent = vrai ? 'VRAI' : 'FAUX';
    carte.detail.textContent = detail;
  }

  function actualiser() {
    const { pourToutIlExiste, ilExistePourTout, temoins, lignesSansTemoin, colonnesPleines } = evaluerQuantificateurs(relation);
    cases.forEach((ligneCases, x) => ligneCases.forEach((element, y) => {
      const coche = relation[x][y];
      element.textContent = coche ? '✓' : '';
      element.classList.toggle('coche', coche);
      element.classList.toggle('surligne', colonnesPleines.includes(y));
      element.classList.toggle('bon', !ilExistePourTout && pourToutIlExiste && temoins[x] === y);
      element.classList.toggle('mauvais', lignesSansTemoin.includes(x));
    }));
    remplirCarte(carteChacun, pourToutIlExiste, pourToutIlExiste
      ? `Un témoin par ligne : ${EMPLOYES.map((employe, x) => `${employe} → ${MANAGERS[temoins[x]]}`).join(', ')}.`
      : `Contre-exemple : ${EMPLOYES[lignesSansTemoin[0]]} n’a aucun manager. La négation ∃x ∀y ¬R(x, y) est vraie.`);
    remplirCarte(carteChef, ilExistePourTout, ilExistePourTout
      ? `${MANAGERS[colonnesPleines[0]]} manage les ${EMPLOYES.length} employés : sa colonne est pleine.`
      : 'Aucune colonne pleine : la négation ∀y ∃x ¬R(x, y) est vraie (chacun oublie au moins un employé).');
    if (ilExistePourTout) message.innerHTML = 'Le second est vrai, donc le premier aussi : <strong>un chef pour tous</strong> est en particulier un manager pour chacun.';
    else if (pourToutIlExiste) message.innerHTML = 'Le premier est vrai mais pas le second : <strong>échanger ∀ et ∃ change le sens</strong> de la phrase.';
    else message.innerHTML = 'Les deux sont faux : il suffit d’<strong>un seul</strong> employé sans manager pour faire tomber le « pour tout ».';
  }

  charger(RELATIONS_TYPES[0].cases);
}

export function sommeEntiers(n) {
  return (n * (n + 1)) / 2;
}

export function ecrireSomme(n) {
  if (n <= 6) return Array.from({ length: n }, (_, i) => i + 1).join(' + ');
  return `1 + 2 + … + ${n}`;
}

export function carresEscalier(n) {
  return Array.from({ length: n }, (_, colonne) => Array.from({ length: colonne + 1 }, (__, rang) => ({ colonne, rang }))).flat();
}

export function retournerCarre(n, { colonne, rang }) {
  return { colonne: n - 1 - colonne, rang: n - rang };
}

function creerSommeGauss(zone, options) {
  const largeur = 640;
  const hauteur = 340;
  const gauche = 20;
  const base = 316;
  let n = bornes(Math.round(options.n ?? 6), 1, 15);
  let progression = 0;
  let cible = 0;
  let cote = 0;
  let copie = null;
  let dimensions = null;

  const barreGauss = commandes(zone);
  const reglage = curseur(barreGauss, {
    libelle: 'n =',
    min: 1,
    max: 15,
    valeur: n,
    auChangement: (valeur) => {
      n = valeur;
      construire();
    },
  });
  reglage.element.classList.add('anim-curseur-large');
  const action = bouton(barreGauss, 'Assembler', () => {
    cible = cible === 1 ? 0 : 1;
    action.textContent = cible === 1 ? 'Séparer' : 'Assembler';
    if (cible === 0) dimensions.classList.remove('visible');
    animation.demarrer();
  }, { principal: true });
  const dessin = creerSvg(zone, largeur, hauteur, 'gauss');
  const message = info(zone);

  const animation = boucle(dessin, (ecart) => {
    progression = cible > progression ? Math.min(cible, progression + ecart / 1.4) : Math.max(cible, progression - ecart / 1.4);
    placerCopie();
    if (progression !== cible) return true;
    terminer();
    return false;
  });

  function carre(groupe, { colonne, rang }, classe) {
    const marge = cote * 0.06;
    svg('rect', {
      x: gauche + colonne * cote + marge,
      y: base - (rang + 1) * cote + marge,
      width: cote - 2 * marge,
      height: cote - 2 * marge,
      rx: Math.min(4, cote * 0.15),
      classe,
    }, groupe);
  }

  function construire() {
    animation.arreter();
    progression = 0;
    cible = 0;
    action.textContent = 'Assembler';
    cote = Math.min(600 / (2 * n + 2), 230 / (n + 1));
    dessin.replaceChildren();
    const carres = carresEscalier(n);
    for (const position of carres) carre(dessin, position, 'gauss-carre');
    if (cote >= 13) {
      for (let colonne = 0; colonne < n; colonne += 1) {
        svg('text', { x: gauche + (colonne + 0.5) * cote, y: base + 16, 'text-anchor': 'middle', classe: 'gauss-numero', texte: colonne + 1 }, dessin);
      }
    }
    copie = svg('g', {}, dessin);
    for (const position of carres) carre(copie, position, 'gauss-copie');
    dimensions = svg('g', { classe: 'gauss-dimensions' }, dessin);
    svg('rect', { x: gauche, y: base - (n + 1) * cote, width: n * cote, height: (n + 1) * cote, classe: 'gauss-contour' }, dimensions);
    svg('text', { x: gauche + n * cote + 10, y: base - ((n + 1) * cote) / 2, classe: 'gauss-cote', texte: `n + 1 = ${n + 1}` }, dimensions);
    svg('text', { x: gauche + (n * cote) / 2, y: base - (n + 1) * cote - 8, 'text-anchor': 'middle', classe: 'gauss-cote', texte: `n = ${n}` }, dimensions);
    placerCopie();
    terminer();
  }

  function placerCopie() {
    const t = lisser(progression);
    const centreX = gauche + (n * cote) / 2;
    const centreY = base - (n * cote) / 2;
    const decalageX = (1 - t) * (n + 1) * cote;
    const decalageY = -t * cote;
    copie.setAttribute('transform', `translate(${arrondir(decalageX)} ${arrondir(decalageY)}) rotate(${arrondir(180 * t)} ${arrondir(centreX)} ${arrondir(centreY)})`);
  }

  function terminer() {
    const assemble = progression === 1;
    dimensions.classList.toggle('visible', assemble);
    const somme = ecrireSomme(n);
    message.innerHTML = assemble
      ? `Deux escaliers forment un rectangle ${n} × ${n + 1} = ${n * (n + 1)} carrés : chaque colonne a k carrés bleus et ${n + 1} − k jaunes. Un escalier est la moitié du rectangle : ${somme} = ${n} × ${n + 1} / 2 = <strong>${sommeEntiers(n)}</strong>. C’est la formule n(n + 1)/2.`
      : `${somme} = ? Compte les carrés bleus… ou assemble l’escalier avec sa copie retournée.`;
  }

  construire();
}

export function reflet({ x, y }) {
  return { x: y, y: x };
}

export function parametreLePlusProche(point, courbe, debut, fin, pas = 400) {
  let meilleur = debut;
  let distance = Infinity;
  for (let i = 0; i <= pas; i += 1) {
    const t = debut + ((fin - debut) * i) / pas;
    const { x, y } = courbe(t);
    const ecart = (x - point.x) ** 2 + (y - point.y) ** 2;
    if (ecart < distance) {
      distance = ecart;
      meilleur = t;
    }
  }
  return meilleur;
}

function creerExpLn(zone, options) {
  const vue = [-3.5, 5.5];
  const versX = echelle(vue, [24, 406]);
  const versY = echelle(vue, [406, 24]);
  const aMin = -3.2;
  const aMax = 1.7;
  let a = bornes(options.a ?? 1, aMin, aMax);
  let temps = 0;

  const barreExp = commandes(zone);
  const action = bouton(barreExp, 'Animer', () => {
    if (animation.enMarche) {
      animation.arreter();
      action.textContent = 'Animer';
    } else {
      temps = Math.asin(bornes((2 * (a - aMin)) / (aMax - aMin) - 1, -1, 1));
      animation.demarrer();
      action.textContent = 'Pause';
    }
  }, { principal: true });

  const dessin = creerSvg(zone, 430, 430, 'explog');
  const fond = svg('g', {}, dessin);
  svg('rect', { x: versX(-3.5), y: versY(5.5), width: versX(0) - versX(-3.5), height: versY(-3.5) - versY(5.5), classe: 'explog-interdit' }, fond);
  graduer(fond, versX, versY, [-3.5, 5.5, -3.5, 5.5], { pasX: 1, pasY: 1 });
  svg('text', { x: versX(-1.75), y: versY(-3), 'text-anchor': 'middle', classe: 'explog-note', texte: 'pas de ln pour x ≤ 0' }, fond);
  ligne(fond, [versX(-3.5), versY(-3.5)], [versX(5.5), versY(5.5)], { classe: 'anim-repere' });
  svg('text', { x: versX(4.3), y: versY(4.75), classe: 'explog-note', texte: 'y = x' }, fond);
  tracerCourbe(fond, Math.exp, [-3.5, Math.log(5.5)], versX, versY, { classe: 'anim-courbe explog-exp' });
  tracerCourbe(fond, Math.log, [Math.exp(-3.5), 5.5], versX, versY, { classe: 'anim-courbe explog-ln' });
  svg('text', { x: versX(1.9), y: versY(5.1), classe: 'explog-nom-exp', texte: 'y = eˣ' }, fond);
  svg('text', { x: versX(4.6), y: versY(1.95), classe: 'explog-nom-ln', texte: 'y = ln x' }, fond);

  const dynamique = svg('g', {}, dessin);
  const poigneeExp = svg('circle', { r: 9, classe: 'anim-poignee', style: 'fill: var(--ansi-cyan)' }, dessin);
  const poigneeLn = svg('circle', { r: 9, classe: 'anim-poignee', style: 'fill: var(--ansi-magenta)' }, dessin);
  const message = info(zone);

  const versMaths = (p) => ({ x: versX.inverse(p.x), y: versY.inverse(p.y) });
  const aimanter = (valeur) => [0, 1].find((repere) => Math.abs(valeur - repere) < 0.05) ?? valeur;
  const surExp = (t) => ({ x: t, y: Math.exp(t) });
  const surLn = (t) => reflet(surExp(t));
  glisser(dessin, poigneeExp, (p) => {
    arreter();
    a = aimanter(parametreLePlusProche(versMaths(p), surExp, aMin, aMax));
    actualiser();
  });
  glisser(dessin, poigneeLn, (p) => {
    arreter();
    a = aimanter(parametreLePlusProche(versMaths(p), surLn, aMin, aMax));
    actualiser();
  });

  const animation = boucle(dessin, (ecart) => {
    temps += ecart * 0.7;
    a = aMin + ((Math.sin(temps) + 1) / 2) * (aMax - aMin);
    actualiser();
    return true;
  });

  function arreter() {
    animation.arreter();
    action.textContent = 'Animer';
  }

  function actualiser() {
    dynamique.replaceChildren();
    const ea = Math.exp(a);
    const p = [versX(a), versY(ea)];
    const q = [versX(ea), versY(a)];
    ligne(dynamique, [versX(a), versY(0)], p, { classe: 'explog-lien' });
    ligne(dynamique, [versX(0), versY(ea)], p, { classe: 'explog-lien' });
    ligne(dynamique, [versX(ea), versY(0)], q, { classe: 'explog-lien' });
    ligne(dynamique, [versX(0), versY(a)], q, { classe: 'explog-lien' });
    ligne(dynamique, p, q, { classe: 'explog-miroir' });
    const milieu = (a + ea) / 2;
    svg('circle', { cx: versX(milieu), cy: versY(milieu), r: 3.5, classe: 'anim-point' }, dynamique);
    const texteA = nombre(a);
    const texteEa = nombre(ea);
    const pAGauche = p[0] > 170;
    const qADroite = q[0] < 280;
    svg('text', { x: p[0] + (pAGauche ? -12 : 12), y: p[1] - 12, 'text-anchor': pAGauche ? 'end' : 'start', classe: 'explog-etiquette', texte: `(${texteA} ; ${texteEa})` }, dynamique);
    svg('text', { x: q[0] + (qADroite ? 12 : -12), y: q[1] + 22, 'text-anchor': qADroite ? 'start' : 'end', classe: 'explog-etiquette', texte: `(${texteEa} ; ${texteA})` }, dynamique);
    poigneeExp.setAttribute('cx', p[0]);
    poigneeExp.setAttribute('cy', p[1]);
    poigneeLn.setAttribute('cx', q[0]);
    poigneeLn.setAttribute('cy', q[1]);
    let remarque = 'a &gt; 0, donc eᵃ &gt; 1 et son logarithme est positif.';
    if (a === 0) remarque = 'a = 0 : e⁰ = 1 et ln 1 = 0.';
    else if (a === 1) remarque = 'a = 1 : e¹ = e ≈ 2,718 et ln e = 1.';
    else if (a < 0) remarque = 'a &lt; 0, donc eᵃ est entre 0 et 1 et son logarithme est négatif.';
    message.innerHTML = `exp(${texteA}) ≈ <strong>${texteEa}</strong> et ln(${texteEa}) ≈ <strong>${texteA}</strong> : ln défait exp. Les deux points sont symétriques par rapport à la droite y = x. ${remarque}`;
  }

  actualiser();
}

export function deriveeNumerique(f, x, h = 1e-5) {
  return (f(x + h) - f(x - h)) / (2 * h);
}

export function droiteTangente(fonction, a) {
  const pente = fonction.fp(a);
  return { pente, ordonnee: fonction.f(a) - pente * a };
}

const formatPi = (x) => fractionPi(x) ?? nombre(x);

export const FONCTIONS_TANGENTE = [
  { cle: 'carre', nom: 'x²', derivee: '2x', f: (x) => x * x, fp: (x) => 2 * x, vue: [-3, 3, -1.5, 9.5], vueDerivee: [-6.5, 6.5], depart: 1, aimants: [0] },
  { cle: 'cube', nom: 'x³ − 3x', derivee: '3x² − 3', f: (x) => x ** 3 - 3 * x, fp: (x) => 3 * x * x - 3, vue: [-2.3, 2.3, -5.5, 5.5], vueDerivee: [-4, 13.5], depart: -1.7, aimants: [-1, 0, 1] },
  {
    cle: 'sin', nom: 'sin x', derivee: 'cos x', f: Math.sin, fp: Math.cos,
    vue: [-2 * PI - 0.3, 2 * PI + 0.3, -1.6, 1.6], vueDerivee: [-1.6, 1.6], pasX: PI / 2, formatX: formatPi,
    depart: 0.6, aimants: Array.from({ length: 9 }, (_, i) => ((i - 4) * PI) / 2),
  },
  { cle: 'exp', nom: 'eˣ', derivee: 'eˣ', f: Math.exp, fp: Math.exp, vue: [-3, 2, -1, 7.8], vueDerivee: [-1, 7.8], depart: 0.5, aimants: [0, 1] },
  { cle: 'ln', nom: 'ln x', derivee: '1/x', f: Math.log, fp: (x) => 1 / x, vue: [-0.5, 6.5, -2.5, 2.5], vueDerivee: [-0.6, 5.5], domaine: [0.2, 6.5], courbe: [0.08, 6.5], depart: 2, aimants: [1, Math.E] },
  { cle: 'abs', nom: '|x|', derivee: '−1 si x < 0, 1 si x > 0', f: Math.abs, fp: Math.sign, vue: [-3, 3, -1, 3.5], vueDerivee: [-2, 2], depart: 1.5, aimants: [0], pointe: 0 },
];

export function domaineTangente(fonction) {
  return fonction.domaine ?? [fonction.vue[0], fonction.vue[1]];
}

function creerTangente(zone, options) {
  const largeur = 640;
  const gauche = 46;
  const droite = 628;
  const haut = [12, 262];
  const bas = [298, 470];
  let fonction = FONCTIONS_TANGENTE.find(({ cle }) => cle === options.fonction) ?? FONCTIONS_TANGENTE[0];
  let a = fonction.depart;
  let versX;
  let versY;
  let versYp;
  let montrerDerivee = false;
  let fantome = null;
  let etiquetteBas = null;
  const trace = new Set();

  const barreFonctions = commandes(zone);
  choix(barreFonctions, {
    options: FONCTIONS_TANGENTE.map(({ cle, nom }) => ({ valeur: cle, texte: nom })),
    valeur: fonction.cle,
    auChangement: (cle) => {
      arreter();
      fonction = FONCTIONS_TANGENTE.find((candidate) => candidate.cle === cle);
      a = fonction.depart;
      preparer();
    },
  });
  const actions = commandes(zone);
  const boutonBalayer = bouton(actions, 'Balayer', basculerBalayage, { principal: true });
  const boutonDerivee = bouton(actions, 'Montrer f′', () => {
    montrerDerivee = !montrerDerivee;
    boutonDerivee.textContent = montrerDerivee ? 'Cacher f′' : 'Montrer f′';
    fantome.classList.toggle('visible', montrerDerivee);
    etiquetteBas.textContent = titreBas();
  });
  bouton(actions, 'Effacer la trace', () => {
    trace.clear();
    calqueTrace.replaceChildren();
  });

  const dessin = creerSvg(zone, largeur, 482, 'tangente');
  const fond = svg('g', {}, dessin);
  const calqueHaut = groupeCoupe(dessin, gauche, haut[0], droite - gauche, haut[1] - haut[0]);
  const courbesHaut = svg('g', {}, calqueHaut);
  const marquesHaut = svg('g', {}, calqueHaut);
  const calqueBas = groupeCoupe(dessin, gauche, bas[0], droite - gauche, bas[1] - bas[0]);
  const courbesBas = svg('g', {}, calqueBas);
  const calqueTrace = svg('g', {}, calqueBas);
  const marquesBas = svg('g', {}, calqueBas);
  const lien = svg('line', { classe: 'anim-repere' }, dessin);
  const pointBas = svg('circle', { r: 5.5, classe: 'anim-point', style: 'fill: var(--ansi-magenta)' }, dessin);
  const poignee = svg('circle', { r: 9, classe: 'anim-poignee' }, dessin);
  const message = info(zone);

  glisser(dessin, dessin, (p) => {
    arreter();
    const [debut, fin] = domaineTangente(fonction);
    a = aimanter(bornes(versX.inverse(p.x), debut, fin));
    actualiser();
  });
  dessin.style.touchAction = 'pan-y';

  const balayage = boucle(dessin, (ecart) => {
    const [debut, fin] = domaineTangente(fonction);
    a = Math.min(fin, a + (ecart * (fin - debut)) / 5);
    actualiser();
    if (a < fin) return true;
    boutonBalayer.textContent = 'Balayer';
    return false;
  });

  function basculerBalayage() {
    if (balayage.enMarche) {
      arreter();
      return;
    }
    a = domaineTangente(fonction)[0];
    boutonBalayer.textContent = 'Arrêter';
    balayage.demarrer();
  }

  function arreter() {
    balayage.arreter();
    boutonBalayer.textContent = 'Balayer';
  }

  function aimanter(valeur) {
    const tolerance = (fonction.vue[1] - fonction.vue[0]) / 80;
    return fonction.aimants?.find((repere) => Math.abs(valeur - repere) < tolerance) ?? valeur;
  }

  function titreBas() {
    return montrerDerivee ? `f′(x) = ${fonction.derivee}` : 'pente de la tangente en fonction de a : f′(a)';
  }

  function morceaux() {
    const intervalle = fonction.courbe ?? domaineTangente(fonction);
    if (fonction.pointe === undefined) return [intervalle];
    return [[intervalle[0], fonction.pointe - 1e-6], [fonction.pointe + 1e-6, intervalle[1]]];
  }

  function preparer() {
    const [xMin, xMax, yMin, yMax] = fonction.vue;
    versX = echelle([xMin, xMax], [gauche, droite]);
    versY = echelle([yMin, yMax], [haut[1], haut[0]]);
    versYp = echelle(fonction.vueDerivee, [bas[1], bas[0]]);
    for (const groupe of [fond, courbesHaut, courbesBas, calqueTrace]) groupe.replaceChildren();
    trace.clear();
    const reglages = { pasX: fonction.pasX, formatX: fonction.formatX };
    graduer(fond, versX, versY, fonction.vue, reglages);
    graduer(fond, versX, versYp, [xMin, xMax, ...fonction.vueDerivee], reglages);
    svg('text', { x: gauche + 8, y: haut[0] + 18, classe: 'tangente-titre', texte: `f(x) = ${fonction.nom}` }, fond);
    etiquetteBas = svg('text', { x: gauche + 8, y: bas[0] + 18, classe: 'tangente-titre tangente-titre-bas', texte: titreBas() }, fond);
    for (const morceau of morceaux()) tracerCourbe(courbesHaut, fonction.f, morceau, versX, versY, { classe: 'anim-courbe' });
    fantome = svg('g', { classe: `tangente-fantome${montrerDerivee ? ' visible' : ''}` }, courbesBas);
    for (const morceau of morceaux()) tracerCourbe(fantome, fonction.fp, morceau, versX, versYp, { classe: 'anim-courbe' });
    actualiser();
  }

  function ecrireA() {
    return (fonction.pasX && fractionPi(a, 1e-9)) || nombre(a);
  }

  function actualiser() {
    marquesHaut.replaceChildren();
    marquesBas.replaceChildren();
    const [xMin, xMax] = fonction.vue;
    const y = fonction.f(a);
    const px = versX(a);
    const py = versY(y);
    const enPointe = fonction.pointe !== undefined && Math.abs(a - fonction.pointe) < 1e-9;
    poignee.setAttribute('cx', px);
    poignee.setAttribute('cy', py);
    lien.setAttribute('x1', px);
    lien.setAttribute('x2', px);
    lien.setAttribute('y1', py);
    lien.setAttribute('y2', bas[1]);
    if (enPointe) {
      for (const [bout, pente] of [[xMin, -1], [xMax, 1]]) {
        ligne(marquesHaut, [px, py], [versX(bout), versY(y + pente * (bout - a))], { classe: 'tangente-droite' });
        svg('circle', { cx: px, cy: versYp(pente), r: 5, classe: 'tangente-trou' }, marquesBas);
      }
      pointBas.style.display = 'none';
      message.innerHTML = `En a = 0, la courbe de |x| fait une <strong>pointe</strong> : pente −1 à gauche, +1 à droite. Pas de tangente unique : |x| est continue en 0 mais <strong>pas dérivable</strong>.`;
      return;
    }
    const { pente, ordonnee } = droiteTangente(fonction, a);
    ligne(marquesHaut, [versX(xMin), versY(pente * xMin + ordonnee)], [versX(xMax), versY(pente * xMax + ordonnee)], { classe: 'tangente-droite' });
    const sens = a + 1 <= xMax ? 1 : -1;
    const coin = [versX(a + sens), py];
    const bout = [versX(a + sens), versY(y + sens * pente)];
    ligne(marquesHaut, [px, py], coin, { classe: 'tangente-triangle' });
    ligne(marquesHaut, coin, bout, { classe: 'tangente-pente' });
    svg('text', { x: (px + coin[0]) / 2, y: py + 15, 'text-anchor': 'middle', classe: 'tangente-mesure', texte: '1' }, marquesHaut);
    svg('text', { x: coin[0] + 6 * sens, y: (coin[1] + bout[1]) / 2 + 4, 'text-anchor': sens === 1 ? 'start' : 'end', classe: 'tangente-mesure', texte: nombre(pente) }, marquesHaut);
    pointBas.style.display = '';
    pointBas.setAttribute('cx', px);
    pointBas.setAttribute('cy', versYp(pente));
    const cle = Math.round(px / 2);
    if (!trace.has(cle) && Number.isFinite(pente)) {
      trace.add(cle);
      svg('circle', { cx: px, cy: versYp(pente), r: 2.2, classe: 'tangente-trace' }, calqueTrace);
    }
    let sensVariation = 'Pente nulle : <strong>tangente horizontale</strong> (sommet, creux ou palier).';
    if (pente > 0.005) sensVariation = 'Pente positive : f est <strong>croissante</strong> ici.';
    else if (pente < -0.005) sensVariation = 'Pente négative : f est <strong>décroissante</strong> ici.';
    message.innerHTML = `a = ${ecrireA()} : f(a) = ${nombre(y)}, pente de la tangente f′(a) = <strong>${nombre(pente)}</strong>. ${sensVariation}`;
  }

  preparer();
}

export const METHODES_RIEMANN = { gauche: 0, milieu: 0.5, droite: 1 };

const NOMS_METHODES = { gauche: 'hauteur prise à gauche', milieu: 'hauteur prise au milieu', droite: 'hauteur prise à droite' };

export function rectanglesRiemann(f, debut, fin, n, methode = 'gauche') {
  const largeur = (fin - debut) / n;
  const decalage = METHODES_RIEMANN[methode];
  return Array.from({ length: n }, (_, i) => {
    const x = debut + i * largeur;
    const echantillon = x + decalage * largeur;
    return { x, largeur, echantillon, hauteur: f(echantillon) };
  });
}

export function sommeRiemann(f, debut, fin, n, methode = 'gauche') {
  return rectanglesRiemann(f, debut, fin, n, methode).reduce((somme, { largeur, hauteur }) => somme + largeur * hauteur, 0);
}

export const FONCTIONS_INTEGRALE = [
  { cle: 'x', nom: 'x', f: (x) => x, intervalle: [0, 4], primitive: 'x²/2', exacte: 8, affine: true },
  { cle: 'affine', nom: '2x + 1', f: (x) => 2 * x + 1, intervalle: [1, 3], primitive: 'x² + x', exacte: 10, affine: true },
  { cle: 'carre', nom: 'x²', f: (x) => x * x, intervalle: [0, 2], primitive: 'x³/3', exacte: 8 / 3, exacteTexte: '8/3 ≈ 2,6667' },
  { cle: 'inverse', nom: '1/x', f: (x) => 1 / x, intervalle: [1, Math.E], primitive: 'ln x', exacte: 1, exacteTexte: 'ln e − ln 1 = 1', bornesTexte: ['1', 'e'], pasX: 0.5 },
  { cle: 'exp', nom: 'eˣ', f: Math.exp, intervalle: [0, 2], primitive: 'eˣ', exacte: Math.E ** 2 - 1, exacteTexte: 'e² − 1 ≈ 6,3891' },
  {
    cle: 'sin', nom: 'sin x', f: Math.sin, intervalle: [0, (3 * PI) / 2], primitive: '−cos x', exacte: 1,
    bornesTexte: ['0', '3π/2'], pasX: PI / 2, formatX: formatPi,
    remarque: 'Les rectangles rouges sont sous l’axe et comptent en négatif : +2 au-dessus, −1 en dessous, total 1.',
  },
];

function creerIntegrale(zone, options) {
  let fonction = FONCTIONS_INTEGRALE.find(({ cle }) => cle === options.fonction) ?? FONCTIONS_INTEGRALE[0];
  let n = bornes(Math.round(options.n ?? 4), 1, 100);
  let methode = METHODES_RIEMANN[options.methode] === undefined ? 'gauche' : options.methode;
  let jeton = 0;

  const barreFonctions = commandes(zone);
  choix(barreFonctions, {
    options: FONCTIONS_INTEGRALE.map(({ cle, nom }) => ({ valeur: cle, texte: nom })),
    valeur: fonction.cle,
    auChangement: (cle) => {
      fonction = FONCTIONS_INTEGRALE.find((candidate) => candidate.cle === cle);
      dessiner();
    },
  });
  const barreReglages = commandes(zone);
  const reglage = curseur(barreReglages, {
    libelle: 'n =',
    min: 1,
    max: 100,
    valeur: n,
    auChangement: (valeur) => {
      jeton += 1;
      n = valeur;
      dessiner();
    },
  });
  reglage.element.classList.add('anim-curseur-large');
  choix(barreReglages, {
    options: [{ valeur: 'gauche', texte: 'Gauche' }, { valeur: 'milieu', texte: 'Milieu' }, { valeur: 'droite', texte: 'Droite' }],
    valeur: methode,
    auChangement: (valeur) => {
      methode = valeur;
      dessiner();
    },
  });
  bouton(barreReglages, 'Affiner', () => {
    affiner().catch(() => {});
  }, { principal: true });

  const dessin = creerSvg(zone, 640, 300, 'integrale');
  const convergence = creerSvg(zone, 640, 124, 'integrale-convergence');
  const message = info(zone);

  async function affiner() {
    jeton += 1;
    const mien = jeton;
    for (const valeur of [1, 2, 4, 8, 16, 32, 64]) {
      if (mien !== jeton) return;
      n = valeur;
      reglage.fixer(valeur);
      dessiner();
      await attendre(dessin, 700);
    }
  }

  function dessiner() {
    const [debut, fin] = fonction.intervalle;
    const marge = (fin - debut) * 0.08;
    const xMin = debut - marge;
    const xMax = fin + marge;
    const valeurs = Array.from({ length: 101 }, (_, i) => fonction.f(xMin + ((xMax - xMin) * i) / 100));
    const plusBas = Math.min(0, ...valeurs);
    const plusHaut = Math.max(0, ...valeurs);
    const etendue = plusHaut - plusBas;
    const yMin = plusBas - etendue * 0.08;
    const yMax = plusHaut + etendue * 0.14;
    const versX = echelle([xMin, xMax], [44, 628]);
    const versY = echelle([yMin, yMax], [282, 12]);

    dessin.replaceChildren();
    graduer(dessin, versX, versY, [xMin, xMax, yMin, yMax], { pasX: fonction.pasX, formatX: fonction.formatX });
    const rectangles = rectanglesRiemann(fonction.f, debut, fin, n, methode);
    for (const { x, largeur, echantillon, hauteur } of rectangles) {
      const dessus = versY(Math.max(hauteur, 0));
      const dessous = versY(Math.min(hauteur, 0));
      svg('rect', {
        x: versX(x),
        y: dessus,
        width: versX(x + largeur) - versX(x),
        height: Math.max(dessous - dessus, 0),
        classe: `integrale-rect ${hauteur >= 0 ? 'positif' : 'negatif'}`,
      }, dessin);
      if (n <= 24) svg('circle', { cx: versX(echantillon), cy: versY(hauteur), r: 3, classe: 'integrale-echantillon' }, dessin);
    }
    tracerCourbe(dessin, fonction.f, [xMin, xMax], versX, versY, { classe: 'anim-courbe' });
    const [texteDebut, texteFin] = fonction.bornesTexte ?? [nombre(debut), nombre(fin)];
    for (const [x, texte] of [[debut, `a = ${texteDebut}`], [fin, `b = ${texteFin}`]]) {
      ligne(dessin, [versX(x), versY(yMin)], [versX(x), versY(yMax)], { classe: 'integrale-borne' });
      svg('text', { x: versX(x), y: 24, 'text-anchor': 'middle', classe: 'integrale-legende', texte }, dessin);
    }
    svg('text', { x: 52, y: 44, classe: 'integrale-titre', texte: `∫ ${fonction.nom} dx sur [${texteDebut} ; ${texteFin}]` }, dessin);

    const somme = sommeRiemann(fonction.f, debut, fin, n, methode);
    dessinerConvergence();
    const exacte = fonction.exacteTexte ?? nombre(fonction.exacte, 4);
    const remarques = [];
    if (fonction.affine && methode === 'milieu') remarques.push('Avec le milieu, une fonction affine est calculée exactement : chaque rectangle gagne autant qu’il perd.');
    if (fonction.remarque) remarques.push(fonction.remarque);
    message.innerHTML = `${n} rectangle${n > 1 ? 's' : ''} (${NOMS_METHODES[methode]}) : somme ≈ <strong>${nombre(somme, 4)}</strong>. `
      + `Valeur exacte F(b) − F(a) avec F(x) = ${fonction.primitive} : <strong>${exacte}</strong>. `
      + `Écart : ${nombre(Math.abs(somme - fonction.exacte), 4)}. ${remarques.join(' ')}`;
  }

  function dessinerConvergence() {
    const [debut, fin] = fonction.intervalle;
    const sommes = Array.from({ length: 100 }, (_, i) => sommeRiemann(fonction.f, debut, fin, i + 1, methode));
    let bas = Math.min(fonction.exacte, ...sommes);
    let haut = Math.max(fonction.exacte, ...sommes);
    if (haut - bas < 1e-6) {
      bas -= 1;
      haut += 1;
    }
    const marge = (haut - bas) * 0.12;
    const versX = echelle([1, 100], [44, 628]);
    const versY = echelle([bas - marge, haut + marge], [100, 14]);
    convergence.replaceChildren();
    ligne(convergence, [44, 100], [628, 100], { classe: 'anim-axe' });
    ligne(convergence, [44, versY(fonction.exacte)], [628, versY(fonction.exacte)], { classe: 'integrale-exacte' });
    svg('text', { x: 624, y: versY(fonction.exacte) - 6, 'text-anchor': 'end', classe: 'integrale-legende', texte: 'valeur exacte' }, convergence);
    svg('polyline', { points: sommes.map((valeur, i) => `${arrondir(versX(i + 1))},${arrondir(versY(valeur))}`).join(' '), classe: 'anim-courbe integrale-suite' }, convergence);
    ligne(convergence, [versX(n), 14], [versX(n), 100], { classe: 'anim-repere' });
    svg('circle', { cx: versX(n), cy: versY(sommes[n - 1]), r: 5, classe: 'anim-point' }, convergence);
    svg('text', { x: 44, y: 118, classe: 'anim-graduation', texte: 'n = 1' }, convergence);
    svg('text', { x: 628, y: 118, 'text-anchor': 'end', classe: 'anim-graduation', texte: 'n = 100' }, convergence);
    svg('text', { x: 336, y: 118, 'text-anchor': 'middle', classe: 'integrale-legende', texte: 'somme des rectangles quand n augmente' }, convergence);
  }

  dessiner();
}

export function combinaison(a, u, b, v) {
  return { x: a * u.x + b * v.x, y: a * u.y + b * v.y };
}

export function determinant(u, v) {
  return u.x * v.y - u.y * v.x;
}

export function sontColineaires(u, v, tolerance = 1e-9) {
  return Math.abs(determinant(u, v)) < tolerance;
}

export function coordonneesDansBase(w, u, v) {
  const d = determinant(u, v);
  if (Math.abs(d) < 1e-9) return null;
  return { a: determinant(w, v) / d, b: determinant(u, w) / d };
}

export function pointeFleche(depart, arrivee, taille = 11) {
  const dx = arrivee.x - depart.x;
  const dy = arrivee.y - depart.y;
  const longueur = Math.hypot(dx, dy);
  if (longueur < 1e-9) return null;
  const ux = dx / longueur;
  const uy = dy / longueur;
  const retrait = Math.min(taille, longueur);
  const base = { x: arrivee.x - ux * retrait, y: arrivee.y - uy * retrait };
  const demi = retrait * 0.5;
  return {
    base,
    pointe: [arrivee, { x: base.x - uy * demi, y: base.y + ux * demi }, { x: base.x + uy * demi, y: base.y - ux * demi }],
  };
}

const VECTEURS_DEPART = { u: { x: 1, y: 1 }, v: { x: 1, y: -1 }, a: 3, b: 1 };

function creerVecteurs(zone, options) {
  const versX = echelle([-6.5, 6.5], [16, 484]);
  const versY = echelle([-5.5, 5.5], [408, 12]);
  const enPixels = ({ x, y }) => ({ x: versX(x), y: versY(y) });
  const versMaths = (p) => ({ x: versX.inverse(p.x), y: versY.inverse(p.y) });
  const surGrille = ({ x, y }) => ({ x: bornes(arrondirAu(x * 2, 0) / 2, -6, 6), y: bornes(arrondirAu(y * 2, 0) / 2, -5, 5) });
  const etat = {
    u: { x: options.ux ?? VECTEURS_DEPART.u.x, y: options.uy ?? VECTEURS_DEPART.u.y },
    v: { x: options.vx ?? VECTEURS_DEPART.v.x, y: options.vy ?? VECTEURS_DEPART.v.y },
    a: bornes(options.a ?? VECTEURS_DEPART.a, -3, 3),
    b: bornes(options.b ?? VECTEURS_DEPART.b, -3, 3),
    grille: true,
    cible: null,
  };

  const barreCoefficients = commandes(zone);
  const format = (valeur) => nombre(valeur, 1);
  const reglageA = curseur(barreCoefficients, { libelle: 'a =', min: -3, max: 3, pas: 0.1, valeur: etat.a, format, auChangement: (valeur) => { etat.a = valeur; actualiser(); } });
  const reglageB = curseur(barreCoefficients, { libelle: 'b =', min: -3, max: 3, pas: 0.1, valeur: etat.b, format, auChangement: (valeur) => { etat.b = valeur; actualiser(); } });
  const actions = commandes(zone);
  const boutonGrille = bouton(actions, 'Cacher la grille de (u, v)', () => {
    etat.grille = !etat.grille;
    boutonGrille.textContent = etat.grille ? 'Cacher la grille de (u, v)' : 'Montrer la grille de (u, v)';
    actualiser();
  });
  bouton(actions, 'Cible au hasard', nouvelleCible, { principal: true });
  bouton(actions, 'Rendre v colinéaire à u', () => {
    const { u } = etat;
    const double = Math.abs(u.x) <= 3 && Math.abs(u.y) <= 2.5;
    etat.v = double ? { x: -2 * u.x + 0, y: -2 * u.y + 0 } : { x: -0.5 * u.x + 0, y: -0.5 * u.y + 0 };
    actualiser();
  });
  bouton(actions, 'Réinitialiser', () => {
    etat.u = { ...VECTEURS_DEPART.u };
    etat.v = { ...VECTEURS_DEPART.v };
    etat.a = VECTEURS_DEPART.a;
    etat.b = VECTEURS_DEPART.b;
    etat.cible = null;
    reglageA.fixer(etat.a);
    reglageB.fixer(etat.b);
    actualiser();
  });

  const dessin = creerSvg(zone, 500, 420, 'vecteurs');
  const fond = svg('g', {}, dessin);
  graduer(fond, versX, versY, [-6.5, 6.5, -5.5, 5.5], { pasX: 1, pasY: 1 });
  const calqueCoupe = groupeCoupe(dessin, 16, 12, 468, 396);
  const dynamique = svg('g', {}, dessin);
  const poigneeU = svg('circle', { r: 9, classe: 'anim-poignee', style: 'fill: var(--ansi-cyan)' }, dessin);
  const poigneeV = svg('circle', { r: 9, classe: 'anim-poignee', style: 'fill: var(--ansi-magenta)' }, dessin);
  const poigneeW = svg('circle', { r: 10, classe: 'anim-poignee', style: 'fill: var(--ansi-jaune)' }, dessin);
  const message = info(zone);

  glisser(dessin, poigneeU, (p) => {
    etat.u = surGrille(versMaths(p));
    actualiser();
  });
  glisser(dessin, poigneeV, (p) => {
    etat.v = surGrille(versMaths(p));
    actualiser();
  });
  glisser(dessin, poigneeW, (p) => {
    const coordonnees = coordonneesDansBase(versMaths(p), etat.u, etat.v);
    if (!coordonnees) return;
    etat.a = bornes(arrondirAu(coordonnees.a, 1), -3, 3);
    etat.b = bornes(arrondirAu(coordonnees.b, 1), -3, 3);
    reglageA.fixer(etat.a);
    reglageB.fixer(etat.b);
    actualiser();
  });

  function fleche(groupe, depart, arrivee, classe) {
    const debut = enPixels(depart);
    const fin = enPixels(arrivee);
    const forme = pointeFleche(debut, fin);
    if (!forme) return;
    const element = svg('g', { classe: `vecteurs-fleche ${classe}` }, groupe);
    ligne(element, [debut.x, debut.y], [forme.base.x, forme.base.y], {});
    svg('polygon', { points: forme.pointe.map(({ x, y }) => `${arrondir(x)},${arrondir(y)}`).join(' ') }, element);
  }

  function etoile({ x, y }, classe) {
    const points = Array.from({ length: 10 }, (_, i) => {
      const angle = -PI / 2 + (i * PI) / 5;
      const rayon = i % 2 === 0 ? 11 : 4.5;
      return `${arrondir(x + rayon * Math.cos(angle))},${arrondir(y + rayon * Math.sin(angle))}`;
    });
    svg('polygon', { points: points.join(' '), classe }, dynamique);
  }

  function nouvelleCible() {
    const { u, v } = etat;
    const dansLaVue = ({ x, y }) => Math.abs(x) <= 6 && Math.abs(y) <= 5;
    const tirer = () => (Math.floor(Math.random() * 11) - 5) / 2;
    etat.cible = null;
    for (let essai = 0; essai < 60 && !etat.cible; essai += 1) {
      const candidat = sontColineaires(u, v)
        ? { x: Math.floor(Math.random() * 11) - 5, y: Math.floor(Math.random() * 9) - 4 }
        : combinaison(tirer(), u, tirer(), v);
      const actuel = combinaison(etat.a, u, etat.b, v);
      if (dansLaVue(candidat) && Math.hypot(candidat.x - actuel.x, candidat.y - actuel.y) > 0.5) etat.cible = candidat;
    }
    actualiser();
  }

  function texteCible(libre, w) {
    const { cible, u, v } = etat;
    if (!cible) return '';
    const position = `(${nombre(cible.x)} ; ${nombre(cible.y)})`;
    if (Math.hypot(cible.x - w.x, cible.y - w.y) < 0.051) return ` <strong>Cible ${position} atteinte !</strong>`;
    if (libre) return ` Règle a et b (ou fais glisser w) pour atteindre la cible ★ ${position}.`;
    const direction = Math.hypot(u.x, u.y) > 0 ? u : v;
    const surLaDroite = Math.hypot(direction.x, direction.y) > 0 ? sontColineaires(cible, direction) : Math.hypot(cible.x, cible.y) < 1e-9;
    return surLaDroite
      ? ` La cible ★ ${position} est sur la droite : elle est atteignable.`
      : ` La cible ★ ${position} est <strong>impossible à atteindre</strong> : elle n’est pas sur la droite, la famille n’engendre pas ℝ².`;
  }

  function actualiser() {
    dynamique.replaceChildren();
    calqueCoupe.replaceChildren();
    const { u, v, a, b } = etat;
    const origine = { x: 0, y: 0 };
    const au = combinaison(a, u, 0, v);
    const bv = combinaison(0, u, b, v);
    const w = combinaison(a, u, b, v);
    const nul = Math.hypot(u.x, u.y) === 0 || Math.hypot(v.x, v.y) === 0;
    const libre = !sontColineaires(u, v);
    if (libre && etat.grille) {
      for (let k = -14; k <= 14; k += 1) {
        for (const [pas, direction] of [[u, v], [v, u]]) {
          const depart = enPixels(combinaison(k, pas, -40, direction));
          const arrivee = enPixels(combinaison(k, pas, 40, direction));
          ligne(calqueCoupe, [depart.x, depart.y], [arrivee.x, arrivee.y], { classe: 'vecteurs-grille-base' });
        }
      }
    }
    if (!libre) {
      const direction = Math.hypot(u.x, u.y) > 0 ? u : v;
      if (Math.hypot(direction.x, direction.y) > 0) {
        const depart = enPixels(combinaison(-40, direction, 0, direction));
        const arrivee = enPixels(combinaison(40, direction, 0, direction));
        ligne(calqueCoupe, [depart.x, depart.y], [arrivee.x, arrivee.y], { classe: 'vecteurs-droite' });
      }
    }
    if (libre) {
      const sommets = [origine, au, w, bv].map(enPixels).map(({ x, y }) => `${arrondir(x)},${arrondir(y)}`);
      svg('polygon', { points: sommets.join(' '), classe: 'vecteurs-parallelogramme' }, dynamique);
    }
    fleche(dynamique, origine, au, 'vecteurs-u vecteurs-construction');
    fleche(dynamique, au, w, 'vecteurs-v vecteurs-construction');
    fleche(dynamique, origine, u, 'vecteurs-u');
    fleche(dynamique, origine, v, 'vecteurs-v');
    fleche(dynamique, origine, w, 'vecteurs-w');
    if (etat.cible) {
      const atteinte = Math.hypot(etat.cible.x - w.x, etat.cible.y - w.y) < 0.051;
      etoile(enPixels(etat.cible), `vecteurs-cible${atteinte ? ' atteinte' : ''}`);
    }
    const nommer = (vecteur, texte, classe) => {
      const { x, y } = enPixels(vecteur);
      svg('text', { x: x + 12, y: y - 10, classe: `vecteurs-nom ${classe}`, texte }, dynamique);
    };
    nommer(u, 'u', 'vecteurs-nom-u');
    nommer(v, 'v', 'vecteurs-nom-v');
    nommer(w, 'w', 'vecteurs-nom-w');
    for (const [poignee, vecteur] of [[poigneeU, u], [poigneeV, v], [poigneeW, w]]) {
      const { x, y } = enPixels(vecteur);
      poignee.setAttribute('cx', x);
      poignee.setAttribute('cy', y);
    }
    poigneeW.classList.toggle('vecteurs-bloquee', !libre);

    const ecrire = ({ x, y }) => `(${nombre(x)} ; ${nombre(y)})`;
    const debut = `w = ${format(a)}·u ${b < 0 ? '−' : '+'} ${format(Math.abs(b))}·v = <strong>${ecrire(w)}</strong> avec u = ${ecrire(u)} et v = ${ecrire(v)}. `;
    let analyse;
    if (nul) analyse = 'La famille (u, v) contient le <strong>vecteur nul</strong> : elle est liée, ce n’est pas une base.';
    else if (!libre) analyse = 'u et v sont <strong>colinéaires</strong> (l’un est un multiple de l’autre) : la famille est liée, ce n’est pas une base. Toutes les combinaisons a·u + b·v restent sur la droite rouge.';
    else analyse = `u et v ne sont pas colinéaires : la famille est libre, et 2 vecteurs libres dans ℝ² forment une <strong>base</strong>. Les coordonnées de w dans cette base sont (${format(a)} ; ${format(b)}).`;
    message.innerHTML = debut + analyse + texteCible(libre, w);
  }

  actualiser();
}

export const animationsMaths = {
  venn: {
    titre: 'Diagramme de Venn',
    consigne: 'Choisis une opération pour allumer sa zone. En mode De Morgan, regarde les deux côtés se construire. En mode Défi, colorie toi-même la zone demandée.',
    creer: creerVenn,
  },
  quantificateurs: {
    titre: 'L’ordre de ∀ et ∃',
    consigne: 'Clique sur les cases pour dire qui manage qui : R(x, y) signifie « y est le manager de x ». Les deux phrases se réévaluent aussitôt.',
    creer: creerQuantificateurs,
  },
  'somme-gauss': {
    titre: 'L’astuce de Gauss : 1 + 2 + … + n',
    consigne: 'Choisis n, puis clique sur « Assembler » : l’escalier et sa copie retournée forment un rectangle.',
    creer: creerSommeGauss,
  },
  'exp-ln': {
    titre: 'exp et ln, deux reflets',
    consigne: 'Fais glisser un des deux points : son reflet suit de l’autre côté de la droite y = x.',
    creer: creerExpLn,
  },
  tangente: {
    titre: 'La tangente et sa pente',
    consigne: 'Fais glisser le point le long de la courbe (ou clique sur « Balayer ») : la pente de la tangente dessine la courbe de f′ en dessous.',
    creer: creerTangente,
  },
  integrale: {
    titre: 'L’aire sous la courbe avec des rectangles',
    consigne: 'Augmente le nombre de rectangles et change la façon de choisir leur hauteur : la somme se rapproche de l’intégrale.',
    creer: creerIntegrale,
  },
  vecteurs: {
    titre: 'Combinaison linéaire a·u + b·v',
    consigne: 'Règle a et b, fais glisser les pointes de u, v ou w. Essaie de rendre u et v colinéaires : la grille s’écrase sur une droite.',
    creer: creerVecteurs,
  },
};
