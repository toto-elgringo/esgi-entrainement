import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { ErreurSynchro } from '../serveur/commun/erreurs.js';
import { creerServeur } from '../serveur/serveur.js';
import { creerDossierTemporaire, obtenirCookie, supprimerDossier } from './aide.js';

function requete(port, { methode = 'GET', chemin, entetes = {}, corps }) {
  return new Promise((resoudre, rejeter) => {
    const envoi = http.request({ host: '127.0.0.1', port, method: methode, path: chemin, headers: entetes }, (reponse) => {
      let texte = '';
      reponse.setEncoding('utf8');
      reponse.on('data', (morceau) => { texte += morceau; });
      reponse.on('end', () => resoudre({ statut: reponse.statusCode, texte }));
    });
    envoi.on('error', rejeter);
    envoi.end(corps);
  });
}

async function demarrer(options) {
  const serveur = creerServeur(options);
  await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre));
  const port = serveur.address().port;
  return { serveur, port, cookie: await obtenirCookie(port) };
}

function enJson(port, cookie, entetes = {}) {
  return { Host: `127.0.0.1:${port}`, 'Content-Type': 'application/json', Cookie: cookie, ...entetes };
}

describe('routes MyGES du serveur', () => {
  let racine;
  let serveur;
  let port;
  let cookie;
  const appels = [];
  const synchro = {
    nom: 'MyGES',
    fichiersPrives: ['myges-suivi.json', 'myges-a-integrer.json'],
    demarrer: () => { appels.push('demarrer'); return { etape: 'connexion' }; },
    reprendre: () => { appels.push('reprendre'); return { etape: 'claude' }; },
    arreter: () => { appels.push('arreter'); return { etape: 'terminee' }; },
    etat: () => { appels.push('etat'); return { etape: 'repos' }; },
  };

  const json = (entetes = {}) => enJson(port, cookie, entetes);

  before(async () => {
    racine = await creerDossierTemporaire();
    await fs.writeFile(path.join(racine, 'index.html'), '<html></html>', 'utf8');
    await fs.writeFile(path.join(racine, '.env'), 'MYGES_MOT_DE_PASSE=secret', 'utf8');
    await fs.writeFile(path.join(racine, 'myges-suivi.json'), '{}', 'utf8');
    await fs.writeFile(path.join(racine, 'myges-a-integrer.json'), '{"fichiers":["secret"]}', 'utf8');
    await fs.mkdir(path.join(racine, '.git'));
    await fs.writeFile(path.join(racine, '.git', 'config'), '[core]', 'utf8');
    ({ serveur, port, cookie } = await demarrer({ racine, dossierContenu: path.join(racine, 'contenu'), synchros: { myges: synchro } }));
  });

  after(async () => {
    serveur.close();
    await supprimerDossier(racine);
  });

  it('ne sert jamais les fichiers cachés ni le suivi', async () => {
    for (const chemin of ['/.env', '/.git/config', '/myges-suivi.json', '/myges-a-integrer.json', '/%2Eenv', '/contenu/myges-suivi.json']) {
      const { statut, texte } = await requete(port, { chemin });
      assert.equal(statut, 404, chemin);
      assert.ok(!texte.includes('secret'));
    }
    assert.equal((await requete(port, { chemin: '/' })).statut, 200);
  });

  it('lance la synchro depuis la page locale', async () => {
    const { statut, texte } = await requete(port, { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: json({ Origin: `http://localhost:${port}`, Host: `localhost:${port}` }), corps: '{}' });
    assert.equal(statut, 200);
    assert.deepEqual(JSON.parse(texte), { etape: 'connexion' });
    assert.equal((await requete(port, { chemin: '/api/myges/etat', entetes: { Host: `127.0.0.1:${port}` } })).statut, 200);
    assert.equal((await requete(port, { methode: 'POST', chemin: '/api/myges/arreter', entetes: json(), corps: '{}' })).statut, 200);
  });

  it('reprend l’intégration depuis la page locale', async () => {
    const { statut, texte } = await requete(port, { methode: 'POST', chemin: '/api/myges/reprendre', entetes: json(), corps: '{}' });
    assert.equal(statut, 200);
    assert.deepEqual(JSON.parse(texte), { etape: 'claude' });
  });

  it('refuse un autre site, un autre hôte, une requête sans jeton ou un corps qui n’est pas du JSON', async () => {
    appels.length = 0;
    const refusees = [
      [403, { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: json({ Origin: 'http://exemple.com' }), corps: '{}' }],
      [415, { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: json({ 'Content-Type': 'text/plain' }), corps: '{}' }],
      [403, { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: json({ Host: 'exemple.com' }), corps: '{}' }],
      [403, { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: json({ Cookie: '' }), corps: '{}' }],
      [403, { chemin: '/api/myges/etat', entetes: { Host: `pirate.test:${port}` } }],
      [403, { chemin: '/api/myges/etat', entetes: { Origin: 'http://exemple.com' } }],
    ];
    for (const [attendu, demande] of refusees) assert.equal((await requete(port, demande)).statut, attendu, JSON.stringify(demande.entetes));
    assert.deepEqual(appels, []);
  });

  it('répond 404 pour une route MyGES inconnue', async () => {
    assert.equal((await requete(port, { methode: 'POST', chemin: '/api/myges/valider', entetes: json(), corps: '{}' })).statut, 404);
  });

  it('répond 503 pour une synchro prévue mais absente, 404 pour une synchro inconnue', async () => {
    const autre = await demarrer({ racine, dossierContenu: path.join(racine, 'contenu'), synchros: { myges: null } });
    try {
      const { statut, texte } = await requete(autre.port, { chemin: '/api/myges/etat' });
      assert.equal(statut, 503);
      assert.match(JSON.parse(texte).erreur, /myges/);
      assert.equal((await requete(autre.port, { chemin: '/api/schooding/etat' })).statut, 404);
    } finally {
      autre.serveur.close();
    }
  });

  it('transforme une erreur de synchro en réponse claire', async () => {
    const enCours = { ...synchro, demarrer: async () => { throw new ErreurSynchro('deja_en_cours', 'Déjà en cours'); } };
    const autre = await demarrer({ racine, dossierContenu: path.join(racine, 'contenu'), synchros: { myges: enCours } });
    try {
      const { statut, texte } = await requete(autre.port, { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: enJson(autre.port, autre.cookie), corps: '{}' });
      assert.equal(statut, 409);
      assert.equal(JSON.parse(texte).erreur, 'Déjà en cours');
    } finally {
      autre.serveur.close();
    }
  });

  it('cache le détail d’une erreur inattendue', async (contexte) => {
    contexte.mock.method(console, 'error', () => {});
    const casse = { ...synchro, etat: () => { throw new Error('C:\\chemin\\secret'); } };
    const autre = await demarrer({ racine, dossierContenu: path.join(racine, 'contenu'), synchros: { myges: casse } });
    try {
      const { statut, texte } = await requete(autre.port, { chemin: '/api/myges/etat' });
      assert.equal(statut, 500);
      assert.deepEqual(JSON.parse(texte), { erreur: 'Erreur interne du serveur' });
      assert.equal(console.error.mock.callCount(), 1);
    } finally {
      autre.serveur.close();
    }
  });

  it('sert la synchro Schooding sur ses propres routes', async () => {
    const actions = [];
    const schooding = {
      nom: 'Schooding',
      fichiersPrives: ['schooding-suivi.json', 'schooding-a-integrer.json'],
      demarrer: () => { actions.push('demarrer'); return { etape: 'connexion', source: 'schooding' }; },
      reprendre: () => ({ etape: 'claude' }),
      arreter: () => ({ etape: 'terminee' }),
      etat: () => ({ etape: 'repos', source: 'schooding' }),
    };
    await fs.writeFile(path.join(racine, 'schooding-suivi.json'), '{"secret":1}', 'utf8');
    await fs.writeFile(path.join(racine, 'schooding-a-integrer.json'), '{"fichiers":["secret"]}', 'utf8');
    const autre = await demarrer({ racine, dossierContenu: path.join(racine, 'contenu'), synchros: { myges: synchro, schooding } });
    const hote = { Host: `127.0.0.1:${autre.port}` };
    try {
      const lance = await requete(autre.port, { methode: 'POST', chemin: '/api/schooding/synchroniser', entetes: enJson(autre.port, autre.cookie), corps: '{}' });
      assert.deepEqual(JSON.parse(lance.texte), { etape: 'connexion', source: 'schooding' });
      assert.deepEqual(actions, ['demarrer']);
      assert.equal(JSON.parse((await requete(autre.port, { chemin: '/api/schooding/etat', entetes: hote })).texte).source, 'schooding');
      assert.equal((await requete(autre.port, { methode: 'POST', chemin: '/api/schooding/synchroniser', entetes: enJson(autre.port, autre.cookie, { Origin: 'http://exemple.com' }), corps: '{}' })).statut, 403);
      for (const chemin of ['/schooding-suivi.json', '/schooding-a-integrer.json']) {
        const { statut, texte } = await requete(autre.port, { chemin });
        assert.equal(statut, 404, chemin);
        assert.ok(!texte.includes('secret'));
      }
    } finally {
      autre.serveur.close();
    }
    const sans = await demarrer({ racine, dossierContenu: path.join(racine, 'contenu'), synchros: { myges: synchro, schooding: undefined } });
    try {
      const { statut, texte } = await requete(sans.port, { chemin: '/api/schooding/etat', entetes: { Host: `127.0.0.1:${sans.port}` } });
      assert.equal(statut, 503);
      assert.match(JSON.parse(texte).erreur, /schooding/);
    } finally {
      sans.serveur.close();
    }
  });
});
