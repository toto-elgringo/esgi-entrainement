const CLE = 'esgi-entrainement';

function etatVide() {
  return { exercices: {}, quiz: {}, saisies: {}, codes: {}, partiesQuiz: {}, affichages: {}, matiere: null, menuRange: false, theme: 'sombre' };
}

function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    return brut ? { ...etatVide(), ...JSON.parse(brut) } : etatVide();
  } catch {
    return etatVide();
  }
}

const FORMAT = 'esgi-entrainement';
const VERSION = 1;

const estObjet = (valeur) => typeof valeur === 'object' && valeur !== null && !Array.isArray(valeur);

function nettoyer(progression) {
  const propre = etatVide();
  for (const cle of ['exercices', 'quiz', 'saisies', 'codes', 'partiesQuiz', 'affichages']) {
    if (estObjet(progression[cle])) propre[cle] = progression[cle];
  }
  if (typeof progression.matiere === 'string') propre.matiere = progression.matiere;
  if (typeof progression.menuRange === 'boolean') propre.menuRange = progression.menuRange;
  if (progression.theme === 'clair' || progression.theme === 'sombre') propre.theme = progression.theme;
  return propre;
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

  menuRange: () => etat.menuRange,

  rangerMenu(range) {
    etat.menuRange = range;
    sauvegarder();
  },

  theme: () => etat.theme,

  choisirTheme(theme) {
    etat.theme = theme;
    sauvegarder();
  },

  exporter() {
    return JSON.stringify({ format: FORMAT, version: VERSION, exporteLe: new Date().toISOString(), progression: etat }, null, 2);
  },

  importer(texte) {
    let fichier;
    try {
      fichier = JSON.parse(texte);
    } catch {
      throw new Error('Fichier illisible : ce n’est pas une sauvegarde valide.');
    }
    if (!estObjet(fichier) || fichier.format !== FORMAT || !estObjet(fichier.progression)) {
      throw new Error('Ce fichier ne vient pas d’ESGI Entraînement.');
    }
    etat = nettoyer(fichier.progression);
    sauvegarder();
  },

  reinitialiser() {
    etat = { ...etatVide(), matiere: etat.matiere, menuRange: etat.menuRange, theme: etat.theme };
    sauvegarder();
  },
};
