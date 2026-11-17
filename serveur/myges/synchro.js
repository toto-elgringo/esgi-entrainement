import fs from 'node:fs/promises';
import path from 'node:path';
import { AUCUN_NOUVEAU_COURS, creerSynchroSource, promptClaude as promptCommun, TENTATIVES_AUTOMATIQUES } from '../synchro.js';
import { connecterSite } from './connexion.js';
import { identifiantsMyges, lireEnv } from './env.js';
import { ErreurMyges } from './erreurs.js';
import { ajouterMatieres, ecrireJson, lireJson } from './matieres.js';
import { listerSupports, telecharger } from './source.js';
import { trierSupports } from './tri.js';

export { AUCUN_NOUVEAU_COURS, TENTATIVES_AUTOMATIQUES };

async function lireContenuDossiers(vault) {
  const contenu = {};
  const dossiers = await fs.readdir(vault, { withFileTypes: true }).catch(() => []);
  for (const dossier of dossiers.filter((entree) => entree.isDirectory())) {
    contenu[dossier.name] = await fs.readdir(path.join(vault, dossier.name, 'Sources')).catch(() => []);
  }
  return contenu;
}

export function promptClaude(fichiers, { reprise = false } = {}) {
  return promptCommun(fichiers, {
    reprise,
    entete: 'Nouveaux supports téléchargés depuis MyGES (chemins relatifs à « Cours - ESGI ») :',
    consignes: ['Intègre-les dans les notes Obsidian et dans le site (cours, quiz, exercices). Ne refais pas ce qui existe déjà.'],
  });
}

export function creerSynchro({ vault, fichierEnv, fichierSuivi, fichierMatieres, fichierAttente, dossierProjet, claude, adresseSite, verrou, horloge }) {
  async function recolter({ signal, etat, maintenant, ajouterEnAttente }) {
    const identifiants = identifiantsMyges(await lireEnv(fichierEnv));
    if (!identifiants) throw new ErreurMyges('identifiants_manquants', 'Identifiants MyGES absents du fichier .env.');
    const session = await connecterSite(identifiants, { adresseSite, signal });
    if (signal.aborted) return;
    etat.etape = 'liste';
    const supports = await listerSupports(session, { adresseSite, signal });
    const suivi = await lireJson(fichierSuivi, {});
    const correspondance = await lireJson(fichierMatieres, {});
    const tri = trierSupports({ supports, suivi, correspondance, contenuDossiers: await lireContenuDossiers(vault) });
    for (const { support, chemin } of tri.dejaPresents) {
      suivi[support.id] = { chemin, matiere: support.matiere, nom: support.nom, le: maintenant() };
    }
    if (tri.dejaPresents.length) await ecrireJson(fichierSuivi, suivi);
    etat.total = tri.aTelecharger.length;
    etat.dejaPresents = tri.dejaPresents.length;
    if (!tri.aTelecharger.length || signal.aborted) return;
    etat.etape = 'telechargement';
    await ajouterMatieres(fichierMatieres, tri.matieresNouvelles);
    etat.matieresCreees = tri.matieresNouvelles.map(({ dossier }) => dossier);
    for (const { support, dossier } of tri.aTelecharger) {
      if (signal.aborted) return;
      try {
        const nom = await telecharger(session, support, path.join(vault, dossier, 'Sources'), { signal });
        const chemin = `${dossier}/Sources/${nom}`;
        suivi[support.id] = { chemin, matiere: support.matiere, nom: support.nom, le: maintenant() };
        await ecrireJson(fichierSuivi, suivi);
        await ajouterEnAttente(chemin);
        etat.telecharges.push(chemin);
      } catch (erreur) {
        if (signal.aborted) return;
        etat.rates.push({ nom: `${dossier} / ${support.nom}`, raison: erreur.message });
      }
      etat.avance += 1;
    }
  }

  return creerSynchroSource({ nom: 'MyGES', vault, fichierAttente, dossierProjet, claude, recolter, prompt: promptClaude, verrou, horloge });
}
