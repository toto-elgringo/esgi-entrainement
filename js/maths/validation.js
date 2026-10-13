import { TYPES_QUESTION, valeurNumerique, verifierQuestion } from './verification.js';

const FORMAT_ID = /^[a-z0-9][a-z0-9-]*$/;
const DIFFICULTES = [1, 2, 3];

function texteRempli(valeur) {
  return typeof valeur === 'string' && valeur.trim() !== '';
}

export function idValide(id) {
  return typeof id === 'string' && FORMAT_ID.test(id);
}

export function dollarsEquilibres(texte) {
  const sansCode = String(texte).replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '').replace(/\\\$/g, '');
  return (sansCode.match(/\$/g) ?? []).length % 2 === 0;
}

export function latexSain(texte) {
  const chaine = String(texte);
  if (/[\t\b\f\r]/.test(chaine)) return false;
  const sansBlocs = chaine.replace(/\\\$/g, '').replace(/\$\$[\s\S]*?\$\$/g, '');
  return sansBlocs.split('$').every((morceau, index) => index % 2 === 0 || !morceau.includes('\n'));
}

function textesCorrects(textes) {
  return textes.every((texte) => dollarsEquilibres(texte) && latexSain(texte));
}

export function validerProgramme(programme) {
  const problemes = [];
  if (!Array.isArray(programme?.matieres) || programme.matieres.length === 0) problemes.push('programme.json : « matieres » manquant');
  else {
    programme.matieres.forEach((matiere, index) => {
      if (!idValide(matiere.id) || !texteRempli(matiere.titre)) problemes.push(`programme.json : matière ${index + 1} mal formée`);
    });
  }
  if (!Array.isArray(programme?.chapitres) || programme.chapitres.length === 0) problemes.push('programme.json : « chapitres » manquant');
  else {
    if (!programme.chapitres.every(idValide)) problemes.push('programme.json : identifiant de chapitre invalide');
    if (new Set(programme.chapitres).size !== programme.chapitres.length) problemes.push('programme.json : chapitre en double');
  }
  return problemes;
}

export function validerChapitre(meta, idsMatieres) {
  if (!meta) return ['chapitre.json manquant'];
  const problemes = [];
  if (!texteRempli(meta.titre)) problemes.push('chapitre.json : « titre » manquant');
  if (!Array.isArray(meta.matieres) || meta.matieres.length === 0) problemes.push('chapitre.json : « matieres » manquant');
  else if (!meta.matieres.every((id) => idsMatieres.includes(id))) problemes.push(`chapitre.json : matière inconnue (connues : ${idsMatieres.join(', ')})`);
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
    const textes = [question.question, question.explication, ...(question.choix ?? [])];
    if (!textesCorrects(textes)) problemes.push(`${prefixe} : formule cassée (« $ » non fermé ou « \\ » non doublé dans le JSON)`);
  });
  return problemes;
}

export function ecritureDeReference(question) {
  if (question.type === 'ensemble') return `{${question.reponse.join(', ')}}`;
  if (question.type === 'vecteur') return `(${question.reponse.join(', ')})`;
  if (question.type === 'texte') return question.reponse[0];
  return String(question.reponse);
}

function validerFormeReponse(question) {
  switch (question.type) {
    case 'nombre':
      try {
        return Number.isFinite(valeurNumerique(question.reponse)) ? [] : ['« reponse » n\'est pas un nombre fini'];
      } catch (erreur) {
        return [`« reponse » illisible : ${erreur.message}`];
      }
    case 'expression':
      return texteRempli(question.reponse) ? [] : ['« reponse » doit être une expression (texte)'];
    case 'ensemble':
      return Array.isArray(question.reponse) ? [] : ['« reponse » doit être une liste'];
    case 'vecteur':
      return Array.isArray(question.reponse) && question.reponse.length > 0 ? [] : ['« reponse » doit être une liste non vide'];
    case 'choix':
      if (!Array.isArray(question.choix) || question.choix.length < 2) return ['il faut au moins 2 « choix »'];
      return Number.isInteger(question.reponse) && question.reponse >= 0 && question.reponse < question.choix.length
        ? []
        : ['« reponse » doit être un indice de « choix »'];
    case 'texte':
      return Array.isArray(question.reponse) && question.reponse.length > 0 && question.reponse.every(texteRempli)
        ? []
        : ['« reponse » doit être une liste de textes acceptés'];
    case 'auto':
      return texteRempli(question.reponse) ? [] : ['« reponse » doit contenir la réponse modèle'];
    default:
      return [`« type » doit valoir ${TYPES_QUESTION.join(', ')}`];
  }
}

function validerQuestion(question, prefixe) {
  const problemes = validerFormeReponse(question).map((probleme) => `${prefixe} : ${probleme}`);
  if (problemes.length > 0 || question.type === 'auto') return problemes;

  const reference = verifierQuestion(question, ecritureDeReference(question));
  if (reference.juste !== true) problemes.push(`${prefixe} : la réponse de référence n'est pas acceptée (${reference.erreur ?? 'refusée'})`);

  for (const saisie of question.acceptes ?? []) {
    const resultat = verifierQuestion(question, saisie);
    if (resultat.juste !== true) problemes.push(`${prefixe} : « ${saisie} » devrait être accepté${resultat.erreur ? ` (${resultat.erreur})` : ''}`);
  }
  for (const saisie of question.refuses ?? []) {
    if (verifierQuestion(question, saisie).juste !== false) problemes.push(`${prefixe} : « ${saisie} » devrait être refusé`);
  }
  return problemes;
}

export function validerExercices(exercices) {
  if (!Array.isArray(exercices)) return ['exercices.json doit contenir une liste'];
  const problemes = [];
  const ids = new Set();

  exercices.forEach((exercice, index) => {
    const nom = idValide(exercice.id) ? exercice.id : `exercice ${index + 1}`;
    if (!idValide(exercice.id)) problemes.push(`${nom} : « id » invalide (minuscules, chiffres, tirets)`);
    else if (ids.has(exercice.id)) problemes.push(`${nom} : « id » en double`);
    ids.add(exercice.id);

    if (!texteRempli(exercice.titre)) problemes.push(`${nom} : « titre » manquant`);
    if (!DIFFICULTES.includes(exercice.difficulte)) problemes.push(`${nom} : « difficulte » doit valoir 1, 2 ou 3`);
    if (!texteRempli(exercice.enonce)) problemes.push(`${nom} : « enonce » manquant`);
    if (!texteRempli(exercice.correction)) problemes.push(`${nom} : « correction » manquante`);
    if (exercice.indices !== undefined && !Array.isArray(exercice.indices)) problemes.push(`${nom} : « indices » doit être une liste`);

    const textes = [exercice.enonce, exercice.correction, ...(exercice.indices ?? [])];
    if (!Array.isArray(exercice.questions) || exercice.questions.length === 0) {
      problemes.push(`${nom} : il faut au moins une question`);
    } else {
      exercice.questions.forEach((question, position) => {
        problemes.push(...validerQuestion(question, `${nom}, question ${position + 1}`));
        textes.push(question.intitule ?? '', ...(question.choix ?? []), question.type === 'auto' ? question.reponse : '');
      });
    }
    if (!textesCorrects(textes)) problemes.push(`${nom} : formule cassée (« $ » non fermé ou « \\ » non doublé dans le JSON)`);
  });
  return problemes;
}
