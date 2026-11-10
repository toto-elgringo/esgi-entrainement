import {
  aleatoire,
  attendre,
  bornes,
  boucle,
  bouton,
  choix,
  commandes,
  creerSvg,
  curseur,
  echelle,
  glisser,
  html,
  info,
  nombre,
  pointeurSvg,
  svg,
} from './outils.js';

const OPERATIONS_PAR_SECONDE = 1e9;

function factorielle(n) {
  let produit = 1;
  for (let i = 2; i <= n; i += 1) produit *= i;
  return produit;
}

export const FONCTIONS_CROISSANCE = [
  { cle: 'log', nom: 'log₂ n', couleur: 'var(--ansi-cyan)', calculer: (n) => Math.max(Math.log2(n), 1) },
  { cle: 'n', nom: 'n', couleur: 'var(--ansi-vert)', calculer: (n) => n },
  { cle: 'nlog', nom: 'n log₂ n', couleur: 'var(--ansi-bleu)', calculer: (n) => Math.max(n * Math.log2(n), 1) },
  { cle: 'n2', nom: 'n²', couleur: 'var(--ansi-jaune)', calculer: (n) => n ** 2 },
  { cle: 'n3', nom: 'n³', couleur: 'var(--ansi-magenta)', calculer: (n) => n ** 3 },
  { cle: '2n', nom: '2ⁿ', couleur: 'var(--ansi-rouge)', calculer: (n) => 2 ** n },
  { cle: 'fact', nom: 'n!', couleur: 'var(--erreur)', calculer: factorielle },
];

const UNITES_DUREE = [
  { seuil: 3.15e7, diviseur: 3.15e7, unite: 'ans' },
  { seuil: 86400, diviseur: 86400, unite: 'jours' },
  { seuil: 3600, diviseur: 3600, unite: 'h' },
  { seuil: 60, diviseur: 60, unite: 'min' },
  { seuil: 1, diviseur: 1, unite: 's' },
  { seuil: 1e-3, diviseur: 1e-3, unite: 'ms' },
  { seuil: 1e-6, diviseur: 1e-6, unite: 'µs' },
  { seuil: 0, diviseur: 1e-9, unite: 'ns' },
];

export function dureeLisible(secondes) {
  const { diviseur, unite } = UNITES_DUREE.find(({ seuil }) => secondes >= seuil);
  const valeur = secondes / diviseur;
  if (valeur >= 1e6) return `${valeur.toExponential(1).replace('.', ',').replace('e+', ' × 10^')} ${unite}`;
  return `${nombre(valeur, valeur < 10 ? 1 : 0)} ${unite}`;
}

const REPERES = [
  { seuil: 4.3e17, texte: 'plus que l’âge de l’Univers' },
  { seuil: 3.15e9, texte: 'plus d’un siècle' },
  { seuil: 3.15e7, texte: 'plus d’un an' },
  { seuil: 86400, texte: 'plus d’une journée' },
  { seuil: 60, texte: 'le temps d’un café' },
  { seuil: 0.3, texte: 'on attend un peu' },
  { seuil: 0, texte: 'instantané' },
];

export function repereDuree(secondes) {
  return REPERES.find(({ seuil }) => secondes >= seuil).texte;
}

function creerCroissance(zone, options) {
  const largeur = 640;
  const hauteur = 320;
  const marge = { gauche: 52, droite: 16, haut: 14, bas: 34 };
  const nMax = options.max ?? 30;
  let n = options.n ?? 20;
  let logarithmique = true;
  const visibles = new Set(FONCTIONS_CROISSANCE.map(({ cle }) => cle));

  const commandes = html('div', { classe: 'anim-commandes' }, zone);
  const reglage = curseur(commandes, { libelle: 'n =', min: 1, max: nMax, valeur: n, auChangement: (valeur) => { n = valeur; dessiner(); } });
  reglage.element.classList.add('anim-curseur-large');
  choix(commandes, {
    options: [{ valeur: 'log', texte: 'Échelle log' }, { valeur: 'lineaire', texte: 'Échelle normale' }],
    valeur: 'log',
    auChangement: (valeur) => { logarithmique = valeur === 'log'; dessiner(); },
  });

  const dessin = creerSvg(zone, largeur, hauteur);
  const legende = html('div', { classe: 'anim-legende-series' }, zone);
  for (const fonction of FONCTIONS_CROISSANCE) {
    const element = html('button', { type: 'button', classe: 'anim-serie actif', style: `--serie: ${fonction.couleur}` }, legende);
    html('span', { classe: 'anim-serie-pastille' }, element);
    html('span', { texte: fonction.nom }, element);
    element.addEventListener('click', () => {
      if (visibles.has(fonction.cle)) visibles.delete(fonction.cle);
      else visibles.add(fonction.cle);
      element.classList.toggle('actif', visibles.has(fonction.cle));
      dessiner();
    });
  }
  const tableau = html('table', { classe: 'anim-tableau' }, zone);
  const conclusion = info(zone);

  function dessiner() {
    dessin.replaceChildren();
    const actives = FONCTIONS_CROISSANCE.filter(({ cle }) => visibles.has(cle));
    const valeurMax = Math.max(10, ...actives.map(({ calculer }) => calculer(n)));
    const versX = echelle([1, nMax], [marge.gauche, largeur - marge.droite]);
    const yHaut = logarithmique ? Math.log10(valeurMax) : valeurMax;
    const versY = echelle([0, yHaut], [hauteur - marge.bas, marge.haut]);
    const y = (valeur) => versY(Math.min(logarithmique ? Math.log10(Math.max(valeur, 1)) : valeur, yHaut * 1.05));

    const graduations = logarithmique
      ? Array.from({ length: 5 }, (_, i) => 10 ** Math.round((yHaut * i) / 4))
      : Array.from({ length: 5 }, (_, i) => (valeurMax * i) / 4);
    for (const graduation of graduations) {
      const position = y(graduation);
      svg('line', { x1: marge.gauche, x2: largeur - marge.droite, y1: position, y2: position, classe: 'anim-grille' }, dessin);
      const texte = graduation >= 1e5 ? `10^${Math.round(Math.log10(graduation))}` : nombre(graduation, 0);
      svg('text', { x: marge.gauche - 6, y: position + 4, 'text-anchor': 'end', classe: 'anim-graduation', texte }, dessin);
    }
    for (let i = 5; i <= nMax; i += 5) {
      svg('text', { x: versX(i), y: hauteur - marge.bas + 18, 'text-anchor': 'middle', classe: 'anim-graduation', texte: i }, dessin);
    }
    svg('text', { x: largeur - marge.droite, y: hauteur - 4, 'text-anchor': 'end', classe: 'anim-graduation', texte: 'taille du problème n' }, dessin);
    svg('rect', { x: marge.gauche, y: marge.haut, width: versX(n) - marge.gauche, height: hauteur - marge.haut - marge.bas, classe: 'anim-zone-active' }, dessin);

    for (const { calculer, couleur } of actives) {
      const points = [];
      for (let i = 1; i <= n; i += 0.25) points.push(`${versX(i)},${y(calculer(i))}`);
      svg('polyline', { points: points.join(' '), classe: 'anim-courbe', style: `stroke: ${couleur}` }, dessin);
      svg('circle', { cx: versX(n), cy: y(calculer(n)), r: 4.5, classe: 'anim-point', style: `fill: ${couleur}` }, dessin);
    }
    svg('line', { x1: versX(n), x2: versX(n), y1: marge.haut, y2: hauteur - marge.bas, classe: 'anim-repere' }, dessin);

    tableau.innerHTML = '<thead><tr><th>Coût</th><th>Opérations</th><th>Temps à 10⁹ op/s</th><th></th></tr></thead>';
    const corps = html('tbody', {}, tableau);
    for (const { nom, calculer, couleur } of actives) {
      const operations = calculer(n);
      const secondes = operations / OPERATIONS_PAR_SECONDE;
      const ligne = html('tr', {}, corps);
      html('td', { html: `<span class="anim-serie-pastille" style="--serie: ${couleur}"></span> ${nom}` }, ligne);
      html('td', { texte: operations >= 1e7 ? operations.toExponential(1).replace('.', ',').replace('e+', ' × 10^') : nombre(Math.round(operations), 0) }, ligne);
      html('td', { texte: dureeLisible(secondes) }, ligne);
      html('td', { classe: secondes > 3.15e7 ? 'anim-alerte' : '', texte: repereDuree(secondes) }, ligne);
    }
    const pire = actives.at(-1);
    conclusion.innerHTML = pire
      ? `Avec <strong>n = ${n}</strong>, l’algorithme en <strong>${pire.nom}</strong> demande ${dureeLisible(pire.calculer(n) / OPERATIONS_PAR_SECONDE)} de calcul.`
      : 'Choisis au moins une courbe.';
  }

  dessiner();
}

const ANNULATION = new Error('séquence annulée');

function sequenceur(element) {
  let jeton = 0;
  return {
    annuler() {
      jeton += 1;
    },
    async lancer(action) {
      jeton += 1;
      const mien = jeton;
      const pause = async (millisecondes) => {
        await attendre(element, millisecondes);
        if (mien !== jeton) throw ANNULATION;
      };
      try {
        await action(pause);
      } catch (erreur) {
        if (erreur !== ANNULATION && element.isConnected) throw erreur;
      }
    },
  };
}

const deuxDecimales = (valeur) => valeur.toFixed(2).replace('.', ',').replace('-', '−');
const pourcentage = (valeur, decimales = 1) => `${nombre(valeur * 100, decimales)} %`;
const temperatureLisible = (valeur) => nombre(valeur, valeur < 1 ? 2 : 1);
const avecSigne = (valeur) => (valeur > 0 ? `+${deuxDecimales(valeur)}` : deuxDecimales(valeur));
const CHIFFRES_EXPOSANTS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const exposant = (entier) => String(entier).split('').map((chiffre) => CHIFFRES_EXPOSANTS[Number(chiffre)]).join('');

export function melanger(liste, hasard) {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i -= 1) {
    const j = Math.floor(hasard() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

export const VILLES_COURS = [
  { nom: 'A', x: 4, y: 6 },
  { nom: 'B', x: 1, y: 5 },
  { nom: 'C', x: 2, y: 5 },
  { nom: 'D', x: 4, y: 5 },
  { nom: 'E', x: 1, y: 6 },
  { nom: 'F', x: 4, y: 2 },
];

const LETTRES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function longueurTournee(villes, ordre) {
  return ordre.reduce((total, ville, i) => total + distance(villes[ville], villes[ordre[(i + 1) % ordre.length]]), 0);
}

export function villesAuHasard(nombreVilles, hasard, { largeur = 10, hauteur = 6, ecartMin = 0.9 } = {}) {
  const villes = [];
  for (let i = 0; i < nombreVilles; i += 1) {
    let ville = null;
    for (let essai = 0; essai < 60; essai += 1) {
      ville = { nom: LETTRES[i], x: hasard() * largeur, y: hasard() * hauteur };
      if (villes.every((autre) => distance(autre, ville) >= ecartMin)) break;
    }
    villes.push(ville);
  }
  return villes;
}

export function plusProcheVoisin(villes, depart = 0) {
  const ordre = [depart];
  const restantes = new Set(villes.keys());
  restantes.delete(depart);
  while (restantes.size) {
    const courante = villes[ordre.at(-1)];
    let proche = null;
    for (const indice of restantes) {
      if (proche === null || distance(courante, villes[indice]) < distance(courante, villes[proche])) proche = indice;
    }
    ordre.push(proche);
    restantes.delete(proche);
  }
  return ordre;
}

export const voisins2opt = (nombreVilles) => (nombreVilles * (nombreVilles - 3)) / 2;

export function echange2opt(villes, ordre, i, j) {
  const [a, b, c, d] = [ordre[i], ordre[i + 1], ordre[j], ordre[(j + 1) % ordre.length]];
  const avant = distance(villes[a], villes[b]) + distance(villes[c], villes[d]);
  const apres = distance(villes[a], villes[c]) + distance(villes[b], villes[d]);
  return { i, j, a, b, c, d, avant, apres, gain: avant - apres };
}

export function premiereAmelioration2opt(villes, ordre, epsilon = 1e-9) {
  const n = ordre.length;
  for (let i = 0; i < n - 2; i += 1) {
    for (let j = i + 2; j < n; j += 1) {
      if (i === 0 && j === n - 1) continue;
      const echange = echange2opt(villes, ordre, i, j);
      if (echange.gain > epsilon) return echange;
    }
  }
  return null;
}

export function appliquer2opt(ordre, i, j) {
  return [...ordre.slice(0, i + 1), ...ordre.slice(i + 1, j + 1).reverse(), ...ordre.slice(j + 1)];
}

export function tourneeOptimale(villes) {
  const n = villes.length;
  let meilleure = { ordre: [...villes.keys()], longueur: longueurTournee(villes, [...villes.keys()]) };
  const utilisees = new Set([0]);
  const ordre = [0];
  function explorer(longueur) {
    if (longueur >= meilleure.longueur) return;
    if (ordre.length === n) {
      const totale = longueur + distance(villes[ordre.at(-1)], villes[0]);
      if (totale < meilleure.longueur - 1e-9) meilleure = { ordre: [...ordre], longueur: totale };
      return;
    }
    for (let ville = 1; ville < n; ville += 1) {
      if (utilisees.has(ville)) continue;
      utilisees.add(ville);
      ordre.push(ville);
      explorer(longueur + distance(villes[ordre.at(-2)], villes[ville]));
      ordre.pop();
      utilisees.delete(ville);
    }
  }
  explorer(0);
  return meilleure;
}

const grandNombre = (valeur) => (valeur >= 1e7 ? valeur.toExponential(1).replace('.', ',').replace('e+', ' × 10^') : nombre(valeur, 0));

export function toursDistincts(nombreVilles) {
  return factorielle(nombreVilles - 1) / 2;
}

function creerVoyageur(zone, options) {
  const largeur = 640;
  const hauteur = 380;
  const marge = 36;
  const hasard = aleatoire(options.graine ?? 3);
  const sequence = sequenceur(zone);
  let villes = [];
  let ordre = [];
  let lignes = [];
  let optimum = null;
  let versX = null;
  let versY = null;
  let elementsVilles = [];

  const ligneActions = commandes(zone);
  bouton(ligneActions, 'Pas 2-opt', () => sequence.lancer((pause) => unPas(pause, 1100)), { principal: true });
  bouton(ligneActions, 'Jusqu’à 2-optimale', () => sequence.lancer(jusquAuBout));
  bouton(ligneActions, 'Glouton depuis A', () => { sequence.annuler(); glouton(); });
  bouton(ligneActions, 'Tournée au hasard', () => { sequence.annuler(); auHasard(); });
  const ligneVilles = commandes(zone);
  const reglageVilles = curseur(ligneVilles, {
    libelle: 'Villes',
    min: 5,
    max: 26,
    valeur: options.n ?? 12,
    auChangement: () => { sequence.annuler(); nouvellesVilles(); },
  });
  bouton(ligneVilles, 'Nouvelles villes', () => { sequence.annuler(); nouvellesVilles(); });
  bouton(ligneVilles, 'Exemple du cours (6 villes)', () => { sequence.annuler(); exempleCours(); });

  const dessin = creerSvg(zone, largeur, hauteur, 'combi-voyageur');
  const calqueAretes = svg('g', {}, dessin);
  const calqueEchange = svg('g', {}, dessin);
  const calqueVilles = svg('g', {}, dessin);
  const message = info(zone);
  const bilan = info(zone);
  const tableau = html('table', { classe: 'anim-tableau' }, zone);

  const nom = (ville) => villes[ville].nom;
  const nomsTournee = () => ordre.map(nom).join(' ');

  function cadrer() {
    const xs = villes.map(({ x }) => x);
    const ys = villes.map(({ y }) => y);
    const [xMin, xMax, yMin, yMax] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const unite = 1 / Math.max((xMax - xMin) / (largeur - 2 * marge), (yMax - yMin) / (hauteur - 2 * marge), 1e-6);
    const [cx, cy] = [(xMin + xMax) / 2, (yMin + yMax) / 2];
    versX = echelle([cx, cx + 1], [largeur / 2, largeur / 2 + unite]);
    versY = echelle([cy, cy + 1], [hauteur / 2, hauteur / 2 - unite]);
  }

  function construireVilles() {
    cadrer();
    calqueVilles.replaceChildren();
    optimum = villes.length <= 9 ? tourneeOptimale(villes) : null;
    elementsVilles = villes.map((ville) => {
      const groupe = svg('g', { classe: 'combi-ville' }, calqueVilles);
      const zoneTactile = svg('circle', { r: 18, classe: 'combi-ville-zone' }, groupe);
      const point = svg('circle', { r: 9, classe: 'combi-ville-point' }, groupe);
      const texte = svg('text', { 'text-anchor': 'middle', classe: 'combi-ville-nom', texte: ville.nom }, groupe);
      glisser(dessin, groupe, (position) => {
        sequence.annuler();
        calqueEchange.replaceChildren();
        ville.x = versX.inverse(bornes(position.x, 12, largeur - 12));
        ville.y = versY.inverse(bornes(position.y, 12, hauteur - 12));
        optimum = villes.length <= 9 ? tourneeOptimale(villes) : null;
        departHistorique('villes déplacées');
      });
      return { zoneTactile, point, texte };
    });
  }

  function dessiner(segment = []) {
    calqueAretes.replaceChildren();
    ordre.forEach((ville, i) => {
      const [a, b] = [villes[ville], villes[ordre[(i + 1) % ordre.length]]];
      svg('line', { x1: versX(a.x), y1: versY(a.y), x2: versX(b.x), y2: versY(b.y), classe: 'combi-arete' }, calqueAretes);
    });
    villes.forEach((ville, indice) => {
      const { zoneTactile, point, texte } = elementsVilles[indice];
      const [x, y] = [versX(ville.x), versY(ville.y)];
      for (const cercle of [zoneTactile, point]) {
        cercle.setAttribute('cx', x);
        cercle.setAttribute('cy', y);
      }
      texte.setAttribute('x', x);
      texte.setAttribute('y', y - 14);
      point.setAttribute('class', `combi-ville-point${indice === ordre[0] ? ' depart' : ''}${segment.includes(indice) ? ' segment' : ''}`);
    });
  }

  function afficherTableau() {
    const recentes = lignes.slice(-8);
    tableau.innerHTML = '<thead><tr><th>Pas</th><th>Tournée</th><th>Échange</th><th>Longueur</th></tr></thead>';
    const corps = html('tbody', {}, tableau);
    for (const { pas, tournee, echange, longueur } of recentes) {
      const ligne = html('tr', {}, corps);
      html('td', { texte: pas }, ligne);
      html('td', { texte: tournee, classe: 'combi-tournee' }, ligne);
      html('td', { texte: echange }, ligne);
      html('td', { texte: deuxDecimales(longueur) }, ligne);
    }
  }

  function afficherBilan() {
    const n = villes.length;
    const longueur = longueurTournee(villes, ordre);
    let texte = `${n} villes : <strong>${grandNombre(toursDistincts(n))}</strong> tournées distinctes, chacune a <strong>${voisins2opt(n)}</strong> voisins 2-opt. Longueur actuelle : <strong>${deuxDecimales(longueur)}</strong>.`;
    if (optimum) {
      const atteint = longueur <= optimum.longueur + 1e-6;
      texte += ` Optimum global (par énumération) : ${deuxDecimales(optimum.longueur)}${atteint ? ', <strong class="combi-ok">atteint</strong>.' : '.'}`;
    }
    bilan.innerHTML = texte;
  }

  function departHistorique(origine) {
    lignes = [{ pas: 0, tournee: nomsTournee(), echange: origine, longueur: longueurTournee(villes, ordre) }];
    message.innerHTML = 'Clique sur « Pas 2-opt » : on cherche le premier échange qui raccourcit la tournée. Tu peux aussi déplacer les villes.';
    dessiner();
    afficherTableau();
    afficherBilan();
  }

  function glouton() {
    calqueEchange.replaceChildren();
    ordre = plusProcheVoisin(villes, 0);
    departHistorique(`glouton depuis ${villes[0].nom}`);
  }

  function auHasard() {
    calqueEchange.replaceChildren();
    ordre = [0, ...melanger([...villes.keys()].slice(1), hasard)];
    departHistorique('tournée au hasard');
  }

  function nouvellesVilles() {
    villes = villesAuHasard(reglageVilles.lire(), hasard);
    construireVilles();
    auHasard();
  }

  function exempleCours() {
    villes = VILLES_COURS.map((ville) => ({ ...ville }));
    construireVilles();
    glouton();
  }

  function montrerEchange({ i, j, a, b, c, d }) {
    calqueEchange.replaceChildren();
    const trait = (p, q, classe) => svg('line', {
      x1: versX(villes[p].x), y1: versY(villes[p].y), x2: versX(villes[q].x), y2: versY(villes[q].y), classe,
    }, calqueEchange);
    trait(a, b, 'combi-arete-retiree');
    trait(c, d, 'combi-arete-retiree');
    trait(a, c, 'combi-arete-ajoutee');
    trait(b, d, 'combi-arete-ajoutee');
    dessiner(ordre.slice(i + 1, j + 1));
  }

  function texteEchange({ a, b, c, d, avant, apres, gain }) {
    const ecart = (p, q) => deuxDecimales(distance(villes[p], villes[q]));
    return `Retirer <span class="combi-non">(${nom(a)}, ${nom(b)})</span> et <span class="combi-non">(${nom(c)}, ${nom(d)})</span>, `
      + `relier <span class="combi-ok">(${nom(a)}, ${nom(c)})</span> et <span class="combi-ok">(${nom(b)}, ${nom(d)})</span> : `
      + `d(${nom(a)},${nom(c)}) + d(${nom(b)},${nom(d)}) = ${ecart(a, c)} + ${ecart(b, d)} = ${deuxDecimales(apres)} `
      + `&lt; d(${nom(a)},${nom(b)}) + d(${nom(c)},${nom(d)}) = ${ecart(a, b)} + ${ecart(c, d)} = ${deuxDecimales(avant)}. `
      + `Gain : <strong>${deuxDecimales(gain)}</strong>.`;
  }

  async function unPas(pause, duree) {
    calqueEchange.replaceChildren();
    const echange = premiereAmelioration2opt(villes, ordre);
    if (!echange) {
      dessiner();
      message.innerHTML = `Aucun des ${voisins2opt(villes.length)} échanges 2-opt ne raccourcit la tournée : elle est <strong>2-optimale</strong>, c’est un optimum local.`;
      return false;
    }
    montrerEchange(echange);
    message.innerHTML = texteEchange(echange);
    await pause(duree);
    ordre = appliquer2opt(ordre, echange.i, echange.j);
    calqueEchange.replaceChildren();
    lignes.push({
      pas: lignes.length,
      tournee: nomsTournee(),
      echange: `inverser ${nom(echange.b)}…${nom(echange.c)}`,
      longueur: longueurTournee(villes, ordre),
    });
    dessiner();
    afficherTableau();
    afficherBilan();
    return true;
  }

  async function jusquAuBout(pause) {
    while (await unPas(pause, 550)) await pause(200);
  }

  if (options.villes === 'cours') exempleCours();
  else nouvellesVilles();
}

const VALLEES_RECUIT = [
  [0.1, 32, 0.055],
  [0.3, 40, 0.05],
  [0.5, 30, 0.05],
  [0.71, 62, 0.055],
  [0.9, 38, 0.05],
];

export function coutPaysage(x) {
  const creux = VALLEES_RECUIT.reduce((total, [centre, profondeur, largeur]) => total + profondeur * Math.exp(-((x - centre) ** 2) / (2 * largeur ** 2)), 0);
  return 78 - creux + 4 * Math.sin(2 * Math.PI * 9 * x);
}

export const PAYSAGE_RECUIT = Array.from({ length: 81 }, (_, i) => coutPaysage(i / 80));

export const REGLAGES_RECUIT = { mode: 'recuit', t0: 50, alpha: 0.98, palier: 20, tf: 0.05, pasMax: 4, depart: 3, refusMax: 150 };

export function probabiliteAcceptation(delta, temperature) {
  if (delta <= 0) return 1;
  if (temperature <= 0) return 0;
  return Math.exp(-delta / temperature);
}

export function accepterVoisin(delta, temperature, tirage) {
  return tirage < probabiliteAcceptation(delta, temperature);
}

export function temperatureGeometrique(t0, alpha, palier) {
  return t0 * alpha ** palier;
}

export function temperatureLineaire(t0, iteration, iterationMax) {
  return t0 * (1 - iteration / iterationMax);
}

export function paliersNecessaires(t0, tf, alpha) {
  return Math.ceil(Math.log(tf / t0) / Math.log(alpha) - 1e-9);
}

export function temperatureInitiale(delta, probabilite) {
  return -delta / Math.log(probabilite);
}

export function nouveauRecuit(reglages = {}, paysage = PAYSAGE_RECUIT) {
  const complets = { ...REGLAGES_RECUIT, ...reglages };
  const temperature = complets.mode === 'descente' ? 0 : complets.t0;
  return {
    reglages: complets,
    position: complets.depart,
    meilleure: complets.depart,
    temperature,
    iteration: 0,
    refusDeSuite: 0,
    termine: false,
    historique: [{ iteration: 0, temperature, cout: paysage[complets.depart], meilleur: paysage[complets.depart] }],
  };
}

export function iterationRecuit(etat, hasard, paysage = PAYSAGE_RECUIT) {
  const { reglages } = etat;
  const saut = 1 + Math.floor(hasard() * reglages.pasMax);
  const vers = bornes(etat.position + (hasard() < 0.5 ? -saut : saut), 0, paysage.length - 1);
  const delta = paysage[vers] - paysage[etat.position];
  const temperature = etat.temperature;
  const probabilite = probabiliteAcceptation(delta, temperature);
  const tirage = hasard();
  const accepte = tirage < probabilite;
  const essai = { depuis: etat.position, vers, delta, temperature, probabilite, tirage, accepte };
  if (accepte) etat.position = vers;
  if (paysage[etat.position] < paysage[etat.meilleure]) etat.meilleure = etat.position;
  etat.refusDeSuite = accepte && delta < 0 ? 0 : etat.refusDeSuite + 1;
  etat.iteration += 1;
  const finDePalier = etat.iteration % reglages.palier === 0;
  if (reglages.mode === 'recuit' && finDePalier) etat.temperature *= reglages.alpha;
  etat.termine = reglages.mode === 'recuit' ? etat.temperature < reglages.tf : etat.refusDeSuite >= reglages.refusMax;
  if (finDePalier || etat.termine) {
    etat.historique.push({ iteration: etat.iteration, temperature: etat.temperature, cout: paysage[etat.position], meilleur: paysage[etat.meilleure] });
  }
  return essai;
}

export function simulerRecuit(reglages, graine, paysage = PAYSAGE_RECUIT, limite = 1e6) {
  const hasard = aleatoire(graine);
  const etat = nouveauRecuit(reglages, paysage);
  while (!etat.termine && etat.iteration < limite) iterationRecuit(etat, hasard, paysage);
  return etat;
}

function creerRecuit(zone, options) {
  const largeur = 680;
  const hauteur = 300;
  const paysage = PAYSAGE_RECUIT;
  const indiceGlobal = paysage.indexOf(Math.min(...paysage));
  const hasard = aleatoire(options.graine ?? 1);
  const departInitial = options.depart ?? REGLAGES_RECUIT.depart;
  const reglages = { mode: options.mode === 'descente' ? 'descente' : 'recuit', t0: options.t0 ?? REGLAGES_RECUIT.t0, alpha: options.alpha ?? REGLAGES_RECUIT.alpha };
  let vitesse = options.vitesse ?? 25;
  let etat = null;
  let dernier = null;
  let degradations = [];
  let lancements = 0;
  let record = Infinity;

  const ligneActions = commandes(zone);
  const lecture = bouton(ligneActions, '▶ Lancer', () => (animation.enMarche ? suspendre() : jouer()), { principal: true });
  bouton(ligneActions, 'Un essai', () => { suspendre(); avancer(1); });
  bouton(ligneActions, 'Recommencer', () => recommencer(departInitial));
  bouton(ligneActions, 'Départ au hasard', () => { recommencer(Math.floor(hasard() * paysage.length)); jouer(); });
  choix(ligneActions, {
    options: [{ valeur: 'recuit', texte: 'Recuit simulé' }, { valeur: 'descente', texte: 'Descente' }],
    valeur: reglages.mode,
    auChangement: (valeur) => { reglages.mode = valeur; montrerReglages(); recommencer(departInitial); },
  });
  const ligneReglages = commandes(zone);
  const reglageT0 = curseur(ligneReglages, { libelle: 'T₀', min: 1, max: 100, valeur: reglages.t0, auChangement: (valeur) => { reglages.t0 = valeur; recommencer(etat.reglages.depart); } });
  const reglageAlpha = curseur(ligneReglages, {
    libelle: 'α',
    min: 0.8,
    max: 0.995,
    pas: 0.005,
    valeur: reglages.alpha,
    format: (valeur) => nombre(valeur, 3),
    auChangement: (valeur) => { reglages.alpha = valeur; etat.reglages.alpha = valeur; dessiner(); },
  });
  curseur(ligneReglages, { libelle: 'Vitesse', min: 1, max: 60, valeur: vitesse, auChangement: (valeur) => { vitesse = valeur; } });

  const dessin = creerSvg(zone, largeur, hauteur, 'combi-recuit');
  const versX = echelle([0, paysage.length - 1], [30, 610]);
  const versY = echelle([0, 90], [hauteur - 22, 14]);
  const points = paysage.map((cout, i) => `${versX(i)},${versY(cout)}`);
  svg('path', { d: `M${versX(0)},${hauteur - 22} L${points.join(' L')} L${versX(paysage.length - 1)},${hauteur - 22} Z`, classe: 'combi-paysage-fond' }, dessin);
  svg('polyline', { points: points.join(' '), classe: 'combi-paysage' }, dessin);
  svg('text', { x: versX(indiceGlobal), y: hauteur - 6, 'text-anchor': 'middle', classe: 'anim-graduation', texte: '↑ minimum global' }, dessin);
  const lienEssai = svg('line', { classe: 'combi-essai-lien' }, dessin);
  const essaiCercle = svg('circle', { r: 7, classe: 'combi-essai' }, dessin);
  const meilleurCercle = svg('circle', { r: 13, classe: 'combi-meilleur' }, dessin);
  const bille = svg('circle', { r: 9, classe: 'combi-bille' }, dessin);
  svg('rect', { x: 640, y: 20, width: 18, height: 250, rx: 9, classe: 'combi-thermo-tube' }, dessin);
  const mercure = svg('rect', { x: 644, width: 10, rx: 5, classe: 'combi-thermo-mercure' }, dessin);
  const texteTemperature = svg('text', { x: 649, y: 288, 'text-anchor': 'middle', classe: 'combi-thermo-texte' }, dessin);

  const courbes = creerSvg(zone, largeur, 130, 'combi-recuit-courbes');
  const versXc = (iteration, total) => 30 + (620 * iteration) / Math.max(total, 1);
  const versYc = echelle([0, 90], [118, 8]);
  svg('line', { x1: 30, x2: 650, y1: 118, y2: 118, classe: 'anim-axe' }, courbes);
  svg('text', { x: 650, y: 130, 'text-anchor': 'end', classe: 'anim-graduation', texte: 'essais →' }, courbes);
  const courbeTemperature = svg('polyline', { classe: 'anim-courbe', style: 'stroke: var(--ansi-rouge)' }, courbes);
  const courbeCout = svg('polyline', { classe: 'anim-courbe combi-courbe-fine', style: 'stroke: var(--ansi-bleu)' }, courbes);
  const courbeMeilleur = svg('polyline', { classe: 'anim-courbe', style: 'stroke: var(--succes)' }, courbes);
  const legende = html('div', { classe: 'anim-legende-series' }, zone);
  const serieTemperature = html('span', { classe: 'anim-serie actif', style: '--serie: var(--ansi-rouge)', html: '<span class="anim-serie-pastille"></span> température T' }, legende);
  html('span', { classe: 'anim-serie actif', style: '--serie: var(--ansi-bleu)', html: '<span class="anim-serie-pastille"></span> coût courant' }, legende);
  html('span', { classe: 'anim-serie actif', style: '--serie: var(--succes)', html: '<span class="anim-serie-pastille"></span> meilleur coût rencontré' }, legende);

  const texteEssai = info(zone);
  const texteStatut = info(zone);
  const texteBilan = info(zone);

  const animation = boucle(dessin, () => {
    avancer(vitesse);
    if (etat.termine) {
      lecture.textContent = '▶ Lancer';
      return false;
    }
    return true;
  });

  function montrerReglages() {
    const recuit = reglages.mode === 'recuit';
    reglageT0.element.style.display = recuit ? '' : 'none';
    reglageAlpha.element.style.display = recuit ? '' : 'none';
    serieTemperature.style.display = recuit ? '' : 'none';
  }

  function recommencer(depart) {
    suspendre();
    etat = nouveauRecuit({ ...reglages, depart }, paysage);
    dernier = null;
    degradations = [];
    lancements += 1;
    dessiner();
  }

  function jouer() {
    if (etat.termine) recommencer(etat.reglages.depart);
    animation.demarrer();
    lecture.textContent = '⏸ Pause';
  }

  function suspendre() {
    animation.arreter();
    lecture.textContent = '▶ Lancer';
  }

  function avancer(nombreEssais) {
    for (let i = 0; i < nombreEssais && !etat.termine; i += 1) {
      dernier = iterationRecuit(etat, hasard, paysage);
      if (dernier.delta > 0) degradations.push(dernier.accepte);
    }
    if (degradations.length > 100) degradations = degradations.slice(-100);
    dessiner();
  }

  function decrireEssai(essai) {
    const verdict = essai.accepte ? '<strong class="combi-ok">accepté</strong>' : '<strong class="combi-non">refusé</strong>';
    const debut = `Essai n° ${etat.iteration} : position ${essai.depuis} → ${essai.vers}, ΔE = ${avecSigne(essai.delta)}`;
    if (essai.delta <= 0) return `${debut} ≤ 0 : voisin meilleur ou égal, ${verdict}.`;
    if (etat.reglages.mode === 'descente') return `${debut} &gt; 0 : la descente refuse toute dégradation, ${verdict}.`;
    return `${debut} · P = e^(−ΔE/T) = e^(−${deuxDecimales(essai.delta)} / ${deuxDecimales(essai.temperature)}) = <strong>${pourcentage(essai.probabilite)}</strong> · r = ${deuxDecimales(essai.tirage)} ${essai.accepte ? '&lt;' : '≥'} P : ${verdict}.`;
  }

  function dessiner() {
    const placer = (cercle, indice, decalage) => {
      cercle.setAttribute('cx', versX(indice));
      cercle.setAttribute('cy', versY(paysage[indice]) - decalage);
    };
    placer(bille, etat.position, 9);
    placer(meilleurCercle, etat.meilleure, 9);
    if (dernier) {
      placer(essaiCercle, dernier.vers, 7);
      essaiCercle.setAttribute('class', `combi-essai ${dernier.accepte ? 'accepte' : 'refuse'}`);
      lienEssai.setAttribute('x1', versX(dernier.depuis));
      lienEssai.setAttribute('y1', versY(paysage[dernier.depuis]) - 9);
      lienEssai.setAttribute('x2', versX(dernier.vers));
      lienEssai.setAttribute('y2', versY(paysage[dernier.vers]) - 7);
    }
    essaiCercle.style.display = dernier ? '' : 'none';
    lienEssai.style.display = dernier ? '' : 'none';

    const { t0, tf, alpha, palier, mode } = etat.reglages;
    const niveau = mode === 'recuit' ? bornes(Math.log(Math.max(etat.temperature, tf) / tf) / Math.log(t0 / tf), 0, 1) : 0;
    const hauteurMercure = 8 + 234 * niveau;
    mercure.setAttribute('y', 266 - hauteurMercure);
    mercure.setAttribute('height', hauteurMercure);
    mercure.setAttribute('class', `combi-thermo-mercure ${niveau > 0.66 ? 'chaud' : niveau > 0.33 ? 'tiede' : 'froid'}`);
    texteTemperature.textContent = `T = ${temperatureLisible(etat.temperature)}`;

    const total = Math.max(mode === 'recuit' ? paliersNecessaires(t0, tf, alpha) * palier : 400, etat.iteration);
    const versYt = echelle([0, t0], [118, 8]);
    courbeTemperature.setAttribute('points', etat.historique.map(({ iteration, temperature }) => `${versXc(iteration, total)},${versYt(temperature)}`).join(' '));
    courbeCout.setAttribute('points', etat.historique.map(({ iteration, cout }) => `${versXc(iteration, total)},${versYc(cout)}`).join(' '));
    courbeMeilleur.setAttribute('points', etat.historique.map(({ iteration, meilleur }) => `${versXc(iteration, total)},${versYc(meilleur)}`).join(' '));

    texteEssai.innerHTML = dernier ? decrireEssai(dernier) : 'La bille part d’un creux à gauche. Lance la recherche ou avance essai par essai.';
    const acceptees = degradations.filter(Boolean).length;
    const tauxDegradations = degradations.length ? ` · dégradations acceptées (100 dernières) : <strong>${pourcentage(acceptees / degradations.length, 0)}</strong>` : '';
    const repere = mode === 'recuit' ? ` · avec T = ${temperatureLisible(etat.temperature)}, une dégradation de 10 passe ${pourcentage(probabiliteAcceptation(10, etat.temperature))} du temps` : '';
    texteStatut.innerHTML = `Coût courant <strong>${nombre(paysage[etat.position], 1)}</strong> · meilleur <strong>${nombre(paysage[etat.meilleure], 1)}</strong>${tauxDegradations}${repere}.`;

    record = Math.min(record, paysage[etat.meilleure]);
    texteBilan.innerHTML = etat.termine ? conclusion() : (lancements > 1 ? `Meilleur coût sur tous les lancements : ${nombre(record, 1)} (${lancements} lancements).` : '');
  }

  function conclusion() {
    const meilleur = paysage[etat.meilleure];
    const global = Math.abs(etat.meilleure - indiceGlobal) <= 1;
    const resultat = global
      ? `<strong class="combi-ok">minimum global</strong> (${nombre(meilleur, 1)})`
      : `<strong class="combi-non">minimum local</strong> de coût ${nombre(meilleur, 1)}, alors que le minimum global vaut ${nombre(paysage[indiceGlobal], 1)}`;
    if (etat.reglages.mode === 'descente') {
      return `Bloquée : ${etat.reglages.refusMax} essais sans amélioration d’affilée. Résultat : ${resultat}.${global ? '' : ' Essaie le recuit, ou un départ au hasard (multi-start).'}`;
    }
    const conseil = global ? '' : (etat.reglages.alpha < 0.95 ? ' Refroidissement trop rapide : c’est la trempe. Rapproche α de 1.' : ' Relance : le recuit est aléatoire, ou rapproche α de 1.');
    return `Gelé (T &lt; ${nombre(etat.reglages.tf, 2)}) après ${nombre(etat.iteration, 0)} essais. Meilleure solution rencontrée : ${resultat}.${conseil}`;
  }

  montrerReglages();
  recommencer(departInitial);
}

export const TOURNEES_ROULETTE = [100, 120, 140, 160];

export const FITNESS_ROULETTE = [
  { cle: 'inverse', nom: 'f = 1000 / L', calculer: (longueur) => 1000 / longueur },
  { cle: 'carre', nom: 'f = 10⁴ / L²', calculer: (longueur) => 1e4 / longueur ** 2 },
];

export function probabilitesRoulette(fitness) {
  const total = fitness.reduce((somme, valeur) => somme + valeur, 0);
  return fitness.map((valeur) => valeur / total);
}

export function indiceRoulette(probabilites, tirage) {
  let cumul = 0;
  for (let i = 0; i < probabilites.length; i += 1) {
    cumul += probabilites[i];
    if (tirage < cumul) return i;
  }
  return probabilites.length - 1;
}

export function angleArret(rotation, angleCible, tours = 4) {
  const reste = (((-angleCible - rotation) % 360) + 360) % 360;
  return rotation + tours * 360 + reste;
}

const COULEURS_INDIVIDUS = ['var(--ansi-bleu)', 'var(--ansi-vert)', 'var(--ansi-jaune)', 'var(--ansi-magenta)', 'var(--ansi-cyan)', 'var(--ansi-rouge)'];

function pointSurCercle(cx, cy, rayon, degres) {
  const radians = (degres * Math.PI) / 180;
  return [cx + rayon * Math.sin(radians), cy - rayon * Math.cos(radians)];
}

function creerRoulette(zone, options) {
  const largeur = 640;
  const hauteur = 290;
  const [cx, cy, rayon] = [150, 150, 120];
  const hasard = aleatoire(options.graine ?? 7);
  const longueurs = TOURNEES_ROULETTE;
  let fitnessChoisie = FITNESS_ROULETTE.find(({ cle }) => cle === options.fitness) ?? FITNESS_ROULETTE[0];
  let fitness = [];
  let probabilites = [];
  let tirages = [];
  let rotation = 0;
  let enRotation = false;
  let secteurs = [];

  const ligne = commandes(zone);
  const boutonTourner = bouton(ligne, 'Tourner la roue', tourner, { principal: true });
  const boutonCent = bouton(ligne, '100 tirages d’un coup', centTirages);
  bouton(ligne, 'Remise à zéro', () => { if (!enRotation) preparer(); });
  choix(ligne, {
    options: FITNESS_ROULETTE.map(({ cle, nom }) => ({ valeur: cle, texte: nom })),
    valeur: fitnessChoisie.cle,
    auChangement: (cle) => {
      if (enRotation) return;
      fitnessChoisie = FITNESS_ROULETTE.find((fonction) => fonction.cle === cle);
      preparer();
    },
  });

  const dessin = creerSvg(zone, largeur, hauteur, 'combi-roulette');
  const roue = svg('g', {}, dessin);
  svg('circle', { cx, cy, r: 16, classe: 'combi-moyeu' }, dessin);
  svg('path', { d: `M${cx - 13},${cy - rayon - 18} L${cx + 13},${cy - rayon - 18} L${cx},${cy - rayon + 8} Z`, classe: 'combi-pointeur' }, dessin);
  const barres = svg('g', {}, dessin);
  const message = info(zone);

  function preparer() {
    fitness = longueurs.map(fitnessChoisie.calculer);
    probabilites = probabilitesRoulette(fitness);
    tirages = longueurs.map(() => 0);
    roue.replaceChildren();
    let angle = 0;
    secteurs = probabilites.map((probabilite, i) => {
      const fin = angle + probabilite * 360;
      const [x1, y1] = pointSurCercle(cx, cy, rayon, angle);
      const [x2, y2] = pointSurCercle(cx, cy, rayon, fin);
      const secteur = svg('path', {
        d: `M${cx},${cy} L${x1},${y1} A${rayon},${rayon} 0 ${fin - angle > 180 ? 1 : 0} 1 ${x2},${y2} Z`,
        classe: 'combi-secteur',
        style: `fill: ${COULEURS_INDIVIDUS[i]}`,
      }, roue);
      const [tx, ty] = pointSurCercle(cx, cy, rayon * 0.64, (angle + fin) / 2);
      svg('text', { x: tx, y: ty - 3, 'text-anchor': 'middle', classe: 'combi-secteur-texte', texte: `Tournée ${i + 1}` }, roue);
      svg('text', { x: tx, y: ty + 13, 'text-anchor': 'middle', classe: 'combi-secteur-texte doux', texte: pourcentage(probabilite) }, roue);
      angle = fin;
      return secteur;
    });
    roue.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);
    const total = fitness.reduce((somme, valeur) => somme + valeur, 0);
    message.innerHTML = `Chaque tournée a une part de roue proportionnelle à sa fitness : P(i) = fᵢ / ∑ fⱼ, avec ∑ fⱼ = ${nombre(total, 2)}. La pire garde sa chance : la diversité est préservée.`;
    dessinerBarres();
  }

  function dessinerBarres(gagnant = null) {
    barres.replaceChildren();
    const total = tirages.reduce((somme, valeur) => somme + valeur, 0);
    const versLargeur = echelle([0, 0.5], [0, 280]);
    svg('text', { x: 320, y: 26, classe: 'combi-barre-titre', texte: `${fitnessChoisie.nom} · ${total} tirage${total > 1 ? 's' : ''}` }, barres);
    longueurs.forEach((longueur, i) => {
      const y = 50 + i * 58;
      const observee = total ? tirages[i] / total : 0;
      svg('text', { x: 320, y, classe: `combi-barre-nom${gagnant === i ? ' gagnant' : ''}`, texte: `Tournée ${i + 1} · L = ${longueur} · f = ${deuxDecimales(fitness[i])}` }, barres);
      svg('rect', { x: 320, y: y + 8, width: versLargeur(observee), height: 16, rx: 4, classe: 'combi-barre-observee', style: `fill: ${COULEURS_INDIVIDUS[i]}` }, barres);
      svg('rect', { x: 320, y: y + 6, width: versLargeur(probabilites[i]), height: 20, rx: 4, classe: 'combi-barre-theorie' }, barres);
      svg('text', { x: 610, y: y + 21, 'text-anchor': 'end', classe: 'anim-graduation', texte: `${pourcentage(probabilites[i])} · observé ${total ? pourcentage(observee) : '—'}` }, barres);
    });
  }

  function surligner(gagnant) {
    secteurs.forEach((secteur, i) => secteur.classList.toggle('gagnant', i === gagnant));
    const total = fitness.reduce((somme, valeur) => somme + valeur, 0);
    message.innerHTML = `La flèche désigne la <strong>tournée ${gagnant + 1}</strong> (L = ${longueurs[gagnant]}) : P = ${deuxDecimales(fitness[gagnant])} / ${deuxDecimales(total)} = <strong>${pourcentage(probabilites[gagnant])}</strong>. Les barres pleines (tirages) se rapprochent des cadres pointillés (théorie) quand on tire beaucoup.`;
    dessinerBarres(gagnant);
  }

  function tourner() {
    if (enRotation) return;
    const tirage = hasard();
    const gagnant = indiceRoulette(probabilites, tirage);
    const depart = rotation;
    const arrivee = angleArret(rotation, tirage * 360, 4);
    let progression = 0;
    enRotation = true;
    boutonTourner.disabled = true;
    boutonCent.disabled = true;
    secteurs.forEach((secteur) => secteur.classList.remove('gagnant'));
    boucle(dessin, (ecart) => {
      progression = Math.min(1, progression + ecart / 2.6);
      rotation = depart + (arrivee - depart) * (1 - (1 - progression) ** 3);
      roue.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);
      if (progression < 1) return true;
      rotation %= 360;
      enRotation = false;
      boutonTourner.disabled = false;
      boutonCent.disabled = false;
      tirages[gagnant] += 1;
      surligner(gagnant);
      return false;
    }).demarrer();
  }

  function centTirages() {
    if (enRotation) return;
    let tirage = 0;
    let gagnant = 0;
    for (let i = 0; i < 100; i += 1) {
      tirage = hasard();
      gagnant = indiceRoulette(probabilites, tirage);
      tirages[gagnant] += 1;
    }
    rotation = angleArret(rotation, tirage * 360, 0) % 360;
    roue.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);
    surligner(gagnant);
  }

  preparer();
}

export const POPULATION_TOURNOI = [12, 45, 7, 30, 88, 21, 54, 3, 66, 39];

export function tournoi(fitness, k, hasard) {
  const tires = Array.from({ length: k }, () => Math.floor(hasard() * fitness.length));
  const gagnant = tires.reduce((meilleur, indice) => (fitness[indice] > fitness[meilleur] ? indice : meilleur));
  return { tires, gagnant };
}

export function probabiliteMeilleurGagne(taille, k) {
  return 1 - ((taille - 1) / taille) ** k;
}

function creerTournoi(zone, options) {
  const fitness = POPULATION_TOURNOI;
  const taille = fitness.length;
  const meilleur = fitness.indexOf(Math.max(...fitness));
  const hasard = aleatoire(options.graine ?? 11);
  const sequence = sequenceur(zone);
  let k = options.k ?? 2;
  let victoires = fitness.map(() => 0);

  const ligne = commandes(zone);
  curseur(ligne, { libelle: 'k =', min: 1, max: 8, valeur: k, auChangement: (valeur) => { k = valeur; remettreAZero(); } });
  bouton(ligne, 'Un tournoi', () => sequence.lancer(unTournoi), { principal: true });
  bouton(ligne, '1 000 tournois', () => { sequence.annuler(); milleTournois(); });
  bouton(ligne, 'Remise à zéro', remettreAZero);

  const population = html('div', { classe: 'combi-population' }, zone);
  const cartes = fitness.map((valeur, i) => {
    const carte = html('div', { classe: `anim-case combi-individu${i === meilleur ? ' meilleur' : ''}` }, population);
    html('span', { classe: 'combi-individu-nom', texte: `I${i + 1}${i === meilleur ? ' ★' : ''}` }, carte);
    html('span', { classe: 'combi-individu-fitness', texte: valeur }, carte);
    const jauge = html('span', { classe: 'combi-victoires', title: 'part des victoires' }, carte);
    const remplissage = html('span', {}, jauge);
    return { carte, remplissage };
  });
  const message = info(zone);
  const statistiques = info(zone);

  function effacerMarques() {
    for (const { carte } of cartes) {
      carte.classList.remove('surligne', 'bon');
      carte.removeAttribute('data-tirages');
    }
  }

  function afficherStatistiques() {
    const total = victoires.reduce((somme, valeur) => somme + valeur, 0);
    const plusGrand = Math.max(1, ...victoires);
    cartes.forEach(({ remplissage }, i) => { remplissage.style.width = `${(100 * victoires[i]) / plusGrand}%`; });
    const theorie = `1 − (${taille - 1}/${taille})${exposant(k)} = <strong>${pourcentage(probabiliteMeilleurGagne(taille, k))}</strong>`;
    statistiques.innerHTML = total
      ? `Le meilleur (I${meilleur + 1}, fitness ${fitness[meilleur]}) a gagné ${nombre(victoires[meilleur], 0)} tournois sur ${nombre(total, 0)} : <strong>${pourcentage(victoires[meilleur] / total)}</strong>. Théorie : ${theorie}.`
      : `Probabilité que le meilleur gagne avec k = ${k} : ${theorie}. ${k === 1 ? 'Aucune pression : tirage uniforme.' : k >= 6 ? 'Forte pression : le meilleur domine.' : 'Pression modérée : le compromis habituel est k = 2 ou 3.'}`;
  }

  function remettreAZero() {
    sequence.annuler();
    victoires = fitness.map(() => 0);
    effacerMarques();
    message.innerHTML = `On tire <strong>${k}</strong> individu${k > 1 ? 's' : ''} au hasard, avec remise, et le meilleur des ${k} gagne.`;
    afficherStatistiques();
  }

  async function unTournoi(pause) {
    effacerMarques();
    const { tires, gagnant } = tournoi(fitness, k, hasard);
    const comptes = new Map();
    const vus = [];
    for (const indice of tires) {
      comptes.set(indice, (comptes.get(indice) ?? 0) + 1);
      vus.push(`I${indice + 1}`);
      const { carte } = cartes[indice];
      carte.classList.add('surligne');
      carte.setAttribute('data-tirages', `×${comptes.get(indice)}`);
      message.innerHTML = `Tirés : ${vus.join(', ')}…`;
      await pause(Math.max(180, 1000 / k));
    }
    cartes[gagnant].carte.classList.add('bon');
    victoires[gagnant] += 1;
    message.innerHTML = `Tirés : ${tires.map((i) => `I${i + 1} (${fitness[i]})`).join(', ')} → gagnant <strong>I${gagnant + 1}</strong>, fitness ${fitness[gagnant]}.`;
    afficherStatistiques();
  }

  function milleTournois() {
    effacerMarques();
    for (let i = 0; i < 1000; i += 1) victoires[tournoi(fitness, k, hasard).gagnant] += 1;
    message.innerHTML = 'Les jauges montrent la part des victoires de chaque individu : avec k grand, elles se concentrent sur les meilleurs.';
    afficherStatistiques();
  }

  remettreAZero();
}

export function croisementUnPoint(parent1, parent2, coupe) {
  return [
    [...parent1.slice(0, coupe), ...parent2.slice(coupe)],
    [...parent2.slice(0, coupe), ...parent1.slice(coupe)],
  ];
}

export function croisementOX(parent1, parent2, debut, fin) {
  const n = parent1.length;
  const enfant = Array(n).fill(null);
  for (let i = debut; i <= fin; i += 1) enfant[i] = parent1[i];
  const segment = new Set(parent1.slice(debut, fin + 1));
  const manquants = parent2.filter((gene) => !segment.has(gene));
  const positions = Array.from({ length: n - (fin - debut + 1) }, (_, i) => (fin + 1 + i) % n);
  positions.forEach((position, i) => { enfant[position] = manquants[i]; });
  return { enfant, manquants, positions };
}

export function mutationBit(chromosome, position) {
  return chromosome.map((gene, i) => (i === position ? 1 - gene : gene));
}

export function mutationEchange(permutation, i, j) {
  const copie = [...permutation];
  [copie[i], copie[j]] = [copie[j], copie[i]];
  return copie;
}

export function estPermutation(liste) {
  const triee = [...liste].sort((a, b) => a - b);
  return triee.every((gene, i) => gene === i + 1);
}

const PARENTS_BINAIRES = [[1, 1, 0, 1, 0, 0, 1, 0], [0, 1, 1, 0, 1, 1, 0, 0]];
const PARENTS_PERMUTATIONS = [[4, 2, 6, 1, 5, 3, 8, 7], [1, 3, 5, 7, 2, 4, 6, 8]];

function rangeeGenes(parent, libelle, genes, classesGene = () => '') {
  const rangee = html('div', { classe: 'combi-rangee' }, parent);
  html('span', { classe: 'combi-rangee-nom', texte: libelle }, rangee);
  const conteneur = html('div', { classe: 'combi-genes' }, rangee);
  return genes.map((gene, i) => html('span', { classe: `anim-case combi-gene ${classesGene(i)}`.trim(), texte: gene ?? '·' }, conteneur));
}

function creerCroisement(zone, options) {
  const hasard = aleatoire(options.graine ?? 5);
  const sequence = sequenceur(zone);
  let mode = options.mode === 'ox' ? 'ox' : 'bits';

  choix(commandes(zone), {
    options: [{ valeur: 'bits', texte: 'Un point (binaire)' }, { valeur: 'ox', texte: 'OX (permutations)' }],
    valeur: mode,
    auChangement: (valeur) => { mode = valeur; montrer(); },
  });
  const panneauBits = html('div', { classe: 'combi-croisement' }, zone);
  const panneauOx = html('div', { classe: 'combi-croisement' }, zone);
  const message = info(zone);

  let [bits1, bits2] = PARENTS_BINAIRES;
  let coupe = options.coupe ?? 4;
  let enfantsBits = [];
  const reglagesBits = commandes(panneauBits);
  curseur(reglagesBits, { libelle: 'Coupe après le gène', min: 1, max: 7, valeur: coupe, auChangement: (valeur) => { coupe = valeur; croiserBits(); } });
  bouton(reglagesBits, 'Mutation', muterBits, { principal: true });
  bouton(reglagesBits, 'Parents au hasard', () => {
    bits1 = bits1.map(() => (hasard() < 0.5 ? 0 : 1));
    bits2 = bits2.map(() => (hasard() < 0.5 ? 0 : 1));
    croiserBits();
  });
  const rangeesBits = html('div', { classe: 'combi-croisement' }, panneauBits);
  let cellulesEnfants = [];

  const texteBits = (genes) => `${genes.slice(0, coupe).join('')}|${genes.slice(coupe).join('')}`;

  function croiserBits() {
    enfantsBits = croisementUnPoint(bits1, bits2, coupe);
    rangeesBits.replaceChildren();
    const coupure = (i) => (i === coupe ? ' combi-coupe' : '');
    rangeeGenes(rangeesBits, 'Parent 1', bits1, (i) => `combi-origine-1${coupure(i)}`);
    rangeeGenes(rangeesBits, 'Parent 2', bits2, (i) => `combi-origine-2${coupure(i)}`);
    cellulesEnfants = [
      rangeeGenes(rangeesBits, 'Enfant 1', enfantsBits[0], (i) => `${i < coupe ? 'combi-origine-1' : 'combi-origine-2'}${coupure(i)}`),
      rangeeGenes(rangeesBits, 'Enfant 2', enfantsBits[1], (i) => `${i < coupe ? 'combi-origine-2' : 'combi-origine-1'}${coupure(i)}`),
    ];
    message.innerHTML = `On coupe les deux parents après le gène ${coupe} et on échange les fins : ${texteBits(bits1)} et ${texteBits(bits2)} donnent <strong>${enfantsBits[0].join('')}</strong> et <strong>${enfantsBits[1].join('')}</strong>.`;
  }

  function muterBits() {
    const enfant = hasard() < 0.5 ? 0 : 1;
    const position = Math.floor(hasard() * bits1.length);
    const avant = enfantsBits[enfant][position];
    enfantsBits[enfant] = mutationBit(enfantsBits[enfant], position);
    const cellule = cellulesEnfants[enfant][position];
    cellule.textContent = enfantsBits[enfant][position];
    cellule.classList.remove('combi-mute');
    void cellule.getBoundingClientRect();
    cellule.classList.add('combi-mute');
    message.innerHTML = `Mutation : le gène ${position + 1} de l’enfant ${enfant + 1} passe de ${avant} à ${1 - avant}. Elle est rare (p<sub>m</sub> ≈ 0,01) et réinjecte de la diversité.`;
  }

  let [perm1, perm2] = PARENTS_PERMUTATIONS;
  let debut = (options.debut ?? 3) - 1;
  let fin = (options.fin ?? 5) - 1;
  let enfantOx = [];
  const reglagesOx = commandes(panneauOx);
  const reglageDebut = curseur(reglagesOx, { libelle: 'Segment : de', min: 1, max: 8, valeur: debut + 1, auChangement: (valeur) => { debut = valeur - 1; if (fin < debut) { fin = debut; reglageFin.fixer(fin + 1); } preparerOx(); } });
  const reglageFin = curseur(reglagesOx, { libelle: 'à', min: 1, max: 8, valeur: fin + 1, auChangement: (valeur) => { fin = valeur - 1; if (debut > fin) { debut = fin; reglageDebut.fixer(debut + 1); } preparerOx(); } });
  bouton(reglagesOx, 'Croiser pas à pas', () => sequence.lancer(croiserOx), { principal: true });
  bouton(reglagesOx, 'Mutation (échange)', muterOx);
  bouton(reglagesOx, 'Parents au hasard', () => {
    perm1 = melanger(perm1, hasard);
    perm2 = melanger(perm2, hasard);
    preparerOx();
  });
  const rangeesOx = html('div', { classe: 'combi-croisement' }, panneauOx);
  const ligneManquants = html('p', { classe: 'anim-info combi-manquants' }, panneauOx);
  let cellulesP1 = [];
  let cellulesP2 = [];
  let cellulesEnfant = [];

  function preparerOx() {
    sequence.annuler();
    enfantOx = Array(perm1.length).fill(null);
    rangeesOx.replaceChildren();
    const dansSegment = (i) => i >= debut && i <= fin;
    cellulesP1 = rangeeGenes(rangeesOx, 'Parent 1', perm1, (i) => `combi-origine-1${dansSegment(i) ? ' surligne' : ''}`);
    cellulesP2 = rangeeGenes(rangeesOx, 'Parent 2', perm2, () => 'combi-origine-2');
    cellulesEnfant = rangeeGenes(rangeesOx, 'Enfant', enfantOx, () => 'combi-vide');
    ligneManquants.textContent = '';
    message.innerHTML = `Segment du parent 1 : positions ${debut + 1} à ${fin + 1} (${perm1.slice(debut, fin + 1).join(' ')}). Clique sur « Croiser pas à pas ».`;
  }

  function remplir(position, gene, origine) {
    const cellule = cellulesEnfant[position];
    cellule.textContent = gene;
    cellule.className = `anim-case combi-gene ${origine} anim-apparait`;
  }

  async function croiserOx(pause) {
    preparerOx();
    const resultat = croisementOX(perm1, perm2, debut, fin);
    const segment = perm1.slice(debut, fin + 1);
    for (let i = debut; i <= fin; i += 1) remplir(i, perm1[i], 'combi-origine-1');
    message.innerHTML = `1. On recopie le segment <strong>${segment.join(' ')}</strong> du parent 1, à la même place.`;
    await pause(1100);
    perm2.forEach((gene, i) => cellulesP2[i].classList.toggle('combi-saute', segment.includes(gene)));
    ligneManquants.innerHTML = `Villes manquantes, dans l’ordre du parent 2 : <strong>${resultat.manquants.join(' ')}</strong>`;
    message.innerHTML = `2. On lit le parent 2 depuis le début en sautant ${segment.join(', ')} (déjà placés).`;
    await pause(1300);
    for (let i = 0; i < resultat.positions.length; i += 1) {
      const position = resultat.positions[i];
      const gene = resultat.manquants[i];
      cellulesP2.forEach((cellule, j) => cellule.classList.toggle('surligne', perm2[j] === gene));
      remplir(position, gene, 'combi-origine-2');
      message.innerHTML = `3. On remplit à partir de la fin du segment, puis on revient au début : position ${position + 1} ← <strong>${gene}</strong>.`;
      await pause(650);
    }
    cellulesP2.forEach((cellule) => cellule.classList.remove('surligne'));
    enfantOx = resultat.enfant;
    message.innerHTML = `Enfant : <strong>${enfantOx.join(' ')}</strong>. ${estPermutation(enfantOx) ? '<span class="combi-ok">Chaque ville apparaît une seule fois</span> : un croisement un point aurait créé des doublons.' : ''}`;
  }

  function muterOx() {
    if (enfantOx.includes(null)) {
      message.innerHTML = 'Fabrique d’abord l’enfant avec « Croiser pas à pas ».';
      return;
    }
    const i = Math.floor(hasard() * enfantOx.length);
    const j = (i + 1 + Math.floor(hasard() * (enfantOx.length - 1))) % enfantOx.length;
    const avant = enfantOx.join(' ');
    enfantOx = mutationEchange(enfantOx, i, j);
    for (const position of [i, j]) {
      const cellule = cellulesEnfant[position];
      cellule.textContent = enfantOx[position];
      cellule.classList.remove('combi-mute', 'anim-apparait');
      void cellule.getBoundingClientRect();
      cellule.classList.add('combi-mute');
    }
    const [premiere, seconde] = [Math.min(i, j), Math.max(i, j)];
    message.innerHTML = `Mutation par échange des positions ${premiere + 1} et ${seconde + 1} : ${avant} devient <strong>${enfantOx.join(' ')}</strong>. Toujours une permutation valide.`;
  }

  function montrer() {
    sequence.annuler();
    panneauBits.style.display = mode === 'bits' ? '' : 'none';
    panneauOx.style.display = mode === 'ox' ? '' : 'none';
    if (mode === 'bits') croiserBits();
    else preparerOx();
  }

  montrer();
}

export const ATELIER = {
  objectif: [6, 9],
  contraintes: [
    { coefficients: [2, 5], borne: 22, nom: 'matière' },
    { coefficients: [1, 1], borne: 6, nom: 'heures' },
  ],
};

export function profitPlne(probleme, [x, y]) {
  return probleme.objectif[0] * x + probleme.objectif[1] * y;
}

export function realisablePlne(probleme, [x, y], tolerance = 1e-9) {
  return x >= -tolerance && y >= -tolerance
    && probleme.contraintes.every(({ coefficients: [a, b], borne }) => a * x + b * y <= borne + tolerance);
}

export function voisinsPlne([x, y]) {
  return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
}

export function descentePlne(probleme, depart = [0, 0]) {
  const chemin = [depart];
  for (;;) {
    const courant = chemin.at(-1);
    const meilleur = voisinsPlne(courant)
      .filter((point) => realisablePlne(probleme, point))
      .reduce((retenu, point) => (retenu === null || profitPlne(probleme, point) > profitPlne(probleme, retenu) ? point : retenu), null);
    if (!meilleur || profitPlne(probleme, meilleur) <= profitPlne(probleme, courant)) return chemin;
    chemin.push(meilleur);
  }
}

function droitesPlne(probleme) {
  return [...probleme.contraintes.map(({ coefficients: [a, b], borne }) => [a, b, borne]), [1, 0, 0], [0, 1, 0]];
}

export function sommetsPlne(probleme) {
  const droites = droitesPlne(probleme);
  const sommets = [];
  for (let i = 0; i < droites.length; i += 1) {
    for (let j = i + 1; j < droites.length; j += 1) {
      const [a1, b1, c1] = droites[i];
      const [a2, b2, c2] = droites[j];
      const determinant = a1 * b2 - a2 * b1;
      if (Math.abs(determinant) < 1e-12) continue;
      const point = [(c1 * b2 - c2 * b1) / determinant, (a1 * c2 - a2 * c1) / determinant];
      if (!realisablePlne(probleme, point, 1e-7)) continue;
      if (sommets.some(([x, y]) => Math.hypot(x - point[0], y - point[1]) < 1e-7)) continue;
      sommets.push(point);
    }
  }
  const [cx, cy] = sommets.reduce(([sx, sy], [x, y]) => [sx + x / sommets.length, sy + y / sommets.length], [0, 0]);
  return sommets.sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx));
}

export function relaxationContinue(probleme) {
  return sommetsPlne(probleme)
    .map(([x, y]) => ({ x, y, z: profitPlne(probleme, [x, y]) }))
    .reduce((meilleur, sommet) => (meilleur === null || sommet.z > meilleur.z ? sommet : meilleur), null);
}

export function optimumEntier(probleme) {
  const limite = (indice) => Math.floor(Math.min(...probleme.contraintes
    .filter(({ coefficients }) => coefficients[indice] > 0)
    .map(({ coefficients, borne }) => borne / coefficients[indice])));
  let meilleur = null;
  for (let x = 0; x <= limite(0); x += 1) {
    for (let y = 0; y <= limite(1); y += 1) {
      if (!realisablePlne(probleme, [x, y])) continue;
      const z = profitPlne(probleme, [x, y]);
      if (meilleur === null || z > meilleur.z) meilleur = { x, y, z };
    }
  }
  return meilleur;
}

export function couperPolygone(sommets, [a, b], seuil) {
  const garde = ([x, y]) => a * x + b * y >= seuil - 1e-9;
  const resultat = [];
  sommets.forEach((point, i) => {
    const suivant = sommets[(i + 1) % sommets.length];
    if (garde(point)) resultat.push(point);
    if (garde(point) !== garde(suivant)) {
      const valeurPoint = a * point[0] + b * point[1] - seuil;
      const valeurSuivant = a * suivant[0] + b * suivant[1] - seuil;
      const t = valeurPoint / (valeurPoint - valeurSuivant);
      resultat.push([point[0] + t * (suivant[0] - point[0]), point[1] + t * (suivant[1] - point[1])]);
    }
  });
  return resultat;
}

export function segmentDansBoite([a, b], seuil, [xMax, yMax]) {
  const candidats = [];
  if (b !== 0) {
    candidats.push([0, seuil / b], [xMax, (seuil - a * xMax) / b]);
  }
  if (a !== 0) {
    candidats.push([seuil / a, 0], [(seuil - b * yMax) / a, yMax]);
  }
  const dedans = candidats
    .filter(([x, y]) => x >= -1e-9 && x <= xMax + 1e-9 && y >= -1e-9 && y <= yMax + 1e-9)
    .sort((p, q) => p[0] - q[0] || q[1] - p[1]);
  if (!dedans.length) return null;
  return [dedans[0], dedans.at(-1)];
}

const ABSCISSES_ETIQUETTES = [5.3, 4.6];

function creerPlne(zone, options) {
  const largeur = 640;
  const hauteur = 420;
  const probleme = ATELIER;
  const boite = [7.5, 5.2];
  const [cx, cy] = probleme.objectif;
  const zMax = 60;
  const relaxation = relaxationContinue(probleme);
  const entier = optimumEntier(probleme);
  const sequence = sequenceur(zone);
  let z = options.z ?? 30;

  const ligneObjectif = commandes(zone);
  const reglageZ = curseur(ligneObjectif, { libelle: 'z = 6x + 9y =', min: 0, max: zMax, valeur: z, auChangement: (valeur) => fixerZ(valeur) });
  reglageZ.element.classList.add('anim-curseur-large');
  const ligneMethodes = commandes(zone);
  bouton(ligneMethodes, 'Descente depuis (0, 0)', () => sequence.lancer(descente), { principal: true });
  bouton(ligneMethodes, 'Recuit : accepter une dégradation', () => sequence.lancer(recuit));
  bouton(ligneMethodes, 'Croisement (AG)', () => sequence.lancer(croisement));
  bouton(ligneMethodes, 'Effacer', () => { sequence.annuler(); calqueChemin.replaceChildren(); fixerZ(z); });

  const dessin = creerSvg(zone, largeur, hauteur, 'combi-plne');
  const versX = echelle([0, boite[0]], [50, 620]);
  const versY = echelle([0, boite[1]], [hauteur - 36, 16]);
  const enPixels = ([x, y]) => `${versX(x)},${versY(y)}`;
  for (let x = 0; x <= 7; x += 1) {
    svg('line', { x1: versX(x), x2: versX(x), y1: versY(0), y2: versY(boite[1]), classe: 'anim-grille' }, dessin);
    svg('text', { x: versX(x), y: versY(0) + 18, 'text-anchor': 'middle', classe: 'anim-graduation', texte: x }, dessin);
  }
  for (let y = 0; y <= 5; y += 1) {
    svg('line', { x1: versX(0), x2: versX(boite[0]), y1: versY(y), y2: versY(y), classe: 'anim-grille' }, dessin);
    svg('text', { x: versX(0) - 10, y: versY(y) + 4, 'text-anchor': 'end', classe: 'anim-graduation', texte: y }, dessin);
  }
  svg('text', { x: versX(boite[0]), y: hauteur - 4, 'text-anchor': 'end', classe: 'anim-graduation', texte: 'x (produit 1)' }, dessin);
  svg('text', { x: versX(0) + 6, y: versY(boite[1]) + 4, classe: 'anim-graduation', texte: 'y (produit 2)' }, dessin);
  const sommets = sommetsPlne(probleme);
  svg('polygon', { points: sommets.map(enPixels).join(' '), classe: 'combi-polygone' }, dessin);
  const zoneAtteinte = svg('polygon', { classe: 'combi-zone-atteinte' }, dessin);
  probleme.contraintes.forEach(({ coefficients, borne, nom }, indice) => {
    const segment = segmentDansBoite(coefficients, borne, boite);
    if (!segment) return;
    const [p, q] = segment;
    svg('line', { x1: versX(p[0]), y1: versY(p[1]), x2: versX(q[0]), y2: versY(q[1]), classe: 'combi-contrainte' }, dessin);
    const [a, b] = coefficients;
    const xTexte = ABSCISSES_ETIQUETTES[indice] ?? (p[0] + q[0]) / 2;
    svg('text', { x: versX(xTexte) + 8, y: versY((borne - a * xTexte) / b) - 8, classe: 'combi-contrainte-texte', texte: `${a === 1 ? '' : a}x + ${b === 1 ? '' : b}y ≤ ${borne} (${nom})` }, dessin);
  });
  const direction = svg('line', { x1: versX(0), y1: versY(0), classe: 'anim-repere' }, dessin);
  const droiteObjectif = svg('line', { classe: 'combi-objectif' }, dessin);
  const texteObjectif = svg('text', { classe: 'combi-objectif-texte' }, dessin);
  const calqueChemin = svg('g', {}, dessin);
  const elementsPoints = [];
  for (let x = 0; x <= 7; x += 1) {
    for (let y = 0; y <= 5; y += 1) {
      const groupe = svg('g', { classe: 'combi-entier-groupe' }, dessin);
      svg('circle', { cx: versX(x), cy: versY(y), r: 14, classe: 'combi-entier-zone' }, groupe);
      const point = svg('circle', { cx: versX(x), cy: versY(y), r: 5.5, classe: 'combi-entier' }, groupe);
      groupe.addEventListener('click', () => decrirePoint([x, y]));
      elementsPoints.push({ coordonnees: [x, y], point });
    }
  }
  const [rx, ry] = [versX(relaxation.x), versY(relaxation.y)];
  svg('path', { d: `M${rx},${ry - 10} L${rx + 9},${ry} L${rx},${ry + 10} L${rx - 9},${ry} Z`, classe: 'combi-relaxation' }, dessin);
  svg('text', { x: rx + 12, y: ry - 10, classe: 'combi-relaxation-texte', texte: `relaxation (8/3, 10/3) : z = ${nombre(relaxation.z, 2)}` }, dessin);
  const poignee = svg('circle', { r: 10, classe: 'anim-poignee' }, dessin);
  glisser(dessin, poignee, (position) => {
    const valeur = cx * versX.inverse(position.x) + cy * versY.inverse(position.y);
    fixerZ(Math.round(bornes(valeur, 0, zMax)));
  });
  const message = info(zone);
  const detail = info(zone);

  const nomPoint = ([x, y]) => `(${x}, ${y})`;

  function fixerZ(valeur) {
    z = valeur;
    reglageZ.fixer(z);
    const normeCarree = cx * cx + cy * cy;
    const pied = [(cx * z) / normeCarree, (cy * z) / normeCarree];
    poignee.setAttribute('cx', versX(pied[0]));
    poignee.setAttribute('cy', versY(pied[1]));
    const fleche = (cx * zMax) / normeCarree;
    direction.setAttribute('x2', versX(fleche));
    direction.setAttribute('y2', versY((cy * zMax) / normeCarree));
    const segment = segmentDansBoite(probleme.objectif, z, boite);
    droiteObjectif.style.display = segment ? '' : 'none';
    texteObjectif.style.display = segment ? '' : 'none';
    if (segment) {
      const [p, q] = segment;
      droiteObjectif.setAttribute('x1', versX(p[0]));
      droiteObjectif.setAttribute('y1', versY(p[1]));
      droiteObjectif.setAttribute('x2', versX(q[0]));
      droiteObjectif.setAttribute('y2', versY(q[1]));
      texteObjectif.setAttribute('x', Math.min(versX(q[0]) + 6, largeur - 110));
      texteObjectif.setAttribute('y', versY(q[1]) - 6);
      texteObjectif.textContent = `6x + 9y = ${z}`;
    }
    const morceau = couperPolygone(sommets, probleme.objectif, z);
    zoneAtteinte.setAttribute('points', morceau.map(enPixels).join(' '));
    const atteints = [];
    for (const { coordonnees, point } of elementsPoints) {
      const realisable = realisablePlne(probleme, coordonnees);
      const atteint = realisable && profitPlne(probleme, coordonnees) >= z;
      if (atteint) atteints.push(coordonnees);
      point.setAttribute('class', `combi-entier ${realisable ? 'realisable' : 'interdit'}${atteint ? ' atteint' : ''}`);
    }
    if (z > relaxation.z) {
      message.innerHTML = `La droite z = ${z} ne touche plus le polygone : aucun point réalisable, même à virgule, ne rapporte autant. La borne est z = ${nombre(relaxation.z, 2)}.`;
    } else if (!atteints.length) {
      message.innerHTML = `Seuls des points à virgule (zone verte) atteignent z = ${z} : la relaxation continue monte jusqu’à ${nombre(relaxation.z, 2)}, mais <strong>aucun point entier</strong>.`;
    } else if (atteints.length === 1) {
      message.innerHTML = `Un seul point entier réalisable atteint z = ${z} : <strong>${nomPoint(atteints[0])}</strong>, profit ${profitPlne(probleme, atteints[0])}. C’est l’optimum entier, sous la borne ${nombre(relaxation.z, 2)} de la relaxation.`;
    } else {
      message.innerHTML = `${atteints.length} points entiers réalisables rapportent au moins z = ${z}. Monte z (ou fais glisser la poignée) pour chercher le dernier.`;
    }
  }

  function decrirePoint(coordonnees) {
    const morceaux = probleme.contraintes.map(({ coefficients: [a, b], borne, nom }) => {
      const valeur = a * coordonnees[0] + b * coordonnees[1];
      return `${nom} ${valeur} ${valeur <= borne ? `≤ ${borne} <span class="combi-ok">✓</span>` : `&gt; ${borne} <span class="combi-non">✗</span>`}`;
    });
    detail.innerHTML = `${nomPoint(coordonnees)} : profit <strong>${profitPlne(probleme, coordonnees)}</strong> · ${morceaux.join(' · ')}${coordonnees[0] === entier.x && coordonnees[1] === entier.y ? ' · <strong class="combi-ok">optimum entier</strong>' : ''}.`;
  }

  function etape(point, numero, classe = '') {
    svg('circle', { cx: versX(point[0]), cy: versY(point[1]), r: 9, classe: `combi-etape ${classe}`.trim() }, calqueChemin);
    if (numero !== null) svg('text', { x: versX(point[0]), y: versY(point[1]) + 4, 'text-anchor': 'middle', classe: 'combi-etape-texte', texte: numero }, calqueChemin);
  }

  function trait(de, vers, classe = '') {
    svg('line', { x1: versX(de[0]), y1: versY(de[1]), x2: versX(vers[0]), y2: versY(vers[1]), classe: `combi-chemin ${classe}`.trim() }, calqueChemin);
  }

  async function descente(pause) {
    calqueChemin.replaceChildren();
    const chemin = descentePlne(probleme, [0, 0]);
    etape(chemin[0], 0);
    detail.innerHTML = 'Voisinage : ±1 sur x ou sur y. On prend le meilleur voisin réalisable (meilleure amélioration).';
    for (let i = 1; i < chemin.length; i += 1) {
      await pause(700);
      const mouvement = chemin[i][0] > chemin[i - 1][0] ? '+x' : '+y';
      trait(chemin[i - 1], chemin[i]);
      etape(chemin[i], i);
      message.innerHTML = `Pas ${i} : ${mouvement} vers <strong>${nomPoint(chemin[i])}</strong>, profit ${profitPlne(probleme, chemin[i])}.`;
    }
    await pause(700);
    const fin = chemin.at(-1);
    const voisins = voisinsPlne(fin).map((point) => (realisablePlne(probleme, point) ? `${nomPoint(point)} = ${profitPlne(probleme, point)}` : `${nomPoint(point)} irréalisable`));
    message.innerHTML = `<strong class="combi-non">Bloquée en ${nomPoint(fin)}</strong>, profit ${profitPlne(probleme, fin)} : optimum local. Voisins : ${voisins.join(', ')}. L’optimum entier vaut ${entier.z}.`;
  }

  async function recuit(pause) {
    calqueChemin.replaceChildren();
    const chemin = [[1, 4], [1, 3], [2, 3], [3, 3]];
    etape(chemin[0], null);
    const baisse = profitPlne(probleme, chemin[0]) - profitPlne(probleme, chemin[1]);
    await pause(500);
    trait(chemin[0], chemin[1], 'degradation');
    etape(chemin[1], null, 'degradation');
    message.innerHTML = `(1, 4) → (1, 3) : le profit baisse de 42 à 33. On maximise, donc la dégradation vaut ${baisse} : acceptée avec P = e^(−${baisse}/T), soit ${pourcentage(probabiliteAcceptation(baisse, 10))} à T = 10 et ${pourcentage(probabiliteAcceptation(baisse, 2))} à T = 2.`;
    await pause(2200);
    trait(chemin[1], chemin[2]);
    etape(chemin[2], null);
    message.innerHTML = '(1, 3) → (2, 3) : profit 39, amélioration, toujours acceptée.';
    await pause(1200);
    trait(chemin[2], chemin[3]);
    etape(chemin[3], null, 'enfant');
    message.innerHTML = `(2, 3) → (3, 3) : profit <strong>${entier.z}</strong>, l’optimum entier. Il fallait accepter de redescendre pour le trouver.`;
  }

  async function croisement(pause) {
    calqueChemin.replaceChildren();
    const [parent1, parent2] = [[2, 3], [3, 2]];
    etape(parent1, 'P1', 'parent');
    etape(parent2, 'P2', 'parent');
    message.innerHTML = `Deux parents : P1 = (2, 3), profit ${profitPlne(probleme, parent1)} ; P2 = (3, 2), profit ${profitPlne(probleme, parent2)}.`;
    await pause(1400);
    const enfant = [parent2[0], parent1[1]];
    trait(parent1, enfant, 'croisement');
    trait(parent2, enfant, 'croisement');
    etape(enfant, null, 'enfant');
    message.innerHTML = `Enfant = x de P2 et y de P1 = <strong>(3, 3)</strong>, profit <strong>${profitPlne(probleme, enfant)}</strong> : l’optimum, qu’aucun parent n’atteignait.`;
  }

  fixerZ(z);
  detail.innerHTML = 'Clique sur un point entier pour voir son profit et ses contraintes.';
}

export const PROBLEMES_CLASSES = [
  { numero: 1, nom: 'Chemin eulérien', zones: { different: 'p', egal: 'npc' } },
  { numero: 2, nom: 'Plus court chemin (décision)', zones: { different: 'p', egal: 'npc' } },
  { numero: 3, nom: 'Programmation linéaire continue (décision)', zones: { different: 'p', egal: 'npc' } },
  { numero: 4, nom: 'Répondre toujours oui', zones: { different: 'p', egal: 'triviaux' } },
  { numero: 5, nom: 'Factorisation (décision)', zones: { different: 'intermediaire', egal: 'npc' } },
  { numero: 6, nom: 'Isomorphisme de graphes', zones: { different: 'intermediaire', egal: 'npc' } },
  { numero: 7, nom: 'SAT', zones: { different: 'npc', egal: 'npc' } },
  { numero: 8, nom: 'Voyageur de commerce (décision)', zones: { different: 'npc', egal: 'npc' } },
  { numero: 9, nom: 'Sac à dos (décision)', zones: { different: 'npc', egal: 'npc' } },
  { numero: 10, nom: 'k-coloration, k ≥ 3', zones: { different: 'npc', egal: 'npc' } },
  { numero: 11, nom: 'Circuit hamiltonien', zones: { different: 'npc', egal: 'npc' } },
  { numero: 12, nom: 'Voyageur de commerce (optimisation)', zones: { different: 'npd', egal: 'npd' } },
  { numero: 13, nom: 'Problème de l’arrêt', zones: { different: 'npd', egal: 'npd' } },
];

export const ZONES_CLASSES = {
  different: { p: 'P', intermediaire: 'NP-intermédiaire (ni P ni NP-complet)', npc: 'NP-complet', npd: 'NP-difficile hors de NP' },
  egal: { triviaux: 'P = NP mais pas NP-complet', npc: 'NP-complet (= P = NP)', npd: 'NP-difficile hors de NP' },
};

const RAISONS_CLASSES = {
  p: 'un algorithme polynomial le résout',
  intermediaire: 'dans NP, mais ni dans P ni NP-complet connus (candidat NP-intermédiaire, Ladner)',
  npc: 'dans NP et tout NP s’y réduit',
  triviaux: 'on ne peut pas y réduire SAT : il n’y a aucune instance « non »',
  npd: 'NP-difficile mais pas un problème de décision de NP (optimisation, ou indécidable)',
};

export const FIGURES_CLASSES = {
  different: {
    np: { cx: 235, cy: 200, rx: 220, ry: 150 },
    p: { cx: 135, cy: 210, rx: 80, ry: 78 },
    npd: { cx: 505, cy: 195, rx: 145, ry: 170 },
  },
  egal: {
    np: { cx: 285, cy: 205, rx: 235, ry: 140 },
    triviaux: { cx: 115, cy: 205, rx: 58, ry: 58 },
    npd: { x: 20, y: 28, largeur: 625, hauteur: 340 },
  },
};

const ANCRES_CLASSES = {
  different: { p: [135, 215], intermediaire: [290, 215], npc: [405, 205], npd: [575, 205] },
  egal: { triviaux: [115, 210], npc: [330, 215], npd: [585, 200] },
};

const dansEllipse = ({ cx, cy, rx, ry }, x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const dansRectangle = ({ x: gauche, y: haut, largeur, hauteur }, x, y) => x >= gauche && x <= gauche + largeur && y >= haut && y <= haut + hauteur;

export function zoneDuPoint(hypothese, x, y) {
  const figure = FIGURES_CLASSES[hypothese];
  if (hypothese === 'different') {
    if (dansEllipse(figure.p, x, y)) return 'p';
    const np = dansEllipse(figure.np, x, y);
    const npd = dansEllipse(figure.npd, x, y);
    if (np && npd) return 'npc';
    if (np) return 'intermediaire';
    return npd ? 'npd' : null;
  }
  if (dansEllipse(figure.triviaux, x, y)) return 'triviaux';
  if (dansEllipse(figure.np, x, y)) return 'npc';
  return dansRectangle(figure.npd, x, y) ? 'npd' : null;
}

export function emplacementsZone(hypothese, zone, { pas = 22, marge = 10 } = {}) {
  const [ax, ay] = ANCRES_CLASSES[hypothese][zone];
  const emplacements = [];
  for (let x = 14; x <= 650; x += pas) {
    for (let y = 18; y <= 372; y += pas) {
      const autour = [[x, y], [x - marge, y], [x + marge, y], [x, y - marge], [x, y + marge]];
      if (autour.every(([px, py]) => zoneDuPoint(hypothese, px, py) === zone)) emplacements.push([x, y]);
    }
  }
  return emplacements.sort((p, q) => Math.hypot(p[0] - ax, p[1] - ay) - Math.hypot(q[0] - ax, q[1] - ay));
}

export function corrigerClassement(hypothese, placements) {
  const erreurs = PROBLEMES_CLASSES
    .filter(({ numero, zones }) => placements.get(numero) !== zones[hypothese])
    .map(({ numero, zones }) => ({ numero, attendu: zones[hypothese], donne: placements.get(numero) ?? null }));
  return { bons: PROBLEMES_CLASSES.length - erreurs.length, total: PROBLEMES_CLASSES.length, erreurs };
}

function creerClasses(zone, options) {
  const largeur = 660;
  const hauteur = 380;
  let hypothese = options.hypothese === 'egal' ? 'egal' : 'different';
  let placements = new Map();
  let selection = 1;
  let corrige = false;
  let emplacements = {};

  const ligne = commandes(zone);
  choix(ligne, {
    options: [{ valeur: 'different', texte: 'Si P ≠ NP' }, { valeur: 'egal', texte: 'Si P = NP' }],
    valeur: hypothese,
    auChangement: (valeur) => { hypothese = valeur; recommencer(); },
  });
  bouton(ligne, 'Corriger', () => { corrige = true; afficher(); }, { principal: true });
  bouton(ligne, 'Voir la solution', () => {
    placements = new Map(PROBLEMES_CLASSES.map(({ numero, zones }) => [numero, zones[hypothese]]));
    corrige = true;
    afficher();
  });
  bouton(ligne, 'Recommencer', recommencer);

  const dessin = creerSvg(zone, largeur, hauteur, 'combi-classes');
  const calqueFigure = svg('g', {}, dessin);
  const calqueJetons = svg('g', {}, dessin);
  const liste = html('div', { classe: 'combi-problemes' }, zone);
  const message = info(zone);
  const boutonsProblemes = new Map(PROBLEMES_CLASSES.map(({ numero, nom }) => {
    const element = html('button', { type: 'button', classe: 'combi-probleme', html: `<span class="combi-numero">${numero}</span>${nom}` }, liste);
    element.addEventListener('click', () => { selection = numero; afficher(); });
    return [numero, element];
  }));

  dessin.addEventListener('click', (evenement) => {
    if (selection === null) return;
    const { x, y } = pointeurSvg(dessin, evenement);
    const choisie = zoneDuPoint(hypothese, x, y);
    if (!choisie) return;
    placements.delete(selection);
    placements.set(selection, choisie);
    corrige = false;
    selection = PROBLEMES_CLASSES.find(({ numero }) => !placements.has(numero))?.numero ?? null;
    afficher();
  });

  function ensemble(forme, couleur, classe = '') {
    const attributs = forme.rx !== undefined
      ? ['ellipse', { cx: forme.cx, cy: forme.cy, rx: forme.rx, ry: forme.ry }]
      : ['rect', { x: forme.x, y: forme.y, width: forme.largeur, height: forme.hauteur, rx: 36 }];
    svg(attributs[0], { ...attributs[1], classe: `combi-ensemble ${classe}`.trim(), style: `fill: ${couleur}; stroke: ${couleur}` }, calqueFigure);
  }

  function etiquette(x, y, texte, classe = 'combi-ensemble-nom') {
    svg('text', { x, y, 'text-anchor': 'middle', classe, texte }, calqueFigure);
  }

  function dessinerFigure() {
    calqueFigure.replaceChildren();
    const figure = FIGURES_CLASSES[hypothese];
    if (hypothese === 'different') {
      ensemble(figure.npd, 'var(--ansi-rouge)');
      ensemble(figure.np, 'var(--ansi-bleu)');
      ensemble(figure.p, 'var(--ansi-vert)');
      etiquette(235, 70, 'NP');
      etiquette(135, 150, 'P');
      etiquette(292, 118, 'NP-intermédiaire ?', 'combi-ensemble-nom petit');
      etiquette(407, 122, 'NP-complet');
      etiquette(560, 62, 'NP-difficile');
    } else {
      ensemble(figure.npd, 'var(--ansi-rouge)');
      ensemble(figure.np, 'var(--ansi-magenta)');
      ensemble(figure.triviaux, 'var(--ansi-vert)', 'opaque');
      etiquette(300, 88, 'P = NP');
      etiquette(330, 112, 'tout y est NP-complet…', 'combi-ensemble-nom petit');
      etiquette(115, 168, '…sauf', 'combi-ensemble-nom petit');
      etiquette(115, 250, 'triviaux', 'combi-ensemble-nom petit');
      etiquette(585, 58, 'NP-difficile');
    }
    emplacements = Object.fromEntries(Object.keys(ZONES_CLASSES[hypothese]).map((cle) => [cle, emplacementsZone(hypothese, cle)]));
  }

  function afficher() {
    const correction = corrigerClassement(hypothese, placements);
    const fautifs = new Set(correction.erreurs.map(({ numero }) => numero));
    calqueJetons.replaceChildren();
    const occupes = {};
    for (const [numero, zonePlacee] of placements) {
      const rang = occupes[zonePlacee] ?? 0;
      occupes[zonePlacee] = rang + 1;
      const [x, y] = emplacements[zonePlacee][rang % emplacements[zonePlacee].length];
      const etat = corrige ? (fautifs.has(numero) ? ' mauvais' : ' bon') : '';
      const groupe = svg('g', { classe: `combi-jeton${etat}${numero === selection ? ' actif' : ''}` }, calqueJetons);
      svg('circle', { cx: x, cy: y, r: 10 }, groupe);
      svg('text', { x, y: y + 4, 'text-anchor': 'middle', classe: 'combi-jeton-texte', texte: numero }, groupe);
      groupe.addEventListener('click', (evenement) => {
        evenement.stopPropagation();
        selection = numero;
        afficher();
      });
    }
    for (const [numero, element] of boutonsProblemes) {
      element.classList.toggle('actif', numero === selection);
      element.classList.toggle('place', placements.has(numero));
      element.classList.toggle('bon', corrige && placements.has(numero) && !fautifs.has(numero));
      element.classList.toggle('mauvais', corrige && fautifs.has(numero));
    }
    if (corrige) {
      const details = correction.erreurs.map(({ numero, attendu }) => {
        const probleme = PROBLEMES_CLASSES[numero - 1];
        return `<br>${numero}. ${probleme.nom} → <strong>${ZONES_CLASSES[hypothese][attendu]}</strong> : ${RAISONS_CLASSES[attendu]}.`;
      });
      const rappel = hypothese === 'egal' ? ' Si P = NP, tout problème non trivial de P devient NP-complet.' : '';
      message.innerHTML = correction.erreurs.length
        ? `<strong>${correction.bons} / ${correction.total}</strong> bien placés.${rappel}${details.join('')}`
        : `<strong class="combi-ok">Parfait : ${correction.total} / ${correction.total}.</strong>${rappel}`;
    } else if (selection !== null) {
      message.innerHTML = `Où tombe <strong>${PROBLEMES_CLASSES[selection - 1].nom}</strong> ${hypothese === 'egal' ? 'si P = NP' : 'si P ≠ NP'} ? Clique dans la bonne zone.`;
    } else {
      message.innerHTML = 'Tous les problèmes sont placés : clique sur « Corriger ». Clique sur un jeton pour le déplacer.';
    }
  }

  function recommencer() {
    placements = new Map();
    selection = 1;
    corrige = false;
    dessinerFigure();
    afficher();
  }

  recommencer();
}

export const animationsCombinatoire = {
  croissance: {
    titre: 'La course des complexités',
    consigne: 'Fais glisser n et regarde qui explose. Clique sur une courbe dans la légende pour la cacher.',
    creer: creerCroissance,
  },
  voyageur: {
    titre: 'Le voyageur de commerce : glouton puis 2-opt',
    badge: 'Recherche locale',
    consigne: 'Chaque pas retire deux arêtes (rouge) et reconnecte dans l’autre sens (vert). Déplace les villes avec le doigt ou la souris.',
    creer: creerVoyageur,
  },
  recuit: {
    titre: 'La bille et le recuit simulé',
    badge: 'Métaheuristique',
    consigne: 'Compare la descente (bloquée au premier creux) et le recuit. Joue sur α : trop petit, c’est la trempe.',
    creer: creerRecuit,
  },
  roulette: {
    titre: 'La sélection par roulette',
    badge: 'Sélection',
    consigne: 'Fais tourner la roue, puis tire 100 fois d’un coup. Change la fitness pour voir la pression de sélection monter.',
    creer: creerRoulette,
  },
  tournoi: {
    titre: 'La sélection par tournoi',
    badge: 'Sélection',
    consigne: 'Règle k, la taille du tournoi, puis lance 1 000 tournois : la pression de sélection grimpe avec k.',
    creer: creerTournoi,
  },
  croisement: {
    titre: 'Croisement et mutation',
    badge: 'Algorithme génétique',
    consigne: 'Couleur du trait sous chaque gène : bleu = parent 1, violet = parent 2.',
    creer: creerCroisement,
  },
  plne: {
    titre: 'Le PLNE de l’atelier',
    badge: 'PLNE',
    consigne: 'Fais glisser la poignée (ou le curseur) pour pousser la droite de l’objectif, puis compare les trois méthodes.',
    creer: creerPlne,
  },
  classes: {
    titre: 'Range les problèmes dans les classes',
    badge: 'Jeu',
    consigne: 'Choisis un problème, clique dans sa zone, puis corrige. Bascule ensuite sur l’hypothèse P = NP.',
    creer: creerClasses,
  },
};
