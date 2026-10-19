export const LANGAGES = {
  rust: { nom: 'Rust', extension: 'rs', modeEditeur: 'rust', surligneur: 'rust' },
  python: { nom: 'Python', extension: 'py', modeEditeur: 'python', surligneur: 'python' },
  c: { nom: 'C', extension: 'c', modeEditeur: 'text/x-csrc', surligneur: 'c' },
};

export const DOMAINES_CODE = {
  rust: { matiere: { id: 'rust', titre: 'Rust' } },
  python: { matiere: { id: 'python', titre: 'Scripting Python' } },
  c: { matiere: { id: 'algo-avancee', titre: 'Algorithmique avancée' } },
};

export const DOMAINES_REPONSES = {
  maths: { formules: true },
  combinatoire: { formules: true },
  anglais: { formules: false },
  electif: { formules: false },
};

export const ORDRE_MATIERES = [
  'informatique',
  'big-data',
  'combinatoire',
  'algo-avancee',
  'python',
  'rust',
  'anglais',
  'electif',
];

export function estDomaineCode(domaine) {
  return Object.hasOwn(DOMAINES_CODE, domaine);
}

export function avecFormules(domaine) {
  return DOMAINES_REPONSES[domaine]?.formules ?? false;
}

export function trierMatieres(matieres) {
  const rang = (matiere) => {
    const position = ORDRE_MATIERES.indexOf(matiere.id);
    return position === -1 ? ORDRE_MATIERES.length : position;
  };
  return [...matieres].sort((a, b) => rang(a) - rang(b));
}
