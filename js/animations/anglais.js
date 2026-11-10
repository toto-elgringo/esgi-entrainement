import { attendre, boucle, bouton, choix, commandes, creerSvg, curseur, echelle, glisser, html, info, nombre, svg } from './outils.js';

let compteurIdentifiants = 0;

function identifiantUnique(prefixe) {
  compteurIdentifiants += 1;
  return `${prefixe}-${compteurIdentifiants}`;
}

export function melanger(liste, tirage = Math.random) {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i -= 1) {
    const j = Math.floor(tirage() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

export const EPOQUES = [
  { cle: 'passe', nom: 'Passé' },
  { cle: 'lien', nom: 'Passé → maintenant' },
  { cle: 'present', nom: 'Présent' },
  { cle: 'futur', nom: 'Futur' },
];

export const TEMPS = [
  {
    cle: 'past-simple',
    nom: 'Past simple',
    epoque: 'passe',
    forme: 'I worked, I went',
    quand: 'action finie, souvent datée ; les étapes d’un récit, dans l’ordre',
    exemple: 'She [phoned] ten minutes ago.',
    indices: ['ago', 'yesterday', 'last week', 'in 2020'],
    dessin: [
      { type: 'repere', t: -0.5, texte: 'ten minutes ago' },
      { type: 'point', t: -0.5, texte: 'finished' },
    ],
  },
  {
    cle: 'past-continuous',
    nom: 'Past continuous',
    epoque: 'passe',
    forme: 'was / were + -ing',
    quand: 'action en cours à un moment du passé, souvent coupée par un événement',
    exemple: 'I [was driving] when you called.',
    indices: ['when', 'while', 'at 8 pm yesterday'],
    dessin: [
      { type: 'duree', de: -0.85, a: -0.2, texte: 'I was driving', vague: true },
      { type: 'point', t: -0.45, texte: 'you called', bas: true },
    ],
  },
  {
    cle: 'past-perfect',
    nom: 'Past perfect',
    epoque: 'passe',
    forme: 'had + participe passé',
    quand: 'action plus ancienne qu’une autre action passée',
    exemple: 'When we arrived, the train [had] already [left].',
    indices: ['already', 'by the time', 'before'],
    dessin: [
      { type: 'point', t: -0.3, texte: '2. we arrived', bas: true },
      { type: 'point', t: -0.75, texte: '1. the train left', bas: true },
      { type: 'lien', de: -0.3, a: -0.75, texte: 'even earlier' },
    ],
  },
  {
    cle: 'past-perfect-continuous',
    nom: 'Past perfect continuous',
    epoque: 'passe',
    forme: 'had been + -ing',
    quand: 'action qui durait avant un moment du passé',
    exemple: 'They [had been waiting] for an hour when the bus came.',
    indices: ['for + durée', 'when', 'by the time'],
    dessin: [
      { type: 'duree', de: -0.88, a: -0.35, texte: 'waiting for an hour', vague: true },
      { type: 'repere', t: -0.35, texte: 'the bus came' },
    ],
  },
  {
    cle: 'present-perfect',
    nom: 'Present perfect',
    epoque: 'lien',
    forme: 'have / has + participe passé',
    quand: 'événement récent sans date, expérience, ou état qui dure jusqu’à maintenant',
    exemple: 'I[’ve] just [sent] it.',
    aussi: 'How long [have] you [known] her?',
    indices: ['just', 'already', 'yet', 'ever', 'never', 'so far', 'for / since'],
    dessin: [
      { type: 'point', t: -0.45, texte: 'no date', bas: true },
      { type: 'lien', de: -0.45, a: 0, texte: 'still matters now' },
    ],
  },
  {
    cle: 'present-perfect-continuous',
    nom: 'Present perfect continuous',
    epoque: 'lien',
    forme: 'have / has been + -ing',
    quand: 'action commencée dans le passé et toujours en cours',
    exemple: 'We[’ve been working] here since 2021.',
    indices: ['for + durée', 'since + point de départ', 'how long'],
    dessin: [
      { type: 'repere', t: -0.7, texte: 'since 2021' },
      { type: 'duree', de: -0.7, a: 0, texte: 'still going on', vague: true },
    ],
  },
  {
    cle: 'present-simple',
    nom: 'Present simple',
    epoque: 'present',
    forme: 'I work, she works',
    quand: 'habitude, vérité, horaire ; et le futur après when, as soon as, once, until',
    exemple: 'The shop [opens] at 9 every day.',
    aussi: 'Text me as soon as you [land].',
    indices: ['every day', 'usually', 'always', 'as soon as + futur'],
    dessin: [{ type: 'repetition', de: -0.85, a: 0.85, texte: 'every day', etiquette: -0.55 }],
  },
  {
    cle: 'present-continuous',
    nom: 'Present continuous',
    epoque: 'present',
    forme: 'am / is / are + -ing',
    quand: 'action en cours maintenant ; aussi un rendez-vous déjà organisé',
    exemple: 'What [are] you [working] on?',
    aussi: 'I[’m meeting] the client at 3.',
    indices: ['now', 'right now', 'at the moment', 'Listen!'],
    dessin: [{ type: 'duree', de: -0.2, a: 0.2, texte: 'in progress', vague: true }],
  },
  {
    cle: 'will',
    nom: 'will',
    epoque: 'futur',
    forme: 'will + verbe',
    quand: 'décision prise sur le moment, prédiction, promesse',
    exemple: 'I[’ll call] you back.',
    indices: ['OK, I’ll…', 'I think', 'probably', 'I promise'],
    dessin: [
      { type: 'lien', de: 0, a: 0.5, texte: 'decided right now' },
      { type: 'point', t: 0.5, texte: 'call back', bas: true },
    ],
  },
  {
    cle: 'going-to',
    nom: 'be going to',
    epoque: 'futur',
    forme: 'am / is / are going to + verbe',
    quand: 'intention, projet déjà décidé ; prédiction avec un signe visible',
    exemple: 'We[’re going to open] a new store.',
    indices: ['plan', 'intention', 'Look at those clouds!'],
    dessin: [
      { type: 'point', t: -0.35, texte: 'already decided', bas: true },
      { type: 'lien', de: -0.35, a: 0.55, texte: 'the plan' },
      { type: 'point', t: 0.55, texte: 'new store', bas: true },
    ],
  },
  {
    cle: 'future-continuous',
    nom: 'Future continuous',
    epoque: 'futur',
    forme: 'will be + -ing',
    quand: 'action en cours à un moment précis du futur',
    exemple: 'This time tomorrow, I[’ll be sitting] on the plane.',
    indices: ['this time tomorrow', 'this time next week'],
    dessin: [
      { type: 'duree', de: 0.3, a: 0.82, texte: 'sitting on the plane', vague: true },
      { type: 'repere', t: 0.55, texte: 'this time tomorrow' },
    ],
  },
  {
    cle: 'future-perfect',
    nom: 'Future perfect',
    epoque: 'futur',
    forme: 'will have + participe passé',
    quand: 'action terminée avant un moment du futur',
    exemple: 'By June, we [will have finished] the project.',
    indices: ['by 2030', 'by then', 'by the end of'],
    dessin: [
      { type: 'repere', t: 0.75, texte: 'by June' },
      { type: 'point', t: 0.35, texte: 'finished', bas: true },
      { type: 'lien', de: 0.35, a: 0.75, texte: 'done before' },
    ],
  },
];

export const QUESTIONS_TEMPS = [
  {
    phrase: 'I ___ Mr Lee yesterday at the trade fair.',
    choix: ['met', 'have met', 'had met'],
    reponse: 'met',
    temps: 'past-simple',
    indice: 'yesterday',
    pourquoi: 'une date passée et terminée : prétérit.',
  },
  {
    phrase: 'We ___ for this company since 2021.',
    choix: ['have been working', 'are working', 'work'],
    reponse: 'have been working',
    temps: 'present-perfect-continuous',
    indice: 'since 2021',
    pourquoi: 'le « depuis » d’une action qui dure encore : present perfect, jamais le présent.',
  },
  {
    phrase: 'I will call you as soon as I ___ at the hotel.',
    choix: ['arrive', 'will arrive', 'arrived'],
    reponse: 'arrive',
    temps: 'present-simple',
    indice: 'as soon as',
    pourquoi: 'pas de will après as soon as : on met le présent simple.',
  },
  {
    phrase: 'When we reached the platform, the train ___.',
    choix: ['had already left', 'has already left', 'already leaves'],
    reponse: 'had already left',
    temps: 'past-perfect',
    indice: 'When we reached the platform',
    pourquoi: 'le départ du train est plus ancien qu’une autre action passée : past perfect.',
  },
  {
    phrase: 'This time next week, I ___ on a beach in Spain.',
    choix: ['will be lying', 'will have lain', 'lie'],
    reponse: 'will be lying',
    temps: 'future-continuous',
    indice: 'This time next week',
    pourquoi: 'une action en cours à un moment précis du futur : future continuous.',
  },
  {
    phrase: 'By the end of the year, we ___ the new software.',
    choix: ['will have installed', 'will install', 'have installed'],
    reponse: 'will have installed',
    temps: 'future-perfect',
    indice: 'By the end of the year',
    pourquoi: 'une action terminée avant un moment du futur : future perfect.',
  },
  {
    phrase: 'How long ___ Ms Garcia?',
    choix: ['have you known', 'do you know', 'have you been knowing'],
    reponse: 'have you known',
    temps: 'present-perfect',
    indice: 'How long',
    pourquoi: 'une situation qui dure jusqu’à maintenant, et know est un verbe d’état : pas de -ing.',
  },
  {
    phrase: 'Here it is: I ___ the report.',
    choix: ['have just finished', 'just finish', 'had just finished'],
    reponse: 'have just finished',
    temps: 'present-perfect',
    indice: 'Here it is',
    pourquoi: 'un événement récent, sans date, lié à maintenant : present perfect avec just.',
  },
  {
    phrase: 'I ___ a shower when the phone rang.',
    choix: ['was taking', 'have taken', 'take'],
    reponse: 'was taking',
    temps: 'past-continuous',
    indice: 'when the phone rang',
    pourquoi: 'une action en cours dans le passé, coupée par un événement : past continuous.',
  },
  {
    phrase: 'She ___ for two hours when the manager finally arrived.',
    choix: ['had been waiting', 'has been waiting', 'is waiting'],
    reponse: 'had been waiting',
    temps: 'past-perfect-continuous',
    indice: 'for two hours',
    pourquoi: 'une action qui durait avant un moment du passé : past perfect continuous.',
  },
  {
    phrase: 'The phone is ringing. — OK, I ___ it.',
    choix: ['will get', 'got', 'have got'],
    reponse: 'will get',
    temps: 'will',
    indice: 'The phone is ringing.',
    pourquoi: 'une décision prise sur le moment : will.',
  },
  {
    phrase: 'The lease is signed: we ___ a new store in May.',
    choix: ['are going to open', 'opened', 'have opened'],
    reponse: 'are going to open',
    temps: 'going-to',
    indice: 'The lease is signed',
    pourquoi: 'un projet déjà décidé : be going to.',
  },
  {
    phrase: 'Listen! Someone ___ in the meeting room.',
    choix: ['is shouting', 'shouts', 'has shouted'],
    reponse: 'is shouting',
    temps: 'present-continuous',
    indice: 'Listen!',
    pourquoi: 'une action en cours en ce moment : present continuous.',
  },
];

export function decouperExemple(texte) {
  return String(texte)
    .split(/(\[[^\]]*\])/)
    .filter(Boolean)
    .map((morceau) => (morceau.startsWith('[') && morceau.endsWith(']')
      ? { texte: morceau.slice(1, -1), verbe: true }
      : { texte: morceau, verbe: false }));
}

export function decouperPhrase(phrase, indice = '') {
  const morceaux = [];
  let indiceTrouve = false;
  String(phrase).split('___').forEach((partie, rang) => {
    if (rang > 0) morceaux.push({ type: 'trou', texte: '' });
    const position = indice && !indiceTrouve ? partie.indexOf(indice) : -1;
    if (position === -1) {
      if (partie) morceaux.push({ type: 'texte', texte: partie });
      return;
    }
    indiceTrouve = true;
    if (position > 0) morceaux.push({ type: 'texte', texte: partie.slice(0, position) });
    morceaux.push({ type: 'indice', texte: indice });
    const fin = partie.slice(position + indice.length);
    if (fin) morceaux.push({ type: 'texte', texte: fin });
  });
  return morceaux;
}

export function cheminVague(debut, fin, y, amplitude = 5, periode = 18) {
  const points = [];
  for (let x = debut; x < fin; x += 3) points.push(`${x.toFixed(1)},${(y + amplitude * Math.sin(((x - debut) / periode) * 2 * Math.PI)).toFixed(1)}`);
  points.push(`${fin.toFixed(1)},${(y + amplitude * Math.sin(((fin - debut) / periode) * 2 * Math.PI)).toFixed(1)}`);
  return `M${points.join(' L')}`;
}

export function messageScore(bonnes, total) {
  const taux = total ? bonnes / total : 0;
  if (taux === 1) return 'Parfait, aucune erreur !';
  if (taux >= 0.75) return 'Très bien, encore un petit effort.';
  if (taux >= 0.5) return 'Pas mal : relis les mots-repères et recommence.';
  return 'À retravailler : explore la frise puis rejoue.';
}

const FRISE = { largeur: 640, hauteur: 200, axe: 120 };
const versXFrise = echelle([-1, 1], [40, 600]);

function ecrireExemple(parent, texte) {
  for (const { texte: morceau, verbe } of decouperExemple(texte)) {
    html(verbe ? 'strong' : 'span', { classe: verbe ? 'frise-verbe' : '', texte: morceau }, parent);
  }
}

function dessinerFrise(dessin, temps, identifiant) {
  dessin.replaceChildren();
  const { axe } = FRISE;
  const defs = svg('defs', {}, dessin);
  for (const [suffixe, classe] of [['axe', 'frise-pointe-axe'], ['lien', 'frise-pointe']]) {
    const marqueur = svg('marker', { id: `${identifiant}-${suffixe}`, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
    svg('path', { d: 'M0,0 L10,5 L0,10 z', classe }, marqueur);
  }
  svg('line', { x1: 16, x2: 628, y1: axe, y2: axe, classe: 'frise-axe', 'marker-end': `url(#${identifiant}-axe)` }, dessin);
  const maintenant = versXFrise(0);
  svg('line', { x1: maintenant, x2: maintenant, y1: 34, y2: 150, classe: 'frise-maintenant-ligne' }, dessin);
  svg('text', { x: maintenant, y: 26, 'text-anchor': 'middle', classe: 'frise-maintenant-texte', texte: 'NOW' }, dessin);
  svg('text', { x: versXFrise(-0.5), y: 194, 'text-anchor': 'middle', classe: 'frise-epoque', texte: 'PASSÉ' }, dessin);
  svg('text', { x: versXFrise(0.5), y: 194, 'text-anchor': 'middle', classe: 'frise-epoque', texte: 'FUTUR' }, dessin);
  svg('circle', { cx: maintenant, cy: axe, r: 9, classe: 'frise-pouls' }, dessin);
  svg('circle', { cx: maintenant, cy: axe, r: 3.5, classe: 'frise-maintenant' }, dessin);
  if (!temps) return;

  const etiquette = (x, y, texte, delai) => svg('text', { x, y, 'text-anchor': 'middle', classe: 'frise-etiquette frise-pop', style: delai, texte }, dessin);
  let rang = 0;
  const prochainDelai = () => {
    const delai = `animation-delay: ${(0.1 + rang * 0.35).toFixed(2)}s`;
    rang += 1;
    return delai;
  };
  for (const element of temps.dessin) {
    if (element.type === 'point') {
      const delai = prochainDelai();
      const x = versXFrise(element.t);
      svg('circle', { cx: x, cy: axe, r: 7, classe: 'frise-point frise-pop', style: delai }, dessin);
      etiquette(x, element.bas ? axe + 28 : axe - 16, element.texte, delai);
    } else if (element.type === 'duree') {
      const delai = prochainDelai();
      const debut = versXFrise(element.de);
      const fin = versXFrise(element.a);
      const d = element.vague ? cheminVague(debut, fin, axe) : `M${debut},${axe} L${fin},${axe}`;
      svg('path', { d, pathLength: 1, classe: 'frise-duree frise-trace', style: delai }, dessin);
      etiquette(versXFrise(element.etiquette ?? (element.de + element.a) / 2), axe - 16, element.texte, delai);
    } else if (element.type === 'repetition') {
      const debut = versXFrise(element.de);
      const fin = versXFrise(element.a);
      const nombrePoints = Math.max(2, Math.round((fin - debut) / 44));
      for (let i = 0; i <= nombrePoints; i += 1) {
        const delai = `animation-delay: ${(0.05 + i * 0.07).toFixed(2)}s`;
        svg('circle', { cx: debut + ((fin - debut) * i) / nombrePoints, cy: axe, r: 4.5, classe: 'frise-point frise-pop', style: delai }, dessin);
      }
      etiquette(versXFrise(element.etiquette ?? 0), axe - 16, element.texte, prochainDelai());
    } else if (element.type === 'lien') {
      const delai = prochainDelai();
      const debut = versXFrise(element.de);
      const fin = versXFrise(element.a);
      const milieu = (debut + fin) / 2;
      svg('path', { d: `M${debut},${axe - 10} Q${milieu},${axe - 80} ${fin},${axe - 10}`, pathLength: 1, classe: 'frise-lien frise-trace', style: delai, 'marker-end': `url(#${identifiant}-lien)` }, dessin);
      etiquette(milieu, axe - 53, element.texte, delai);
    } else if (element.type === 'repere') {
      const delai = prochainDelai();
      const x = versXFrise(element.t);
      svg('line', { x1: x, x2: x, y1: 92, y2: 150, classe: 'frise-repere frise-pop', style: delai }, dessin);
      svg('text', { x, y: 166, 'text-anchor': 'middle', classe: 'frise-repere-texte frise-pop', style: delai, texte: element.texte }, dessin);
    }
  }
}

function remplirFiche(fiche, temps) {
  fiche.replaceChildren();
  const titre = html('p', { classe: 'frise-fiche-titre' }, fiche);
  html('strong', { texte: temps.nom }, titre);
  html('code', { texte: temps.forme }, titre);
  html('p', { classe: 'frise-fiche-quand', texte: `Quand : ${temps.quand}.` }, fiche);
  const exemple = html('p', { classe: 'frise-fiche-exemple' }, fiche);
  ecrireExemple(exemple, temps.exemple);
  if (temps.aussi) {
    const aussi = html('p', { classe: 'frise-fiche-exemple' }, fiche);
    ecrireExemple(aussi, temps.aussi);
  }
  const indices = html('div', { classe: 'frise-indices' }, fiche);
  html('span', { classe: 'frise-indices-titre', texte: 'Mots-repères' }, indices);
  for (const indice of temps.indices) html('span', { classe: 'frise-indice', texte: indice }, indices);
}

function creerFriseDesTemps(zone, options) {
  const identifiant = identifiantUnique('frise');
  const parPartie = Math.min(Math.max(Number(options.questions) || 8, 3), QUESTIONS_TEMPS.length);
  let selection = TEMPS.find(({ cle }) => cle === options.temps) ?? TEMPS.find(({ cle }) => cle === 'present-perfect');

  const barre = commandes(zone);
  choix(barre, {
    options: [{ valeur: 'explorer', texte: 'Explorer la frise' }, { valeur: 'jeu', texte: 'Jeu : quel temps ?' }],
    valeur: 'explorer',
    auChangement: (mode) => (mode === 'jeu' ? lancerJeu() : explorer()),
  });

  const selecteur = html('div', { classe: 'frise-selecteur' }, zone);
  const boutonsTemps = new Map();
  for (const epoque of EPOQUES) {
    const groupe = html('div', { classe: 'frise-groupe' }, selecteur);
    html('span', { classe: 'frise-groupe-nom', texte: epoque.nom }, groupe);
    const puces = html('div', { classe: 'anim-choix' }, groupe);
    for (const temps of TEMPS.filter((element) => element.epoque === epoque.cle)) {
      const element = html('button', { type: 'button', classe: 'anim-puce', texte: temps.nom }, puces);
      element.addEventListener('click', () => choisirTemps(temps));
      boutonsTemps.set(temps.cle, element);
    }
  }

  const jeu = html('div', { classe: 'frise-jeu', hidden: true }, zone);
  const dessin = creerSvg(zone, FRISE.largeur, FRISE.hauteur, 'frise-svg');
  const fiche = html('div', { classe: 'frise-fiche' }, zone);

  function choisirTemps(temps) {
    selection = temps;
    for (const [cle, element] of boutonsTemps) element.classList.toggle('actif', cle === temps.cle);
    dessinerFrise(dessin, temps, identifiant);
    remplirFiche(fiche, temps);
  }

  function explorer() {
    selecteur.hidden = false;
    jeu.hidden = true;
    choisirTemps(selection);
  }

  function lancerJeu() {
    selecteur.hidden = true;
    jeu.hidden = false;
    const questions = melanger(QUESTIONS_TEMPS).slice(0, parPartie);
    let rang = 0;
    let bonnes = 0;

    function poser() {
      jeu.replaceChildren();
      const question = questions[rang];
      html('p', { classe: 'frise-jeu-score', texte: `Phrase ${rang + 1} / ${questions.length} · ${bonnes} bonne${bonnes > 1 ? 's' : ''} réponse${bonnes > 1 ? 's' : ''}` }, jeu);
      const phrase = html('p', { classe: 'frise-jeu-phrase' }, jeu);
      const morceaux = decouperPhrase(question.phrase, question.indice).map((morceau) => {
        const element = html('span', { classe: morceau.type === 'trou' ? 'frise-trou' : '', texte: morceau.type === 'trou' ? '…' : morceau.texte }, phrase);
        return { ...morceau, element };
      });
      const trou = morceaux.find(({ type }) => type === 'trou').element;
      const reponses = html('div', { classe: 'anim-commandes frise-reponses' }, jeu);
      const retour = html('p', { classe: 'anim-info' }, jeu);
      dessinerFrise(dessin, null, identifiant);
      fiche.replaceChildren();
      const boutons = melanger(question.choix).map((proposition) => bouton(reponses, proposition, () => repondre(proposition)));

      function repondre(proposition) {
        const juste = proposition === question.reponse;
        if (juste) bonnes += 1;
        for (const element of boutons) {
          element.disabled = true;
          element.classList.toggle('frise-bonne', element.textContent === question.reponse);
          element.classList.toggle('frise-fausse', !juste && element.textContent === proposition);
        }
        trou.textContent = question.reponse;
        trou.classList.add(juste ? 'bon' : 'mauvais');
        for (const { type, element } of morceaux) if (type === 'indice') element.classList.add('frise-indice-trouve');
        const temps = TEMPS.find(({ cle }) => cle === question.temps);
        retour.innerHTML = `${juste ? '<strong>Bien vu !</strong>' : `<strong>Raté :</strong> c’était « ${question.reponse} ».`} Indice « ${question.indice} » : ${question.pourquoi}`;
        dessinerFrise(dessin, temps, identifiant);
        remplirFiche(fiche, temps);
        const suite = rang + 1 < questions.length;
        bouton(reponses, suite ? 'Phrase suivante →' : 'Voir le score', () => {
          rang += 1;
          if (suite) poser();
          else terminer();
        }, { principal: true });
      }
    }

    function terminer() {
      jeu.replaceChildren();
      const bilan = html('div', { classe: 'frise-bilan anim-apparait' }, jeu);
      html('strong', { classe: 'frise-bilan-score', texte: `${bonnes} / ${questions.length}` }, bilan);
      html('span', { texte: messageScore(bonnes, questions.length) }, bilan);
      bouton(commandes(jeu), 'Rejouer', lancerJeu, { principal: true });
      dessinerFrise(dessin, null, identifiant);
      fiche.replaceChildren();
    }

    poser();
  }

  explorer();
}

export const MOTS_PAR_DEFAUT = 'invoice = facture ; deadline = date limite ; delay = retard ; to attend = assister à ; library = bibliothèque';

export function lireMots(texte = '') {
  return String(texte)
    .split(';')
    .map((paire) => paire.split('='))
    .filter((morceaux) => morceaux.length >= 2)
    .map(([anglais, ...reste]) => ({ anglais: anglais.trim(), francais: reste.join('=').trim() }))
    .filter(({ anglais, francais }) => anglais && francais);
}

export function nouveauPaquet(cartes, tirage = Math.random) {
  return { file: melanger(cartes, tirage), sues: [], ratees: [] };
}

export function repondreCarte(paquet, savait) {
  const [carte, ...reste] = paquet.file;
  if (carte === undefined) return paquet;
  if (savait) return { ...paquet, file: reste, sues: [...paquet.sues, carte] };
  return {
    ...paquet,
    file: [...reste, carte],
    ratees: paquet.ratees.includes(carte) ? paquet.ratees : [...paquet.ratees, carte],
  };
}

export function bilanPaquet(paquet) {
  return {
    premierCoup: paquet.sues.filter((carte) => !paquet.ratees.includes(carte)).length,
    ratees: paquet.ratees.length,
    restantes: paquet.file.length,
    termine: paquet.file.length === 0,
  };
}

function creerCartesVocabulaire(zone, options) {
  const lus = lireMots(options.mots);
  const mots = lus.length ? lus : lireMots(MOTS_PAR_DEFAUT);
  let sens = options.sens === 'fr' ? 'fr' : 'en';
  let paquet = nouveauPaquet(mots.map((_, rang) => rang));
  let tailleSerie = mots.length;
  let retournee = false;

  const barre = commandes(zone);
  choix(barre, {
    options: [{ valeur: 'en', texte: 'Anglais → français' }, { valeur: 'fr', texte: 'Français → anglais' }],
    valeur: sens,
    auChangement: (valeur) => {
      sens = valeur;
      demarrer(mots.map((_, rang) => rang));
    },
  });
  bouton(barre, 'Tout mélanger', () => demarrer(mots.map((_, rang) => rang)));

  const progres = html('div', { classe: 'vocab-progres', 'aria-hidden': 'true' }, zone);
  const pastilles = mots.map(() => html('span', { classe: 'vocab-pastille' }, progres));
  const scene = html('div', { classe: 'vocab-scene' }, zone);
  const carte = html('button', { type: 'button', classe: 'vocab-carte' }, scene);
  const interieur = html('span', { classe: 'vocab-interieur' }, carte);
  const recto = html('span', { classe: 'vocab-face vocab-recto' }, interieur);
  const langueRecto = html('span', { classe: 'vocab-langue' }, recto);
  const motRecto = html('span', { classe: 'vocab-mot' }, recto);
  html('span', { classe: 'vocab-aide', texte: 'Clique pour retourner' }, recto);
  const verso = html('span', { classe: 'vocab-face vocab-verso' }, interieur);
  const langueVerso = html('span', { classe: 'vocab-langue' }, verso);
  const motVerso = html('span', { classe: 'vocab-mot' }, verso);
  const fin = html('div', { classe: 'vocab-fin', hidden: true }, scene);

  const reponses = html('div', { classe: 'anim-commandes vocab-reponses' }, zone);
  const boutonRevoir = bouton(reponses, '↺ À revoir', () => repondre(false));
  const boutonSavais = bouton(reponses, '✓ Je savais', () => repondre(true), { principal: true });
  const etat = info(zone);

  carte.addEventListener('click', () => {
    if (paquet.file.length) retourner(!retournee);
  });

  function retourner(valeur) {
    retournee = valeur;
    carte.classList.toggle('retournee', valeur);
    boutonRevoir.disabled = !valeur;
    boutonSavais.disabled = !valeur;
  }

  function afficherCarte() {
    const mot = mots[paquet.file[0]];
    const [face, dos] = sens === 'en' ? [mot.anglais, mot.francais] : [mot.francais, mot.anglais];
    langueRecto.textContent = sens === 'en' ? 'EN' : 'FR';
    langueVerso.textContent = sens === 'en' ? 'FR' : 'EN';
    motRecto.textContent = face;
    motVerso.textContent = dos;
    carte.setAttribute('aria-label', `${face} : clique pour voir la traduction`);
  }

  function colorerPastilles() {
    pastilles.forEach((pastille, rang) => {
      pastille.className = 'vocab-pastille';
      if (paquet.sues.includes(rang)) pastille.classList.add(paquet.ratees.includes(rang) ? 'revue' : 'sue');
      else if (paquet.ratees.includes(rang)) pastille.classList.add('ratee');
      if (paquet.file[0] === rang) pastille.classList.add('courante');
    });
  }

  function mettreAJour() {
    colorerPastilles();
    const bilan = bilanPaquet(paquet);
    if (bilan.termine) {
      terminer(bilan);
      return;
    }
    carte.hidden = false;
    fin.hidden = true;
    reponses.hidden = false;
    afficherCarte();
    etat.innerHTML = `Encore <strong>${bilan.restantes}</strong> carte${bilan.restantes > 1 ? 's' : ''} · su${bilan.premierCoup > 1 ? 's' : ''} du premier coup : <strong>${bilan.premierCoup}</strong> · à revoir : <strong>${bilan.ratees}</strong>`;
  }

  function terminer(bilan) {
    carte.hidden = true;
    reponses.hidden = true;
    fin.hidden = false;
    fin.replaceChildren();
    fin.classList.remove('anim-apparait');
    void fin.offsetWidth;
    fin.classList.add('anim-apparait');
    html('strong', { classe: 'vocab-fin-score', texte: `${bilan.premierCoup} / ${tailleSerie}` }, fin);
    html('span', { texte: bilan.ratees ? 'mots sus du premier coup. Ceux-là méritent une autre série :' : 'mots sus du premier coup. Sans faute !' }, fin);
    if (bilan.ratees) {
      const liste = html('ul', { classe: 'vocab-liste' }, fin);
      for (const rang of paquet.ratees) {
        const element = html('li', {}, liste);
        html('strong', { texte: mots[rang].anglais }, element);
        html('span', { texte: ` = ${mots[rang].francais}` }, element);
      }
    }
    const actions = commandes(fin);
    const ratees = [...paquet.ratees];
    if (ratees.length) bouton(actions, `Revoir les ${ratees.length} mot${ratees.length > 1 ? 's' : ''} ratés`, () => demarrer(ratees), { principal: true });
    bouton(actions, 'Recommencer tout', () => demarrer(mots.map((_, rang) => rang)));
    etat.textContent = '';
  }

  function demarrer(cartes) {
    paquet = nouveauPaquet(cartes);
    tailleSerie = cartes.length;
    carte.classList.add('sans-transition');
    retourner(false);
    void carte.offsetWidth;
    carte.classList.remove('sans-transition');
    mettreAJour();
  }

  function repondre(savait) {
    if (!retournee || !paquet.file.length) return;
    paquet = repondreCarte(paquet, savait);
    boutonRevoir.disabled = true;
    boutonSavais.disabled = true;
    carte.classList.add(savait ? 'part-droite' : 'part-gauche');
    attendre(carte, 260).then(() => {
      carte.classList.add('sans-transition');
      carte.classList.remove('part-droite', 'part-gauche');
      retourner(false);
      mettreAJour();
      void carte.offsetWidth;
      carte.classList.remove('sans-transition');
    }).catch(() => {});
  }

  demarrer(mots.map((_, rang) => rang));
}

export const DUREE_LECTURE = 75 * 60;
export const DUREE_ECOUTE = 45 * 60;

export const PARTIES_LECTURE = [
  { numero: 5, nom: 'Phrases', questions: 30, conseil: 15 * 60, couleur: 'var(--ansi-bleu)' },
  { numero: 6, nom: 'Textes', questions: 16, conseil: 8 * 60, couleur: 'var(--ansi-magenta)' },
  { numero: 7, nom: 'Documents', questions: 54, conseil: 50 * 60, couleur: 'var(--ansi-cyan)' },
];

export function planLecture(rythmes) {
  let debut = 0;
  const parties = PARTIES_LECTURE.map((partie, rang) => {
    const rythme = rythmes[rang];
    const duree = partie.questions * rythme;
    const traitees = Math.max(0, Math.min(partie.questions, Math.floor((DUREE_LECTURE - debut) / rythme)));
    const resultat = { ...partie, rythme, debut, duree, fin: debut + duree, traitees };
    debut += duree;
    return resultat;
  });
  const avantPartie7 = parties[0].duree + parties[1].duree;
  return {
    parties,
    total: debut,
    depasse: debut > DUREE_LECTURE,
    nonTraitees: parties.reduce((somme, partie) => somme + partie.questions - partie.traitees, 0),
    avantPartie7,
    alerte: avantPartie7 > 25 * 60,
    restePartie7: DUREE_LECTURE - avantPartie7,
  };
}

export function positionLecture(plan, seconde) {
  const limite = Math.min(plan.total, DUREE_LECTURE);
  if (seconde >= limite) return { fini: true, partie: null, question: null };
  const partie = plan.parties.find(({ debut, fin }) => seconde >= debut && seconde < fin);
  return { fini: false, partie: partie.numero, question: Math.floor((seconde - partie.debut) / partie.rythme) + 1, total: partie.questions };
}

export function formatHorloge(secondes) {
  const arrondi = Math.max(0, Math.round(secondes));
  return `${String(Math.floor(arrondi / 60)).padStart(2, '0')}:${String(arrondi % 60).padStart(2, '0')}`;
}

function minutes(secondes) {
  return `${nombre(secondes / 60, 1)} min`;
}

function creerChronoToeic(zone, options) {
  const rythmes = [options.partie5 ?? 30, options.partie6 ?? 30, options.partie7 ?? 50];
  const vitesse = 60;
  let instant = 0;
  let plan = planLecture(rythmes);

  const reglages = html('div', { classe: 'anim-commandes chrono-reglages' }, zone);
  const libelles = ['Partie 5 : s / phrase', 'Partie 6 : s / question', 'Partie 7 : s / question'];
  const bornesRythme = [[15, 60], [15, 60], [30, 90]];
  libelles.forEach((libelle, rang) => {
    curseur(reglages, {
      libelle,
      min: bornesRythme[rang][0],
      max: bornesRythme[rang][1],
      pas: 5,
      valeur: rythmes[rang],
      format: (valeur) => `${valeur} s`,
      auChangement: (valeur) => {
        rythmes[rang] = valeur;
        plan = planLecture(rythmes);
        instant = Math.min(instant, Math.min(plan.total, DUREE_LECTURE));
        dessiner();
      },
    });
  });

  const barre = commandes(zone);
  const boutonLancer = bouton(barre, '▶ Lancer le chrono', () => {
    if (chrono.enMarche) {
      chrono.arreter();
    } else {
      if (positionLecture(plan, instant).fini) instant = 0;
      chrono.demarrer();
    }
    boutonLancer.textContent = chrono.enMarche ? '⏸ Pause' : '▶ Reprendre';
  }, { principal: true });
  bouton(barre, '↺ Remettre à zéro', () => {
    chrono.arreter();
    instant = 0;
    boutonLancer.textContent = '▶ Lancer le chrono';
    dessiner();
  });
  html('span', { classe: 'chrono-vitesse', texte: '1 seconde = 1 minute du test' }, barre);

  const tableau = html('div', { classe: 'chrono-tableau' }, zone);
  const horloge = html('span', { classe: 'chrono-horloge' }, tableau);
  const position = html('span', { classe: 'chrono-position' }, tableau);
  const dessin = creerSvg(zone, 640, 190, 'chrono-svg');
  const conclusion = info(zone);

  const chrono = boucle(dessin, (ecart) => {
    instant += ecart * vitesse;
    const fini = positionLecture(plan, instant).fini;
    if (fini) instant = Math.min(plan.total, DUREE_LECTURE);
    dessiner();
    if (fini) {
      boutonLancer.textContent = '▶ Relancer';
      return false;
    }
    return true;
  });

  function dessiner() {
    dessin.replaceChildren();
    const gauche = 20;
    const droite = 620;
    const versTest = echelle([0, DUREE_ECOUTE + DUREE_LECTURE], [gauche, droite]);
    svg('rect', { x: versTest(0), y: 8, width: versTest(DUREE_ECOUTE) - gauche, height: 20, rx: 4, classe: 'chrono-ecoute' }, dessin);
    svg('rect', { x: versTest(DUREE_ECOUTE), y: 8, width: droite - versTest(DUREE_ECOUTE), height: 20, rx: 4, classe: 'chrono-lecture' }, dessin);
    svg('text', { x: versTest(DUREE_ECOUTE / 2), y: 22, 'text-anchor': 'middle', classe: 'chrono-texte-barre', texte: 'Listening · 45 min · rythme imposé' }, dessin);
    svg('text', { x: versTest(DUREE_ECOUTE + DUREE_LECTURE / 2), y: 22, 'text-anchor': 'middle', classe: 'chrono-texte-barre', texte: 'Reading · 75 min · c’est toi qui gères' }, dessin);

    const echelleFin = Math.max(DUREE_LECTURE, plan.total);
    const versX = echelle([0, echelleFin], [gauche, droite]);
    svg('path', { d: `M${versTest(DUREE_ECOUTE)},28 L${gauche},62 M${droite},28 L${versX(DUREE_LECTURE)},62`, classe: 'chrono-zoom' }, dessin);

    const hautBarre = 64;
    const hauteurBarre = 38;
    for (const partie of plan.parties) {
      const finDansTemps = Math.min(partie.fin, DUREE_LECTURE);
      if (finDansTemps > partie.debut) {
        svg('rect', { x: versX(partie.debut), y: hautBarre, width: versX(finDansTemps) - versX(partie.debut), height: hauteurBarre, classe: 'chrono-partie', style: `fill: ${partie.couleur}` }, dessin);
      }
      if (partie.fin > DUREE_LECTURE) {
        const debutHors = Math.max(partie.debut, DUREE_LECTURE);
        svg('rect', { x: versX(debutHors), y: hautBarre, width: versX(partie.fin) - versX(debutHors), height: hauteurBarre, classe: 'chrono-partie chrono-hors-temps', style: `fill: ${partie.couleur}` }, dessin);
      }
      const largeur = versX(partie.fin) - versX(partie.debut);
      if (largeur > 46) {
        svg('text', { x: versX(partie.debut) + largeur / 2, y: hautBarre + 16, 'text-anchor': 'middle', classe: 'chrono-texte-partie', texte: `Partie ${partie.numero}` }, dessin);
        svg('text', { x: versX(partie.debut) + largeur / 2, y: hautBarre + 31, 'text-anchor': 'middle', classe: 'chrono-texte-partie chrono-texte-fin', texte: minutes(partie.duree) }, dessin);
      }
    }

    let debutConseil = 0;
    svg('text', { x: gauche, y: 122, classe: 'anim-graduation', texte: 'conseillé' }, dessin);
    for (const partie of PARTIES_LECTURE) {
      svg('rect', { x: versX(debutConseil) + 1, y: 127, width: versX(debutConseil + partie.conseil) - versX(debutConseil) - 2, height: 10, rx: 3, classe: 'chrono-conseil', style: `stroke: ${partie.couleur}` }, dessin);
      debutConseil += partie.conseil;
    }

    const limite = versX(DUREE_LECTURE);
    svg('line', { x1: limite, x2: limite, y1: hautBarre - 6, y2: 146, classe: 'chrono-limite' }, dessin);
    svg('text', { x: limite - 4, y: hautBarre - 8, 'text-anchor': 'end', classe: 'chrono-limite-texte', texte: 'fin des 75 min' }, dessin);
    const quartAlerte = versX(25 * 60);
    svg('line', { x1: quartAlerte, x2: quartAlerte, y1: hautBarre + hauteurBarre, y2: 146, classe: 'anim-repere' }, dessin);
    svg('text', { x: quartAlerte, y: 158, 'text-anchor': 'middle', classe: 'chrono-texte-alerte', texte: '25 min : début de la partie 7 au plus tard' }, dessin);
    for (let minute = 0; minute * 60 <= echelleFin; minute += 15) {
      svg('text', { x: versX(minute * 60), y: 180, 'text-anchor': 'middle', classe: 'anim-graduation', texte: `${minute}′` }, dessin);
    }

    const tete = versX(instant);
    svg('line', { x1: tete, x2: tete, y1: hautBarre - 4, y2: hautBarre + hauteurBarre + 4, classe: 'chrono-tete' }, dessin);
    svg('path', { d: `M${tete - 6},${hautBarre - 10} L${tete + 6},${hautBarre - 10} L${tete},${hautBarre - 2} z`, classe: 'chrono-tete-pointe' }, dessin);

    horloge.textContent = formatHorloge(DUREE_LECTURE - instant);
    const ici = positionLecture(plan, instant);
    position.textContent = ici.fini
      ? (plan.depasse ? 'Temps écoulé !' : 'Terminé !')
      : `Partie ${ici.partie} · question ${ici.question} / ${ici.total}`;
    horloge.classList.toggle('alerte', DUREE_LECTURE - instant < 5 * 60);
    ecrireConclusion(ici.fini);
  }

  function ecrireConclusion(fini) {
    const morceaux = [`Parties 5 et 6 : <strong>${minutes(plan.avantPartie7)}</strong>, il reste <strong>${minutes(plan.restePartie7)}</strong> pour les 54 questions de la partie 7.`];
    if (plan.alerte) morceaux.push('<span class="anim-alerte">Plus de 25 minutes avant la partie 7 : tu vas manquer de temps.</span>');
    if (plan.depasse) {
      const devinees = plan.nonTraitees;
      morceaux.push(`${fini ? 'Fin du test :' : 'À ce rythme,'} <strong>${devinees}</strong> question${devinees > 1 ? 's' : ''} sans réponse. Coche-les quand même au hasard : une mauvaise réponse ne fait pas perdre de points, et avec 4 choix tu gagnes environ <strong>${Math.round(devinees / 4)}</strong> bonne${Math.round(devinees / 4) > 1 ? 's' : ''} réponse${Math.round(devinees / 4) > 1 ? 's' : ''}.`);
    } else {
      morceaux.push(`Tout est fini avec <strong>${minutes(DUREE_LECTURE - plan.total)}</strong> d’avance pour vérifier.`);
    }
    conclusion.innerHTML = morceaux.join(' ');
  }

  dessiner();
}

export const RANG_GEOMETRIE = { point: 0, ligne: 1, surface: 2 };

export function aireSurface(points) {
  let somme = 0;
  points.forEach(([x1, y1], rang) => {
    const [x2, y2] = points[(rang + 1) % points.length];
    somme += x1 * y2 - x2 * y1;
  });
  return Math.abs(somme) / 2;
}

export function aireCouche(couche) {
  if (couche.geometrie !== 'surface') return 0;
  return couche.objets.reduce((somme, { forme }) => somme + aireSurface(forme), 0);
}

function rangCouche(couche) {
  return [RANG_GEOMETRIE[couche.geometrie], aireCouche(couche)];
}

function cadre(points, marge = 3) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return { gauche: Math.min(...xs) - marge, droite: Math.max(...xs) + marge, haut: Math.min(...ys) - marge, bas: Math.max(...ys) + marge };
}

function cadresCouche(couche) {
  return couche.objets.flatMap(({ forme }) => (couche.geometrie === 'ligne'
    ? forme.slice(1).map((point, rang) => cadre([forme[rang], point]))
    : [cadre(forme)]));
}

export function couchesSeChevauchent(a, b) {
  const cadresB = cadresCouche(b);
  return cadresCouche(a).some((cadreA) => cadresB.some((cadreB) => cadreA.gauche < cadreB.droite && cadreB.gauche < cadreA.droite && cadreA.haut < cadreB.bas && cadreB.haut < cadreA.bas));
}

function cacheDessous(dessus, dessous) {
  if (!couchesSeChevauchent(dessus, dessous)) return false;
  const [rangDessus, aireDessus] = rangCouche(dessus);
  const [rangDessous, aireDessous] = rangCouche(dessous);
  if (rangDessus !== rangDessous) return rangDessus > rangDessous;
  return rangDessus === RANG_GEOMETRIE.surface && aireDessus > aireDessous;
}

export function ordreConseille(couches) {
  return [...couches].sort((a, b) => {
    const [rangA, aireA] = rangCouche(a);
    const [rangB, aireB] = rangCouche(b);
    return rangA - rangB || aireA - aireB;
  });
}

export function problemesOrdre(couches, visibles = new Set(couches.map(({ id }) => id))) {
  const affichees = couches.filter(({ id }) => visibles.has(id));
  const problemes = [];
  affichees.forEach((dessus, rang) => {
    for (const dessous of affichees.slice(rang + 1)) {
      if (cacheDessous(dessus, dessous)) problemes.push({ dessus, dessous });
    }
  });
  return problemes;
}

export const COUCHES_CARTE = [
  {
    id: 'arrondissement',
    nom: 'ARRONDISSEMENT',
    theme: 'ADMINISTRATIF',
    geometrie: 'surface',
    objets: [{ forme: [[6, 8], [394, 4], [396, 254], [4, 250]], attributs: { nom: 'Paris 1er Arrondissement', code_insee: '75101' } }],
  },
  {
    id: 'batiment',
    nom: 'BATIMENT',
    theme: 'BATI',
    geometrie: 'surface',
    objets: [
      { forme: [[212, 28], [255, 24], [257, 74], [215, 78]], attributs: { usage: 'Résidentiel', hauteur: '18 m', nombre_d_etages: 5 } },
      { forme: [[274, 22], [340, 18], [343, 62], [277, 66]], attributs: { usage: 'Commercial', hauteur: '24 m', nombre_d_etages: 7 } },
      { forme: [[352, 30], [388, 28], [390, 80], [354, 82]], attributs: { usage: 'Résidentiel', hauteur: '15 m', nombre_d_etages: 4 } },
      { forme: [[40, 216], [100, 209], [104, 244], [44, 250]], attributs: { usage: 'Religieux', hauteur: '33 m', nombre_d_etages: 1 } },
      { forme: [[150, 222], [200, 214], [203, 246], [153, 250]], attributs: { usage: 'Résidentiel', hauteur: '21 m', nombre_d_etages: 6 } },
      { forme: [[292, 182], [360, 172], [364, 222], [296, 230]], attributs: { usage: 'Administratif', hauteur: '27 m', nombre_d_etages: 6 } },
    ],
  },
  {
    id: 'adresse',
    nom: 'ADRESSE_BAN',
    theme: 'ADRESSES',
    geometrie: 'point',
    objets: [
      { forme: [[120, 132]], attributs: { numero: 160, voie: 'Rue de Rivoli' } },
      { forme: [[300, 100]], attributs: { numero: 112, voie: 'Rue de Rivoli' } },
      { forme: [[372, 98]], attributs: { numero: 90, voie: 'Rue de Rivoli' } },
      { forme: [[189, 60]], attributs: { numero: 8, voie: 'Rue du Pont-Neuf' } },
      { forme: [[228, 214]], attributs: { numero: 3, voie: 'Rue du Pont-Neuf' } },
      { forme: [[267, 90]], attributs: { numero: 21, voie: 'Rue du Louvre' } },
    ],
  },
  {
    id: 'vegetation',
    nom: 'ZONE_DE_VEGETATION',
    theme: 'OCCUPATION_DU_SOL',
    geometrie: 'surface',
    objets: [{ forme: [[28, 34], [176, 26], [182, 92], [36, 100]], attributs: { nature: 'Jardin', toponyme: 'Jardin des Tuileries' } }],
  },
  {
    id: 'route',
    nom: 'TRONCON_DE_ROUTE',
    theme: 'TRANSPORT',
    geometrie: 'ligne',
    objets: [
      { forme: [[0, 122], [400, 108]], attributs: { nom: 'Rue de Rivoli', largeur: '12 m', sens: 'Double sens' } },
      { forme: [[194, 0], [204, 116], [213, 188], [222, 260]], attributs: { nom: 'Rue du Pont-Neuf', largeur: '10 m', sens: 'Double sens' } },
      { forme: [[266, 0], [268, 110]], attributs: { nom: 'Rue du Louvre', largeur: '9 m', sens: 'Sens unique' } },
    ],
  },
  {
    id: 'cours-d-eau',
    nom: 'COURS_D_EAU',
    theme: 'HYDROGRAPHIE',
    geometrie: 'ligne',
    objets: [{ forme: [[0, 186], [90, 168], [170, 184], [250, 162], [330, 146], [400, 140]], attributs: { toponyme: 'La Seine', regime: 'Permanent' } }],
  },
];

const ICONES_GEOMETRIE = { point: '●', ligne: '〰', surface: '▰' };

export function matriceCouche(ecart, rang, nombre) {
  const echelleVue = 1.35 - 0.35 * ecart;
  const a = echelleVue;
  const c = 0.7 * ecart;
  const d = echelleVue * (1 - 0.6 * ecart);
  const largeur = a * 400 + c * 260;
  const e = (620 - largeur) / 2;
  const fVue = (380 - 260 * echelleVue) / 2;
  const fEclate = 8 + (nombre - 1 - rang) * 52;
  const f = fVue + (fEclate - fVue) * ecart;
  return [a, 0, c, d, e, f];
}

function creerCouches(zone, options) {
  let ordre = [...COUCHES_CARTE];
  const visibles = new Set(ordre.map(({ id }) => id));
  let ecart = bornesUnite(options.ecart ?? 0);
  let choisi = null;

  const barre = commandes(zone);
  const reglage = curseur(barre, {
    libelle: 'Écarter les couches',
    min: 0,
    max: 100,
    valeur: Math.round(ecart * 100),
    format: (valeur) => `${valeur} %`,
    auChangement: (valeur) => {
      dessin.classList.add('sans-transition');
      ecart = valeur / 100;
      placer();
    },
  });
  reglage.element.classList.add('anim-curseur-large');
  reglage.element.querySelector('input').addEventListener('change', () => dessin.classList.remove('sans-transition'));
  bouton(barre, 'Éclater / rassembler', () => animerEcart(ecart > 0.5 ? 0 : 1));
  bouton(barre, 'Ranger comme conseillé', () => {
    ordre = ordreConseille(ordre);
    rafraichir();
  }, { principal: true });

  const disposition = html('div', { classe: 'couches-disposition' }, zone);
  const panneau = html('div', { classe: 'couches-panneau' }, disposition);
  html('p', { classe: 'couches-panneau-titre', texte: 'Couches' }, panneau);
  const liste = html('ol', { classe: 'couches-liste' }, panneau);
  const dessin = creerSvg(disposition, 620, 380, 'couches-svg');
  const message = info(zone);
  const table = html('div', { classe: 'couches-table' }, zone);

  const groupes = new Map();
  for (const couche of COUCHES_CARTE) {
    const groupe = svg('g', { classe: `couches-groupe couches-${couche.id}` });
    svg('rect', { x: 0, y: 0, width: 400, height: 260, rx: 6, classe: 'couches-plaque' }, groupe);
    couche.objets.forEach((objet) => {
      const attributs = { classe: `couches-objet geo-${couche.geometrie} geo-${couche.id}`, tabindex: 0 };
      const points = objet.forme.map((point) => point.join(',')).join(' ');
      const forme = couche.geometrie === 'point'
        ? svg('circle', { ...attributs, cx: objet.forme[0][0], cy: objet.forme[0][1], r: 6 }, groupe)
        : svg(couche.geometrie === 'ligne' ? 'polyline' : 'polygon', { ...attributs, points }, groupe);
      const ouvrir = () => {
        choisi = { couche, objet, forme };
        rafraichir();
      };
      forme.addEventListener('click', ouvrir);
      forme.addEventListener('keydown', (evenement) => {
        if (evenement.key === 'Enter' || evenement.key === ' ') {
          evenement.preventDefault();
          ouvrir();
        }
      });
    });
    groupes.set(couche.id, groupe);
  }

  function bornesUnite(valeur) {
    return Math.min(1, Math.max(0, Number(valeur) || 0));
  }

  function animerEcart(cible) {
    const depart = ecart;
    let temps = 0;
    dessin.classList.add('sans-transition');
    const animation = boucle(dessin, (pas) => {
      temps = Math.min(1, temps + pas / 0.7);
      const lisse = temps < 0.5 ? 2 * temps * temps : 1 - (-2 * temps + 2) ** 2 / 2;
      ecart = depart + (cible - depart) * lisse;
      reglage.fixer(Math.round(ecart * 100));
      placer();
      if (temps >= 1) {
        dessin.classList.remove('sans-transition');
        return false;
      }
      return true;
    });
    animation.demarrer();
  }

  function placer() {
    const dessous = [...ordre].reverse();
    dessous.forEach((couche, rang) => {
      const groupe = groupes.get(couche.id);
      groupe.style.transform = `matrix(${matriceCouche(ecart, rang, dessous.length).map((valeur) => valeur.toFixed(3)).join(',')})`;
      groupe.querySelector('.couches-plaque').style.opacity = (ecart * 0.9).toFixed(2);
    });
    ecrireMessage();
  }

  function deplacer(couche, sens) {
    const rang = ordre.indexOf(couche);
    const cible = rang + sens;
    if (cible < 0 || cible >= ordre.length) return;
    ordre = [...ordre];
    [ordre[rang], ordre[cible]] = [ordre[cible], ordre[rang]];
    rafraichir();
  }

  function remplirListe() {
    liste.replaceChildren();
    ordre.forEach((couche, rang) => {
      const ligne = html('li', { classe: 'couches-ligne' }, liste);
      ligne.addEventListener('pointerenter', () => marquerSurvol(couche.id));
      ligne.addEventListener('pointerleave', () => marquerSurvol(null));
      const etiquette = html('label', { classe: 'couches-etiquette' }, ligne);
      const caseVisible = html('input', { type: 'checkbox' }, etiquette);
      caseVisible.checked = visibles.has(couche.id);
      caseVisible.addEventListener('change', () => {
        if (caseVisible.checked) visibles.add(couche.id);
        else visibles.delete(couche.id);
        rafraichir();
      });
      html('span', { classe: `couches-icone geo-icone-${couche.id}`, texte: ICONES_GEOMETRIE[couche.geometrie], title: couche.geometrie }, etiquette);
      const nom = html('span', { classe: 'couches-nom' }, etiquette);
      html('span', { texte: couche.nom }, nom);
      html('small', { texte: `${couche.theme} · ${couche.geometrie}` }, nom);
      const fleches = html('span', { classe: 'couches-fleches' }, ligne);
      const monter = bouton(fleches, '▲', () => deplacer(couche, -1), { titre: 'Monter la couche' });
      const descendre = bouton(fleches, '▼', () => deplacer(couche, 1), { titre: 'Descendre la couche' });
      monter.disabled = rang === 0;
      descendre.disabled = rang === ordre.length - 1;
    });
  }

  function marquerSurvol(id) {
    for (const [cle, groupe] of groupes) groupe.classList.toggle('survol', cle === id);
  }

  function remplirTable() {
    table.replaceChildren();
    if (!choisi || !visibles.has(choisi.couche.id)) {
      html('p', { classe: 'anim-info', texte: 'Clique un objet de la carte pour ouvrir sa table d’attributs.' }, table);
      return;
    }
    const { couche, objet } = choisi;
    const tableau = html('table', { classe: 'anim-tableau anim-apparait' }, table);
    const entete = html('thead', {}, tableau);
    const ligneEntete = html('tr', {}, entete);
    html('th', { texte: couche.nom }, ligneEntete);
    html('th', { texte: 'valeur' }, ligneEntete);
    const corps = html('tbody', {}, tableau);
    const geometrie = html('tr', { classe: 'couches-ligne-geometrie' }, corps);
    html('td', { texte: 'géométrie' }, geometrie);
    const sommets = objet.forme.length;
    html('td', { texte: couche.geometrie === 'point' ? `point (${objet.forme[0].join(' ; ')})` : `${couche.geometrie}, ${sommets} sommets` }, geometrie);
    for (const [champ, valeur] of Object.entries(objet.attributs)) {
      const ligne = html('tr', {}, corps);
      html('td', { texte: champ }, ligne);
      html('td', { texte: String(valeur) }, ligne);
    }
  }

  function ecrireMessage() {
    const problemes = problemesOrdre(ordre, visibles);
    if (!visibles.size) {
      message.innerHTML = 'Toutes les couches sont éteintes : coche-en une dans le panneau.';
      return;
    }
    if (!problemes.length) {
      message.innerHTML = '<strong>Bon ordre :</strong> points en haut, puis lignes, puis surfaces (les plus grandes en bas). Rien n’est caché.';
      return;
    }
    const [{ dessus, dessous }] = problemes;
    const vue = ecart < 0.35 ? ' Écarte les couches pour voir ce qu’il y a dessous.' : ' En vue éclatée, on voit que chaque couche est une feuille posée sur les autres.';
    message.innerHTML = `<span class="anim-alerte">${dessus.nom}</span> (${dessus.geometrie}) est au-dessus de <strong>${dessous.nom}</strong> (${dessous.geometrie}) : il le cache en partie.${problemes.length > 1 ? ` ${problemes.length} problèmes d’ordre en tout.` : ''}${vue}`;
  }

  function rafraichir() {
    const dessous = [...ordre].reverse();
    for (const couche of dessous) {
      const groupe = groupes.get(couche.id);
      groupe.style.display = visibles.has(couche.id) ? '' : 'none';
      dessin.appendChild(groupe);
    }
    for (const forme of dessin.querySelectorAll('.couches-objet')) forme.classList.toggle('choisi', forme === choisi?.forme);
    remplirListe();
    remplirTable();
    placer();
  }

  rafraichir();
}

const GRS80 = { a: 6378137, e: 0.0818191910428158 };
const LAMBERT93 = { latitude0: 46.5, longitude0: 3, latitude1: 44, latitude2: 49, x0: 700000, y0: 6600000 };

function radians(degres) {
  return (degres * Math.PI) / 180;
}

function facteurM(phi) {
  return Math.cos(phi) / Math.sqrt(1 - (GRS80.e * Math.sin(phi)) ** 2);
}

function facteurT(phi) {
  const s = GRS80.e * Math.sin(phi);
  return Math.tan(Math.PI / 4 - phi / 2) / ((1 - s) / (1 + s)) ** (GRS80.e / 2);
}

const constantesLambert = (() => {
  const phi1 = radians(LAMBERT93.latitude1);
  const phi2 = radians(LAMBERT93.latitude2);
  const n = Math.log(facteurM(phi1) / facteurM(phi2)) / Math.log(facteurT(phi1) / facteurT(phi2));
  const f = facteurM(phi1) / (n * facteurT(phi1) ** n);
  const rho0 = GRS80.a * f * facteurT(radians(LAMBERT93.latitude0)) ** n;
  return { n, f, rho0 };
})();

export function versLambert93(latitude, longitude) {
  const { n, f, rho0 } = constantesLambert;
  const rho = GRS80.a * f * facteurT(radians(latitude)) ** n;
  const theta = n * (radians(longitude) - radians(LAMBERT93.longitude0));
  return { x: LAMBERT93.x0 + rho * Math.sin(theta), y: LAMBERT93.y0 + rho0 - rho * Math.cos(theta) };
}

export function depuisLambert93(x, y) {
  const { n, f, rho0 } = constantesLambert;
  const dx = x - LAMBERT93.x0;
  const dy = rho0 - (y - LAMBERT93.y0);
  const rho = Math.hypot(dx, dy);
  const t = (rho / (GRS80.a * f)) ** (1 / n);
  let phi = Math.PI / 2 - 2 * Math.atan(t);
  for (let i = 0; i < 12; i += 1) {
    const s = GRS80.e * Math.sin(phi);
    phi = Math.PI / 2 - 2 * Math.atan(t * ((1 - s) / (1 + s)) ** (GRS80.e / 2));
  }
  return { latitude: (phi * 180) / Math.PI, longitude: LAMBERT93.longitude0 + (Math.atan2(dx, dy) / n) * (180 / Math.PI) };
}

export function distanceKm(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y) / 1000;
}

export function kmParDegreLongitude(latitude) {
  return 111.32 * Math.cos(radians(latitude));
}

export function cadrage(points, largeur, hauteur, marge = 20) {
  const xs = points.map(({ x }) => x);
  const ys = points.map(({ y }) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const etendueX = Math.max(...xs) - minX;
  const etendueY = Math.max(...ys) - minY;
  const facteur = Math.min((largeur - 2 * marge) / etendueX, (hauteur - 2 * marge) / etendueY);
  const decalageX = (largeur - etendueX * facteur) / 2;
  const decalageY = (hauteur - etendueY * facteur) / 2;
  return {
    facteur,
    versSvg: ({ x, y }) => ({ x: decalageX + (x - minX) * facteur, y: hauteur - decalageY - (y - minY) * facteur }),
    depuisSvg: ({ x, y }) => ({ x: minX + (x - decalageX) / facteur, y: minY + (hauteur - decalageY - y) / facteur }),
  };
}

export function pointAuBord(depart, cible, largeur, hauteur, marge = 0) {
  const dx = cible.x - depart.x;
  const dy = cible.y - depart.y;
  const limites = [];
  if (dx > 0) limites.push((largeur - marge - depart.x) / dx);
  if (dx < 0) limites.push((marge - depart.x) / dx);
  if (dy > 0) limites.push((hauteur - marge - depart.y) / dy);
  if (dy < 0) limites.push((marge - depart.y) / dy);
  const k = Math.min(1, ...limites);
  return { x: depart.x + dx * k, y: depart.y + dy * k };
}

export const CONTOUR_FRANCE = [
  [1.6, 50.95], [2.55, 51.08], [3.1, 50.78], [4.15, 50.25], [4.85, 50.15], [5.8, 49.55], [6.4, 49.47], [7.6, 49.05],
  [8.2, 48.97], [7.55, 47.6], [6.85, 47.4], [6.05, 46.45], [6.8, 45.95], [7.1, 45.25], [6.65, 44.8], [7.0, 44.2],
  [7.5, 43.78], [7.1, 43.55], [6.2, 43.1], [5.35, 43.2], [4.6, 43.4], [3.5, 43.27], [3.05, 42.6], [3.17, 42.43],
  [1.7, 42.5], [0.7, 42.7], [-0.6, 42.8], [-1.78, 43.37], [-1.45, 43.6], [-1.2, 44.6], [-1.1, 45.6], [-1.25, 46.15],
  [-2.15, 46.85], [-2.2, 47.25], [-2.9, 47.5], [-4.35, 47.8], [-4.75, 48.35], [-4.45, 48.65], [-3.0, 48.82], [-2.0, 48.65],
  [-1.5, 48.65], [-1.6, 49.3], [-1.9, 49.7], [-1.25, 49.65], [-1.1, 49.35], [0.2, 49.4], [0.1, 49.7], [1.4, 50.1],
];

export const CONTOUR_CORSE = [[9.4, 43.0], [9.55, 42.1], [9.2, 41.37], [8.6, 41.7], [8.7, 42.6]];

export const VILLES = [
  { nom: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { nom: 'Lille', latitude: 50.6292, longitude: 3.0573 },
  { nom: 'Strasbourg', latitude: 48.5734, longitude: 7.7521 },
  { nom: 'Brest', latitude: 48.3904, longitude: -4.4861 },
  { nom: 'Nantes', latitude: 47.2184, longitude: -1.5536 },
  { nom: 'Lyon', latitude: 45.764, longitude: 4.8357 },
  { nom: 'Bordeaux', latitude: 44.8378, longitude: -0.5792 },
  { nom: 'Toulouse', latitude: 43.6047, longitude: 1.4442 },
  { nom: 'Marseille', latitude: 43.2965, longitude: 5.3698 },
];

function degres(valeur, positif, negatif) {
  return `${nombre(Math.abs(valeur), 4)}° ${valeur >= 0 ? positif : negatif}`;
}

function metres(valeur) {
  return `${nombre(Math.round(valeur), 0)} m`;
}

function creerCoordonnees(zone, options) {
  const largeur = 560;
  const hauteur = 520;
  const contour = CONTOUR_FRANCE.map(([longitude, latitude]) => versLambert93(latitude, longitude));
  const corse = CONTOUR_CORSE.map(([longitude, latitude]) => versLambert93(latitude, longitude));
  const vue = cadrage([...contour, ...corse], largeur, hauteur, 24);
  const villes = VILLES.map((ville) => ({ ...ville, lambert: versLambert93(ville.latitude, ville.longitude) }));
  const identifiant = identifiantUnique('coordonnees');
  const affichage = { graticule: true, quadrillage: false };
  let mode = ['lire', 'distance', 'piege'].includes(options.mode) ? options.mode : 'lire';
  let marqueur = villes[0].lambert;
  let selection = [villes[0], villes.at(-1)];

  const barre = commandes(zone);
  choix(barre, {
    options: [
      { valeur: 'lire', texte: 'Lire les coordonnées' },
      { valeur: 'distance', texte: 'Mesurer une distance' },
      { valeur: 'piege', texte: 'Le piège du mélange' },
    ],
    valeur: mode,
    auChangement: (valeur) => {
      mode = valeur;
      dessinerDessus();
    },
  });
  const legende = html('div', { classe: 'anim-legende-series' }, zone);
  for (const [cle, texte, teinte] of [['graticule', 'Méridiens et parallèles (tous les 1°)', 'var(--ansi-magenta)'], ['quadrillage', 'Quadrillage Lambert 93 (100 km)', 'var(--ansi-vert)']]) {
    const element = html('button', { type: 'button', classe: `anim-serie${affichage[cle] ? ' actif' : ''}`, style: `--serie: ${teinte}` }, legende);
    html('span', { classe: 'anim-serie-pastille' }, element);
    html('span', { texte }, element);
    element.addEventListener('click', () => {
      affichage[cle] = !affichage[cle];
      element.classList.toggle('actif', affichage[cle]);
      dessinerFond();
    });
  }

  const dessin = creerSvg(zone, largeur, hauteur, 'coord-svg');
  const defs = svg('defs', {}, dessin);
  const decoupe = svg('clipPath', { id: `${identifiant}-cadre` }, defs);
  svg('rect', { x: 0, y: 0, width: largeur, height: hauteur, rx: 10 }, decoupe);
  const marqueurFleche = svg('marker', { id: `${identifiant}-fleche`, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
  svg('path', { d: 'M0,0 L10,5 L0,10 z', classe: 'coord-pointe' }, marqueurFleche);
  const fond = svg('g', {}, dessin);
  const dessus = svg('g', {}, dessin);
  const capture = svg('rect', { x: 0, y: 0, width: largeur, height: hauteur, classe: 'coord-capture' }, dessin);
  glisser(dessin, capture, (point) => {
    marqueur = vue.depuisSvg({ x: Math.min(largeur - 4, Math.max(4, point.x)), y: Math.min(hauteur - 4, Math.max(4, point.y)) });
    dessinerDessus();
  });
  const fiches = html('div', { classe: 'coord-fiches' }, zone);
  const texte = info(zone);

  const enSvg = (point) => vue.versSvg(point);
  const chemin = (points, ferme = true) => `M${points.map((point) => {
    const { x, y } = enSvg(point);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' L')}${ferme ? ' Z' : ''}`;

  function dessinerFond() {
    fond.replaceChildren();
    svg('rect', { x: 0, y: 0, width: largeur, height: hauteur, rx: 10, classe: 'coord-mer' }, fond);
    const grilles = svg('g', { 'clip-path': `url(#${identifiant}-cadre)` }, fond);
    if (affichage.quadrillage) {
      for (let x = 0; x <= 1300000; x += 100000) svg('path', { d: chemin([{ x, y: 6000000 }, { x, y: 7200000 }], false), classe: 'coord-quadrillage' }, grilles);
      for (let y = 6000000; y <= 7200000; y += 100000) svg('path', { d: chemin([{ x: 0, y }, { x: 1300000, y }], false), classe: 'coord-quadrillage' }, grilles);
    }
    if (affichage.graticule) {
      for (let latitude = 41; latitude <= 52; latitude += 1) {
        const points = [];
        for (let longitude = -7; longitude <= 11; longitude += 0.5) points.push(versLambert93(latitude, longitude));
        svg('path', { d: chemin(points, false), classe: 'coord-graticule' }, grilles);
      }
      for (let longitude = -6; longitude <= 10; longitude += 1) {
        const points = [];
        for (let latitude = 40.5; latitude <= 52; latitude += 0.5) points.push(versLambert93(latitude, longitude));
        svg('path', { d: chemin(points, false), classe: `coord-graticule${longitude === LAMBERT93.longitude0 ? ' coord-meridien-central' : ''}` }, grilles);
      }
    }
    svg('path', { d: chemin(contour), classe: 'coord-terre' }, fond);
    svg('path', { d: chemin(corse), classe: 'coord-terre' }, fond);
  }

  function dessinerDessus() {
    dessus.replaceChildren();
    capture.style.display = mode === 'lire' ? '' : 'none';
    if (mode === 'lire') dessinerLecture();
    else if (mode === 'distance') dessinerDistance();
    else dessinerPiege();
  }

  function dessinerVilles(cliquables) {
    for (const ville of villes) {
      const { x, y } = enSvg(ville.lambert);
      const choisie = cliquables && selection.includes(ville);
      const groupe = svg('g', { classe: `coord-ville${cliquables ? ' cliquable' : ''}${choisie ? ' choisie' : ''}` }, dessus);
      svg('circle', { cx: x, cy: y, r: 4.5, classe: 'coord-ville-point' }, groupe);
      svg('text', { x: x + 7, y: y - 6, classe: 'coord-ville-nom', texte: ville.nom }, groupe);
      if (cliquables) {
        const zoneClic = svg('circle', { cx: x, cy: y, r: 16, classe: 'coord-zone-clic' }, groupe);
        zoneClic.addEventListener('click', () => choisirVille(ville));
      }
    }
  }

  function dessinerLecture() {
    dessinerVilles(false);
    const { x, y } = enSvg(marqueur);
    svg('line', { x1: 0, x2: x, y1: y, y2: y, classe: 'anim-repere' }, dessus);
    svg('line', { x1: x, x2: x, y1: y, y2: hauteur, classe: 'anim-repere' }, dessus);
    svg('text', { x: 6, y: y - 5, classe: 'coord-axe-texte', texte: `Y = ${nombre(marqueur.y / 1000, 0)} km` }, dessus);
    svg('text', { x: Math.min(x + 5, largeur - 100), y: hauteur - 8, classe: 'coord-axe-texte', texte: `X = ${nombre(marqueur.x / 1000, 0)} km` }, dessus);
    svg('circle', { cx: x, cy: y, r: 12, classe: 'coord-marqueur-halo' }, dessus);
    svg('circle', { cx: x, cy: y, r: 6, classe: 'anim-poignee' }, dessus);
    const geographique = depuisLambert93(marqueur.x, marqueur.y);
    const proche = villes.map((ville) => ({ ville, distance: distanceKm(ville.lambert, marqueur) })).sort((a, b) => a.distance - b.distance)[0];
    remplirFiches([
      { titre: 'WGS 84 · EPSG:4326', sous: 'coordonnées géographiques (GPS)', lignes: [`latitude ${degres(geographique.latitude, 'N', 'S')}`, `longitude ${degres(geographique.longitude, 'E', 'O')}`], unite: 'en degrés', classe: 'coord-fiche-degres' },
      { titre: 'Lambert 93 · EPSG:2154', sous: 'coordonnées projetées (France)', lignes: [`X = ${metres(marqueur.x)}`, `Y = ${metres(marqueur.y)}`], unite: 'en mètres', classe: 'coord-fiche-metres' },
    ]);
    texte.innerHTML = `Fais glisser le point sur la carte : il est à <strong>${nombre(proche.distance, 0)} km</strong> de ${proche.ville.nom}. Un même lieu s’écrit de deux façons : en degrés sur le globe, en mètres sur la carte aplatie. Le méridien en gras (3° E) est le centre du Lambert 93, où X = 700 000 m.`;
  }

  function choisirVille(ville) {
    selection = selection.length === 1 && selection[0] !== ville ? [selection[0], ville] : [ville];
    dessinerDessus();
  }

  function dessinerDistance() {
    if (selection.length === 2) {
      const [a, b] = selection.map((ville) => enSvg(ville.lambert));
      svg('path', { d: `M${a.x},${a.y} L${b.x},${a.y} L${b.x},${b.y}`, classe: 'coord-pythagore' }, dessus);
      svg('line', { x1: a.x, x2: b.x, y1: a.y, y2: b.y, classe: 'coord-trajet' }, dessus);
    }
    dessinerVilles(true);
    if (selection.length < 2) {
      remplirFiches([]);
      texte.innerHTML = `Départ : <strong>${selection[0].nom}</strong>. Clique une deuxième ville.`;
      return;
    }
    const [a, b] = selection;
    const km = distanceKm(a.lambert, b.lambert);
    const latitudeMoyenne = (a.latitude + b.latitude) / 2;
    remplirFiches([
      { titre: 'En mètres (Lambert 93)', sous: 'on calcule directement', lignes: [`ΔX = ${metres(Math.abs(b.lambert.x - a.lambert.x))}`, `ΔY = ${metres(Math.abs(b.lambert.y - a.lambert.y))}`, `√(ΔX² + ΔY²) ≈ ${nombre(km, 0)} km`], unite: 'Pythagore suffit', classe: 'coord-fiche-metres' },
      { titre: 'En degrés (WGS 84)', sous: 'impossible à combiner tel quel', lignes: [`Δlatitude = ${nombre(Math.abs(b.latitude - a.latitude), 2)}°`, `Δlongitude = ${nombre(Math.abs(b.longitude - a.longitude), 2)}°`, `1° de longitude ≈ ${nombre(kmParDegreLongitude(latitudeMoyenne), 0)} km ici`], unite: 'mais 1° de latitude ≈ 111 km', classe: 'coord-fiche-degres' },
    ]);
    texte.innerHTML = `<strong>${a.nom} → ${b.nom} : ${nombre(km, 0)} km</strong> à vol d’oiseau. Clique une ville pour un nouveau départ. Le Lambert 93 est en mètres : une distance se calcule directement. En degrés, c’est impossible tel quel, car un degré de longitude n’a pas la même longueur partout.`;
  }

  function dessinerPiege() {
    dessinerVilles(false);
    const paris = villes[0];
    const depart = enSvg(paris.lambert);
    const lu = { x: paris.longitude, y: paris.latitude };
    const bord = pointAuBord(depart, enSvg(lu), largeur, hauteur, 18);
    const geographique = depuisLambert93(lu.x, lu.y);
    const kilometres = distanceKm(paris.lambert, lu);
    svg('path', { d: `M${depart.x},${depart.y} L${bord.x},${bord.y}`, classe: 'coord-fleche-piege', 'marker-end': `url(#${identifiant}-fleche)` }, dessus);
    svg('rect', { x: depart.x - 9, y: depart.y - 9, width: 18, height: 18, rx: 3, classe: 'coord-couche-bonne' }, dessus);
    const perdue = svg('rect', { x: depart.x - 9, y: depart.y - 9, width: 18, height: 18, rx: 3, classe: 'coord-couche-perdue' }, dessus);
    attendre(perdue, 60).then(() => {
      perdue.style.transform = `translate(${(bord.x - depart.x).toFixed(1)}px, ${(bord.y - depart.y).toFixed(1)}px)`;
      perdue.style.opacity = '0.15';
    }).catch(() => {});
    svg('text', { x: Math.min(bord.x + 14, largeur - 200), y: bord.y - 8, classe: 'coord-texte-piege', texte: `encore ${nombre(kilometres, 0)} km par là…` }, dessus);
    remplirFiches([
      { titre: 'Bien déclarée', sous: 'BATIMENT en EPSG:2154', lignes: [`X = ${metres(paris.lambert.x)}`, `Y = ${metres(paris.lambert.y)}`], unite: 'tombe sur Paris', classe: 'coord-fiche-metres' },
      { titre: 'Mal déclarée', sous: 'des degrés lus comme des mètres', lignes: [`X = ${nombre(lu.x, 4)} m`, `Y = ${nombre(lu.y, 4)} m`], unite: 'tombe près de l’origine du Lambert 93', classe: 'coord-fiche-erreur' },
    ]);
    texte.innerHTML = `Une couche en degrés (2,35 ; 48,86) ouverte comme si c’était du Lambert 93 est placée à 2 m et 49 m de l’origine du système : à <strong>${nombre(kilometres, 0)} km</strong> de Paris, en plein océan Atlantique au large de l’Afrique (latitude ${nombre(geographique.latitude, 1)}°, longitude ${nombre(geographique.longitude, 1)}°). D’où la règle : tout doit être en <strong>EPSG:2154</strong>, à vérifier en bas à droite de QGIS.`;
  }

  function remplirFiches(liste) {
    fiches.replaceChildren();
    for (const fiche of liste) {
      const carte = html('div', { classe: `coord-fiche ${fiche.classe}` }, fiches);
      html('strong', { texte: fiche.titre }, carte);
      html('small', { texte: fiche.sous }, carte);
      for (const ligne of fiche.lignes) html('code', { texte: ligne }, carte);
      html('span', { classe: 'coord-unite', texte: fiche.unite }, carte);
    }
  }

  dessinerFond();
  dessinerDessus();
}

export const FICHIERS_SHAPEFILE = [
  { extension: 'shp', role: 'les formes' },
  { extension: 'shx', role: 'l’index des formes' },
  { extension: 'dbf', role: 'la table des attributs' },
  { extension: 'prj', role: 'le système de coordonnées' },
  { extension: 'cpg', role: 'l’encodage des caractères' },
];

const RAISONS_BLOQUANTES = {
  shp: 'sans .shp, il n’y a plus aucune forme',
  shx: 'sans .shx, QGIS ne retrouve plus les formes dans le .shp',
  dbf: 'sans .dbf, la table des attributs a disparu',
};

export function etatShapefile(presents) {
  const a = (extension) => presents.includes(extension);
  const raisons = Object.keys(RAISONS_BLOQUANTES).filter((extension) => !a(extension)).map((extension) => RAISONS_BLOQUANTES[extension]);
  if (raisons.length) return { ouvrable: false, systeme: null, accents: false, raisons };
  return { ouvrable: true, systeme: a('prj') ? 'EPSG:2154' : null, accents: a('cpg'), raisons: [] };
}

const WINDOWS_1252 = {
  0x80: '€', 0x82: '‚', 0x83: 'ƒ', 0x84: '„', 0x85: '…', 0x86: '†', 0x87: '‡', 0x88: 'ˆ', 0x89: '‰', 0x8a: 'Š', 0x8b: '‹', 0x8c: 'Œ', 0x8e: 'Ž',
  0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—', 0x98: '˜', 0x99: '™', 0x9a: 'š', 0x9b: '›', 0x9c: 'œ', 0x9e: 'ž', 0x9f: 'Ÿ',
};

export function mojibake(texte) {
  return [...new TextEncoder().encode(String(texte))].map((octet) => WINDOWS_1252[octet] ?? String.fromCharCode(octet)).join('');
}

export const BATIMENTS_SHAPEFILE = [
  { nom: 'Hôtel de Ville', usage: 'Administratif', forme: [[30, 30], [78, 26], [80, 60], [32, 64]] },
  { nom: 'Église Saint-Eustache', usage: 'Religieux', forme: [[100, 20], [150, 18], [152, 48], [102, 52]] },
  { nom: 'Forum des Halles', usage: 'Équipement commercial', forme: [[96, 70], [170, 66], [172, 100], [98, 104]] },
];

function creerShapefile(zone) {
  const presents = new Set(FICHIERS_SHAPEFILE.map(({ extension }) => extension));

  const fichiers = html('div', { classe: 'shp-fichiers' }, zone);
  const boutons = FICHIERS_SHAPEFILE.map((fichier) => {
    const element = html('button', { type: 'button', classe: 'shp-fichier', 'aria-pressed': 'true' }, fichiers);
    html('span', { classe: 'shp-fichier-icone', texte: `.${fichier.extension}` }, element);
    html('span', { classe: 'shp-fichier-nom', texte: `BATIMENT.${fichier.extension}` }, element);
    html('small', { texte: fichier.role }, element);
    element.addEventListener('click', () => {
      if (presents.has(fichier.extension)) presents.delete(fichier.extension);
      else presents.add(fichier.extension);
      mettreAJour();
    });
    return { fichier, element };
  });
  const barre = commandes(zone);
  bouton(barre, 'Remettre les 5 fichiers', () => {
    for (const { extension } of FICHIERS_SHAPEFILE) presents.add(extension);
    mettreAJour();
  });
  html('span', { classe: 'chrono-vitesse', texte: 'Clique un fichier pour l’enlever du dossier.' }, barre);

  const fenetre = html('div', { classe: 'shp-fenetre' }, zone);
  const titre = html('div', { classe: 'shp-fenetre-titre' }, fenetre);
  html('span', { classe: 'shp-pastilles', 'aria-hidden': 'true' }, titre);
  html('span', { texte: 'QGIS · BATIMENT' }, titre);
  const contenu = html('div', { classe: 'shp-fenetre-contenu' }, fenetre);
  const carte = creerSvg(contenu, 200, 120, 'shp-carte');
  const table = html('div', { classe: 'shp-table' }, contenu);
  const statut = html('div', { classe: 'shp-statut' }, fenetre);
  const etatTexte = html('span', {}, statut);
  const systeme = html('span', { classe: 'shp-systeme' }, statut);
  const message = info(zone);

  function mettreAJour() {
    for (const { fichier, element } of boutons) {
      const present = presents.has(fichier.extension);
      element.classList.toggle('absent', !present);
      element.setAttribute('aria-pressed', String(present));
    }
    const etat = etatShapefile([...presents]);
    carte.replaceChildren();
    table.replaceChildren();
    contenu.classList.remove('anim-apparait');
    void contenu.offsetWidth;
    contenu.classList.add('anim-apparait');
    svg('rect', { x: 0, y: 0, width: 200, height: 120, rx: 6, classe: 'shp-fond' }, carte);
    if (!etat.ouvrable) {
      svg('text', { x: 100, y: 58, 'text-anchor': 'middle', classe: 'shp-croix', texte: '✕' }, carte);
      svg('text', { x: 100, y: 84, 'text-anchor': 'middle', classe: 'shp-carte-texte', texte: 'Couche invalide' }, carte);
      html('p', { classe: 'shp-vide', texte: 'Aucune donnée à afficher.' }, table);
      etatTexte.textContent = 'Impossible d’ouvrir la couche';
      systeme.textContent = 'EPSG : —';
      systeme.classList.add('inconnu');
      message.innerHTML = `<span class="anim-alerte">Couche inutilisable :</span> ${etat.raisons.join(' ; ')}. Les fichiers d’une couche vont toujours ensemble.`;
      return;
    }
    const decale = !etat.systeme;
    const groupe = svg('g', { classe: decale ? 'shp-decale' : '' }, carte);
    for (const batiment of BATIMENTS_SHAPEFILE) {
      if (decale) svg('polygon', { points: batiment.forme.map((point) => point.join(',')).join(' '), classe: 'shp-fantome' }, carte);
      svg('polygon', { points: batiment.forme.map((point) => point.join(',')).join(' '), classe: 'shp-batiment' }, groupe);
    }
    if (decale) svg('text', { x: 186, y: 112, 'text-anchor': 'end', classe: 'shp-carte-texte', texte: 'bien placée ?' }, carte);
    const tableau = html('table', { classe: 'anim-tableau' }, table);
    const entete = html('tr', {}, html('thead', {}, tableau));
    html('th', { texte: 'nom' }, entete);
    html('th', { texte: 'usage' }, entete);
    const corps = html('tbody', {}, tableau);
    for (const batiment of BATIMENTS_SHAPEFILE) {
      const ligne = html('tr', {}, corps);
      for (const valeur of [batiment.nom, batiment.usage]) {
        html('td', { classe: etat.accents ? '' : 'shp-casse', texte: etat.accents ? valeur : mojibake(valeur) }, ligne);
      }
    }
    etatTexte.textContent = `${BATIMENTS_SHAPEFILE.length} entités`;
    systeme.textContent = etat.systeme ? etat.systeme : 'EPSG : ?';
    systeme.classList.toggle('inconnu', decale);
    const remarques = [];
    if (decale) remarques.push('<strong>sans .prj</strong>, QGIS ne sait pas dans quel système sont les coordonnées : la couche risque d’être décalée par rapport aux autres');
    if (!etat.accents) remarques.push('<strong>sans .cpg</strong>, QGIS ne sait pas lire les caractères : les accents de la table deviennent illisibles');
    message.innerHTML = remarques.length
      ? `La couche s’ouvre, mais ${remarques.join(' ; et ')}.`
      : '<strong>Les 5 fichiers sont là :</strong> les formes, leur index, la table, le système (EPSG:2154) et les accents sont corrects.';
  }

  mettreAJour();
}

export const animationsAnglais = {
  'frise-des-temps': {
    titre: 'La frise des temps',
    consigne: 'Clique un temps pour voir où il se place par rapport à maintenant, puis passe au jeu : quel temps va dans la phrase ?',
    creer: creerFriseDesTemps,
  },
  'cartes-vocabulaire': {
    titre: 'Cartes de vocabulaire',
    badge: 'Jeu',
    consigne: 'Retourne la carte, puis dis honnêtement si tu savais. Les mots ratés reviennent à la fin du paquet.',
    creer: creerCartesVocabulaire,
  },
  'chrono-toeic': {
    titre: 'Le chrono du Reading',
    consigne: 'Règle ton rythme dans chaque partie, puis lance le chrono : as-tu le temps de finir la partie 7 ?',
    creer: creerChronoToeic,
  },
  couches: {
    titre: 'Les couches dans QGIS',
    consigne: 'Écarte les couches pour voir l’empilement, allume ou éteins-les, change leur ordre avec ▲ ▼ et clique un objet pour lire ses attributs.',
    creer: creerCouches,
  },
  shapefile: {
    titre: 'Un Shapefile, cinq fichiers',
    consigne: 'Enlève un fichier du dossier et regarde ce que QGIS en fait.',
    creer: creerShapefile,
  },
  coordonnees: {
    titre: 'Degrés ou mètres ? Le Lambert 93',
    consigne: 'Déplace le point, mesure une distance entre deux villes, puis découvre ce qui arrive quand on mélange deux systèmes.',
    creer: creerCoordonnees,
  },
};
