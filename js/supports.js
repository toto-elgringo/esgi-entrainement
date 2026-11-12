export const TYPES_SUPPORT = { '.pdf': 'PDF', '.html': 'Interactif' };

function extension(fichier) {
  const point = fichier.lastIndexOf('.');
  return point === -1 ? '' : fichier.slice(point).toLowerCase();
}

export function typeSupport(fichier) {
  return TYPES_SUPPORT[extension(fichier)] ?? null;
}

export function cheminSupportSur(fichier) {
  if (typeof fichier !== 'string' || fichier.trim() === '' || fichier.includes('\\')) return false;
  if (fichier.startsWith('/') || /^[a-z]:/i.test(fichier)) return false;
  return fichier.split('/').every((morceau) => morceau !== '' && morceau !== '.' && morceau !== '..');
}

export function estLienWeb(support) {
  return typeof support?.url === 'string';
}

export function urlWebSure(url) {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

export function typeDeSupport(support) {
  return estLienWeb(support) ? (support.integrer ? 'Diapo' : 'Lien') : typeSupport(support.fichier);
}

export function adresseSupport(support) {
  return estLienWeb(support) ? support.url : lienSupport(support.fichier);
}

export function lienSupport(fichier) {
  return `supports/${fichier.split('/').map(encodeURIComponent).join('/')}`;
}

export function supportsDeChapitre(chapitre, matiere) {
  return (chapitre.supports ?? []).filter((support) => !support.matieres || !matiere || support.matieres.includes(matiere));
}

export function validerSupports(supports) {
  if (supports === undefined) return [];
  if (!Array.isArray(supports)) return ['chapitre.json : « supports » doit être une liste'];
  const problemes = [];
  supports.forEach((support, index) => {
    const prefixe = `chapitre.json, support ${index + 1}`;
    if (typeof support?.titre !== 'string' || support.titre.trim() === '') problemes.push(`${prefixe} : « titre » manquant`);
    if (estLienWeb(support)) {
      if (!urlWebSure(support.url)) problemes.push(`${prefixe} : « url » doit commencer par https://`);
    } else if (!cheminSupportSur(support?.fichier)) problemes.push(`${prefixe} : « fichier » doit être un chemin relatif avec des /`);
    else if (!typeSupport(support.fichier)) problemes.push(`${prefixe} : seuls les fichiers ${Object.keys(TYPES_SUPPORT).join(', ')} sont acceptés`);
    if (support?.matieres !== undefined && !Array.isArray(support.matieres)) problemes.push(`${prefixe} : « matieres » doit être une liste`);
  });
  return problemes;
}
