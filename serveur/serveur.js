import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { LANGAGES } from '../js/domaines.js';
import { typeSupport } from '../js/supports.js';
import * as c from './c.js';
import { ContenuIntrouvable, lireExercice } from './contenu-code.js';
import { ErreurMyges } from './myges/erreurs.js';
import * as python from './python.js';
import * as rust from './rust.js';

const TAILLE_MAX_CORPS = 512 * 1024;
const EXECUTEURS = { rust, python, c };
const FICHIERS_PRIVES = new Set(['myges-suivi.json', 'synchro-obsidian.json']);
const STATUTS_MYGES = { deja_en_cours: 409 };
const TYPES_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.rs': 'text/plain; charset=utf-8',
  '.py': 'text/plain; charset=utf-8',
  '.c': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

export class ErreurHttp extends Error {
  constructor(statut, message) {
    super(message);
    this.statut = statut;
  }
}

function envoyerJson(reponse, statut, donnees) {
  reponse.writeHead(statut, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  reponse.end(JSON.stringify(donnees));
}

async function lireCorpsJson(requete) {
  const morceaux = [];
  let taille = 0;
  for await (const morceau of requete) {
    taille += morceau.length;
    if (taille > TAILLE_MAX_CORPS) throw new ErreurHttp(413, 'Requête trop volumineuse');
    morceaux.push(morceau);
  }
  try {
    return JSON.parse(Buffer.concat(morceaux).toString('utf8') || '{}');
  } catch {
    throw new ErreurHttp(400, 'JSON invalide');
  }
}

async function lireCode(requete) {
  const corps = await lireCorpsJson(requete);
  if (typeof corps.code !== 'string') throw new ErreurHttp(400, 'Le champ « code » est obligatoire');
  if (corps.entree !== undefined && typeof corps.entree !== 'string') throw new ErreurHttp(400, 'Le champ « entree » doit être un texte');
  return corps;
}

async function etatOutils() {
  const [outilsRust, outilsPython, outilsC] = await Promise.all([rust.outilsRust(), python.outilsPython(), c.outilsC()]);
  return { ...outilsRust, ...outilsPython, ...outilsC };
}

function cheminDansDossier(racine, chemin) {
  let relatif;
  try {
    relatif = decodeURIComponent(chemin).replace(/^\/+/, '');
  } catch {
    return null;
  }
  const base = path.resolve(racine);
  const fichier = path.resolve(base, relatif);
  return fichier.startsWith(base + path.sep) ? fichier : null;
}

async function envoyerFichier(fichier, reponse) {
  let donnees;
  try {
    donnees = await fs.readFile(fichier);
  } catch {
    return false;
  }
  reponse.writeHead(200, {
    'Content-Type': TYPES_MIME[path.extname(fichier).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  reponse.end(donnees);
  return true;
}

function estPrive(racine, fichier) {
  const morceaux = path.relative(path.resolve(racine), fichier).split(path.sep);
  return morceaux.some((morceau) => morceau.startsWith('.')) || FICHIERS_PRIVES.has(morceaux.at(-1).toLowerCase());
}

async function servirFichier(racine, chemin, reponse) {
  const fichier = cheminDansDossier(racine, chemin === '/' ? 'index.html' : chemin);
  if (!fichier || estPrive(racine, fichier) || !(await envoyerFichier(fichier, reponse))) throw new ErreurHttp(404, 'Fichier introuvable');
}

export function origineLocale(requete) {
  const port = requete.socket.localPort;
  const hotes = [`localhost:${port}`, `127.0.0.1:${port}`];
  if (!hotes.includes(requete.headers.host)) return false;
  const origine = requete.headers.origin;
  if (origine !== undefined && !hotes.some((hote) => origine === `http://${hote}`)) return false;
  if (requete.method === 'POST' && !(requete.headers['content-type'] ?? '').startsWith('application/json')) return false;
  return true;
}

async function actionMyges(synchro, requete, pathname) {
  if (!origineLocale(requete)) throw new ErreurHttp(403, 'Requête refusée');
  const actions = {
    'POST /api/myges/synchroniser': () => synchro.demarrer(),
    'POST /api/myges/arreter': () => synchro.arreter(),
    'GET /api/myges/etat': () => synchro.etat(),
  };
  const action = actions[`${requete.method} ${pathname}`];
  if (!action) throw new ErreurHttp(404, 'Route inconnue');
  if (!synchro) throw new ErreurHttp(503, 'La synchro MyGES n’est pas disponible');
  if (requete.method === 'POST') await lireCorpsJson(requete);
  try {
    return action();
  } catch (erreur) {
    if (erreur instanceof ErreurMyges) throw new ErreurHttp(STATUTS_MYGES[erreur.code] ?? 400, erreur.message);
    throw erreur;
  }
}

const PAGE_SUPPORT_ABSENT = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>Support introuvable</title>
<style>body{font-family:system-ui,sans-serif;margin:0;display:grid;place-items:center;min-height:100vh;background:#14171f;color:#e6e9f0}
div{max-width:520px;padding:24px;line-height:1.5}code{background:#262b38;padding:2px 6px;border-radius:4px}</style></head>
<body><div><h2>Support introuvable sur cet ordinateur</h2>
<p>Les supports originaux ne sont pas dans le dépôt : le site les lit dans ton dossier de cours.</p>
<p>Indique ce dossier en lançant <code>DOSSIER_SUPPORTS="chemin/du/dossier" npm start</code>.</p></div></body></html>`;

async function servirSupport(dossierSupports, chemin, reponse) {
  const fichier = dossierSupports ? cheminDansDossier(dossierSupports, chemin) : null;
  if (fichier && typeSupport(fichier) && (await envoyerFichier(fichier, reponse))) return;
  reponse.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  reponse.end(PAGE_SUPPORT_ABSENT);
}

function creerRoutes({ dossierContenu }) {
  const routes = [{ methode: 'GET', chemin: '/api/etat', action: () => etatOutils() }];
  for (const langage of Object.keys(LANGAGES)) {
    const executeur = EXECUTEURS[langage];
    routes.push(
      {
        methode: 'POST',
        chemin: `/api/${langage}/executer`,
        action: async (requete) => {
          const { code, entree } = await lireCode(requete);
          return executeur.executerProgramme(code, entree ?? '');
        },
      },
      {
        methode: 'POST',
        chemin: `/api/${langage}/verifier`,
        action: async (requete) => {
          const { chapitreId, exerciceId, code } = await lireCode(requete);
          const exercice = await lireExercice(path.join(dossierContenu, langage), langage, chapitreId, exerciceId);
          return executeur.verifierExercice(exercice, code);
        },
      },
    );
  }
  return routes;
}

function statutErreur(erreur) {
  if (erreur instanceof ErreurHttp) return erreur.statut;
  if (erreur instanceof ContenuIntrouvable) return 404;
  return 500;
}

export function creerServeur({ racine, dossierContenu, dossierSupports, synchro }) {
  const routes = creerRoutes({ dossierContenu });
  return http.createServer(async (requete, reponse) => {
    try {
      const { pathname } = new URL(requete.url, 'http://localhost');
      if (pathname.startsWith('/api/myges/')) {
        envoyerJson(reponse, 200, await actionMyges(synchro, requete, pathname));
      } else if (pathname.startsWith('/api/')) {
        const route = routes.find((candidate) => candidate.methode === requete.method && candidate.chemin === pathname);
        if (!route) throw new ErreurHttp(404, 'Route inconnue');
        envoyerJson(reponse, 200, await route.action(requete));
      } else if (pathname.startsWith('/supports/')) {
        await servirSupport(dossierSupports, pathname.slice('/supports/'.length), reponse);
      } else {
        await servirFichier(racine, pathname, reponse);
      }
    } catch (erreur) {
      const statut = statutErreur(erreur);
      if (statut === 500) console.error(erreur);
      envoyerJson(reponse, statut, { erreur: erreur.message || 'Erreur interne' });
    }
  });
}
