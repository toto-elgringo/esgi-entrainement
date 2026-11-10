import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { lancerClaude, MARQUE_FIN } from './claude.js';
import { connecterSite } from './connexion.js';
import { identifiantsMyges, lireEnv } from './env.js';
import { ErreurMyges } from './erreurs.js';
import { ajouterMatieres, ecrireJson, lireJson } from './matieres.js';
import { listerSupports, telecharger } from './source.js';
import { trierSupports } from './tri.js';

const ETAPES_ACTIVES = ['connexion', 'liste', 'telechargement', 'claude'];
const LIGNES_GARDEES = 30;
export const AUCUN_NOUVEAU_COURS = 'Aucun nouveau cours';
export const TENTATIVES_AUTOMATIQUES = 3;

function etatInitial(enAttente = []) {
  return {
    etape: 'repos',
    enAttente,
    reprise: false,
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

export function promptClaude(fichiers, { reprise = false } = {}) {
  return [
    '/obsidian -esgi',
    '',
    'Nouveaux supports téléchargés depuis MyGES (chemins relatifs à « Cours - ESGI ») :',
    ...fichiers.map((chemin) => `- ${chemin}`),
    '',
    'Intègre-les dans les notes Obsidian et dans le site (cours, quiz, exercices). Ne refais pas ce qui existe déjà.',
    ...(reprise
      ? ['', 'Reprise : une intégration précédente de ces fichiers a été coupée (ordinateur éteint, par exemple). Une partie du travail est peut-être déjà faite, parfois à moitié : regarde ce qui existe (notes, chapitres, quiz, exercices, fichiers modifiés non commités), garde ce qui est bon, corrige ce qui est coupé et termine le reste.']
      : []),
    '',
    'Si tu lances des sous-agents, attends qu’ils aient tous fini avant d’écrire ta réponse finale.',
    `Quand tout est fini et vérifié (verifier-contenu et tests sans erreur), termine ta réponse finale par la ligne exacte « ${MARQUE_FIN} ». Ne l’écris jamais s’il reste quelque chose à faire.`,
  ].join('\n');
}

export function creerSynchro({ vault, fichierEnv, fichierSuivi, fichierMatieres, fichierAttente, dossierProjet, claude, adresseSite, horloge = () => new Date() }) {
  let etat = etatInitial();
  let controleur = null;
  let claudeEnCours = null;
  let attente = null;

  const maintenant = () => horloge().toISOString();

  async function chargerAttente() {
    const lue = await lireJson(fichierAttente, null);
    attente = lue?.fichiers?.length ? lue : null;
    return attente;
  }

  async function enregistrerAttente(modifications) {
    attente = { fichiers: [], depuis: maintenant(), tentatives: 0, arretee: false, ...attente, ...modifications };
    etat.enAttente = attente.fichiers;
    await ecrireJson(fichierAttente, attente);
  }

  async function viderAttente() {
    attente = null;
    etat.enAttente = [];
    await fs.rm(fichierAttente, { force: true });
  }

  function terminer(signal, bilan) {
    if (signal.aborted) return;
    etat.etape = 'terminee';
    etat.bilan = bilan;
    etat.fin = maintenant();
  }

  async function integrer(signal) {
    if (!(await chargerAttente())) return terminer(signal, AUCUN_NOUVEAU_COURS);
    const fichiers = attente.fichiers;
    etat.etape = 'claude';
    etat.reprise = attente.tentatives > 0;
    await enregistrerAttente({ tentatives: attente.tentatives + 1, arretee: false });
    if (signal.aborted) return;
    claudeEnCours = lancerClaude({
      commande: claude.commande,
      args: [...(claude.args ?? []), '-p', promptClaude(fichiers, { reprise: etat.reprise }), '--add-dir', path.dirname(vault), '--permission-mode', 'bypassPermissions', '--output-format', 'stream-json', '--verbose'],
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
    if (!resultat.complet) {
      throw new ErreurMyges('claude_incomplet', resultat.bilan ?? 'Claude s’est arrêté avant d’avoir tout intégré.');
    }
    await viderAttente();
    terminer(signal, resultat.bilan ?? 'Claude a terminé.');
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
    if (!tri.aTelecharger.length) return integrer(signal);
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
        await chargerAttente();
        await enregistrerAttente({ fichiers: [...new Set([...(attente?.fichiers ?? []), chemin])] });
        etat.telecharges.push(chemin);
      } catch (erreur) {
        if (signal.aborted) return;
        etat.rates.push({ nom: `${dossier} / ${support.nom}`, raison: erreur.message });
      }
    }
    if (!etat.telecharges.length && !(await chargerAttente())) return terminer(signal, 'Aucun cours n’a pu être téléchargé.');
    await integrer(signal);
  }

  function lancer(etape, tache) {
    if (ETAPES_ACTIVES.includes(etat.etape)) return copie();
    etat = { ...etatInitial(attente?.fichiers ?? []), etape, debut: maintenant() };
    const signal = (controleur = new AbortController()).signal;
    tache(signal).catch((erreur) => {
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

  function demarrer() {
    return lancer('connexion', deroulement);
  }

  function reprendre() {
    return lancer('claude', integrer);
  }

  async function reprendreAuDemarrage() {
    await chargerAttente();
    etat.enAttente = attente?.fichiers ?? [];
    if (!attente || attente.arretee || attente.tentatives >= TENTATIVES_AUTOMATIQUES) return copie();
    return reprendre();
  }

  function arreter() {
    if (!ETAPES_ACTIVES.includes(etat.etape)) return copie();
    controleur?.abort();
    claudeEnCours?.arreter();
    claudeEnCours = null;
    if (attente) enregistrerAttente({ arretee: true }).catch(() => {});
    etat.etape = 'terminee';
    etat.bilan = 'Synchro arrêtée';
    etat.fin = maintenant();
    return copie();
  }

  function couper() {
    controleur?.abort();
    claudeEnCours?.couper();
    claudeEnCours = null;
  }

  function copie() {
    return structuredClone(etat);
  }

  return { demarrer, reprendre, reprendreAuDemarrage, arreter, couper, etat: copie };
}
