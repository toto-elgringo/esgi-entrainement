import { chargerCours } from '../catalogue.js';
import { etiquetteSource } from '../menu.js';
import { colorerCode, echapper, rendreMarkdown } from '../outils.js';

export async function afficherCours(ctx, chapitre) {
  const markdown = await chargerCours(chapitre);
  if (ctx.obsolete()) return;

  const premier = chapitre.exercices[0];
  const estRust = chapitre.domaine === 'rust';
  ctx.conteneur.innerHTML = `
    <p class="fil">${echapper(chapitre.titre)} · Cours ${etiquetteSource(chapitre)}</p>
    <article class="markdown">${rendreMarkdown(markdown, { formules: !estRust })}</article>
    <div class="pied-cours">
      ${chapitre.quiz.length ? `<a class="bouton" href="#/quiz/${chapitre.cle}">Faire le quiz</a>` : ''}
      ${premier ? `<a class="bouton principal" href="#/exercice/${chapitre.cle}/${premier.id}">Commencer les exercices →</a>` : ''}
    </div>`;
  colorerCode(ctx.conteneur, estRust ? 'rust' : undefined);
}
