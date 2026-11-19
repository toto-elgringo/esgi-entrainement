import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { DOMAINES_CODE, DOMAINES_REPONSES, LANGAGES } from '../js/domaines.js';

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

export async function lireTexte(fichier) {
  try {
    return await fs.readFile(fichier, 'utf8');
  } catch (erreur) {
    if (erreur.code === 'ENOENT') return null;
    throw erreur;
  }
}

export async function lireJson(fichier) {
  const texte = await lireTexte(fichier);
  if (texte === null) return null;
  try {
    return JSON.parse(texte);
  } catch (erreur) {
    throw new Error(`JSON invalide dans ${path.relative(process.cwd(), fichier)} : ${erreur.message}`);
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

async function chapitresCode(dossierContenu, langage) {
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
      ...(meta.supports ? { supports: meta.supports } : {}),
      exercices,
      quiz: await lireQuiz(dossierContenu, id),
    });
  }
  return chapitres;
}

function nombreQuestions(quiz) {
  return Array.isArray(quiz) ? quiz.length : 0;
}

export async function construireSommaire(dossierContenu, langage) {
  return { chapitres: await chapitresCode(dossierContenu, langage) };
}

export async function sommaireDomaineCode(dossierContenu, langage) {
  const chapitres = await chapitresCode(dossierContenu, langage);
  return { chapitres: chapitres.map(({ quiz, ...chapitre }) => ({ ...chapitre, nombreQuestions: nombreQuestions(quiz) })) };
}

async function chapitreReponses(dossierDomaine, id) {
  if (!idValide(id)) return null;
  const dossier = path.join(dossierDomaine, id);
  try {
    const meta = await lireJson(path.join(dossier, 'chapitre.json'));
    if (!meta || typeof meta !== 'object') return null;
    const [exercices, quiz] = await Promise.all([lireJson(path.join(dossier, 'exercices.json')), lireJson(path.join(dossier, 'quiz.json'))]);
    return { ...meta, id, exercices: exercices ?? [], nombreQuestions: nombreQuestions(quiz) };
  } catch {
    return null;
  }
}

export async function sommaireDomaineReponses(dossierDomaine) {
  const programme = await lireJson(path.join(dossierDomaine, 'programme.json'));
  if (!programme) return { matieres: [], chapitres: [] };
  const ids = Array.isArray(programme.chapitres) ? programme.chapitres : [];
  const chapitres = await Promise.all(ids.map((id) => chapitreReponses(dossierDomaine, id)));
  return { matieres: Array.isArray(programme.matieres) ? programme.matieres : [], chapitres: chapitres.filter(Boolean) };
}

export function domaineConnu(domaine) {
  return typeof domaine === 'string' && (Object.hasOwn(DOMAINES_CODE, domaine) || Object.hasOwn(DOMAINES_REPONSES, domaine));
}

export async function sommaireDomaine(dossierContenu, domaine) {
  if (!domaineConnu(domaine)) throw new ContenuIntrouvable(`Domaine inconnu : ${domaine}`);
  const dossier = path.join(dossierContenu, domaine);
  return Object.hasOwn(DOMAINES_CODE, domaine)
    ? sommaireDomaineCode(dossier, DOMAINES_CODE[domaine].langage)
    : sommaireDomaineReponses(dossier);
}

function surveiller(dossier, surChangement) {
  try {
    const surveillance = fsSync.watch(dossier, { recursive: true }, surChangement);
    surveillance.unref();
    return surveillance;
  } catch {
    return null;
  }
}

export function creerSommaires(dossierContenu, { surveiller: brancher = surveiller } = {}) {
  const cache = new Map();
  let surveillance = brancher(dossierContenu, () => cache.clear());
  surveillance?.on?.('error', () => {
    surveillance.close();
    surveillance = null;
    cache.clear();
  });

  function lire(domaine) {
    if (!surveillance) return sommaireDomaine(dossierContenu, domaine);
    if (!cache.has(domaine)) {
      const calcul = sommaireDomaine(dossierContenu, domaine);
      cache.set(domaine, calcul);
      calcul.catch(() => {
        if (cache.get(domaine) === calcul) cache.delete(domaine);
      });
    }
    return cache.get(domaine);
  }

  function fermer() {
    surveillance?.close();
    surveillance = null;
    cache.clear();
  }

  return { lire, fermer, get enCache() { return surveillance !== null; } };
}
