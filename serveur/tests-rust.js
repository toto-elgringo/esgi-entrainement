const MACROS_ASSERTION = /^(assert_eq|assert_ne|assert)!\s*[([{]/;
const LITTERAL = /^(-?\d[\d_.]*[a-z0-9]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)+'|true|false|None)$/;

function finLitteral(source, debut) {
  const caractere = source[debut];
  if (caractere === '"') {
    let i = debut + 1;
    while (i < source.length && source[i] !== '"') i += source[i] === '\\' ? 2 : 1;
    return i + 1;
  }
  if (caractere === 'r' && !/[\w]/.test(source[debut - 1] ?? '')) {
    const ouverture = /^r(#*)"/.exec(source.slice(debut, debut + 40));
    if (!ouverture) return null;
    const fin = source.indexOf(`"${ouverture[1]}`, debut + ouverture[0].length);
    return fin === -1 ? source.length : fin + ouverture[1].length + 1;
  }
  if (caractere === "'") {
    const car = /^'(?:\\[^']*|[^\\'])'/.exec(source.slice(debut, debut + 12));
    return car ? debut + car[0].length : null;
  }
  return null;
}

export function lireArguments(source, debut) {
  const resultat = [];
  let profondeur = 0;
  let courant = '';
  let i = debut;
  while (i < source.length) {
    const caractere = source[i];
    const fin = finLitteral(source, i);
    if (fin !== null) {
      courant += source.slice(i, fin);
      i = fin;
      continue;
    }
    if (source.startsWith('//', i)) {
      const retour = source.indexOf('\n', i);
      i = retour === -1 ? source.length : retour;
      continue;
    }
    if (source.startsWith('/*', i)) {
      const fermeture = source.indexOf('*/', i + 2);
      i = fermeture === -1 ? source.length : fermeture + 2;
      continue;
    }
    if ('([{'.includes(caractere)) profondeur++;
    else if (')]}'.includes(caractere)) {
      if (profondeur === 0) break;
      profondeur--;
    } else if (caractere === ',' && profondeur === 0) {
      resultat.push(courant);
      courant = '';
      i++;
      continue;
    }
    courant += caractere;
    i++;
  }
  resultat.push(courant);
  return resultat.map((argument) => argument.replace(/\s+/g, ' ').trim()).filter((argument, index, liste) => argument || index < liste.length - 1);
}

function lireAssertion(source, ligne, colonne) {
  if (!source) return null;
  const lignes = source.split('\n');
  const reste = [(lignes[ligne - 1] ?? '').slice(colonne - 1), ...lignes.slice(ligne)].join('\n');
  const macro = MACROS_ASSERTION.exec(reste);
  if (!macro) return null;
  return { type: macro[1], arguments: lireArguments(reste, macro[0].length) };
}

function lireBlocs(sortie) {
  const blocs = new Map();
  const morceaux = sortie.split(/^---- (\S+) stdout ----\n/m);
  for (let i = 1; i < morceaux.length; i += 2) blocs.set(morceaux[i], morceaux[i + 1]);
  return blocs;
}

function decrireEchec(bloc, source) {
  const panique = /panicked at .+?:(\d+):(\d+):\n([\s\S]*?)(?:\nnote: |\n\n|$)/.exec(bloc ?? '');
  if (!panique) return {};
  const corps = panique[3].trim();
  const assertion = lireAssertion(source, Number(panique[1]), Number(panique[2]));

  const egalite = /^assertion `left (==|!=) right` failed(?:: ([\s\S]*?))?\n\s*left: ([\s\S]*?)\n\s*right: ([\s\S]*)$/.exec(corps);
  if (egalite) {
    const different = egalite[1] === '!=';
    let appel = assertion?.arguments[0] ?? null;
    let obtenu = egalite[3];
    let attendu = egalite[4];
    if (appel && !different && LITTERAL.test(appel) && assertion.arguments[1] && !LITTERAL.test(assertion.arguments[1])) {
      appel = assertion.arguments[1];
      [obtenu, attendu] = [attendu, obtenu];
    }
    return { appel, obtenu, attendu, different, indice: egalite[2] };
  }

  const condition = /^assertion failed: ([\s\S]*)$/.exec(corps);
  if (condition) return { condition: condition[1] };
  if (assertion?.type === 'assert' && assertion.arguments[0]) return { condition: assertion.arguments[0], indice: corps };
  return { erreur: corps };
}

export function analyserTestsRust(sortie, source) {
  const texte = sortie.replace(/\r\n/g, '\n');
  const blocs = lireBlocs(texte);
  return Array.from(texte.matchAll(/^test (\S+) \.\.\. (ok|FAILED)$/gm), ([, chemin, etat]) => {
    const nom = chemin.split('::').at(-1);
    return etat === 'ok' ? { nom, reussi: true } : { nom, reussi: false, ...decrireEchec(blocs.get(chemin), source) };
  });
}
