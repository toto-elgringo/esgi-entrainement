import { chargerFichierCode } from '../catalogue.js';
import { LANGAGES } from '../domaines.js';
import { colorerCode, echapper, rendreMarkdown, rendreMarkdownEnLigne } from '../outils.js';
import { cleExercice, estReussi, lienExercice, voisins } from '../parcours.js';
import { compilateur } from './compilateur.js';
import { creerEditeur } from './editeur.js';
import { afficherCompilation, afficherResultat, resultatAEnregistrer } from './resultat.js';

const DELAI_ENREGISTREMENT = 500;

function etoiles(difficulte) {
  return `<span class="difficulte" title="Difficulté ${difficulte} sur 3">${'●'.repeat(difficulte)}${'○'.repeat(3 - difficulte)}</span>`;
}

function lienVoisin(exercice, sens) {
  if (!exercice) return '<span></span>';
  const texte = sens === 'precedent' ? `← ${echapper(exercice.titre)}` : `${echapper(exercice.titre)} →`;
  return `<a class="bouton discret" href="${lienExercice(exercice)}">${texte}</a>`;
}

function gabarit(chapitre, exercice, { enonce, sortieAttendue, entree, entreeSaisie }, reussi, precedent, suivant) {
  const blocEntree = entree !== null
    ? `<h3>Entrée donnée au programme</h3><pre class="sortie-attendue">${echapper(entree)}</pre>`
    : '';
  const blocSortie = exercice.type === 'sortie'
    ? `${blocEntree}<h3>Sortie attendue</h3><pre class="sortie-attendue">${echapper(sortieAttendue ?? '')}</pre>`
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
          <button class="bouton principal" data-action="verifier" title="Enregistre et vérifie ton code">Vérifier <kbd>Ctrl+S</kbd></button>
          <span class="etat-enregistrement" data-etat></span>
          <button class="bouton discret" data-action="reinitialiser" title="Remettre le code de départ">Réinitialiser</button>
        </div>
        <div class="zone-editeur" data-editeur></div>
        <details class="entree-programme" ${entreeSaisie ? 'open' : ''}>
          <summary>Entrée du programme (ce que tu taperais au clavier pour « Exécuter »)</summary>
          <textarea data-entree rows="3" spellcheck="false" placeholder="Une ligne par input() ou scanf">${echapper(entreeSaisie)}</textarea>
        </details>
        <div class="resultat" data-resultat hidden></div>
        <nav class="navigation-exercices">${lienVoisin(precedent, 'precedent')}${lienVoisin(suivant, 'suivant')}</nav>
      </section>
    </div>`;
}

export async function afficherExerciceCode(ctx, chapitre, exercice) {
  const langage = chapitre.domaine;
  const { extension, modeEditeur, surligneur } = LANGAGES[langage];
  const fichier = (nom) => chargerFichierCode(langage, chapitre.id, exercice.id, nom);
  const fichiers = await Promise.all([
    fichier('enonce.md'),
    fichier(`depart.${extension}`),
    exercice.type === 'sortie' ? fichier('sortie.txt') : null,
    exercice.avecEntree ? fichier('entree.txt') : null,
  ]);
  if (ctx.obsolete()) return null;
  const [enonce, depart, sortieAttendue, entree] = fichiers;

  const cle = cleExercice(chapitre.cle, exercice.id);
  const { precedent, suivant } = voisins(ctx.chapitres, chapitre.cle, exercice.id);
  let reussi = estReussi(ctx.progression, chapitre.cle, exercice.id);
  const affichage = ctx.affichage(cle);
  const entreeSaisie = affichage.entree ?? entree ?? '';
  ctx.conteneur.innerHTML = gabarit(chapitre, exercice, { enonce, sortieAttendue, entree, entreeSaisie }, reussi, precedent, suivant);

  const racine = ctx.conteneur;
  const trouver = (selecteur) => racine.querySelector(selecteur);
  const zoneResultat = trouver('[data-resultat]');
  const etatEnregistrement = trouver('[data-etat]');
  const boutonIndice = trouver('[data-action="indice"]');
  const boutonSolution = trouver('[data-action="solution"]');
  const zoneEntree = trouver('[data-entree]');
  const zoneSolution = trouver('[data-solution]');
  const boutonsCompilation = racine.querySelectorAll('[data-action="executer"], [data-action="verifier"]');
  colorerCode(trouver('.exercice-enonce'), surligneur);

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
    auRaccourci: () => lancer('verifier'),
    mode: modeEditeur,
  });

  async function lancer(action) {
    if (enCours) return;
    enCours = true;
    enregistrer();
    const bouton = trouver(`[data-action="${action}"]`);
    boutonsCompilation.forEach((element) => (element.disabled = true));
    bouton.classList.add('chargement');
    afficherCompilation(zoneResultat, langage);

    try {
      const code = editeur.lire();
      const resultat = action === 'verifier'
        ? await compilateur.verifier(langage, chapitre.id, exercice.id, code)
        : await compilateur.executer(langage, code, zoneEntree.value);
      afficherResultat(zoneResultat, resultat, { langage, suivant });
      ctx.enregistrerAffichage(cle, { resultat: resultatAEnregistrer(resultat) });
      if (action === 'verifier' && resultat.statut !== 'outil_introuvable') {
        ctx.enregistrerEssai(cle, resultat.statut === 'reussi');
        if (resultat.statut === 'reussi') {
          reussi = true;
          trouver('[data-badge]').hidden = false;
        }
      }
    } catch (erreur) {
      afficherResultat(zoneResultat, { statut: 'erreur_plateforme', sortie: erreur.message }, { langage });
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
    ctx.enregistrerAffichage(cle, { indices: indicesAffiches });
    majBoutonIndice();
  }

  async function montrerSolution() {
    const code = await fichier(`solution.${extension}`);
    zoneSolution.innerHTML = `
      <h3>Solution</h3>
      <pre><code class="language-${surligneur}">${echapper(code)}</code></pre>
      <button class="bouton" data-action="copier-solution">Copier dans l’éditeur</button>`;
    zoneSolution.hidden = false;
    boutonSolution.textContent = 'Masquer la solution';
    colorerCode(zoneSolution, surligneur);
  }

  async function basculerSolution() {
    if (!zoneSolution.hidden) {
      zoneSolution.hidden = true;
      boutonSolution.textContent = 'Voir la solution';
      ctx.enregistrerAffichage(cle, { solution: false });
      return;
    }
    if (!reussi && !confirm('Essaie encore un peu avant de regarder !\nAfficher quand même la solution ?')) return;
    await montrerSolution();
    ctx.enregistrerAffichage(cle, { solution: true });
  }

  function reinitialiser() {
    if (!confirm('Remettre le code de départ ?\nTon code actuel sera perdu.')) return;
    editeur.ecrire(depart);
    enregistrer();
    zoneResultat.hidden = true;
    ctx.enregistrerAffichage(cle, { resultat: null });
    afficherEtat('Code de départ remis');
  }

  const actions = {
    executer: () => lancer('executer'),
    verifier: () => lancer('verifier'),
    reinitialiser,
    indice: afficherIndice,
    solution: basculerSolution,
    'copier-solution': async () => {
      if (confirm('Remplacer ton code par la solution ?')) {
        editeur.ecrire(await fichier(`solution.${extension}`));
        enregistrer();
      }
    },
  };

  racine.querySelector('.exercice').addEventListener('click', (evenement) => {
    const action = evenement.target.closest('[data-action]')?.dataset.action;
    actions[action]?.();
  });

  function raccourciClavier(evenement) {
    const controle = evenement.ctrlKey || evenement.metaKey;
    if (evenement.defaultPrevented || !controle || evenement.key.toLowerCase() !== 's') return;
    evenement.preventDefault();
    lancer('verifier');
  }

  zoneEntree.addEventListener('input', () => ctx.enregistrerAffichage(cle, { entree: zoneEntree.value }));
  document.addEventListener('keydown', raccourciClavier);

  majBoutonIndice();
  for (let i = 0; i < (affichage.indices ?? 0); i++) afficherIndice();
  if (affichage.resultat) afficherResultat(zoneResultat, affichage.resultat, { langage, suivant });
  if (affichage.solution) montrerSolution();

  return () => {
    document.removeEventListener('keydown', raccourciClavier);
    if (minuteur) enregistrer();
  };
}
