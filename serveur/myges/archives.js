import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ErreurMyges } from './erreurs.js';

const TAR = process.platform === 'win32' ? path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe') : 'tar';

function lancerTar(args) {
  return new Promise((resoudre, rejeter) => {
    execFile(TAR, args, { maxBuffer: 16 * 1024 * 1024, windowsHide: true }, (erreur, sortie, erreurs) => {
      if (erreur) rejeter(new ErreurMyges('archive_refusee', `Archive illisible : ${(erreurs || erreur.message).trim()}`));
      else resoudre(sortie);
    });
  });
}

export function estArchive(nom, donnees) {
  return /\.zip$/i.test(nom) || (donnees.length >= 4 && donnees.readUInt32LE(0) === 0x04034b50);
}

function entreeDangereuse(entree) {
  const morceaux = entree.split(/[\\/]/);
  return path.isAbsolute(entree) || /^[a-z]:/i.test(entree) || entree.startsWith('/') || entree.startsWith('\\') || morceaux.includes('..');
}

export async function extraireZip(donnees, dossierCible) {
  const atelier = await fs.mkdtemp(path.join(os.tmpdir(), 'esgi-entrainement-myges-'));
  try {
    const archive = path.join(atelier, 'archive.zip');
    await fs.writeFile(archive, donnees);
    const entrees = (await lancerTar(['-tf', archive])).split(/\r?\n/).filter(Boolean);
    const dangereuse = entrees.find(entreeDangereuse);
    if (dangereuse) throw new ErreurMyges('archive_refusee', `Archive refusée : elle veut écrire hors de son dossier (${dangereuse}).`);
    await fs.mkdir(dossierCible, { recursive: true });
    await lancerTar(['-xf', archive, '-C', dossierCible]);
  } finally {
    await fs.rm(atelier, { recursive: true, force: true });
  }
}
