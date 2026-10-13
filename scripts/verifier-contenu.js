import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dollarsEquilibres, validerChapitre, validerExercices, validerProgramme, validerQuiz } from '../js/maths/validation.js';
import * as contenuRust from '../serveur/contenu-rust.js';
import { verifierExercice } from '../serveur/rust.js';
import { validerExercice, validerMetaChapitre, validerQuiz as validerQuizRust } from '../serveur/validation-rust.js';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dossierMaths = path.join(racine, 'contenu', 'maths');
const dossierRust = path.join(racine, 'contenu', 'rust');
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

async function verifierChapitreMaths(chapitreId, idsMatieres) {
  const dossier = path.join(dossierMaths, chapitreId);
  const problemes = [];
  try {
    problemes.push(...validerChapitre(await lireJson(path.join(dossier, 'chapitre.json')), idsMatieres));
    const cours = await lireTexte(path.join(dossier, 'cours.md'));
    if (cours === null) problemes.push('cours.md manquant');
    else if (!dollarsEquilibres(cours)) problemes.push('cours.md : un « $ » n\'est pas fermé');
    problemes.push(...validerQuiz((await lireJson(path.join(dossier, 'quiz.json'))) ?? []));
    const exercices = await lireJson(path.join(dossier, 'exercices.json'));
    if (exercices === null) problemes.push('exercices.json manquant');
    else problemes.push(...validerExercices(exercices));
    return { problemes, nbExercices: exercices?.length ?? 0 };
  } catch (erreur) {
    return { problemes: [...problemes, erreur.message], nbExercices: 0 };
  }
}

async function verifierMaths() {
  console.log('\n=== Maths ===');
  const programme = await lireJson(path.join(dossierMaths, 'programme.json'));
  const problemesProgramme = validerProgramme(programme);
  for (const probleme of problemesProgramme) console.log(`✗ ${probleme}`);
  if (problemesProgramme.length > 0) return { total: 0, enErreur: 1 };

  const idsMatieres = programme.matieres.map((matiere) => matiere.id);
  let total = 0;
  let enErreur = 0;
  for (const chapitreId of programme.chapitres.filter((id) => id.startsWith(prefixe))) {
    const { problemes, nbExercices } = await verifierChapitreMaths(chapitreId, idsMatieres);
    total += nbExercices;
    console.log(`${problemes.length === 0 ? '✓' : '✗'} ${chapitreId} (${nbExercices} exercices)`);
    for (const probleme of problemes) console.log(`    - ${probleme}`);
    if (problemes.length > 0) enErreur++;
  }
  return { total, enErreur };
}

async function verifierCodeRust(exercice) {
  const problemes = [];
  const solution = await verifierExercice(exercice, exercice.solution);
  if (solution.statut !== 'reussi') {
    problemes.push(`la solution ne passe pas (${solution.statut}) :\n${indenter(solution.sortie)}`);
  } else if (solution.avertissements?.trim()) {
    problemes.push(`la solution produit des avertissements :\n${indenter(solution.avertissements)}`);
  }
  const depart = await verifierExercice(exercice, exercice.depart);
  if (depart.statut === 'reussi') problemes.push('le code de départ passe déjà la vérification');
  return problemes;
}

async function verifierExerciceRust(chapitreId, exerciceId) {
  try {
    const exercice = await contenuRust.lireExercice(dossierRust, chapitreId, exerciceId);
    const problemes = validerExercice(exercice);
    if (problemes.length > 0) return problemes;
    return await verifierCodeRust(exercice);
  } catch (erreur) {
    return [erreur.message];
  }
}

async function problemesChapitreRust(chapitreId) {
  const problemes = [];
  try {
    problemes.push(...validerMetaChapitre(await contenuRust.lireMetaChapitre(dossierRust, chapitreId)));
    problemes.push(...validerQuizRust(await contenuRust.lireQuiz(dossierRust, chapitreId)));
    await contenuRust.lireCours(dossierRust, chapitreId).catch(() => problemes.push('cours.md manquant'));
  } catch (erreur) {
    problemes.push(erreur.message);
  }
  return problemes;
}

async function verifierSommaire() {
  const attendu = JSON.stringify(await contenuRust.construireSommaire(dossierRust));
  const actuel = await lireJson(path.join(dossierRust, 'sommaire.json'));
  return JSON.stringify(actuel) === attendu ? [] : ['contenu/rust/sommaire.json n\'est pas à jour : lance « npm run sommaire »'];
}

async function verifierRust() {
  console.log('\n=== Rust ===');
  let total = 0;
  let enErreur = 0;

  if (!prefixe) {
    const problemes = await verifierSommaire();
    for (const probleme of problemes) console.log(`✗ ${probleme}`);
    enErreur += problemes.length;
  }

  const idsChapitres = (await contenuRust.listerIdsChapitres(dossierRust)).filter((id) => id.startsWith(prefixe));
  for (const chapitreId of idsChapitres) {
    console.log(chapitreId);
    const problemesChapitre = await problemesChapitreRust(chapitreId);
    for (const probleme of problemesChapitre) console.log(`  ✗ ${probleme}`);
    if (problemesChapitre.length > 0) enErreur++;

    const idsExercices = await contenuRust.listerIdsExercices(dossierRust, chapitreId);
    const resultats = await enParallele(
      idsExercices.map((exerciceId) => () => verifierExerciceRust(chapitreId, exerciceId)),
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
  const domaines = domaineDemande ? [domaineDemande] : ['maths', 'rust'];
  const verificateurs = { maths: verifierMaths, rust: verifierRust };
  if (!domaines.every((domaine) => domaine in verificateurs)) {
    console.error('Usage : npm run verifier-contenu [-- maths | rust | maths/02 | rust/03]');
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
