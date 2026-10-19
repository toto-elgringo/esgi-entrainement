import { DOMAINES_CODE, DOMAINES_REPONSES, trierMatieres } from './domaines.js';

async function lire(chemin, format) {
  const reponse = await fetch(chemin, { cache: 'no-cache' });
  if (!reponse.ok) throw new Error(`Impossible de charger ${chemin}`);
  return format === 'texte' ? reponse.text() : reponse.json();
}

async function lireOuDefaut(chemin, defaut) {
  try {
    return await lire(chemin);
  } catch {
    return defaut;
  }
}

const VIDE = { matieres: [], chapitres: [] };

async function chargerChapitreReponses(domaine, id) {
  const [meta, exercices, quiz] = await Promise.all([
    lire(`contenu/${domaine}/${id}/chapitre.json`),
    lireOuDefaut(`contenu/${domaine}/${id}/exercices.json`, []),
    lireOuDefaut(`contenu/${domaine}/${id}/quiz.json`, []),
  ]);
  return { ...meta, id, cle: `${domaine}/${id}`, domaine, matieres: meta.matieres ?? [], exercices, quiz };
}

async function chargerDomaineReponses(domaine) {
  const programme = await lireOuDefaut(`contenu/${domaine}/programme.json`, null);
  if (!programme) return VIDE;
  const chapitres = await Promise.all(programme.chapitres.map((id) => chargerChapitreReponses(domaine, id).catch(() => null)));
  return {
    matieres: programme.matieres.map((matiere) => ({ ...matiere, domaine })),
    chapitres: chapitres.filter(Boolean),
  };
}

async function chargerDomaineCode(domaine) {
  const sommaire = await lireOuDefaut(`contenu/${domaine}/sommaire.json`, null);
  if (!sommaire || sommaire.chapitres.length === 0) return VIDE;
  const { matiere } = DOMAINES_CODE[domaine];
  return {
    matieres: [{ ...matiere, domaine }],
    chapitres: sommaire.chapitres.map((chapitre) => ({
      ...chapitre,
      cle: `${domaine}/${chapitre.id}`,
      domaine,
      matieres: [matiere.id],
    })),
  };
}

export async function chargerCatalogue() {
  const domaines = await Promise.all([
    ...Object.keys(DOMAINES_CODE).map(chargerDomaineCode),
    ...Object.keys(DOMAINES_REPONSES).map(chargerDomaineReponses),
  ]);
  return {
    matieres: trierMatieres(domaines.flatMap((domaine) => domaine.matieres)),
    chapitres: domaines.flatMap((domaine) => domaine.chapitres),
  };
}

const textesEnCache = new Map();

async function lireTexteEnCache(chemin) {
  if (!textesEnCache.has(chemin)) textesEnCache.set(chemin, await lire(chemin, 'texte'));
  return textesEnCache.get(chemin);
}

export function chargerCours(chapitre) {
  return lireTexteEnCache(`contenu/${chapitre.domaine}/${chapitre.id}/cours.md`);
}

export function chargerFichierCode(domaine, chapitreId, exerciceId, nom) {
  return lireTexteEnCache(`contenu/${domaine}/${chapitreId}/exercices/${exerciceId}/${nom}`);
}
