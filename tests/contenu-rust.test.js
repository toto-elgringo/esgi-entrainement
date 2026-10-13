import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import * as contenu from '../serveur/contenu-rust.js';
import { CODE_DEPART, creerContenuExemple, creerDossierTemporaire, supprimerDossier } from './aide.js';

describe('contenu Rust', () => {
  let racine;
  let dossierContenu;

  before(async () => {
    racine = await creerDossierTemporaire();
    dossierContenu = await creerContenuExemple(racine);
  });

  after(() => supprimerDossier(racine));

  it('accepte seulement les identifiants en minuscules, chiffres et tirets', () => {
    assert.equal(contenu.idValide('02-premiers-pas'), true);
    assert.equal(contenu.idValide('../secret'), false);
    assert.equal(contenu.idValide('Dossier_Invalide'), false);
    assert.equal(contenu.idValide(undefined), false);
  });

  it('construit le sommaire dans l’ordre en ignorant les dossiers invalides', async () => {
    const { chapitres } = await contenu.construireSommaire(dossierContenu);
    assert.deepEqual(chapitres.map((chapitre) => chapitre.id), ['01-bases', '02-vide']);
    assert.equal(chapitres[0].source, 'cours');
    assert.equal(chapitres[0].quiz.length, 1);
    assert.deepEqual(chapitres[0].exercices[0], {
      id: '01-double',
      titre: 'Le double',
      difficulte: 1,
      type: 'tests',
      indices: ['Multiplie par 2'],
    });
    assert.deepEqual(chapitres[1].exercices, []);
  });

  it('lit un exercice complet', async () => {
    const exercice = await contenu.lireExercice(dossierContenu, '01-bases', '01-double');
    assert.equal(exercice.type, 'tests');
    assert.equal(exercice.depart, CODE_DEPART);
    assert.match(exercice.tests, /mod tests/);
    assert.equal(exercice.sortieAttendue, null);
  });

  it('lit la sortie attendue d’un exercice de type sortie', async () => {
    const exercice = await contenu.lireExercice(dossierContenu, '01-bases', '02-bonjour');
    assert.equal(exercice.sortieAttendue, 'Bonjour\n');
  });

  it('refuse les chemins dangereux et les contenus absents', async () => {
    await assert.rejects(contenu.lireExercice(dossierContenu, '..', '01-double'), contenu.ContenuIntrouvable);
    await assert.rejects(contenu.lireExercice(dossierContenu, '01-bases', '99-absent'), contenu.ContenuIntrouvable);
    await assert.rejects(contenu.lireCours(dossierContenu, '02-vide'), contenu.ContenuIntrouvable);
  });
});
