import { validerQuiz as validerQuizCommun } from '../js/maths/validation.js';
import { validerSupports } from '../js/supports.js';
import { fichiersExercice } from './contenu-code.js';

const TYPES = ['tests', 'sortie'];
const SOURCES = ['cours', 'fondamentaux'];
const DIFFICULTES = [1, 2, 3];
const FONCTION_MAIN = {
  rust: /\bfn\s+main\s*\(/,
  c: /\bint\s+main\s*\(/,
};

function texteRempli(valeur) {
  return typeof valeur === 'string' && valeur.trim() !== '';
}

export function validerMetaChapitre(meta) {
  if (!meta) return ['chapitre.json manquant'];
  const problemes = [];
  if (!texteRempli(meta.titre)) problemes.push('chapitre.json : « titre » manquant');
  if (!SOURCES.includes(meta.source)) problemes.push(`chapitre.json : « source » doit valoir ${SOURCES.join(' ou ')}`);
  problemes.push(...validerSupports(meta.supports));
  return problemes;
}

export function validerQuiz(quiz) {
  return validerQuizCommun(quiz, { formules: false });
}

export function validerExercice(exercice, langage) {
  const fichiers = fichiersExercice(langage);
  const fonctionMain = FONCTION_MAIN[langage];
  const problemes = [];
  if (!texteRempli(exercice.titre)) problemes.push('exercice.json : « titre » manquant');
  if (!TYPES.includes(exercice.type)) problemes.push(`exercice.json : « type » doit valoir ${TYPES.join(' ou ')}`);
  if (!DIFFICULTES.includes(exercice.difficulte)) problemes.push('exercice.json : « difficulte » doit valoir 1, 2 ou 3');
  if (!Array.isArray(exercice.indices)) problemes.push('exercice.json : « indices » doit être une liste');
  if (!texteRempli(exercice.enonce)) problemes.push('enonce.md manquant ou vide');

  for (const [nom, code] of [[fichiers.depart, exercice.depart], [fichiers.solution, exercice.solution]]) {
    if (!texteRempli(code)) problemes.push(`${nom} manquant`);
    else if (fonctionMain && !fonctionMain.test(code)) problemes.push(`${nom} : il faut une fonction main`);
  }

  if (exercice.type === 'tests' && !texteRempli(exercice.tests)) problemes.push(`${fichiers.tests} manquant`);
  if (exercice.type === 'sortie' && !texteRempli(exercice.sortieAttendue)) problemes.push('sortie.txt manquant');
  return problemes;
}
