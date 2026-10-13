const CLE = 'esgi-entrainement';

function etatVide() {
  return { exercices: {}, quiz: {}, saisies: {}, codes: {}, matiere: null };
}

function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    return brut ? { ...etatVide(), ...JSON.parse(brut) } : etatVide();
  } catch {
    return etatVide();
  }
}

let etat = charger();

function sauvegarder() {
  try {
    localStorage.setItem(CLE, JSON.stringify(etat));
  } catch {}
}

export const stockage = {
  progression: () => etat,

  enregistrerEssai(cle, reussi) {
    const actuel = etat.exercices[cle] ?? { essais: 0, reussi: false };
    etat.exercices[cle] = { essais: actuel.essais + 1, reussi: actuel.reussi || reussi };
    sauvegarder();
  },

  enregistrerQuiz(chapitreCle, score, total) {
    const actuel = etat.quiz[chapitreCle];
    if (!actuel || score / total > actuel.score / actuel.total) etat.quiz[chapitreCle] = { score, total };
    sauvegarder();
  },

  saisies: (cle) => ({ ...(etat.saisies[cle] ?? {}) }),

  enregistrerSaisies(cle, saisies) {
    etat.saisies[cle] = saisies;
    sauvegarder();
  },

  code: (cle) => etat.codes[cle] ?? null,

  enregistrerCode(cle, code) {
    etat.codes[cle] = code;
    sauvegarder();
  },

  matiere: () => etat.matiere,

  choisirMatiere(matiere) {
    etat.matiere = matiere;
    sauvegarder();
  },

  reinitialiser() {
    etat = { ...etatVide(), matiere: etat.matiere };
    sauvegarder();
  },
};
