import fs from 'node:fs/promises';
import path from 'node:path';
import { LANGAGES } from '../js/domaines.js';

const FORMAT_ID = /^[a-z0-9][a-z0-9-]*$/;

export class ContenuIntrouvable extends Error {
  constructor(message = 'Contenu introuvable') {
    super(message);
  }
}

export function idValide(id) {
  return typeof id === 'string' && FORMAT_ID.test(id);
}

export function fichiersExercice(langage) {
  const extension = LANGAGES[langage]?.extension;
  if (!extension) throw new ContenuIntrouvable(`Langage inconnu : ${langage}`);
  return {
    depart: `depart.${extension}`,
    solution: `solution.${extension}`,
    tests: `tests.${extension}`,
  };
}

function exigerIds(...ids) {
  if (!ids.every(idValide)) throw new ContenuIntrouvable();
}

async function lireTexte(fichier) {
  try {
    return await fs.readFile(fichier, 'utf8');
  } catch (erreur) {
    if (erreur.code === 'ENOENT') return null;
    throw erreur;
  }
}

async function lireJson(fichier) {
  const texte = await lireTexte(fichier);
  if (texte === null) return null;
  try {
    return JSON.parse(texte);
  } catch (erreur) {
    throw new Error(`JSON invalide dans ${fichier} : ${erreur.message}`);
  }
}

async function sousDossiers(dossier) {
  try {
    const entrees = await fs.readdir(dossier, { withFileTypes: true });
    return entrees
      .filter((entree) => entree.isDirectory() && idValide(entree.name))
      .map((entree) => entree.name)
      .sort();
  } catch (erreur) {
    if (erreur.code === 'ENOENT') return [];
    throw erreur;
  }
}

function dossierChapitre(dossierContenu, chapitreId) {
  return path.join(dossierContenu, chapitreId);
}

function dossierExercice(dossierContenu, chapitreId, exerciceId) {
  return path.join(dossierContenu, chapitreId, 'exercices', exerciceId);
}

export async function listerIdsChapitres(dossierContenu) {
  const ids = await sousDossiers(dossierContenu);
  const avecMeta = await Promise.all(ids.map(async (id) => ((await lireTexte(path.join(dossierContenu, id, 'chapitre.json'))) === null ? null : id)));
  return avecMeta.filter(Boolean);
}

export async function listerIdsExercices(dossierContenu, chapitreId) {
  exigerIds(chapitreId);
  return sousDossiers(path.join(dossierChapitre(dossierContenu, chapitreId), 'exercices'));
}

export async function lireMetaChapitre(dossierContenu, chapitreId) {
  exigerIds(chapitreId);
  return lireJson(path.join(dossierChapitre(dossierContenu, chapitreId), 'chapitre.json'));
}

export async function lireCours(dossierContenu, chapitreId) {
  exigerIds(chapitreId);
  const cours = await lireTexte(path.join(dossierChapitre(dossierContenu, chapitreId), 'cours.md'));
  if (cours === null) throw new ContenuIntrouvable(`Pas de cours pour ${chapitreId}`);
  return cours;
}

export async function lireQuiz(dossierContenu, chapitreId) {
  exigerIds(chapitreId);
  return (await lireJson(path.join(dossierChapitre(dossierContenu, chapitreId), 'quiz.json'))) ?? [];
}

export async function lireExercice(dossierContenu, langage, chapitreId, exerciceId) {
  exigerIds(chapitreId, exerciceId);
  const fichiers = fichiersExercice(langage);
  const dossier = dossierExercice(dossierContenu, chapitreId, exerciceId);
  const meta = await lireJson(path.join(dossier, 'exercice.json'));
  if (!meta) throw new ContenuIntrouvable(`Exercice introuvable : ${chapitreId}/${exerciceId}`);

  const [enonce, depart, solution, tests, sortie, entree] = await Promise.all(
    ['enonce.md', fichiers.depart, fichiers.solution, fichiers.tests, 'sortie.txt', 'entree.txt'].map((nom) => lireTexte(path.join(dossier, nom))),
  );

  return {
    langage,
    chapitreId,
    id: exerciceId,
    titre: meta.titre,
    difficulte: meta.difficulte ?? 1,
    type: meta.type ?? 'tests',
    indices: meta.indices ?? [],
    enonce: enonce ?? '',
    depart,
    solution,
    tests,
    sortieAttendue: sortie,
    entree,
  };
}

export async function construireSommaire(dossierContenu, langage) {
  const chapitres = [];
  for (const id of await listerIdsChapitres(dossierContenu)) {
    const meta = await lireMetaChapitre(dossierContenu, id);
    const idsExercices = await listerIdsExercices(dossierContenu, id);
    const exercices = await Promise.all(
      idsExercices.map(async (exerciceId) => {
        const exercice = await lireExercice(dossierContenu, langage, id, exerciceId);
        return {
          id: exerciceId,
          titre: exercice.titre,
          difficulte: exercice.difficulte,
          type: exercice.type,
          indices: exercice.indices,
          ...(exercice.entree === null ? {} : { avecEntree: true }),
        };
      }),
    );
    chapitres.push({
      id,
      titre: meta.titre,
      description: meta.description ?? '',
      source: meta.source ?? 'fondamentaux',
      exercices,
      quiz: await lireQuiz(dossierContenu, id),
    });
  }
  return { chapitres };
}
