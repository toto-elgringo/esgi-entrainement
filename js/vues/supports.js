import { echapper } from '../outils.js';
import { lienSupport, supportsDeChapitre, typeSupport } from '../supports.js';

function cleAffichage(chapitre) {
  return `${chapitre.cle}/supports`;
}

function indiceDepart(ctx, chapitre, supports, demande) {
  const lu = Number.parseInt(demande ?? ctx.affichage(cleAffichage(chapitre)).support, 10);
  return Number.isInteger(lu) && lu >= 0 && lu < supports.length ? lu : 0;
}

function visionneuse(support) {
  const lien = lienSupport(support.fichier);
  const titre = echapper(support.titre);
  return typeSupport(support.fichier) === 'PDF'
    ? `<iframe class="visionneuse" src="${lien}#view=FitH" title="${titre}"></iframe>`
    : `<iframe class="visionneuse" src="${lien}" title="${titre}" sandbox="allow-scripts"></iframe>`;
}

export function bandeauSupports(chapitre, matiere) {
  const supports = supportsDeChapitre(chapitre, matiere);
  if (supports.length === 0) return '';
  const liens = supports
    .map((support, indice) => `<a class="puce-support" href="#/supports/${chapitre.cle}/${indice}">${echapper(support.titre)} <span>${typeSupport(support.fichier)}</span></a>`)
    .join('');
  return `<div class="bandeau-supports"><strong>Supports originaux</strong>${liens}</div>`;
}

export function afficherSupports(ctx, chapitre, demande) {
  const supports = supportsDeChapitre(chapitre, ctx.matiere);
  if (supports.length === 0) {
    ctx.conteneur.innerHTML = `
      <p class="fil">${echapper(chapitre.titre)} · Supports originaux</p>
      <p class="message-vide">Aucun support original pour ce chapitre.</p>
      <p><a href="#/cours/${chapitre.cle}">← Retour au cours</a></p>`;
    return;
  }

  let indice = indiceDepart(ctx, chapitre, supports, demande);
  const onglets = supports
    .map((support, position) => `<button class="onglet-support" data-support="${position}">${echapper(support.titre)} <span>${typeSupport(support.fichier)}</span></button>`)
    .join('');

  ctx.conteneur.innerHTML = `
    <p class="fil">${echapper(chapitre.titre)} · Supports originaux</p>
    <div class="supports-entete">
      <div class="onglets-supports" role="tablist">${onglets}</div>
      <div class="supports-actions">
        <a class="bouton discret" data-nouvel-onglet target="_blank" rel="noopener">Ouvrir en grand ↗</a>
        <a class="bouton" href="#/cours/${chapitre.cle}">Cours résumé</a>
      </div>
    </div>
    <div class="cadre-visionneuse" data-visionneuse></div>`;

  const cadre = ctx.conteneur.querySelector('[data-visionneuse]');
  const nouvelOnglet = ctx.conteneur.querySelector('[data-nouvel-onglet]');
  const boutons = [...ctx.conteneur.querySelectorAll('[data-support]')];

  function montrer(position) {
    indice = position;
    cadre.innerHTML = visionneuse(supports[indice]);
    nouvelOnglet.href = lienSupport(supports[indice].fichier);
    boutons.forEach((bouton, rang) => {
      bouton.classList.toggle('actif', rang === indice);
      bouton.setAttribute('aria-selected', String(rang === indice));
    });
    ctx.enregistrerAffichage(cleAffichage(chapitre), { support: indice });
  }

  ctx.conteneur.querySelector('.onglets-supports').addEventListener('click', (evenement) => {
    const bouton = evenement.target.closest('[data-support]');
    if (bouton && Number(bouton.dataset.support) !== indice) montrer(Number(bouton.dataset.support));
  });
  montrer(indice);
}
