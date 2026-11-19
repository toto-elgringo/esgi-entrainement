export const LANGAGES = {
  rust: { nom: 'Rust', extension: 'rs', modeEditeur: 'rust', surligneur: 'rust' },
  python: { nom: 'Python', extension: 'py', modeEditeur: 'python', surligneur: 'python' },
  c: { nom: 'C', extension: 'c', modeEditeur: 'text/x-csrc', surligneur: 'c' },
};

export const DOMAINES_CODE = {
  rust: { langage: 'rust', matiere: { id: 'rust', titre: 'Rust' } },
  'rust-avance': { langage: 'rust', matiere: { id: 'rust-avance', titre: 'Rust avancé' } },
  python: { langage: 'python', matiere: { id: 'python', titre: 'Scripting Python' } },
  c: { langage: 'c', matiere: { id: 'algo-avancee', titre: 'Algorithmique avancée' } },
};

export const DOMAINES_REPONSES = {
  maths: { formules: true },
  combinatoire: { formules: true },
  anglais: { formules: false, langue: 'en' },
  electif: { formules: false },
};

export const ORDRE_MATIERES = [
  'informatique',
  'big-data',
  'combinatoire',
  'algo-avancee',
  'python',
  'rust',
  'rust-avance',
  'anglais',
  'electif',
];

export function estDomaineCode(domaine) {
  return Object.hasOwn(DOMAINES_CODE, domaine);
}

export function langageDe(domaine) {
  return DOMAINES_CODE[domaine].langage;
}

export function avecFormules(domaine) {
  return DOMAINES_REPONSES[domaine]?.formules ?? false;
}

export function langueDe(domaine) {
  return DOMAINES_REPONSES[domaine]?.langue ?? null;
}

export const PRESENTATIONS_MATIERES = {
  informatique: {
    icone: 'Σ',
    couleur: '#6d7cff',
    texte: 'Ensembles et logique, sommes, exponentielle et logarithme, étude de fonctions, espaces vectoriels.',
  },
  'big-data': {
    icone: '∫',
    couleur: '#2f9e8f',
    texte: 'Étude de fonctions et espaces vectoriels : les bases mathématiques du machine learning.',
  },
  combinatoire: {
    icone: 'n!',
    couleur: '#b06ad9',
    texte: 'Optimisation combinatoire, complexité, métaheuristiques : recherche locale, recuit simulé, algorithmes génétiques.',
  },
  'algo-avancee': {
    icone: 'C',
    couleur: '#5c8dd6',
    texte: 'Algorithmique en C : tableaux et complexité, tris simples, tri fusion, tri rapide, tri par tas, piles, files et listes chaînées. Code compilé et testé par gcc.',
  },
  python: {
    icone: 'Py',
    couleur: '#e0b13a',
    texte: 'Bases, fonctions, notions avancées et programmation objet. Exercices de code lancés par Python.',
  },
  rust: {
    icone: 'R',
    couleur: '#f46623',
    texte: 'Le cours de Rust de l’ESGI, puis les fondamentaux du langage. Exercices de code vérifiés par le compilateur.',
  },
  'rust-avance': {
    icone: 'R+',
    couleur: '#d6455d',
    texte: 'Rust avancé : pointeurs intelligents, traits, concurrence, async, macros et unsafe. Exercices de code vérifiés par le compilateur.',
  },
  anglais: {
    icone: 'En',
    couleur: '#d65c7a',
    texte: 'Préparation au TOEIC : vocabulaire professionnel, grammaire, mots de liaison, faux amis et questions types.',
  },
  electif: {
    icone: 'SIG',
    couleur: '#4caf7a',
    texte: 'Systèmes d’information géographique : QGIS, couches, Shapefile, BD TOPO et Lambert 93.',
  },
};

const PRESENTATION_INCONNUE = { icone: '?', couleur: '#6b7385', texte: '' };

export function presentationMatiere(id) {
  return PRESENTATIONS_MATIERES[id] ?? PRESENTATION_INCONNUE;
}

export function trierMatieres(matieres) {
  const rang = (matiere) => {
    const position = ORDRE_MATIERES.indexOf(matiere.id);
    return position === -1 ? ORDRE_MATIERES.length : position;
  };
  return [...matieres].sort((a, b) => rang(a) - rang(b));
}
