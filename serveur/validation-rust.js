const TYPES = ['tests', 'sortie'];
const SOURCES = ['cours', 'fondamentaux'];
const DIFFICULTES = [1, 2, 3];

function texteRempli(valeur) {
  return typeof valeur === 'string' && valeur.trim() !== '';
}

export function validerMetaChapitre(meta) {
  if (!meta) return ['chapitre.json manquant'];
  const problemes = [];
  if (!texteRempli(meta.titre)) problemes.push('chapitre.json : « titre » manquant');
  if (!SOURCES.includes(meta.source)) problemes.push(`chapitre.json : « source » doit valoir ${SOURCES.join(' ou ')}`);
  return problemes;
}

export function validerQuiz(quiz) {
  if (!Array.isArray(quiz)) return ['quiz.json doit contenir une liste de questions'];
  const problemes = [];
  quiz.forEach((question, index) => {
    const prefixe = `quiz.json, question ${index + 1}`;
    if (!texteRempli(question.question)) problemes.push(`${prefixe} : « question » manquant`);
    if (!Array.isArray(question.choix) || question.choix.length < 2) {
      problemes.push(`${prefixe} : il faut au moins 2 « choix »`);
    } else if (!Number.isInteger(question.reponse) || question.reponse < 0 || question.reponse >= question.choix.length) {
      problemes.push(`${prefixe} : « reponse » doit être un indice entre 0 et ${question.choix.length - 1}`);
    }
    if (!texteRempli(question.explication)) problemes.push(`${prefixe} : « explication » manquante`);
  });
  return problemes;
}

export function validerExercice(exercice) {
  const problemes = [];
  if (!texteRempli(exercice.titre)) problemes.push('exercice.json : « titre » manquant');
  if (!TYPES.includes(exercice.type)) problemes.push(`exercice.json : « type » doit valoir ${TYPES.join(' ou ')}`);
  if (!DIFFICULTES.includes(exercice.difficulte)) problemes.push('exercice.json : « difficulte » doit valoir 1, 2 ou 3');
  if (!Array.isArray(exercice.indices)) problemes.push('exercice.json : « indices » doit être une liste');
  if (!texteRempli(exercice.enonce)) problemes.push('enonce.md manquant ou vide');

  for (const [nom, code] of [['depart.rs', exercice.depart], ['solution.rs', exercice.solution]]) {
    if (!texteRempli(code)) problemes.push(`${nom} manquant`);
    else if (!/\bfn\s+main\s*\(/.test(code)) problemes.push(`${nom} : il faut une fonction main`);
  }

  if (exercice.type === 'tests' && !texteRempli(exercice.tests)) problemes.push('tests.rs manquant');
  if (exercice.type === 'sortie' && !texteRempli(exercice.sortieAttendue)) problemes.push('sortie.txt manquant');
  return problemes;
}
