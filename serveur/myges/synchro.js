import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { lancerClaude } from './claude.js';
import { connecterSite } from './connexion.js';
import { identifiantsMyges, lireEnv } from './env.js';
import { ErreurMyges } from './erreurs.js';
import { ajouterMatieres, ecrireJson, lireJson } from './matieres.js';
import { listerSupports, telecharger } from './source.js';
import { trierSupports } from './tri.js';

const ETAPES_ACTIVES = ['connexion', 'liste', 'telechargement', 'claude'];
const LIGNES_GARDEES = 30;
export const AUCUN_NOUVEAU_COURS = 'Aucun nouveau cours';

function etatInitial() {
  return {
    etape: 'repos',
    total: 0,
    dejaPresents: 0,
    telecharges: [],
    rates: [],
    matieresCreees: [],
    lignes: [],
    bilan: null,
    erreur: null,
    debut: null,
    fin: null,
  };
}

async function lireContenuDossiers(vault) {
  const contenu = {};
  const dossiers = await fs.readdir(vault, { withFileTypes: true }).catch(() => []);
  for (const dossier of dossiers.filter((entree) => entree.isDirectory())) {
    contenu[dossier.name] = await fs.readdir(path.join(vault, dossier.name, 'Sources')).catch(() => []);
  }
  return contenu;
}

export function promptClaude(telecharges) {
  return [
    '/obsidian -esgi',
    '',
    'Nouveaux supports téléchargés depuis MyGES (chemins relatifs à « Cours - ESGI ») :',
    ...telecharges.map((chemin) => `- ${chemin}`),
    '',
    'Intègre-les dans les notes Obsidian et dans le site (cours, quiz, exercices). Ne refais pas ce qui existe déjà.',
  ].join('\n');
}

export function creerSynchro({ vault, fichierEnv, fichierSuivi, fichierMatieres, dossierProjet, claude, adresseSite, horloge = () => new Date() }) {
  let etat = etatInitial();
  let controleur = null;
  let claudeEnCours = null;

  const maintenant = () => horloge().toISOString();

  function terminer(signal, bilan) {
    if (signal.aborted) return;
    etat.etape = 'terminee';
    etat.bilan = bilan;
    etat.fin = maintenant();
  }

  async function deroulement(signal) {
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
    if (!tri.aTelecharger.length) return terminer(signal, AUCUN_NOUVEAU_COURS);
    if (signal.aborted) return;
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
        etat.telecharges.push(chemin);
      } catch (erreur) {
        if (signal.aborted) return;
        etat.rates.push({ nom: `${dossier} / ${support.nom}`, raison: erreur.message });
      }
    }
    if (!etat.telecharges.length) return terminer(signal, 'Aucun cours n’a pu être téléchargé.');
    etat.etape = 'claude';
    claudeEnCours = lancerClaude({
      commande: claude.commande,
      args: [...(claude.args ?? []), '-p', promptClaude(etat.telecharges), '--add-dir', path.dirname(vault), '--permission-mode', 'bypassPermissions', '--output-format', 'stream-json', '--verbose'],
      dossier: dossierProjet,
      journal: path.join(os.tmpdir(), 'esgi-entrainement-myges', `claude-${maintenant().replace(/[:.]/g, '-')}.log`),
      surLigne: (ligne) => {
        etat.lignes.push(ligne);
        etat.lignes = etat.lignes.slice(-LIGNES_GARDEES);
      },
    });
    const resultat = await claudeEnCours.fin;
    claudeEnCours = null;
    if (signal.aborted) return;
    if (resultat.erreur || resultat.code !== 0) {
      throw new ErreurMyges('claude_echec', resultat.erreur ?? `Claude s’est arrêté avec le code ${resultat.code}.`);
    }
    terminer(signal, resultat.bilan ?? 'Claude a terminé.');
  }

  function demarrer() {
    if (ETAPES_ACTIVES.includes(etat.etape)) return copie();
    etat = { ...etatInitial(), etape: 'connexion', debut: maintenant() };
    const signal = (controleur = new AbortController()).signal;
    deroulement(signal).catch((erreur) => {
      claudeEnCours = null;
      if (signal.aborted) return;
      etat.etape = 'erreur';
      etat.erreur = erreur instanceof ErreurMyges
        ? { code: erreur.code, message: erreur.message }
        : { code: 'inattendue', message: `Erreur inattendue : ${erreur.message}` };
      etat.fin = maintenant();
    });
    return copie();
  }

  function arreter() {
    if (!ETAPES_ACTIVES.includes(etat.etape)) return copie();
    controleur?.abort();
    claudeEnCours?.arreter();
    etat.etape = 'terminee';
    etat.bilan = 'Synchro arrêtée';
    etat.fin = maintenant();
    return copie();
  }

  function copie() {
    return structuredClone(etat);
  }

  return { demarrer, arreter, etat: copie };
}
