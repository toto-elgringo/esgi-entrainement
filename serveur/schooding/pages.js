import { ErreurSynchro } from '../commun/erreurs.js';
import { decoderEntites, texteSimple } from '../commun/html.js';

const SEPARATEUR_LANGUE = '$TR$';

export function traduire(texte, langue = 'fr') {
  const propre = (texte ?? '').trim();
  const morceaux = propre.split(SEPARATEUR_LANGUE);
  const variantes = {};
  if (!propre.startsWith(SEPARATEUR_LANGUE) && morceaux[0]) variantes.defaut = morceaux[0].trim();
  for (const morceau of morceaux.slice(1)) {
    const espace = morceau.indexOf(' ');
    if (espace <= 0) continue;
    const valeur = morceau.slice(espace + 1).trim();
    if (valeur) variantes[morceau.slice(0, espace)] = valeur;
  }
  return variantes[langue] ?? variantes.defaut ?? Object.values(variantes)[0] ?? '';
}

const texteTraduit = (html) => traduire(texteSimple(html));

function chaineJs(brute) {
  try {
    return JSON.parse(`"${brute.replace(/\\'/g, "'")}"`);
  } catch {
    return null;
  }
}

export function pageDeConnexion(html) {
  return /name="csrfmiddlewaretoken"/.test(html) && /id="id_password"/.test(html);
}

export function lireJeton(html) {
  return /name="csrfmiddlewaretoken" value="([^"]+)"/.exec(html)?.[1] ?? null;
}

export function lireCours(html) {
  const cours = new Map();
  for (const [, id, nom] of html.matchAll(/<a\b[^>]*class="dropdown-item langvar"[^>]*href="\/course\/(\d+)\/"[^>]*>([\s\S]*?)<\/a>/gi)) {
    if (!cours.has(id)) cours.set(id, { id, nom: texteTraduit(nom) });
  }
  if (!cours.size && !html.includes('navStudentCourseDrop')) {
    throw new ErreurSynchro('reponse_inattendue', 'La page d’accueil de Schooding a changé.');
  }
  return [...cours.values()];
}

export function lireSeances(html) {
  if (!html.includes('session-list-tab')) throw new ErreurSynchro('reponse_inattendue', 'La page d’un cours de Schooding a changé.');
  const debutExamens = html.search(/Examens pass/i);
  const seances = [];
  for (const trouve of html.matchAll(/<a\b[^>]*class="session\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    const balise = /<a\b[^>]*>/.exec(trouve[0])[0];
    const id = /data-session="(\d+)"/.exec(balise)?.[1];
    if (!id) continue;
    const contenu = trouve[1];
    seances.push({
      id,
      numero: Number(/#(\d+)\s*:/.exec(contenu)?.[1]) || null,
      titre: texteTraduit(/<span class="langvar">([\s\S]*?)<\/span>/.exec(contenu)?.[1] ?? ''),
      examen: debutExamens !== -1 && trouve.index > debutExamens,
    });
  }
  return seances;
}

function lireExercicesDeCarte(carte, categorie) {
  const exercices = [];
  for (const [element] of carte.matchAll(/<div class="list-group-item">[\s\S]*?(?=<div class="list-group-item">|$)/g)) {
    const titre = texteTraduit(/<strong class="langvar">([\s\S]*?)<\/strong>/.exec(element)?.[1] ?? '');
    const lien = /href="\/(\w+)\/(\d+)\/\?next=[^"]*"(?:\s+class="([^"]*)")?/.exec(element);
    const correction = /show_in_iframe\('Correction',\s*'([^']+)'\)/.exec(element)?.[1];
    if (lien) {
      const icone = /<span class="material-icons float-right">([\w-]+)<\/span>/.exec(element)?.[1] ?? '';
      exercices.push({
        id: lien[2],
        type: lien[1],
        titre,
        categorie,
        adresse: decoderEntites(/href="(\/\w+\/\d+\/\?next=[^"]*)"/.exec(element)[1]),
        solution: /'(\/codingtest\/solution\/[^']+)'/.exec(element)?.[1] ?? null,
        indice: `${(lien[3] ?? '').trim()}|${icone}`,
      });
    } else if (correction) {
      exercices.push({
        id: /\/(\d+)\/(\d+)/.exec(correction)?.slice(1).join('-') ?? correction,
        type: 'correction',
        titre,
        categorie,
        adresse: decoderEntites(correction),
        solution: null,
        indice: texteSimple(/<span class="float-right">([\s\S]*?)<\/span>/.exec(element)?.[1] ?? ''),
      });
    }
  }
  return exercices;
}

export function lireSeance(html) {
  const titre = texteTraduit(/<span class="langvar">([\s\S]*?)<\/span>/.exec(html)?.[1] ?? '');
  const verrouillee = /material-icons">lock<\/span>/.test(html) && !/class="card exercices/.test(html);
  const description = /<div class="card mb-3 description">[\s\S]*?<div class="mb-3 langvarhtml">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/.exec(html)?.[1];
  const documents = [];
  for (const [, id, titreDoc] of html.matchAll(/\{\s*id:\s*(\d+),\s*title:\s*getLang\("((?:[^"\\]|\\.)*)"/g)) {
    if (!documents.some((document) => document.id === id)) documents.push({ id, titre: traduire(decoderEntites(chaineJs(titreDoc) ?? titreDoc)) });
  }
  const exercices = [];
  for (const [carte] of html.matchAll(/<div class="card exercices[\s\S]*?<!-- card -->/g)) {
    const categorie = texteSimple(/<h5 class="card-header">([\s\S]*?)<\/h5>/.exec(carte)?.[1] ?? 'Exercices') || 'Exercices';
    exercices.push(...lireExercicesDeCarte(carte, categorie));
  }
  return { titre, verrouillee, description: description ? traduire(description) : '', documents, exercices };
}

function lireAppelEditeur(html) {
  const appel = /initCodingTestIDE\(\s*\d+\s*,\s*"[^"]*"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"([^"]*)"\s*\)/.exec(html);
  if (!appel) return null;
  return { code: chaineJs(appel[1]) ?? '', mode: appel[2] };
}

function lireOutils(html) {
  const appel = /\$\("#tools"\)\.html\(generateDoc\((\{[\s\S]*?\})\)\);/.exec(html);
  if (!appel) return [];
  try {
    const outils = JSON.parse(appel[1]);
    return [...(outils.classes ?? []), ...(outils.functions ?? [])].map(({ name, desc }) => ({ nom: name, description: desc ?? '' }));
  } catch {
    return [];
  }
}

export function lireExercice(html) {
  const enonce = /id="wording"[^>]*>([\s\S]*?)<div id="specWording">/.exec(html)?.[1];
  if (enonce === undefined) throw new ErreurSynchro('reponse_inattendue', 'La page d’un exercice de Schooding a changé.');
  const morceaux = enonce.split(/<div class="langvarhtml">/).slice(1).map((morceau) => traduire(morceau.replace(/<\/div>\s*$/, '')));
  const titre = texteTraduit(/<h5 class="langvarhtml">([\s\S]*?)<\/h5>/.exec(enonce)?.[1] ?? '');
  const historique = [...html.matchAll(/addHistory\(\s*(\d+)\s*,\s*"([^"]*)"\s*,\s*(\d+)\s*,\s*"([^"]*)"\s*\)/g)]
    .map(([, id, date, progression, langage]) => ({ id, date, progression: Number(progression), langage }));
  const editeur = lireAppelEditeur(html);
  return {
    titre,
    enonce: morceaux.filter((morceau) => morceau.trim()).join('\n'),
    outils: lireOutils(html),
    code: editeur?.code ?? '',
    mode: editeur?.mode ?? '',
    historique,
    commence: historique.length > 0,
  };
}

export function lireSolution(html) {
  return lireAppelEditeur(html);
}

export function lireCorrectionQcm(html) {
  const titre = texteSimple(/<div class="page-header"><h1>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? '');
  const questions = [];
  for (const [bloc] of html.matchAll(/<div class="card card-default">[\s\S]*?(?=<div class="card card-default">|$)/g)) {
    const intitule = /<div class="card-body langvarhtml">([\s\S]*?)<\/div>\s*<div class="list-group">/.exec(bloc)?.[1];
    if (intitule === undefined) continue;
    const choix = [...bloc.matchAll(/<div class="list-group-item list-group-item-(success|danger)">\s*<span class="material-icons">(check_box|check_box_outline_blank)<\/span>\s*<div class="langvarhtml">([\s\S]*?)<\/div>/g)]
      .map(([, couleur, case_, texte]) => {
        const coche = case_ === 'check_box';
        return { texte: traduire(texte), coche, bonne: coche === (couleur === 'success') };
      });
    questions.push({ intitule: traduire(intitule), choix });
  }
  if (!questions.length) throw new ErreurSynchro('reponse_inattendue', 'La correction d’un QCM de Schooding a changé.');
  return { titre, questions };
}

export function lireDocumentMarkdown(html) {
  const appel = /md_update\(\s*"((?:[^"\\]|\\.)*)"/.exec(html);
  return appel ? chaineJs(appel[1]) : null;
}

function chaineJsSimple(brute) {
  return brute
    .replace(/\\x([0-9a-f]{2})/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\\u([0-9a-f]{4})/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\\(.)/g, '$1');
}

function texteDeDiapo(svg) {
  const lignes = [];
  for (const [, libelle] of svg.matchAll(/aria-label="([^"]*)"/g)) {
    for (const ligne of decoderEntites(libelle).split(/\r?\n|\u000b/)) {
      const propre = ligne.replace(/\s+/g, ' ').trim();
      if (propre && lignes.at(-1) !== propre) lignes.push(propre);
    }
  }
  return lignes.join('\n');
}

export function lireDiaporama(html) {
  const svgs = [...html.matchAll(/SK_svgData = '((?:[^'\\]|\\.)*)'/g)].map(([, brut]) => chaineJsSimple(brut));
  if (!svgs.length) return null;
  const titre = decoderEntites(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '').replace(/\s*-\s*Google\s+(Slides|Présentations)\s*$/i, '').trim();
  return { titre, diapos: svgs.map((svg) => ({ texte: texteDeDiapo(svg), svg })) };
}

export function idVideo(adresse) {
  const url = new URL(adresse);
  if (url.hostname.endsWith('youtu.be')) return url.pathname.slice(1) || null;
  if (!/(^|\.)youtube(-nocookie)?\.com$/.test(url.hostname)) return null;
  return /\/(?:embed|shorts|live)\/([\w-]+)/.exec(url.pathname)?.[1] ?? url.searchParams.get('v');
}
