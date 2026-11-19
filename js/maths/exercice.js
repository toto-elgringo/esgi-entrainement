import { avecFormules } from '../domaines.js';
import { creerBascule, creerIndices, etoiles, navigationExercices } from '../exercice-commun.js';
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

export function etiquettesQuestion(index, total, avecIntitule) {
  const nom = total > 1 ? `Réponse ${LETTRES[index]}` : 'Réponse';
  const etiquette = avecIntitule ? `aria-labelledby="intitule-${index}"` : `aria-label="${nom}"`;
  return `${etiquette} aria-describedby="retour-${index}"`;
}

function champ(question, index, saisie, rendu, etiquettes) {
  if (question.type === 'choix') {
    const options = question.choix
      .map((texte, position) => `
        <label class="option">
          <input type="radio" name="q${index}" value="${position}" ${String(saisie) === String(position) ? 'checked' : ''}>
          <span>${rendreMarkdownEnLigne(texte, rendu)}</span>
        </label>`)
      .join('');
    return `<div class="options" role="radiogroup" ${etiquettes}>${options}</div>`;
  }
  if (question.type === 'auto') {
    return `
      <textarea class="saisie saisie-longue" data-saisie="${index}" ${etiquettes} rows="4" placeholder="Écris ta réponse ici, puis clique sur « Vérifier » pour la comparer à la correction.">${echapper(saisie ?? '')}</textarea>
      <div class="modele" data-modele="${index}" hidden></div>`;
  }
  return `
    <input class="saisie" data-saisie="${index}" ${etiquettes} type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
      placeholder="${echapper(aideSaisie(question))}" value="${echapper(saisie ?? '')}">
    <div class="apercu" data-apercu="${index}"></div>`;
}

function blocQuestion(question, index, total, saisie, options) {
  const prefixe = total > 1 ? `<span class="lettre">${LETTRES[index]})</span> ` : '';
  const avecIntitule = Boolean(question.intitule || total > 1);
  const intitule = avecIntitule
    ? `<div class="intitule" id="intitule-${index}">${prefixe}${rendreMarkdownEnLigne(question.intitule ?? '', options)}</div>`
    : '';
  return `
    <div class="question-maths" data-question="${index}">
      ${intitule}
      ${champ(question, index, saisie, options, etiquettesQuestion(index, total, avecIntitule))}
      <div class="retour" id="retour-${index}" data-retour="${index}" role="status"></div>
    </div>`;
}

export function afficherExerciceMaths(ctx, chapitre, exercice) {
  const cle = cleExercice(chapitre.cle, exercice.id);
  const saisies = ctx.saisies(cle);
  const affichage = ctx.affichage(cle);
  const indices = exercice.indices ?? [];
  const { precedent, suivant } = voisins(ctx.chapitres, chapitre.cle, exercice.id);
  let reussi = estReussi(ctx.progression, chapitre.cle, exercice.id);
  const options = { formules: avecFormules(chapitre.domaine) };

  ctx.conteneur.innerHTML = `
    <section class="exercice-maths">
      <p class="fil">${echapper(chapitre.titre)}</p>
      <h1>${echapper(exercice.titre)}</h1>
      <div class="meta">${etoiles(exercice.difficulte)}<span class="badge-reussi" data-badge ${reussi ? '' : 'hidden'}>Réussi</span></div>
      <div class="markdown enonce">${rendreMarkdown(exercice.enonce, options)}</div>
      <form class="questions" data-formulaire novalidate>
        ${exercice.questions.map((question, index) => blocQuestion(question, index, exercice.questions.length, saisies[index], options)).join('')}
        <div class="barre-outils">
          <button type="submit" class="bouton principal">Vérifier <kbd>Entrée</kbd></button>
          <button type="button" class="bouton" data-action="indice" ${indices.length ? '' : 'hidden'}></button>
          <button type="button" class="bouton discret" data-action="correction">Voir la correction</button>
        </div>
      </form>
      <div class="resultat" data-resultat role="status" hidden></div>
      <div class="indices" data-indices></div>
      <div class="correction markdown" data-correction hidden></div>
      ${navigationExercices(precedent, suivant)}
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

  function marquerChamps(index, faux) {
    for (const element of trouver(`[data-question="${index}"]`).querySelectorAll('[data-saisie], [role="radiogroup"]')) {
      if (faux) element.setAttribute('aria-invalid', 'true');
      else element.removeAttribute('aria-invalid');
    }
  }

  function marquer(index, etat, message) {
    const bloc = trouver(`[data-question="${index}"]`);
    bloc.dataset.etat = etat;
    marquerChamps(index, etat === 'faux');
    const symboles = { juste: '✓ ', faux: '✗ ', illisible: '? ', attente: '' };
    trouver(`[data-retour="${index}"]`).textContent = message ? `${symboles[etat] ?? ''}${message}` : '';
  }

  function effacerMarque(index) {
    const bloc = trouver(`[data-question="${index}"]`);
    delete bloc.dataset.etat;
    marquerChamps(index, false);
    trouver(`[data-retour="${index}"]`).textContent = '';
  }

  function montrerModele(index) {
    const zone = trouver(`[data-modele="${index}"]`);
    zone.innerHTML = `
      <div class="modele-titre">Réponse attendue</div>
      <div class="markdown">${rendreMarkdown(exercice.questions[index].reponse, options)}</div>
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

  function verifierQuestionAuto(index, reponses) {
    if (!String(reponses[index] ?? '').trim()) {
      marquer(index, 'illisible', 'Écris d’abord ta réponse.');
      return 'vide';
    }
    montrerModele(index);
    const evaluation = reponses[`evaluation-${index}`];
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

  function corriger(reponses) {
    let justes = 0;
    let enAttente = 0;
    exercice.questions.forEach((question, index) => {
      if (question.type === 'auto') {
        const etat = verifierQuestionAuto(index, reponses);
        if (etat === 'juste') justes++;
        if (etat === 'attente') enAttente++;
        return;
      }
      const resultat = verifierQuestion(question, reponses[index]);
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
    return { justes, enAttente };
  }

  function verifier() {
    const { justes, enAttente } = corriger(saisies);
    const total = exercice.questions.length;
    ctx.enregistrerEssai(cle, justes === total);
    ctx.enregistrerAffichage(cle, { corrigees: { ...saisies } });
    if (justes === total) {
      reussi = true;
      trouver('[data-badge]').hidden = false;
    }
    afficherBilan(justes, total, enAttente);
  }

  function restaurerVerification(corrigees) {
    const { justes, enAttente } = corriger(corrigees);
    exercice.questions.forEach((_, index) => {
      if (String(corrigees[index] ?? '') !== String(saisies[index] ?? '')) effacerMarque(index);
    });
    afficherBilan(justes, exercice.questions.length, enAttente);
  }

  const lesIndices = creerIndices({
    bouton: boutonIndice,
    zone: trouver('[data-indices]'),
    indices,
    rendre: (indice) => rendreMarkdownEnLigne(indice, options),
    auChangement: (nombre) => ctx.enregistrerAffichage(cle, { indices: nombre }),
  });

  function montrerCorrection() {
    zoneCorrection.innerHTML = `<h3>Correction</h3>${rendreMarkdown(exercice.correction, options)}`;
    colorerCode(zoneCorrection);
  }

  const correction = creerBascule({
    bouton: boutonCorrection,
    zone: zoneCorrection,
    libelleVoir: 'Voir la correction',
    libelleMasquer: 'Masquer la correction',
    confirmation: 'Essaie encore un peu avant de regarder !\nAfficher quand même la correction ?',
    estReussi: () => reussi,
    montrer: montrerCorrection,
    auChangement: (ouverte) => ctx.enregistrerAffichage(cle, { correction: ouverte }),
  });

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
    if (action === 'indice') lesIndices.afficher();
    if (action === 'correction') correction.basculer();
  });

  exercice.questions.forEach((_, index) => majApercu(index));
  lesIndices.restaurer(affichage.indices);
  if (affichage.corrigees) restaurerVerification(affichage.corrigees);
  if (affichage.correction) correction.ouvrir();
}
