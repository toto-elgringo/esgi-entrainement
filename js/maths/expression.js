const FONCTIONS = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log10,
  log2: Math.log2,
  log10: Math.log10,
  sqrt: Math.sqrt,
  racine: Math.sqrt,
  abs: Math.abs,
};

const CONSTANTES = {
  e: Math.E,
  pi: Math.PI,
};

const LATEX_FONCTIONS = {
  sin: '\\sin',
  cos: '\\cos',
  tan: '\\tan',
  exp: '\\exp',
  ln: '\\ln',
  log: '\\log_{10}',
  log2: '\\log_{2}',
  log10: '\\log_{10}',
};

const REMPLACEMENTS = [
  [/π/g, 'pi'],
  [/√/g, 'sqrt'],
  [/[×·∙]/g, '*'],
  [/÷/g, '/'],
  [/²/g, '^2'],
  [/³/g, '^3'],
  [/[−–]/g, '-'],
  [/\*\*/g, '^'],
];

const NIVEAUX = {
  somme: 1,
  produit: 2,
  oppose: 3,
  puissance: 4,
  fonction: 5,
  atome: 6,
};

export class ErreurExpression extends Error {}

function nomsConnus(variables) {
  return [...Object.keys(FONCTIONS), ...Object.keys(CONSTANTES), ...variables].sort((a, b) => b.length - a.length);
}

function decouperMot(mot, variables) {
  const noms = nomsConnus(variables);
  const jetons = [];
  let reste = mot;
  while (reste) {
    const nom = noms.find((candidat) => reste.startsWith(candidat));
    if (!nom) throw new ErreurExpression(`« ${reste} » n'est pas reconnu`);
    if (nom in FONCTIONS) jetons.push({ type: 'fonction', nom });
    else if (variables.includes(nom)) jetons.push({ type: 'variable', nom });
    else jetons.push({ type: 'constante', nom });
    reste = reste.slice(nom.length);
  }
  return jetons;
}

function decouper(texte, variables) {
  let source = texte;
  for (const [motif, remplacement] of REMPLACEMENTS) source = source.replace(motif, remplacement);

  const jetons = [];
  let i = 0;
  while (i < source.length) {
    const caractere = source[i];
    if (/\s/.test(caractere)) {
      i++;
      continue;
    }
    const logarithme = /^log(2|10)(?![0-9])/.exec(source.slice(i));
    if (logarithme) {
      jetons.push({ type: 'fonction', nom: logarithme[0] });
      i += logarithme[0].length;
      continue;
    }
    if (/[0-9.,]/.test(caractere)) {
      let fin = i;
      while (fin < source.length && /[0-9.,]/.test(source[fin])) fin++;
      const brut = source.slice(i, fin).replace(',', '.');
      if (!/^(\d+\.?\d*|\.\d+)$/.test(brut)) throw new ErreurExpression(`Nombre mal écrit : « ${source.slice(i, fin)} »`);
      const precedent = jetons.at(-1);
      if (precedent?.type === 'nombre') {
        const milliers = /^\s+$/.test(source.slice(precedent.fin, i)) && /^\d+$/.test(precedent.brut) && /^\d{3}(\.\d+)?$/.test(brut);
        if (!milliers) throw new ErreurExpression('Deux nombres se suivent : ajoute une opération entre eux');
        precedent.valeur = precedent.valeur * 1000 + Number(brut);
        precedent.brut += brut;
        precedent.fin = fin;
      } else {
        jetons.push({ type: 'nombre', valeur: Number(brut), brut, fin });
      }
      i = fin;
      continue;
    }
    if (/[a-zA-Z]/.test(caractere)) {
      let fin = i;
      while (fin < source.length && /[a-zA-Z]/.test(source[fin])) fin++;
      jetons.push(...decouperMot(source.slice(i, fin), variables));
      i = fin;
      continue;
    }
    if ('+-*/^()!'.includes(caractere)) {
      jetons.push({ type: 'symbole', valeur: caractere });
      i++;
      continue;
    }
    throw new ErreurExpression(`Caractère non reconnu : « ${caractere} »`);
  }
  return jetons;
}

class Analyseur {
  constructor(jetons) {
    this.jetons = jetons;
    this.position = 0;
  }

  regarder() {
    return this.jetons[this.position];
  }

  avancer() {
    return this.jetons[this.position++];
  }

  estSymbole(valeur) {
    const jeton = this.regarder();
    return jeton?.type === 'symbole' && jeton.valeur === valeur;
  }

  attendre(valeur) {
    if (!this.estSymbole(valeur)) throw new ErreurExpression(`« ${valeur} » manquant`);
    this.avancer();
  }

  analyser() {
    if (this.jetons.length === 0) throw new ErreurExpression('Réponse vide');
    const arbre = this.somme();
    if (this.position < this.jetons.length) throw new ErreurExpression('Expression mal formée');
    return arbre;
  }

  somme() {
    let gauche = this.produit();
    while (this.estSymbole('+') || this.estSymbole('-')) {
      const op = this.avancer().valeur;
      gauche = { type: 'binaire', op, gauche, droite: this.produit() };
    }
    return gauche;
  }

  commenceFacteur() {
    const jeton = this.regarder();
    return Boolean(jeton) && (jeton.type !== 'symbole' || jeton.valeur === '(');
  }

  produit() {
    let gauche = this.unaire();
    for (;;) {
      if (this.estSymbole('*') || this.estSymbole('/')) {
        const op = this.avancer().valeur;
        gauche = { type: 'binaire', op, gauche, droite: this.unaire() };
      } else if (this.commenceFacteur()) {
        gauche = { type: 'binaire', op: '*', gauche, droite: this.puissance() };
      } else {
        return gauche;
      }
    }
  }

  unaire() {
    if (this.estSymbole('-') || this.estSymbole('+')) {
      const op = this.avancer().valeur;
      const argument = this.unaire();
      return op === '-' ? { type: 'oppose', argument } : argument;
    }
    return this.puissance();
  }

  puissance() {
    const base = this.postfixe();
    if (!this.estSymbole('^')) return base;
    this.avancer();
    return { type: 'binaire', op: '^', gauche: base, droite: this.unaire() };
  }

  postfixe() {
    let noeud = this.primaire();
    while (this.estSymbole('!')) {
      this.avancer();
      noeud = { type: 'factorielle', argument: noeud };
    }
    return noeud;
  }

  primaire() {
    const jeton = this.avancer();
    if (!jeton) throw new ErreurExpression('Expression incomplète');
    if (jeton.type === 'nombre') return { type: 'nombre', valeur: jeton.valeur };
    if (jeton.type === 'constante') return { type: 'constante', nom: jeton.nom };
    if (jeton.type === 'variable') return { type: 'variable', nom: jeton.nom };
    if (jeton.type === 'fonction') {
      if (this.estSymbole('(')) {
        this.avancer();
        const argument = this.somme();
        this.attendre(')');
        return { type: 'fonction', nom: jeton.nom, argument };
      }
      if (!this.regarder()) throw new ErreurExpression(`Il manque l'argument de ${jeton.nom}`);
      return { type: 'fonction', nom: jeton.nom, argument: this.puissance() };
    }
    if (jeton.valeur === '(') {
      const interieur = this.somme();
      this.attendre(')');
      return interieur;
    }
    throw new ErreurExpression(`« ${jeton.valeur} » mal placé`);
  }
}

export function analyser(texte, variables = ['x']) {
  return new Analyseur(decouper(String(texte), variables)).analyser();
}

function factorielle(n) {
  if (!Number.isInteger(n) || n < 0 || n > 170) return Number.NaN;
  let resultat = 1;
  for (let k = 2; k <= n; k++) resultat *= k;
  return resultat;
}

export function evaluer(arbre, valeurs = {}) {
  switch (arbre.type) {
    case 'nombre':
      return arbre.valeur;
    case 'constante':
      return CONSTANTES[arbre.nom];
    case 'variable':
      if (!(arbre.nom in valeurs)) throw new ErreurExpression(`Valeur manquante pour ${arbre.nom}`);
      return valeurs[arbre.nom];
    case 'oppose':
      return -evaluer(arbre.argument, valeurs);
    case 'factorielle':
      return factorielle(evaluer(arbre.argument, valeurs));
    case 'fonction':
      return FONCTIONS[arbre.nom](evaluer(arbre.argument, valeurs));
    case 'binaire': {
      const gauche = evaluer(arbre.gauche, valeurs);
      const droite = evaluer(arbre.droite, valeurs);
      if (arbre.op === '+') return gauche + droite;
      if (arbre.op === '-') return gauche - droite;
      if (arbre.op === '*') return gauche * droite;
      if (arbre.op === '/') return gauche / droite;
      return Math.pow(gauche, droite);
    }
    default:
      throw new ErreurExpression('Expression inconnue');
  }
}

function niveau(arbre) {
  if (arbre.type === 'binaire') {
    if (arbre.op === '+' || arbre.op === '-') return NIVEAUX.somme;
    if (arbre.op === '^') return NIVEAUX.puissance;
    return NIVEAUX.produit;
  }
  if (arbre.type === 'oppose') return NIVEAUX.oppose;
  if (arbre.type === 'fonction' || arbre.type === 'factorielle') return NIVEAUX.fonction;
  if (arbre.type === 'nombre' && arbre.valeur < 0) return NIVEAUX.oppose;
  return NIVEAUX.atome;
}

function entourer(arbre, minimum) {
  const latex = versLatex(arbre);
  return niveau(arbre) < minimum ? `\\left(${latex}\\right)` : latex;
}

function nombreLatex(valeur) {
  return String(valeur).replace('.', '{,}');
}

export function versLatex(arbre) {
  switch (arbre.type) {
    case 'nombre':
      return nombreLatex(arbre.valeur);
    case 'constante':
      return arbre.nom === 'pi' ? '\\pi' : 'e';
    case 'variable':
      return arbre.nom;
    case 'oppose':
      return `-${entourer(arbre.argument, NIVEAUX.oppose)}`;
    case 'factorielle':
      return `${entourer(arbre.argument, NIVEAUX.atome)}!`;
    case 'fonction': {
      const interieur = versLatex(arbre.argument);
      if (arbre.nom === 'sqrt' || arbre.nom === 'racine') return `\\sqrt{${interieur}}`;
      if (arbre.nom === 'abs') return `\\left|${interieur}\\right|`;
      return `${LATEX_FONCTIONS[arbre.nom]}\\left(${interieur}\\right)`;
    }
    case 'binaire': {
      if (arbre.op === '/') return `\\frac{${versLatex(arbre.gauche)}}{${versLatex(arbre.droite)}}`;
      if (arbre.op === '^') return `${entourer(arbre.gauche, NIVEAUX.fonction + 1)}^{${versLatex(arbre.droite)}}`;
      if (arbre.op === '*') return `${entourer(arbre.gauche, NIVEAUX.produit)} \\times ${entourer(arbre.droite, NIVEAUX.puissance)}`;
      const droite = entourer(arbre.droite, arbre.op === '-' ? NIVEAUX.produit : NIVEAUX.somme);
      return `${versLatex(arbre.gauche)} ${arbre.op} ${droite}`;
    }
    default:
      return '';
  }
}
