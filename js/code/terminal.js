import { echapper } from '../outils.js';

const COULEURS = ['gris', 'rouge', 'vert', 'jaune', 'bleu', 'magenta', 'cyan', 'blanc'];
const SEQUENCE = /(\x1b\[[\d;?]*[A-Za-z])/;

function appliquerCodes(etat, parametres) {
  const codes = (parametres || '0').split(';').map(Number);
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    if (code === 0) {
      etat.gras = false;
      etat.couleur = null;
    } else if (code === 1) etat.gras = true;
    else if (code === 22) etat.gras = false;
    else if (code === 39) etat.couleur = null;
    else if (code >= 30 && code <= 37) etat.couleur = COULEURS[code - 30];
    else if (code >= 90 && code <= 97) etat.couleur = COULEURS[code - 90];
    else if (code === 38 || code === 48) i += codes[i + 1] === 2 ? 4 : 2;
  }
}

export function terminalVersHtml(texte = '') {
  const etat = { gras: false, couleur: null };
  let html = '';
  for (const morceau of String(texte).split(SEQUENCE)) {
    if (!morceau) continue;
    if (SEQUENCE.test(morceau)) {
      if (morceau.endsWith('m')) appliquerCodes(etat, morceau.slice(2, -1));
      continue;
    }
    const classes = [etat.gras && 'ansi-gras', etat.couleur && `ansi-${etat.couleur}`].filter(Boolean);
    html += classes.length ? `<span class="${classes.join(' ')}">${echapper(morceau)}</span>` : echapper(morceau);
  }
  return html;
}
