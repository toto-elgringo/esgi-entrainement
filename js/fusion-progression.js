export const PARTIES = ['exercices', 'quiz', 'saisies', 'codes', 'partiesQuiz', 'affichages'];

const CLES_INTERDITES = ['__proto__', 'constructor', 'prototype'];

const estObjet = (valeur) => typeof valeur === 'object' && valeur !== null && !Array.isArray(valeur);

export function progressionVide() {
  return Object.fromEntries(PARTIES.map((partie) => [partie, {}]));
}

const entierPositif = (n) => Number.isInteger(n) && n >= 0;

const exerciceValide = (valeur) => estObjet(valeur) && entierPositif(valeur.essais) && typeof valeur.reussi === 'boolean';

const quizValide = (valeur) => estObjet(valeur)
  && typeof valeur.score === 'number' && Number.isFinite(valeur.score) && valeur.score >= 0
  && Number.isInteger(valeur.total) && valeur.total > 0
  && valeur.score <= valeur.total;

export function changementValide(changement) {
  if (!estObjet(changement)) return false;
  const { partie, cle, valeur, faitLe } = changement;
  if (!PARTIES.includes(partie)) return false;
  if (typeof cle !== 'string' || cle === '' || CLES_INTERDITES.includes(cle)) return false;
  if (typeof faitLe !== 'number' || !Number.isFinite(faitLe)) return false;
  if (valeur === undefined) return false;
  if (valeur === null) return true;
  if (partie === 'exercices') return exerciceValide(valeur);
  if (partie === 'quiz') return quizValide(valeur);
  return true;
}

function fusionnerExercice(existant, recu) {
  if (!estObjet(existant)) return recu;
  return {
    essais: Math.max(existant.essais ?? 0, recu.essais ?? 0),
    reussi: Boolean(existant.reussi || recu.reussi),
  };
}

function fusionnerQuiz(existant, recu) {
  if (!estObjet(existant)) return recu;
  return recu.score / recu.total > existant.score / existant.total ? recu : existant;
}

export function appliquerChangement(etat, { partie, cle, valeur, faitLe }) {
  const { progression, dates, supprimes } = etat;
  const id = `${partie}/${cle}`;
  const cumul = partie === 'exercices' || partie === 'quiz';
  const actuel = () => (Object.hasOwn(progression[partie], cle) ? progression[partie][cle] : null);

  if (valeur === null) {
    if (Object.hasOwn(dates, id) && dates[id] > faitLe) return { retenu: false, valeur: actuel() };
    delete progression[partie][cle];
    delete dates[id];
    supprimes[id] = Math.max(supprimes[id] ?? faitLe, faitLe);
    return { retenu: true, valeur: null };
  }

  if (Object.hasOwn(supprimes, id) && supprimes[id] > faitLe) return { retenu: false, valeur: actuel() };

  if (cumul) {
    const existant = actuel();
    progression[partie][cle] = partie === 'exercices' ? fusionnerExercice(existant, valeur) : fusionnerQuiz(existant, valeur);
    dates[id] = Math.max(dates[id] ?? faitLe, faitLe);
  } else {
    if (Object.hasOwn(dates, id) && dates[id] >= faitLe && Object.hasOwn(progression[partie], cle)) {
      return { retenu: false, valeur: actuel() };
    }
    progression[partie][cle] = valeur;
    dates[id] = faitLe;
  }
  return { retenu: true, valeur: progression[partie][cle] };
}
