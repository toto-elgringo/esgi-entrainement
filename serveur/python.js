import fs from 'node:fs/promises';
import path from 'node:path';
import { analyserBilan, creerAteliers, creerVerificateurs, DELAI_EXECUTION, extraireTests, lancer, problemeExecution, retirerBilan } from './processus.js';

const VERSION_MINIMALE = 8;
const OPTIONS_PYTHON = ['-X', 'utf8', '-B'];
const FICHIER_CODE = 'exercice.py';
const FICHIER_VERIFICATION = 'verification.py';
const FICHIER_TESTS = 'tests.py';

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
_dernier = {}


def _comparer(gauche, droite, texte_gauche, texte_droite):
    _dernier.clear()
    _dernier.update(genre="egalite", gauche=gauche, droite=droite, texte_gauche=texte_gauche, texte_droite=texte_droite)
    return gauche == droite


def _condition(valeur, texte):
    _dernier.clear()
    _dernier.update(genre="condition", texte=texte)
    return valeur


class _Transformateur(_ast.NodeTransformer):
    def __init__(self, source):
        self.source = source

    def _appel(self, nom, arguments, modele):
        return _ast.copy_location(_ast.Call(func=_ast.Name(id=nom, ctx=_ast.Load()), args=arguments, keywords=[]), modele)

    def visit_Assert(self, noeud):
        self.generic_visit(noeud)
        test = noeud.test
        if isinstance(test, _ast.Compare) and len(test.ops) == 1 and isinstance(test.ops[0], _ast.Eq):
            gauche, droite = test.left, test.comparators[0]
            textes = [_ast.Constant(value=_ast.get_source_segment(self.source, cote) or "") for cote in (gauche, droite)]
            noeud.test = self._appel("_comparer", [gauche, droite, *textes], test)
        else:
            texte = _ast.get_source_segment(self.source, test) or ""
            noeud.test = self._appel("_condition", [test, _ast.Constant(value=texte)], test)
        return noeud


def _litteral(texte):
    try:
        _ast.literal_eval(texte)
        return True
    except Exception:
        return False


def _court(valeur):
    texte = repr(valeur)
    return texte if len(texte) <= 400 else texte[:400] + "…"


def _decrire_assertion(erreur):
    dernier = erreur.__traceback__
    while dernier.tb_next:
        dernier = dernier.tb_next
    if not dernier.tb_frame.f_code.co_filename.endswith(${JSON.stringify(FICHIER_TESTS)}) or not _dernier:
        return {}
    if _dernier["genre"] == "condition":
        return {"condition": _dernier["texte"]}
    gauche, droite = _dernier["gauche"], _dernier["droite"]
    texte_gauche, texte_droite = _dernier["texte_gauche"], _dernier["texte_droite"]
    if _litteral(texte_gauche) and not _litteral(texte_droite):
        gauche, droite = droite, gauche
        texte_gauche = texte_droite
    try:
        return {"appel": texte_gauche, "obtenu": _court(gauche), "attendu": _court(droite)}
    except Exception:
        return {"condition": f"{texte_gauche} == {texte_droite}"}


def _lieu(erreur):
    for cadre in reversed(_traceback.extract_tb(erreur.__traceback__)):
        if cadre.filename.endswith(${JSON.stringify(FICHIER_CODE)}):
            return f" (${FICHIER_CODE}, ligne {cadre.lineno})"
    return ""


def _enregistrer(enregistrement):
    print("@TEST " + _json.dumps(enregistrement, ensure_ascii=False))


def _charger_tests():
    with open(${JSON.stringify(FICHIER_TESTS)}, encoding="utf-8") as fichier:
        source = fichier.read()
    arbre = _Transformateur(source).visit(_ast.parse(source, ${JSON.stringify(FICHIER_TESTS)}))
    _ast.fix_missing_locations(arbre)
    exec(compile(arbre, ${JSON.stringify(FICHIER_TESTS)}, "exec"), globals())


def _executer_tests():
    _charger_tests()
    reussis = 0
    echoues = 0
    for nom, test in list(globals().items()):
        if not nom.startswith("test_") or not callable(test):
            continue
        court = nom[len("test_"):]
        _dernier.clear()
        try:
            test()
        except AssertionError as erreur:
            echoues += 1
            ligne = _traceback.extract_tb(erreur.__traceback__)[-1].line
            print(f"✗ {nom} : {str(erreur) or 'échec de « ' + str(ligne) + ' »'}")
            _enregistrer({"nom": court, "reussi": False, "indice": str(erreur), **_decrire_assertion(erreur)})
        except Exception as erreur:
            echoues += 1
            description = f"{type(erreur).__name__} : {erreur}{_lieu(erreur)}"
            print(f"✗ {nom} : {description}")
            _enregistrer({"nom": court, "reussi": False, "erreur": description})
        else:
            reussis += 1
            print(f"✓ {nom}")
            _enregistrer({"nom": court, "reussi": True})
    print(f"RESULTAT {reussis} {echoues}")


_executer_tests()
`;

export function assemblerVerification() {
  return `import sys as _sys
import ast as _ast
import json as _json
import traceback as _traceback

try:
    from exercice import *
except BaseException:
    print("Ton code plante dès son chargement, avant les tests :", file=_sys.stderr)
    _traceback.print_exc()
    _sys.exit(2)
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

    await fs.writeFile(path.join(dossier, FICHIER_TESTS), `${tests.trim()}\n`, 'utf8');
    await fs.writeFile(path.join(dossier, FICHIER_VERIFICATION), assemblerVerification(), 'utf8');
    const execution = await python(dossier, [FICHIER_VERIFICATION]);
    const blocage = problemeExecution(execution);
    if (blocage) return blocage;

    const { sortie, tests: liste } = extraireTests(execution.stdout);
    const resume = analyserBilan(sortie);
    const reussi = execution.code === 0 && resume !== null && resume.echoues === 0;
    return {
      statut: reussi ? 'reussi' : 'echec',
      sortie: `${retirerBilan(sortie)}\n${execution.stderr}`.trim(),
      resume,
      tests: liste,
    };
  });
}

export const { verifierSortie, verifierExercice } = creerVerificateurs(executerProgramme, verifierAvecTests);
