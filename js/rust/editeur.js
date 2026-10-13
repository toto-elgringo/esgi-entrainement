const INDENTATION = '    ';

function creerCodeMirror(conteneur, code, { auChangement, auRaccourci }) {
  const editeur = window.CodeMirror(conteneur, {
    value: code,
    mode: 'rust',
    theme: 'rustique',
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    extraKeys: {
      'Ctrl-Enter': () => auRaccourci('verifier'),
      'Cmd-Enter': () => auRaccourci('verifier'),
      'Ctrl-S': () => auRaccourci('enregistrer'),
      'Cmd-S': () => auRaccourci('enregistrer'),
      Tab: (cm) => (cm.somethingSelected() ? cm.indentSelection('add') : cm.replaceSelection(INDENTATION, 'end')),
      'Shift-Tab': (cm) => cm.indentSelection('subtract'),
    },
  });
  editeur.on('change', () => auChangement(editeur.getValue()));
  return {
    lire: () => editeur.getValue(),
    ecrire: (valeur) => editeur.setValue(valeur),
  };
}

function creerZoneTexte(conteneur, code, { auChangement, auRaccourci }) {
  const zone = document.createElement('textarea');
  zone.value = code;
  zone.spellcheck = false;
  zone.addEventListener('input', () => auChangement(zone.value));
  zone.addEventListener('keydown', (evenement) => {
    const controle = evenement.ctrlKey || evenement.metaKey;
    if (controle && evenement.key === 'Enter') {
      evenement.preventDefault();
      auRaccourci('verifier');
    } else if (controle && evenement.key.toLowerCase() === 's') {
      evenement.preventDefault();
      auRaccourci('enregistrer');
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

export function creerEditeur(conteneur, code, options) {
  return window.CodeMirror ? creerCodeMirror(conteneur, code, options) : creerZoneTexte(conteneur, code, options);
}
