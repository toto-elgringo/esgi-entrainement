import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { avecFormules, DOMAINES_CODE, DOMAINES_REPONSES } from '../js/domaines.js';
import { dollarsEquilibres, validerChapitre, validerExercices, validerProgramme, validerQuiz } from '../js/maths/validation.js';
import * as c from '../serveur/c.js';
import * as contenuCode from '../serveur/contenu-code.js';
import * as python from '../serveur/python.js';
import * as rust from '../serveur/rust.js';
import { validerExercice, validerMetaChapitre, validerQuiz as validerQuizCode } from '../serveur/validation-code.js';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dossierContenu = path.join(racine, 'contenu');
const EXECUTEURS = { rust, python, c };
const [domaineDemande, prefixe = ''] = (process.argv[2] ?? '').split('/');
const EN_PARALLELE = 4;

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
    throw new Error(`JSON invalide dans ${path.relative(racine, fichier)} : ${erreur.message}`);
  }
}

function indenter(texte = '') {
  return texte
    .trim()
    .split('\n')
    .map((ligne) => `          ${ligne}`)
    .join('\n');
}

async function enParallele(taches, limite) {
  const resultats = [];
  let prochain = 0;
  async function ouvrier() {
    while (prochain < taches.length) {
      const index = prochain++;
      resultats[index] = await taches[index]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limite, taches.length) }, ouvrier));
  return resultats;
}

async function verifierChapitreReponses(domaine, chapitreId, idsMatieres) {
  const dossier = path.join(dossierContenu, domaine, chapitreId);
  const options = { formules: avecFormules(domaine) };
  const problemes = [];
  try {
    problemes.push(...validerChapitre(await lireJson(path.join(dossier, 'chapitre.json')), idsMatieres));
    const cours = await lireTexte(path.join(dossier, 'cours.md'));
    if (cours === null) problemes.push('cours.md manquant');
    else if (options.formules && !dollarsEquilibres(cours)) problemes.push('cours.md : un « $ » n\'est pas fermé');
    problemes.push(...validerQuiz((await lireJson(path.join(dossier, 'quiz.json'))) ?? [], options));
    const exercices = await lireJson(path.join(dossier, 'exercices.json'));
    if (exercices === null) problemes.push('exercices.json manquant');
    else problemes.push(...validerExercices(exercices, options));
    return { problemes, nbExercices: exercices?.length ?? 0 };
  } catch (erreur) {
    return { problemes: [...problemes, erreur.message], nbExercices: 0 };
  }
}

async function verifierDomaineReponses(domaine) {
  console.log(`\n=== ${domaine} ===`);
  const programme = await lireJson(path.join(dossierContenu, domaine, 'programme.json'));
  if (programme === null) {
    console.log('(pas encore de contenu)');
    return { total: 0, enErreur: 0 };
  }
  const problemesProgramme = validerProgramme(programme);
  for (const probleme of problemesProgramme) console.log(`✗ ${probleme}`);
  if (problemesProgramme.length > 0) return { total: 0, enErreur: 1 };

  const idsMatieres = programme.matieres.map((matiere) => matiere.id);
  let total = 0;
  let enErreur = 0;
  for (const chapitreId of programme.chapitres.filter((id) => id.startsWith(prefixe))) {
    const { problemes, nbExercices } = await verifierChapitreReponses(domaine, chapitreId, idsMatieres);
    total += nbExercices;
    console.log(`${problemes.length === 0 ? '✓' : '✗'} ${chapitreId} (${nbExercices} exercices)`);
    for (const probleme of problemes) console.log(`    - ${probleme}`);
    if (problemes.length > 0) enErreur++;
  }
  return { total, enErreur };
}

async function verifierCode(executeur, exercice) {
  const problemes = [];
  const solution = await executeur.verifierExercice(exercice, exercice.solution);
  if (solution.statut !== 'reussi') {
    problemes.push(`la solution ne passe pas (${solution.statut}) :\n${indenter(solution.sortie)}`);
  } else if (solution.avertissements?.trim()) {
    problemes.push(`la solution produit des avertissements :\n${indenter(solution.avertissements)}`);
  }
  const depart = await executeur.verifierExercice(exercice, exercice.depart);
  if (depart.statut === 'reussi') problemes.push('le code de départ passe déjà la vérification');
  return problemes;
}

async function verifierExerciceCode(langage, dossier, chapitreId, exerciceId) {
  try {
    const exercice = await contenuCode.lireExercice(dossier, langage, chapitreId, exerciceId);
    const problemes = validerExercice(exercice, langage);
    if (problemes.length > 0) return problemes;
    return await verifierCode(EXECUTEURS[langage], exercice);
  } catch (erreur) {
    return [erreur.message];
  }
}

async function problemesChapitreCode(dossier, chapitreId) {
  const problemes = [];
  try {
    problemes.push(...validerMetaChapitre(await contenuCode.lireMetaChapitre(dossier, chapitreId)));
    problemes.push(...validerQuizCode(await contenuCode.lireQuiz(dossier, chapitreId)));
    await contenuCode.lireCours(dossier, chapitreId).catch(() => problemes.push('cours.md manquant'));
  } catch (erreur) {
    problemes.push(erreur.message);
  }
  return problemes;
}

async function verifierSommaire(langage, dossier) {
  const attendu = JSON.stringify(await contenuCode.construireSommaire(dossier, langage));
  const actuel = await lireJson(path.join(dossier, 'sommaire.json'));
  return JSON.stringify(actuel) === attendu ? [] : [`contenu/${langage}/sommaire.json n'est pas à jour : lance « npm run sommaire »`];
}

async function verifierDomaineCode(langage) {
  console.log(`\n=== ${langage} ===`);
  const dossier = path.join(dossierContenu, langage);
  let total = 0;
  let enErreur = 0;

  if (!prefixe) {
    const problemes = await verifierSommaire(langage, dossier);
    for (const probleme of problemes) console.log(`✗ ${probleme}`);
    enErreur += problemes.length;
  }

  const idsChapitres = (await contenuCode.listerIdsChapitres(dossier)).filter((id) => id.startsWith(prefixe));
  for (const chapitreId of idsChapitres) {
    console.log(chapitreId);
    const problemesChapitre = await problemesChapitreCode(dossier, chapitreId);
    for (const probleme of problemesChapitre) console.log(`  ✗ ${probleme}`);
    if (problemesChapitre.length > 0) enErreur++;

    const idsExercices = await contenuCode.listerIdsExercices(dossier, chapitreId);
    const resultats = await enParallele(
      idsExercices.map((exerciceId) => () => verifierExerciceCode(langage, dossier, chapitreId, exerciceId)),
      EN_PARALLELE,
    );
    idsExercices.forEach((exerciceId, index) => {
      total++;
      const problemes = resultats[index];
      console.log(`  ${problemes.length === 0 ? '✓' : '✗'} ${exerciceId}`);
      for (const probleme of problemes) console.log(`      - ${probleme}`);
      if (problemes.length > 0) enErreur++;
    });
  }
  return { total, enErreur };
}

async function principal() {
  const verificateurs = {
    ...Object.fromEntries(Object.keys(DOMAINES_REPONSES).map((domaine) => [domaine, () => verifierDomaineReponses(domaine)])),
    ...Object.fromEntries(Object.keys(DOMAINES_CODE).map((langage) => [langage, () => verifierDomaineCode(langage)])),
  };
  const domaines = domaineDemande ? [domaineDemande] : Object.keys(verificateurs);
  if (!domaines.every((domaine) => domaine in verificateurs)) {
    console.error(`Usage : npm run verifier-contenu [-- <domaine> | <domaine>/<début du chapitre>]\nDomaines : ${Object.keys(verificateurs).join(', ')}`);
    process.exitCode = 1;
    return;
  }

  let total = 0;
  let enErreur = 0;
  for (const domaine of domaines) {
    const resultat = await verificateurs[domaine]();
    total += resultat.total;
    enErreur += resultat.enErreur;
  }
  console.log(`\n${total} exercice(s) vérifié(s), ${enErreur} élément(s) avec problème.`);
  process.exitCode = enErreur > 0 ? 1 : 0;
}

await principal();
