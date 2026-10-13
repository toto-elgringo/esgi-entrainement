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

export function afficherQuiz(ctx, chapitre) {
  const questions = chapitre.quiz;
  const premier = chapitre.exercices[0];
  const options = { formules: chapitre.domaine === 'maths' };
  const enLigne = (texte) => rendreMarkdownEnLigne(texte, options);

  function blocQuestion(question, index) {
    const choix = melanger(question.choix.map((texte, position) => ({ texte, position })))
      .map(({ texte, position }) => `<button data-choix="${position}">${enLigne(texte)}</button>`)
      .join('');
    return `
      <div class="question" data-index="${index}">
        <p class="question-texte"><span class="numero">${index + 1}.</span>${enLigne(question.question)}</p>
        <div class="choix">${choix}</div>
        <div class="explication" hidden></div>
      </div>`;
  }

  function terminer(section, bonnes) {
    ctx.enregistrerQuiz(chapitre.cle, bonnes, questions.length);
    const score = section.querySelector('.score-quiz');
    score.innerHTML = `
      <div class="valeur">${bonnes} / ${questions.length}</div>
      <p>${messageScore(bonnes, questions.length)}</p>
      <div class="barre-outils centree">
        <button class="bouton" data-recommencer>Recommencer</button>
        ${premier ? `<a class="bouton principal" href="#/exercice/${chapitre.cle}/${premier.id}">Passer aux exercices →</a>` : ''}
      </div>`;
    score.hidden = false;
    score.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function demarrer() {
    let bonnes = 0;
    let repondues = 0;
    const record = ctx.progression.quiz[chapitre.cle];

    ctx.conteneur.innerHTML = `
      <section class="quiz">
        <p class="fil">${echapper(chapitre.titre)} · Quiz</p>
        <h1>Quiz : ${echapper(chapitre.titre)}</h1>
        <p class="message-vide">${questions.length} questions. Clique sur une réponse pour voir la correction.${record ? ` Ton meilleur score : ${record.score} / ${record.total}.` : ''}</p>
        ${questions.length === 0 ? '<p>Pas encore de quiz pour ce chapitre.</p>' : questions.map(blocQuestion).join('')}
        <div class="score-quiz" hidden></div>
      </section>`;

    const section = ctx.conteneur.querySelector('.quiz');
    section.addEventListener('click', (evenement) => {
      if (evenement.target.closest('[data-recommencer]')) {
        demarrer();
        ctx.conteneur.scrollTop = 0;
        return;
      }
      const bouton = evenement.target.closest('button[data-choix]');
      if (!bouton || bouton.disabled) return;

      const bloc = bouton.closest('.question');
      const question = questions[Number(bloc.dataset.index)];
      const juste = Number(bouton.dataset.choix) === question.reponse;
      bloc.querySelectorAll('button[data-choix]').forEach((choix) => {
        choix.disabled = true;
        if (Number(choix.dataset.choix) === question.reponse) choix.classList.add('correct');
      });
      if (!juste) bouton.classList.add('incorrect');

      const explication = bloc.querySelector('.explication');
      explication.innerHTML = `<strong>${juste ? 'Bonne réponse !' : 'Raté.'}</strong> ${enLigne(question.explication)}`;
      explication.hidden = false;

      if (juste) bonnes++;
      repondues++;
      if (repondues === questions.length) terminer(section, bonnes);
    });
  }

  demarrer();
}
