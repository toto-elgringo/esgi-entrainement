import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { lancerClaude, MARQUE_FIN } from './myges/claude.js';
import { ErreurMyges } from './myges/erreurs.js';
import { ecrireJson, lireJson } from './myges/matieres.js';

export const ETAPES_ACTIVES = ['connexion', 'liste', 'telechargement', 'claude'];
export const AUCUN_NOUVEAU_COURS = 'Aucun nouveau cours';
export const TENTATIVES_AUTOMATIQUES = 3;
const LIGNES_GARDEES = 30;

function etatInitial(enAttente = []) {
  return {
    etape: 'repos',
    enAttente,
    reprise: false,
    total: 0,
    avance: 0,
    dejaPresents: 0,
    telecharges: [],
    rates: [],
    matieresCreees: [],
    notes: [],
    lignes: [],
    bilan: null,
    erreur: null,
    debut: null,
    fin: null,
  };
}

export function creerVerrou() {
  let file = Promise.resolve();
  let enCours = 0;
  return {
    occupe: () => enCours > 0,
    async executer(tache) {
      const precedente = file;
      let liberer;
      file = new Promise((resoudre) => { liberer = resoudre; });
      enCours += 1;
      try {
        await precedente;
        return await tache();
      } finally {
        enCours -= 1;
        liberer();
      }
    },
  };
}

export function promptClaude(fichiers, { reprise = false, entete, consignes = [] }) {
  return [
    '/obsidian -esgi',
    '',
    entete,
    ...fichiers.map((chemin) => `- ${chemin}`),
    '',
    ...consignes,
    ...(reprise
      ? ['', 'Reprise : une intégration précédente de ces fichiers a été coupée (ordinateur éteint, par exemple). Une partie du travail est peut-être déjà faite, parfois à moitié : regarde ce qui existe (notes, chapitres, quiz, exercices, fichiers modifiés non commités), garde ce qui est bon, corrige ce qui est coupé et termine le reste.']
      : []),
    '',
    'Si tu lances des sous-agents, attends qu’ils aient tous fini avant d’écrire ta réponse finale.',
    `Quand tout est fini et vérifié (verifier-contenu et tests sans erreur), termine ta réponse finale par la ligne exacte « ${MARQUE_FIN} ». Ne l’écris jamais s’il reste quelque chose à faire.`,
  ].join('\n');
}

export function creerSynchroSource({ nom, vault, fichierAttente, dossierProjet, claude, recolter, prompt, verrou = creerVerrou(), horloge = () => new Date() }) {
  let etat = etatInitial();
  let controleur = null;
  let claudeEnCours = null;
  let attente = null;

  const maintenant = () => horloge().toISOString();
  const dossierJournal = path.join(os.tmpdir(), `esgi-entrainement-${nom.toLowerCase()}`);

  function noter(ligne) {
    etat.lignes.push(ligne);
    etat.lignes = etat.lignes.slice(-LIGNES_GARDEES);
  }

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

  async function ajouterEnAttente(chemin) {
    await chargerAttente();
    await enregistrerAttente({ fichiers: [...new Set([...(attente?.fichiers ?? []), chemin])] });
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

  async function lancerIntegration(signal) {
    const fichiers = attente.fichiers;
    etat.reprise = attente.tentatives > 0;
    await enregistrerAttente({ tentatives: attente.tentatives + 1, arretee: false });
    if (signal.aborted) return null;
    claudeEnCours = lancerClaude({
      commande: claude.commande,
      args: [...(claude.args ?? []), '-p', prompt(fichiers, { reprise: etat.reprise }), '--add-dir', path.dirname(vault), '--permission-mode', 'bypassPermissions', '--output-format', 'stream-json', '--verbose'],
      dossier: dossierProjet,
      journal: path.join(dossierJournal, `claude-${maintenant().replace(/[:.]/g, '-')}.log`),
      surLigne: noter,
    });
    const resultat = await claudeEnCours.fin;
    claudeEnCours = null;
    return resultat;
  }

  async function integrer(signal) {
    if (!(await chargerAttente())) return terminer(signal, AUCUN_NOUVEAU_COURS);
    etat.etape = 'claude';
    if (verrou.occupe()) noter('En attente : Claude termine d’abord l’intégration d’une autre synchro.');
    const resultat = await verrou.executer(() => (signal.aborted ? null : lancerIntegration(signal)));
    if (signal.aborted || !resultat) return;
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
    await recolter({ signal, etat, maintenant, ajouterEnAttente, noter });
    if (signal.aborted) return;
    if (!etat.telecharges.length && etat.rates.length && !(await chargerAttente())) return terminer(signal, 'Aucun cours n’a pu être téléchargé.');
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
