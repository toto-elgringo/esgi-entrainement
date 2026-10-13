import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { ContenuIntrouvable, lireExercice } from './contenu-rust.js';
import { executerProgramme, verifierExercice, versionRust } from './rust.js';

const TAILLE_MAX_CORPS = 512 * 1024;
const TYPES_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.rs': 'text/plain; charset=utf-8',
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
  return corps;
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

function creerRoutes({ dossierRust }) {
  return [
    {
      methode: 'GET',
      chemin: '/api/etat',
      action: async () => ({ rust: await versionRust() }),
    },
    {
      methode: 'POST',
      chemin: '/api/rust/executer',
      action: async (requete) => executerProgramme((await lireCode(requete)).code),
    },
    {
      methode: 'POST',
      chemin: '/api/rust/verifier',
      action: async (requete) => {
        const { chapitreId, exerciceId, code } = await lireCode(requete);
        const exercice = await lireExercice(dossierRust, chapitreId, exerciceId);
        return verifierExercice(exercice, code);
      },
    },
  ];
}

function statutErreur(erreur) {
  if (erreur instanceof ErreurHttp) return erreur.statut;
  if (erreur instanceof ContenuIntrouvable) return 404;
  return 500;
}

export function creerServeur({ racine, dossierRust }) {
  const routes = creerRoutes({ dossierRust });
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
