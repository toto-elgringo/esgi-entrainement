import fs from 'node:fs/promises';
import path from 'node:path';
import { analyserBilan, creerAteliers, creerVerificateurs, DELAI_EXECUTION, extraireTests, lancer, problemeExecution, retirerBilan } from './processus.js';

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

const PRELUDE_TESTS = String.raw`#include <stdio.h>
#include <stdint.h>
#include <string.h>
#define VERIFICATION_OUTIL __attribute__((unused)) static
static int verification_reussis = 0;
static int verification_echoues = 0;
typedef struct {
    char genre;
    long long entier;
    unsigned long long positif;
    double reel;
    const void *adresse;
} verification_valeur;
VERIFICATION_OUTIL verification_valeur verification_de_entier(long long v) { verification_valeur r = {'e', v, 0, 0, NULL}; return r; }
VERIFICATION_OUTIL verification_valeur verification_de_positif(unsigned long long v) { verification_valeur r = {'u', 0, v, 0, NULL}; return r; }
VERIFICATION_OUTIL verification_valeur verification_de_reel(double v) { verification_valeur r = {'r', 0, 0, v, NULL}; return r; }
VERIFICATION_OUTIL verification_valeur verification_de_caractere(int v) { verification_valeur r = {'c', v, 0, 0, NULL}; return r; }
VERIFICATION_OUTIL verification_valeur verification_de_texte(const char *v) { verification_valeur r = {'t', 0, 0, 0, v}; return r; }
VERIFICATION_OUTIL verification_valeur verification_de_adresse(const void *v) { verification_valeur r = {'p', 0, 0, 0, v}; return r; }
#define VERIFICATION_VALEUR(x) _Generic((x), \
    char: verification_de_caractere, \
    signed char: verification_de_entier, short: verification_de_entier, int: verification_de_entier, \
    long: verification_de_entier, long long: verification_de_entier, \
    unsigned char: verification_de_positif, unsigned short: verification_de_positif, unsigned int: verification_de_positif, \
    unsigned long: verification_de_positif, unsigned long long: verification_de_positif, _Bool: verification_de_positif, \
    float: verification_de_reel, double: verification_de_reel, long double: verification_de_reel, \
    char *: verification_de_texte, const char *: verification_de_texte, \
    default: verification_de_adresse)(x)
VERIFICATION_OUTIL double verification_reel(verification_valeur v) {
    if (v.genre == 'r') return v.reel;
    if (v.genre == 'u') return (double)v.positif;
    return (double)v.entier;
}
VERIFICATION_OUTIL unsigned long long verification_non_signe(verification_valeur v) {
    return v.genre == 'u' ? v.positif : (unsigned long long)v.entier;
}
VERIFICATION_OUTIL const void *verification_adresse(verification_valeur v) {
    if (v.genre == 't' || v.genre == 'p') return v.adresse;
    return (const void *)(uintptr_t)verification_non_signe(v);
}
VERIFICATION_OUTIL int verification_egales(verification_valeur a, verification_valeur b) {
    if (a.genre == 't' && b.genre == 't') {
        if (a.adresse == NULL || b.adresse == NULL) return a.adresse == b.adresse;
        return strcmp(a.adresse, b.adresse) == 0;
    }
    if (a.genre == 'r' || b.genre == 'r') return verification_reel(a) == verification_reel(b);
    if (a.genre == 't' || a.genre == 'p' || b.genre == 't' || b.genre == 'p') return verification_adresse(a) == verification_adresse(b);
    return verification_non_signe(a) == verification_non_signe(b);
}
VERIFICATION_OUTIL void verification_echapper(char *tampon, size_t taille, const char *texte, size_t longueur, char guillemet) {
    size_t n = 0;
    size_t i = 0;
    tampon[n++] = guillemet;
    for (; i < longueur && n + 8 < taille; i++) {
        unsigned char c = (unsigned char)texte[i];
        char brut[8];
        const char *sequence = brut;
        if (c == '\n') sequence = "\\n";
        else if (c == '\t') sequence = "\\t";
        else if (c == '\r') sequence = "\\r";
        else if (c == '\\') sequence = "\\\\";
        else if (c == 0) sequence = "\\0";
        else if (c == (unsigned char)guillemet) snprintf(brut, sizeof brut, "\\%c", guillemet);
        else if (c < 32) snprintf(brut, sizeof brut, "\\x%02x", c);
        else snprintf(brut, sizeof brut, "%c", c);
        n += (size_t)snprintf(tampon + n, taille - n, "%s", sequence);
    }
    if (i < longueur) n += (size_t)snprintf(tampon + n, taille - n, "...");
    tampon[n++] = guillemet;
    tampon[n] = 0;
}
VERIFICATION_OUTIL void verification_formater(char *tampon, size_t taille, verification_valeur v) {
    char caractere;
    switch (v.genre) {
    case 'e': snprintf(tampon, taille, "%lld", v.entier); break;
    case 'u': snprintf(tampon, taille, "%llu", v.positif); break;
    case 'r':
        for (int precision = 6; precision <= 17; precision++) {
            snprintf(tampon, taille, "%.*g", precision, v.reel);
            if (strtod(tampon, NULL) == v.reel) break;
        }
        break;
    case 'c':
        caractere = (char)v.entier;
        verification_echapper(tampon, taille, &caractere, 1, '\'');
        break;
    case 't':
        if (v.adresse == NULL) snprintf(tampon, taille, "NULL");
        else verification_echapper(tampon, taille, v.adresse, strlen(v.adresse), '"');
        break;
    default:
        if (v.adresse == NULL) snprintf(tampon, taille, "NULL");
        else snprintf(tampon, taille, "%p", v.adresse);
    }
}
VERIFICATION_OUTIL void verification_champ(const char *nom, const char *texte) {
    char tampon[2048];
    size_t n = 0;
    for (; *texte && n + 8 < sizeof tampon; texte++) {
        unsigned char c = (unsigned char)*texte;
        if (c == '"' || c == '\\') { tampon[n++] = '\\'; tampon[n++] = (char)c; }
        else if (c == '\n') { tampon[n++] = '\\'; tampon[n++] = 'n'; }
        else if (c < 32) n += (size_t)snprintf(tampon + n, sizeof tampon - n, "\\u%04x", c);
        else tampon[n++] = (char)c;
    }
    tampon[n] = 0;
    printf(",\"%s\":\"%s\"", nom, tampon);
}
VERIFICATION_OUTIL void verification_noter(int reussi, const char *message, int ligne, const char *appel, const verification_valeur *obtenu, const verification_valeur *attendu, const char *condition) {
    char texte[512];
    if (reussi) {
        verification_reussis++;
        printf("✓ %s\n", message);
    } else {
        verification_echoues++;
        printf("✗ %s (tests.c, ligne %d)\n", message, ligne);
    }
    printf("@TEST {\"reussi\":%s", reussi ? "true" : "false");
    verification_champ("nom", message);
    if (!reussi && appel != NULL && obtenu != NULL && attendu != NULL) {
        verification_valeur a = *obtenu;
        verification_valeur b = *attendu;
        if (a.genre == 'c' && b.genre == 'e') b.genre = 'c';
        if (b.genre == 'c' && a.genre == 'e') a.genre = 'c';
        verification_champ("appel", appel);
        verification_formater(texte, sizeof texte, a);
        verification_champ("obtenu", texte);
        verification_formater(texte, sizeof texte, b);
        verification_champ("attendu", texte);
    }
    if (!reussi && condition != NULL) verification_champ("condition", condition);
    printf("}\n");
}
#define VERIFIER(condition, message) \
    verification_noter((condition) ? 1 : 0, message, __LINE__, NULL, NULL, NULL, #condition)
#define VERIFIER_EGAL(obtenu, attendu, message) \
    do { \
        verification_valeur verification_a = VERIFICATION_VALEUR(obtenu); \
        verification_valeur verification_b = VERIFICATION_VALEUR(attendu); \
        verification_noter(verification_egales(verification_a, verification_b), message, __LINE__, #obtenu, &verification_a, &verification_b, NULL); \
    } while (0)
#define VERIFIER_SANS_FUITE() \
    do { \
        verification_valeur verification_a = verification_de_entier(verification_blocs); \
        verification_valeur verification_b = verification_de_entier(0); \
        verification_noter(verification_blocs == 0, "toute la mémoire allouée a été libérée (autant de free que de malloc)", __LINE__, "blocs de mémoire jamais libérés", &verification_a, &verification_b, NULL); \
    } while (0)
#define BILAN() (printf("RESULTAT %d %d\n", verification_reussis, verification_echoues), verification_echoues == 0 ? 0 : 1)
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

    const { sortie, tests: liste } = extraireTests(execution.stdout);
    const resume = analyserBilan(sortie);
    const reussi = execution.code === 0 && resume !== null && resume.echoues === 0;
    const explication = resume === null ? expliquerPlantage(execution) : null;
    return {
      statut: reussi ? 'reussi' : 'echec',
      sortie: `${retirerBilan(sortie)}\n${execution.stderr}${explication ? `\n${explication}` : ''}`.trim(),
      avertissements,
      resume,
      tests: liste,
    };
  });
}

export const { verifierSortie, verifierExercice } = creerVerificateurs(executerProgramme, verifierAvecTests);
