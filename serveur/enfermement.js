import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { lireAdresses } from './reglages.js';

export const BWRAP = '/usr/bin/bwrap';

const LIENS_SYSTEME = [
  ['usr/bin', '/bin'],
  ['usr/sbin', '/sbin'],
  ['usr/lib', '/lib'],
  ['usr/lib64', '/lib64'],
];

export function modeEnfermement() {
  return process.env.ESGI_ENFERMEMENT === 'bwrap' ? 'bwrap' : null;
}

export function verifierEnfermement({ chemin = BWRAP, plateforme = process.platform, adresses = lireAdresses(process.env.ESGI_ADRESSES) } = {}) {
  const valeur = process.env.ESGI_ENFERMEMENT;
  if (valeur && valeur !== 'bwrap') throw new Error(`ESGI_ENFERMEMENT inconnu : « ${valeur} » (seule valeur possible : bwrap)`);
  if (modeEnfermement() !== 'bwrap') {
    if (plateforme === 'linux' && adresses.length > 0) {
      throw new Error('ESGI_ADRESSES ouvre le serveur au réseau : ESGI_ENFERMEMENT=bwrap obligatoire sous Linux');
    }
    return;
  }
  try {
    fs.accessSync(chemin, fs.constants.X_OK);
  } catch {
    throw new Error('bwrap introuvable : exécution refusée');
  }
}

export function cheminsOutils(maison = os.homedir()) {
  return [path.posix.join(maison, '.rustup'), path.posix.join(maison, '.cargo', 'bin')].filter((chemin) => fs.existsSync(chemin));
}

export function argumentsEnfermement({ commande, args, dossier, env = {}, maison = os.homedir(), lectureSeule = cheminsOutils(maison) }) {
  const variables = {
    PATH: `${path.posix.join(maison, '.cargo', 'bin')}:/usr/local/bin:/usr/bin:/bin`,
    HOME: dossier,
    LANG: 'C.UTF-8',
    RUSTUP_HOME: path.posix.join(maison, '.rustup'),
    CARGO_HOME: path.posix.join(dossier, '.cargo'),
    ...env,
  };
  return {
    commande: BWRAP,
    args: [
      '--ro-bind', '/usr', '/usr',
      ...LIENS_SYSTEME.flatMap(([cible, lien]) => ['--symlink', cible, lien]),
      '--ro-bind', '/etc', '/etc',
      '--proc', '/proc',
      '--dev', '/dev',
      '--tmpfs', '/tmp',
      '--tmpfs', '/home',
      ...lectureSeule.flatMap((chemin) => ['--ro-bind', chemin, chemin]),
      '--bind', dossier, dossier,
      '--chdir', dossier,
      '--unshare-all',
      '--die-with-parent',
      '--new-session',
      '--clearenv',
      ...Object.entries(variables).flatMap(([nom, valeur]) => ['--setenv', nom, String(valeur)]),
      '--',
      commande,
      ...args,
    ],
  };
}

const SIGNAUX = Object.fromEntries(Object.entries(os.constants.signals).map(([nom, numero]) => [numero, nom]));

export function corrigerErreurEnfermee(erreur, stderr = '') {
  if (!erreur || typeof erreur.code !== 'number') return erreur;
  const echec = /^bwrap: execvp [^\n]*: (No such file or directory|Permission denied)$/m.exec(stderr);
  if (echec) return { ...erreur, code: echec[1] === 'Permission denied' ? 'EACCES' : 'ENOENT', message: echec[0] };
  const signal = erreur.code > 128 ? SIGNAUX[erreur.code - 128] : undefined;
  if (signal && !erreur.signal) return { ...erreur, signal };
  return erreur;
}
