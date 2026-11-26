import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { DOMAINES_CODE, LANGAGES } from '../js/domaines.js';
import { typeSupport } from '../js/supports.js';
import * as c from './c.js';
import { ErreurSynchro } from './commun/erreurs.js';
import { ContenuIntrouvable, creerSommaires, lireExercice } from './contenu-code.js';
import { couperResultat, TropDeDemandes } from './processus.js';
import * as python from './python.js';
import * as rust from './rust.js';

export const EXECUTEURS = { rust, python, c };

const TAILLE_MAX_CORPS = 512 * 1024;
const FICHIERS_RACINE = new Set(['index.html', 'style.css', 'favicon.svg', 'favicon.ico']);
const DOSSIERS_PUBLICS = new Set(['css', 'js', 'contenu', 'vendor']);
const FICHIER_OBSIDIAN = 'synchro-obsidian.json';
const STATUTS_SYNCHRO = { deja_en_cours: 409, desactivee: 403 };
const ACTIONS_SYNCHRO = [
  { methode: 'POST', nom: 'synchroniser', action: (synchro) => synchro.demarrer() },
  { methode: 'POST', nom: 'reprendre', action: (synchro) => synchro.reprendre() },
  { methode: 'POST', nom: 'arreter', action: (synchro) => synchro.arreter() },
  { methode: 'GET', nom: 'etat', action: (synchro) => synchro.etat() },
];
const ENTETES_SECURITE = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'SAMEORIGIN',
  'Content-Security-Policy': "frame-ancestors 'self'",
};
const CSP_SUPPORT_HTML = "sandbox allow-scripts allow-popups; frame-ancestors 'self'";
const MESSAGE_ERREUR_INTERNE = 'Erreur interne du serveur';
const TYPES_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.rs': 'text/plain; charset=utf-8',
  '.py': 'text/plain; charset=utf-8',
  '.c': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
};

export class ErreurHttp extends Error {
  constructor(statut, message) {
    super(message);
    this.statut = statut;
  }
}

function typeMime(fichier) {
  return TYPES_MIME[path.extname(fichier).toLowerCase()] ?? 'application/octet-stream';
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

function domaineAutorise(domaine, langage) {
  return typeof domaine === 'string' && Object.hasOwn(DOMAINES_CODE, domaine) && DOMAINES_CODE[domaine].langage === langage;
}

async function lireCode(requete) {
  const corps = await lireCorpsJson(requete);
  if (typeof corps.code !== 'string') throw new ErreurHttp(400, 'Le champ « code » est obligatoire');
  if (corps.entree !== undefined && typeof corps.entree !== 'string') throw new ErreurHttp(400, 'Le champ « entree » doit être un texte');
  return corps;
}

async function etatOutils(rafraichir) {
  if (rafraichir) for (const executeur of Object.values(EXECUTEURS)) executeur.viderCacheOutils();
  const [outilsRust, outilsPython, outilsC] = await Promise.all([rust.outilsRust(), python.outilsPython(), c.outilsC()]);
  return { ...outilsRust, ...outilsPython, ...outilsC };
}

function hotesPermis(requete, adresses) {
  const port = requete.socket.localPort;
  return [`localhost:${port}`, `127.0.0.1:${port}`, ...adresses];
}

function hotePermis(requete, adresses) {
  return hotesPermis(requete, adresses).includes(requete.headers.host);
}

function origineAcceptee(requete, adresses) {
  const origine = requete.headers.origin;
  return origine === undefined || hotesPermis(requete, adresses).some((hote) => origine === `http://${hote}` || origine === `https://${hote}`);
}

function nomCookie(requete) {
  return `esgi_jeton_${requete.socket.localPort}`;
}

function lireCookie(requete, nom) {
  for (const morceau of (requete.headers.cookie ?? '').split(';')) {
    const [cle, ...valeur] = morceau.trim().split('=');
    if (cle === nom) return valeur.join('=');
  }
  return null;
}

function creerGardes(jeton, adresses) {
  function lecture(requete) {
    if (!origineAcceptee(requete, adresses)) throw new ErreurHttp(403, 'Requête refusée');
  }

  function ecriture(requete) {
    lecture(requete);
    if (!(requete.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) {
      throw new ErreurHttp(415, 'Le corps de la requête doit être du JSON');
    }
    if (lireCookie(requete, nomCookie(requete)) !== jeton) throw new ErreurHttp(403, 'Session expirée : recharge la page.');
  }

  return { lecture, ecriture, aucune: () => {} };
}

function decouperChemin(chemin) {
  let relatif;
  try {
    relatif = decodeURIComponent(chemin).replace(/^\/+/, '');
  } catch {
    return null;
  }
  if (/[~:\\\0]/.test(relatif)) return null;
  const morceaux = relatif.split('/');
  if (morceaux.some((morceau) => morceau === '' || morceau.startsWith('.'))) return null;
  return morceaux;
}

function cheminDansDossier(racine, chemin) {
  const morceaux = decouperChemin(chemin);
  if (!morceaux) return null;
  const base = path.resolve(racine);
  const fichier = path.resolve(base, ...morceaux);
  return fichier.startsWith(base + path.sep) ? fichier : null;
}

function cheminPublic(racine, chemin, fichiersPrives) {
  const morceaux = decouperChemin(chemin === '/' ? 'index.html' : chemin);
  if (!morceaux) return null;
  const autorise = morceaux.length === 1 ? FICHIERS_RACINE.has(morceaux[0]) : DOSSIERS_PUBLICS.has(morceaux[0]);
  if (!autorise || fichiersPrives.has(morceaux.at(-1).toLowerCase())) return null;
  return cheminDansDossier(racine, morceaux.join('/'));
}

export function lirePlage(entete, taille) {
  if (typeof entete !== 'string') return undefined;
  const trouve = /^bytes=(\d*)-(\d*)$/.exec(entete.trim());
  if (!trouve || (trouve[1] === '' && trouve[2] === '')) return undefined;
  let debut;
  let fin;
  if (trouve[1] === '') {
    const longueur = Number(trouve[2]);
    if (longueur === 0) return null;
    debut = Math.max(0, taille - longueur);
    fin = taille - 1;
  } else {
    debut = Number(trouve[1]);
    fin = trouve[2] === '' ? taille - 1 : Math.min(Number(trouve[2]), taille - 1);
  }
  if (debut >= taille || debut > fin) return null;
  return { debut, fin };
}

async function envoyerFlux(requete, reponse, fichier, entetes = {}) {
  let poignee;
  try {
    poignee = await fs.open(fichier, 'r');
  } catch {
    return false;
  }
  let flux = null;
  try {
    const infos = await poignee.stat();
    if (!infos.isFile()) return false;
    const taille = infos.size;
    const base = { 'Content-Type': typeMime(fichier), 'Cache-Control': 'no-cache', 'Accept-Ranges': 'bytes', ...entetes };
    const plage = lirePlage(requete.headers.range, taille);
    if (plage === null) {
      reponse.writeHead(416, { ...base, 'Content-Range': `bytes */${taille}` });
      reponse.end();
      return true;
    }
    if (plage) {
      reponse.writeHead(206, { ...base, 'Content-Range': `bytes ${plage.debut}-${plage.fin}/${taille}`, 'Content-Length': plage.fin - plage.debut + 1 });
      flux = poignee.createReadStream({ start: plage.debut, end: plage.fin });
    } else {
      reponse.writeHead(200, { ...base, 'Content-Length': taille });
      flux = poignee.createReadStream();
    }
    await pipeline(flux, reponse).catch(() => {});
    return true;
  } finally {
    if (!flux) await poignee.close();
  }
}

function empreinte(texte) {
  return `'sha256-${createHash('sha256').update(texte, 'utf8').digest('base64')}'`;
}

export function scriptsEnLigne(html) {
  return Array.from(html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))
    .filter(([, attributs]) => !/\bsrc\s*=/i.test(attributs))
    .map(([, , contenu]) => contenu.replace(/\r\n?/g, '\n'));
}

export function politiquePage(html) {
  const empreintes = scriptsEnLigne(html).map(empreinte);
  return [
    "default-src 'self'",
    ["script-src 'self'", ...empreintes].join(' '),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "frame-src 'self' https:",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; ');
}

async function servirPage(reponse, fichier, jeton, requete) {
  let html;
  try {
    html = await fs.readFile(fichier, 'utf8');
  } catch {
    return false;
  }
  reponse.writeHead(200, {
    'Content-Type': TYPES_MIME['.html'],
    'Cache-Control': 'no-cache',
    'Content-Security-Policy': politiquePage(html),
    'Set-Cookie': `${nomCookie(requete)}=${jeton}; HttpOnly; SameSite=Strict; Path=/`,
  });
  reponse.end(html);
  return true;
}

async function servirFichier({ requete, reponse, url }, { racine, fichiersPrives, jeton }) {
  const fichier = cheminPublic(racine, url.pathname, fichiersPrives);
  if (!fichier) throw new ErreurHttp(404, 'Fichier introuvable');
  const envoye = path.basename(fichier) === 'index.html' && path.dirname(fichier) === path.resolve(racine)
    ? await servirPage(reponse, fichier, jeton, requete)
    : await envoyerFlux(requete, reponse, fichier);
  if (!envoye) throw new ErreurHttp(404, 'Fichier introuvable');
}

const PAGE_SUPPORT_ABSENT = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>Support introuvable</title>
<style>body{font-family:system-ui,sans-serif;margin:0;display:grid;place-items:center;min-height:100vh;background:#14171f;color:#e6e9f0}
div{max-width:520px;padding:24px;line-height:1.5}code{background:#262b38;padding:2px 6px;border-radius:4px}</style></head>
<body><div><h2>Support introuvable sur cet ordinateur</h2>
<p>Les supports originaux ne sont pas dans le dépôt : le site les lit dans ton dossier de cours.</p>
<p>Indique ce dossier en lançant <code>DOSSIER_SUPPORTS="chemin/du/dossier" npm start</code>.</p></div></body></html>`;

async function servirSupport({ requete, reponse, parametres }, dossierSupports) {
  const fichier = dossierSupports ? cheminDansDossier(dossierSupports, parametres[0]) : null;
  if (fichier && typeSupport(fichier)) {
    const entetes = path.extname(fichier).toLowerCase() === '.html' ? { 'Content-Security-Policy': CSP_SUPPORT_HTML } : {};
    if (await envoyerFlux(requete, reponse, fichier, entetes)) return;
  }
  reponse.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  reponse.end(PAGE_SUPPORT_ABSENT);
}

function signalDeRequete(reponse) {
  const controleur = new AbortController();
  reponse.on('close', () => {
    if (!reponse.writableFinished) controleur.abort();
  });
  return controleur.signal;
}

async function actionSynchro(requete, cle, synchro, action) {
  if (!synchro) throw new ErreurHttp(503, `La synchro ${cle} n’est pas disponible`);
  if (requete.method === 'POST') await lireCorpsJson(requete);
  try {
    return await action(synchro);
  } catch (erreur) {
    if (erreur instanceof ErreurSynchro) throw new ErreurHttp(STATUTS_SYNCHRO[erreur.code] ?? 400, erreur.message);
    throw erreur;
  }
}

function routesLangages(dossierContenu, gardes) {
  return Object.keys(LANGAGES).flatMap((langage) => {
    const executeur = EXECUTEURS[langage];
    return [
      {
        methode: 'POST',
        chemin: `/api/${langage}/executer`,
        garde: gardes.ecriture,
        action: async ({ requete, reponse }) => {
          const signal = signalDeRequete(reponse);
          const { code, entree } = await lireCode(requete);
          return couperResultat(await executeur.executerProgramme(code, entree ?? '', { signal }));
        },
      },
      {
        methode: 'POST',
        chemin: `/api/${langage}/verifier`,
        garde: gardes.ecriture,
        action: async ({ requete, reponse }) => {
          const signal = signalDeRequete(reponse);
          const { domaine = langage, chapitreId, exerciceId, code } = await lireCode(requete);
          if (!domaineAutorise(domaine, langage)) throw new ErreurHttp(400, 'Domaine inconnu');
          const exercice = await lireExercice(path.join(dossierContenu, domaine), langage, chapitreId, exerciceId);
          return couperResultat(await executeur.verifierExercice(exercice, code, { signal }));
        },
      },
    ];
  });
}

function routesSynchros(synchros, gardes) {
  return Object.entries(synchros).flatMap(([cle, synchro]) =>
    ACTIONS_SYNCHRO.map(({ methode, nom, action }) => ({
      methode,
      chemin: `/api/${cle}/${nom}`,
      garde: methode === 'POST' ? gardes.ecriture : gardes.lecture,
      action: ({ requete }) => actionSynchro(requete, synchro?.nom ?? cle, synchro, action),
    })),
  );
}

function routesProgression(progression, gardes) {
  const lecture = {
    methode: 'GET',
    chemin: '/api/progression',
    garde: gardes.lecture,
    action: async () => (progression ? { active: true, ...(await progression.lire()) } : { active: false }),
  };
  if (!progression) return [lecture];
  return [
    lecture,
    {
      methode: 'POST',
      chemin: '/api/progression',
      garde: gardes.ecriture,
      action: async ({ requete }) => progression.appliquer((await lireCorpsJson(requete)).changements),
    },
  ];
}

function creerRoutes(options) {
  const { dossierContenu, dossierSupports, synchros, sommaires, gardes, progression } = options;
  return [
    { methode: 'GET', chemin: '/api/etat', garde: gardes.lecture, action: ({ url }) => etatOutils(url.searchParams.has('rafraichir')) },
    { methode: 'GET', motif: /^\/api\/sommaire\/([^/]+)$/, garde: gardes.lecture, action: ({ parametres }) => sommaires.lire(parametres[0]) },
    ...routesLangages(dossierContenu, gardes),
    ...routesSynchros(synchros, gardes),
    ...routesProgression(progression, gardes),
    { methode: 'GET', motif: /^\/supports\/(.+)$/, garde: gardes.aucune, brut: true, action: (contexte) => servirSupport(contexte, dossierSupports) },
    { methode: 'GET', motif: /^\/(?!api\/)/, garde: gardes.aucune, brut: true, action: (contexte) => servirFichier(contexte, options) },
  ];
}

function trouverRoute(routes, methode, chemin) {
  for (const route of routes) {
    if (route.methode !== methode) continue;
    if (route.chemin === chemin) return { route, parametres: [] };
    const correspondance = route.motif?.exec(chemin);
    if (correspondance) return { route, parametres: correspondance.slice(1) };
  }
  return null;
}

function statutErreur(erreur) {
  if (erreur instanceof ErreurHttp) return erreur.statut;
  if (erreur instanceof ContenuIntrouvable) return 404;
  if (erreur instanceof TropDeDemandes) return 503;
  return 500;
}

function lireUrl(requete) {
  try {
    return new URL(requete.url, 'http://localhost');
  } catch {
    throw new ErreurHttp(400, 'Adresse invalide');
  }
}

export function creerServeur({ racine, dossierContenu, dossierSupports, synchros = {}, adresses = [], progression = null }) {
  const jeton = randomUUID();
  const gardes = creerGardes(jeton, adresses);
  const sommaires = creerSommaires(dossierContenu);
  const fichiersPrives = new Set(
    [...Object.values(synchros).flatMap((synchro) => synchro?.fichiersPrives ?? []), FICHIER_OBSIDIAN].map((nom) => nom.toLowerCase()),
  );
  const routes = creerRoutes({ racine, dossierContenu, dossierSupports, synchros, sommaires, gardes, fichiersPrives, jeton, progression });

  const serveur = http.createServer(async (requete, reponse) => {
    for (const [nom, valeur] of Object.entries(ENTETES_SECURITE)) reponse.setHeader(nom, valeur);
    try {
      if (!hotePermis(requete, adresses)) throw new ErreurHttp(403, 'Requête refusée');
      const url = lireUrl(requete);
      const trouvee = trouverRoute(routes, requete.method === 'HEAD' ? 'GET' : requete.method, url.pathname);
      if (!trouvee) throw new ErreurHttp(404, url.pathname.startsWith('/api/') ? 'Route inconnue' : 'Fichier introuvable');
      const { route, parametres } = trouvee;
      route.garde(requete);
      const contexte = { requete, reponse, url, parametres };
      if (route.brut) await route.action(contexte);
      else envoyerJson(reponse, 200, await route.action(contexte));
    } catch (erreur) {
      const statut = statutErreur(erreur);
      if (statut === 500) console.error(erreur);
      if (reponse.headersSent) {
        reponse.destroy();
        return;
      }
      envoyerJson(reponse, statut, { erreur: statut === 500 ? MESSAGE_ERREUR_INTERNE : erreur.message });
    }
  });
  serveur.on('close', () => sommaires.fermer());
  return serveur;
}
