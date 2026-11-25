import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { ErreurSynchro } from '../serveur/commun/erreurs.js';
import { creerServeur } from '../serveur/serveur.js';
import { creerSynchroDesactivee } from '../serveur/synchro-desactivee.js';
import { creerContenuExemple, creerDossierTemporaire, obtenirCookie, supprimerDossier } from './aide.js';

const MESSAGE = 'Synchro impossible sur hermes, à faire en local';

describe('synchro désactivée', () => {
  it('donne un état « desactivee »', () => {
    assert.deepEqual(creerSynchroDesactivee('MyGES').etat(), { etape: 'desactivee' });
  });

  it('refuse de lancer, reprendre ou arrêter avec le message', () => {
    const synchro = creerSynchroDesactivee('MyGES');
    for (const action of ['demarrer', 'reprendre', 'arreter']) {
      assert.throws(() => synchro[action](), (erreur) => erreur instanceof ErreurSynchro && erreur.code === 'desactivee' && erreur.message === MESSAGE, action);
    }
  });

  it('ne reprend rien au démarrage', async () => {
    const synchro = creerSynchroDesactivee('Schooding');
    assert.deepEqual(await synchro.reprendreAuDemarrage(), { etape: 'desactivee' });
    assert.deepEqual(synchro.fichiersPrives, []);
    assert.equal(synchro.nom, 'Schooding');
    synchro.couper();
  });

  describe('par le serveur', () => {
    let racine;
    let serveur;
    let adresse;
    let cookie;

    before(async () => {
      racine = await creerDossierTemporaire();
      await fs.writeFile(path.join(racine, 'index.html'), '<!doctype html><title>Accueil</title>');
      await creerContenuExemple(racine);
      serveur = creerServeur({ racine, dossierContenu: path.join(racine, 'contenu'), synchros: { myges: creerSynchroDesactivee('MyGES') } });
      await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre));
      adresse = `http://127.0.0.1:${serveur.address().port}`;
      cookie = await obtenirCookie(serveur.address().port);
    });

    after(async () => {
      await new Promise((resoudre) => serveur.close(resoudre));
      await supprimerDossier(racine);
    });

    it('renvoie l’état désactivé', async () => {
      const reponse = await fetch(`${adresse}/api/myges/etat`);
      assert.equal(reponse.status, 200);
      assert.deepEqual(await reponse.json(), { etape: 'desactivee' });
    });

    it('refuse la synchro avec le message', async () => {
      const reponse = await fetch(`${adresse}/api/myges/synchroniser`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: '{}' });
      assert.equal(reponse.status, 403);
      assert.deepEqual(await reponse.json(), { erreur: MESSAGE });
    });
  });
});
