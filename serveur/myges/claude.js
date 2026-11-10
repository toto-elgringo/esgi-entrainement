import { execFile, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ErreurMyges } from './erreurs.js';

export const DELAI_CLAUDE = 2 * 60 * 60 * 1000;

function tuer(enfant) {
  if (enfant.exitCode !== null || enfant.signalCode !== null) return;
  if (process.platform === 'win32') execFile('taskkill', ['/pid', String(enfant.pid), '/T', '/F'], { windowsHide: true }, () => {});
  else enfant.kill();
}

function lireMessage(ligne, resultat, surLigne) {
  let message;
  try {
    message = JSON.parse(ligne);
  } catch {
    return;
  }
  if (message.type === 'assistant') {
    for (const bloc of message.message?.content ?? []) {
      if (bloc.type === 'text' && bloc.text.trim()) surLigne(bloc.text.trim());
    }
  }
  if (message.type === 'result') {
    resultat.bilan = message.result ?? null;
    resultat.erreur = message.is_error ? (message.result ?? 'Claude a échoué.') : null;
  }
}

export function lancerClaude({ commande, args, dossier, delai = DELAI_CLAUDE, surLigne = () => {}, journal = null }) {
  const enfant = spawn(commande, args, { cwd: dossier, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let flux = null;
  if (journal) {
    fs.mkdirSync(path.dirname(journal), { recursive: true });
    flux = fs.createWriteStream(journal);
  }
  const resultat = { code: null, bilan: null, erreur: null };
  let reste = '';
  enfant.stdout.setEncoding('utf8');
  enfant.stdout.on('data', (morceau) => {
    flux?.write(morceau);
    const lignes = (reste + morceau).split(/\r?\n/);
    reste = lignes.pop();
    for (const ligne of lignes) lireMessage(ligne, resultat, surLigne);
  });
  enfant.stderr.on('data', (morceau) => flux?.write(morceau));
  const minuteur = setTimeout(() => tuer(enfant), delai);
  const fin = new Promise((resoudre, rejeter) => {
    enfant.on('error', (erreur) => {
      clearTimeout(minuteur);
      flux?.end();
      if (erreur.code === 'ENOENT') rejeter(new ErreurMyges('claude_introuvable', 'La commande claude est introuvable.'));
      else rejeter(erreur);
    });
    enfant.on('close', (code) => {
      clearTimeout(minuteur);
      if (reste) lireMessage(reste, resultat, surLigne);
      flux?.end();
      resultat.code = code;
      resoudre(resultat);
    });
  });
  return { fin, arreter: () => tuer(enfant) };
}
