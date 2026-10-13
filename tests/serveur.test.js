import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { versionRust } from '../serveur/rust.js';
import { creerServeur } from '../serveur/serveur.js';
import { CODE_DEPART, CODE_SOLUTION, creerContenuExemple, creerDossierTemporaire, supprimerDossier } from './aide.js';

const sansRust = (await versionRust()) === null ? 'rustc n’est pas installé' : false;

describe('serveur local', () => {
  let racine;
  let serveur;
  let adresse;

  async function appeler(methode, chemin, corps) {
    const reponse = await fetch(`${adresse}${chemin}`, {
      method: methode,
      headers: corps ? { 'Content-Type': 'application/json' } : undefined,
      body: corps ? JSON.stringify(corps) : undefined,
    });
    const texte = await reponse.text();
    let donnees = texte;
    try {
      donnees = JSON.parse(texte);
    } catch {}
    return { statut: reponse.status, donnees };
  }

  before(async () => {
    racine = await creerDossierTemporaire();
    await fs.writeFile(path.join(racine, 'index.html'), '<h1>Accueil</h1>');
    serveur = creerServeur({ racine, dossierRust: await creerContenuExemple(racine) });
    await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre));
    adresse = `http://127.0.0.1:${serveur.address().port}`;
  });

  after(async () => {
    await new Promise((resoudre) => serveur.close(resoudre));
    await supprimerDossier(racine);
  });

  it('sert la page d’accueil et les fichiers du contenu', async () => {
    assert.match((await appeler('GET', '/')).donnees, /Accueil/);
    const depart = await appeler('GET', '/contenu/01-bases/exercices/01-double/depart.rs');
    assert.equal(depart.donnees, CODE_DEPART);
  });

  it('refuse de sortir du dossier du site', async () => {
    assert.equal((await appeler('GET', '/%2e%2e/secret.txt')).statut, 404);
  });

  it('répond 404 pour une route ou un exercice inconnu', async () => {
    assert.equal((await appeler('GET', '/api/inconnue')).statut, 404);
    const absent = await appeler('POST', '/api/rust/verifier', { chapitreId: '01-bases', exerciceId: '99-absent', code: '' });
    assert.equal(absent.statut, 404);
    const dangereux = await appeler('POST', '/api/rust/verifier', { chapitreId: '..', exerciceId: 'x', code: '' });
    assert.equal(dangereux.statut, 404);
  });

  it('exige du code', async () => {
    assert.equal((await appeler('POST', '/api/rust/executer', {})).statut, 400);
  });

  it('donne la version de Rust', { skip: sansRust }, async () => {
    assert.match((await appeler('GET', '/api/etat')).donnees.rust, /rustc/);
  });

  it('vérifie un exercice et exécute un programme', { skip: sansRust }, async () => {
    const echec = await appeler('POST', '/api/rust/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: CODE_DEPART });
    assert.equal(echec.donnees.statut, 'echec');
    const reussite = await appeler('POST', '/api/rust/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: CODE_SOLUTION });
    assert.equal(reussite.donnees.statut, 'reussi');
    const execution = await appeler('POST', '/api/rust/executer', { code: 'fn main() {\n    println!("Salut");\n}\n' });
    assert.equal(execution.donnees.sortie.trim(), 'Salut');
  });
});
