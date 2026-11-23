import { SERVEUR_ARRETE } from '../api.js';
import { etatOutils } from '../code/compilateur.js';
import { avecFormules, estDomaineCode, langageDe, presentationMatiere } from '../domaines.js';
import { barreProgression, etiquetteSource } from '../menu.js';
import { notifier } from '../notification.js';
import { echapper, rendreLatex } from '../outils.js';
import { chapitresDeMatiere, compterProgression, lienExercice, prochainExercice } from '../parcours.js';
import { supportsDeChapitre } from '../supports.js';
import { brancherMyges, brancherSchooding } from './myges.js';

const AIDE_SAISIE = [
  ['3x^2 + 2x', '3x^2 + 2x'],
  ['1/3', '\\frac{1}{3}'],
  ['sqrt(2)', '\\sqrt{2}'],
  ['e^(2x)', 'e^{2x}'],
  ['ln(x)', '\\ln(x)'],
  ['5!', '5!'],
];

const ETAPES = {
  code: [
    ['1. Lis le cours', 'Un résumé clair de chaque chapitre, avec les pièges à éviter.'],
    ['2. Fais le quiz', 'Pour vérifier la théorie. Ton meilleur score est gardé.'],
    ['3. Code', '« Exécuter » lance ton programme, « Vérifier » (Ctrl + S) enregistre et lance les tests.'],
    ['4. Bloqué ?', 'Les indices arrivent un par un. La solution est disponible en dernier recours.'],
  ],
  reponses: [
    ['1. Lis le cours', 'Un résumé clair, avec les méthodes et les pièges.'],
    ['2. Fais le quiz', 'Pour vérifier la théorie. Ton meilleur score est gardé.'],
    ['3. Fais les exercices', 'Écris tes réponses puis clique sur « Vérifier » (ou appuie sur Entrée).'],
    ['4. Bloqué ?', 'Les indices arrivent un par un, la correction détaillée en dernier recours.'],
  ],
};

function carteChapitre(chapitre, numero, progression, matiere) {
  const { reussis, total } = compterProgression([chapitre], progression);
  const supports = supportsDeChapitre(chapitre, matiere);
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
          ${supports.length ? `<a href="#/supports/${chapitre.cle}">Supports</a>` : ''}
          ${chapitre.nombreQuestions > 0 ? `<a href="#/quiz/${chapitre.cle}">Quiz</a>` : ''}
          ${premier ? `<a href="#/exercice/${chapitre.cle}/${premier.id}">Exercices</a>` : ''}
        </div>
      </div>
    </article>`;
}

export function carteMatiere(matiere, chapitres, progression) {
  const presentation = presentationMatiere(matiere.id);
  const { reussis, total } = compterProgression(chapitres, progression);
  return `
    <button class="carte-matiere" data-matiere="${matiere.id}" style="--couleur-matiere: ${presentation.couleur}">
      <span class="icone" aria-hidden="true">${presentation.icone}</span>
      <h3>${echapper(matiere.titre)}</h3>
      <p>${presentation.texte}</p>
      <span class="detail">${chapitres.length} chapitres · ${reussis} / ${total} exercices réussis</span>
      ${barreProgression(reussis, total)}
    </button>`;
}

function afficherChoix(ctx) {
  const cartes = ctx.matieres
    .map((matiere) => carteMatiere(matiere, chapitresDeMatiere(ctx.tousLesChapitres, matiere.id), ctx.progression))
    .join('');

  ctx.conteneur.innerHTML = `
    <section class="accueil">
      <h1>ESGI Entraînement</h1>
      <p class="accueil-intro">Cours résumés, quiz et exercices corrigés automatiquement pour réviser les cours de l’ESGI. Choisis ta matière :</p>
      <div class="choix-matieres">${cartes}</div>
      <div data-myges></div>
      <div data-schooding></div>
      ${BLOC_SAUVEGARDE}
      <p class="pied-accueil">Ta progression est enregistrée dans ce navigateur. Tu peux changer de matière à tout moment en haut de la page.</p>
    </section>`;

  brancherSauvegarde(ctx);
  const arrets = [
    brancherMyges(ctx.conteneur.querySelector('[data-myges]')),
    brancherSchooding(ctx.conteneur.querySelector('[data-schooding]')),
  ];

  ctx.conteneur.querySelector('.choix-matieres').addEventListener('click', (evenement) => {
    const carte = evenement.target.closest('[data-matiere]');
    if (carte) ctx.choisirMatiere(carte.dataset.matiere);
  });
  return () => arrets.forEach((arreter) => arreter());
}

function blocAideMaths() {
  const lignes = AIDE_SAISIE.map(([ecrit, latex]) => `<tr><td><code>${echapper(ecrit)}</code></td><td>${rendreLatex(latex)}</td></tr>`).join('');
  return `
    <h2>Écrire une réponse</h2>
    <p class="accueil-intro">Le signe <code>*</code> est facultatif. Sous la case, « Lu comme » te montre comment ta réponse a été comprise.</p>
    <table class="aide-saisie-tableau"><thead><tr><th>Tu écris</th><th>Ça donne</th></tr></thead><tbody>${lignes}</tbody></table>
    <p class="message-vide">Ensemble : <code>{1, 2, 3}</code> (ordre libre, <code>{}</code> pour l’ensemble vide). Vecteur : <code>(2, -1, 0)</code>. Décimales avec un point, ou avec une virgule si tu sépares par des <code>;</code>.</p>`;
}

const BOUTON_REVERIFIER = '<button class="bouton" type="button" data-reverifier>⟳ Revérifier les outils</button>';

const alerte = (classe, contenu) => `<div class="alerte${classe}">${contenu}<div class="alerte-actions">${BOUTON_REVERIFIER}</div></div>`;

function alerteRust(etat) {
  if (!etat.cargo) {
    return alerte('', '<strong>cargo est introuvable sur ton ordinateur.</strong> Installe Rust avec <a href="https://rustup.rs" target="_blank" rel="noopener">rustup</a>, puis relance le site.');
  }
  if (!etat.clippy) {
    return alerte(' info', '<strong>clippy n’est pas installé.</strong> Lance <code>rustup component add clippy</code> pour avoir ses conseils en plus des erreurs de cargo.');
  }
  return '';
}

export const ALERTES_OUTILS = {
  rust: alerteRust,
  python: (etat) => (etat.python
    ? ''
    : alerte('', '<strong>Python 3 est introuvable sur ton ordinateur.</strong> Installe-le depuis <a href="https://www.python.org/downloads/" target="_blank" rel="noopener">python.org</a> (coche « Add python.exe to PATH »), puis relance le site.')),
  c: (etat) => (etat.gcc
    ? ''
    : alerte('', '<strong>gcc est introuvable sur ton ordinateur.</strong> Sous Windows : <code>winget install BrechtSanders.WinLibs.POSIX.UCRT</code>, sous macOS : <code>xcode-select --install</code>, sous Linux : <code>sudo apt install gcc</code>. Relance ensuite <code>npm start</code> dans un nouveau terminal.')),
};

export function rendreEtatOutils(etat, langage) {
  return etat ? ALERTES_OUTILS[langage](etat) : alerte('', `<strong>${echapper(SERVEUR_ARRETE)}</strong>`);
}

async function afficherEtatOutils(ctx, domaine, options) {
  const zone = ctx.conteneur.querySelector('[data-etat-outils]');
  const etat = await etatOutils(options);
  if (ctx.obsolete() || !zone?.isConnected) return;
  zone.innerHTML = rendreEtatOutils(etat, langageDe(domaine));
  zone.querySelector('[data-reverifier]')?.addEventListener('click', (evenement) => {
    evenement.currentTarget.disabled = true;
    afficherEtatOutils(ctx, domaine, { rafraichir: true });
  });
}

export function afficherAccueil(ctx) {
  if (!ctx.matiere) return afficherChoix(ctx);

  const matiere = ctx.matieres.find((candidate) => candidate.id === ctx.matiere);
  const { chapitres, progression } = ctx;
  const { reussis, total } = compterProgression(chapitres, progression);
  const quizFaits = chapitres.filter((chapitre) => progression.quiz[chapitre.cle]).length;
  const avecQuiz = chapitres.filter((chapitre) => chapitre.nombreQuestions > 0).length;
  const suivant = prochainExercice(chapitres, progression);
  const boutonSuivant = suivant
    ? `<a class="bouton principal" href="${lienExercice(suivant)}">${reussis === 0 ? 'Commencer' : 'Continuer'} : ${echapper(suivant.titre)} →</a>`
    : total > 0
      ? '<p class="badge-reussi">Tous les exercices sont réussis, bravo !</p>'
      : '';
  const estCode = estDomaineCode(matiere.domaine);
  const etapes = ETAPES[estCode ? 'code' : 'reponses'].map(([titre, texte]) => `<div class="etape"><strong>${titre}</strong>${texte}</div>`).join('');

  ctx.conteneur.innerHTML = `
    <section class="accueil">
      <h1>${echapper(matiere.titre)}</h1>
      <p class="accueil-intro">${presentationMatiere(matiere.id).texte}</p>
      <div data-etat-outils role="status"></div>
      <div class="statistiques">
        <div class="statistique"><div class="valeur">${reussis} / ${total}</div><div class="libelle">exercices réussis</div></div>
        <div class="statistique"><div class="valeur">${quizFaits} / ${avecQuiz}</div><div class="libelle">quiz terminés</div></div>
        <div class="statistique"><div class="valeur">${chapitres.length}</div><div class="libelle">chapitres</div></div>
      </div>
      ${boutonSuivant}
      <h2>Chapitres</h2>
      <div class="grille-chapitres">${chapitres.map((chapitre, index) => carteChapitre(chapitre, index + 1, progression, matiere.id)).join('')}</div>
      <h2>Comment ça marche</h2>
      <div class="etapes">${etapes}</div>
      ${avecFormules(matiere.domaine) ? blocAideMaths() : ''}
      ${BLOC_SAUVEGARDE}
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
  brancherSauvegarde(ctx);

  if (estCode) afficherEtatOutils(ctx, matiere.domaine);
}

const BLOC_SAUVEGARDE = `
  <div class="sauvegarde">
    <div class="sauvegarde-texte">
      <strong>Sauvegarde</strong>
      <span>Toutes les matières dans un seul fichier : exporte-le ici, importe-le sur un autre ordinateur ou navigateur.</span>
    </div>
    <div class="sauvegarde-actions">
      <button class="bouton" data-exporter>⬇ Tout exporter</button>
      <button class="bouton" data-importer>⬆ Tout importer</button>
      <input type="file" accept=".json,application/json" data-fichier hidden>
    </div>
    <div class="sauvegarde-place">
      <span data-place></span>
      <button class="lien-discret" data-effacer-resultats>Effacer les anciens résultats de compilation</button>
    </div>
  </div>`;

export function texteTaille(octets) {
  const ko = octets / 1024;
  if (ko < 1024) return `${Math.max(1, Math.round(ko))} Ko`;
  return `${(ko / 1024).toFixed(1).replace('.', ',')} Mo`;
}

function brancherSauvegarde(ctx) {
  const choixFichier = ctx.conteneur.querySelector('[data-fichier]');
  const place = ctx.conteneur.querySelector('[data-place]');
  const majPlace = () => {
    place.textContent = `Place utilisée dans ce navigateur : ${texteTaille(ctx.tailleStockage())} (environ 5 Mo au maximum).`;
  };
  majPlace();
  ctx.conteneur.querySelector('[data-effacer-resultats]').addEventListener('click', () => {
    if (!confirm('Effacer les résultats de compilation gardés pour chaque exercice ?\nTon code, tes réponses et ta progression sont gardés.')) return;
    ctx.effacerResultats();
    majPlace();
    notifier('Anciens résultats de compilation effacés.', { type: 'succes' });
  });
  ctx.conteneur.querySelector('[data-exporter]').addEventListener('click', () => telecharger(ctx.exporter()));
  ctx.conteneur.querySelector('[data-importer]').addEventListener('click', () => choixFichier.click());
  choixFichier.addEventListener('change', async () => {
    const fichier = choixFichier.files[0];
    choixFichier.value = '';
    if (!fichier || !confirm('Remplacer toute ta progression actuelle par celle du fichier ?')) return;
    try {
      ctx.importer(await fichier.text());
    } catch (erreur) {
      notifier(erreur.message);
    }
  });
}

function telecharger(contenu) {
  const lien = document.createElement('a');
  lien.href = URL.createObjectURL(new Blob([contenu], { type: 'application/json' }));
  lien.download = `esgi-entrainement-${new Date().toISOString().slice(0, 10)}.json`;
  lien.click();
  URL.revokeObjectURL(lien.href);
}
