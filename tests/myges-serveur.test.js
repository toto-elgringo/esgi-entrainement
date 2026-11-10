import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { ErreurMyges } from '../serveur/myges/erreurs.js';
import { creerServeur } from '../serveur/serveur.js';
import { creerDossierTemporaire, supprimerDossier } from './aide.js';

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
  return { serveur, port: serveur.address().port };
}

describe('routes MyGES du serveur', () => {
  let racine;
  let serveur;
  let port;
  const appels = [];
  const synchro = {
    demarrer: () => { appels.push('demarrer'); return { etape: 'connexion' }; },
    reprendre: () => { appels.push('reprendre'); return { etape: 'claude' }; },
    arreter: () => { appels.push('arreter'); return { etape: 'terminee' }; },
    etat: () => { appels.push('etat'); return { etape: 'repos' }; },
  };

  const json = (entetes = {}) => ({ Host: `127.0.0.1:${port}`, 'Content-Type': 'application/json', ...entetes });

  before(async () => {
    racine = await creerDossierTemporaire();
    await fs.writeFile(path.join(racine, 'index.html'), '<html></html>', 'utf8');
    await fs.writeFile(path.join(racine, '.env'), 'MYGES_MOT_DE_PASSE=secret', 'utf8');
    await fs.writeFile(path.join(racine, 'myges-suivi.json'), '{}', 'utf8');
    await fs.writeFile(path.join(racine, 'myges-a-integrer.json'), '{"fichiers":["secret"]}', 'utf8');
    await fs.mkdir(path.join(racine, '.git'));
    await fs.writeFile(path.join(racine, '.git', 'config'), '[core]', 'utf8');
    ({ serveur, port } = await demarrer({ racine, dossierContenu: path.join(racine, 'contenu'), synchro }));
  });

  after(async () => {
    serveur.close();
    await supprimerDossier(racine);
  });

  it('ne sert jamais les fichiers cachés ni le suivi', async () => {
    for (const chemin of ['/.env', '/.git/config', '/myges-suivi.json', '/myges-a-integrer.json', '/%2Eenv']) {
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

  it('refuse un autre site, un autre hôte ou un corps qui n’est pas du JSON', async () => {
    appels.length = 0;
    const refusees = [
      { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: json({ Origin: 'http://exemple.com' }), corps: '{}' },
      { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: json({ 'Content-Type': 'text/plain' }), corps: '{}' },
      { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: json({ Host: 'exemple.com' }), corps: '{}' },
      { chemin: '/api/myges/etat', entetes: { Host: `pirate.test:${port}` } },
    ];
    for (const demande of refusees) assert.equal((await requete(port, demande)).statut, 403);
    assert.deepEqual(appels, []);
  });

  it('répond 404 pour une route MyGES inconnue', async () => {
    assert.equal((await requete(port, { methode: 'POST', chemin: '/api/myges/valider', entetes: json(), corps: '{}' })).statut, 404);
  });

  it('répond 503 sans synchro', async () => {
    const autre = await demarrer({ racine, dossierContenu: path.join(racine, 'contenu') });
    try {
      const { statut } = await requete(autre.port, { chemin: '/api/myges/etat', entetes: { Host: `127.0.0.1:${autre.port}` } });
      assert.equal(statut, 503);
    } finally {
      autre.serveur.close();
    }
  });

  it('transforme une erreur MyGES en réponse claire', async () => {
    const autre = await demarrer({ racine, dossierContenu: path.join(racine, 'contenu'), synchro: { ...synchro, demarrer: () => { throw new ErreurMyges('deja_en_cours', 'Déjà en cours'); } } });
    try {
      const { statut, texte } = await requete(autre.port, { methode: 'POST', chemin: '/api/myges/synchroniser', entetes: { Host: `127.0.0.1:${autre.port}`, 'Content-Type': 'application/json' }, corps: '{}' });
      assert.equal(statut, 409);
      assert.equal(JSON.parse(texte).erreur, 'Déjà en cours');
    } finally {
      autre.serveur.close();
    }
  });
});
