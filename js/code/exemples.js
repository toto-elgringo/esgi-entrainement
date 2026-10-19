import { LANGAGES } from '../domaines.js';
import { compilateur } from './compilateur.js';
import { creerEditeur } from './editeur.js';
import { afficherCompilation, afficherResultat } from './resultat.js';

const MAIN_RUST = /^\s*(pub\s+)?fn\s+main\s*\(/m;
const MAIN_C = /\bint\s+main\s*\(/;
const INDENTATION = '    ';

function nettoyer(code) {
  return code.replace(/\r\n/g, '\n').replace(/^(\s*\n)+/, '').trimEnd();
}

function preparerRust(propre) {
  if (MAIN_RUST.test(propre)) return `${propre}\n`;
  const corps = propre
    .split('\n')
    .map((ligne) => (ligne.trim() ? `${INDENTATION}${ligne}` : ''))
    .join('\n');
  return `fn main() {\n${corps}\n}\n`;
}

export function preparerExemple(code, langage) {
  const propre = nettoyer(code);
  if (langage === 'rust') return preparerRust(propre);
  if (langage === 'c') return MAIN_C.test(propre) ? `${propre}\n` : null;
  return `${propre}\n`;
}

const BOUTONS_FERME = '<button class="bouton principal" data-action="essayer">▶ Essayer</button>';
const BOUTONS_OUVERT = `
  <button class="bouton principal" data-action="executer" title="Ctrl + S">▶ Exécuter</button>
  <button class="bouton discret" data-action="remettre">Remettre l’exemple</button>
  <button class="bouton discret" data-action="fermer">Fermer</button>`;

function activerExemple(bloc, langage, prepare) {
  const exemple = document.createElement('div');
  exemple.className = 'exemple-code';
  exemple.innerHTML = `
    <div class="exemple-entete"><span class="exemple-langue">${LANGAGES[langage].nom}</span><div class="exemple-actions">${BOUTONS_FERME}</div></div>
    <div class="zone-editeur" data-editeur hidden></div>
    <div class="resultat" data-resultat hidden></div>`;
  bloc.replaceWith(exemple);
  exemple.querySelector('.exemple-entete').after(bloc);

  const actions = exemple.querySelector('.exemple-actions');
  const zoneEditeur = exemple.querySelector('[data-editeur]');
  const zoneResultat = exemple.querySelector('[data-resultat]');
  let editeur = null;
  let enCours = false;

  async function executer() {
    if (enCours || !editeur) return;
    enCours = true;
    const bouton = actions.querySelector('[data-action="executer"]');
    bouton.disabled = true;
    bouton.classList.add('chargement');
    afficherCompilation(zoneResultat, langage);
    try {
      afficherResultat(zoneResultat, await compilateur.executer(langage, editeur.lire()), { langage });
    } catch (erreur) {
      afficherResultat(zoneResultat, { statut: 'erreur_plateforme', sortie: erreur.message }, { langage });
    } finally {
      enCours = false;
      bouton.disabled = false;
      bouton.classList.remove('chargement');
    }
  }

  function ouvrir() {
    bloc.hidden = true;
    zoneEditeur.hidden = false;
    actions.innerHTML = BOUTONS_OUVERT;
    editeur ??= creerEditeur(zoneEditeur, prepare, {
      auChangement: () => {},
      auRaccourci: executer,
      hauteurAuto: true,
      mode: LANGAGES[langage].modeEditeur,
    });
    editeur.rafraichir?.();
  }

  function fermer() {
    bloc.hidden = false;
    zoneEditeur.hidden = true;
    zoneResultat.hidden = true;
    actions.innerHTML = BOUTONS_FERME;
  }

  function remettre() {
    editeur.ecrire(prepare);
    zoneResultat.hidden = true;
  }

  const gestionnaires = { essayer: ouvrir, executer, remettre, fermer };
  actions.addEventListener('click', (evenement) => {
    const action = evenement.target.closest('[data-action]')?.dataset.action;
    gestionnaires[action]?.();
  });
}

export function activerExemples(conteneur, langage) {
  const classe = `language-${LANGAGES[langage].surligneur}`;
  for (const code of conteneur.querySelectorAll(`pre > code.${classe}`)) {
    const prepare = preparerExemple(code.textContent, langage);
    if (prepare !== null) activerExemple(code.parentElement, langage, prepare);
  }
}
