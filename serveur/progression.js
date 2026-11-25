import fs from 'node:fs/promises';
import path from 'node:path';
import { appliquerChangement, changementValide, progressionVide } from '../js/fusion-progression.js';
import { lireJson, ecrireJson } from './commun/json.js';
import { ErreurHttp } from './serveur.js';

const MAX_CHANGEMENTS = 2000;

function etatDepuis(contenu) {
  const progression = progressionVide();
  for (const partie of Object.keys(progression)) {
    if (contenu?.progression?.[partie] && typeof contenu.progression[partie] === 'object') progression[partie] = contenu.progression[partie];
  }
  return {
    existe: Boolean(contenu),
    progression,
    dates: contenu?.dates ?? {},
    supprimes: contenu?.supprimes ?? {},
    modifieLe: contenu?.modifieLe ?? null,
  };
}

export function creerProgression(chemin) {
  let file = Promise.resolve();

  const lire = async () => etatDepuis(await lireJson(chemin, null));

  async function appliquerMaintenant(changements) {
    const etat = await lire();
    const retenus = [];
    for (const changement of changements) {
      const { retenu, valeur } = appliquerChangement(etat, changement);
      if (retenu) retenus.push({ partie: changement.partie, cle: changement.cle, valeur });
    }
    await fs.mkdir(path.dirname(chemin), { recursive: true });
    await ecrireJson(chemin, {
      format: 'esgi-entrainement',
      version: 1,
      modifieLe: new Date().toISOString(),
      progression: etat.progression,
      dates: etat.dates,
      supprimes: etat.supprimes,
    });
    return { retenus };
  }

  function appliquer(changements) {
    if (!Array.isArray(changements) || changements.length < 1 || changements.length > MAX_CHANGEMENTS) {
      return Promise.reject(new ErreurHttp(400, `Il faut entre 1 et ${MAX_CHANGEMENTS} changements`));
    }
    if (!changements.every(changementValide)) return Promise.reject(new ErreurHttp(400, 'Changement de progression invalide'));
    const resultat = file.then(() => appliquerMaintenant(changements));
    file = resultat.catch(() => {});
    return resultat;
  }

  return { lire, appliquer };
}
