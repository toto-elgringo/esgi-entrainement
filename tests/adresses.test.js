import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { creerServeur } from '../serveur/serveur.js';
import { creerContenuExemple, creerDossierTemporaire, obtenirCookie, supprimerDossier } from './aide.js';

function demander(port, { methode = 'GET', chemin = '/', entetes = {}, corps } = {}) {
  return new Promise((resoudre, rejeter) => {
    const requete = http.request({ host: '127.0.0.1', port, path: chemin, method: methode, headers: entetes }, (reponse) => {
      reponse.resume();
      resoudre(reponse.statusCode);
    });
    requete.on('error', rejeter);
    requete.end(corps);
  });
}

async function demarrer(racine, options) {
  const serveur = creerServeur({ racine, dossierContenu: path.join(racine, 'contenu'), ...options });
  await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre));
  return serveur;
}

describe('adresses permises', () => {
  let racine;
  let serveur;
  let port;
  let cookie;

  before(async () => {
    racine = await creerDossierTemporaire();
    await fs.writeFile(path.join(racine, 'index.html'), '<!doctype html><title>Accueil</title>');
    await creerContenuExemple(racine);
    serveur = await demarrer(racine, { adresses: ['hermes', '100.75.25.89'] });
    port = serveur.address().port;
    cookie = await obtenirCookie(port);
  });

  after(async () => {
    await new Promise((resoudre) => serveur.close(resoudre));
    await supprimerDossier(racine);
  });

  it('accepte les hôtes de la liste', async () => {
    assert.equal(await demander(port, { entetes: { Host: 'hermes' } }), 200);
    assert.equal(await demander(port, { entetes: { Host: '100.75.25.89' } }), 200);
  });

  it('refuse un hôte hors de la liste', async () => {
    assert.equal(await demander(port, { entetes: { Host: 'pirate.test' } }), 403);
  });

  it('accepte une origine de la liste et refuse les autres', async () => {
    const requete = (origine) => ({
      methode: 'POST',
      chemin: '/api/python/executer',
      entetes: { Host: 'hermes', Origin: origine, Cookie: cookie, 'Content-Type': 'application/json' },
      corps: '{}',
    });
    assert.notEqual(await demander(port, requete('http://hermes')), 403);
    assert.equal(await demander(port, requete('http://pirate.test')), 403);
  });

  it('reste local sans liste d’adresses', async () => {
    const local = await demarrer(racine, {});
    try {
      assert.equal(await demander(local.address().port, { entetes: { Host: 'hermes' } }), 403);
    } finally {
      await new Promise((resoudre) => local.close(resoudre));
    }
  });
});
