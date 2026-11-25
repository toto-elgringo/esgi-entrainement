import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

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

export function verifierEnfermement({ chemin = BWRAP } = {}) {
  if (modeEnfermement() !== 'bwrap') return;
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
