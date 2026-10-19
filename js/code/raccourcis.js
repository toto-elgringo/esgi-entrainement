const comparer = (a, b) => a.line - b.line || a.ch - b.ch;
const decaler = (position, lignes) => ({ line: position.line + lignes, ch: position.ch });

function bornes(selection) {
  return comparer(selection.anchor, selection.head) <= 0
    ? { debut: selection.anchor, fin: selection.head }
    : { debut: selection.head, fin: selection.anchor };
}

export function blocsDeLignes(selections) {
  const triees = [...selections].sort((a, b) => comparer(bornes(a).debut, bornes(b).debut));
  const blocs = [];
  for (const selection of triees) {
    const { debut, fin } = bornes(selection);
    const derniere = fin.line > debut.line && fin.ch === 0 ? fin.line - 1 : fin.line;
    const precedent = blocs.at(-1);
    if (precedent && debut.line <= precedent.fin) {
      precedent.fin = Math.max(precedent.fin, derniere);
      precedent.selections.push(selection);
    } else {
      blocs.push({ debut: debut.line, fin: derniere, selections: [selection] });
    }
  }
  return blocs;
}

export function planDuplication(selections, versLeBas) {
  const blocs = blocsDeLignes(selections);
  let decalage = 0;
  const nouvelles = blocs.flatMap((bloc) => {
    const taille = bloc.fin - bloc.debut + 1;
    const deplacement = decalage + (versLeBas ? taille : 0);
    decalage += taille;
    return bloc.selections.map(({ anchor, head }) => ({ anchor: decaler(anchor, deplacement), head: decaler(head, deplacement) }));
  });
  return { blocs: blocs.map(({ debut, fin }) => ({ debut, fin })), selections: nouvelles };
}

function dupliquerLignes(cm, versLeBas) {
  const { Pos } = window.CodeMirror;
  const { blocs, selections } = planDuplication(cm.listSelections(), versLeBas);
  cm.operation(() => {
    for (const { debut, fin } of [...blocs].reverse()) {
      const texte = cm.getRange(Pos(debut, 0), Pos(fin, cm.getLine(fin).length));
      cm.replaceRange(`${texte}\n`, Pos(debut, 0));
    }
    cm.setSelections(selections.map(({ anchor, head }) => ({ anchor: Pos(anchor.line, anchor.ch), head: Pos(head.line, head.ch) })));
    cm.scrollIntoView();
  });
}

const UNITES_CLIC = { single: 'char', double: 'word', triple: 'line' };

export function configurerSouris(cm, repetition, evenement) {
  return evenement.altKey && !evenement.shiftKey ? { addNew: true, unit: UNITES_CLIC[repetition] } : {};
}

const copierVersLeHaut = (cm) => dupliquerLignes(cm, false);
const copierVersLeBas = (cm) => dupliquerLignes(cm, true);

export const RACCOURCIS_EDITION = {
  'Alt-Up': 'swapLineUp',
  'Alt-Down': 'swapLineDown',
  'Ctrl-Alt-Up': copierVersLeHaut,
  'Ctrl-Alt-Down': copierVersLeBas,
  'Shift-Alt-Up': copierVersLeHaut,
  'Shift-Alt-Down': copierVersLeBas,
  'Ctrl-Enter': 'insertLineAfter',
  'Shift-Ctrl-Enter': 'insertLineBefore',
  'Ctrl-L': 'selectLine',
  'Ctrl-D': 'selectNextOccurrence',
  'Shift-Ctrl-L': 'findAllUnder',
  'Shift-Ctrl-K': 'deleteLine',
  'Ctrl-/': 'toggleCommentIndented',
};
