import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { LANGAGES } from '../js/domaines.js';
import * as c from './c.js';
import { ContenuIntrouvable, lireExercice } from './contenu-code.js';
import * as python from './python.js';
import * as rust from './rust.js';

const TAILLE_MAX_CORPS = 512 * 1024;
const EXECUTEURS = { rust, python, c };
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

async function servirFichier(racine, chemin, reponse) {
  let relatif;
  try {
    relatif = chemin === '/' ? 'index.html' : decodeURIComponent(chemin).replace(/^\/+/, '');
  } catch {
    throw new ErreurHttp(404, 'Fichier introuvable');
  }
  const base = path.resolve(racine);
  const fichier = path.resolve(base, relatif);
  if (!fichier.startsWith(base + path.sep)) throw new ErreurHttp(404, 'Fichier introuvable');

  let donnees;
  try {
    donnees = await fs.readFile(fichier);
  } catch {
    throw new ErreurHttp(404, 'Fichier introuvable');
  }
  reponse.writeHead(200, {
    'Content-Type': TYPES_MIME[path.extname(fichier)] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  reponse.end(donnees);
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

export function creerServeur({ racine, dossierContenu }) {
  const routes = creerRoutes({ dossierContenu });
  return http.createServer(async (requete, reponse) => {
    try {
      const { pathname } = new URL(requete.url, 'http://localhost');
      if (pathname.startsWith('/api/')) {
        const route = routes.find((candidate) => candidate.methode === requete.method && candidate.chemin === pathname);
        if (!route) throw new ErreurHttp(404, 'Route inconnue');
        envoyerJson(reponse, 200, await route.action(requete));
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
