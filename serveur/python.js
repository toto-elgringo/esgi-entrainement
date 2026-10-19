import fs from 'node:fs/promises';
import path from 'node:path';
import { analyserBilan, creerAteliers, creerVerificateurs, DELAI_EXECUTION, lancer, problemeExecution, retirerBilan } from './processus.js';

const VERSION_MINIMALE = 8;
const OPTIONS_PYTHON = ['-X', 'utf8', '-B'];
const FICHIER_CODE = 'exercice.py';
const FICHIER_VERIFICATION = 'verification.py';

const VERIFICATION_SYNTAXE = `import sys, traceback
with open(${JSON.stringify(FICHIER_CODE)}, encoding="utf-8") as fichier:
    source = fichier.read()
try:
    compile(source, ${JSON.stringify(FICHIER_CODE)}, "exec")
except (SyntaxError, ValueError) as erreur:
    print("".join(traceback.format_exception_only(type(erreur), erreur)), end="", file=sys.stderr)
    sys.exit(1)
`;

const LANCEUR_TESTS = `

def _lieu(erreur):
    for cadre in reversed(_traceback.extract_tb(erreur.__traceback__)):
        if cadre.filename.endswith(${JSON.stringify(FICHIER_CODE)}):
            return f" (${FICHIER_CODE}, ligne {cadre.lineno})"
    return ""


def _executer_tests():
    reussis = 0
    echoues = 0
    for nom, test in list(globals().items()):
        if not nom.startswith("test_") or not callable(test):
            continue
        try:
            test()
        except AssertionError as erreur:
            echoues += 1
            ligne = _traceback.extract_tb(erreur.__traceback__)[-1].line
            print(f"✗ {nom} : {erreur or 'échec de « ' + str(ligne) + ' »'}")
        except Exception as erreur:
            echoues += 1
            print(f"✗ {nom} : {type(erreur).__name__} : {erreur}{_lieu(erreur)}")
        else:
            reussis += 1
            print(f"✓ {nom}")
    print(f"RESULTAT {reussis} {echoues}")


_executer_tests()
`;

export function assemblerVerification(tests) {
  return `import sys as _sys
import traceback as _traceback

try:
    from exercice import *
except BaseException:
    print("Ton code plante dès son chargement, avant les tests :", file=_sys.stderr)
    _traceback.print_exc()
    _sys.exit(2)

${tests.trim()}
${LANCEUR_TESTS}`;
}

export function versionPython(texte) {
  const resultat = /Python 3\.(\d+)/.exec(texte);
  return resultat && Number(resultat[1]) >= VERSION_MINIMALE ? texte.trim() : null;
}

function candidats() {
  return process.platform === 'win32'
    ? [['python'], ['py', '-3'], ['python3']]
    : [['python3'], ['python']];
}

let detection = null;

async function detecterPython() {
  for (const [commande, ...prefixe] of candidats()) {
    const essai = await lancer(commande, [...prefixe, '--version'], { delai: 15_000 });
    const version = essai.code === 0 ? versionPython(`${essai.stdout}${essai.stderr}`) : null;
    if (version) return { commande, prefixe, version };
  }
  return null;
}

export async function outilsPython() {
  detection ??= detecterPython();
  const trouve = await detection;
  return { python: trouve?.version ?? null };
}

const avecAtelier = creerAteliers('python');

function nettoyerChemins(texte, dossier) {
  return texte.split(`${dossier}${path.sep}`).join('');
}

async function python(dossier, args, entree = '') {
  const trouve = await detection;
  if (!trouve) return null;
  const execution = await lancer(trouve.commande, [...trouve.prefixe, ...OPTIONS_PYTHON, ...args], {
    delai: DELAI_EXECUTION,
    dossier,
    entree,
  });
  return { ...execution, stdout: nettoyerChemins(execution.stdout, dossier), stderr: nettoyerChemins(execution.stderr, dossier) };
}

const INTROUVABLE = {
  statut: 'outil_introuvable',
  sortie: 'Python 3 est introuvable. Installe-le depuis https://www.python.org (coche « Add python.exe to PATH »), puis relance le site.',
};

async function viderDossier(dossier) {
  const entrees = await fs.readdir(dossier);
  await Promise.all(entrees.map((nom) => fs.rm(path.join(dossier, nom), { recursive: true, force: true, maxRetries: 3 })));
}

async function preparer(dossier, code) {
  await outilsPython();
  await viderDossier(dossier);
  await fs.writeFile(path.join(dossier, FICHIER_CODE), code, 'utf8');
  const syntaxe = await python(dossier, ['-c', VERIFICATION_SYNTAXE]);
  if (!syntaxe) return INTROUVABLE;
  if (syntaxe.code !== 0) return { statut: 'erreur_compilation', sortie: syntaxe.stderr };
  return null;
}

export function executerProgramme(code, entree = '') {
  return avecAtelier(async (dossier) => {
    const probleme = await preparer(dossier, code);
    if (probleme) return probleme;

    const execution = await python(dossier, [FICHIER_CODE], entree);
    const blocage = problemeExecution(execution);
    if (blocage) return blocage;
    return {
      statut: execution.code === 0 ? 'execute' : 'erreur_execution',
      sortie: `${execution.stdout}${execution.stderr}`,
    };
  });
}

export function verifierAvecTests(code, tests) {
  return avecAtelier(async (dossier) => {
    const probleme = await preparer(dossier, code);
    if (probleme) return probleme;

    await fs.writeFile(path.join(dossier, FICHIER_VERIFICATION), assemblerVerification(tests), 'utf8');
    const execution = await python(dossier, [FICHIER_VERIFICATION]);
    const blocage = problemeExecution(execution);
    if (blocage) return blocage;

    const resume = analyserBilan(execution.stdout);
    const reussi = execution.code === 0 && resume !== null && resume.echoues === 0;
    return {
      statut: reussi ? 'reussi' : 'echec',
      sortie: `${retirerBilan(execution.stdout)}\n${execution.stderr}`.trim(),
      resume,
    };
  });
}

export const { verifierSortie, verifierExercice } = creerVerificateurs(executerProgramme, verifierAvecTests);
