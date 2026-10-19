import { execFile } from 'node:child_process';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const DELAI_EXECUTION = 10_000;
const TAILLE_MAX_SORTIE = 2 * 1024 * 1024;
const NB_ATELIERS = 4;

export function normaliserSortie(texte) {
  return texte
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((ligne) => ligne.trimEnd())
    .join('\n')
    .trim();
}

export function analyserBilan(sortie) {
  const resultat = /^RESULTAT (\d+) (\d+)\s*$/m.exec(sortie);
  if (!resultat) return null;
  return { reussis: Number(resultat[1]), echoues: Number(resultat[2]) };
}

export function retirerBilan(sortie) {
  return sortie.replace(/^RESULTAT \d+ \d+\s*$/m, '').trimEnd();
}

export function creerReserve(dossiers) {
  const libres = [...dossiers];
  const enAttente = [];

  function prendre() {
    if (libres.length > 0) return Promise.resolve(libres.shift());
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

export function lancer(commande, args, { delai, dossier, entree = '', env = {} } = {}) {
  return new Promise((resoudre) => {
    const processus = execFile(
      commande,
      args,
      {
        cwd: dossier,
        timeout: delai,
        maxBuffer: TAILLE_MAX_SORTIE,
        windowsHide: true,
        env: { ...process.env, ...env },
      },
      (erreur, stdout, stderr) => {
        resoudre({
          code: erreur ? (typeof erreur.code === 'number' ? erreur.code : -1) : 0,
          signal: erreur?.signal ?? null,
          introuvable: erreur?.code === 'ENOENT',
          delaiDepasse: Boolean(erreur?.killed) && erreur?.code !== 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER',
          sortieTropLongue: erreur?.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER',
          stdout,
          stderr,
        });
      },
    );
    processus.stdin?.on('error', () => {});
    processus.stdin?.end(entree);
  });
}

export function problemeExecution(execution) {
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

export function creerVerificateurs(executerProgramme, verifierAvecTests) {
  async function verifierSortie(code, sortieAttendue, entree = '') {
    const resultat = await executerProgramme(code, entree);
    if (resultat.statut !== 'execute') {
      return resultat.statut === 'erreur_execution' ? { ...resultat, statut: 'echec' } : resultat;
    }
    const identique = normaliserSortie(resultat.sortie) === normaliserSortie(sortieAttendue);
    return { ...resultat, statut: identique ? 'reussi' : 'echec', attendu: sortieAttendue };
  }

  function verifierExercice(exercice, code) {
    return exercice.type === 'sortie'
      ? verifierSortie(code, exercice.sortieAttendue ?? '', exercice.entree ?? '')
      : verifierAvecTests(code, exercice.tests ?? '');
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
