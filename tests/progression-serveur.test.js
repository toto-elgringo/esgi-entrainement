import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { creerProgression } from '../serveur/progression.js';
import { creerDossierTemporaire, supprimerDossier } from './aide.js';

const exercice = (cle, faitLe = 1000) => ({ partie: 'exercices', cle, valeur: { essais: 1, reussi: true }, faitLe });

describe('progression sur le serveur', () => {
  let dossier;
  let fichier;
  let progression;

  before(async () => {
    dossier = await creerDossierTemporaire();
    fichier = path.join(dossier, 'sous-dossier', 'progression.json');
    progression = creerProgression(fichier);
  });

  after(() => supprimerDossier(dossier));

  it('lire sans fichier', async () => {
    const etat = await progression.lire();
    assert.equal(etat.existe, false);
    assert.deepEqual(etat.progression.exercices, {});
    assert.deepEqual(etat.supprimes, {});
  });

  it('appliquer puis relire', async () => {
    const { retenus } = await progression.appliquer([exercice('rust/un')]);
    assert.deepEqual(retenus, [{ partie: 'exercices', cle: 'rust/un', valeur: { essais: 1, reussi: true } }]);
    const brut = JSON.parse(await fs.readFile(fichier, 'utf8'));
    assert.equal(brut.format, 'esgi-entrainement');
    assert.equal(brut.version, 1);
    assert.equal(typeof brut.modifieLe, 'string');
    const etat = await progression.lire();
    assert.equal(etat.existe, true);
    assert.deepEqual(etat.progression.exercices['rust/un'], { essais: 1, reussi: true });
    assert.equal(etat.dates['exercices/rust/un'], 1000);
  });

  it('deux appels en même temps ne s’écrasent pas', async () => {
    await Promise.all([progression.appliquer([exercice('a')]), progression.appliquer([exercice('b')])]);
    const { progression: etat } = await progression.lire();
    assert.ok(etat.exercices.a);
    assert.ok(etat.exercices.b);
  });

  it('refuse une partie inconnue ou une clé dangereuse', async () => {
    const avant = await fs.readFile(fichier, 'utf8');
    const mauvais = [
      [{ partie: 'inconnue', cle: 'x', valeur: 1, faitLe: 1 }],
      [{ partie: 'saisies', cle: '__proto__', valeur: 1, faitLe: 1 }],
      [exercice('ok'), { partie: 'saisies', cle: 'x', valeur: 1 }],
      [],
      'texte',
      Array.from({ length: 2001 }, (_, i) => exercice(`c${i}`)),
    ];
    for (const changements of mauvais) {
      await assert.rejects(progression.appliquer(changements), (erreur) => erreur.statut === 400);
    }
    assert.equal(await fs.readFile(fichier, 'utf8'), avant);
  });

  it('une demande refusée ne bloque pas la suivante', async () => {
    await assert.rejects(progression.appliquer([]));
    const { retenus } = await progression.appliquer([exercice('apres')]);
    assert.equal(retenus.length, 1);
  });
});
