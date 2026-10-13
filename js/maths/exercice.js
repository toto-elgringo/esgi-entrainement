import { versLatex } from './expression.js';
import { colorerCode, echapper, rendreLatex, rendreMarkdown, rendreMarkdownEnLigne } from '../outils.js';
import { cleExercice, estReussi, lienExercice, voisins } from '../parcours.js';
import { lireSaisie, variableDe, verifierQuestion } from './verification.js';

const LETTRES = 'abcdefghijklmnopqrstuvwxyz';

function aideSaisie(question) {
  const v = variableDe(question);
  const aides = {
    nombre: 'Un nombre : 12, 2.5, 1/3, ln(2), e^2, sqrt(3)…',
    expression: `Une expression en ${v} : 3${v}^2 + 2${v}, e^(2${v}), ln(${v})…`,
    ensemble: 'Un ensemble : {1, 2, 3} (ordre libre), {} pour l’ensemble vide',
    vecteur: 'Un vecteur : (2, -1, 0)',
    texte: 'Un mot ou une courte expression',
  };
  return aides[question.type] ?? '';
}

function etoiles(difficulte) {
  return `<span class="difficulte" title="Difficulté ${difficulte} sur 3">${'●'.repeat(difficulte)}${'○'.repeat(3 - difficulte)}</span>`;
}

function champ(question, index, saisie) {
  if (question.type === 'choix') {
    const options = question.choix
      .map((texte, position) => `
        <label class="option">
          <input type="radio" name="q${index}" value="${position}" ${String(saisie) === String(position) ? 'checked' : ''}>
          <span>${rendreMarkdownEnLigne(texte)}</span>
        </label>`)
      .join('');
    return `<div class="options">${options}</div>`;
  }
  if (question.type === 'auto') {
    return `
      <textarea class="saisie saisie-longue" data-saisie="${index}" rows="4" placeholder="Écris ta réponse ici, puis clique sur « Vérifier » pour la comparer à la correction.">${echapper(saisie ?? '')}</textarea>
      <div class="modele" data-modele="${index}" hidden></div>`;
  }
  return `
    <input class="saisie" data-saisie="${index}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
      placeholder="${echapper(aideSaisie(question))}" value="${echapper(saisie ?? '')}">
    <div class="apercu" data-apercu="${index}"></div>`;
}

function blocQuestion(question, index, total, saisie) {
  const prefixe = total > 1 ? `<span class="lettre">${LETTRES[index]})</span> ` : '';
  const intitule = question.intitule || total > 1
    ? `<div class="intitule">${prefixe}${rendreMarkdownEnLigne(question.intitule ?? '')}</div>`
    : '';
  return `
    <div class="question-maths" data-question="${index}">
      ${intitule}
      ${champ(question, index, saisie)}
      <div class="retour" data-retour="${index}"></div>
    </div>`;
}

function lienVoisin(exercice, sens) {
  if (!exercice) return '<span></span>';
  const texte = sens === 'precedent' ? `← ${echapper(exercice.titre)}` : `${echapper(exercice.titre)} →`;
  return `<a class="bouton discret" href="${lienExercice(exercice)}">${texte}</a>`;
}

export function afficherExerciceMaths(ctx, chapitre, exercice) {
  const cle = cleExercice(chapitre.cle, exercice.id);
  const saisies = ctx.saisies(cle);
  const indices = exercice.indices ?? [];
  const { precedent, suivant } = voisins(ctx.chapitres, chapitre.cle, exercice.id);
  let reussi = estReussi(ctx.progression, chapitre.cle, exercice.id);
  let indicesAffiches = 0;

  ctx.conteneur.innerHTML = `
    <section class="exercice-maths">
      <p class="fil">${echapper(chapitre.titre)}</p>
      <h1>${echapper(exercice.titre)}</h1>
      <div class="meta">${etoiles(exercice.difficulte)}<span class="badge-reussi" data-badge ${reussi ? '' : 'hidden'}>Réussi</span></div>
      <div class="markdown enonce">${rendreMarkdown(exercice.enonce)}</div>
      <form class="questions" data-formulaire novalidate>
        ${exercice.questions.map((question, index) => blocQuestion(question, index, exercice.questions.length, saisies[index])).join('')}
        <div class="barre-outils">
          <button type="submit" class="bouton principal">Vérifier <kbd>Entrée</kbd></button>
          <button type="button" class="bouton" data-action="indice" ${indices.length ? '' : 'hidden'}></button>
          <button type="button" class="bouton discret" data-action="correction">Voir la correction</button>
        </div>
      </form>
      <div class="resultat" data-resultat hidden></div>
      <div class="indices" data-indices></div>
      <div class="correction markdown" data-correction hidden></div>
      <nav class="navigation-exercices">${lienVoisin(precedent, 'precedent')}${lienVoisin(suivant, 'suivant')}</nav>
    </section>`;

  const racine = ctx.conteneur;
  const trouver = (selecteur) => racine.querySelector(selecteur);
  const formulaire = trouver('[data-formulaire]');
  const zoneResultat = trouver('[data-resultat]');
  const boutonIndice = trouver('[data-action="indice"]');
  const boutonCorrection = trouver('[data-action="correction"]');
  const zoneCorrection = trouver('[data-correction]');
  colorerCode(trouver('.enonce'));

  function enregistrer() {
    ctx.enregistrerSaisies(cle, saisies);
  }

  function majApercu(index) {
    const zone = trouver(`[data-apercu="${index}"]`);
    const question = exercice.questions[index];
    if (!zone || (question.type !== 'nombre' && question.type !== 'expression')) return;
    const valeur = String(saisies[index] ?? '');
    if (!valeur.trim()) {
      zone.innerHTML = '';
      return;
    }
    const arbre = lireSaisie(question, valeur);
    zone.innerHTML = arbre
      ? `Lu comme : ${rendreLatex(versLatex(arbre))}`
      : '<span class="apercu-erreur">Écriture incomplète ou non reconnue</span>';
  }

  function marquer(index, etat, message) {
    const bloc = trouver(`[data-question="${index}"]`);
    bloc.dataset.etat = etat;
    const symboles = { juste: '✓ ', faux: '✗ ', illisible: '? ', attente: '' };
    trouver(`[data-retour="${index}"]`).textContent = message ? `${symboles[etat] ?? ''}${message}` : '';
  }

  function effacerMarque(index) {
    const bloc = trouver(`[data-question="${index}"]`);
    delete bloc.dataset.etat;
    trouver(`[data-retour="${index}"]`).textContent = '';
  }

  function montrerModele(index) {
    const zone = trouver(`[data-modele="${index}"]`);
    zone.innerHTML = `
      <div class="modele-titre">Réponse attendue</div>
      <div class="markdown">${rendreMarkdown(exercice.questions[index].reponse)}</div>
      <div class="auto-evaluation">
        <span>Tu avais bon ?</span>
        <button type="button" class="bouton succes" data-evaluation="${index}" data-valeur="oui">Oui</button>
        <button type="button" class="bouton" data-evaluation="${index}" data-valeur="non">Non, à revoir</button>
      </div>`;
    zone.hidden = false;
    colorerCode(zone);
  }

  function afficherBilan(justes, total, enAttente) {
    const lienSuivant = suivant ? `<a class="bouton succes" href="${lienExercice(suivant)}">Exercice suivant →</a>` : '';
    if (justes === total) {
      zoneResultat.className = 'resultat succes';
      zoneResultat.innerHTML = `<div class="resultat-entete">Bravo, exercice réussi !${lienSuivant}</div>`;
    } else if (enAttente > 0) {
      zoneResultat.className = 'resultat info';
      zoneResultat.innerHTML = '<div class="resultat-entete">Compare ta réponse avec la réponse attendue, puis indique si tu avais bon.</div>';
    } else {
      zoneResultat.className = 'resultat erreur';
      zoneResultat.innerHTML = `<div class="resultat-entete">${justes} / ${total} bonne${justes > 1 ? 's' : ''} réponse${justes > 1 ? 's' : ''}. Corrige ce qui est en rouge.</div>`;
    }
    zoneResultat.hidden = false;
  }

  function verifierQuestionAuto(index) {
    if (!String(saisies[index] ?? '').trim()) {
      marquer(index, 'illisible', 'Écris d’abord ta réponse.');
      return 'vide';
    }
    montrerModele(index);
    const evaluation = saisies[`evaluation-${index}`];
    if (evaluation === true) {
      marquer(index, 'juste', 'Tu as indiqué que tu avais bon.');
      return 'juste';
    }
    if (evaluation === false) {
      marquer(index, 'faux', 'À revoir : compare avec la réponse attendue.');
      return 'faux';
    }
    marquer(index, 'attente', '');
    return 'attente';
  }

  function verifier() {
    let justes = 0;
    let enAttente = 0;
    exercice.questions.forEach((question, index) => {
      if (question.type === 'auto') {
        const etat = verifierQuestionAuto(index);
        if (etat === 'juste') justes++;
        if (etat === 'attente') enAttente++;
        return;
      }
      const resultat = verifierQuestion(question, saisies[index]);
      if (resultat.juste) {
        justes++;
        marquer(index, 'juste', 'Juste !');
      } else if (resultat.erreur === 'Réponse vide') {
        marquer(index, 'illisible', 'Pas encore de réponse.');
      } else if (resultat.erreur) {
        marquer(index, 'illisible', `Je n’ai pas compris ta réponse : ${resultat.erreur}`);
      } else {
        marquer(index, 'faux', 'Pas encore.');
      }
    });

    const total = exercice.questions.length;
    ctx.enregistrerEssai(cle, justes === total);
    if (justes === total) {
      reussi = true;
      trouver('[data-badge]').hidden = false;
    }
    afficherBilan(justes, total, enAttente);
  }

  function majBoutonIndice() {
    boutonIndice.textContent = `Afficher un indice (${indicesAffiches} / ${indices.length})`;
    boutonIndice.hidden = indicesAffiches >= indices.length;
  }

  function afficherIndice() {
    const indice = indices[indicesAffiches];
    if (indice === undefined) return;
    indicesAffiches++;
    trouver('[data-indices]').insertAdjacentHTML('beforeend', `<div class="indice"><p>${rendreMarkdownEnLigne(indice)}</p></div>`);
    majBoutonIndice();
  }

  function basculerCorrection() {
    if (!zoneCorrection.hidden) {
      zoneCorrection.hidden = true;
      boutonCorrection.textContent = 'Voir la correction';
      return;
    }
    if (!reussi && !confirm('Essaie encore un peu avant de regarder !\nAfficher quand même la correction ?')) return;
    zoneCorrection.innerHTML = `<h3>Correction</h3>${rendreMarkdown(exercice.correction)}`;
    zoneCorrection.hidden = false;
    boutonCorrection.textContent = 'Masquer la correction';
    colorerCode(zoneCorrection);
  }

  formulaire.addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    verifier();
  });

  formulaire.addEventListener('input', (evenement) => {
    const cible = evenement.target;
    if (cible.dataset.saisie !== undefined) {
      const index = Number(cible.dataset.saisie);
      saisies[index] = cible.value;
      if (exercice.questions[index].type === 'auto') delete saisies[`evaluation-${index}`];
      effacerMarque(index);
      majApercu(index);
    } else if (cible.type === 'radio') {
      const index = Number(cible.name.slice(1));
      saisies[index] = cible.value;
      effacerMarque(index);
    }
    enregistrer();
  });

  formulaire.addEventListener('keydown', (evenement) => {
    if (evenement.target.tagName === 'TEXTAREA' && evenement.key === 'Enter' && (evenement.ctrlKey || evenement.metaKey)) {
      evenement.preventDefault();
      formulaire.requestSubmit();
    }
  });

  formulaire.addEventListener('click', (evenement) => {
    const bouton = evenement.target.closest('[data-evaluation]');
    if (bouton) {
      saisies[`evaluation-${bouton.dataset.evaluation}`] = bouton.dataset.valeur === 'oui';
      enregistrer();
      verifier();
      return;
    }
    const action = evenement.target.closest('[data-action]')?.dataset.action;
    if (action === 'indice') afficherIndice();
    if (action === 'correction') basculerCorrection();
  });

  exercice.questions.forEach((_, index) => majApercu(index));
  majBoutonIndice();
}
