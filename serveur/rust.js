import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const DELAI_COMPILATION = 90_000;
const DELAI_EXECUTION = 10_000;
const TAILLE_MAX_SORTIE = 2 * 1024 * 1024;
const NOM_BINAIRE = process.platform === 'win32' ? 'main.exe' : 'main';
const OPTIONS_RUSTC = ['--edition', '2024', '--color', 'never', '-A', 'dead_code'];

export function assemblerCodeTest(code, tests) {
  return `${code.trimEnd()}\n\n${tests.trim()}\n`;
}

export function analyserResultatTests(sortie) {
  const resultat = /test result: \w+\. (\d+) passed; (\d+) failed/.exec(sortie);
  if (!resultat) return null;
  return { reussis: Number(resultat[1]), echoues: Number(resultat[2]) };
}

export function normaliserSortie(texte) {
  return texte
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((ligne) => ligne.trimEnd())
    .join('\n')
    .trim();
}

function lancer(commande, args, { delai, dossier }) {
  return new Promise((resoudre) => {
    const processus = execFile(
      commande,
      args,
      {
        cwd: dossier,
        timeout: delai,
        maxBuffer: TAILLE_MAX_SORTIE,
        windowsHide: true,
        env: { ...process.env, RUST_BACKTRACE: '0' },
      },
      (erreur, stdout, stderr) => {
        resoudre({
          code: erreur ? (typeof erreur.code === 'number' ? erreur.code : -1) : 0,
          introuvable: erreur?.code === 'ENOENT',
          delaiDepasse: Boolean(erreur?.killed),
          sortieTropLongue: erreur?.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER',
          stdout,
          stderr,
        });
      },
    );
    processus.stdin?.end();
  });
}

async function avecDossierTemporaire(action) {
  const dossier = await fs.mkdtemp(path.join(os.tmpdir(), 'rust-entrainement-'));
  try {
    return await action(dossier);
  } finally {
    await fs.rm(dossier, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
  }
}

async function compiler(dossier, code, { test }) {
  await fs.writeFile(path.join(dossier, 'main.rs'), code, 'utf8');
  const args = [...OPTIONS_RUSTC, '-o', NOM_BINAIRE, 'main.rs'];
  if (test) args.unshift('--test');
  return lancer('rustc', args, { delai: DELAI_COMPILATION, dossier });
}

function executerBinaire(dossier, args = []) {
  return lancer(path.join(dossier, NOM_BINAIRE), args, { delai: DELAI_EXECUTION, dossier });
}

function problemeCompilation(compilation) {
  if (compilation.introuvable) {
    return { statut: 'rust_introuvable', sortie: 'La commande « rustc » est introuvable. Installe Rust avec rustup (https://rustup.rs).' };
  }
  if (compilation.delaiDepasse) {
    return { statut: 'delai_depasse', sortie: 'La compilation a pris trop de temps.' };
  }
  if (compilation.code !== 0) {
    return { statut: 'erreur_compilation', sortie: compilation.stderr };
  }
  return null;
}

function problemeExecution(execution) {
  if (execution.delaiDepasse) {
    return {
      statut: 'delai_depasse',
      sortie: `${execution.stdout}\nLe programme a dépassé ${DELAI_EXECUTION / 1000} secondes : boucle infinie ?`.trim(),
    };
  }
  if (execution.sortieTropLongue) {
    return { statut: 'erreur_execution', sortie: 'Le programme affiche beaucoup trop de texte : boucle infinie ?' };
  }
  return null;
}

export async function versionRust() {
  const resultat = await lancer('rustc', ['--version'], { delai: 15_000 });
  return resultat.code === 0 ? resultat.stdout.trim() : null;
}

export function executerProgramme(code) {
  return avecDossierTemporaire(async (dossier) => {
    const compilation = await compiler(dossier, code, { test: false });
    const probleme = problemeCompilation(compilation);
    if (probleme) return probleme;

    const execution = await executerBinaire(dossier);
    const blocage = problemeExecution(execution);
    if (blocage) return { ...blocage, avertissements: compilation.stderr };

    return {
      statut: execution.code === 0 ? 'execute' : 'erreur_execution',
      sortie: `${execution.stdout}${execution.stderr}`,
      avertissements: compilation.stderr,
    };
  });
}

export function verifierAvecTests(code, tests) {
  return avecDossierTemporaire(async (dossier) => {
    const compilation = await compiler(dossier, assemblerCodeTest(code, tests), { test: true });
    const probleme = problemeCompilation(compilation);
    if (probleme) return probleme;

    const execution = await executerBinaire(dossier, ['--test-threads=1']);
    const blocage = problemeExecution(execution);
    if (blocage) return { ...blocage, avertissements: compilation.stderr };

    const resume = analyserResultatTests(execution.stdout);
    const reussi = execution.code === 0 && resume !== null && resume.echoues === 0;
    return {
      statut: reussi ? 'reussi' : 'echec',
      sortie: `${execution.stdout}${execution.stderr}`,
      avertissements: compilation.stderr,
      resume,
    };
  });
}

export async function verifierSortie(code, sortieAttendue) {
  const resultat = await executerProgramme(code);
  if (resultat.statut !== 'execute') {
    return resultat.statut === 'erreur_execution' ? { ...resultat, statut: 'echec' } : resultat;
  }
  const identique = normaliserSortie(resultat.sortie) === normaliserSortie(sortieAttendue);
  return { ...resultat, statut: identique ? 'reussi' : 'echec', attendu: sortieAttendue };
}

export function verifierExercice(exercice, code) {
  return exercice.type === 'sortie'
    ? verifierSortie(code, exercice.sortieAttendue ?? '')
    : verifierAvecTests(code, exercice.tests ?? '');
}
