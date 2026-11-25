import fs from 'node:fs/promises';
import path from 'node:path';
import { creerAteliers, creerVerificateurs, DELAI_EXECUTION, ecrireFichierNeuf, lancer, problemeCompilation, problemeExecution, recreerDossier } from './processus.js';
import { analyserTestsRust } from './tests-rust.js';

export { creerReserve, normaliserSortie } from './processus.js';

const DELAI_COMPILATION = 90_000;
const NOM_PROJET = 'exercice';
const NOM_BINAIRE = process.platform === 'win32' ? `${NOM_PROJET}.exe` : NOM_PROJET;
const ENV_RUST = { RUST_BACKTRACE: '0' };
const INTROUVABLE = 'La commande « cargo » est introuvable. Installe Rust avec rustup (https://rustup.rs).';
const CARGO_TOML = `[package]
name = "${NOM_PROJET}"
version = "0.1.0"
edition = "2024"

[lints.rust]
dead_code = "allow"

[profile.dev]
debug = false
`;

export function assemblerCodeTest(code, tests) {
  return `${code.trimEnd()}\n\n${tests.trim()}\n`;
}

export function analyserResultatTests(sortie) {
  const resultat = /test result: \w+\. (\d+) passed; (\d+) failed/.exec(sortie);
  if (!resultat) return null;
  return { reussis: Number(resultat[1]), echoues: Number(resultat[2]) };
}

export function cheminExecutableTest(messages) {
  for (const ligne of messages.split('\n')) {
    let message;
    try {
      message = JSON.parse(ligne);
    } catch {
      continue;
    }
    if (message.reason === 'compiler-artifact' && message.profile?.test && message.executable) return message.executable;
  }
  return null;
}

let outils = null;

export function viderCacheOutils() {
  outils = null;
}

export function outilsRust() {
  const enCours = (outils ??= Promise.all([
    lancer('cargo', ['--version'], { delai: 15_000 }),
    lancer('cargo', ['clippy', '--version'], { delai: 15_000 }),
  ]).then(([cargo, clippy]) => ({
    cargo: cargo.code === 0 ? cargo.stdout.trim() : null,
    clippy: cargo.code === 0 && clippy.code === 0 ? clippy.stdout.trim() : null,
  })));
  return enCours.then((resultat) => {
    if (!resultat.cargo && outils === enCours) outils = null;
    return resultat;
  });
}

const avecAtelier = creerAteliers('cargo');

function cargo(dossier, sousCommande, options = [], signal) {
  return lancer('cargo', [sousCommande, '--quiet', '--color', 'always', ...options], {
    delai: DELAI_COMPILATION,
    dossier,
    env: ENV_RUST,
    signal,
  });
}

function problemeCargo(compilation) {
  return problemeCompilation(compilation, INTROUVABLE);
}

async function analyser(dossier, signal) {
  const { clippy } = await outilsRust();
  const analyse = await cargo(dossier, clippy ? 'clippy' : 'check', [], signal);
  return { probleme: problemeCargo(analyse), avertissements: analyse.stderr };
}

async function compiler(dossier, code, { test = false, avecAnalyse = true, signal } = {}) {
  await ecrireFichierNeuf(path.join(dossier, 'Cargo.toml'), CARGO_TOML);
  await recreerDossier(path.join(dossier, 'src'));
  await ecrireFichierNeuf(path.join(dossier, 'src', 'main.rs'), code);
  let avertissements = null;
  if (avecAnalyse) {
    const analyse = await analyser(dossier, signal);
    if (analyse.probleme) return { probleme: analyse.probleme };
    avertissements = analyse.avertissements;
  }

  const construction = test
    ? await cargo(dossier, 'test', ['--no-run', '--message-format=json-render-diagnostics'], signal)
    : await cargo(dossier, 'build', [], signal);
  const problemeConstruction = problemeCargo(construction);
  if (problemeConstruction) return { probleme: problemeConstruction };

  const executable = test ? cheminExecutableTest(construction.stdout) : path.join(dossier, 'target', 'debug', NOM_BINAIRE);
  if (!executable) return { probleme: { statut: 'erreur_compilation', sortie: 'cargo n’a pas produit le programme de test.' } };
  return { executable, avertissements: avertissements ?? construction.stderr };
}

function executerBinaire(executable, dossier, { args = [], entree = '', signal } = {}) {
  return lancer(executable, args, { delai: DELAI_EXECUTION, dossier, entree, env: ENV_RUST, signal });
}

function executer(code, entree, { avecAnalyse, signal }) {
  return avecAtelier(async (dossier) => {
    const { probleme, executable, avertissements } = await compiler(dossier, code, { avecAnalyse, signal });
    if (probleme) return probleme;

    const execution = await executerBinaire(executable, dossier, { entree, signal });
    const blocage = problemeExecution(execution);
    if (blocage) return { ...blocage, avertissements };

    return {
      statut: execution.code === 0 ? 'execute' : 'erreur_execution',
      sortie: `${execution.stdout}${execution.stderr}`,
      avertissements,
    };
  });
}

export function executerProgramme(code, entree = '', { signal } = {}) {
  return executer(code, entree, { avecAnalyse: false, signal });
}

function executerAvecAnalyse(code, entree = '', { signal } = {}) {
  return executer(code, entree, { avecAnalyse: true, signal });
}

export function verifierAvecTests(code, tests, { signal } = {}) {
  return avecAtelier(async (dossier) => {
    const source = assemblerCodeTest(code, tests);
    const { probleme, executable, avertissements } = await compiler(dossier, source, { test: true, signal });
    if (probleme) return probleme;

    const execution = await executerBinaire(executable, dossier, { args: ['--test-threads=1', '--color', 'never'], signal });
    const blocage = problemeExecution(execution);
    if (blocage) return { ...blocage, avertissements };

    const resume = analyserResultatTests(execution.stdout);
    const reussi = execution.code === 0 && resume !== null && resume.echoues === 0;
    return {
      statut: reussi ? 'reussi' : 'echec',
      sortie: `${execution.stdout}${execution.stderr}`,
      avertissements,
      resume,
      tests: analyserTestsRust(execution.stdout, source),
    };
  });
}

export async function prechauffer() {
  const { cargo: version } = await outilsRust();
  if (!version) return false;
  const resultat = await executerProgramme('fn main() {}\n');
  return resultat.statut === 'execute';
}

export const { verifierSortie, verifierExercice } = creerVerificateurs(executerAvecAnalyse, verifierAvecTests);
