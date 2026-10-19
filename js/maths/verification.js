import { analyser, ErreurExpression, evaluer } from './expression.js';

export const TYPES_QUESTION = ['nombre', 'expression', 'ensemble', 'vecteur', 'choix', 'texte', 'auto'];

const POINTS_REELS = [0.37, 0.81, 1.29, 1.93, 2.47, 3.61];
const POINTS_ENTIERS = [1, 2, 3, 4, 7, 10];
const TOLERANCE_NOMBRE = 1e-6;
const TOLERANCE_EXPRESSION = 1e-6;
const MINIMUM_POINTS = 3;

export function normaliserTexte(texte) {
  return String(texte)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[\s.!;]+$/, '')
    .trim();
}

function proches(obtenu, attendu, toleranceRelative) {
  return Math.abs(obtenu - attendu) <= toleranceRelative * Math.max(1, Math.abs(attendu));
}

export function valeurNumerique(valeur) {
  if (typeof valeur === 'number') return valeur;
  return evaluer(analyser(valeur, []));
}

export function variableDe(question) {
  return question.variable ?? 'x';
}

function pointsDe(question) {
  if (question.points) return question.points;
  return variableDe(question) === 'n' || variableDe(question) === 'k' ? POINTS_ENTIERS : POINTS_REELS;
}

function verifierNombre(question, saisie) {
  let lu;
  try {
    lu = analyser(saisie, []);
  } catch (erreur) {
    throw new ErreurExpression(`${erreur.message}. Ta réponse doit être un nombre (ex. : 12, 2.5, 1/3, ln(2), e^2).`);
  }
  const obtenu = evaluer(lu);
  const attendu = valeurNumerique(question.reponse);
  const tolerance = question.tolerance ?? TOLERANCE_NOMBRE;
  return { juste: Number.isFinite(obtenu) && Math.abs(obtenu - attendu) <= tolerance, lu };
}

function verifierExpression(question, saisie) {
  const variable = variableDe(question);
  const lu = analyser(saisie, [variable]);
  const reference = analyser(question.reponse, [variable]);
  const paires = [];
  for (const point of pointsDe(question)) {
    const attendu = evaluer(reference, { [variable]: point });
    if (Number.isFinite(attendu)) paires.push({ attendu, obtenu: evaluer(lu, { [variable]: point }) });
  }
  if (paires.length < MINIMUM_POINTS) throw new Error('Pas assez de points pour comparer les expressions');

  const base = question.aUneConstantePres ? paires[0] : { attendu: 0, obtenu: 0 };
  const juste = paires.every(({ attendu, obtenu }) =>
    Number.isFinite(obtenu) && proches(obtenu - base.obtenu, attendu - base.attendu, TOLERANCE_EXPRESSION),
  );
  return { juste, lu };
}

export function decouperListe(saisie) {
  const brut = String(saisie).trim();
  if (/^(∅|\{\s*\}|\(\s*\)|vide|ensemble vide)$/i.test(brut)) return [];
  const interieur = brut.replace(/^[{([]\s*/, '').replace(/\s*[})\]]$/, '');
  if (interieur === '') return [];
  const separateur = interieur.includes(';') ? ';' : ',';
  return interieur.split(separateur).map((element) => element.trim());
}

function normaliserElement(element) {
  const texte = normaliserTexte(element);
  try {
    const valeur = valeurNumerique(element);
    if (Number.isFinite(valeur)) return { texte, nombre: valeur };
  } catch {}
  return { texte };
}

function elementsEgaux(a, b) {
  if (a.texte === b.texte) return true;
  return 'nombre' in a && 'nombre' in b && proches(a.nombre, b.nombre, 1e-9);
}

function verifierEnsemble(question, saisie) {
  const obtenus = decouperListe(saisie).map(normaliserElement);
  if (obtenus.some((element) => element.texte === '')) throw new ErreurExpression('Un élément est vide : vérifie tes virgules');
  const attendus = question.reponse.map(normaliserElement);
  const inclus = (liste, autre) => liste.every((element) => autre.some((candidat) => elementsEgaux(element, candidat)));
  return { juste: inclus(obtenus, attendus) && inclus(attendus, obtenus) };
}

function verifierVecteur(question, saisie) {
  const obtenus = decouperListe(saisie).map(normaliserElement);
  const attendus = question.reponse.map(normaliserElement);
  const juste = obtenus.length === attendus.length && obtenus.every((element, index) => elementsEgaux(element, attendus[index]));
  return { juste };
}

function verifierChoix(question, saisie) {
  return { juste: Number(saisie) === question.reponse };
}

function verifierTexte(question, saisie) {
  const acceptes = question.reponse.map(normaliserTexte);
  return { juste: acceptes.includes(normaliserTexte(saisie)) };
}

const VERIFICATEURS = {
  nombre: verifierNombre,
  expression: verifierExpression,
  ensemble: verifierEnsemble,
  vecteur: verifierVecteur,
  choix: verifierChoix,
  texte: verifierTexte,
};

export function verifierQuestion(question, saisie) {
  if (question.type === 'auto') return { juste: null };
  if (saisie === undefined || saisie === null || String(saisie).trim() === '') {
    return { juste: false, erreur: 'Réponse vide' };
  }
  try {
    return VERIFICATEURS[question.type](question, String(saisie));
  } catch (erreur) {
    return { juste: false, erreur: erreur.message };
  }
}

export function lireSaisie(question, saisie) {
  if (question.type !== 'nombre' && question.type !== 'expression') return null;
  if (!String(saisie ?? '').trim()) return null;
  try {
    return analyser(saisie, question.type === 'expression' ? [variableDe(question)] : []);
  } catch {
    return null;
  }
}
