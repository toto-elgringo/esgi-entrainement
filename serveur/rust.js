import fs from 'node:fs/promises';
import path from 'node:path';
import { creerAteliers, creerVerificateurs, DELAI_EXECUTION, lancer, problemeExecution } from './processus.js';

export { creerReserve, normaliserSortie } from './processus.js';

const DELAI_COMPILATION = 90_000;
const NOM_PROJET = 'exercice';
const NOM_BINAIRE = process.platform === 'win32' ? `${NOM_PROJET}.exe` : NOM_PROJET;
const ENV_RUST = { RUST_BACKTRACE: '0' };
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

export function outilsRust() {
  outils ??= Promise.all([
    lancer('cargo', ['--version'], { delai: 15_000 }),
    lancer('cargo', ['clippy', '--version'], { delai: 15_000 }),
  ]).then(([cargo, clippy]) => ({
    cargo: cargo.code === 0 ? cargo.stdout.trim() : null,
    clippy: cargo.code === 0 && clippy.code === 0 ? clippy.stdout.trim() : null,
  }));
  return outils;
}

const avecAtelier = creerAteliers('cargo', async (dossier) => {
  await fs.mkdir(path.join(dossier, 'src'), { recursive: true });
  await fs.writeFile(path.join(dossier, 'Cargo.toml'), CARGO_TOML, 'utf8');
});

function cargo(dossier, sousCommande, options = []) {
  return lancer('cargo', [sousCommande, '--quiet', '--color', 'always', ...options], {
    delai: DELAI_COMPILATION,
    dossier,
    env: ENV_RUST,
  });
}

function problemeCompilation(compilation) {
  if (compilation.introuvable) {
    return { statut: 'outil_introuvable', sortie: 'La commande « cargo » est introuvable. Installe Rust avec rustup (https://rustup.rs).' };
  }
  if (compilation.delaiDepasse) {
    return { statut: 'delai_depasse', sortie: 'La compilation a pris trop de temps.' };
  }
  if (compilation.code !== 0) {
    return { statut: 'erreur_compilation', sortie: compilation.stderr };
  }
  return null;
}

async function compiler(dossier, code, { test }) {
  await fs.writeFile(path.join(dossier, 'src', 'main.rs'), code, 'utf8');
  const { clippy } = await outilsRust();
  const analyse = await cargo(dossier, clippy ? 'clippy' : 'check');
  const problemeAnalyse = problemeCompilation(analyse);
  if (problemeAnalyse) return { probleme: problemeAnalyse };

  const construction = test
    ? await cargo(dossier, 'test', ['--no-run', '--message-format=json-render-diagnostics'])
    : await cargo(dossier, 'build');
  const problemeConstruction = problemeCompilation(construction);
  if (problemeConstruction) return { probleme: problemeConstruction };

  const executable = test ? cheminExecutableTest(construction.stdout) : path.join(dossier, 'target', 'debug', NOM_BINAIRE);
  if (!executable) return { probleme: { statut: 'erreur_compilation', sortie: 'cargo n’a pas produit le programme de test.' } };
  return { executable, avertissements: analyse.stderr };
}

function executerBinaire(executable, dossier, { args = [], entree = '' } = {}) {
  return lancer(executable, args, { delai: DELAI_EXECUTION, dossier, entree, env: ENV_RUST });
}

export function executerProgramme(code, entree = '') {
  return avecAtelier(async (dossier) => {
    const { probleme, executable, avertissements } = await compiler(dossier, code, { test: false });
    if (probleme) return probleme;

    const execution = await executerBinaire(executable, dossier, { entree });
    const blocage = problemeExecution(execution);
    if (blocage) return { ...blocage, avertissements };

    return {
      statut: execution.code === 0 ? 'execute' : 'erreur_execution',
      sortie: `${execution.stdout}${execution.stderr}`,
      avertissements,
    };
  });
}

export function verifierAvecTests(code, tests) {
  return avecAtelier(async (dossier) => {
    const { probleme, executable, avertissements } = await compiler(dossier, assemblerCodeTest(code, tests), { test: true });
    if (probleme) return probleme;

    const execution = await executerBinaire(executable, dossier, { args: ['--test-threads=1', '--color', 'never'] });
    const blocage = problemeExecution(execution);
    if (blocage) return { ...blocage, avertissements };

    const resume = analyserResultatTests(execution.stdout);
    const reussi = execution.code === 0 && resume !== null && resume.echoues === 0;
    return {
      statut: reussi ? 'reussi' : 'echec',
      sortie: `${execution.stdout}${execution.stderr}`,
      avertissements,
      resume,
    };
  });
}

export const { verifierSortie, verifierExercice } = creerVerificateurs(executerProgramme, verifierAvecTests);
