import { chargerQuiz } from '../catalogue.js';
import { avecFormules, estDomaineCode, langageDe, langueDe, LANGAGES } from '../domaines.js';
import { colorerCode, echapper, rendreMarkdown, rendreMarkdownEnLigne } from '../outils.js';

function melanger(tableau) {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

function messageScore(bonnes, total) {
  const ratio = bonnes / total;
  if (ratio === 1) return 'Parfait, tu maîtrises ce chapitre !';
  if (ratio >= 0.75) return 'Très bien ! Relis les explications des questions ratées.';
  if (ratio >= 0.5) return 'Pas mal. Un petit tour par le cours avant de recommencer ?';
  return 'Relis le cours, puis retente le quiz.';
}

export function nouvellePartie(questions, selection = null) {
  const partie = {
    ordres: questions.map((question) => melanger(question.choix.map((_, position) => position))),
    reponses: {},
  };
  if (selection) partie.selection = [...selection];
  return partie;
}

export function questionsDeLaPartie(partie, questions) {
  return Array.isArray(partie?.selection) ? partie.selection : questions.map((_, index) => index);
}

export function partieValide(partie, questions) {
  const selectionValide = partie?.selection === undefined
    || (Array.isArray(partie.selection)
      && partie.selection.length > 0
      && partie.selection.every((index) => Number.isInteger(index) && index >= 0 && index < questions.length));
  return Array.isArray(partie?.ordres)
    && Boolean(partie.reponses)
    && typeof partie.reponses === 'object'
    && selectionValide
    && partie.ordres.length === questions.length
    && partie.ordres.every((ordre, index) => ordre.length === questions[index].choix.length);
}

export function compterBonnes(partie, questions) {
  return questionsDeLaPartie(partie, questions).filter((index) => partie.reponses[index] === questions[index].reponse).length;
}

export function compterRepondues(partie, questions) {
  return questionsDeLaPartie(partie, questions).filter((index) => partie.reponses[index] !== undefined).length;
}

export function estTerminee(partie, questions) {
  const indices = questionsDeLaPartie(partie, questions);
  return indices.length > 0 && indices.every((index) => partie.reponses[index] !== undefined);
}

export function questionsRatees(partie, questions) {
  return questionsDeLaPartie(partie, questions).filter((index) => partie.reponses[index] !== undefined && partie.reponses[index] !== questions[index].reponse);
}

export function peutReinitialiser(partie) {
  return Array.isArray(partie?.selection) || Object.keys(partie?.reponses ?? {}).length > 0;
}

export function texteCompteur(partie, questions) {
  const total = questionsDeLaPartie(partie, questions).length;
  const repondues = compterRepondues(partie, questions);
  const bonnes = compterBonnes(partie, questions);
  const position = Math.min(repondues + 1, total);
  return `Question ${position} / ${total} · ${bonnes} bonne${bonnes > 1 ? 's' : ''}`;
}

export async function afficherQuiz(ctx, chapitre) {
  const questions = await chargerQuiz(chapitre);
  if (ctx.obsolete()) return;
  const premier = chapitre.exercices[0];
  const options = { formules: avecFormules(chapitre.domaine) };
  const langue = langueDe(chapitre.domaine);
  const attributLangue = langue ? ` lang="${langue}"` : '';
  const enLigne = (texte) => rendreMarkdownEnLigne(texte, options);
  const surligneur = estDomaineCode(chapitre.domaine) ? LANGAGES[langageDe(chapitre.domaine)].surligneur : undefined;

  function blocQuestion(question, index, numero, ordre) {
    const choix = ordre
      .map((position) => `<button data-choix="${position}"${attributLangue}>${enLigne(question.choix[position])}</button>`)
      .join('');
    return `
      <div class="question" data-index="${index}">
        <p class="question-texte"><span class="numero">${numero}.</span><span${attributLangue}>${enLigne(question.question)}</span></p>
        <div class="choix">${choix}</div>
        <div class="explication markdown" role="status" tabindex="-1" hidden></div>
      </div>`;
  }

  function corrigerQuestion(bloc, question, choisi) {
    const juste = choisi === question.reponse;
    bloc.querySelectorAll('button[data-choix]').forEach((choix) => {
      const position = Number(choix.dataset.choix);
      choix.disabled = true;
      if (position === question.reponse) choix.classList.add('correct');
      if (position === choisi && !juste) choix.classList.add('incorrect');
    });

    const explication = bloc.querySelector('.explication');
    explication.innerHTML = `<p><strong>${juste ? 'Bonne réponse !' : 'Raté.'}</strong></p>${rendreMarkdown(question.explication, options)}`;
    colorerCode(explication, surligneur);
    explication.hidden = false;
    return explication;
  }

  function afficherScore(section, partie) {
    const bonnes = compterBonnes(partie, questions);
    const total = questionsDeLaPartie(partie, questions).length;
    const ratees = questionsRatees(partie, questions).length;
    const score = section.querySelector('.score-quiz');
    score.innerHTML = `
      <div class="valeur">${bonnes} / ${total}</div>
      <p>${partie.selection ? 'Questions ratées revues.' : messageScore(bonnes, total)}</p>
      <div class="barre-outils centree">
        ${ratees > 0 ? `<button class="bouton" data-refaire-ratees>Refaire seulement les questions ratées (${ratees})</button>` : ''}
        <button class="bouton" data-recommencer>Recommencer tout le quiz</button>
        ${premier ? `<a class="bouton principal" href="#/exercice/${chapitre.cle}/${premier.id}">Passer aux exercices →</a>` : ''}
      </div>`;
    score.hidden = false;
    return score;
  }

  function demarrer(partie) {
    const record = ctx.progression.quiz[chapitre.cle];
    const indices = questionsDeLaPartie(partie, questions);
    const intro = partie.selection
      ? `${indices.length} question${indices.length > 1 ? 's' : ''} ratée${indices.length > 1 ? 's' : ''} à refaire.`
      : `${questions.length} questions. Clique sur une réponse pour voir la correction.${record ? ` Ton meilleur score : ${record.score} / ${record.total}.` : ''}`;

    ctx.conteneur.innerHTML = `
      <section class="quiz">
        <p class="fil">${echapper(chapitre.titre)} · Quiz</p>
        <h1>Quiz : ${echapper(chapitre.titre)}</h1>
        <p class="message-vide">${intro}</p>
        ${questions.length === 0
          ? '<p>Pas encore de quiz pour ce chapitre.</p>'
          : `<div class="compteur-quiz"><span data-compteur></span><button class="bouton discret" data-recommencer hidden>↺ Réinitialiser le quiz</button></div>${indices.map((index, rang) => blocQuestion(questions[index], index, rang + 1, partie.ordres[index])).join('')}`}
        <div class="score-quiz" hidden></div>
      </section>`;

    const section = ctx.conteneur.querySelector('.quiz');
    const compteur = section.querySelector('[data-compteur]');
    const reinitialiser = section.querySelector('.compteur-quiz [data-recommencer]');
    const blocDe = (index) => section.querySelector(`.question[data-index="${index}"]`);
    const majCompteur = () => {
      if (compteur) compteur.textContent = estTerminee(partie, questions) ? `Terminé · ${compterBonnes(partie, questions)} / ${indices.length} bonnes` : texteCompteur(partie, questions);
      if (reinitialiser) reinitialiser.hidden = !peutReinitialiser(partie);
    };
    indices.forEach((index) => {
      if (partie.reponses[index] !== undefined) corrigerQuestion(blocDe(index), questions[index], partie.reponses[index]);
    });
    majCompteur();
    if (estTerminee(partie, questions)) afficherScore(section, partie);

    const relancer = (nouvelle) => {
      ctx.enregistrerPartieQuiz(chapitre.cle, nouvelle);
      demarrer(nouvelle);
      ctx.conteneur.scrollTop = 0;
    };

    section.addEventListener('click', (evenement) => {
      if (evenement.target.closest('[data-recommencer]')) {
        relancer(nouvellePartie(questions));
        return;
      }
      if (evenement.target.closest('[data-refaire-ratees]')) {
        relancer(nouvellePartie(questions, questionsRatees(partie, questions)));
        return;
      }
      const bouton = evenement.target.closest('button[data-choix]');
      if (!bouton || bouton.disabled) return;

      const index = Number(bouton.closest('.question').dataset.index);
      partie.reponses[index] = Number(bouton.dataset.choix);
      ctx.enregistrerPartieQuiz(chapitre.cle, partie);
      corrigerQuestion(blocDe(index), questions[index], partie.reponses[index]).focus({ preventScroll: true });
      majCompteur();

      if (estTerminee(partie, questions)) {
        if (!partie.selection) ctx.enregistrerQuiz(chapitre.cle, compterBonnes(partie, questions), questions.length);
        afficherScore(section, partie).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  const enregistree = ctx.partieQuiz(chapitre.cle);
  demarrer(partieValide(enregistree, questions) ? enregistree : nouvellePartie(questions));
}
