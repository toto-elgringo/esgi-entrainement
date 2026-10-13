import { barreProgression, etiquetteSource } from '../menu.js';
import { echapper, rendreLatex } from '../outils.js';
import { chapitresDeMatiere, compterProgression, lienExercice, prochainExercice } from '../parcours.js';
import { etatCompilateur } from '../rust/compilateur.js';

const DEPOT = 'https://github.com/toto-elgringo/esgi-entrainement.git';

const PRESENTATIONS = {
  rust: {
    icone: 'R',
    couleur: '#f46623',
    texte: 'Le cours de Rust de l’ESGI, puis les fondamentaux du langage. Exercices de code vérifiés par le compilateur.',
  },
  informatique: {
    icone: 'Σ',
    couleur: '#6d7cff',
    texte: 'Ensembles et logique, sommes, exponentielle et logarithme, étude de fonctions, espaces vectoriels.',
  },
  'big-data': {
    icone: '∫',
    couleur: '#2f9e8f',
    texte: 'Étude de fonctions et espaces vectoriels : les bases mathématiques du machine learning.',
  },
};

const AIDE_SAISIE = [
  ['3x^2 + 2x', '3x^2 + 2x'],
  ['1/3', '\\frac{1}{3}'],
  ['sqrt(2)', '\\sqrt{2}'],
  ['e^(2x)', 'e^{2x}'],
  ['ln(x)', '\\ln(x)'],
  ['5!', '5!'],
];

const ETAPES = {
  rust: [
    ['1. Lis le cours', 'Un résumé clair de chaque chapitre, avec les pièges à éviter.'],
    ['2. Fais le quiz', 'Pour vérifier la théorie. Ton meilleur score est gardé.'],
    ['3. Code', '« Exécuter » lance ton programme, « Vérifier » (Ctrl + Entrée) lance les tests.'],
    ['4. Bloqué ?', 'Les indices arrivent un par un. La solution est disponible en dernier recours.'],
  ],
  maths: [
    ['1. Lis le cours', 'Un résumé clair, avec les méthodes et les pièges.'],
    ['2. Fais le quiz', 'Pour vérifier la théorie. Ton meilleur score est gardé.'],
    ['3. Fais les exercices', 'Écris tes réponses puis clique sur « Vérifier » (ou appuie sur Entrée).'],
    ['4. Bloqué ?', 'Les indices arrivent un par un, la correction détaillée en dernier recours.'],
  ],
};

function carteChapitre(chapitre, numero, progression) {
  const { reussis, total } = compterProgression([chapitre], progression);
  const quiz = progression.quiz[chapitre.cle];
  const premier = chapitre.exercices[0];
  return `
    <article class="carte-chapitre">
      <div><span class="numero">${String(numero).padStart(2, '0')}</span> ${etiquetteSource(chapitre)}</div>
      <h3>${echapper(chapitre.titre)}</h3>
      <p>${echapper(chapitre.description ?? '')}</p>
      ${barreProgression(reussis, total)}
      <div class="carte-pied">
        <span>${reussis} / ${total} exercices${quiz ? ` · quiz ${quiz.score}/${quiz.total}` : ''}</span>
        <div class="carte-liens">
          <a href="#/cours/${chapitre.cle}">Cours</a>
          ${chapitre.quiz.length ? `<a href="#/quiz/${chapitre.cle}">Quiz</a>` : ''}
          ${premier ? `<a href="#/exercice/${chapitre.cle}/${premier.id}">Exercices</a>` : ''}
        </div>
      </div>
    </article>`;
}

function afficherChoix(ctx) {
  const cartes = ctx.matieres
    .map((matiere) => {
      const presentation = PRESENTATIONS[matiere.id] ?? { icone: '?', couleur: '#6b7385', texte: '' };
      const chapitres = chapitresDeMatiere(ctx.tousLesChapitres, matiere.id);
      const { reussis, total } = compterProgression(chapitres, ctx.progression);
      return `
        <button class="carte-matiere" data-matiere="${matiere.id}">
          <span class="icone" style="background: ${presentation.couleur}">${presentation.icone}</span>
          <h3>${echapper(matiere.titre)}</h3>
          <p>${presentation.texte}</p>
          <span class="detail">${chapitres.length} chapitres · ${reussis} / ${total} exercices réussis</span>
        </button>`;
    })
    .join('');

  ctx.conteneur.innerHTML = `
    <section class="accueil">
      <h1>ESGI Entraînement</h1>
      <p class="accueil-intro">Cours résumés, quiz et exercices corrigés automatiquement pour réviser les cours de l’ESGI. Choisis ta matière :</p>
      <div class="choix-matieres">${cartes}</div>
      <p class="pied-accueil">Ta progression est enregistrée dans ce navigateur. Tu peux changer de matière à tout moment en haut de la page.</p>
    </section>`;

  ctx.conteneur.querySelector('.choix-matieres').addEventListener('click', (evenement) => {
    const carte = evenement.target.closest('[data-matiere]');
    if (carte) ctx.choisirMatiere(carte.dataset.matiere);
  });
}

function blocAideMaths() {
  const lignes = AIDE_SAISIE.map(([ecrit, latex]) => `<tr><td><code>${echapper(ecrit)}</code></td><td>${rendreLatex(latex)}</td></tr>`).join('');
  return `
    <h2>Écrire une réponse</h2>
    <p class="accueil-intro">Le signe <code>*</code> est facultatif. Sous la case, « Lu comme » te montre comment ta réponse a été comprise.</p>
    <table class="aide-saisie-tableau"><thead><tr><th>Tu écris</th><th>Ça donne</th></tr></thead><tbody>${lignes}</tbody></table>
    <p class="message-vide">Ensemble : <code>{1, 2, 3}</code> (ordre libre, <code>{}</code> pour l’ensemble vide). Vecteur : <code>(2, -1, 0)</code>. Décimales avec un point, ou avec une virgule si tu sépares par des <code>;</code>.</p>`;
}

async function afficherEtatRust(ctx) {
  const zone = ctx.conteneur.querySelector('[data-etat-rust]');
  const etat = await etatCompilateur();
  if (ctx.obsolete() || !zone) return;
  if (!etat.disponible) {
    zone.innerHTML = `
      <div class="alerte info">
        <strong>Tu es sur la version en ligne.</strong> Cours, quiz et écriture du code marchent ici. Pour compiler et vérifier tes exercices, lance le site sur ton ordinateur (il faut <a href="https://nodejs.org" target="_blank" rel="noopener">Node.js</a> et <a href="https://rustup.rs" target="_blank" rel="noopener">Rust</a>) :
        <pre>git clone ${DEPOT}
cd esgi-entrainement
npm start</pre>
      </div>`;
  } else if (!etat.rust) {
    zone.innerHTML = '<div class="alerte"><strong>Rust est introuvable sur ton ordinateur.</strong> Installe-le avec rustup (https://rustup.rs), puis relance le site.</div>';
  }
}

export async function afficherAccueil(ctx) {
  if (!ctx.matiere) {
    afficherChoix(ctx);
    return;
  }

  const matiere = ctx.matieres.find((candidate) => candidate.id === ctx.matiere);
  const { chapitres, progression } = ctx;
  const { reussis, total } = compterProgression(chapitres, progression);
  const quizFaits = chapitres.filter((chapitre) => progression.quiz[chapitre.cle]).length;
  const avecQuiz = chapitres.filter((chapitre) => chapitre.quiz.length > 0).length;
  const suivant = prochainExercice(chapitres, progression);
  const boutonSuivant = suivant
    ? `<a class="bouton principal" href="${lienExercice(suivant)}">${reussis === 0 ? 'Commencer' : 'Continuer'} : ${echapper(suivant.titre)} →</a>`
    : total > 0
      ? '<p class="badge-reussi">Tous les exercices sont réussis, bravo !</p>'
      : '';
  const etapes = ETAPES[matiere.domaine].map(([titre, texte]) => `<div class="etape"><strong>${titre}</strong>${texte}</div>`).join('');

  ctx.conteneur.innerHTML = `
    <section class="accueil">
      <h1>${echapper(matiere.titre)}</h1>
      <p class="accueil-intro">${PRESENTATIONS[matiere.id]?.texte ?? ''}</p>
      <div data-etat-rust></div>
      <div class="statistiques">
        <div class="statistique"><div class="valeur">${reussis} / ${total}</div><div class="libelle">exercices réussis</div></div>
        <div class="statistique"><div class="valeur">${quizFaits} / ${avecQuiz}</div><div class="libelle">quiz terminés</div></div>
        <div class="statistique"><div class="valeur">${chapitres.length}</div><div class="libelle">chapitres</div></div>
      </div>
      ${boutonSuivant}
      <h2>Chapitres</h2>
      <div class="grille-chapitres">${chapitres.map((chapitre, index) => carteChapitre(chapitre, index + 1, progression)).join('')}</div>
      <h2>Comment ça marche</h2>
      <div class="etapes">${etapes}</div>
      ${matiere.domaine === 'maths' ? blocAideMaths() : ''}
      <p class="pied-accueil">
        Ta progression est enregistrée dans ce navigateur.
        <button class="lien-discret" data-changer>Changer de matière</button> ·
        <button class="lien-discret" data-reinitialiser>Remettre ma progression à zéro</button>
      </p>
    </section>`;

  ctx.conteneur.querySelector('[data-changer]').addEventListener('click', () => ctx.choisirMatiere(null));
  ctx.conteneur.querySelector('[data-reinitialiser]').addEventListener('click', () => {
    if (confirm('Effacer toute ta progression (exercices, quiz, réponses et code) ?')) ctx.reinitialiser();
  });

  if (matiere.domaine === 'rust') await afficherEtatRust(ctx);
}
