import { chargerFeuille, chargerScriptsDansLOrdre } from '../chargeur.js';
import { configurerSouris, RACCOURCIS_EDITION } from './raccourcis.js';

const DOSSIER_CODEMIRROR = 'vendor/codemirror';

export const SCRIPTS_CODEMIRROR = [
  'codemirror.min.js',
  'addon/mode/simple.min.js',
  'mode/rust/rust.min.js',
  'mode/python/python.min.js',
  'mode/clike/clike.min.js',
  'addon/edit/matchbrackets.min.js',
  'addon/edit/closebrackets.min.js',
  'addon/search/searchcursor.min.js',
  'addon/search/match-highlighter.min.js',
  'addon/comment/comment.min.js',
  'keymap/sublime.min.js',
].map((fichier) => `${DOSSIER_CODEMIRROR}/${fichier}`);

const INDENTATION = '    ';

export const SURBRILLANCE_OCCURRENCES = { minChars: 1, trim: true, showToken: false, delay: 50 };

function creerCodeMirror(conteneur, code, { auChangement, auRaccourci, hauteurAuto = false, mode = 'rust' }) {
  const editeur = window.CodeMirror(conteneur, {
    value: code,
    mode,
    theme: 'rustique',
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    viewportMargin: hauteurAuto ? Infinity : 10,
    showCursorWhenSelecting: true,
    highlightSelectionMatches: SURBRILLANCE_OCCURRENCES,
    configureMouse: configurerSouris,
    extraKeys: {
      ...RACCOURCIS_EDITION,
      'Ctrl-S': () => auRaccourci(),
      'Cmd-S': () => auRaccourci(),
      Tab: (cm) => (cm.somethingSelected() ? cm.indentSelection('add') : cm.replaceSelection(INDENTATION, 'end')),
      'Shift-Tab': (cm) => cm.indentSelection('subtract'),
    },
  });
  editeur.on('change', () => auChangement(editeur.getValue()));
  return {
    lire: () => editeur.getValue(),
    ecrire: (valeur) => editeur.setValue(valeur),
    rafraichir: () => editeur.refresh(),
  };
}

function creerZoneTexte(conteneur, code, { auChangement, auRaccourci }) {
  const zone = document.createElement('textarea');
  zone.value = code;
  zone.spellcheck = false;
  zone.addEventListener('input', () => auChangement(zone.value));
  zone.addEventListener('keydown', (evenement) => {
    const controle = evenement.ctrlKey || evenement.metaKey;
    if (controle && evenement.key.toLowerCase() === 's') {
      evenement.preventDefault();
      auRaccourci();
    } else if (evenement.key === 'Tab') {
      evenement.preventDefault();
      zone.setRangeText(INDENTATION, zone.selectionStart, zone.selectionEnd, 'end');
      auChangement(zone.value);
    }
  });
  conteneur.append(zone);
  return {
    lire: () => zone.value,
    ecrire: (valeur) => {
      zone.value = valeur;
      auChangement(valeur);
    },
  };
}

export async function chargerCodeMirror() {
  try {
    await Promise.all([
      chargerFeuille(`${DOSSIER_CODEMIRROR}/codemirror.min.css`, { avantLeSite: true }),
      chargerScriptsDansLOrdre('codemirror', SCRIPTS_CODEMIRROR),
    ]);
    return Boolean(window.CodeMirror);
  } catch {
    return false;
  }
}

export async function creerEditeur(conteneur, code, options) {
  return (await chargerCodeMirror()) ? creerCodeMirror(conteneur, code, options) : creerZoneTexte(conteneur, code, options);
}
