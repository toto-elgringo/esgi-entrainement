import { execFile, execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ErreurMyges } from './erreurs.js';

export const DELAI_CLAUDE = 4 * 60 * 60 * 1000;
export const MARQUE_FIN = 'SYNCHRO TERMINÉE';

function sousAgentsCoupes(stats) {
  return Object.values(stats?.killed ?? {}).reduce((total, nombre) => total + (Number(nombre) || 0), 0);
}

function tuer(enfant, { attendre = false } = {}) {
  if (enfant.exitCode !== null || enfant.signalCode !== null) return;
  if (process.platform !== 'win32') return enfant.kill();
  const args = ['/pid', String(enfant.pid), '/T', '/F'];
  if (!attendre) return execFile('taskkill', args, { windowsHide: true }, () => {});
  try {
    execFileSync('taskkill', args, { windowsHide: true, stdio: 'ignore' });
  } catch {}
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
    const texte = message.result ?? '';
    resultat.complet = !message.is_error && texte.includes(MARQUE_FIN) && !sousAgentsCoupes(message.subagent_stats);
    resultat.bilan = texte.replaceAll(MARQUE_FIN, '').trim() || null;
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
  const resultat = { code: null, bilan: null, erreur: null, complet: false };
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
  return { fin, arreter: () => tuer(enfant), couper: () => tuer(enfant, { attendre: true }) };
}
