const ESPACE_SVG = 'http://www.w3.org/2000/svg';

function appliquer(element, attributs) {
  for (const [cle, valeur] of Object.entries(attributs)) {
    if (valeur === undefined || valeur === null || valeur === false) continue;
    if (cle === 'texte') element.textContent = valeur;
    else if (cle === 'html') element.innerHTML = valeur;
    else if (cle === 'classe') element.setAttribute('class', valeur);
    else element.setAttribute(cle, valeur);
  }
  return element;
}

export function svg(nom, attributs = {}, parent = null) {
  const element = appliquer(document.createElementNS(ESPACE_SVG, nom), attributs);
  parent?.appendChild(element);
  return element;
}

export function creerSvg(parent, largeur, hauteur, classe = '') {
  return svg('svg', { viewBox: `0 0 ${largeur} ${hauteur}`, classe: `anim-svg ${classe}`.trim(), role: 'img' }, parent);
}

export function html(nom, attributs = {}, parent = null) {
  const element = appliquer(document.createElement(nom), attributs);
  parent?.appendChild(element);
  return element;
}

export function vider(element) {
  while (element.firstChild) element.firstChild.remove();
  return element;
}

export function commandes(parent) {
  return html('div', { classe: 'anim-commandes' }, parent);
}

export function bouton(parent, texte, action, { principal = false, titre } = {}) {
  const element = html('button', { type: 'button', classe: principal ? 'bouton principal' : 'bouton', texte, title: titre }, parent);
  element.addEventListener('click', () => action(element));
  return element;
}

export function curseur(parent, { libelle, min, max, pas = 1, valeur, format = String, auChangement }) {
  const etiquette = html('label', { classe: 'anim-curseur' }, parent);
  html('span', { classe: 'anim-curseur-libelle', texte: libelle }, etiquette);
  const entree = html('input', { type: 'range', min, max, step: pas, value: valeur }, etiquette);
  const affichage = html('output', { classe: 'anim-curseur-valeur', texte: format(Number(valeur)) }, etiquette);
  const lire = () => Number(entree.value);
  entree.addEventListener('input', () => {
    affichage.textContent = format(lire());
    auChangement?.(lire());
  });
  return {
    element: etiquette,
    lire,
    fixer(nouvelle) {
      entree.value = nouvelle;
      affichage.textContent = format(lire());
    },
  };
}

export function choix(parent, { options, valeur, auChangement }) {
  const groupe = html('div', { classe: 'anim-choix', role: 'group' }, parent);
  const boutons = options.map(({ valeur: cle, texte }) => {
    const element = html('button', { type: 'button', classe: 'anim-puce', texte, 'data-valeur': cle }, groupe);
    element.addEventListener('click', () => {
      selectionner(cle);
      auChangement?.(cle);
    });
    return element;
  });
  function selectionner(cle) {
    for (const element of boutons) element.classList.toggle('actif', element.dataset.valeur === String(cle));
  }
  selectionner(valeur);
  return { element: groupe, selectionner };
}

export function info(parent, texte = '') {
  return html('p', { classe: 'anim-info', html: texte }, parent);
}

export function boucle(element, etape) {
  let identifiant = null;
  let precedent = null;
  function image(instant) {
    if (!element.isConnected) {
      identifiant = null;
      return;
    }
    const ecart = precedent === null ? 0 : Math.min((instant - precedent) / 1000, 0.1);
    precedent = instant;
    if (etape(ecart, instant / 1000) === false) {
      identifiant = null;
      return;
    }
    identifiant = requestAnimationFrame(image);
  }
  const controle = {
    demarrer() {
      if (identifiant !== null) return;
      precedent = null;
      identifiant = requestAnimationFrame(image);
    },
    arreter() {
      if (identifiant !== null) cancelAnimationFrame(identifiant);
      identifiant = null;
    },
    get enMarche() {
      return identifiant !== null;
    },
  };
  return controle;
}

export function attendre(element, millisecondes) {
  return new Promise((resoudre, rejeter) => {
    setTimeout(() => (element.isConnected ? resoudre() : rejeter(new Error('animation retirée'))), millisecondes);
  });
}

export function pointeurSvg(svgElement, evenement) {
  const point = svgElement.createSVGPoint();
  point.x = evenement.clientX;
  point.y = evenement.clientY;
  const matrice = svgElement.getScreenCTM();
  return matrice ? point.matrixTransform(matrice.inverse()) : { x: 0, y: 0 };
}

export function glisser(svgElement, cible, auDeplacement) {
  cible.style.cursor = 'grab';
  cible.style.touchAction = 'none';
  cible.addEventListener('pointerdown', (evenement) => {
    evenement.preventDefault();
    cible.setPointerCapture(evenement.pointerId);
    cible.style.cursor = 'grabbing';
    auDeplacement(pointeurSvg(svgElement, evenement));
  });
  cible.addEventListener('pointermove', (evenement) => {
    if (cible.hasPointerCapture(evenement.pointerId)) auDeplacement(pointeurSvg(svgElement, evenement));
  });
  cible.addEventListener('pointerup', (evenement) => {
    cible.releasePointerCapture(evenement.pointerId);
    cible.style.cursor = 'grab';
  });
}

export function couleur(element, nom) {
  return getComputedStyle(element).getPropertyValue(nom).trim();
}

export function aleatoire(graine = 1) {
  let etat = graine >>> 0;
  return () => {
    etat = (etat + 0x6d2b79f5) >>> 0;
    let t = etat;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function bornes(valeur, min, max) {
  return Math.min(max, Math.max(min, valeur));
}

export function echelle([debutEntree, finEntree], [debutSortie, finSortie]) {
  const rapport = (finSortie - debutSortie) / (finEntree - debutEntree);
  const fonction = (valeur) => debutSortie + (valeur - debutEntree) * rapport;
  fonction.inverse = (valeur) => debutEntree + (valeur - debutSortie) / rapport;
  return fonction;
}

export function nombre(valeur, decimales = 2) {
  if (!Number.isFinite(valeur)) return '∞';
  return valeur.toLocaleString('fr-FR', { maximumFractionDigits: decimales });
}
