import { animationsAnglais } from './anglais.js';
import { animationsCode } from './code.js';
import { animationsCombinatoire } from './combinatoire.js';
import { animationsMaths } from './maths.js';
import { html } from './outils.js';

export const ANIMATIONS = {
  ...animationsMaths,
  ...animationsCombinatoire,
  ...animationsCode,
  ...animationsAnglais,
};

function lireValeur(texte) {
  if (texte === 'vrai' || texte === 'oui') return true;
  if (texte === 'faux' || texte === 'non') return false;
  if (texte !== '' && Number.isFinite(Number(texte))) return Number(texte);
  return texte;
}

export function lireBloc(texte = '') {
  const lignes = String(texte).replace(/\r\n/g, '\n').split('\n').map((ligne) => ligne.trim()).filter(Boolean);
  const nom = lignes.shift() ?? '';
  const options = {};
  for (const ligne of lignes) {
    const separateur = ligne.indexOf(':');
    if (separateur === -1) continue;
    options[ligne.slice(0, separateur).trim()] = lireValeur(ligne.slice(separateur + 1).trim());
  }
  return { nom, options };
}

function construireCadre(nom, options) {
  const animation = ANIMATIONS[nom];
  const cadre = html('figure', { classe: 'anim', 'data-anim': nom });
  if (!animation) {
    cadre.classList.add('anim-inconnue');
    html('p', { classe: 'anim-info', texte: `Animation inconnue : « ${nom} ».` }, cadre);
    return { cadre, lancer: () => {} };
  }
  const entete = html('figcaption', { classe: 'anim-entete' }, cadre);
  html('span', { classe: 'anim-badge', texte: animation.badge ?? 'Animation' }, entete);
  html('span', { classe: 'anim-titre', texte: options.titre ?? animation.titre }, entete);
  const corps = html('div', { classe: 'anim-corps' }, cadre);
  const consigne = options.consigne ?? animation.consigne;
  if (consigne) html('p', { classe: 'anim-consigne', texte: consigne }, cadre);
  let lancee = false;
  const lancer = () => {
    if (lancee) return;
    lancee = true;
    try {
      animation.creer(corps, options);
    } catch (erreur) {
      corps.textContent = '';
      html('p', { classe: 'anim-info', texte: `L'animation n'a pas pu démarrer : ${erreur.message}` }, corps);
    }
  };
  return { cadre, lancer };
}

export function activerAnimations(conteneur) {
  if (!conteneur) return;
  const blocs = [...conteneur.querySelectorAll('pre > code.language-anim')];
  if (!blocs.length) return;
  const observateur = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver((entrees) => {
      for (const entree of entrees) {
        if (!entree.isIntersecting) continue;
        observateur.unobserve(entree.target);
        entree.target.lancerAnimation?.();
      }
    }, { rootMargin: '200px' })
    : null;
  for (const code of blocs) {
    const { nom, options } = lireBloc(code.textContent);
    const { cadre, lancer } = construireCadre(nom, options);
    code.parentElement.replaceWith(cadre);
    if (observateur) {
      cadre.lancerAnimation = lancer;
      observateur.observe(cadre);
    } else {
      lancer();
    }
  }
}
