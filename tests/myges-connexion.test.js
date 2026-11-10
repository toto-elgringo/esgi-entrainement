import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { connecterSite, lireFormulaireConnexion } from '../serveur/myges/connexion.js';
import { identifiantsMyges, lireEnv } from '../serveur/myges/env.js';
import { creerSession } from '../serveur/myges/session.js';
import { creerDossierTemporaire, supprimerDossier } from './aide.js';
import { demarrerFauxMyges, demarrerFauxSiteMyges, IDENTIFIANTS } from './aide-myges.js';

describe('lecture du .env', () => {
  let dossier;

  before(async () => {
    dossier = await creerDossierTemporaire();
  });

  after(async () => {
    await supprimerDossier(dossier);
  });

  it('lit les clés, ignore les commentaires et retire les guillemets', async () => {
    const fichier = path.join(dossier, '.env');
    await fs.writeFile(fichier, 'MYGES_IDENTIFIANT=aandre\n# commentaire\n\nMYGES_MOT_DE_PASSE="a=b:c é"\n', 'utf8');
    assert.deepEqual(await lireEnv(fichier), { MYGES_IDENTIFIANT: 'aandre', MYGES_MOT_DE_PASSE: 'a=b:c é' });
  });

  it('accepte les fins de ligne Windows et les guillemets simples', async () => {
    const fichier = path.join(dossier, 'windows.env');
    await fs.writeFile(fichier, "MYGES_IDENTIFIANT='aandre'\r\nMYGES_MOT_DE_PASSE=secret\r\n", 'utf8');
    assert.deepEqual(await lireEnv(fichier), { MYGES_IDENTIFIANT: 'aandre', MYGES_MOT_DE_PASSE: 'secret' });
  });

  it('renvoie un objet vide si le fichier est absent', async () => {
    assert.deepEqual(await lireEnv(path.join(dossier, 'absent.env')), {});
  });

  it('demande les deux identifiants', () => {
    assert.equal(identifiantsMyges({ MYGES_IDENTIFIANT: 'x' }), null);
    assert.equal(identifiantsMyges({ MYGES_IDENTIFIANT: 'x', MYGES_MOT_DE_PASSE: '' }), null);
    assert.deepEqual(identifiantsMyges({ MYGES_IDENTIFIANT: 'x', MYGES_MOT_DE_PASSE: 'y' }), { identifiant: 'x', motDePasse: 'y' });
  });
});

describe('session web', () => {
  it('garde les cookies et suit les redirections', async () => {
    const faux = await demarrerFauxMyges((requete, reponse) => {
      if (requete.url === '/depart') {
        reponse.writeHead(302, { Location: '/arrivee', 'Set-Cookie': 'jeton=42; Path=/; HttpOnly' }).end();
        return;
      }
      reponse.writeHead(200).end(`cookie:${requete.headers.cookie ?? ''}`);
    });
    try {
      const { reponse, adresse } = await creerSession().obtenir(`${faux.adresse}/depart`);
      assert.equal(adresse, `${faux.adresse}/arrivee`);
      assert.equal(await reponse.text(), 'cookie:jeton=42');
    } finally {
      await faux.fermer();
    }
  });

  it('signale un MyGES injoignable', async () => {
    await assert.rejects(creerSession().obtenir('http://127.0.0.1:1/'), { code: 'injoignable' });
  });
});

describe('connexion au site MyGES', () => {
  it('lit le formulaire de connexion', () => {
    const formulaire = lireFormulaireConnexion('<form action="/login;jsessionid=A&amp;b=1" method="post"><input name="username" value=""/><input type="hidden" name="lt" value="LT-1"/><input name="password" type="password"/></form>');
    assert.deepEqual(formulaire, { action: '/login;jsessionid=A&b=1', champs: { username: '', lt: 'LT-1', password: '' } });
    assert.equal(lireFormulaireConnexion('<html>Accueil</html>'), null);
  });

  it('se connecte avec un mot de passe qui contient des symboles', async () => {
    const faux = await demarrerFauxSiteMyges();
    try {
      const session = await connecterSite(IDENTIFIANTS, { adresseSite: faux.adresse });
      const { reponse } = await session.obtenir(`${faux.adresse}/student/courses-files`);
      assert.match(await reponse.text(), /coursesFilesForm/);
      assert.equal(faux.compteurs.connexions, 1);
    } finally {
      await faux.fermer();
    }
  });

  it('signale des identifiants refusés sans les afficher', async () => {
    const faux = await demarrerFauxSiteMyges();
    try {
      await assert.rejects(connecterSite({ identifiant: 'aandre', motDePasse: 'faux' }, { adresseSite: faux.adresse }), (erreur) => {
        assert.equal(erreur.code, 'identifiants_refuses');
        assert.ok(!erreur.message.includes('aandre'));
        assert.ok(!erreur.message.includes('faux'));
        return true;
      });
    } finally {
      await faux.fermer();
    }
  });

  it('signale une page de connexion inattendue', async () => {
    const faux = await demarrerFauxMyges((requete, reponse) => reponse.writeHead(200).end('<html>maintenance</html>'));
    try {
      await assert.rejects(connecterSite(IDENTIFIANTS, { adresseSite: faux.adresse }), { code: 'reponse_inattendue' });
    } finally {
      await faux.fermer();
    }
  });
});
