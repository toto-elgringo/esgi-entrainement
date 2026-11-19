import { DOMAINES_CODE, DOMAINES_REPONSES, estDomaineCode, langageDe, LANGAGES, trierMatieres } from './domaines.js';

class ErreurChargement extends Error {
  constructor(chemin, statut) {
    super(`Impossible de charger ${chemin}`);
    this.statut = statut;
  }
}

async function lire(chemin, format = 'json') {
  const reponse = await fetch(chemin, { cache: 'no-cache' });
  if (!reponse.ok) throw new ErreurChargement(chemin, reponse.status);
  return format === 'texte' ? reponse.text() : reponse.json();
}

const VIDE = { matieres: [], chapitres: [] };

function preparerDomaine(domaine, sommaire) {
  const chapitres = Array.isArray(sommaire?.chapitres) ? sommaire.chapitres : [];
  if (chapitres.length === 0) return VIDE;
  if (estDomaineCode(domaine)) {
    const { matiere } = DOMAINES_CODE[domaine];
    return {
      matieres: [{ ...matiere, domaine }],
      chapitres: chapitres.map((chapitre) => ({
        ...chapitre,
        cle: `${domaine}/${chapitre.id}`,
        domaine,
        matieres: [matiere.id],
        exercices: chapitre.exercices ?? [],
        nombreQuestions: chapitre.nombreQuestions ?? 0,
      })),
    };
  }
  return {
    matieres: (sommaire.matieres ?? []).map((matiere) => ({ ...matiere, domaine })),
    chapitres: chapitres.map((chapitre) => ({
      ...chapitre,
      cle: `${domaine}/${chapitre.id}`,
      domaine,
      matieres: chapitre.matieres ?? [],
      exercices: chapitre.exercices ?? [],
      nombreQuestions: chapitre.nombreQuestions ?? 0,
    })),
  };
}

async function chargerDomaine(domaine) {
  try {
    return preparerDomaine(domaine, await lire(`api/sommaire/${encodeURIComponent(domaine)}`));
  } catch {
    return VIDE;
  }
}

export async function chargerCatalogue() {
  const domaines = await Promise.all([...Object.keys(DOMAINES_CODE), ...Object.keys(DOMAINES_REPONSES)].map(chargerDomaine));
  return {
    matieres: trierMatieres(domaines.flatMap((domaine) => domaine.matieres)),
    chapitres: domaines.flatMap((domaine) => domaine.chapitres),
  };
}

const enCache = new Map();

function garderEnCache(chemin, charger) {
  if (!enCache.has(chemin)) {
    const promesse = charger().catch((erreur) => {
      enCache.delete(chemin);
      throw erreur;
    });
    enCache.set(chemin, promesse);
  }
  return enCache.get(chemin);
}

function lireTexteEnCache(chemin) {
  return garderEnCache(chemin, () => lire(chemin, 'texte'));
}

export function chargerCours(chapitre) {
  return lireTexteEnCache(`contenu/${chapitre.domaine}/${chapitre.id}/cours.md`);
}

export function chargerQuiz(chapitre) {
  const chemin = `contenu/${chapitre.domaine}/${chapitre.id}/quiz.json`;
  return garderEnCache(chemin, () =>
    lire(chemin).then(
      (questions) => (Array.isArray(questions) ? questions : []),
      (erreur) => {
        if (erreur.statut === 404) return [];
        throw erreur;
      },
    ));
}

export function chargerFichierCode(domaine, chapitreId, exerciceId, nom) {
  return lireTexteEnCache(`contenu/${domaine}/${chapitreId}/exercices/${exerciceId}/${nom}`);
}

export function prechargerExercice(exercice) {
  if (!exercice?.chapitreCle) return Promise.resolve();
  const [domaine, chapitreId] = exercice.chapitreCle.split('/');
  if (!estDomaineCode(domaine)) return Promise.resolve();
  const { extension } = LANGAGES[langageDe(domaine)];
  return Promise.all(['enonce.md', `depart.${extension}`].map((nom) => chargerFichierCode(domaine, chapitreId, exercice.id, nom).catch(() => null)));
}

export function plusTard(action) {
  if (typeof requestIdleCallback === 'function') requestIdleCallback(() => action(), { timeout: 3000 });
  else setTimeout(action, 500);
}
