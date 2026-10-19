import { chargerCours } from '../catalogue.js';
import { activerExemples } from '../code/exemples.js';
import { avecFormules, estDomaineCode, LANGAGES } from '../domaines.js';
import { etiquetteSource } from '../menu.js';
import { colorerCode, echapper, rendreMarkdown } from '../outils.js';

export async function afficherCours(ctx, chapitre) {
  const markdown = await chargerCours(chapitre);
  if (ctx.obsolete()) return;

  const premier = chapitre.exercices[0];
  const estCode = estDomaineCode(chapitre.domaine);
  ctx.conteneur.innerHTML = `
    <p class="fil">${echapper(chapitre.titre)} · Cours ${etiquetteSource(chapitre)}</p>
    <article class="markdown">${rendreMarkdown(markdown, { formules: avecFormules(chapitre.domaine) })}</article>
    <div class="pied-cours">
      ${chapitre.quiz.length ? `<a class="bouton" href="#/quiz/${chapitre.cle}">Faire le quiz</a>` : ''}
      ${premier ? `<a class="bouton principal" href="#/exercice/${chapitre.cle}/${premier.id}">Commencer les exercices →</a>` : ''}
    </div>`;
  if (estCode) activerExemples(ctx.conteneur.querySelector('article'), chapitre.domaine);
  colorerCode(ctx.conteneur, estCode ? LANGAGES[chapitre.domaine].surligneur : undefined);
}
