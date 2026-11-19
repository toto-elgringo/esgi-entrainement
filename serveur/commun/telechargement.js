import { createHash, randomUUID } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { ErreurSynchro } from './erreurs.js';
import { delaiDepasse, erreurDelai } from './session.js';

export const TAILLE_MAX_TELECHARGEMENT = 500 * 1024 * 1024;
export const DELAI_TELECHARGEMENT = 30 * 60 * 1000;
const LONGUEUR_DEBUT = 8;

function tropGros(tailleMax) {
  return new ErreurSynchro('fichier_trop_gros', `Fichier refusé : il dépasse ${Math.round(tailleMax / 1024 / 1024)} Mo.`);
}

export function cheminPartiel(dossier) {
  return path.join(dossier, `.${randomUUID()}.partiel`);
}

export async function enregistrerFlux(reponse, chemin, { nomSite, tailleMax = TAILLE_MAX_TELECHARGEMENT } = {}) {
  if (Number(reponse.headers.get('content-length')) > tailleMax) {
    await reponse.body?.cancel();
    throw tropGros(tailleMax);
  }
  const empreinte = createHash('sha1');
  let taille = 0;
  let debut = Buffer.alloc(0);
  const compteur = new Transform({
    transform(morceau, codage, suite) {
      taille += morceau.length;
      if (taille > tailleMax) return suite(tropGros(tailleMax));
      if (debut.length < LONGUEUR_DEBUT) debut = Buffer.concat([debut, morceau]).subarray(0, LONGUEUR_DEBUT);
      empreinte.update(morceau);
      return suite(null, morceau);
    },
  });
  try {
    await pipeline(reponse.body ? Readable.fromWeb(reponse.body) : Readable.from([]), compteur, createWriteStream(chemin));
  } catch (erreur) {
    await fs.rm(chemin, { force: true });
    if (delaiDepasse(erreur)) throw erreurDelai(nomSite);
    throw erreur;
  }
  return { taille, debut, empreinte: empreinte.digest('hex') };
}
