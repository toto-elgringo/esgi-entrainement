import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { outilsC } from '../serveur/c.js';
import { outilsPython } from '../serveur/python.js';
import { outilsRust } from '../serveur/rust.js';
import { creerServeur } from '../serveur/serveur.js';
import { C_DEPART, C_SOLUTION, CODE_DEPART, CODE_SOLUTION, creerContenuExemple, creerDossierTemporaire, PYTHON_DEPART, PYTHON_SOLUTION, supprimerDossier } from './aide.js';

const outils = await outilsRust();
const sansRust = outils.cargo ? false : 'cargo n’est pas installé';
const sansPython = (await outilsPython()).python ? false : 'Python 3 n’est pas installé';
const sansGcc = (await outilsC()).gcc ? false : 'gcc n’est pas installé';

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
    await creerContenuExemple(racine);
    serveur = creerServeur({ racine, dossierContenu: path.join(racine, 'contenu') });
    await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre));
    adresse = `http://127.0.0.1:${serveur.address().port}`;
  });

  after(async () => {
    await new Promise((resoudre) => serveur.close(resoudre));
    await supprimerDossier(racine);
  });

  it('sert la page d’accueil et les fichiers du contenu', async () => {
    assert.match((await appeler('GET', '/')).donnees, /Accueil/);
    const depart = await appeler('GET', '/contenu/rust/01-bases/exercices/01-double/depart.rs');
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

  it('donne les versions de cargo et de clippy', { skip: sansRust }, async () => {
    const { donnees } = await appeler('GET', '/api/etat');
    assert.match(donnees.cargo, /cargo/);
    assert.equal(donnees.clippy, outils.clippy);
  });

  it('vérifie un exercice et exécute un programme', { skip: sansRust }, async () => {
    const echec = await appeler('POST', '/api/rust/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: CODE_DEPART });
    assert.equal(echec.donnees.statut, 'echec');
    const reussite = await appeler('POST', '/api/rust/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: CODE_SOLUTION });
    assert.equal(reussite.donnees.statut, 'reussi');
    const execution = await appeler('POST', '/api/rust/executer', { code: 'fn main() {\n    println!("Salut");\n}\n' });
    assert.equal(execution.donnees.sortie.trim(), 'Salut');
  });

  it('refuse un langage inconnu', async () => {
    assert.equal((await appeler('POST', '/api/cobol/executer', { code: '' })).statut, 404);
  });

  it('vérifie un exercice Python, avec une entrée pour un exercice de type sortie', { skip: sansPython }, async () => {
    const echec = await appeler('POST', '/api/python/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: PYTHON_DEPART });
    assert.equal(echec.donnees.statut, 'echec');
    const reussite = await appeler('POST', '/api/python/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: PYTHON_SOLUTION });
    assert.equal(reussite.donnees.statut, 'reussi');
    const salut = await appeler('POST', '/api/python/verifier', { chapitreId: '01-bases', exerciceId: '02-saluer', code: 'nom = input()\nprint(f"Bonjour {nom}")\n' });
    assert.equal(salut.donnees.statut, 'reussi');
    const execution = await appeler('POST', '/api/python/executer', { code: 'print(input() * 2)\n', entree: 'ab' });
    assert.equal(execution.donnees.sortie.trim(), 'abab');
  });

  it('vérifie un exercice C', { skip: sansGcc }, async () => {
    const echec = await appeler('POST', '/api/c/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: C_DEPART });
    assert.equal(echec.donnees.statut, 'echec');
    const reussite = await appeler('POST', '/api/c/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: C_SOLUTION });
    assert.equal(reussite.donnees.statut, 'reussi');
  });

  it('donne l’état de tous les outils', async () => {
    const { donnees } = await appeler('GET', '/api/etat');
    assert.deepEqual(Object.keys(donnees).sort(), ['cargo', 'clippy', 'gcc', 'python']);
  });
});
