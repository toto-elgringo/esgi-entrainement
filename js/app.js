import { chargerCatalogue } from './catalogue.js';
import { afficherExerciceCode } from './code/exercice.js';
import { estDomaineCode } from './domaines.js';
import { afficherExerciceMaths } from './maths/exercice.js';
import { dessinerMenu, dessinerProgressionGlobale } from './menu.js';
import { echapper } from './outils.js';
import { chapitresDeMatiere } from './parcours.js';
import { stockage } from './stockage.js';
import { afficherAccueil } from './vues/accueil.js';
import { afficherCours } from './vues/cours.js';
import { afficherQuiz } from './vues/quiz.js';

const menu = document.getElementById('menu');
const contenu = document.getElementById('contenu');
const progressionGlobale = document.getElementById('progression-globale');
const choixMatiere = document.getElementById('choix-matiere');

const etat = {
  matieres: [],
  chapitres: [],
  ouverts: new Set(),
  navigation: 0,
  nettoyage: null,
};

function matiereCourante() {
  const id = stockage.matiere();
  return etat.matieres.some((matiere) => matiere.id === id) ? id : null;
}

function chapitresVisibles() {
  return chapitresDeMatiere(etat.chapitres, matiereCourante());
}

function lireRoute() {
  const [vue = '', domaine, chapitre, exerciceId] = location.hash.replace(/^#\/?/, '').split('/');
  return { vue, chapitreCle: domaine && chapitre ? `${domaine}/${chapitre}` : null, exerciceId };
}

function remplirChoixMatiere() {
  const courante = matiereCourante();
  const options = etat.matieres
    .map((matiere) => `<option value="${matiere.id}" ${matiere.id === courante ? 'selected' : ''}>${echapper(matiere.titre)}</option>`)
    .join('');
  choixMatiere.innerHTML = `<option value="" ${courante ? '' : 'selected'}>Choisis ta matière</option>${options}`;
  const domaine = etat.matieres.find((matiere) => matiere.id === courante)?.domaine;
  document.body.dataset.domaine = domaine ?? '';
}

function rafraichirMenu() {
  dessinerMenu(menu, chapitresVisibles(), stockage.progression(), etat.ouverts, location.hash);
  dessinerProgressionGlobale(progressionGlobale, chapitresVisibles(), stockage.progression());
}

function choisirMatiere(id) {
  stockage.choisirMatiere(id || null);
  if (location.hash && location.hash !== '#/') location.hash = '#/';
  else afficherRoute();
}

function creerContexte(numeroNavigation) {
  return {
    conteneur: contenu,
    matieres: etat.matieres,
    get matiere() {
      return matiereCourante();
    },
    get chapitres() {
      return chapitresVisibles();
    },
    get tousLesChapitres() {
      return etat.chapitres;
    },
    get progression() {
      return stockage.progression();
    },
    obsolete: () => numeroNavigation !== etat.navigation,
    saisies: (cle) => stockage.saisies(cle),
    enregistrerSaisies: (cle, saisies) => stockage.enregistrerSaisies(cle, saisies),
    code: (cle) => stockage.code(cle),
    enregistrerCode: (cle, code) => stockage.enregistrerCode(cle, code),
    affichage: (cle) => stockage.affichage(cle),
    enregistrerAffichage: (cle, changements) => stockage.enregistrerAffichage(cle, changements),
    partieQuiz: (chapitreCle) => stockage.partieQuiz(chapitreCle),
    enregistrerPartieQuiz: (chapitreCle, partie) => stockage.enregistrerPartieQuiz(chapitreCle, partie),
    enregistrerEssai: (cle, reussi) => {
      stockage.enregistrerEssai(cle, reussi);
      rafraichirMenu();
    },
    enregistrerQuiz: (chapitreCle, score, total) => {
      stockage.enregistrerQuiz(chapitreCle, score, total);
      rafraichirMenu();
    },
    choisirMatiere,
    reinitialiser: () => {
      stockage.reinitialiser();
      afficherRoute();
    },
  };
}

function afficherVue(ctx, route) {
  const chapitre = etat.chapitres.find((candidat) => candidat.cle === route.chapitreCle);
  if (!route.vue || !route.chapitreCle) return afficherAccueil(ctx);
  if (!chapitre) throw new Error('Chapitre introuvable');
  if (route.vue === 'cours') return afficherCours(ctx, chapitre);
  if (route.vue === 'quiz') return afficherQuiz(ctx, chapitre);
  if (route.vue === 'exercice') {
    const exercice = chapitre.exercices.find((candidat) => candidat.id === route.exerciceId);
    if (!exercice) throw new Error('Exercice introuvable');
    return estDomaineCode(chapitre.domaine)
      ? afficherExerciceCode(ctx, chapitre, exercice)
      : afficherExerciceMaths(ctx, chapitre, exercice);
  }
  return afficherAccueil(ctx);
}

async function afficherRoute() {
  const numeroNavigation = ++etat.navigation;
  if (etat.nettoyage) {
    const nettoyage = etat.nettoyage;
    etat.nettoyage = null;
    nettoyage();
  }

  document.body.classList.remove('menu-visible');
  const route = lireRoute();
  const chapitre = etat.chapitres.find((candidat) => candidat.cle === route.chapitreCle);
  if (chapitre && !chapitre.matieres.includes(matiereCourante())) stockage.choisirMatiere(chapitre.matieres[0]);
  if (chapitre) etat.ouverts.add(chapitre.cle);
  remplirChoixMatiere();
  rafraichirMenu();
  contenu.scrollTop = 0;

  try {
    const nettoyage = await afficherVue(creerContexte(numeroNavigation), route);
    if (numeroNavigation === etat.navigation && typeof nettoyage === 'function') etat.nettoyage = nettoyage;
  } catch (erreur) {
    if (numeroNavigation !== etat.navigation) return;
    contenu.innerHTML = `<div class="alerte">${echapper(erreur.message)}</div><p><a href="#/">Retour à l'accueil</a></p>`;
  }
}

choixMatiere.addEventListener('change', () => choisirMatiere(choixMatiere.value));

menu.addEventListener('click', (evenement) => {
  const bouton = evenement.target.closest('.chapitre-titre');
  if (!bouton) return;
  const cle = bouton.dataset.chapitre;
  if (etat.ouverts.has(cle)) etat.ouverts.delete(cle);
  else etat.ouverts.add(cle);
  bouton.parentElement.classList.toggle('ouvert');
});

document.getElementById('bouton-menu').addEventListener('click', () => {
  document.body.classList.toggle('menu-visible');
});

window.addEventListener('hashchange', afficherRoute);
window.addEventListener('beforeunload', () => etat.nettoyage?.());

try {
  const catalogue = await chargerCatalogue();
  etat.matieres = catalogue.matieres;
  etat.chapitres = catalogue.chapitres;
  await afficherRoute();
} catch (erreur) {
  contenu.innerHTML = `<div class="alerte">Impossible de charger le contenu : ${echapper(erreur.message)}</div>`;
}
