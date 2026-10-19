import fs from 'node:fs/promises';
import path from 'node:path';
import { analyserBilan, creerAteliers, creerVerificateurs, DELAI_EXECUTION, lancer, problemeExecution, retirerBilan } from './processus.js';

const DELAI_COMPILATION = 30_000;
const FICHIER_SOURCE = 'programme.c';
const FICHIER_AMORCE = 'amorce.h';
const NOM_BINAIRE = process.platform === 'win32' ? 'programme.exe' : 'programme';
const OPTIONS_GCC = ['-std=c17', '-Wall', '-Wextra', '-Wno-unused-parameter', '-O0', '-fdiagnostics-color=always'];

const AMORCE = `#include <stdio.h>
__attribute__((constructor)) static void amorce_sortie_immediate(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
}
`;

const SUIVI_MEMOIRE = `#include <stdlib.h>
static long verification_blocs = 0;
__attribute__((unused)) static void *verification_malloc(size_t taille) {
    void *bloc = malloc(taille);
    if (bloc) verification_blocs++;
    return bloc;
}
__attribute__((unused)) static void *verification_calloc(size_t nombre, size_t taille) {
    void *bloc = calloc(nombre, taille);
    if (bloc) verification_blocs++;
    return bloc;
}
__attribute__((unused)) static void verification_free(void *bloc) {
    if (bloc) verification_blocs--;
    free(bloc);
}
#define malloc(taille) verification_malloc(taille)
#define calloc(nombre, taille) verification_calloc(nombre, taille)
#define free(bloc) verification_free(bloc)
`;

const PRELUDE_TESTS = `#include <stdio.h>
static int verification_reussis = 0;
static int verification_echoues = 0;
#define VERIFIER(condition, message) \\
    do { \\
        if (condition) { \\
            verification_reussis++; \\
            printf("\\u2713 %s\\n", message); \\
        } else { \\
            verification_echoues++; \\
            printf("\\u2717 %s (tests.c, ligne %d)\\n", message, __LINE__); \\
        } \\
    } while (0)
#define VERIFIER_SANS_FUITE() VERIFIER(verification_blocs == 0, "toute la mémoire allouée a été libérée (autant de free que de malloc)")
#define BILAN() (printf("RESULTAT %d %d\\n", verification_reussis, verification_echoues), verification_echoues == 0 ? 0 : 1)
`;

const PLANTAGES = [
  { codes: [3221225477], signaux: ['SIGSEGV'], texte: 'Erreur de segmentation : le programme a lu ou écrit dans une zone mémoire interdite (pointeur NULL, non initialisé ou déjà libéré ?).' },
  { codes: [3221225725], signaux: [], texte: 'Débordement de la pile : une récursion qui ne s’arrête jamais ?' },
  { codes: [3221225620], signaux: ['SIGFPE'], texte: 'Division entière par zéro.' },
  { codes: [3221226356, 3221226505], signaux: ['SIGBUS'], texte: 'Mémoire corrompue : écriture en dehors d’un tableau, ou double free ?' },
  { codes: [3], signaux: ['SIGABRT'], texte: 'Le programme s’est arrêté avec abort() (un assert a échoué ?).' },
];

export function assemblerCodeTest(code, tests) {
  return [
    SUIVI_MEMOIRE,
    '#define main main_eleve',
    '#line 1 "exercice.c"',
    code.trimEnd(),
    '#undef main',
    '#line 1 "verification.c"',
    PRELUDE_TESTS,
    '#line 1 "tests.c"',
    tests.trim(),
    '',
  ].join('\n');
}

export function expliquerPlantage(execution) {
  const plantage = PLANTAGES.find(
    ({ codes, signaux }) => codes.includes(execution.code) || (execution.signal && signaux.includes(execution.signal)),
  );
  return plantage?.texte ?? null;
}

let outils = null;

export function outilsC() {
  outils ??= lancer('gcc', ['--version'], { delai: 15_000 }).then((gcc) => ({
    gcc: gcc.code === 0 ? gcc.stdout.split('\n')[0].trim() : null,
  }));
  return outils;
}

const avecAtelier = creerAteliers('gcc', (dossier) => fs.writeFile(path.join(dossier, FICHIER_AMORCE), AMORCE, 'utf8'));

async function compiler(dossier, source) {
  await fs.writeFile(path.join(dossier, FICHIER_SOURCE), source, 'utf8');
  await fs.rm(path.join(dossier, NOM_BINAIRE), { force: true });
  const compilation = await lancer(
    'gcc',
    [...OPTIONS_GCC, '-include', FICHIER_AMORCE, '-o', NOM_BINAIRE, FICHIER_SOURCE, '-lm'],
    { delai: DELAI_COMPILATION, dossier },
  );
  if (compilation.introuvable) {
    return {
      probleme: {
        statut: 'outil_introuvable',
        sortie: 'La commande « gcc » est introuvable. Sous Windows : « scoop install gcc » (ou MSYS2), puis relance le site dans un nouveau terminal.',
      },
    };
  }
  if (compilation.delaiDepasse) return { probleme: { statut: 'delai_depasse', sortie: 'La compilation a pris trop de temps.' } };
  if (compilation.code !== 0) return { probleme: { statut: 'erreur_compilation', sortie: compilation.stderr } };
  return { executable: path.join(dossier, NOM_BINAIRE), avertissements: compilation.stderr };
}

function sortieAvecPlantage(execution) {
  const explication = expliquerPlantage(execution);
  return `${execution.stdout}${execution.stderr}${explication ? `\n${explication}` : ''}`;
}

export function executerProgramme(code, entree = '') {
  return avecAtelier(async (dossier) => {
    const { probleme, executable, avertissements } = await compiler(dossier, code);
    if (probleme) return probleme;

    const execution = await lancer(executable, [], { delai: DELAI_EXECUTION, dossier, entree });
    const blocage = problemeExecution(execution);
    if (blocage) return { ...blocage, avertissements };

    return {
      statut: execution.code === 0 ? 'execute' : 'erreur_execution',
      sortie: execution.code === 0 ? `${execution.stdout}${execution.stderr}` : sortieAvecPlantage(execution),
      avertissements,
    };
  });
}

export function verifierAvecTests(code, tests) {
  return avecAtelier(async (dossier) => {
    const { probleme, executable, avertissements } = await compiler(dossier, assemblerCodeTest(code, tests));
    if (probleme) return probleme;

    const execution = await lancer(executable, [], { delai: DELAI_EXECUTION, dossier });
    const blocage = problemeExecution(execution);
    if (blocage) return { ...blocage, avertissements };

    const resume = analyserBilan(execution.stdout);
    const reussi = execution.code === 0 && resume !== null && resume.echoues === 0;
    const explication = resume === null ? expliquerPlantage(execution) : null;
    return {
      statut: reussi ? 'reussi' : 'echec',
      sortie: `${retirerBilan(execution.stdout)}\n${execution.stderr}${explication ? `\n${explication}` : ''}`.trim(),
      avertissements,
      resume,
    };
  });
}

export const { verifierSortie, verifierExercice } = creerVerificateurs(executerProgramme, verifierAvecTests);
