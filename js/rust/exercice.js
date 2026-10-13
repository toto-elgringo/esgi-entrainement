import { chargerFichierRust } from '../catalogue.js';
import { colorerCode, echapper, rendreMarkdown, rendreMarkdownEnLigne } from '../outils.js';
import { cleExercice, estReussi, lienExercice, voisins } from '../parcours.js';
import { compilateur, etatCompilateur } from './compilateur.js';
import { creerEditeur } from './editeur.js';

const DELAI_ENREGISTREMENT = 500;
const DEPOT = 'https://github.com/toto-elgringo/esgi-entrainement.git';

const STATUTS = {
  reussi: { classe: 'succes', titre: 'Bravo, exercice réussi !' },
  echec: { classe: 'erreur', titre: 'Pas encore : la vérification échoue' },
  erreur_compilation: {
    classe: 'attention',
    titre: 'Le code ne compile pas',
    conseil: 'Lis le message jusqu’à la ligne « help: » : elle donne souvent la correction.',
  },
  delai_depasse: {
    classe: 'attention',
    titre: 'Trop long !',
    conseil: 'Ton programme tourne peut-être en boucle infinie, ou ton algorithme est trop lent.',
  },
  execute: { classe: 'info', titre: 'Programme exécuté' },
  erreur_execution: {
    classe: 'erreur',
    titre: 'Le programme a planté',
    conseil: 'Une panique arrête le programme : cherche la ligne « panicked at ».',
  },
  rust_introuvable: { classe: 'erreur', titre: 'Rust est introuvable sur ton ordinateur' },
  erreur_plateforme: { classe: 'erreur', titre: 'Erreur de la plateforme' },
};

function messageHorsLigne() {
  return `
    <div class="resultat-entete">Pour compiler et vérifier, lance le site sur ton ordinateur</div>
    <div class="aide-locale">
      <p>En ligne, tu peux lire l’énoncé et écrire ton code : il est gardé dans ton navigateur. Pour « Exécuter » et « Vérifier », il faut <a href="https://nodejs.org" target="_blank" rel="noopener">Node.js</a> et <a href="https://rustup.rs" target="_blank" rel="noopener">Rust</a>, puis :</p>
      <pre>git clone ${DEPOT}
cd esgi-entrainement
npm start</pre>
    </div>`;
}

function etoiles(difficulte) {
  return `<span class="difficulte" title="Difficulté ${difficulte} sur 3">${'●'.repeat(difficulte)}${'○'.repeat(3 - difficulte)}</span>`;
}

function lienVoisin(exercice, sens) {
  if (!exercice) return '<span></span>';
  const texte = sens === 'precedent' ? `← ${echapper(exercice.titre)}` : `${echapper(exercice.titre)} →`;
  return `<a class="bouton discret" href="${lienExercice(exercice)}">${texte}</a>`;
}

function gabarit(chapitre, exercice, enonce, sortieAttendue, reussi, precedent, suivant) {
  const blocSortie = exercice.type === 'sortie'
    ? `<h3>Sortie attendue</h3><pre class="sortie-attendue">${echapper(sortieAttendue ?? '')}</pre>`
    : '';
  return `
    <div class="exercice">
      <section class="exercice-enonce">
        <p class="fil">${echapper(chapitre.titre)}</p>
        <h1>${echapper(exercice.titre)}</h1>
        <div class="meta">
          ${etoiles(exercice.difficulte)}
          <span>${exercice.type === 'sortie' ? 'Vérifie ce qui est affiché' : 'Vérifié par des tests'}</span>
          <span class="badge-reussi" data-badge ${reussi ? '' : 'hidden'}>Réussi</span>
        </div>
        <div class="markdown">${rendreMarkdown(enonce, { formules: false })}${blocSortie}</div>
        <div class="bloc-aide">
          <div class="indices" data-indices></div>
          <button class="bouton" data-action="indice" ${exercice.indices.length ? '' : 'hidden'}></button>
          <button class="bouton discret" data-action="solution">Voir la solution</button>
          <div class="solution markdown" data-solution hidden></div>
        </div>
      </section>
      <section class="exercice-code">
        <div class="barre-outils">
          <button class="bouton" data-action="executer">Exécuter</button>
          <button class="bouton principal" data-action="verifier">Vérifier <kbd>Ctrl+Entrée</kbd></button>
          <span class="etat-enregistrement" data-etat></span>
          <button class="bouton discret" data-action="reinitialiser" title="Remettre le code de départ">Réinitialiser</button>
        </div>
        <div class="zone-editeur" data-editeur></div>
        <div class="resultat" data-resultat hidden></div>
        <nav class="navigation-exercices">${lienVoisin(precedent, 'precedent')}${lienVoisin(suivant, 'suivant')}</nav>
      </section>
    </div>`;
}

function rendreResultat(resultat, suivant) {
  const statut = STATUTS[resultat.statut] ?? STATUTS.erreur_plateforme;
  const resume = resultat.resume;
  const detail = resume ? `${resume.reussis} / ${resume.reussis + resume.echoues} tests réussis` : '';
  const comparer = resultat.statut === 'echec' && typeof resultat.attendu === 'string';

  const corps = comparer
    ? `<div class="comparaison">
        <div><h4>Ton programme affiche</h4><pre>${echapper(resultat.sortie?.trim() || '(rien)')}</pre></div>
        <div><h4>Attendu</h4><pre>${echapper(resultat.attendu.trim())}</pre></div>
      </div>`
    : `<pre>${echapper(resultat.sortie?.trim() || '(aucune sortie)')}</pre>`;

  const avertissements = resultat.avertissements?.trim()
    ? `<details class="avertissements"><summary>Avertissements du compilateur</summary><pre>${echapper(resultat.avertissements.trim())}</pre></details>`
    : '';

  const lienSuivant = resultat.statut === 'reussi' && suivant
    ? `<a class="bouton succes" href="${lienExercice(suivant)}">Exercice suivant →</a>`
    : '';

  return {
    classe: statut.classe,
    html: `
      <div class="resultat-entete">${statut.titre}<span class="detail">${detail}</span>${lienSuivant}</div>
      ${statut.conseil ? `<p class="resultat-conseil">${statut.conseil}</p>` : ''}
      ${corps}
      ${avertissements}`,
  };
}

export async function afficherExerciceRust(ctx, chapitre, exercice) {
  const fichiers = await Promise.all([
    chargerFichierRust(chapitre.id, exercice.id, 'enonce.md'),
    chargerFichierRust(chapitre.id, exercice.id, 'depart.rs'),
    exercice.type === 'sortie' ? chargerFichierRust(chapitre.id, exercice.id, 'sortie.txt') : null,
    etatCompilateur(),
  ]);
  if (ctx.obsolete()) return null;
  const [enonce, depart, sortieAttendue, compilation] = fichiers;

  const cle = cleExercice(chapitre.cle, exercice.id);
  const { precedent, suivant } = voisins(ctx.chapitres, chapitre.cle, exercice.id);
  let reussi = estReussi(ctx.progression, chapitre.cle, exercice.id);
  ctx.conteneur.innerHTML = gabarit(chapitre, exercice, enonce, sortieAttendue, reussi, precedent, suivant);

  const racine = ctx.conteneur;
  const trouver = (selecteur) => racine.querySelector(selecteur);
  const zoneResultat = trouver('[data-resultat]');
  const etatEnregistrement = trouver('[data-etat]');
  const boutonIndice = trouver('[data-action="indice"]');
  const zoneSolution = trouver('[data-solution]');
  const boutonsCompilation = racine.querySelectorAll('[data-action="executer"], [data-action="verifier"]');
  colorerCode(trouver('.exercice-enonce'), 'rust');

  let minuteur = null;
  let enCours = false;
  let indicesAffiches = 0;

  function afficherEtat(texte) {
    etatEnregistrement.textContent = texte;
  }

  function enregistrer() {
    clearTimeout(minuteur);
    minuteur = null;
    ctx.enregistrerCode(cle, editeur.lire());
    afficherEtat('Enregistré');
  }

  const editeur = creerEditeur(trouver('[data-editeur]'), ctx.code(cle) ?? depart, {
    auChangement: () => {
      afficherEtat('Modifié…');
      clearTimeout(minuteur);
      minuteur = setTimeout(enregistrer, DELAI_ENREGISTREMENT);
    },
    auRaccourci: (action) => (action === 'verifier' ? lancer('verifier') : enregistrer()),
  });

  function afficherResultat(resultat) {
    const { classe, html } = rendreResultat(resultat, suivant);
    zoneResultat.className = `resultat ${classe}`;
    zoneResultat.innerHTML = html;
    zoneResultat.hidden = false;
  }

  function afficherHorsLigne() {
    zoneResultat.className = 'resultat info';
    zoneResultat.innerHTML = messageHorsLigne();
    zoneResultat.hidden = false;
  }

  async function lancer(action) {
    if (enCours) return;
    if (!compilation.disponible) {
      afficherHorsLigne();
      return;
    }
    enCours = true;
    enregistrer();
    const bouton = trouver(`[data-action="${action}"]`);
    boutonsCompilation.forEach((element) => (element.disabled = true));
    bouton.classList.add('chargement');
    zoneResultat.className = 'resultat info';
    zoneResultat.innerHTML = '<div class="resultat-entete">Compilation en cours…</div>';
    zoneResultat.hidden = false;

    try {
      const code = editeur.lire();
      const resultat = action === 'verifier'
        ? await compilateur.verifier(chapitre.id, exercice.id, code)
        : await compilateur.executer(code);
      afficherResultat(resultat);
      if (action === 'verifier' && resultat.statut !== 'rust_introuvable') {
        ctx.enregistrerEssai(cle, resultat.statut === 'reussi');
        if (resultat.statut === 'reussi') {
          reussi = true;
          trouver('[data-badge]').hidden = false;
        }
      }
    } catch (erreur) {
      afficherResultat({ statut: 'erreur_plateforme', sortie: erreur.message });
    } finally {
      enCours = false;
      boutonsCompilation.forEach((element) => (element.disabled = false));
      bouton.classList.remove('chargement');
    }
  }

  function majBoutonIndice() {
    boutonIndice.textContent = `Afficher un indice (${indicesAffiches} / ${exercice.indices.length})`;
    boutonIndice.hidden = indicesAffiches >= exercice.indices.length;
  }

  function afficherIndice() {
    const indice = exercice.indices[indicesAffiches];
    if (indice === undefined) return;
    indicesAffiches++;
    trouver('[data-indices]').insertAdjacentHTML(
      'beforeend',
      `<div class="indice"><p>${rendreMarkdownEnLigne(indice, { formules: false })}</p></div>`,
    );
    majBoutonIndice();
  }

  async function afficherSolution() {
    if (!reussi && !confirm('Essaie encore un peu avant de regarder !\nAfficher quand même la solution ?')) return;
    const code = await chargerFichierRust(chapitre.id, exercice.id, 'solution.rs');
    zoneSolution.innerHTML = `
      <h3>Solution</h3>
      <pre><code class="language-rust">${echapper(code)}</code></pre>
      <button class="bouton" data-action="copier-solution">Copier dans l’éditeur</button>`;
    zoneSolution.hidden = false;
    colorerCode(zoneSolution, 'rust');
  }

  function reinitialiser() {
    if (!confirm('Remettre le code de départ ?\nTon code actuel sera perdu.')) return;
    editeur.ecrire(depart);
    enregistrer();
    zoneResultat.hidden = true;
    afficherEtat('Code de départ remis');
  }

  const actions = {
    executer: () => lancer('executer'),
    verifier: () => lancer('verifier'),
    reinitialiser,
    indice: afficherIndice,
    solution: afficherSolution,
    'copier-solution': async () => {
      if (confirm('Remplacer ton code par la solution ?')) {
        editeur.ecrire(await chargerFichierRust(chapitre.id, exercice.id, 'solution.rs'));
        enregistrer();
      }
    },
  };

  racine.querySelector('.exercice').addEventListener('click', (evenement) => {
    const action = evenement.target.closest('[data-action]')?.dataset.action;
    actions[action]?.();
  });

  if (!compilation.disponible) {
    boutonsCompilation.forEach((bouton) => (bouton.title = 'Disponible quand le site est lancé sur ton ordinateur'));
  }
  majBoutonIndice();
  return () => {
    if (minuteur) enregistrer();
  };
}
