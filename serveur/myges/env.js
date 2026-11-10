import fs from 'node:fs/promises';

function retirerGuillemets(valeur) {
  const entouree = valeur.length >= 2 && (valeur[0] === '"' || valeur[0] === "'") && valeur.at(-1) === valeur[0];
  return entouree ? valeur.slice(1, -1) : valeur;
}

export async function lireEnv(fichier) {
  let texte;
  try {
    texte = await fs.readFile(fichier, 'utf8');
  } catch (erreur) {
    if (erreur.code === 'ENOENT') return {};
    throw erreur;
  }
  const valeurs = {};
  for (const ligne of texte.split(/\r?\n/)) {
    const propre = ligne.trim();
    if (!propre || propre.startsWith('#')) continue;
    const egal = propre.indexOf('=');
    if (egal <= 0) continue;
    valeurs[propre.slice(0, egal).trim()] = retirerGuillemets(propre.slice(egal + 1).trim());
  }
  return valeurs;
}

export function identifiantsMyges(env) {
  const identifiant = env.MYGES_IDENTIFIANT ?? '';
  const motDePasse = env.MYGES_MOT_DE_PASSE ?? '';
  if (!identifiant || !motDePasse) return null;
  return { identifiant, motDePasse };
}
