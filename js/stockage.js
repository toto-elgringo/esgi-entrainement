import { PARTIES } from './fusion-progression.js';

const CLE = 'esgi-entrainement';
const FORMAT = 'esgi-entrainement';
const VERSION = 1;
const DELAI_ECRITURE = 300;

export const MESSAGE_STOCKAGE_PLEIN = 'Sauvegarde impossible : le stockage du navigateur est plein. Exporte ta progression puis efface les anciens résultats.';

function etatVide() {
  return { exercices: {}, quiz: {}, saisies: {}, codes: {}, partiesQuiz: {}, affichages: {}, matiere: null, menuRange: false, theme: 'sombre' };
}

const estObjet = (valeur) => typeof valeur === 'object' && valeur !== null && !Array.isArray(valeur);

function nettoyer(progression) {
  const propre = etatVide();
  for (const cle of PARTIES) {
    if (estObjet(progression[cle])) propre[cle] = progression[cle];
  }
  if (typeof progression.matiere === 'string') propre.matiere = progression.matiere;
  if (typeof progression.menuRange === 'boolean') propre.menuRange = progression.menuRange;
  if (progression.theme === 'clair' || progression.theme === 'sombre') propre.theme = progression.theme;
  return propre;
}

function lireEtat(memoire) {
  try {
    const brut = memoire?.getItem(CLE);
    return brut ? { ...etatVide(), ...JSON.parse(brut) } : etatVide();
  } catch {
    return etatVide();
  }
}

export function creerStockage({ memoire = globalThis.localStorage, delai = DELAI_ECRITURE } = {}) {
  let etat = lireEtat(memoire);
  let enAttente = [];
  let minuteur = null;
  let enErreur = false;
  const surErreur = new Set();
  const surChangement = new Set();
  const surLocal = new Set();

  function ecrireMaintenant() {
    clearTimeout(minuteur);
    minuteur = null;
    if (enAttente.length === 0) return;
    const changements = enAttente;
    enAttente = [];
    const base = lireEtat(memoire);
    const demandees = [];
    let immediat = false;
    for (const { changer, touches, immediat: pressee } of changements) {
      if (touches) demandees.push(...(typeof touches === 'function' ? touches(base) : touches));
      if (pressee) immediat = true;
      changer(base);
    }
    etat = base;
    let ecrit = false;
    try {
      memoire?.setItem(CLE, JSON.stringify(base));
      enErreur = false;
      ecrit = true;
    } catch (erreur) {
      if (!enErreur) surErreur.forEach((ecouteur) => ecouteur(erreur));
      enErreur = true;
    }
    if (ecrit && demandees.length > 0) signaler(base, demandees, immediat);
  }

  function signaler(base, demandees, immediat) {
    const vues = new Set();
    const touches = [];
    for (const { partie, cle } of demandees) {
      const identifiant = JSON.stringify([partie, cle]);
      if (vues.has(identifiant)) continue;
      vues.add(identifiant);
      touches.push({ partie, cle, valeur: structuredClone(base[partie]?.[cle] ?? null) });
    }
    surLocal.forEach((ecouteur) => ecouteur(touches, { immediat }));
  }

  function modifier(changer, { immediat = false, touches = null } = {}) {
    changer(etat);
    enAttente.push({ changer, touches, immediat });
    if (immediat) ecrireMaintenant();
    else if (!minuteur) minuteur = setTimeout(ecrireMaintenant, delai);
  }

  function remplacerParties(parties) {
    ecrireMaintenant();
    const avant = JSON.stringify(PARTIES.map((partie) => etat[partie]));
    const base = lireEtat(memoire);
    for (const partie of PARTIES) base[partie] = estObjet(parties?.[partie]) ? structuredClone(parties[partie]) : {};
    const change = JSON.stringify(PARTIES.map((partie) => base[partie])) !== avant;
    etat = base;
    try {
      memoire?.setItem(CLE, JSON.stringify(base));
      enErreur = false;
    } catch (erreur) {
      if (!enErreur) surErreur.forEach((ecouteur) => ecouteur(erreur));
      enErreur = true;
    }
    if (change) surChangement.forEach((ecouteur) => ecouteur());
    return change;
  }

  function recharger() {
    etat = lireEtat(memoire);
    for (const { changer } of enAttente) changer(etat);
    surChangement.forEach((ecouteur) => ecouteur());
  }

  return {
    progression: () => etat,

    enregistrerEssai(cle, reussi) {
      modifier((e) => {
        const actuel = e.exercices[cle] ?? { essais: 0, reussi: false };
        e.exercices[cle] = { essais: actuel.essais + 1, reussi: actuel.reussi || reussi };
      }, { immediat: true, touches: [{ partie: 'exercices', cle }] });
    },

    enregistrerQuiz(chapitreCle, score, total) {
      modifier((e) => {
        const actuel = e.quiz[chapitreCle];
        if (!actuel || score / total > actuel.score / actuel.total) e.quiz[chapitreCle] = { score, total };
      }, { immediat: true, touches: [{ partie: 'quiz', cle: chapitreCle }] });
    },

    partieQuiz: (chapitreCle) => etat.partiesQuiz[chapitreCle] ?? null,

    enregistrerPartieQuiz(chapitreCle, partie) {
      const copie = structuredClone(partie);
      modifier((e) => {
        e.partiesQuiz[chapitreCle] = structuredClone(copie);
      }, { touches: [{ partie: 'partiesQuiz', cle: chapitreCle }] });
    },

    saisies: (cle) => ({ ...(etat.saisies[cle] ?? {}) }),

    enregistrerSaisies(cle, saisies) {
      const copie = { ...saisies };
      modifier((e) => {
        e.saisies[cle] = { ...copie };
      }, { touches: [{ partie: 'saisies', cle }] });
    },

    code: (cle) => etat.codes[cle] ?? null,

    enregistrerCode(cle, code) {
      modifier((e) => {
        e.codes[cle] = code;
      }, { touches: [{ partie: 'codes', cle }] });
    },

    affichage: (cle) => ({ ...(etat.affichages[cle] ?? {}) }),

    enregistrerAffichage(cle, changements) {
      modifier((e) => {
        e.affichages[cle] = { ...e.affichages[cle], ...changements };
      }, { touches: [{ partie: 'affichages', cle }] });
    },

    matiere: () => etat.matiere,

    choisirMatiere(matiere) {
      modifier((e) => {
        e.matiere = matiere;
      });
    },

    menuRange: () => etat.menuRange,

    rangerMenu(range) {
      modifier((e) => {
        e.menuRange = range;
      });
    },

    theme: () => etat.theme,

    choisirTheme(theme) {
      modifier((e) => {
        e.theme = theme;
      }, { immediat: true });
    },

    tailleUtilisee() {
      ecrireMaintenant();
      try {
        return (memoire?.getItem(CLE) ?? '').length * 2;
      } catch {
        return 0;
      }
    },

    effacerResultats() {
      modifier((e) => {
        for (const affichage of Object.values(e.affichages)) {
          if (estObjet(affichage)) delete affichage.resultat;
        }
      }, {
        immediat: true,
        touches: (e) => Object.entries(e.affichages)
          .filter(([, affichage]) => estObjet(affichage) && 'resultat' in affichage)
          .map(([cle]) => ({ partie: 'affichages', cle })),
      });
    },

    exporter() {
      ecrireMaintenant();
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
      const propre = nettoyer(fichier.progression);
      ecrireMaintenant();
      modifier((e) => {
        Object.assign(e, structuredClone(propre));
      }, { immediat: true, touches: PARTIES.flatMap((partie) => Object.keys(propre[partie]).map((cle) => ({ partie, cle }))) });
    },

    reinitialiserExercice(cle) {
      modifier((e) => {
        for (const partie of ['exercices', 'saisies', 'codes', 'affichages']) delete e[partie][cle];
      }, { immediat: true, touches: ['exercices', 'saisies', 'codes', 'affichages'].map((partie) => ({ partie, cle })) });
    },

    reinitialiser() {
      ecrireMaintenant();
      modifier((e) => {
        Object.assign(e, { ...etatVide(), matiere: e.matiere, menuRange: e.menuRange, theme: e.theme });
      }, {
        immediat: true,
        touches: (e) => PARTIES.flatMap((partie) => Object.keys(e[partie]).map((cle) => ({ partie, cle }))),
      });
    },

    ecrireMaintenant,
    recharger,
    remplacerParties,
    surChangementLocal: (ecouteur) => surLocal.add(ecouteur),
    surErreurEcriture: (ecouteur) => surErreur.add(ecouteur),
    surChangementExterne: (ecouteur) => surChangement.add(ecouteur),
  };
}

export const stockage = creerStockage();

if (typeof addEventListener === 'function' && typeof document !== 'undefined') {
  addEventListener('storage', (evenement) => {
    if (evenement.key === CLE || evenement.key === null) stockage.recharger();
  });
  addEventListener('pagehide', () => stockage.ecrireMaintenant());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stockage.ecrireMaintenant();
  });
}
