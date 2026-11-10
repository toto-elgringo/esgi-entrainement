import { aleatoire, attendre, bouton, choix, commandes, creerSvg, curseur, html, info, svg, vider } from './outils.js';

const cloner = (valeur) => structuredClone(valeur);
const lignes = (texte) => texte.replace(/^\n/, '').replace(/\n$/, '').split('\n');

export function echapper(texte) {
  return String(texte).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function enrichir(texte) {
  return echapper(texte).replace(/`([^`]+)`|\*\*([^*]+)\*\*/g, (_, code, gras) => (code !== undefined ? `<code>${code}</code>` : `<strong>${gras}</strong>`));
}

const MOTS_CLES = {
  c: new Set(['int', 'void', 'return', 'if', 'else', 'while', 'for', 'typedef', 'struct', 'sizeof', 'char', 'NULL', 'const', 'unsigned']),
  rust: new Set(['fn', 'let', 'mut', 'if', 'else', 'for', 'in', 'while', 'loop', 'match', 'return', 'struct', 'enum', 'impl', 'pub', 'use', 'move', 'ref', 'self', 'Self', 'where', 'as', 'true', 'false']),
  python: new Set(['def', 'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'class', 'import', 'from', 'None', 'True', 'False', 'is', 'not', 'and', 'or', 'lambda', 'del', 'pass']),
};

function jeton(classe, texte) {
  return classe ? `<span class="anim-jeton-${classe}">${echapper(texte)}</span>` : echapper(texte);
}

export function colorerLigne(ligne, langage) {
  const motsCles = MOTS_CLES[langage] ?? new Set();
  let resultat = '';
  let i = 0;
  while (i < ligne.length) {
    const reste = ligne.slice(i);
    let morceau = null;
    let classe = '';
    if ((langage !== 'python' && reste.startsWith('//')) || (langage === 'python' && reste.startsWith('#'))) {
      morceau = reste;
      classe = 'commentaire';
    } else if (langage === 'c' && reste.startsWith('#')) {
      morceau = /^#\w+(\s*<[^>]*>)?/.exec(reste)[0];
      classe = 'mot';
    } else if (reste[0] === '"' || (langage === 'python' && reste[0] === "'")) {
      morceau = new RegExp(`^${reste[0]}(?:[^${reste[0]}\\\\]|\\\\.)*${reste[0]}?`).exec(reste)[0];
      classe = 'chaine';
    } else if (reste[0] === "'") {
      const caractere = /^'(?:[^'\\]|\\.)'/.exec(reste);
      const duree = /^'[A-Za-z_]\w*/.exec(reste);
      morceau = caractere?.[0] ?? duree?.[0] ?? "'";
      classe = caractere ? 'chaine' : duree ? 'type' : '';
    } else if (/^\d/.test(reste)) {
      morceau = /^\d[\d_]*(?:\.\d+)?(?:u8|u16|u32|u64|usize|i32|i64|f64)?/.exec(reste)[0];
      classe = 'nombre';
    } else if (/^[A-Za-z_]/.test(reste)) {
      const mot = /^[A-Za-z_]\w*/.exec(reste)[0];
      const macro = langage === 'rust' && reste[mot.length] === '!';
      morceau = macro ? `${mot}!` : mot;
      const apres = reste.slice(morceau.length).trimStart();
      if (motsCles.has(mot)) classe = 'mot';
      else if (macro || apres.startsWith('(')) classe = 'fonction';
      else if (/^[A-Z]/.test(mot)) classe = 'type';
    } else {
      morceau = /^[^\w"'#/]+|^./.exec(reste)[0];
    }
    resultat += jeton(classe, morceau);
    i += morceau.length;
  }
  return resultat;
}

function creerLecteur(zone, { disposition = 'cote', dessiner, preparer, delai = 1400 }) {
  const barre = commandes(zone);
  const grille = html('div', { classe: `anim-pas anim-pas-${disposition}` }, zone);
  const blocCode = html('pre', { classe: 'anim-code anim-pas-code' });
  const scene = html('div', { classe: 'anim-pas-scene' });
  if (disposition === 'dessus') grille.append(scene, blocCode);
  else grille.append(blocCode, scene);
  const texte = info(zone);
  texte.classList.add('anim-pas-texte');
  const erreur = html('pre', { classe: 'anim-erreur-compil' }, zone);
  const blocSortie = html('div', { classe: 'anim-console' }, zone);
  html('span', { classe: 'anim-console-titre', texte: 'Sortie' }, blocSortie);
  const sortie = html('pre', {}, blocSortie);
  const pilotes = commandes(zone);
  pilotes.classList.add('anim-pas-pilotes');
  const precedent = bouton(pilotes, '◀ Étape', () => { arreter(); aller(index - 1); });
  const suivant = bouton(pilotes, 'Étape ▶', () => { arreter(); aller(index + 1); }, { principal: true });
  const lecture = bouton(pilotes, '▶ Lecture auto', () => basculer());
  bouton(pilotes, '↺ Recommencer', () => { arreter(); aller(0); });
  const compteur = html('span', { classe: 'anim-pas-compteur' }, pilotes);

  let programme = null;
  let index = 0;
  let lectureEnCours = null;
  let lignesCode = [];

  function charger(nouveau) {
    arreter();
    programme = nouveau;
    vider(blocCode);
    lignesCode = nouveau.code.map((ligne, i) => html('span', {
      classe: 'anim-code-ligne',
      'data-numero': i + 1,
      html: colorerLigne(ligne, nouveau.langage) || ' ',
    }, blocCode));
    blocSortie.hidden = !nouveau.etapes.some((etape) => etape.sortie);
    preparer?.(nouveau);
    aller(0);
  }

  function aller(nouvelIndex) {
    const { etapes } = programme;
    index = Math.max(0, Math.min(etapes.length - 1, nouvelIndex));
    const etape = etapes[index];
    lignesCode.forEach((element, i) => element.classList.toggle('actif', i === etape.ligne - 1));
    texte.innerHTML = enrichir(etape.texte ?? '');
    erreur.hidden = !etape.erreur;
    erreur.textContent = etape.erreur ?? '';
    sortie.textContent = etape.sortie ?? '';
    precedent.disabled = index === 0;
    suivant.disabled = index === etapes.length - 1;
    compteur.textContent = `Étape ${index + 1} / ${etapes.length}`;
    dessiner(etape, programme, index);
  }

  function arreter() {
    lectureEnCours = null;
    lecture.textContent = '▶ Lecture auto';
  }

  async function basculer() {
    if (lectureEnCours) {
      arreter();
      return;
    }
    const jetonLecture = {};
    lectureEnCours = jetonLecture;
    lecture.textContent = '⏸ Pause';
    if (index >= programme.etapes.length - 1) aller(0);
    try {
      while (lectureEnCours === jetonLecture && index < programme.etapes.length - 1) {
        await attendre(zone, delai);
        if (lectureEnCours !== jetonLecture) return;
        aller(index + 1);
      }
    } catch {
      return;
    }
    if (lectureEnCours === jetonLecture) arreter();
  }

  return {
    barre,
    scene,
    charger,
    lire() {
      if (!lectureEnCours) basculer();
    },
    annoncer(message) {
      texte.innerHTML = enrichir(message);
    },
  };
}

function choisirScenarios(scenarios, options) {
  const demandes = String(options.scenarios ?? options.scenario ?? '').split(',').map((cle) => cle.trim()).filter(Boolean);
  const retenus = scenarios.filter(({ cle }) => demandes.includes(cle));
  return retenus.length ? retenus : scenarios;
}

function brancherScenarios(lecteur, scenarios, charger) {
  if (scenarios.length > 1) {
    choix(lecteur.barre, {
      options: scenarios.map(({ cle, nom }) => ({ valeur: cle, texte: nom })),
      valeur: scenarios[0].cle,
      auChangement: (cle) => charger(scenarios.find((scenario) => scenario.cle === cle)),
    });
  } else {
    lecteur.barre.hidden = true;
  }
  charger(scenarios[0]);
}

const ETATS_PASSAGERS = new Set(['nouveau', 'modifie', 'lu']);

function nettoyerEtats(memoire) {
  const nettoyer = (objet) => {
    if (ETATS_PASSAGERS.has(objet.etat)) delete objet.etat;
  };
  for (const cadre of memoire.cadres) {
    nettoyer(cadre);
    cadre.variables.forEach(nettoyer);
  }
  for (const bloc of memoire.tas) {
    nettoyer(bloc);
    (bloc.champs ?? []).forEach(nettoyer);
    if (bloc.etat === 'libere') bloc.vieux = true;
  }
}

function cibles(memoire) {
  const ensemble = new Set();
  for (const cadre of memoire.cadres) for (const variable of cadre.variables) if (variable.vers) ensemble.add(variable.vers);
  for (const bloc of memoire.tas) for (const champ of bloc.champs ?? []) if (champ.vers) ensemble.add(champ.vers);
  return ensemble;
}

function outilsMemoire(memoire) {
  const cadre = (nom) => (nom ? memoire.cadres.findLast((element) => element.nom === nom) : memoire.cadres.at(-1));
  const bloc = (id) => memoire.tas.find((element) => element.id === id);
  const trouverVariable = (nom, nomCadre) => cadre(nomCadre).variables.find((variable) => variable.nom === nom);
  return {
    appel(nom) {
      memoire.cadres.push({ nom, variables: [], etat: 'nouveau' });
    },
    retour() {
      memoire.cadres.pop();
    },
    fermer() {
      cadre().etat = 'ferme';
    },
    variable(nom, valeur, { cadre: nomCadre, ...reste } = {}) {
      const conteneur = cadre(nomCadre);
      let variable = conteneur.variables.find((element) => element.nom === nom);
      if (variable) {
        for (const cle of ['vers', 'fleche', 'note', 'etat']) delete variable[cle];
        reste.etat ??= 'modifie';
      } else {
        variable = { nom };
        conteneur.variables.push(variable);
        reste.etat ??= 'nouveau';
      }
      Object.assign(variable, { valeur }, reste);
    },
    marquer(nom, etat, note, nomCadre) {
      const variable = trouverVariable(nom, nomCadre);
      variable.etat = etat;
      if (note !== undefined) variable.note = note;
      if (etat === 'invalide') delete variable.vers;
      if (etat === 'danger' && variable.vers) variable.fleche = 'danger';
    },
    retirer(...noms) {
      const conteneur = cadre();
      conteneur.variables = conteneur.variables.filter((variable) => !noms.includes(variable.nom));
    },
    allouer(id, titre, contenu = {}) {
      memoire.tas.push({ id, titre, etat: 'nouveau', ...contenu });
    },
    bloc(id, changements) {
      Object.assign(bloc(id), { etat: 'modifie' }, changements);
    },
    champ(id, nom, valeur, extra = {}) {
      const conteneur = bloc(id);
      let champ = conteneur.champs.find((element) => element.nom === nom);
      if (champ) {
        delete champ.vers;
        extra.etat ??= 'modifie';
      } else {
        champ = { nom };
        conteneur.champs.push(champ);
        extra.etat ??= 'nouveau';
      }
      Object.assign(champ, { valeur }, extra);
    },
    lire(id, nom) {
      if (nom === undefined) bloc(id).etat = 'lu';
      else bloc(id).champs.find((champ) => champ.nom === nom).etat = 'lu';
    },
    liberer(id, note) {
      Object.assign(bloc(id), { etat: 'libere' }, note ? { note } : {});
    },
    afficher(texte) {
      memoire.sortie += texte;
    },
  };
}

export function derouler(actions, depart = {}) {
  let memoire = { cadres: [], tas: [], sortie: '', ...cloner(depart) };
  return actions.map(({ faire, ...etape }) => {
    memoire = cloner(memoire);
    memoire.cadres = memoire.cadres.filter((cadre) => cadre.etat !== 'ferme');
    nettoyerEtats(memoire);
    faire?.(outilsMemoire(memoire));
    const visees = cibles(memoire);
    memoire.tas = memoire.tas.filter((bloc) => !(bloc.vieux && !visees.has(bloc.id)));
    for (const bloc of memoire.tas) delete bloc.vieux;
    return { ...etape, sortie: memoire.sortie, memoire: cloner(memoire) };
  });
}

const MEM = {
  largeur: 500,
  gauche: 6,
  largeurCadre: 210,
  droite: 260,
  largeurBloc: 198,
  debut: 28,
  entete: 22,
  rangee: 40,
  rangeeChamp: 30,
  ecart: 12,
};

const arrondi = (valeur) => Math.round(valeur * 10) / 10;

function pointe(bout, direction) {
  const base = { x: bout.x - direction.x * 8, y: bout.y - direction.y * 8 };
  const normale = { x: -direction.y * 4.5, y: direction.x * 4.5 };
  return [bout, { x: base.x + normale.x, y: base.y + normale.y }, { x: base.x - normale.x, y: base.y - normale.y }]
    .map(({ x, y }) => `${arrondi(x)},${arrondi(y)}`)
    .join(' ');
}

function courbeMemoire(depart, cible, versLaDroite) {
  const [a, b] = [depart, cible].map(({ x, y }) => ({ x: arrondi(x), y: arrondi(y) }));
  if (versLaDroite) {
    const k = arrondi(Math.max(28, (b.x - a.x) / 2));
    return { d: `M${a.x} ${a.y} C${a.x + k} ${a.y} ${b.x - k} ${b.y} ${b.x} ${b.y}`, pointe: pointe(b, { x: 1, y: 0 }) };
  }
  const k = arrondi(20 + Math.min(22, Math.abs(b.y - a.y) * 0.12));
  return { d: `M${a.x} ${a.y} C${a.x + k} ${a.y} ${b.x + k} ${b.y} ${b.x} ${b.y}`, pointe: pointe(b, { x: -1, y: 0 }) };
}

export function disposerMemoire(memoire) {
  const positions = new Map();
  const sources = [];
  let y = MEM.debut;
  const cadres = memoire.cadres.map((cadre) => {
    const variables = cadre.variables.map((variable, i) => {
      const haut = y + MEM.entete + i * MEM.rangee;
      const boite = { x: MEM.gauche + 104, y: haut + 4, l: 98, h: 24 };
      const ancre = { x: boite.x + boite.l, y: boite.y + boite.h / 2 };
      positions.set(`${cadre.nom}.${variable.nom}`, { colonne: 'gauche', droite: ancre });
      if (variable.vers) sources.push({ colonne: 'gauche', ancre, vers: variable.vers, fleche: variable.fleche });
      return { ...variable, y: haut, boite };
    });
    const place = { ...cadre, variables, x: MEM.gauche, y, l: MEM.largeurCadre, h: MEM.entete + Math.max(variables.length * MEM.rangee, 10) + 4 };
    y += place.h + MEM.ecart;
    return place;
  });
  const basGauche = y;
  y = MEM.debut;
  const blocs = memoire.tas.map((bloc) => {
    const x = MEM.droite;
    const champs = (bloc.champs ?? []).map((champ, i) => {
      const haut = y + MEM.entete + i * MEM.rangeeChamp;
      const boite = { x: x + 86, y: haut + 3, l: 102, h: 22 };
      const ancre = { x: boite.x + boite.l, y: boite.y + boite.h / 2 };
      positions.set(`${bloc.id}.${champ.nom}`, { colonne: 'droite', droite: ancre });
      if (champ.vers) sources.push({ colonne: 'droite', ancre, vers: champ.vers, fleche: champ.fleche });
      return { ...champ, y: haut, boite };
    });
    const cases = bloc.cases ?? null;
    const largeurCase = cases ? Math.min(24, (MEM.largeurBloc - 16) / Math.max(cases.length, 1)) : 0;
    let h = MEM.entete + 4;
    if (champs.length) h = MEM.entete + champs.length * MEM.rangeeChamp + 6;
    if (cases) h = MEM.entete + 32 + (bloc.indices ? 12 : 0);
    const place = { ...bloc, champs, cases, largeurCase, x, y, l: MEM.largeurBloc, h };
    positions.set(bloc.id, { colonne: 'droite', gauche: { x, y: y + 11 }, droite: { x: x + MEM.largeurBloc, y: y + 11 } });
    y += h + MEM.ecart;
    return place;
  });
  const fleches = sources.flatMap(({ colonne, ancre, vers, fleche }) => {
    const cible = positions.get(vers);
    if (!cible) return [];
    const versLaDroite = colonne === 'gauche' && cible.colonne === 'droite';
    const point = versLaDroite ? cible.gauche : cible.droite;
    return [{ ...courbeMemoire(ancre, point, versLaDroite), fleche: fleche ?? '', vers }];
  });
  return { cadres, blocs, fleches, hauteur: Math.max(basGauche, y, MEM.debut + 40) + 4 };
}

function dessinerMemoire(dessin, memoire, colonnes, hauteur) {
  const plan = disposerMemoire(memoire);
  dessin.replaceChildren();
  dessin.setAttribute('viewBox', `0 0 ${MEM.largeur} ${hauteur}`);
  svg('text', { x: MEM.gauche, y: 15, classe: 'mem-colonne', texte: colonnes[0] }, dessin);
  svg('text', { x: MEM.droite, y: 15, classe: 'mem-colonne', texte: colonnes[1] }, dessin);
  if (!plan.cadres.length) svg('text', { x: MEM.gauche + 4, y: MEM.debut + 18, classe: 'mem-vide', texte: 'vide' }, dessin);
  if (!plan.blocs.length) svg('text', { x: MEM.droite + 4, y: MEM.debut + 18, classe: 'mem-vide', texte: 'vide' }, dessin);

  plan.cadres.forEach((cadre, rang) => {
    const actif = rang === plan.cadres.length - 1 ? 'actif' : '';
    const groupe = svg('g', { classe: `mem-cadre ${actif} ${cadre.etat ?? ''} ${cadre.etat === 'nouveau' ? 'anim-apparait' : ''}` }, dessin);
    svg('rect', { x: cadre.x, y: cadre.y, width: cadre.l, height: cadre.h, rx: 8 }, groupe);
    svg('text', { x: cadre.x + 10, y: cadre.y + 15, classe: 'mem-cadre-titre', texte: cadre.nom }, groupe);
    for (const variable of cadre.variables) {
      const ligne = svg('g', { classe: `mem-variable ${variable.etat ?? ''} ${variable.etat === 'nouveau' ? 'anim-apparait' : ''}` }, groupe);
      svg('text', { x: cadre.x + 10, y: variable.y + 19, classe: 'mem-nom', texte: variable.nom, ...serrer(variable.nom, 11, 88) }, ligne);
      if (variable.adresse) svg('text', { x: cadre.x + 10, y: variable.y + 32, classe: 'mem-adresse', texte: variable.adresse }, ligne);
      dessinerBoite(ligne, variable);
      if (variable.note) {
        svg('text', { x: variable.boite.x + variable.boite.l / 2, y: variable.boite.y + variable.boite.h + 10, 'text-anchor': 'middle', classe: 'mem-note', texte: variable.note }, ligne);
      }
    }
  });

  for (const bloc of plan.blocs) {
    const groupe = svg('g', { classe: `mem-bloc ${bloc.etat ?? ''} ${bloc.etat === 'nouveau' ? 'anim-apparait' : ''}` }, dessin);
    svg('rect', { x: bloc.x, y: bloc.y, width: bloc.l, height: bloc.h, rx: 8 }, groupe);
    svg('text', { x: bloc.x + 10, y: bloc.y + 15, classe: 'mem-bloc-titre', texte: bloc.titre }, groupe);
    const note = bloc.note ?? (bloc.etat === 'libere' ? 'libéré' : '');
    if (note) svg('text', { x: bloc.x + bloc.l - 8, y: bloc.y + 15, 'text-anchor': 'end', classe: 'mem-note', texte: note }, groupe);
    if (bloc.cases) {
      bloc.cases.forEach((valeur, i) => {
        const x = bloc.x + 8 + i * bloc.largeurCase;
        svg('rect', { x, y: bloc.y + MEM.entete + 2, width: bloc.largeurCase, height: 26, classe: 'mem-case' }, groupe);
        svg('text', { x: x + bloc.largeurCase / 2, y: bloc.y + MEM.entete + 19, 'text-anchor': 'middle', classe: 'mem-valeur', texte: valeur }, groupe);
        if (bloc.indices) svg('text', { x: x + bloc.largeurCase / 2, y: bloc.y + MEM.entete + 41, 'text-anchor': 'middle', classe: 'mem-adresse', texte: i }, groupe);
      });
      if (!bloc.cases.length) svg('text', { x: bloc.x + 12, y: bloc.y + MEM.entete + 19, classe: 'mem-valeur', texte: '[ ]' }, groupe);
    }
    for (const champ of bloc.champs) {
      const ligne = svg('g', { classe: `mem-variable ${champ.etat ?? ''}` }, groupe);
      svg('text', { x: bloc.x + 10, y: champ.y + 18, classe: 'mem-nom', texte: champ.nom, ...serrer(champ.nom, 9, 70) }, ligne);
      dessinerBoite(ligne, champ);
    }
  }

  for (const fleche of plan.fleches) {
    const groupe = svg('g', { classe: `mem-fleche ${fleche.fleche}` }, dessin);
    svg('path', { d: fleche.d }, groupe);
    svg('polygon', { points: fleche.pointe }, groupe);
  }
}

function serrer(texte, maximum, largeur) {
  return texte.length > maximum ? { textLength: largeur, lengthAdjust: 'spacingAndGlyphs' } : {};
}

function dessinerBoite(parent, element) {
  const { boite } = element;
  svg('rect', { x: boite.x, y: boite.y, width: boite.l, height: boite.h, rx: 5, classe: 'mem-boite' }, parent);
  if (element.valeur === '' && element.vers) {
    svg('circle', { cx: boite.x + boite.l - 10, cy: boite.y + boite.h / 2, r: 3.5, classe: 'mem-point' }, parent);
  } else {
    svg('text', { x: boite.x + boite.l / 2, y: boite.y + boite.h / 2 + 4, 'text-anchor': 'middle', classe: 'mem-valeur', texte: element.valeur }, parent);
  }
}

function creerAnimationMemoire(scenarios) {
  return (zone, options) => {
    const retenus = choisirScenarios(scenarios, options);
    let hauteur = 200;
    let colonnes = ['Pile', 'Tas'];
    let dessin = null;
    const lecteur = creerLecteur(zone, {
      preparer(programme) {
        colonnes = programme.colonnes;
        hauteur = Math.max(...programme.etapes.map((etape) => disposerMemoire(etape.memoire).hauteur));
      },
      dessiner(etape) {
        dessinerMemoire(dessin, etape.memoire, colonnes, hauteur);
      },
    });
    dessin = creerSvg(lecteur.scene, MEM.largeur, hauteur, 'anim-memoire');
    brancherScenarios(lecteur, retenus, (scenario) => lecteur.charger(scenario));
  };
}

const PILE_TAS = ['Pile', 'Tas'];
const NOMS_OBJETS = ['Noms', 'Objets'];

const SCENARIO_POINTEURS = {
  cle: 'pointeurs',
  nom: 'Pointeurs et tas',
  langage: 'c',
  colonnes: PILE_TAS,
  code: lignes(`
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Point;

int main(void) {
    int n = 42;
    int *p = &n;
    *p = 50;
    Point *q = malloc(sizeof(Point));
    if (q == NULL) {
        return 1;
    }
    q->x = 1;
    q->y = 2;
    free(q);
    q = NULL;
    return 0;
}
`),
  etapes: derouler([
    { ligne: 8, texte: 'Le programme démarre : `main` reçoit un **cadre** sur la pile pour ses variables locales.', faire: (m) => m.appel('main') },
    { ligne: 9, texte: '`n` est rangée sur la pile, à une adresse (ici inventée : 0x7f10).', faire: (m) => m.variable('n', '42', { adresse: '0x7f10' }) },
    { ligne: 10, texte: '`&n` donne l’adresse de `n`. Le pointeur `p` la garde : il **pointe** sur `n`.', faire: (m) => m.variable('p', '0x7f10', { adresse: '0x7f08', vers: 'main.n' }) },
    { ligne: 11, texte: '`*p = 50` : « va à l’adresse contenue dans p » et écris 50. C’est `n` qui change, **à travers** le pointeur.', faire: (m) => m.variable('n', '50', { adresse: '0x7f10' }) },
    {
      ligne: 12,
      texte: '`malloc` réserve la place d’un `Point` sur le **tas** et renvoie son adresse. La mémoire n’est pas remplie : `x` et `y` valent n’importe quoi.',
      faire: (m) => {
        m.allouer('point', 'Point · 0x5a20', { champs: [{ nom: 'x', valeur: '?' }, { nom: 'y', valeur: '?' }] });
        m.variable('q', '0x5a20', { adresse: '0x7f00', vers: 'point' });
      },
    },
    { ligne: 13, texte: '`malloc` a réussi (`q` ne vaut pas `NULL`) : on ne rentre pas dans le `if`.' },
    { ligne: 16, texte: '`q->x = 1` : la flèche suit le pointeur jusqu’à la structure, puis prend le champ `x`.', faire: (m) => m.champ('point', 'x', '1') },
    { ligne: 17, texte: '`q->y = 2`.', faire: (m) => m.champ('point', 'y', '2') },
    {
      ligne: 18,
      texte: '`free(q)` rend la mémoire. Mais `q` contient **toujours** 0x5a20 : c’est un **pointeur pendouillant**. `q->x` serait maintenant une utilisation après `free`.',
      faire: (m) => {
        m.liberer('point');
        m.marquer('q', 'danger', 'pendouillant');
      },
    },
    { ligne: 19, texte: '`q = NULL` : plus aucune adresse dangereuse. Un `malloc`, un `free`, puis `NULL`.', faire: (m) => m.variable('q', 'NULL', { adresse: '0x7f00' }) },
    { ligne: 20, texte: '`main` se termine : son cadre disparaît de la pile, avec `n`, `p` et `q`.', faire: (m) => m.retour() },
  ]),
};

const SCENARIO_ADRESSE = {
  cle: 'adresse',
  nom: 'Copie ou adresse',
  langage: 'c',
  colonnes: PILE_TAS,
  code: lignes(`
#include <stdio.h>

void plusUnCopie(int x) {
    x = x + 1;
}

void plusUnAdresse(int *x) {
    *x = *x + 1;
}

int main(void) {
    int n = 5;
    plusUnCopie(n);
    printf("après plusUnCopie : %d\\n", n);
    plusUnAdresse(&n);
    printf("après plusUnAdresse : %d\\n", n);
    return 0;
}
`),
  etapes: derouler([
    { ligne: 11, texte: '`main` démarre avec son cadre sur la pile.', faire: (m) => m.appel('main') },
    { ligne: 12, texte: '`n` vaut 5, à l’adresse 0x7f1c.', faire: (m) => m.variable('n', '5', { adresse: '0x7f1c' }) },
    {
      ligne: 3,
      texte: 'Appel `plusUnCopie(n)` : un nouveau cadre, et le paramètre `x` reçoit une **copie** de la valeur de `n`.',
      faire: (m) => {
        m.appel('plusUnCopie');
        m.variable('x', '5', { adresse: '0x7ef4', note: 'copie de n' });
      },
    },
    { ligne: 4, texte: '`x = x + 1` : seule la copie change. `n` vaut toujours 5.', faire: (m) => m.variable('x', '6', { adresse: '0x7ef4', note: 'copie de n' }) },
    { ligne: 5, texte: 'Fin de la fonction : son cadre est effacé, la copie disparaît.', faire: (m) => m.retour() },
    { ligne: 14, texte: 'Le `printf` le confirme : rien n’a changé.', faire: (m) => m.afficher('après plusUnCopie : 5\n') },
    {
      ligne: 7,
      texte: 'Appel `plusUnAdresse(&n)` : cette fois, le paramètre `x` reçoit l’**adresse** de `n`.',
      faire: (m) => {
        m.appel('plusUnAdresse');
        m.variable('x', '0x7f1c', { adresse: '0x7ef4', vers: 'main.n' });
      },
    },
    { ligne: 8, texte: '`*x = *x + 1` : on lit et on écrit **à l’adresse** de `n`. C’est bien `n` qui passe à 6.', faire: (m) => m.variable('n', '6', { adresse: '0x7f1c', cadre: 'main' }) },
    { ligne: 9, texte: 'Fin de la fonction : son cadre disparaît, mais la modification de `n` reste.', faire: (m) => m.retour() },
    { ligne: 16, texte: 'Pour modifier une variable de l’appelant, on passe son **adresse**.', faire: (m) => m.afficher('après plusUnAdresse : 6\n') },
    { ligne: 17, texte: 'Fin du programme.', faire: (m) => m.retour() },
  ]),
};

const maillon = (valeur, next = 'NULL', vers) => ({
  champs: [{ nom: 'value', valeur }, { nom: 'next', valeur: next, ...(vers ? { vers } : {}) }],
});

const SCENARIO_COPIE_LISTE = {
  cle: 'liste',
  nom: 'Le piège de la copie',
  langage: 'c',
  colonnes: PILE_TAS,
  code: lignes(`
Cell *insererDebut(Cell *start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    nouveau->next = start;
    return nouveau;
}

int main(void) {
    Cell *start = NULL;
    start = insererDebut(start, 2);
    insererDebut(start, 3);
    start = insererDebut(start, 1);
    libererListe(start);
    return 0;
}
`),
  etapes: derouler([
    { ligne: 7, texte: '`main` démarre.', faire: (m) => m.appel('main') },
    { ligne: 8, texte: 'Liste vide : `start` vaut `NULL`.', faire: (m) => m.variable('start', 'NULL') },
    {
      ligne: 1,
      texte: 'Appel `insererDebut(start, 2)` : la fonction reçoit une **copie** de `start` (ici `NULL`).',
      faire: (m) => {
        m.appel('insererDebut');
        m.variable('start', 'NULL', { note: 'copie' });
        m.variable('valeur', '2');
      },
    },
    {
      ligne: 2,
      texte: '`creerCell(2)` réserve un maillon sur le tas.',
      faire: (m) => {
        m.allouer('c2', 'Cell · 0x5a10', maillon('2'));
        m.variable('nouveau', '0x5a10', { vers: 'c2' });
      },
    },
    { ligne: 3, texte: '`nouveau->next = start` : `NULL`, la liste était vide.', faire: (m) => m.champ('c2', 'next', 'NULL') },
    { ligne: 4, texte: '`return nouveau` : la fonction renvoie 0x5a10, son cadre disparaît.', faire: (m) => m.retour() },
    { ligne: 9, texte: '`start = …` : `main` **range** l’adresse renvoyée. La liste contient 2.', faire: (m) => m.variable('start', '0x5a10', { vers: 'c2' }) },
    {
      ligne: 1,
      texte: 'Appel `insererDebut(start, 3)` : une copie de `start`, qui désigne le maillon 2.',
      faire: (m) => {
        m.appel('insererDebut');
        m.variable('start', '0x5a10', { vers: 'c2', note: 'copie' });
        m.variable('valeur', '3');
      },
    },
    {
      ligne: 2,
      texte: 'Nouveau maillon pour 3.',
      faire: (m) => {
        m.allouer('c3', 'Cell · 0x5a30', maillon('3'));
        m.variable('nouveau', '0x5a30', { vers: 'c3' });
      },
    },
    { ligne: 3, texte: '`nouveau->next = start` : 3 est accroché devant 2.', faire: (m) => m.champ('c3', 'next', '0x5a10', { vers: 'c2' }) },
    { ligne: 4, texte: '`return nouveau` : le cadre disparaît… avec la seule variable qui connaissait 0x5a30.', faire: (m) => m.retour() },
    {
      ligne: 10,
      texte: 'Le résultat n’est rangé **nulle part** : le maillon 3 est perdu (**fuite mémoire**). Et `start` désigne toujours 2 : changer la copie n’a pas changé la variable de `main`.',
      faire: (m) => m.bloc('c3', { etat: 'danger', note: 'fuite !' }),
    },
    {
      ligne: 1,
      texte: 'Appel `insererDebut(start, 1)`, avec cette fois `start =` devant.',
      faire: (m) => {
        m.appel('insererDebut');
        m.variable('start', '0x5a10', { vers: 'c2', note: 'copie' });
        m.variable('valeur', '1');
      },
    },
    {
      ligne: 3,
      texte: 'Nouveau maillon 1, accroché devant 2.',
      faire: (m) => {
        m.allouer('c1', 'Cell · 0x5a50', maillon('1', '0x5a10', 'c2'));
        m.variable('nouveau', '0x5a50', { vers: 'c1' });
      },
    },
    {
      ligne: 11,
      texte: '`start = insererDebut(start, 1)` : `main` range le nouveau début. La liste est `1 -> 2 -> NULL`.',
      faire: (m) => {
        m.retour();
        m.variable('start', '0x5a50', { vers: 'c1' });
      },
    },
    {
      ligne: 12,
      texte: '`libererListe` rend 1 et 2. Le maillon 3, lui, n’est connu de personne : impossible de le libérer.',
      faire: (m) => {
        m.liberer('c1');
        m.liberer('c2');
        m.marquer('start', 'danger', 'pendouillant');
      },
    },
    {
      ligne: 13,
      texte: 'Fin : un `malloc` sans `free`. La vérification « toute la mémoire allouée a été libérée » échouerait. La règle : `start = insererDebut(start, …)`.',
      faire: (m) => m.retour(),
    },
  ]),
};

const texteRust = (texte) => [...texte];

const ERREUR_E0382 = lignes(`
error[E0382]: borrow of moved value: \`s\`
 --> src/main.rs:8:16
  |
6 |     let s = String::from("Coco");
  |         - move occurs because \`s\` has type \`String\`, which does not implement the \`Copy\` trait
7 |     changer(s);
  |             - value moved here
8 |     println!("{s}");
  |                ^ value borrowed here after move
`).join('\n');

const ERREUR_E0597 = lignes(`
error[E0597]: \`x\` does not live long enough
 --> src/main.rs:5:13
  |
4 |         let x = 5;
  |             - binding \`x\` declared here
5 |         r = &x;
  |             ^^ borrowed value does not live long enough
6 |     }
  |     - \`x\` dropped here while still borrowed
7 |     println!("{r}");
  |                - borrow later used here
`).join('\n');

const SCENARIO_MOVE = {
  cle: 'move',
  nom: 'Move',
  langage: 'rust',
  colonnes: PILE_TAS,
  code: lignes(`
fn changer(mut s: String) {
    s.push('!');
}

fn main() {
    let s = String::from("Coco");
    changer(s);
    println!("{s}");
}
`),
  etapes: derouler([
    { ligne: 5, texte: '`main` démarre avec son cadre sur la pile.', faire: (m) => m.appel('main') },
    {
      ligne: 6,
      texte: 'Le texte est rangé sur le **tas**. Sur la pile, `s` garde l’adresse, la longueur et la capacité. `s` est le **propriétaire**.',
      faire: (m) => {
        m.allouer('coco', 'String', { cases: texteRust('Coco') });
        m.variable('s', 'len 4 · cap 4', { vers: 'coco' });
      },
    },
    {
      ligne: 7,
      texte: '`changer(s)` : la String est **déplacée** (move). Rien n’est copié sur le tas : la propriété passe au paramètre de `changer`, et le `s` de `main` devient **invalide**.',
      faire: (m) => {
        m.marquer('s', 'invalide', 'déplacée');
        m.appel('changer');
        m.variable('s', 'len 4 · cap 4', { vers: 'coco', note: 'propriétaire' });
      },
    },
    {
      ligne: 2,
      texte: '`push(\'!\')` : la capacité 4 est pleine, la String demande un bloc plus grand (capacité 8).',
      faire: (m) => {
        m.bloc('coco', { cases: texteRust('Coco!') });
        m.variable('s', 'len 5 · cap 8', { vers: 'coco', note: 'propriétaire' });
      },
    },
    {
      ligne: 3,
      texte: 'Fin de `changer` : son `s` sort de sa portée. Rust appelle **drop** et libère le texte, tout seul.',
      faire: (m) => {
        m.liberer('coco', 'drop');
        m.retour();
      },
    },
    {
      ligne: 8,
      texte: 'Lire `s` ici reviendrait à lire de la mémoire libérée. Rust **refuse de compiler** : l’erreur arrive avant toute exécution. Solutions : emprunter (`&mut s`) ou rendre la valeur.',
      erreur: ERREUR_E0382,
    },
  ]),
};

const SCENARIO_CLONE = {
  cle: 'clone',
  nom: 'Copy et clone',
  langage: 'rust',
  colonnes: PILE_TAS,
  code: lignes(`
fn main() {
    let a = 5;
    let b = a;
    let s = String::from("Hey");
    let t = s.clone();
    let u = s;
    println!("{a} {b} {t} {u}");
}
`),
  etapes: derouler([
    { ligne: 1, texte: '`main` démarre.', faire: (m) => m.appel('main') },
    { ligne: 2, texte: 'Un entier, rangé directement sur la pile.', faire: (m) => m.variable('a', '5') },
    { ligne: 3, texte: 'Les entiers sont **Copy** : `b` reçoit une copie, `a` reste utilisable.', faire: (m) => m.variable('b', '5', { note: 'copie' }) },
    {
      ligne: 4,
      texte: 'Une String : le texte va sur le tas, `s` en est propriétaire.',
      faire: (m) => {
        m.allouer('hey1', 'String', { cases: texteRust('Hey') });
        m.variable('s', 'len 3 · cap 3', { vers: 'hey1' });
      },
    },
    {
      ligne: 5,
      texte: '`.clone()` fait une **vraie copie** : un deuxième bloc sur le tas. C’est explicite, et ça coûte.',
      faire: (m) => {
        m.allouer('hey2', 'String', { cases: texteRust('Hey') });
        m.variable('t', 'len 3 · cap 3', { vers: 'hey2', note: 'clone' });
      },
    },
    {
      ligne: 6,
      texte: 'Sans `clone` : **move**. `u` devient propriétaire du premier bloc, `s` est invalide.',
      faire: (m) => {
        m.marquer('s', 'invalide', 'déplacée');
        m.variable('u', 'len 3 · cap 3', { vers: 'hey1' });
      },
    },
    { ligne: 7, texte: '`a` et `b` sont valides tous les deux, `t` et `u` ont chacun leur texte. Utiliser `s` ici serait l’erreur E0382.', faire: (m) => m.afficher('5 5 Hey Hey\n') },
    {
      ligne: 8,
      texte: 'Fin de `main` : drop dans l’ordre **inverse** de création. D’abord `u` : son bloc est libéré.',
      faire: (m) => {
        m.liberer('hey1', 'drop');
        m.retirer('u');
      },
    },
    {
      ligne: 8,
      texte: 'Puis `t` : le bloc du clone est libéré.',
      faire: (m) => {
        m.liberer('hey2', 'drop');
        m.retirer('t');
      },
    },
    { ligne: 8, texte: '`s` a été déplacée : rien à libérer. Puis `b` et `a`, de simples entiers. Chaque bloc a été libéré **exactement une fois**.', faire: (m) => m.retour() },
  ]),
};

const SCENARIO_EMPRUNTS = {
  cle: 'emprunts',
  nom: 'Emprunts & et &mut',
  langage: 'rust',
  colonnes: PILE_TAS,
  code: lignes(`
fn main() {
    let mut s = String::from("Hey");
    let r1 = &s;
    let r2 = &s;
    println!("{r1} {r2}");
    let r = &mut s;
    r.push_str(" World");
    println!("{s}");
}
`),
  etapes: derouler([
    { ligne: 1, texte: '`main` démarre.', faire: (m) => m.appel('main') },
    {
      ligne: 2,
      texte: '`let mut` : on pourra modifier `s`.',
      faire: (m) => {
        m.allouer('hey', 'String', { cases: texteRust('Hey') });
        m.variable('s', 'len 3 · cap 3', { vers: 'hey' });
      },
    },
    { ligne: 3, texte: '`&s` : une référence en **lecture**. `r1` regarde `s` sans la posséder.', faire: (m) => m.variable('r1', '&s', { vers: 'main.s', fleche: 'lecture', note: 'lecture' }) },
    { ligne: 4, texte: 'Un deuxième lecteur : autorisé, on peut lire **autant de fois** qu’on veut.', faire: (m) => m.variable('r2', '&s', { vers: 'main.s', fleche: 'lecture', note: 'lecture' }) },
    { ligne: 5, texte: 'Dernière utilisation de `r1` et `r2` : leurs emprunts s’arrêtent **ici**, pas à la fin du bloc.', faire: (m) => m.afficher('Hey Hey\n') },
    {
      ligne: 6,
      texte: '`&mut s` : **un seul** écrivain, et plus aucun lecteur vivant : accepté. Si on utilisait encore `r1` après cette ligne, ce serait l’erreur E0502.',
      faire: (m) => {
        m.marquer('r1', 'invalide', 'emprunt fini');
        m.marquer('r2', 'invalide', 'emprunt fini');
        m.variable('r', '&mut s', { vers: 'main.s', fleche: 'ecriture', note: 'écriture' });
      },
    },
    {
      ligne: 7,
      texte: '`r` modifie `s` **à travers** la référence : le texte grandit (nouvelle capacité 9).',
      faire: (m) => {
        m.bloc('hey', { cases: texteRust('Hey World') });
        m.variable('s', 'len 9 · cap 9', { vers: 'hey' });
      },
    },
    {
      ligne: 8,
      texte: '`r` ne sert plus : `s` peut de nouveau être lue.',
      faire: (m) => {
        m.marquer('r', 'invalide', 'emprunt fini');
        m.afficher('Hey World\n');
      },
    },
    {
      ligne: 9,
      texte: 'Fin de `main` : le propriétaire `s` libère le texte. Les références, elles, ne libèrent rien.',
      faire: (m) => {
        m.liberer('hey', 'drop');
        m.retour();
      },
    },
  ]),
};

const SCENARIO_PENDANTE = {
  cle: 'pendante',
  nom: 'Référence pendante',
  langage: 'rust',
  colonnes: PILE_TAS,
  code: lignes(`
fn main() {
    let r;
    {
        let x = 5;
        r = &x;
    }
    println!("{r}");
}
`),
  etapes: derouler([
    { ligne: 1, texte: '`main` démarre.', faire: (m) => m.appel('main') },
    { ligne: 2, texte: '`r` est déclarée sans valeur : elle recevra une référence plus tard.', faire: (m) => m.variable('r', '?', { note: 'pas encore de valeur' }) },
    { ligne: 3, texte: 'Le bloc `{ }` ouvre une nouvelle **portée**.', faire: (m) => m.appel('bloc { }') },
    { ligne: 4, texte: '`x` n’existe que dans ce bloc.', faire: (m) => m.variable('x', '5') },
    { ligne: 5, texte: '`r` emprunte `x`. Mais `r` vit dans `main`, **plus longtemps** que `x`…', faire: (m) => m.variable('r', '&x', { cadre: 'main', vers: 'bloc { }.x', fleche: 'lecture' }) },
    {
      ligne: 6,
      texte: 'Fin du bloc : `x` est détruite. `r` désignerait une case qui n’existe plus : une **référence pendante**.',
      faire: (m) => {
        m.marquer('x', 'danger', 'détruite');
        m.marquer('r', 'danger', 'pendante', 'main');
        m.fermer();
      },
    },
    {
      ligne: 7,
      texte: 'Le **borrow checker** compare les durées de vie : `r` est utilisée après la mort de `x`. Il refuse de compiler, on ne peut pas lire une valeur détruite.',
      erreur: ERREUR_E0597,
    },
  ]),
};

const SCENARIO_PLUS_LONG = {
  cle: 'plus-long',
  nom: 'plus_long<\'a>',
  langage: 'rust',
  colonnes: PILE_TAS,
  code: lignes(`
fn plus_long<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

fn main() {
    let texte1 = String::from("bonjour");
    let resultat;
    {
        let texte2 = String::from("salut");
        resultat = plus_long(&texte1, &texte2);
        println!("{resultat}");
    }
}
`),
  etapes: derouler([
    { ligne: 5, texte: '`main` démarre.', faire: (m) => m.appel('main') },
    {
      ligne: 6,
      texte: '`texte1` possède « bonjour », rangé sur le tas.',
      faire: (m) => {
        m.allouer('t1', 'String', { cases: texteRust('bonjour') });
        m.variable('texte1', 'len 7 · cap 7', { vers: 't1' });
      },
    },
    { ligne: 7, texte: '`resultat` recevra une référence plus tard.', faire: (m) => m.variable('resultat', '?', { note: 'pas encore de valeur' }) },
    { ligne: 8, texte: 'Un bloc : une portée plus courte.', faire: (m) => m.appel('bloc { }') },
    {
      ligne: 9,
      texte: '`texte2` ne vit que dans ce bloc.',
      faire: (m) => {
        m.allouer('t2', 'String', { cases: texteRust('salut') });
        m.variable('texte2', 'len 5 · cap 5', { vers: 't2' });
      },
    },
    {
      ligne: 1,
      texte: 'Appel : `&texte1` et `&texte2` deviennent des `&str` (adresse + longueur) qui regardent le texte. Pour le compilateur, `\'a` est la **plus courte** des deux durées de vie : celle de `texte2`.',
      faire: (m) => {
        m.appel('plus_long');
        m.variable('a', '&str · len 7', { vers: 't1', fleche: 'lecture' });
        m.variable('b', '&str · len 5', { vers: 't2', fleche: 'lecture' });
      },
    },
    { ligne: 2, texte: '7 >= 5 : la fonction renvoie `a`.', faire: (m) => m.variable('a', '&str · len 7', { vers: 't1', fleche: 'lecture', etat: 'lu' }) },
    {
      ligne: 10,
      texte: '`resultat` désigne le texte de `texte1`. Il est valable pendant `\'a` : tant que `texte1` **et** `texte2` existent.',
      faire: (m) => {
        m.retour();
        m.variable('resultat', '&str · len 7', { cadre: 'main', vers: 't1', fleche: 'lecture' });
      },
    },
    { ligne: 11, texte: 'Utilisé dans le bloc : `texte2` existe encore, tout va bien.', faire: (m) => m.afficher('bonjour\n') },
    {
      ligne: 12,
      texte: 'Fin du bloc : `texte2` est détruite. Avec le `println!` placé **après** cette accolade, Rust refuserait (E0597 : `texte2` does not live long enough), même si `resultat` désigne `texte1` : il raisonne sur la signature, pas sur la valeur choisie à l’exécution.',
      faire: (m) => {
        m.liberer('t2', 'drop');
        m.fermer();
      },
    },
    {
      ligne: 13,
      texte: 'Fin de `main` : `texte1` est détruite à son tour.',
      faire: (m) => {
        m.liberer('t1', 'drop');
        m.retour();
      },
    },
  ]),
};

const GLOBAL = { cadres: [{ nom: 'global', variables: [] }] };

const SCENARIO_ALIAS = {
  cle: 'alias',
  nom: 'b = a',
  langage: 'python',
  colonnes: NOMS_OBJETS,
  code: lignes(`
a = [1, 2]
b = a
b.append(3)
print(a)
c = a[:]
c.append(4)
print(a, c)
`),
  etapes: derouler([
    {
      ligne: 1,
      texte: 'Python fabrique une liste, puis colle l’**étiquette** `a` dessus. Un nom n’est pas une boîte : c’est une flèche vers un objet.',
      faire: (m) => {
        m.allouer('l1', 'list', { cases: ['1', '2'], indices: true });
        m.variable('a', '', { vers: 'l1' });
      },
    },
    { ligne: 2, texte: '`b = a` ne copie rien : `b` est une **deuxième étiquette** sur la même liste.', faire: (m) => m.variable('b', '', { vers: 'l1' }) },
    { ligne: 3, texte: '`b.append(3)` modifie l’objet… que `a` désigne aussi.', faire: (m) => m.bloc('l1', { cases: ['1', '2', '3'] }) },
    { ligne: 4, texte: '`a` « a changé » sans qu’on y touche : c’est le même objet.', faire: (m) => m.afficher('[1, 2, 3]\n') },
    {
      ligne: 5,
      texte: '`a[:]` fabrique une **nouvelle** liste avec les mêmes valeurs : une vraie copie.',
      faire: (m) => {
        m.allouer('l2', 'list', { cases: ['1', '2', '3'], indices: true });
        m.variable('c', '', { vers: 'l2' });
      },
    },
    { ligne: 6, texte: '`c.append(4)` ne touche que la copie.', faire: (m) => m.bloc('l2', { cases: ['1', '2', '3', '4'] }) },
    { ligne: 7, texte: 'Deux objets distincts : `a is b` vaut `True`, `a is c` vaut `False`.', faire: (m) => m.afficher('[1, 2, 3] [1, 2, 3, 4]\n') },
  ], GLOBAL),
};

const SCENARIO_FONCTIONS = {
  cle: 'fonctions',
  nom: 'Arguments',
  langage: 'python',
  colonnes: NOMS_OBJETS,
  code: lignes(`
def ajoute_zero(l):
    l.append(0)


def double(n):
    n = n * 2


nombres = [1, 2]
ajoute_zero(nombres)
print(nombres)

x = 5
double(x)
print(x)
`),
  etapes: derouler([
    {
      ligne: 1,
      texte: '`def` crée un objet fonction et l’étiquette `ajoute_zero`.',
      faire: (m) => {
        m.allouer('f1', 'fonction ajoute_zero(l)');
        m.variable('ajoute_zero', '', { vers: 'f1' });
      },
    },
    {
      ligne: 5,
      texte: 'Pareil pour `double`.',
      faire: (m) => {
        m.allouer('f2', 'fonction double(n)');
        m.variable('double', '', { vers: 'f2' });
      },
    },
    {
      ligne: 9,
      texte: 'Une liste, désignée par `nombres`.',
      faire: (m) => {
        m.allouer('nombres', 'list', { cases: ['1', '2'], indices: true });
        m.variable('nombres', '', { vers: 'nombres' });
      },
    },
    {
      ligne: 10,
      texte: 'Appel : le paramètre `l` reçoit une **référence** vers la même liste, pas une copie.',
      faire: (m) => {
        m.appel('ajoute_zero');
        m.variable('l', '', { vers: 'nombres' });
      },
    },
    { ligne: 2, texte: '`l.append(0)` **modifie** l’objet partagé.', faire: (m) => m.bloc('nombres', { cases: ['1', '2', '0'] }) },
    { ligne: 2, texte: 'Fin de la fonction : son cadre disparaît, la liste modifiée reste.', faire: (m) => m.retour() },
    { ligne: 11, texte: 'La modification se voit dehors.', faire: (m) => m.afficher('[1, 2, 0]\n') },
    {
      ligne: 13,
      texte: 'Même un entier est un objet. `x` est une étiquette dessus.',
      faire: (m) => {
        m.allouer('i5', 'int', { cases: ['5'] });
        m.variable('x', '', { vers: 'i5' });
      },
    },
    {
      ligne: 14,
      texte: 'Appel : `n` désigne le même objet 5.',
      faire: (m) => {
        m.appel('double');
        m.variable('n', '', { vers: 'i5' });
      },
    },
    {
      ligne: 6,
      texte: '`n = n * 2` fabrique un **nouvel** objet 10 et y **déplace** l’étiquette `n`. Un `int` ne se modifie pas : `x` n’a pas bougé.',
      faire: (m) => {
        m.allouer('i10', 'int', { cases: ['10'] });
        m.variable('n', '', { vers: 'i10' });
      },
    },
    {
      ligne: 6,
      texte: 'Fin de `double` : `n` disparaît. Plus personne ne désigne 10, Python le supprime.',
      faire: (m) => {
        m.retour();
        m.liberer('i10', 'supprimé');
      },
    },
    { ligne: 15, texte: '**Modifier** l’objet reçu se voit dehors, **réaffecter** le paramètre non.', faire: (m) => m.afficher('5\n') },
  ], GLOBAL),
};

const ATTENTE = 'print(…) en attente';

const SCENARIO_DEFAUT = {
  cle: 'defaut',
  nom: 'Liste par défaut',
  langage: 'python',
  colonnes: NOMS_OBJETS,
  code: lignes(`
def ajoute_mauvais(x, l=[]):
    l.append(x)
    return l


def ajoute(x, l=None):
    if l is None:
        l = []
    l.append(x)
    return l


print(ajoute_mauvais(1), ajoute_mauvais(2))
print(ajoute(1), ajoute(2))
`),
  etapes: derouler([
    {
      ligne: 1,
      texte: 'Le `def` est lu **une seule fois** : la liste vide par défaut est créée maintenant, et rangée dans la fonction.',
      faire: (m) => {
        m.allouer('f1', 'fonction ajoute_mauvais', { champs: [{ nom: 'défaut', valeur: '', vers: 'defaut' }] });
        m.allouer('defaut', 'list', { cases: [] });
        m.variable('ajoute_mauvais', '', { vers: 'f1' });
      },
    },
    {
      ligne: 6,
      texte: 'Ici, la valeur par défaut est `None`.',
      faire: (m) => {
        m.allouer('f2', 'fonction ajoute', { champs: [{ nom: 'défaut', valeur: 'None' }] });
        m.variable('ajoute', '', { vers: 'f2' });
      },
    },
    {
      ligne: 13,
      texte: 'Premier appel sans `l` : `l` désigne la liste par défaut, celle rangée dans la fonction.',
      faire: (m) => {
        m.appel(ATTENTE);
        m.appel('ajoute_mauvais');
        m.variable('x', '1');
        m.variable('l', '', { vers: 'defaut' });
      },
    },
    { ligne: 2, texte: '`l.append(1)` remplit… la liste par défaut elle-même.', faire: (m) => m.bloc('defaut', { cases: ['1'] }) },
    {
      ligne: 3,
      texte: 'La fonction renvoie `l` : le premier résultat **est** la liste par défaut.',
      faire: (m) => {
        m.retour();
        m.variable('1er', '', { vers: 'defaut' });
      },
    },
    {
      ligne: 13,
      texte: 'Deuxième appel : la **même** liste par défaut, qui contient déjà 1.',
      faire: (m) => {
        m.appel('ajoute_mauvais');
        m.variable('x', '2');
        m.variable('l', '', { vers: 'defaut' });
      },
    },
    { ligne: 2, texte: '`l.append(2)`.', faire: (m) => m.bloc('defaut', { cases: ['1', '2'] }) },
    {
      ligne: 3,
      texte: 'Les deux résultats sont **le même objet** !',
      faire: (m) => {
        m.retour();
        m.variable('2e', '', { vers: 'defaut' });
      },
    },
    { ligne: 13, texte: 'Surprise : `[1, 2] [1, 2]`. Le premier résultat a changé après coup.', faire: (m) => { m.afficher('[1, 2] [1, 2]\n'); m.retour(); } },
    {
      ligne: 7,
      texte: 'Avec `None` par défaut : `l is None` est vrai…',
      faire: (m) => {
        m.appel(ATTENTE);
        m.appel('ajoute');
        m.variable('x', '1');
        m.variable('l', 'None');
      },
    },
    {
      ligne: 8,
      texte: '… donc une liste **neuve**, créée pendant l’appel.',
      faire: (m) => {
        m.allouer('n1', 'list', { cases: [] });
        m.variable('l', '', { vers: 'n1' });
      },
    },
    { ligne: 9, texte: '`l.append(1)`.', faire: (m) => m.bloc('n1', { cases: ['1'] }) },
    {
      ligne: 10,
      texte: 'Premier résultat : cette liste neuve.',
      faire: (m) => {
        m.retour();
        m.variable('1er', '', { vers: 'n1' });
      },
    },
    {
      ligne: 8,
      texte: 'Deuxième appel : encore une liste neuve.',
      faire: (m) => {
        m.appel('ajoute');
        m.variable('x', '2');
        m.allouer('n2', 'list', { cases: [] });
        m.variable('l', '', { vers: 'n2' });
      },
    },
    { ligne: 9, texte: '`l.append(2)`.', faire: (m) => m.bloc('n2', { cases: ['2'] }) },
    {
      ligne: 10,
      texte: 'Deuxième résultat : une autre liste.',
      faire: (m) => {
        m.retour();
        m.variable('2e', '', { vers: 'n2' });
      },
    },
    {
      ligne: 14,
      texte: 'Chaque appel a sa liste : `[1] [2]`. D’où la règle : **jamais de liste comme valeur par défaut**.',
      faire: (m) => {
        m.afficher('[1] [2]\n');
        m.retour();
        m.liberer('n1', 'supprimé');
        m.liberer('n2', 'supprimé');
      },
    },
  ], GLOBAL),
};

const SCENARIO_CLASSES = {
  cle: 'classes',
  nom: 'Classe et instances',
  langage: 'python',
  colonnes: NOMS_OBJETS,
  code: lignes(`
class Employee:
    emp_count = 0

    def __init__(self, name):
        self.name = name
        Employee.emp_count += 1


emp1 = Employee("Tom")
emp2 = Employee("Bob")
emp1.age = 7
print(emp1.age, hasattr(emp2, "age"))
emp1.emp_count = 100
print(Employee.emp_count, emp1.emp_count, emp2.emp_count)
`),
  etapes: derouler([
    {
      ligne: 1,
      texte: 'La classe est elle-même un objet : le **moule**. `emp_count` est une variable **de classe**, partagée par toutes les instances.',
      faire: (m) => {
        m.allouer('classe', 'classe Employee', { champs: [{ nom: 'emp_count', valeur: '0' }, { nom: '__init__', valeur: 'fonction' }] });
        m.variable('Employee', '', { vers: 'classe' });
      },
    },
    {
      ligne: 9,
      texte: '`Employee("Tom")` fabrique d’abord un objet vide, relié à sa classe…',
      faire: (m) => m.allouer('e1', 'objet Employee', { champs: [{ nom: '__class__', valeur: '', vers: 'classe' }] }),
    },
    {
      ligne: 4,
      texte: '… puis appelle `__init__` avec `self` = ce nouvel objet. On ne passe jamais `self` soi-même.',
      faire: (m) => {
        m.appel('__init__');
        m.variable('self', '', { vers: 'e1' });
        m.variable('name', "'Tom'");
      },
    },
    { ligne: 5, texte: '`self.name = name` crée une variable **d’instance**, rangée dans l’objet.', faire: (m) => m.champ('e1', 'name', "'Tom'") },
    { ligne: 6, texte: '`Employee.emp_count += 1` modifie la variable de classe.', faire: (m) => m.champ('classe', 'emp_count', '1') },
    {
      ligne: 9,
      texte: 'L’objet terminé reçoit l’étiquette `emp1`.',
      faire: (m) => {
        m.retour();
        m.variable('emp1', '', { vers: 'e1' });
      },
    },
    {
      ligne: 4,
      texte: 'Même chose pour `"Bob"` : une deuxième instance, construite avec le même moule.',
      faire: (m) => {
        m.allouer('e2', 'objet Employee', { champs: [{ nom: '__class__', valeur: '', vers: 'classe' }] });
        m.appel('__init__');
        m.variable('self', '', { vers: 'e2' });
        m.variable('name', "'Bob'");
      },
    },
    { ligne: 5, texte: 'Chaque objet a son propre `name`.', faire: (m) => m.champ('e2', 'name', "'Bob'") },
    { ligne: 6, texte: 'Le compteur de la classe passe à 2.', faire: (m) => m.champ('classe', 'emp_count', '2') },
    {
      ligne: 10,
      texte: '`emp2` désigne la deuxième instance.',
      faire: (m) => {
        m.retour();
        m.variable('emp2', '', { vers: 'e2' });
      },
    },
    { ligne: 11, texte: 'Un attribut ajouté **à la volée**, sur `emp1` seulement.', faire: (m) => m.champ('e1', 'age', '7') },
    { ligne: 12, texte: '`emp2` n’a pas d’attribut `age` : `hasattr` renvoie `False`.', faire: (m) => m.afficher('7 False\n') },
    { ligne: 13, texte: 'Piège : **écrire** `emp1.emp_count` crée une variable d’instance sur `emp1`. Celle de la classe ne bouge pas.', faire: (m) => m.champ('e1', 'emp_count', '100') },
    { ligne: 14, texte: '`Employee.emp_count` : lu directement dans la classe → 2.', faire: (m) => m.lire('classe', 'emp_count') },
    { ligne: 14, texte: '`emp1.emp_count` : trouvé dans l’objet → 100. Il **masque** celui de la classe.', faire: (m) => m.lire('e1', 'emp_count') },
    {
      ligne: 14,
      texte: '`emp2.emp_count` : absent de l’objet, Python **remonte** à la classe → 2.',
      faire: (m) => {
        m.lire('e2', '__class__');
        m.lire('classe', 'emp_count');
        m.afficher('2 100 2\n');
      },
    },
  ], GLOBAL),
};

export const SCENARIOS_MEMOIRE = {
  'memoire-pointeurs': [SCENARIO_POINTEURS, SCENARIO_ADRESSE, SCENARIO_COPIE_LISTE],
  ownership: [SCENARIO_MOVE, SCENARIO_CLONE, SCENARIO_EMPRUNTS],
  'durees-de-vie': [SCENARIO_PENDANTE, SCENARIO_PLUS_LONG],
  references: [SCENARIO_ALIAS, SCENARIO_FONCTIONS, SCENARIO_DEFAUT],
  'classes-objets': [SCENARIO_CLASSES],
};

const CODE_LISTE = {
  depart: lignes(`
typedef struct cell {
    int value;
    struct cell *next;
} Cell;
`),
  parcourir: lignes(`
int somme(Cell *start) {
    Cell *cur = start;
    int resultat = 0;
    while (cur != NULL) {
        resultat += cur->value;
        cur = cur->next;
    }
    return resultat;
}
`),
  tete: lignes(`
void insererDebutPtr(Cell **start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    nouveau->next = *start;
    *start = nouveau;
}
`),
  queue: lignes(`
void insererFin(Cell **start, int valeur) {
    Cell *nouveau = creerCell(valeur);
    if (*start == NULL) {
        *start = nouveau;
        return;
    }
    Cell *cur = *start;
    while (cur->next != NULL) {
        cur = cur->next;
    }
    cur->next = nouveau;
}
`),
  supprimerDebut: lignes(`
void supprimerDebut(Cell **start) {
    if (*start == NULL) {
        return;
    }
    Cell *ancien = *start;
    *start = ancien->next;
    free(ancien);
}
`),
  supprimerValeur: lignes(`
void supprimerValeur(Cell **start, int valeur) {
    if (*start == NULL) {
        return;
    }
    if ((*start)->value == valeur) {
        supprimerDebut(start);
        return;
    }
    Cell *prev = *start;
    while (prev->next != NULL && prev->next->value != valeur) {
        prev = prev->next;
    }
    if (prev->next != NULL) {
        Cell *cible = prev->next;
        prev->next = cible->next;
        free(cible);
    }
}
`),
  inverser: lignes(`
Cell *inverser(Cell *start) {
    Cell *prev = NULL;
    Cell *cur = start;
    while (cur != NULL) {
        Cell *suivant = cur->next;
        cur->next = prev;
        prev = cur;
        cur = suivant;
    }
    return prev;
}
`),
};

export function creerListe(valeurs) {
  const maillons = valeurs.map((valeur, i) => ({ id: `m${i}`, valeur, next: i + 1 < valeurs.length ? `m${i + 1}` : null, rang: i }));
  return { maillons, start: maillons.length ? 'm0' : null, pointeurs: {}, variables: {}, prochain: valeurs.length };
}

const trouver = (liste, id) => liste.maillons.find((element) => element.id === id);

function chaineIds(liste) {
  const ids = [];
  const vus = new Set();
  let id = liste.start;
  while (id !== null && !vus.has(id)) {
    vus.add(id);
    ids.push(id);
    id = trouver(liste, id).next;
  }
  return ids;
}

export function valeursListe(liste) {
  return chaineIds(liste).map((id) => trouver(liste, id).valeur);
}

export function ecrireListe(liste) {
  return [...valeursListe(liste), 'NULL'].join(' -> ');
}

function normaliserListe(liste) {
  liste.maillons = chaineIds(liste).map((id, rang) => {
    const { valeur, next } = trouver(liste, id);
    return { id, valeur, next, rang };
  });
  liste.pointeurs = {};
  liste.variables = {};
}

function enregistreur(depart) {
  let liste = cloner(depart);
  const etapes = [];
  return {
    get liste() {
      return liste;
    },
    etapes,
    pas(ligne, texte, faire) {
      liste = cloner(liste);
      for (const element of liste.maillons) if (element.etat !== 'libere') delete element.etat;
      faire?.(liste);
      etapes.push({ ligne, texte: typeof texte === 'function' ? texte(liste) : texte, liste: cloner(liste) });
    },
  };
}

function terminer(enr, ligne, debut = '') {
  enr.pas(ligne, (liste) => `${debut}Liste : \`${ecrireListe(liste)}\`.`, normaliserListe);
  return { etapes: enr.etapes, fin: enr.liste };
}

function operationParcourir(depart) {
  const enr = enregistreur(depart);
  let cur = depart.start;
  enr.pas(2, cur ? '`cur = start` : `cur` part du premier maillon. On ne touche **jamais** à `start`.' : '`cur = start` : liste vide, `cur` vaut `NULL`.', (liste) => { liste.pointeurs.cur = cur; });
  let resultat = 0;
  enr.pas(3, '`resultat` part de 0.', (liste) => { liste.variables.resultat = 0; });
  while (cur !== null) {
    enr.pas(4, '`cur != NULL` est vrai : on entre dans la boucle.');
    const { valeur, next } = trouver(enr.liste, cur);
    resultat += valeur;
    const total = resultat;
    const lu = cur;
    enr.pas(5, `\`resultat += cur->value\` : on ajoute ${valeur}, resultat vaut ${total}.`, (liste) => {
      liste.variables.resultat = total;
      trouver(liste, lu).etat = 'lu';
    });
    enr.pas(6, next ? '`cur = cur->next` : `cur` avance d’un maillon.' : '`cur = cur->next` : c’était le dernier, `cur` vaut `NULL`.', (liste) => { liste.pointeurs.cur = next; });
    cur = next;
  }
  enr.pas(4, '`cur != NULL` est faux : on sort de la boucle.');
  enr.pas(8, `\`return resultat\` : la somme vaut ${resultat}. Chaque maillon a été visité une fois : O(N).`);
  return terminer(enr, 9, 'La liste n’a pas changé. ');
}

function operationTete(depart, valeur) {
  const enr = enregistreur(depart);
  const id = `m${depart.prochain}`;
  const ancien = depart.start;
  enr.pas(1, `Appel \`insererDebutPtr(&start, ${valeur})\` : la fonction reçoit l’**adresse** de la variable \`start\`.`, (liste) => { liste.variables.valeur = valeur; });
  enr.pas(2, `\`creerCell(${valeur})\` réserve un maillon sur le tas, avec \`next = NULL\`.`, (liste) => {
    for (const element of liste.maillons) element.rang += 1;
    liste.maillons.push({ id, valeur, next: null, rang: 0, haut: true, etat: 'nouveau' });
    liste.prochain += 1;
    liste.pointeurs.nouveau = id;
  });
  enr.pas(3, ancien ? '**Accrocher d’abord** : `nouveau->next = *start`, le nouveau maillon pointe sur l’ancien premier.' : '`nouveau->next = *start` : la liste était vide, `next` reste `NULL`.', (liste) => {
    Object.assign(trouver(liste, id), { next: ancien, etat: 'modifie' });
  });
  enr.pas(4, '**Puis déplacer la tête** : `*start = nouveau`. Trois instructions quelle que soit la longueur : O(1).', (liste) => { liste.start = id; });
  return terminer(enr, 5);
}

function operationQueue(depart, valeur) {
  const enr = enregistreur(depart);
  const id = `m${depart.prochain}`;
  const taille = chaineIds(depart).length;
  enr.pas(1, `Appel \`insererFin(&start, ${valeur})\`.`, (liste) => { liste.variables.valeur = valeur; });
  enr.pas(2, `\`creerCell(${valeur})\` : nouveau maillon, \`next = NULL\`.`, (liste) => {
    liste.maillons.push({ id, valeur, next: null, rang: taille, haut: true, etat: 'nouveau' });
    liste.prochain += 1;
    liste.pointeurs.nouveau = id;
  });
  if (depart.start === null) {
    enr.pas(3, '`*start == NULL` est vrai : la liste est vide.');
    enr.pas(4, '`*start = nouveau` : le maillon devient le premier. C’est pour ce cas qu’il faut `Cell **`.', (liste) => { liste.start = id; });
    enr.pas(5, '`return`.');
    return terminer(enr, 12);
  }
  enr.pas(3, '`*start == NULL` est faux : il faut trouver le dernier maillon.');
  let cur = depart.start;
  enr.pas(7, '`cur = *start` : `cur` part du premier maillon.', (liste) => { liste.pointeurs.cur = cur; });
  for (;;) {
    const suivant = trouver(enr.liste, cur).next;
    if (suivant === null) {
      enr.pas(8, '`cur->next != NULL` est faux : `cur` est **sur** le dernier maillon, on s’arrête.');
      break;
    }
    enr.pas(8, '`cur->next != NULL` est vrai : ce n’est pas le dernier.');
    enr.pas(9, '`cur = cur->next` : `cur` avance.', (liste) => { liste.pointeurs.cur = suivant; });
    cur = suivant;
  }
  const dernier = cur;
  enr.pas(11, `\`cur->next = nouveau\` : le dernier maillon est accroché au nouveau. Il a fallu marcher jusqu’au bout : O(N).`, (liste) => {
    Object.assign(trouver(liste, dernier), { next: id, etat: 'modifie' });
  });
  return terminer(enr, 12);
}

function operationSupprimerDebut(depart) {
  const enr = enregistreur(depart);
  const premier = depart.start;
  enr.pas(1, 'Appel `supprimerDebut(&start)`.');
  if (premier === null) {
    enr.pas(2, '`*start == NULL` : liste vide, rien à supprimer.');
    enr.pas(3, '`return`.');
    return terminer(enr, 8);
  }
  enr.pas(2, '`*start == NULL` est faux.');
  enr.pas(5, '`ancien = *start` : on garde l’adresse du premier maillon.', (liste) => { liste.pointeurs.ancien = premier; });
  enr.pas(6, '`*start = ancien->next` : la tête passe au suivant. On lit `ancien->next` **avant** le `free`.', (liste) => { liste.start = trouver(liste, premier).next; });
  enr.pas(7, '`free(ancien)` : la mémoire est rendue. Sans ce `free`, ce serait une fuite. O(1).', (liste) => { trouver(liste, premier).etat = 'libere'; });
  return terminer(enr, 8);
}

function operationSupprimerValeur(depart, valeur) {
  const enr = enregistreur(depart);
  const premier = depart.start;
  enr.pas(1, `Appel \`supprimerValeur(&start, ${valeur})\`.`, (liste) => { liste.variables.valeur = valeur; });
  if (premier === null) {
    enr.pas(2, '`*start == NULL` : liste vide, rien à faire.');
    enr.pas(3, '`return`.');
    return terminer(enr, 18);
  }
  enr.pas(2, '`*start == NULL` est faux.');
  const valeurPremier = trouver(depart, premier).valeur;
  if (valeurPremier === valeur) {
    enr.pas(5, `Le premier maillon vaut ${valeur} : c’est le début qui change.`, (liste) => { trouver(liste, premier).etat = 'lu'; });
    enr.pas(6, '`supprimerDebut(start)` : la tête passe au suivant, puis le maillon est libéré.', (liste) => {
      liste.start = trouver(liste, premier).next;
      trouver(liste, premier).etat = 'libere';
    });
    enr.pas(7, '`return`.');
    return terminer(enr, 18);
  }
  enr.pas(5, `Le premier maillon vaut ${valeurPremier}, pas ${valeur}.`, (liste) => { trouver(liste, premier).etat = 'lu'; });
  let prev = premier;
  enr.pas(9, '`prev = *start` : `prev` regarde toujours **un cran plus loin** (`prev->next`), car il faut le maillon d’avant.', (liste) => { liste.pointeurs.prev = prev; });
  for (;;) {
    const suivant = trouver(enr.liste, prev).next;
    if (suivant === null) {
      enr.pas(10, '`prev->next` vaut `NULL` : on est au bout, on sort.');
      break;
    }
    const valeurSuivant = trouver(enr.liste, suivant).valeur;
    if (valeurSuivant === valeur) {
      enr.pas(10, `\`prev->next->value\` vaut ${valeur} : trouvé, \`prev\` est juste avant la cible.`, (liste) => { trouver(liste, suivant).etat = 'lu'; });
      break;
    }
    enr.pas(10, `\`prev->next->value\` vaut ${valeurSuivant}, pas ${valeur} : on continue.`, (liste) => { trouver(liste, suivant).etat = 'lu'; });
    enr.pas(11, '`prev = prev->next`.', (liste) => { liste.pointeurs.prev = suivant; });
    prev = suivant;
  }
  const avant = prev;
  const cible = trouver(enr.liste, avant).next;
  if (cible === null) {
    enr.pas(13, `\`prev->next == NULL\` : ${valeur} n’est pas dans la liste, rien ne change.`);
    return terminer(enr, 18);
  }
  enr.pas(13, '`prev->next != NULL` : la cible existe.');
  enr.pas(14, '`cible = prev->next`.', (liste) => { liste.pointeurs.cible = cible; });
  enr.pas(15, '`prev->next = cible->next` : on **saute** la cible, la chaîne est refermée.', (liste) => {
    Object.assign(trouver(liste, avant), { next: trouver(liste, cible).next, etat: 'modifie' });
    trouver(liste, cible).haut = true;
  });
  enr.pas(16, '`free(cible)` : maillon rendu, aucune fuite. O(N) à cause de la recherche.', (liste) => { trouver(liste, cible).etat = 'libere'; });
  return terminer(enr, 18);
}

function operationInverser(depart) {
  const enr = enregistreur(depart);
  enr.pas(1, 'Appel `inverser(start)` : on va retourner toutes les flèches, sans créer de maillon.');
  let prev = null;
  let cur = depart.start;
  enr.pas(2, '`prev = NULL` : la partie déjà inversée est vide.', (liste) => { liste.pointeurs.prev = null; });
  const debut = cur;
  enr.pas(3, '`cur = start`.', (liste) => { liste.pointeurs.cur = debut; });
  while (cur !== null) {
    enr.pas(4, '`cur != NULL` : encore un maillon à retourner.');
    const courant = cur;
    const precedent = prev;
    const suivant = trouver(enr.liste, courant).next;
    enr.pas(5, '`suivant = cur->next` : on garde la suite, sinon elle serait perdue.', (liste) => { liste.pointeurs.suivant = suivant; });
    enr.pas(6, '`cur->next = prev` : la flèche est **retournée**.', (liste) => { Object.assign(trouver(liste, courant), { next: precedent, etat: 'modifie' }); });
    enr.pas(7, '`prev = cur`.', (liste) => { liste.pointeurs.prev = courant; });
    enr.pas(8, '`cur = suivant`.', (liste) => { liste.pointeurs.cur = suivant; });
    prev = courant;
    cur = suivant;
  }
  enr.pas(4, '`cur` vaut `NULL` : tous les maillons sont retournés.');
  enr.pas(10, '`return prev` : `prev` est le nouveau premier maillon.');
  const nouveauDebut = prev;
  enr.pas(10, 'L’appelant range le résultat : `start = inverser(start);`. O(N), aucune mémoire en plus.', (liste) => { liste.start = nouveauDebut; });
  return terminer(enr, 11);
}

export const OPERATIONS_LISTE = {
  parcourir: { texte: 'Parcourir (somme)', code: CODE_LISTE.parcourir, executer: operationParcourir },
  tete: { texte: 'Insérer en tête', code: CODE_LISTE.tete, executer: operationTete, ajoute: true },
  queue: { texte: 'Insérer en queue', code: CODE_LISTE.queue, executer: operationQueue, ajoute: true },
  supprimerDebut: { texte: 'Supprimer en tête', code: CODE_LISTE.supprimerDebut, executer: operationSupprimerDebut },
  supprimerValeur: { texte: 'Supprimer la valeur', code: CODE_LISTE.supprimerValeur, executer: operationSupprimerValeur },
  inverser: { texte: 'Inverser', code: CODE_LISTE.inverser, executer: operationInverser },
};

const LISTE = { largeur: 740, hauteur: 250, x0: 112, pas: 96, l: 64, h: 34, yHaut: 42, yBas: 122, maximum: 6 };
const COULEURS_POINTEURS = {
  cur: 'var(--ansi-cyan)',
  prev: 'var(--ansi-magenta)',
  nouveau: 'var(--ansi-vert)',
  ancien: 'var(--ansi-jaune)',
  cible: 'var(--ansi-jaune)',
  suivant: 'var(--ansi-bleu)',
};

function placeMaillon(element) {
  return { x: LISTE.x0 + element.rang * LISTE.pas, y: element.haut ? LISTE.yHaut : LISTE.yBas };
}

function flecheListe(parent, d, bout, direction, classe = '') {
  const groupe = svg('g', { classe: `lc-fleche ${classe}` }, parent);
  svg('path', { d }, groupe);
  svg('polygon', { points: pointe(bout, direction) }, groupe);
}

function dessinerListe(dessin, liste, auClic) {
  dessin.replaceChildren();
  const milieu = LISTE.h / 2;
  const derniereRangee = Math.max(-1, ...liste.maillons.map((element) => element.rang));
  const placeNull = { x: LISTE.x0 + (derniereRangee + 1) * LISTE.pas, y: LISTE.yBas };

  Object.entries(liste.variables).forEach(([nom, valeur], i) => {
    svg('text', { x: 14, y: 22 + i * 16, classe: 'lc-variable', texte: `${nom} = ${valeur}` }, dessin);
  });

  const tete = svg('g', { classe: 'lc-tete' }, dessin);
  svg('text', { x: 14, y: LISTE.yBas - 8, classe: 'lc-etiquette', texte: 'start' }, tete);
  svg('rect', { x: 14, y: LISTE.yBas, width: 62, height: LISTE.h, rx: 6 }, tete);
  if (liste.start === null) svg('text', { x: 45, y: LISTE.yBas + milieu + 4, 'text-anchor': 'middle', classe: 'lc-null', texte: 'NULL' }, tete);
  else svg('circle', { cx: 62, cy: LISTE.yBas + milieu, r: 3.5, classe: 'lc-point' }, tete);

  for (const element of liste.maillons) {
    const { x, y } = placeMaillon(element);
    const groupe = svg('g', { classe: `lc-maillon ${element.etat ?? ''} ${element.etat === 'nouveau' ? 'anim-apparait' : ''}` }, dessin);
    svg('rect', { x, y, width: LISTE.l, height: LISTE.h, rx: 6, classe: 'lc-cadre' }, groupe);
    svg('line', { x1: x + 34, x2: x + 34, y1: y, y2: y + LISTE.h, classe: 'lc-separation' }, groupe);
    svg('text', { x: x + 17, y: y + milieu + 5, 'text-anchor': 'middle', classe: 'lc-valeur', texte: element.valeur }, groupe);
    if (element.next === null) svg('text', { x: x + 49, y: y + milieu + 3, 'text-anchor': 'middle', classe: 'lc-null', texte: 'NULL' }, groupe);
    else svg('circle', { cx: x + 49, cy: y + milieu, r: 3.5, classe: 'lc-point' }, groupe);
    if (element.etat === 'libere') svg('text', { x: x + LISTE.l / 2, y: y - 7, 'text-anchor': 'middle', classe: 'lc-libere', texte: 'libéré' }, groupe);
    if (auClic && element.etat !== 'libere') {
      groupe.classList.add('lc-cliquable');
      svg('title', { texte: `Supprimer la valeur ${element.valeur}` }, groupe);
      groupe.addEventListener('click', () => auClic(element.valeur));
    }
  }

  if (liste.start !== null) {
    const cible = trouver(liste, liste.start);
    const { x, y } = placeMaillon(cible);
    const depart = { x: 66, y: LISTE.yBas + milieu };
    const devantLibre = !liste.maillons.some((element) => !element.haut && element.rang < cible.rang);
    if (devantLibre || cible.haut) {
      const bout = { x, y: y + milieu };
      flecheListe(dessin, `M${depart.x} ${depart.y} C${depart.x + 24} ${depart.y} ${bout.x - 24} ${bout.y} ${bout.x} ${bout.y}`, bout, { x: 1, y: 0 });
    } else {
      const bout = { x: x + 20, y };
      flecheListe(dessin, `M45 ${LISTE.yBas} C45 ${LISTE.yBas - 52} ${bout.x} ${bout.y - 52} ${bout.x} ${bout.y}`, bout, { x: 0, y: 1 });
    }
  }

  for (const element of liste.maillons) {
    if (element.next === null) continue;
    const cible = trouver(liste, element.next);
    if (!cible) continue;
    const a = placeMaillon(element);
    const b = placeMaillon(cible);
    const classe = element.etat === 'libere' ? 'danger' : '';
    if (cible.rang > element.rang) {
      const depart = { x: a.x + 49, y: a.y + milieu };
      const bout = { x: b.x, y: b.y + milieu };
      flecheListe(dessin, `M${depart.x} ${depart.y} C${depart.x + 30} ${depart.y} ${bout.x - 30} ${bout.y} ${bout.x} ${bout.y}`, bout, { x: 1, y: 0 }, classe);
    } else {
      const depart = { x: a.x + 49, y: a.y + LISTE.h };
      const bout = { x: b.x + 26, y: b.y + LISTE.h };
      flecheListe(dessin, `M${depart.x} ${depart.y} C${depart.x} ${depart.y + 34} ${bout.x} ${bout.y + 34} ${bout.x} ${bout.y}`, bout, { x: 0, y: -1 }, classe);
    }
  }

  const pointeurs = Object.entries(liste.pointeurs);
  if (pointeurs.some(([, vers]) => vers === null)) {
    svg('text', { x: placeNull.x + 20, y: placeNull.y + milieu + 4, 'text-anchor': 'middle', classe: 'lc-null lc-null-fin', texte: 'NULL' }, dessin);
  }
  const piles = new Map();
  for (const [nom, vers] of pointeurs) {
    const cible = vers === null ? null : trouver(liste, vers);
    const base = cible ? placeMaillon(cible) : placeNull;
    const centre = base.x + (cible ? LISTE.l / 2 : 20);
    const enHaut = Boolean(cible?.haut);
    const cle = `${centre}-${enHaut}`;
    const rangee = piles.get(cle) ?? 0;
    piles.set(cle, rangee + 1);
    const couleur = COULEURS_POINTEURS[nom] ?? 'var(--accent)';
    const groupe = svg('g', { classe: 'lc-pointeur', style: `--pointeur: ${couleur}` }, dessin);
    if (enHaut) {
      svg('text', { x: base.x - 8, y: base.y + 22 + rangee * 14, 'text-anchor': 'end', texte: `${nom} →` }, groupe);
    } else {
      const y = base.y + LISTE.h + 30 + rangee * 16;
      if (rangee === 0) svg('line', { x1: centre, x2: centre, y1: y - 12, y2: base.y + LISTE.h + 4 }, groupe);
      svg('text', { x: centre, y, 'text-anchor': 'middle', texte: nom }, groupe);
    }
  }
}

function lireValeurs(texte, defaut) {
  if (texte === undefined || texte === '') return defaut;
  const valeurs = String(texte).split(',').map((morceau) => Number(morceau.trim())).filter(Number.isFinite);
  return valeurs.slice(0, LISTE.maximum);
}

function creerListeChainee(zone, options) {
  let courante = creerListe(lireValeurs(options.liste, [0, 1, 2]));
  const demandees = String(options.operations ?? '').split(',').map((cle) => cle.trim()).filter((cle) => OPERATIONS_LISTE[cle]);
  const operations = demandees.length ? demandees : Object.keys(OPERATIONS_LISTE);
  const hasard = aleatoire(Number(options.graine) || 7);
  let dessin = null;
  const lecteur = creerLecteur(zone, {
    disposition: 'dessus',
    delai: 1100,
    dessiner(etape) {
      dessinerListe(dessin, etape.liste, operations.includes('supprimerValeur') ? (valeur) => lancer('supprimerValeur', valeur) : null);
    },
  });
  dessin = creerSvg(lecteur.scene, LISTE.largeur, LISTE.hauteur, 'anim-liste');
  const etiquette = html('label', { classe: 'anim-curseur lc-saisie' }, lecteur.barre);
  html('span', { classe: 'anim-curseur-libelle', texte: 'valeur' }, etiquette);
  const saisie = html('input', { type: 'number', min: -99, max: 99, value: 3 }, etiquette);
  const tirer = () => { saisie.value = 1 + Math.floor(hasard() * 98); };
  for (const cle of operations) {
    bouton(lecteur.barre, OPERATIONS_LISTE[cle].texte, () => lancer(cle, Number(saisie.value) || 0));
  }

  function lancer(cle, valeur) {
    const operation = OPERATIONS_LISTE[cle];
    if (operation.ajoute && valeursListe(courante).length >= LISTE.maximum) {
      lecteur.annoncer(`La liste est pleine pour l’affichage (${LISTE.maximum} maillons) : supprime d’abord un maillon.`);
      return;
    }
    const { etapes, fin } = operation.executer(courante, valeur);
    courante = fin;
    if (operation.ajoute) tirer();
    lecteur.charger({ code: operation.code, langage: 'c', etapes });
    lecteur.lire();
  }

  lecteur.charger({
    code: CODE_LISTE.depart,
    langage: 'c',
    etapes: [{
      ligne: 0,
      texte: operations.includes('supprimerValeur')
        ? 'Choisis une opération. Clique sur un maillon pour supprimer sa valeur.'
        : 'Choisis une opération pour la voir pas à pas.',
      liste: courante,
    }],
  });
}

const formaterValeurs = (valeurs) => `[${valeurs.join(', ')}]`;

export function simulerIterateur({ source, adaptateurs, consommateur, prologue = [], epilogue = () => [] }) {
  const stations = adaptateurs.length + 2;
  const etat = {
    jeton: null,
    donnes: Array(stations).fill(0),
    rejets: Array(stations).fill(null).map(() => []),
    consommes: 0,
    resultat: consommateur.type === 'sum' ? 0 : [],
    arret: null,
    sortie: '',
  };
  const evenements = [];
  const noter = (station, type, ligne, texte, extra = {}) => {
    evenements.push({ station, type, ligne, texte, ...extra, sortie: etat.sortie, etat: cloner(etat) });
  };
  for (const { ligne, texte, sortie = '' } of prologue) {
    etat.sortie += sortie;
    noter(null, 'debut', ligne, texte);
  }
  const pris = Array(stations).fill(0);

  function suivant(niveau) {
    if (niveau === 0) {
      const valeur = source.valeur(etat.consommes);
      if (valeur === undefined) {
        etat.jeton = null;
        noter(0, 'vide', source.ligne, `\`${source.nom}\` n’a plus d’élément : il renvoie \`None\`.`);
        return null;
      }
      etat.consommes += 1;
      etat.donnes[0] += 1;
      etat.jeton = { station: 0, valeur };
      noter(0, 'produit', source.ligne, `\`${source.nom}\` donne ${valeur}.`, { valeur });
      return valeur;
    }
    const adaptateur = adaptateurs[niveau - 1];
    if (adaptateur.type === 'take') {
      if (pris[niveau] >= adaptateur.n) {
        etat.jeton = null;
        etat.arret = niveau;
        noter(niveau, 'stop', adaptateur.ligne, `\`take(${adaptateur.n})\` a déjà donné ${adaptateur.n} éléments : il répond \`None\` **sans rien demander** en amont.`);
        return null;
      }
      pris[niveau] += 1;
      const valeur = suivant(niveau - 1);
      if (valeur === null) return null;
      etat.donnes[niveau] += 1;
      etat.jeton = { station: niveau, valeur };
      noter(niveau, 'passe', adaptateur.ligne, `\`take\` laisse passer ${valeur} (${etat.donnes[niveau]} sur ${adaptateur.n}).`, { valeur });
      return valeur;
    }
    if (adaptateur.type === 'map') {
      const valeur = suivant(niveau - 1);
      if (valeur === null) return null;
      const image = adaptateur.f(valeur);
      etat.donnes[niveau] += 1;
      etat.sortie += adaptateur.affiche?.(valeur) ?? '';
      etat.jeton = { station: niveau, valeur: image };
      noter(niveau, 'transforme', adaptateur.ligne, `\`map\` applique la closure : ${valeur} → ${image}.`, { valeur: image });
      return image;
    }
    for (;;) {
      const valeur = suivant(niveau - 1);
      if (valeur === null) return null;
      if (adaptateur.f(valeur)) {
        etat.donnes[niveau] += 1;
        etat.jeton = { station: niveau, valeur, statut: 'garde' };
        noter(niveau, 'garde', adaptateur.ligne, `\`filter\` garde ${valeur} : ${adaptateur.condition(valeur)} est vrai.`, { valeur });
        return valeur;
      }
      etat.rejets[niveau].push(valeur);
      etat.jeton = { station: niveau, valeur, statut: 'rejete' };
      noter(niveau, 'rejette', adaptateur.ligne, `\`filter\` rejette ${valeur} (${adaptateur.condition(valeur)} est faux) et redemande aussitôt l’élément suivant.`, { valeur });
    }
  }

  const fin = stations - 1;
  for (;;) {
    const valeur = suivant(fin - 1);
    if (valeur === null) break;
    etat.donnes[fin] += 1;
    if (consommateur.type === 'sum') etat.resultat += valeur;
    else etat.resultat.push(valeur);
    etat.jeton = { station: fin, valeur };
    const bilan = consommateur.type === 'sum' ? `le total vaut ${etat.resultat}` : `on a ${formaterValeurs(etat.resultat)}`;
    noter(fin, 'recoit', consommateur.ligne, `\`${consommateur.nom}\` reçoit ${valeur} : ${bilan}. Puis il redemande un élément.`, { valeur });
  }
  etat.jeton = null;
  const resultat = consommateur.type === 'sum' ? etat.resultat : formaterValeurs(etat.resultat);
  noter(fin, 'fin', consommateur.ligne, `\`${consommateur.nom}\` reçoit \`None\` : c’est fini. Résultat : ${resultat}. La source a donné ${etat.consommes} élément${etat.consommes > 1 ? 's' : ''}.`);
  for (const { ligne, texte, sortie = '' } of epilogue(etat.resultat)) {
    etat.sortie += sortie;
    noter(null, 'epilogue', ligne, texte);
  }
  return { evenements, resultat: etat.resultat, consommes: etat.consommes };
}

const CHAINES = [
  {
    cle: 'paresse',
    nom: 'La paresse',
    code: lignes(`
let nombres = [1, 2, 3, 4];
let dizaines = nombres.iter().map(|x| {
    println!("je calcule {x} × 10");
    x * 10
});
println!("rien n'est encore calculé");
let deux_premiers: Vec<i32> = dizaines.take(2).collect();
println!("{deux_premiers:?}");
`),
    stations: [
      { libelle: 'iter()', detail: 'nombres' },
      { libelle: 'map', detail: '|x| … x * 10' },
      { libelle: 'take', detail: '2' },
      { libelle: 'collect', detail: 'Vec<i32>' },
    ],
    file: [1, 2, 3, 4],
    config: {
      source: { nom: 'nombres.iter()', ligne: 2, valeur: (i) => [1, 2, 3, 4][i] },
      adaptateurs: [
        { type: 'map', ligne: 3, f: (x) => x * 10, affiche: (x) => `je calcule ${x} × 10\n` },
        { type: 'take', ligne: 7, n: 2 },
      ],
      consommateur: { type: 'collect', nom: 'collect', ligne: 7 },
      prologue: [
        { ligne: 2, texte: 'L’itérateur est construit… et **rien n’est calculé** : `map` attend qu’on lui demande un élément.' },
        { ligne: 6, texte: 'La preuve : ce message s’affiche avant tout calcul.', sortie: "rien n'est encore calculé\n" },
        { ligne: 7, texte: '`collect` est un **consommateur** : il demande un élément à `take`, qui le demande à `map`, qui le demande à `iter()`…' },
      ],
      epilogue: () => [{ ligne: 8, texte: 'Les éléments 3 et 4 n’ont **jamais** été calculés : la paresse a évité du travail inutile.', sortie: '[10, 20]\n' }],
    },
  },
  {
    cle: 'infini',
    nom: 'Suite infinie',
    code: lignes(`
let carres_impairs: Vec<u64> = (1..).map(|n| n * n).filter(|c| c % 2 == 1).take(4).collect();
assert_eq!(carres_impairs, vec![1, 9, 25, 49]);
`),
    stations: [
      { libelle: '(1..)', detail: 'infinie' },
      { libelle: 'map', detail: '|n| n * n' },
      { libelle: 'filter', detail: '|c| c % 2 == 1' },
      { libelle: 'take', detail: '4' },
      { libelle: 'collect', detail: 'Vec<u64>' },
    ],
    file: null,
    config: {
      source: { nom: '(1..)', ligne: 1, valeur: (i) => i + 1 },
      adaptateurs: [
        { type: 'map', ligne: 1, f: (n) => n * n },
        { type: 'filter', ligne: 1, f: (c) => c % 2 === 1, condition: (c) => `${c} % 2 == 1` },
        { type: 'take', ligne: 1, n: 4 },
      ],
      consommateur: { type: 'collect', nom: 'collect', ligne: 1 },
      prologue: [{ ligne: 1, texte: '`(1..)` ne s’arrête jamais. Sans paresse, ce code tournerait pour toujours. Ici, `collect` tire les éléments **un par un**.' }],
      epilogue: () => [{ ligne: 2, texte: 'Une suite infinie, et pourtant seulement 7 nombres ont été produits : `take(4)` a coupé le robinet.' }],
    },
  },
  {
    cle: 'boucle',
    nom: 'Chaîne = boucle',
    code: lignes(`
let v = vec![1, 2, 3, 4, 5, 6];
let somme: i32 = v.iter().filter(|x| **x % 2 == 0).map(|x| x * x).sum();
println!("{somme}");
`),
    stations: [
      { libelle: 'iter()', detail: 'v' },
      { libelle: 'filter', detail: '|x| **x % 2 == 0' },
      { libelle: 'map', detail: '|x| x * x' },
      { libelle: 'sum', detail: 'i32' },
    ],
    file: [1, 2, 3, 4, 5, 6],
    config: {
      source: { nom: 'v.iter()', ligne: 2, valeur: (i) => [1, 2, 3, 4, 5, 6][i] },
      adaptateurs: [
        { type: 'filter', ligne: 2, f: (x) => x % 2 === 0, condition: (x) => `${x} % 2 == 0` },
        { type: 'map', ligne: 2, f: (x) => x * x },
      ],
      consommateur: { type: 'sum', nom: 'sum', ligne: 2 },
      prologue: [{ ligne: 2, texte: '« Garder les pairs, les mettre au carré, additionner. » Chaque élément traverse **toute** la chaîne avant que le suivant parte : c’est exactement une boucle `for`.' }],
      epilogue: (total) => [{ ligne: 3, texte: 'Même travail qu’une boucle écrite à la main, sans variable modifiable.', sortie: `${total}\n` }],
    },
  },
];

export const SCENARIOS_ITERATEURS = CHAINES.map((chaine) => ({ ...chaine, ...simulerIterateur(chaine.config) }));

const TUYAU = { largeur: 720, hauteur: 236, y: 132, l: 124, h: 50 };

function xStation(i, total) {
  return 74 + (i * (TUYAU.largeur - 148)) / (total - 1);
}

function resumeStation(chaine, i, etat) {
  const total = chaine.stations.length;
  const adaptateur = chaine.config.adaptateurs[i - 1];
  if (i === 0) return `a donné ${etat.donnes[0]}`;
  if (i === total - 1) return chaine.config.consommateur.type === 'sum' ? `total = ${etat.resultat}` : formaterValeurs(etat.resultat);
  if (adaptateur.type === 'take') return `${etat.donnes[i]} / ${adaptateur.n}`;
  if (adaptateur.type === 'filter') return `gardés : ${etat.donnes[i]}`;
  return `appelée ${etat.donnes[i]} fois`;
}

function dessinerTuyau(couche, chaine, evenement) {
  couche.replaceChildren();
  const { etat } = evenement;
  const total = chaine.stations.length;
  svg('line', { x1: xStation(0, total), x2: xStation(total - 1, total), y1: TUYAU.y, y2: TUYAU.y, classe: 'it-tuyau' }, couche);

  const valeurs = chaine.file ?? Array.from({ length: 9 }, (_, i) => i + 1);
  const largeurFile = 22;
  const departFile = Math.max(16, xStation(0, total) - ((valeurs.length + (chaine.file ? 0 : 1)) * largeurFile) / 2 + largeurFile / 2);
  valeurs.forEach((valeur, i) => {
    const classe = i < etat.consommes ? 'consomme' : i === etat.consommes ? 'prochain' : '';
    svg('text', { x: departFile + i * largeurFile, y: 30, 'text-anchor': 'middle', classe: `it-file ${classe}`, texte: valeur }, couche);
  });
  if (!chaine.file) svg('text', { x: departFile + valeurs.length * largeurFile, y: 30, 'text-anchor': 'middle', classe: 'it-file', texte: '…' }, couche);

  chaine.stations.forEach((station, i) => {
    const x = xStation(i, total);
    const classes = ['it-station'];
    if (evenement.station === i) classes.push('active');
    if (etat.arret === i) classes.push('stop');
    const groupe = svg('g', { classe: classes.join(' ') }, couche);
    svg('rect', { x: x - TUYAU.l / 2, y: TUYAU.y - TUYAU.h / 2, width: TUYAU.l, height: TUYAU.h, rx: 10 }, groupe);
    svg('text', { x, y: TUYAU.y - 4, 'text-anchor': 'middle', classe: 'it-libelle', texte: station.libelle }, groupe);
    svg('text', { x, y: TUYAU.y + 14, 'text-anchor': 'middle', classe: 'it-detail', texte: station.detail }, groupe);
    svg('text', { x, y: TUYAU.y + TUYAU.h / 2 + 18, 'text-anchor': 'middle', classe: i === total - 1 ? 'it-resultat' : 'it-compteur', texte: resumeStation(chaine, i, etat) }, couche);
    if (etat.rejets[i].length) {
      svg('text', { x, y: TUYAU.y + TUYAU.h / 2 + 36, 'text-anchor': 'middle', classe: 'it-rejets', texte: `✗ ${etat.rejets[i].join(', ')}` }, couche);
    }
    if (etat.arret === i) svg('text', { x, y: TUYAU.y - TUYAU.h / 2 - 34, 'text-anchor': 'middle', classe: 'it-none', texte: 'None' }, couche);
  });
}

function placerJeton(jetonSvg, chaine, evenement) {
  const { jeton } = evenement.etat;
  jetonSvg.classList.toggle('cache', !jeton);
  if (!jeton) return;
  const x = xStation(jeton.station, chaine.stations.length);
  jetonSvg.style.transform = `translate(${x}px, ${TUYAU.y - TUYAU.h / 2 - 22}px)`;
  jetonSvg.classList.toggle('garde', jeton.statut === 'garde');
  jetonSvg.classList.toggle('rejete', jeton.statut === 'rejete');
  jetonSvg.querySelector('text').textContent = jeton.valeur;
}

function creerIterateurs(zone, options) {
  const retenus = choisirScenarios(SCENARIOS_ITERATEURS, options);
  let dessin = null;
  let couche = null;
  let jetonSvg = null;
  let chaine = retenus[0];
  const lecteur = creerLecteur(zone, {
    disposition: 'dessus',
    delai: 1000,
    dessiner(evenement) {
      dessinerTuyau(couche, chaine, evenement);
      placerJeton(jetonSvg, chaine, evenement);
    },
  });
  dessin = creerSvg(lecteur.scene, TUYAU.largeur, TUYAU.hauteur, 'anim-tuyau');
  couche = svg('g', {}, dessin);
  jetonSvg = svg('g', { classe: 'it-jeton cache', style: `transform: translate(${xStation(0, 4)}px, ${TUYAU.y - TUYAU.h / 2 - 22}px)` }, dessin);
  svg('circle', { r: 17 }, jetonSvg);
  svg('text', { 'text-anchor': 'middle', y: 5 }, jetonSvg);
  brancherScenarios(lecteur, retenus, (choisie) => {
    chaine = choisie;
    lecteur.charger({ code: choisie.code, langage: 'rust', etapes: choisie.evenements });
  });
}

function normaliserBorne(valeur, longueur, pas, estDebut) {
  const [bas, haut] = pas < 0 ? [-1, longueur - 1] : [0, longueur];
  if (valeur === null) return { position: estDebut === pas < 0 ? haut : bas, detail: 'omis' };
  if (valeur < 0) {
    const position = valeur + longueur;
    return position < bas ? { position: bas, detail: 'trop-petit', calcul: position } : { position, detail: 'negatif' };
  }
  return valeur > haut ? { position: haut, detail: 'trop-grand' } : { position: valeur, detail: 'direct' };
}

export function decouper(longueur, debut = null, fin = null, pas = null) {
  const saut = pas ?? 1;
  if (saut === 0) return { erreur: 'ValueError: slice step cannot be zero', indices: [], explications: ['Un pas de 0 n’avancerait jamais : Python refuse.'] };
  const a = normaliserBorne(debut, longueur, saut, true);
  const b = normaliserBorne(fin, longueur, saut, false);
  const indices = [];
  for (let i = a.position; saut > 0 ? i < b.position : i > b.position; i += saut) indices.push(i);
  const explications = [];
  explications.push(pas === null ? 'pas omis : 1, on avance de 1.' : saut > 0 ? `pas = ${saut} : on avance de ${saut}.` : `pas = ${saut} : pas négatif, on **recule** de ${-saut}.`);
  const decrire = (nom, valeur, borne, omis) => {
    if (borne.detail === 'omis') return `${nom} ${omis}`;
    if (borne.detail === 'negatif') return `${nom} = ${valeur} : négatif, on compte depuis la fin : ${valeur} + ${longueur} = ${borne.position}.`;
    if (borne.detail === 'trop-petit') return `${nom} = ${valeur} : ${valeur} + ${longueur} = ${borne.calcul}, avant le début : ramené à ${borne.position}.`;
    if (borne.detail === 'trop-grand') return `${nom} = ${valeur} : après la fin, ramené à ${borne.position}.`;
    return `${nom} = ${valeur}.`;
  };
  explications.push(decrire('début', debut, a, saut > 0 ? 'omis : on part du premier (0).' : `omis : on part du dernier (${longueur - 1}).`));
  explications.push(decrire('fin', fin, b, saut > 0 ? `omise : jusqu’au bout (${longueur}).` : 'omise : jusqu’au tout début, 0 compris.'));
  explications.push(indices.length
    ? `indices pris : ${indices.join(', ')}. La fin n’est **jamais** incluse.`
    : 'aucun indice : la tranche est vide (le début est déjà au-delà de la fin dans le sens du pas).');
  return { indices, debut: a.position, fin: b.position, explications };
}

export function ecrireTranche(nom, debut, fin, pas) {
  const texte = (valeur) => (valeur === null ? '' : String(valeur));
  return `${nom}[${texte(debut)}:${texte(fin)}${pas === null ? '' : `:${pas}`}]`;
}

export function reprPython(valeurs, estChaine) {
  if (!estChaine) return formaterValeurs(valeurs);
  const texte = valeurs.join('');
  const guillemet = texte.includes("'") && !texte.includes('"') ? '"' : "'";
  return `${guillemet}${texte}${guillemet}`;
}

const SEQUENCES = {
  liste: {
    nom: 'l',
    titre: 'l = [1, 2, 3, 4, 5]',
    valeurs: [1, 2, 3, 4, 5],
    chaine: false,
    exemples: [[1, 4, null], [null, 4, null], [2, null, null], [null, null, 2], [null, null, -1], [-3, null, null]],
  },
  chaine: {
    nom: 's',
    titre: 's = "Hello World"',
    valeurs: [...'Hello World'],
    chaine: true,
    exemples: [[1, 4, null], [null, 5, null], [6, null, null], [null, null, -1], [-5, null, null], [null, null, 2]],
  },
};

const DECOUPE = { largeur: 640, hauteur: 168, case: 44, y: 50 };

function creerDecoupage(zone, options) {
  let cle = options.sequence === 'chaine' ? 'chaine' : 'liste';
  const reglages = {
    debut: { valeur: 1, omis: false },
    fin: { valeur: 4, omis: false },
    pas: { valeur: 1, omis: true },
  };
  const haut = commandes(zone);
  choix(haut, {
    options: Object.entries(SEQUENCES).map(([valeur, { titre }]) => ({ valeur, texte: titre })),
    valeur: cle,
    auChangement: (valeur) => {
      cle = valeur;
      remplirExemples();
      dessiner();
    },
  });
  const exemples = html('div', { classe: 'anim-commandes dc-exemples' }, zone);
  const panneau = html('div', { classe: 'dc-reglages' }, zone);
  const parametres = [
    parametre('debut', 'début', -13, 13),
    parametre('fin', 'fin', -13, 13),
    parametre('pas', 'pas', -3, 3),
  ];
  const dessin = creerSvg(zone, DECOUPE.largeur, DECOUPE.hauteur, 'dc-dessin');
  const expression = html('p', { classe: 'dc-expression' }, zone);
  const details = html('ul', { classe: 'dc-details' }, zone);

  function parametre(nom, libelle, min, max) {
    const ligne = html('div', { classe: 'dc-parametre' }, panneau);
    const reglage = curseur(ligne, {
      libelle,
      min,
      max,
      valeur: reglages[nom].valeur,
      auChangement: (valeur) => {
        Object.assign(reglages[nom], { valeur, omis: false });
        dessiner();
      },
    });
    const vide = html('button', { type: 'button', classe: 'anim-puce dc-vide', texte: 'vide', title: `Ne pas écrire ${libelle}` }, ligne);
    vide.addEventListener('click', () => {
      reglages[nom].omis = !reglages[nom].omis;
      dessiner();
    });
    return () => {
      vide.classList.toggle('actif', reglages[nom].omis);
      reglage.element.classList.toggle('dc-omis', reglages[nom].omis);
      reglage.fixer(reglages[nom].valeur);
    };
  }

  function remplirExemples() {
    vider(exemples);
    const sequence = SEQUENCES[cle];
    for (const [debut, fin, pas] of sequence.exemples) {
      const element = html('button', { type: 'button', classe: 'anim-puce dc-exemple', texte: ecrireTranche(sequence.nom, debut, fin, pas) }, exemples);
      element.addEventListener('click', () => {
        Object.assign(reglages.debut, { valeur: debut ?? reglages.debut.valeur, omis: debut === null });
        Object.assign(reglages.fin, { valeur: fin ?? reglages.fin.valeur, omis: fin === null });
        Object.assign(reglages.pas, { valeur: pas ?? 1, omis: pas === null });
        dessiner();
      });
    }
  }

  function dessiner() {
    parametres.forEach((maj) => maj());
    const sequence = SEQUENCES[cle];
    const n = sequence.valeurs.length;
    const lire = (nom) => (reglages[nom].omis ? null : reglages[nom].valeur);
    const [debut, fin, pas] = [lire('debut'), lire('fin'), lire('pas')];
    const resultat = decouper(n, debut, fin, pas);
    const ecrite = ecrireTranche(sequence.nom, debut, fin, pas);
    expression.innerHTML = resultat.erreur
      ? `<code>${echapper(ecrite)}</code> → <span class="dc-erreur">${echapper(resultat.erreur)}</span>`
      : `<code>${echapper(ecrite)}</code> → <code class="dc-resultat">${echapper(reprPython(resultat.indices.map((i) => sequence.valeurs[i]), sequence.chaine))}</code>`;
    details.innerHTML = resultat.explications.map((ligne) => `<li>${enrichir(ligne)}</li>`).join('');

    dessin.replaceChildren();
    const x0 = (DECOUPE.largeur - n * DECOUPE.case) / 2;
    const xCase = (i) => x0 + i * DECOUPE.case;
    const ordre = new Map(resultat.indices.map((indice, rang) => [indice, rang + 1]));
    for (const position of [-1, n]) {
      if (resultat.erreur || (position !== resultat.debut && position !== resultat.fin)) continue;
      svg('rect', { x: xCase(position) + 3, y: DECOUPE.y + 3, width: DECOUPE.case - 6, height: DECOUPE.case - 6, rx: 6, classe: 'dc-fantome' }, dessin);
    }
    sequence.valeurs.forEach((valeur, i) => {
      const rang = ordre.get(i);
      const groupe = svg('g', { classe: `dc-case ${rang ? 'pris' : ''}` }, dessin);
      svg('text', { x: xCase(i) + DECOUPE.case / 2, y: DECOUPE.y - 8, 'text-anchor': 'middle', classe: 'dc-indice', texte: i }, groupe);
      svg('rect', { x: xCase(i) + 2, y: DECOUPE.y, width: DECOUPE.case - 4, height: DECOUPE.case, rx: 7 }, groupe);
      svg('text', { x: xCase(i) + DECOUPE.case / 2, y: DECOUPE.y + 28, 'text-anchor': 'middle', classe: 'dc-valeur', texte: valeur === ' ' ? '␣' : valeur }, groupe);
      svg('text', { x: xCase(i) + DECOUPE.case / 2, y: DECOUPE.y + DECOUPE.case + 16, 'text-anchor': 'middle', classe: 'dc-indice negatif', texte: i - n }, groupe);
      if (rang) svg('text', { x: xCase(i) + DECOUPE.case - 7, y: DECOUPE.y + 12, 'text-anchor': 'end', classe: 'dc-ordre', texte: rang }, groupe);
    });
    if (!resultat.erreur) {
      const centre = (position) => xCase(position) + DECOUPE.case / 2;
      svg('text', { x: centre(resultat.debut), y: 16, 'text-anchor': 'middle', classe: 'dc-marque debut', texte: 'début ▼' }, dessin);
      svg('text', { x: centre(resultat.fin), y: DECOUPE.y + DECOUPE.case + 40, 'text-anchor': 'middle', classe: 'dc-marque fin', texte: '▲ fin (exclue)' }, dessin);
      if (resultat.indices.length > 1) {
        const premier = centre(resultat.indices[0]);
        const dernier = centre(resultat.indices.at(-1));
        const y = DECOUPE.y + DECOUPE.case + 58;
        const direction = dernier > premier ? 1 : -1;
        svg('line', { x1: premier, x2: dernier - direction * 6, y1: y, y2: y, classe: 'dc-sens' }, dessin);
        svg('polygon', { points: pointe({ x: dernier, y }, { x: direction, y: 0 }), classe: 'dc-sens-pointe' }, dessin);
      }
    }
  }

  remplirExemples();
  dessiner();
}

export const animationsCode = {
  'memoire-pointeurs': {
    titre: 'Dans la mémoire d’un programme C',
    badge: 'Pas à pas',
    consigne: 'Avance ligne par ligne : la pile à gauche, le tas à droite, les flèches sont les pointeurs.',
    creer: creerAnimationMemoire(SCENARIOS_MEMOIRE['memoire-pointeurs']),
  },
  'liste-chainee': {
    titre: 'Le laboratoire des listes chaînées',
    badge: 'Pas à pas',
    consigne: 'Lance une opération : le code de la fonction défile et les pointeurs (cur, prev, nouveau…) se déplacent sous les maillons.',
    creer: creerListeChainee,
  },
  ownership: {
    titre: 'Qui possède la String ?',
    badge: 'Pas à pas',
    consigne: 'Suis le propriétaire de chaque valeur : une variable déplacée devient grise, un drop libère le tas.',
    creer: creerAnimationMemoire(SCENARIOS_MEMOIRE.ownership),
  },
  'durees-de-vie': {
    titre: 'Une référence ne survit pas à sa valeur',
    badge: 'Pas à pas',
    consigne: 'Regarde ce que la référence désigne au moment où sa valeur disparaît.',
    creer: creerAnimationMemoire(SCENARIOS_MEMOIRE['durees-de-vie']),
  },
  iterateurs: {
    titre: 'Le tuyau des itérateurs',
    badge: 'Pas à pas',
    consigne: 'Chaque étape fait avancer un seul élément : rien ne bouge tant que le consommateur ne demande rien.',
    creer: creerIterateurs,
  },
  decoupage: {
    titre: 'Le découpeur de tranches',
    badge: 'Interactif',
    consigne: 'Règle début, fin et pas (ou « vide » pour ne pas les écrire), ou essaie un exemple du cours.',
    creer: creerDecoupage,
  },
  references: {
    titre: 'Des étiquettes sur des objets',
    badge: 'Pas à pas',
    consigne: 'En Python, un nom est une flèche vers un objet. Regarde qui désigne quoi à chaque ligne.',
    creer: creerAnimationMemoire(SCENARIOS_MEMOIRE.references),
  },
  'classes-objets': {
    titre: 'Le moule et les objets',
    badge: 'Pas à pas',
    consigne: 'Suis la construction des instances, puis la recherche d’un attribut : d’abord l’objet, ensuite la classe.',
    creer: creerAnimationMemoire(SCENARIOS_MEMOIRE['classes-objets']),
  },
};
