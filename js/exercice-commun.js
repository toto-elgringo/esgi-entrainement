import { echapper } from './outils.js';
import { lienExercice } from './parcours.js';

export function etoiles(difficulte) {
  return `<span class="difficulte" title="Difficulté ${difficulte} sur 3">${'●'.repeat(difficulte)}${'○'.repeat(3 - difficulte)}</span>`;
}

export function lienVoisin(exercice, sens) {
  if (!exercice) return '<span></span>';
  const texte = sens === 'precedent' ? `← ${echapper(exercice.titre)}` : `${echapper(exercice.titre)} →`;
  return `<a class="bouton discret" href="${lienExercice(exercice)}">${texte}</a>`;
}

export function navigationExercices(precedent, suivant) {
  return `<nav class="navigation-exercices" aria-label="Exercices voisins">${lienVoisin(precedent, 'precedent')}${lienVoisin(suivant, 'suivant')}</nav>`;
}

export const CONFIRMATION_RECOMMENCER = 'Recommencer l’exercice à zéro ?\nTes réponses, les indices affichés, la correction et la mention « Réussi » seront effacés.';

export function creerIndices({ bouton, zone, indices, rendre, auChangement }) {
  let affiches = 0;

  function majBouton() {
    bouton.textContent = `Afficher un indice (${affiches} / ${indices.length})`;
    bouton.hidden = affiches >= indices.length;
  }

  function montrerSuivant() {
    const indice = indices[affiches];
    if (indice === undefined) return false;
    affiches++;
    zone.insertAdjacentHTML('beforeend', `<div class="indice"><p>${rendre(indice)}</p></div>`);
    return true;
  }

  majBouton();

  return {
    afficher() {
      if (!montrerSuivant()) return;
      majBouton();
      auChangement(affiches);
    },
    restaurer(nombre = 0) {
      while (affiches < nombre && montrerSuivant());
      majBouton();
    },
    nombre: () => affiches,
  };
}

export function creerBascule({ bouton, zone, libelleVoir, libelleMasquer, confirmation, estReussi, montrer, auChangement, confirmer = (texte) => confirm(texte) }) {
  async function ouvrir() {
    if ((await montrer()) === false) return false;
    zone.hidden = false;
    bouton.textContent = libelleMasquer;
    return true;
  }

  function fermer() {
    zone.hidden = true;
    bouton.textContent = libelleVoir;
  }

  return {
    ouvrir,
    async basculer() {
      if (!zone.hidden) {
        fermer();
        auChangement(false);
        return;
      }
      if (!estReussi() && !confirmer(confirmation)) return;
      if (await ouvrir()) auChangement(true);
    },
  };
}
