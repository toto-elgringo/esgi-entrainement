import { chargerCatalogue } from './catalogue.js';
import { afficherExerciceCode } from './code/exercice.js';
import { avecFormules, estDomaineCode } from './domaines.js';
import { afficherExerciceMaths } from './maths/exercice.js';
import { dessinerMenu, dessinerProgressionGlobale } from './menu.js';
import { notifier } from './notification.js';
import { chargerFormules, echapper } from './outils.js';
import { chapitresDeMatiere } from './parcours.js';
import { MESSAGE_STOCKAGE_PLEIN, stockage } from './stockage.js';
import { afficherAccueil } from './vues/accueil.js';
import { afficherCours } from './vues/cours.js';
import { afficherQuiz } from './vues/quiz.js';
import { afficherSupports } from './vues/supports.js';

const menu = document.getElementById('menu');
const contenu = document.getElementById('contenu');
const progressionGlobale = document.getElementById('progression-globale');
const choixMatiere = document.getElementById('choix-matiere');
const NOM_SITE = 'ESGI Entraînement';

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
  dessinerMenu(menu, chapitresVisibles(), stockage.progression(), etat.ouverts, location.hash, matiereCourante());
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
      const avant = Boolean(stockage.progression().exercices[cle]?.reussi);
      stockage.enregistrerEssai(cle, reussi);
      if (Boolean(stockage.progression().exercices[cle]?.reussi) !== avant) rafraichirMenu();
    },
    enregistrerQuiz: (chapitreCle, score, total) => {
      const avant = JSON.stringify(stockage.progression().quiz[chapitreCle] ?? null);
      stockage.enregistrerQuiz(chapitreCle, score, total);
      if (JSON.stringify(stockage.progression().quiz[chapitreCle]) !== avant) rafraichirMenu();
    },
    tailleStockage: () => stockage.tailleUtilisee(),
    effacerResultats: () => stockage.effacerResultats(),
    choisirMatiere,
    reinitialiser: () => {
      stockage.reinitialiser();
      afficherRoute();
    },
    exporter: () => stockage.exporter(),
    importer: (texte) => {
      stockage.importer(texte);
      location.reload();
    },
  };
}

function domaineDeLaRoute(route) {
  const chapitre = etat.chapitres.find((candidat) => candidat.cle === route.chapitreCle);
  if (chapitre) return chapitre.domaine;
  return etat.matieres.find((matiere) => matiere.id === matiereCourante())?.domaine ?? null;
}

function titrePage(route) {
  const chapitre = etat.chapitres.find((candidat) => candidat.cle === route.chapitreCle);
  if (!route.vue || !chapitre) {
    const matiere = etat.matieres.find((candidate) => candidate.id === matiereCourante());
    return matiere ? `${matiere.titre} · ${NOM_SITE}` : NOM_SITE;
  }
  const pages = { cours: 'Cours', quiz: 'Quiz', supports: 'Supports originaux' };
  const page = route.vue === 'exercice'
    ? chapitre.exercices.find((exercice) => exercice.id === route.exerciceId)?.titre ?? 'Exercice'
    : pages[route.vue] ?? 'Cours';
  return `${page} – ${chapitre.titre} · ${NOM_SITE}`;
}

function afficherVue(ctx, route) {
  const chapitre = etat.chapitres.find((candidat) => candidat.cle === route.chapitreCle);
  if (!route.vue || !route.chapitreCle) return afficherAccueil(ctx);
  if (!chapitre) throw new Error('Chapitre introuvable');
  if (route.vue === 'cours') return afficherCours(ctx, chapitre);
  if (route.vue === 'quiz') return afficherQuiz(ctx, chapitre);
  if (route.vue === 'supports') return afficherSupports(ctx, chapitre, route.exerciceId);
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

  fermerMenuMobile();
  appliquerMenuRange();
  const route = lireRoute();
  const chapitre = etat.chapitres.find((candidat) => candidat.cle === route.chapitreCle);
  if (chapitre && !chapitre.matieres.includes(matiereCourante())) stockage.choisirMatiere(chapitre.matieres[0]);
  if (chapitre) etat.ouverts.add(chapitre.cle);
  remplirChoixMatiere();
  rafraichirMenu();
  document.title = titrePage(route);
  contenu.setAttribute('aria-busy', 'true');

  try {
    if (avecFormules(domaineDeLaRoute(route))) await chargerFormules();
    if (numeroNavigation !== etat.navigation) return;
    const nettoyage = await afficherVue(creerContexte(numeroNavigation), route);
    if (numeroNavigation !== etat.navigation) {
      if (typeof nettoyage === 'function') nettoyage();
      return;
    }
    if (typeof nettoyage === 'function') etat.nettoyage = nettoyage;
  } catch (erreur) {
    if (numeroNavigation !== etat.navigation) return;
    contenu.innerHTML = `<div class="alerte">${echapper(erreur.message)}</div><p><a href="#/">Retour à l'accueil</a></p>`;
  }
  contenu.removeAttribute('aria-busy');
  contenu.scrollTop = 0;
}

choixMatiere.addEventListener('change', () => choisirMatiere(choixMatiere.value));

document.querySelector('.logo').addEventListener('click', (evenement) => {
  evenement.preventDefault();
  choisirMatiere(null);
});

menu.addEventListener('click', (evenement) => {
  const bouton = evenement.target.closest('.chapitre-titre');
  if (!bouton) return;
  const cle = bouton.dataset.chapitre;
  if (etat.ouverts.has(cle)) etat.ouverts.delete(cle);
  else etat.ouverts.add(cle);
  const ouvert = bouton.parentElement.classList.toggle('ouvert');
  bouton.setAttribute('aria-expanded', String(ouvert));
});

const boutonMenu = document.getElementById('bouton-menu');
const ecranEtroit = window.matchMedia('(max-width: 800px)');

function appliquerMenuRange() {
  const range = stockage.menuRange();
  document.body.classList.toggle('menu-range', range);
  boutonMenu.setAttribute('aria-expanded', String(ecranEtroit.matches ? document.body.classList.contains('menu-visible') : !range));
}

function fermerMenuMobile() {
  if (!document.body.classList.contains('menu-visible')) return false;
  document.body.classList.remove('menu-visible');
  appliquerMenuRange();
  return true;
}

function basculerMenu() {
  if (ecranEtroit.matches) document.body.classList.toggle('menu-visible');
  else stockage.rangerMenu(!stockage.menuRange());
  appliquerMenuRange();
}

boutonMenu.addEventListener('click', basculerMenu);
contenu.addEventListener('click', () => {
  if (ecranEtroit.matches) fermerMenuMobile();
});

document.addEventListener('keydown', (evenement) => {
  if (evenement.key === 'Escape' && ecranEtroit.matches && fermerMenuMobile()) {
    boutonMenu.focus();
    return;
  }
  const controle = evenement.ctrlKey || evenement.metaKey;
  if (evenement.defaultPrevented || !controle || evenement.shiftKey || evenement.altKey || evenement.key.toLowerCase() !== 'b') return;
  evenement.preventDefault();
  basculerMenu();
});

const boutonTheme = document.getElementById('bouton-theme');

function appliquerTheme() {
  const clair = stockage.theme() === 'clair';
  if (clair) document.documentElement.dataset.theme = 'clair';
  else delete document.documentElement.dataset.theme;
  const libelle = clair ? 'Passer en mode sombre' : 'Passer en mode clair';
  boutonTheme.textContent = clair ? '☾' : '☀';
  boutonTheme.title = libelle;
  boutonTheme.setAttribute('aria-label', libelle);
}

boutonTheme.addEventListener('click', () => {
  stockage.choisirTheme(stockage.theme() === 'clair' ? 'sombre' : 'clair');
  appliquerTheme();
});

appliquerTheme();

document.querySelector('.disposition').addEventListener('transitionend', (evenement) => {
  if (evenement.target === evenement.currentTarget) window.dispatchEvent(new Event('resize'));
});

appliquerMenuRange();

window.addEventListener('hashchange', afficherRoute);
stockage.surErreurEcriture(() => notifier(MESSAGE_STOCKAGE_PLEIN, { duree: 0 }));
stockage.surChangementExterne(() => {
  remplirChoixMatiere();
  rafraichirMenu();
  appliquerTheme();
});
window.addEventListener('beforeunload', () => etat.nettoyage?.());

try {
  const catalogue = await chargerCatalogue();
  etat.matieres = catalogue.matieres;
  etat.chapitres = catalogue.chapitres;
  await afficherRoute();
} catch (erreur) {
  contenu.removeAttribute('aria-busy');
  contenu.innerHTML = `<div class="alerte">Impossible de charger le contenu : ${echapper(erreur.message)}</div>`;
}
