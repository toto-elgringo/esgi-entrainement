import { chargerFeuille } from '../chargeur.js';
import { html } from './outils.js';

const FEUILLE_COMMUNE = 'css/animations.css';

export const FAMILLES = {
  maths: { charger: () => import('./maths.js').then((module) => module.animationsMaths), feuille: 'css/animations-maths.css' },
  combinatoire: { charger: () => import('./combinatoire.js').then((module) => module.animationsCombinatoire), feuille: 'css/animations-combinatoire.css' },
  code: { charger: () => import('./code.js').then((module) => module.animationsCode), feuille: 'css/animations-code.css' },
  anglais: { charger: () => import('./anglais.js').then((module) => module.animationsAnglais), feuille: 'css/animations-anglais.css' },
};

export const FAMILLE_DU_DOMAINE = {
  maths: 'maths',
  combinatoire: 'combinatoire',
  anglais: 'anglais',
  electif: 'anglais',
  rust: 'code',
  'rust-avance': 'code',
  python: 'code',
  c: 'code',
};

const familles = new Map();

export function chargerFamille(nom) {
  if (!familles.has(nom)) {
    const { charger, feuille } = FAMILLES[nom];
    const feuilles = [FEUILLE_COMMUNE, feuille].map((href) => chargerFeuille(href).catch(() => null));
    const promesse = Promise.all([charger(), ...feuilles])
      .then(([animations]) => animations)
      .catch((erreur) => {
        familles.delete(nom);
        throw erreur;
      });
    familles.set(nom, promesse);
  }
  return familles.get(nom);
}

export async function toutesLesAnimations() {
  const listes = await Promise.all(Object.keys(FAMILLES).map(chargerFamille));
  return Object.assign({}, ...listes);
}

async function trouverAnimations(noms, domaine) {
  const premiere = FAMILLE_DU_DOMAINE[domaine];
  const animations = premiere ? { ...(await chargerFamille(premiere)) } : {};
  if (noms.every((nom) => animations[nom])) return animations;
  const autres = Object.keys(FAMILLES).filter((nom) => nom !== premiere);
  const listes = await Promise.all(autres.map(chargerFamille));
  return Object.assign({}, ...listes, animations);
}

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

function construireCadre(animation, nom, options) {
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

export async function activerAnimations(conteneur, domaine) {
  if (!conteneur) return;
  const blocs = [...conteneur.querySelectorAll('pre > code.language-anim')];
  if (!blocs.length) return;
  const lus = blocs.map((code) => ({ code, ...lireBloc(code.textContent) }));
  let animations = {};
  try {
    animations = await trouverAnimations(lus.map(({ nom }) => nom), domaine);
  } catch {
    animations = {};
  }
  const observateur = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver((entrees) => {
      for (const entree of entrees) {
        if (!entree.isIntersecting) continue;
        observateur.unobserve(entree.target);
        entree.target.lancerAnimation?.();
      }
    }, { rootMargin: '200px' })
    : null;
  for (const { code, nom, options } of lus) {
    if (!code.isConnected) continue;
    const { cadre, lancer } = construireCadre(animations[nom], nom, options);
    code.parentElement.replaceWith(cadre);
    if (observateur) {
      cadre.lancerAnimation = lancer;
      observateur.observe(cadre);
    } else {
      lancer();
    }
  }
}
