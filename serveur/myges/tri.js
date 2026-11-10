import { dossierDeMatiere, sansPrefixe } from './matieres.js';
import { cleDeComparaison } from './noms.js';

export function trierSupports({ supports, suivi, correspondance, contenuDossiers }) {
  const aTelecharger = [];
  const dejaPresents = [];
  const nouvelles = new Map();
  const vus = new Set();
  for (const support of supports) {
    if (vus.has(support.id) || suivi[support.id]) continue;
    vus.add(support.id);
    const { dossier, nouvelle } = dossierDeMatiere(correspondance, support.matiere);
    const cle = cleDeComparaison(support.nom);
    const present = (contenuDossiers[dossier] ?? []).find((nom) => cleDeComparaison(nom) === cle);
    if (present) {
      dejaPresents.push({ support, dossier, chemin: `${dossier}/Sources/${present}` });
      continue;
    }
    const matiereMyges = sansPrefixe(support.matiere);
    if (nouvelle) nouvelles.set(dossier, { matiere: matiereMyges, dossier });
    aTelecharger.push({ support, dossier, matiereMyges });
  }
  return { aTelecharger, dejaPresents, matieresNouvelles: [...nouvelles.values()] };
}
