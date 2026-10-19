import { estDomaineCode } from './domaines.js';
import { echapper } from './outils.js';
import { compterProgression, estReussi } from './parcours.js';

export function barreProgression(reussis, total) {
  const pourcentage = total === 0 ? 0 : Math.round((reussis / total) * 100);
  const complete = total > 0 && reussis === total ? ' complete' : '';
  return `<div class="barre"><div class="barre-remplie${complete}" style="width: ${pourcentage}%"></div></div>`;
}

export function etiquetteSource(chapitre) {
  if (estDomaineCode(chapitre.domaine)) {
    return chapitre.source === 'cours'
      ? '<span class="etiquette etiquette-source">Cours ESGI</span>'
      : '<span class="etiquette etiquette-fondamentaux">Fondamental</span>';
  }
  return chapitre.source ? `<span class="etiquette etiquette-source">${echapper(chapitre.source)}</span>` : '';
}

function lien(href, texte, { classes = '', detail = '', actif }) {
  const classeActif = href === actif ? ' actif' : '';
  return `<a class="lien-menu ${classes}${classeActif}" href="${href}">${texte}${detail ? `<span class="detail">${detail}</span>` : ''}</a>`;
}

function dessinerChapitre(chapitre, numero, progression, ouvert, actif) {
  const { reussis, total } = compterProgression([chapitre], progression);
  const quiz = progression.quiz[chapitre.cle];
  const liens = [
    lien(`#/cours/${chapitre.cle}`, 'Cours', { classes: 'special', actif }),
    chapitre.quiz.length > 0
      ? lien(`#/quiz/${chapitre.cle}`, 'Quiz', { classes: 'special', detail: quiz ? `${quiz.score}/${quiz.total}` : '', actif })
      : '',
    ...chapitre.exercices.map((exercice) =>
      lien(`#/exercice/${chapitre.cle}/${exercice.id}`, `<span class="pastille"></span>${echapper(exercice.titre)}`, {
        classes: estReussi(progression, chapitre.cle, exercice.id) ? 'reussi' : '',
        actif,
      }),
    ),
  ].join('');

  return `
    <div class="chapitre-menu${ouvert ? ' ouvert' : ''}">
      <button class="chapitre-titre" data-chapitre="${chapitre.cle}" title="${echapper(chapitre.titre)}">
        <span class="numero">${String(numero).padStart(2, '0')}</span>
        <span class="nom">${echapper(chapitre.titre)}</span>
        <span class="compteur${total > 0 && reussis === total ? ' complet' : ''}">${reussis}/${total}</span>
      </button>
      <div class="chapitre-liens">${liens}</div>
    </div>`;
}

export function dessinerMenu(conteneur, chapitres, progression, ouverts, actif) {
  if (chapitres.length === 0) {
    conteneur.innerHTML = '<p class="menu-vide">Choisis une matière pour voir ses chapitres.</p>';
    return;
  }
  conteneur.innerHTML = chapitres
    .map((chapitre, index) => dessinerChapitre(chapitre, index + 1, progression, ouverts.has(chapitre.cle), actif))
    .join('');
}

export function dessinerProgressionGlobale(conteneur, chapitres, progression) {
  if (chapitres.length === 0) {
    conteneur.innerHTML = '';
    return;
  }
  const { reussis, total } = compterProgression(chapitres, progression);
  conteneur.innerHTML = `${barreProgression(reussis, total)}<span>${reussis} / ${total} exercices</span>`;
}
