import { activerAnimations } from '../animations/index.js';
import { chargerCours } from '../catalogue.js';
import { activerExemples } from '../code/exemples.js';
import { avecFormules, estDomaineCode, langageDe, LANGAGES } from '../domaines.js';
import { etiquetteSource } from '../menu.js';
import { colorerCode, echapper, rendreMarkdown } from '../outils.js';
import { bandeauSupports } from './supports.js';

export async function afficherCours(ctx, chapitre) {
  const markdown = await chargerCours(chapitre);
  if (ctx.obsolete()) return;

  const premier = chapitre.exercices[0];
  const estCode = estDomaineCode(chapitre.domaine);
  ctx.conteneur.innerHTML = `
    <p class="fil">${echapper(chapitre.titre)} · Cours ${etiquetteSource(chapitre)}</p>
    ${bandeauSupports(chapitre, ctx.matiere)}
    <article class="markdown">${rendreMarkdown(markdown, { formules: avecFormules(chapitre.domaine) })}</article>
    <div class="pied-cours">
      ${chapitre.quiz.length ? `<a class="bouton" href="#/quiz/${chapitre.cle}">Faire le quiz</a>` : ''}
      ${premier ? `<a class="bouton principal" href="#/exercice/${chapitre.cle}/${premier.id}">Commencer les exercices →</a>` : ''}
    </div>`;
  activerAnimations(ctx.conteneur.querySelector('article'));
  if (estCode) activerExemples(ctx.conteneur.querySelector('article'), langageDe(chapitre.domaine));
  colorerCode(ctx.conteneur, estCode ? LANGAGES[langageDe(chapitre.domaine)].surligneur : undefined);
}
