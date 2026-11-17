import { execFile } from 'node:child_process';
import path from 'node:path';

const CANDIDATS = [
  { commande: 'yt-dlp', args: [] },
  { commande: 'python', args: ['-m', 'yt_dlp'] },
  { commande: 'py', args: ['-3', '-m', 'yt_dlp'] },
  { commande: 'python3', args: ['-m', 'yt_dlp'] },
];
const DELAI_VIDEO = 30 * 60 * 1000;
const FORMAT_SIMPLE = 'b[ext=mp4][height<=720]/b[height<=720]/b';
const FORMAT_ASSEMBLE = 'bv*[ext=mp4][height<=720]+ba[ext=m4a]/b[ext=mp4][height<=720]/b';

function lancer(commande, args, { delai = 15_000, signal } = {}) {
  return new Promise((resoudre, rejeter) => {
    execFile(commande, args, { timeout: delai, windowsHide: true, maxBuffer: 8 * 1024 * 1024, signal }, (erreur, sortie, erreurs) => {
      if (erreur) rejeter(Object.assign(erreur, { erreurs }));
      else resoudre(sortie);
    });
  });
}

async function existe(commande, args) {
  try {
    await lancer(commande, args);
    return true;
  } catch {
    return false;
  }
}

export async function trouverYtDlp() {
  for (const candidat of CANDIDATS) {
    if (await existe(candidat.commande, [...candidat.args, '--version'])) {
      return { ...candidat, ffmpeg: await existe('ffmpeg', ['-version']) };
    }
  }
  return null;
}

function derniereLigne(texte) {
  return texte.split(/\r?\n/).map((ligne) => ligne.trim()).filter(Boolean).at(-1) ?? '';
}

export async function telechargerVideo(outil, adresse, dossier, base, { signal } = {}) {
  const modele = path.join(dossier, `${base}.%(ext)s`);
  try {
    const sortie = await lancer(outil.commande, [
      ...outil.args,
      '--js-runtimes', `node:${process.execPath}`,
      '--no-playlist',
      '--no-progress',
      '--no-warnings',
      '-f', outil.ffmpeg ? FORMAT_ASSEMBLE : FORMAT_SIMPLE,
      ...(outil.ffmpeg ? ['--merge-output-format', 'mp4'] : []),
      '-o', modele,
      '--print', 'after_move:filepath',
      adresse,
    ], { delai: DELAI_VIDEO, signal });
    return path.basename(derniereLigne(sortie));
  } catch (erreur) {
    const detail = derniereLigne(erreur.erreurs ?? '') || erreur.message;
    throw new Error(`yt-dlp n’a pas pu télécharger la vidéo : ${detail}`);
  }
}
