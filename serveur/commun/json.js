import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const ecritures = new Map();

export async function lireJson(chemin, defaut) {
  try {
    return JSON.parse(await fs.readFile(chemin, 'utf8'));
  } catch (erreur) {
    if (erreur.code === 'ENOENT') return defaut;
    throw erreur;
  }
}

async function ecrireMaintenant(chemin, valeur) {
  const temporaire = path.join(path.dirname(chemin), `.${path.basename(chemin)}.${randomUUID()}.tmp`);
  try {
    await fs.writeFile(temporaire, `${JSON.stringify(valeur, null, 2)}\n`, 'utf8');
    await fs.rename(temporaire, chemin);
  } catch (erreur) {
    await fs.rm(temporaire, { force: true });
    throw erreur;
  }
}

export function ecrireJson(chemin, valeur) {
  const cle = path.resolve(chemin);
  const contenu = structuredClone(valeur);
  const precedente = ecritures.get(cle) ?? Promise.resolve();
  const suivante = precedente.catch(() => {}).then(() => ecrireMaintenant(cle, contenu));
  ecritures.set(cle, suivante);
  suivante.catch(() => {}).finally(() => {
    if (ecritures.get(cle) === suivante) ecritures.delete(cle);
  });
  return suivante;
}
