import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import * as contenu from '../serveur/contenu-code.js';
import { CODE_DEPART, creerContenuExemple, creerDossierTemporaire, supprimerDossier } from './aide.js';

describe('contenu des exercices de code', () => {
  let racine;
  let dossierContenu;

  before(async () => {
    racine = await creerDossierTemporaire();
    dossierContenu = (await creerContenuExemple(racine)).rust;
  });

  after(() => supprimerDossier(racine));

  it('accepte seulement les identifiants en minuscules, chiffres et tirets', () => {
    assert.equal(contenu.idValide('02-premiers-pas'), true);
    assert.equal(contenu.idValide('../secret'), false);
    assert.equal(contenu.idValide('Dossier_Invalide'), false);
    assert.equal(contenu.idValide(undefined), false);
  });

  it('construit le sommaire dans l’ordre en ignorant les dossiers invalides', async () => {
    const { chapitres } = await contenu.construireSommaire(dossierContenu, 'rust');
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
    const exercice = await contenu.lireExercice(dossierContenu, 'rust', '01-bases', '01-double');
    assert.equal(exercice.type, 'tests');
    assert.equal(exercice.depart, CODE_DEPART);
    assert.match(exercice.tests, /mod tests/);
    assert.equal(exercice.sortieAttendue, null);
  });

  it('lit la sortie attendue d’un exercice de type sortie', async () => {
    const exercice = await contenu.lireExercice(dossierContenu, 'rust', '01-bases', '02-bonjour');
    assert.equal(exercice.sortieAttendue, 'Bonjour\n');
  });

  it('refuse les chemins dangereux et les contenus absents', async () => {
    await assert.rejects(contenu.lireExercice(dossierContenu, 'rust', '..', '01-double'), contenu.ContenuIntrouvable);
    await assert.rejects(contenu.lireExercice(dossierContenu, 'rust', '01-bases', '99-absent'), contenu.ContenuIntrouvable);
    await assert.rejects(contenu.lireCours(dossierContenu, '02-vide'), contenu.ContenuIntrouvable);
  });

  it('donne le nombre de questions au lieu du quiz dans le sommaire de l’API', async () => {
    const { chapitres } = await contenu.sommaireDomaineCode(dossierContenu, 'rust');
    assert.equal(chapitres[0].nombreQuestions, 1);
    assert.equal('quiz' in chapitres[0], false);
    assert.equal(chapitres[1].nombreQuestions, 0);
  });

  it('refuse un domaine inconnu', async () => {
    await assert.rejects(contenu.sommaireDomaine(path.join(racine, 'contenu'), 'cobol'), contenu.ContenuIntrouvable);
    await assert.rejects(contenu.sommaireDomaine(path.join(racine, 'contenu'), '__proto__'), contenu.ContenuIntrouvable);
  });
});

describe('sommaire d’un domaine à réponses', () => {
  let racine;
  let dossier;

  before(async () => {
    racine = await creerDossierTemporaire();
    dossier = path.join(racine, 'anglais');
    await fs.mkdir(path.join(dossier, '01-a'), { recursive: true });
    await fs.mkdir(path.join(dossier, '02-casse'), { recursive: true });
    await fs.mkdir(path.join(dossier, '03-sans-exercices'), { recursive: true });
    await fs.writeFile(path.join(dossier, 'programme.json'), JSON.stringify({ matieres: [{ id: 'anglais', titre: 'Anglais' }], chapitres: ['03-sans-exercices', '01-a', '02-casse', '04-absent'] }));
    await fs.writeFile(path.join(dossier, '01-a', 'chapitre.json'), JSON.stringify({ titre: 'A', matieres: ['anglais'] }));
    await fs.writeFile(path.join(dossier, '01-a', 'exercices.json'), JSON.stringify([{ id: 'x' }]));
    await fs.writeFile(path.join(dossier, '01-a', 'quiz.json'), JSON.stringify([{}, {}, {}]));
    await fs.writeFile(path.join(dossier, '02-casse', 'chapitre.json'), '{ pas du json');
    await fs.writeFile(path.join(dossier, '03-sans-exercices', 'chapitre.json'), JSON.stringify({ titre: 'C' }));
  });

  after(() => supprimerDossier(racine));

  it('suit l’ordre du programme et ignore les chapitres illisibles', async () => {
    const sommaire = await contenu.sommaireDomaineReponses(dossier);
    assert.deepEqual(sommaire.matieres, [{ id: 'anglais', titre: 'Anglais' }]);
    assert.deepEqual(sommaire.chapitres, [
      { titre: 'C', id: '03-sans-exercices', exercices: [], nombreQuestions: 0 },
      { titre: 'A', matieres: ['anglais'], id: '01-a', exercices: [{ id: 'x' }], nombreQuestions: 3 },
    ]);
  });

  it('renvoie un sommaire vide sans programme', async () => {
    assert.deepEqual(await contenu.sommaireDomaineReponses(path.join(racine, 'absent')), { matieres: [], chapitres: [] });
  });

  it('garde le sommaire en mémoire et le recalcule après un changement', async () => {
    let surChangement;
    const sommaires = contenu.creerSommaires(racine, { surveiller: (_, rappel) => { surChangement = rappel; return { close() {} }; } });
    const premier = await sommaires.lire('anglais');
    await fs.writeFile(path.join(dossier, '01-a', 'chapitre.json'), JSON.stringify({ titre: 'A modifié', matieres: ['anglais'] }));
    assert.equal(await sommaires.lire('anglais'), premier);
    surChangement();
    assert.equal((await sommaires.lire('anglais')).chapitres[1].titre, 'A modifié');
    sommaires.fermer();
  });

  it('relit le contenu à chaque fois quand la surveillance est impossible', async () => {
    const sommaires = contenu.creerSommaires(racine, { surveiller: () => null });
    assert.equal(sommaires.enCache, false);
    const premier = await sommaires.lire('anglais');
    assert.notEqual(await sommaires.lire('anglais'), premier);
    sommaires.fermer();
  });
});
