const CLE = 'esgi-entrainement';

function etatVide() {
  return { exercices: {}, quiz: {}, saisies: {}, codes: {}, partiesQuiz: {}, affichages: {}, matiere: null };
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

  partieQuiz: (chapitreCle) => etat.partiesQuiz[chapitreCle] ?? null,

  enregistrerPartieQuiz(chapitreCle, partie) {
    etat.partiesQuiz[chapitreCle] = partie;
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

  affichage: (cle) => ({ ...(etat.affichages[cle] ?? {}) }),

  enregistrerAffichage(cle, changements) {
    etat.affichages[cle] = { ...etat.affichages[cle], ...changements };
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
