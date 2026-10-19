import { avecFormules } from '../domaines.js';
import { echapper, rendreMarkdownEnLigne } from '../outils.js';

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

export function nouvellePartie(questions) {
  return {
    ordres: questions.map((question) => melanger(question.choix.map((_, position) => position))),
    reponses: {},
  };
}

export function partieValide(partie, questions) {
  return Array.isArray(partie?.ordres)
    && Boolean(partie.reponses)
    && typeof partie.reponses === 'object'
    && partie.ordres.length === questions.length
    && partie.ordres.every((ordre, index) => ordre.length === questions[index].choix.length);
}

export function compterBonnes(partie, questions) {
  return questions.filter((question, index) => partie.reponses[index] === question.reponse).length;
}

export function estTerminee(partie, questions) {
  return questions.length > 0 && questions.every((_, index) => partie.reponses[index] !== undefined);
}

export function afficherQuiz(ctx, chapitre) {
  const questions = chapitre.quiz;
  const premier = chapitre.exercices[0];
  const options = { formules: avecFormules(chapitre.domaine) };
  const enLigne = (texte) => rendreMarkdownEnLigne(texte, options);

  function blocQuestion(question, index, ordre) {
    const choix = ordre
      .map((position) => `<button data-choix="${position}">${enLigne(question.choix[position])}</button>`)
      .join('');
    return `
      <div class="question" data-index="${index}">
        <p class="question-texte"><span class="numero">${index + 1}.</span>${enLigne(question.question)}</p>
        <div class="choix">${choix}</div>
        <div class="explication" hidden></div>
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
    explication.innerHTML = `<strong>${juste ? 'Bonne réponse !' : 'Raté.'}</strong> ${enLigne(question.explication)}`;
    explication.hidden = false;
  }

  function afficherScore(section, bonnes) {
    const score = section.querySelector('.score-quiz');
    score.innerHTML = `
      <div class="valeur">${bonnes} / ${questions.length}</div>
      <p>${messageScore(bonnes, questions.length)}</p>
      <div class="barre-outils centree">
        <button class="bouton" data-recommencer>Recommencer</button>
        ${premier ? `<a class="bouton principal" href="#/exercice/${chapitre.cle}/${premier.id}">Passer aux exercices →</a>` : ''}
      </div>`;
    score.hidden = false;
    return score;
  }

  function demarrer(partie) {
    const record = ctx.progression.quiz[chapitre.cle];

    ctx.conteneur.innerHTML = `
      <section class="quiz">
        <p class="fil">${echapper(chapitre.titre)} · Quiz</p>
        <h1>Quiz : ${echapper(chapitre.titre)}</h1>
        <p class="message-vide">${questions.length} questions. Clique sur une réponse pour voir la correction.${record ? ` Ton meilleur score : ${record.score} / ${record.total}.` : ''}</p>
        ${questions.length === 0 ? '<p>Pas encore de quiz pour ce chapitre.</p>' : questions.map((question, index) => blocQuestion(question, index, partie.ordres[index])).join('')}
        <div class="score-quiz" hidden></div>
      </section>`;

    const section = ctx.conteneur.querySelector('.quiz');
    const blocDe = (index) => section.querySelector(`.question[data-index="${index}"]`);
    questions.forEach((question, index) => {
      if (partie.reponses[index] !== undefined) corrigerQuestion(blocDe(index), question, partie.reponses[index]);
    });
    if (estTerminee(partie, questions)) afficherScore(section, compterBonnes(partie, questions));

    section.addEventListener('click', (evenement) => {
      if (evenement.target.closest('[data-recommencer]')) {
        const nouvelle = nouvellePartie(questions);
        ctx.enregistrerPartieQuiz(chapitre.cle, nouvelle);
        demarrer(nouvelle);
        ctx.conteneur.scrollTop = 0;
        return;
      }
      const bouton = evenement.target.closest('button[data-choix]');
      if (!bouton || bouton.disabled) return;

      const index = Number(bouton.closest('.question').dataset.index);
      partie.reponses[index] = Number(bouton.dataset.choix);
      ctx.enregistrerPartieQuiz(chapitre.cle, partie);
      corrigerQuestion(blocDe(index), questions[index], partie.reponses[index]);

      if (estTerminee(partie, questions)) {
        const bonnes = compterBonnes(partie, questions);
        ctx.enregistrerQuiz(chapitre.cle, bonnes, questions.length);
        afficherScore(section, bonnes).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  const enregistree = ctx.partieQuiz(chapitre.cle);
  demarrer(partieValide(enregistree, questions) ? enregistree : nouvellePartie(questions));
}
