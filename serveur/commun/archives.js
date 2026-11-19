import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ErreurSynchro } from './erreurs.js';

export const TAILLE_MAX_EXTRAITE = 500 * 1024 * 1024;
const TAR = process.platform === 'win32' ? path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
const LIGNE_DETAILLEE = /^(\S)\S*\s+\S+\s+\S+\s+\S+\s+(\d+)\s+\S+\s+\S+\s+\S+ (.*)$/;

function lancerTar(args) {
  return new Promise((resoudre, rejeter) => {
    execFile(TAR, args, { maxBuffer: 16 * 1024 * 1024, windowsHide: true }, (erreur, sortie, erreurs) => {
      if (erreur) rejeter(new ErreurSynchro('archive_refusee', `Archive illisible : ${(erreurs || erreur.message).trim()}`));
      else resoudre(sortie);
    });
  });
}

const lignes = (sortie) => sortie.split(/\r?\n/).filter(Boolean);

export function estArchive(nom, donnees) {
  return /\.zip$/i.test(nom) || (donnees.length >= 4 && donnees.readUInt32LE(0) === 0x04034b50);
}

function entreeDangereuse(entree) {
  const morceaux = entree.split(/[\\/]/);
  return path.isAbsolute(entree) || /^[a-z]:/i.test(entree) || entree.startsWith('/') || entree.startsWith('\\') || morceaux.includes('..');
}

function refuser(message) {
  throw new ErreurSynchro('archive_refusee', `Archive refusée : ${message}`);
}

export function verifierEntrees(noms, details, tailleMax = TAILLE_MAX_EXTRAITE) {
  if (noms.length !== details.length) refuser('son contenu ne se lit pas correctement.');
  const dangereuse = noms.find(entreeDangereuse);
  if (dangereuse) refuser(`elle veut écrire hors de son dossier (${dangereuse}).`);
  let total = 0;
  details.forEach((ligne, indice) => {
    const lue = LIGNE_DETAILLEE.exec(ligne);
    if (!lue) refuser(`entrée illisible (${noms[indice]}).`);
    const [, type, taille, reste] = lue;
    if (type === 'l' || type === 'h' || reste !== noms[indice]) refuser(`elle contient un lien (${noms[indice]}).`);
    if (type !== '-' && type !== 'd') refuser(`elle contient une entrée spéciale (${noms[indice]}).`);
    total += Number(taille);
  });
  if (total > tailleMax) refuser(`une fois extraite, elle ferait plus de ${Math.round(tailleMax / 1024 / 1024)} Mo.`);
}

export async function extraireZip(archive, dossierCible, { tailleMax = TAILLE_MAX_EXTRAITE } = {}) {
  const noms = lignes(await lancerTar(['-tf', archive]));
  const details = lignes(await lancerTar(['-tvf', archive]));
  verifierEntrees(noms, details, tailleMax);
  await fs.mkdir(dossierCible, { recursive: true });
  await lancerTar(['-xf', archive, '-C', dossierCible]);
}
