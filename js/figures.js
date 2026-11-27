const ADRESSE_ABSOLUE = /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i;
const IMAGE_MARKDOWN = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;

export function estCheminRelatif(src = '') {
  return Boolean(src) && !ADRESSE_ABSOLUE.test(src);
}

export function cheminImage(src, chapitre) {
  if (!estCheminRelatif(src)) return src;
  const morceaux = [];
  for (const morceau of `${chapitre.domaine}/${chapitre.id}/${src}`.split('/')) {
    if (morceau === '' || morceau === '.') continue;
    if (morceau === '..') morceaux.pop();
    else morceaux.push(morceau);
  }
  return `contenu/${morceaux.join('/')}`;
}

export function imagesDuCours(markdown = '') {
  const sansCode = String(markdown).replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  return [...sansCode.matchAll(IMAGE_MARKDOWN)].map((correspondance) => correspondance[1]).filter(estCheminRelatif);
}

function estSeuleDansParagraphe(image) {
  const parent = image.parentElement;
  if (parent?.tagName !== 'P') return false;
  return [...parent.childNodes].every((noeud) => noeud === image || (noeud.nodeType === 3 && !noeud.textContent.trim()));
}

function fermerAgrandissement(fond) {
  fond.remove();
  document.removeEventListener('keydown', fond.surTouche);
}

function agrandir(image) {
  const fond = document.createElement('div');
  fond.className = 'capture-agrandie';
  fond.setAttribute('role', 'dialog');
  fond.setAttribute('aria-label', image.alt || 'Illustration agrandie');
  const copie = document.createElement('img');
  copie.src = image.currentSrc || image.src;
  copie.alt = image.alt;
  fond.append(copie);
  fond.surTouche = (evenement) => {
    if (evenement.key === 'Escape') fermerAgrandissement(fond);
  };
  fond.addEventListener('click', () => fermerAgrandissement(fond));
  document.addEventListener('keydown', fond.surTouche);
  document.body.append(fond);
}

function creerFigure(image) {
  const figure = document.createElement('figure');
  figure.className = 'capture';
  const cadre = document.createElement('button');
  cadre.type = 'button';
  cadre.className = 'capture-cadre';
  cadre.title = 'Agrandir';
  cadre.addEventListener('click', () => agrandir(image));
  cadre.append(image);
  figure.append(cadre);
  const legende = image.title || image.alt;
  if (legende) {
    const texte = document.createElement('figcaption');
    const badge = document.createElement('span');
    badge.className = 'capture-badge';
    badge.textContent = 'Extrait du cours';
    texte.append(badge, document.createTextNode(legende));
    figure.append(texte);
  }
  image.removeAttribute('title');
  return figure;
}

export function preparerFigures(article, chapitre) {
  if (!article) return;
  for (const image of article.querySelectorAll('img')) {
    image.src = cheminImage(image.getAttribute('src'), chapitre);
    image.loading = 'lazy';
    image.decoding = 'async';
    if (!estSeuleDansParagraphe(image)) continue;
    const paragraphe = image.parentElement;
    paragraphe.replaceWith(creerFigure(image));
  }
}
