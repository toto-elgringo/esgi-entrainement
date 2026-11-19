import { ecrireJson, lireJson } from '../commun/json.js';
import { nettoyerNom } from '../commun/noms.js';

function cle(nom) {
  return nom.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function sansPrefixe(matiere) {
  return matiere.replace(/^[a-z]{1,4}\d+\s*-\s*/i, '').replace(/\s+/g, ' ').trim();
}

export function dossierDeMatiere(correspondance, matiere) {
  const recherche = cle(sansPrefixe(matiere));
  const connue = Object.keys(correspondance).find((nom) => cle(sansPrefixe(nom)) === recherche);
  if (connue) return { dossier: correspondance[connue], nouvelle: false };
  const nom = sansPrefixe(matiere);
  return { dossier: nettoyerNom(nom.charAt(0).toUpperCase() + nom.slice(1)), nouvelle: true };
}

export async function ajouterMatieres(fichier, nouvelles) {
  if (!nouvelles.length) return;
  const correspondance = await lireJson(fichier, {});
  for (const { matiere, dossier } of nouvelles) correspondance[matiere] = dossier;
  const triee = Object.fromEntries(Object.entries(correspondance).sort(([a], [b]) => a.localeCompare(b, 'fr')));
  await ecrireJson(fichier, triee);
}
