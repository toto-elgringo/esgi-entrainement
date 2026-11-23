import { chargerFichierCode, plusTard, prechargerExercice } from '../catalogue.js';
import { langageDe, LANGAGES } from '../domaines.js';
import { CONFIRMATION_RECOMMENCER, creerBascule, creerIndices, etoiles, navigationExercices } from '../exercice-commun.js';
import { notifier } from '../notification.js';
import { colorerCode, echapper, rendreMarkdown, rendreMarkdownEnLigne } from '../outils.js';
import { cleExercice, estReussi, voisins } from '../parcours.js';
import { compilateur } from './compilateur.js';
import { chargerCodeMirror, creerEditeur } from './editeur.js';
import { afficherCompilation, afficherResultat, resultatAEnregistrer, STATUTS_PASSAGERS } from './resultat.js';

const DELAI_ENREGISTREMENT = 500;
export const SOLUTION_INDISPONIBLE = 'Impossible de charger la solution : le serveur ne répond pas.';

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
          <button class="bouton discret" data-action="reinitialiser" title="Remettre le code de départ et tout recommencer">↺ Recommencer l’exercice</button>
        </div>
        <div class="zone-editeur" data-editeur></div>
        <details class="entree-programme" ${entreeSaisie ? 'open' : ''}>
          <summary id="titre-entree">Entrée du programme (ce que tu taperais au clavier pour « Exécuter »)</summary>
          <textarea data-entree rows="3" spellcheck="false" aria-labelledby="titre-entree" placeholder="Une ligne par input() ou scanf">${echapper(entreeSaisie)}</textarea>
        </details>
        <div class="resultat" data-resultat role="status" hidden></div>
        ${navigationExercices(precedent, suivant)}
      </section>
    </div>`;
}

export async function afficherExerciceCode(ctx, chapitre, exercice) {
  const langage = langageDe(chapitre.domaine);
  const { extension, modeEditeur, surligneur } = LANGAGES[langage];
  const fichier = (nom) => chargerFichierCode(chapitre.domaine, chapitre.id, exercice.id, nom);
  const fichiers = await Promise.all([
    fichier('enonce.md'),
    fichier(`depart.${extension}`),
    exercice.type === 'sortie' ? fichier('sortie.txt') : null,
    exercice.avecEntree ? fichier('entree.txt') : null,
    chargerCodeMirror(),
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

  function afficherEtat(texte) {
    etatEnregistrement.textContent = texte;
  }

  function enregistrer() {
    clearTimeout(minuteur);
    minuteur = null;
    ctx.enregistrerCode(cle, editeur.lire());
    afficherEtat('Enregistré');
  }

  const editeur = await creerEditeur(trouver('[data-editeur]'), ctx.code(cle) ?? depart, {
    auChangement: () => {
      afficherEtat('Modifié…');
      clearTimeout(minuteur);
      minuteur = setTimeout(enregistrer, DELAI_ENREGISTREMENT);
    },
    auRaccourci: () => lancer('verifier'),
    mode: modeEditeur,
  });
  if (ctx.obsolete()) return null;

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
        ? await compilateur.verifier(langage, chapitre.domaine, chapitre.id, exercice.id, code)
        : await compilateur.executer(langage, code, zoneEntree.value);
      afficherResultat(zoneResultat, resultat, { langage, suivant });
      ctx.enregistrerAffichage(cle, { resultat: resultatAEnregistrer(resultat) });
      if (action === 'verifier' && !STATUTS_PASSAGERS.has(resultat.statut)) {
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

  const indices = creerIndices({
    bouton: boutonIndice,
    zone: trouver('[data-indices]'),
    indices: exercice.indices,
    rendre: (indice) => rendreMarkdownEnLigne(indice, { formules: false }),
    auChangement: (nombre) => ctx.enregistrerAffichage(cle, { indices: nombre }),
  });

  async function lireSolution() {
    try {
      return await fichier(`solution.${extension}`);
    } catch {
      notifier(SOLUTION_INDISPONIBLE);
      return null;
    }
  }

  async function montrerSolution() {
    const code = await lireSolution();
    if (code === null) return false;
    zoneSolution.innerHTML = `
      <h3>Solution</h3>
      <pre><code class="language-${surligneur}">${echapper(code)}</code></pre>
      <button class="bouton" data-action="copier-solution">Copier dans l’éditeur</button>`;
    colorerCode(zoneSolution, surligneur);
    return true;
  }

  const solution = creerBascule({
    bouton: boutonSolution,
    zone: zoneSolution,
    libelleVoir: 'Voir la solution',
    libelleMasquer: 'Masquer la solution',
    confirmation: 'Essaie encore un peu avant de regarder !\nAfficher quand même la solution ?',
    estReussi: () => reussi,
    montrer: montrerSolution,
    auChangement: (ouverte) => ctx.enregistrerAffichage(cle, { solution: ouverte }),
  });

  async function copierSolution() {
    if (!confirm('Remplacer ton code par la solution ?')) return;
    const code = await lireSolution();
    if (code === null) return;
    editeur.ecrire(code);
    enregistrer();
  }

  function reinitialiser() {
    if (enCours || !confirm(CONFIRMATION_RECOMMENCER.replace('Tes réponses', 'Ton code'))) return;
    clearTimeout(minuteur);
    minuteur = null;
    ctx.reinitialiserExercice(cle);
  }

  const actions = {
    executer: () => lancer('executer'),
    verifier: () => lancer('verifier'),
    reinitialiser,
    indice: () => indices.afficher(),
    solution: () => solution.basculer(),
    'copier-solution': copierSolution,
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

  indices.restaurer(affichage.indices);
  if (affichage.resultat) afficherResultat(zoneResultat, affichage.resultat, { langage, suivant });
  if (affichage.solution) solution.ouvrir();
  if (suivant) plusTard(() => prechargerExercice(suivant));

  return () => {
    document.removeEventListener('keydown', raccourciClavier);
    if (minuteur) enregistrer();
  };
}
