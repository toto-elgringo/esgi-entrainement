import path from 'node:path';

const INTERDITS = /[\\/:*?"<>|\u0000-\u001f]/g;
const RESERVES = /^(con|prn|aux|nul|com\d|lpt\d)$/i;
const EXTENSIONS = /\.(pdf|html?|zip|docx?|pptx?|xlsx?|odt|txt|md|rs|py|c)$/i;

export function nettoyerNom(nom) {
  const propre = nom.replace(INTERDITS, '-').trim().replace(/[. ]+$/, '');
  if (!propre) return 'document';
  const point = propre.indexOf('.');
  const base = point === -1 ? propre : propre.slice(0, point);
  if (RESERVES.test(base)) return `${base}_${propre.slice(base.length)}`;
  return propre;
}

export function cleDeComparaison(nom) {
  return nom
    .trim()
    .replace(EXTENSIONS, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function cheminSur(dossier, nom) {
  const racine = path.resolve(dossier);
  const chemin = path.join(racine, nettoyerNom(nom));
  if (path.dirname(chemin) !== racine) throw new Error(`Nom de fichier refusé : ${nom}`);
  return chemin;
}

export function nomLibre(nom, existants) {
  const pris = new Set(existants.map((existant) => existant.toLowerCase()));
  if (!pris.has(nom.toLowerCase())) return nom;
  const extension = path.extname(nom);
  const base = nom.slice(0, nom.length - extension.length);
  for (let numero = 2; ; numero += 1) {
    const candidat = `${base} (${numero})${extension}`;
    if (!pris.has(candidat.toLowerCase())) return candidat;
  }
}

export function nomDepuisDisposition(entete) {
  if (!entete) return null;
  const etoile = /filename\*\s*=\s*utf-8''([^;]+)/i.exec(entete);
  if (etoile) {
    try {
      return decodeURIComponent(etoile[1].trim());
    } catch {}
  }
  const simple = /filename\s*=\s*"([^"]*)"/i.exec(entete) ?? /filename\s*=\s*([^;]+)/i.exec(entete);
  if (!simple) return null;
  const brut = simple[1].trim();
  if (/[^\u0000-ÿ]/.test(brut)) return brut;
  const utf8 = Buffer.from(brut, 'latin1').toString('utf8');
  return utf8.includes('�') ? brut : utf8;
}
