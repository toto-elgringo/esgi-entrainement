import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { argumentsEnfermement, corrigerErreurEnfermee, modeEnfermement } from './enfermement.js';

export const DELAI_EXECUTION = 10_000;
export const TAILLE_MAX_FLUX = 20_000;
export const ATTENTE_MAX = 20;
export const VARIABLE_MARQUEUR = 'ESGI_MARQUEUR';
const TAILLE_MAX_SORTIE = 2 * 1024 * 1024;
const NB_ATELIERS = 4;
const MENTION_COUPEE = '… (sortie coupée)';
const MESSAGE_BLOQUE = 'Windows a bloqué le lancement du programme (Smart App Control ?). Réessaie.';

export class TropDeDemandes extends Error {
  constructor() {
    super('Trop de demandes en attente : réessaie dans un instant.');
  }
}

export function normaliserSortie(texte) {
  return texte
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((ligne) => ligne.trimEnd())
    .join('\n')
    .trim();
}

export function creerMarqueur() {
  return randomUUID();
}

function echapper(texte) {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function motifBilan(marqueur) {
  return new RegExp(`^RESULTAT ${echapper(marqueur)} (\\d+) (\\d+)\\s*$`, 'm');
}

export function analyserBilan(sortie, marqueur) {
  const resultat = motifBilan(marqueur).exec(sortie);
  if (!resultat) return null;
  return { reussis: Number(resultat[1]), echoues: Number(resultat[2]) };
}

export function retirerBilan(sortie, marqueur) {
  return sortie.replace(motifBilan(marqueur), '').trimEnd();
}

export function extraireTests(sortie, marqueur) {
  const debut = `@TEST ${marqueur} `;
  const tests = [];
  const lignes = [];
  for (const ligne of sortie.split('\n')) {
    if (ligne.startsWith(debut)) {
      try {
        tests.push(JSON.parse(ligne.slice(debut.length)));
        continue;
      } catch {}
    }
    lignes.push(ligne);
  }
  return { sortie: lignes.join('\n'), tests };
}

export function couperTexte(texte, limite = TAILLE_MAX_FLUX) {
  if (typeof texte !== 'string' || texte.length <= limite) return texte;
  return `${texte.slice(0, limite)}\n${MENTION_COUPEE}`;
}

export function couperResultat(resultat) {
  if (!resultat || typeof resultat !== 'object') return resultat;
  const coupe = { ...resultat };
  for (const champ of ['sortie', 'avertissements', 'attendu']) {
    if (champ in coupe) coupe[champ] = couperTexte(coupe[champ]);
  }
  if (Array.isArray(coupe.tests)) {
    coupe.tests = coupe.tests.map((test) => Object.fromEntries(Object.entries(test).map(([cle, valeur]) => [cle, couperTexte(valeur)])));
  }
  return coupe;
}

export function creerReserve(dossiers, { attenteMax = ATTENTE_MAX } = {}) {
  const libres = [...dossiers];
  const enAttente = [];

  function prendre() {
    if (libres.length > 0) return Promise.resolve(libres.pop());
    if (enAttente.length >= attenteMax) return Promise.reject(new TropDeDemandes());
    return new Promise((resoudre) => enAttente.push(resoudre));
  }

  function rendre(dossier) {
    const suivant = enAttente.shift();
    if (suivant) suivant(dossier);
    else libres.push(dossier);
  }

  return async (action) => {
    const dossier = await prendre();
    try {
      return await action(dossier);
    } finally {
      rendre(dossier);
    }
  };
}

export function tuerArbre(processus) {
  if (!processus?.pid || processus.exitCode !== null || processus.signalCode !== null) return;
  if (process.platform !== 'win32') {
    processus.kill('SIGKILL');
    return;
  }
  execFile('taskkill', ['/pid', String(processus.pid), '/T', '/F'], { windowsHide: true }, () => {});
}

function resultatLancement(erreur, { arret = null, stdout = '', stderr = '' } = {}) {
  const codeErreur = erreur?.code;
  const introuvable = codeErreur === 'ENOENT';
  const sortieTropLongue = codeErreur === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER';
  const lancementBloque = typeof codeErreur === 'string' && !introuvable && !sortieTropLongue && arret === null;
  return {
    code: erreur ? (typeof codeErreur === 'number' ? codeErreur : -1) : 0,
    signal: erreur?.signal ?? null,
    introuvable,
    lancementBloque,
    erreur: introuvable || lancementBloque ? { code: codeErreur, message: erreur.message } : null,
    delaiDepasse: arret === 'delai',
    annule: arret === 'annule',
    sortieTropLongue,
    stdout: stdout ?? '',
    stderr: stderr ?? '',
  };
}

let dossierSondes = null;

function dossierSansAtelier() {
  dossierSondes ??= fsSync.mkdtempSync(path.join(os.tmpdir(), 'esgi-entrainement-sondes-'));
  return dossierSondes;
}

function preparerLancement(commande, args, dossier, env) {
  if (modeEnfermement() !== 'bwrap') return { commande, args, dossier, env: { ...process.env, ...env }, enferme: false };
  const travail = dossier ?? dossierSansAtelier();
  return { ...argumentsEnfermement({ commande, args, dossier: travail, env }), dossier: travail, env: {}, enferme: true };
}

export function lancer(commandeDemandee, argsDemandes, { delai, dossier: dossierDemande, entree = '', env: envDemande = {}, signal } = {}) {
  if (signal?.aborted) return Promise.resolve(resultatLancement(null, { arret: 'annule' }));
  const { commande, args, dossier, env, enferme } = preparerLancement(commandeDemandee, argsDemandes, dossierDemande, envDemande);
  return new Promise((resoudre) => {
    let arret = null;
    let minuteur = null;
    let processus;
    const annuler = () => arreter('annule');

    function arreter(raison) {
      arret ??= raison;
      tuerArbre(processus);
    }

    function terminer(erreur, stdout, stderr) {
      clearTimeout(minuteur);
      signal?.removeEventListener('abort', annuler);
      resoudre(resultatLancement(enferme ? corrigerErreurEnfermee(erreur, stderr) : erreur, { arret, stdout, stderr }));
    }

    try {
      processus = execFile(
        commande,
        args,
        { cwd: dossier, maxBuffer: TAILLE_MAX_SORTIE, windowsHide: true, env },
        terminer,
      );
    } catch (erreur) {
      terminer(erreur);
      return;
    }
    if (delai) minuteur = setTimeout(() => arreter('delai'), delai);
    signal?.addEventListener('abort', annuler, { once: true });
    processus.stdin?.on('error', () => {});
    processus.stdin?.end(entree);
  });
}

export function problemeLancement(execution) {
  if (execution.annule) return { statut: 'annule', sortie: 'Exécution annulée.' };
  if (execution.lancementBloque) {
    return { statut: 'lancement_bloque', sortie: `${MESSAGE_BLOQUE}\n${execution.erreur.code} : ${execution.erreur.message}` };
  }
  return null;
}

export function problemeCompilation(compilation, messageIntrouvable) {
  if (compilation.introuvable) return { statut: 'outil_introuvable', sortie: messageIntrouvable };
  const lancement = problemeLancement(compilation);
  if (lancement) return lancement;
  if (compilation.delaiDepasse) return { statut: 'delai_depasse', sortie: 'La compilation a pris trop de temps.' };
  if (compilation.code !== 0) return { statut: 'erreur_compilation', sortie: compilation.stderr };
  return null;
}

export function problemeExecution(execution) {
  const lancement = problemeLancement(execution);
  if (lancement) return lancement;
  if (execution.delaiDepasse) {
    return {
      statut: 'delai_depasse',
      sortie: `${execution.stdout}\nLe programme a dépassé ${DELAI_EXECUTION / 1000} secondes : boucle infinie ?`.trim(),
    };
  }
  if (execution.sortieTropLongue) {
    return { statut: 'erreur_execution', sortie: 'Le programme affiche beaucoup trop de texte : boucle infinie ?' };
  }
  return null;
}

export function creerVerificateurs(executerPourVerifier, verifierAvecTests) {
  async function verifierSortie(code, sortieAttendue, entree = '', options = {}) {
    const resultat = await executerPourVerifier(code, entree, options);
    if (resultat.statut !== 'execute') {
      return resultat.statut === 'erreur_execution' ? { ...resultat, statut: 'echec' } : resultat;
    }
    const identique = normaliserSortie(resultat.sortie) === normaliserSortie(sortieAttendue);
    return { ...resultat, statut: identique ? 'reussi' : 'echec', attendu: sortieAttendue };
  }

  function verifierExercice(exercice, code, options = {}) {
    return exercice.type === 'sortie'
      ? verifierSortie(code, exercice.sortieAttendue ?? '', exercice.entree ?? '', options)
      : verifierAvecTests(code, exercice.tests ?? '', options);
  }

  return { verifierSortie, verifierExercice };
}

export function creerAteliers(nom, preparer = async () => {}) {
  const racine = path.join(os.tmpdir(), `esgi-entrainement-${nom}`, String(process.pid));
  const prets = new Set();

  function nettoyer() {
    try {
      fsSync.rmSync(racine, { recursive: true, force: true, maxRetries: 3 });
    } catch {}
  }

  const reserve = creerReserve(Array.from({ length: NB_ATELIERS }, (_, index) => path.join(racine, `atelier-${index + 1}`)));

  return (action) =>
    reserve(async (dossier) => {
      if (!prets.has(dossier)) {
        if (prets.size === 0) process.once('exit', nettoyer);
        await fs.mkdir(dossier, { recursive: true });
        await preparer(dossier);
        prets.add(dossier);
      }
      return action(dossier);
    });
}
