import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

let fichiers = {};
let appels = [];

globalThis.fetch = async (chemin) => {
  appels.push(chemin);
  const fichier = fichiers[chemin];
  if (fichier === undefined) return { ok: false, status: 404, json: async () => ({}), text: async () => '' };
  if (fichier instanceof Error) throw fichier;
  return {
    ok: true,
    status: 200,
    json: async () => (typeof fichier === 'string' ? JSON.parse(fichier) : structuredClone(fichier)),
    text: async () => (typeof fichier === 'string' ? fichier : JSON.stringify(fichier)),
  };
};

const { chargerCatalogue, chargerCours, chargerFichierCode, chargerQuiz, prechargerExercice } = await import('../js/catalogue.js');

beforeEach(() => {
  appels = [];
});

describe('catalogue', () => {
  it('charge chaque domaine en un seul appel au serveur', async () => {
    fichiers = {
      'api/sommaire/rust': {
        chapitres: [{ id: '01-bases', titre: 'Bases', source: 'cours', exercices: [{ id: '01-double', titre: 'Le double', difficulte: 1, type: 'tests', indices: [] }], nombreQuestions: 3 }],
      },
      'api/sommaire/maths': {
        matieres: [{ id: 'informatique', titre: 'Maths pour l’informatique' }],
        chapitres: [{ id: '01-ensembles', titre: 'Ensembles', matieres: ['informatique'], exercices: [{ id: 'e1', questions: [] }], nombreQuestions: 0 }],
      },
    };
    const catalogue = await chargerCatalogue();
    assert.ok(appels.every((chemin) => chemin.startsWith('api/sommaire/')));
    assert.equal(new Set(appels).size, appels.length);
    assert.deepEqual(catalogue.matieres.map((matiere) => matiere.id), ['informatique', 'rust']);
    const rust = catalogue.chapitres.find((chapitre) => chapitre.cle === 'rust/01-bases');
    assert.equal(rust.domaine, 'rust');
    assert.deepEqual(rust.matieres, ['rust']);
    assert.equal(rust.nombreQuestions, 3);
    assert.equal(rust.quiz, undefined);
    const maths = catalogue.chapitres.find((chapitre) => chapitre.cle === 'maths/01-ensembles');
    assert.deepEqual(maths.matieres, ['informatique']);
    assert.equal(maths.exercices.length, 1);
  });

  it('masque un domaine vide ou qui ne répond pas', async () => {
    fichiers = { 'api/sommaire/python': { chapitres: [] } };
    const catalogue = await chargerCatalogue();
    assert.deepEqual(catalogue, { matieres: [], chapitres: [] });
  });
});

describe('quiz à la demande', () => {
  const chapitre = { domaine: 'rust', id: '01-bases' };

  it('lit le quiz une seule fois et le garde en mémoire', async () => {
    fichiers = { 'contenu/rust/01-bases/quiz.json': [{ question: 'Q', choix: ['a', 'b'], reponse: 0 }] };
    const premier = await chargerQuiz(chapitre);
    const second = await chargerQuiz(chapitre);
    assert.equal(premier.length, 1);
    assert.equal(premier, second);
    assert.equal(appels.filter((chemin) => chemin.endsWith('quiz.json')).length, 1);
  });

  it('renvoie une liste vide quand le chapitre n’a pas de quiz', async () => {
    fichiers = {};
    assert.deepEqual(await chargerQuiz({ domaine: 'python', id: '09-sans-quiz' }), []);
  });

  it('réessaie après une coupure du serveur', async () => {
    const autre = { domaine: 'c', id: '02-coupure' };
    fichiers = { 'contenu/c/02-coupure/quiz.json': new TypeError('Failed to fetch') };
    await assert.rejects(chargerQuiz(autre));
    fichiers = { 'contenu/c/02-coupure/quiz.json': [{ question: 'Q', choix: ['a'], reponse: 0 }] };
    assert.equal((await chargerQuiz(autre)).length, 1);
  });
});

describe('cache des textes', () => {
  it('ne télécharge qu’une fois le même fichier, même demandé deux fois en même temps', async () => {
    fichiers = { 'contenu/rust/01-bases/cours.md': '# Bases' };
    const chapitre = { domaine: 'rust', id: '01-bases' };
    const [a, b] = await Promise.all([chargerCours(chapitre), chargerCours(chapitre)]);
    assert.equal(a, '# Bases');
    assert.equal(b, '# Bases');
    assert.equal(appels.length, 1);
  });

  it('oublie un fichier qui n’a pas pu être lu', async () => {
    fichiers = {};
    await assert.rejects(chargerFichierCode('rust', '01-bases', '01-double', 'enonce.md'));
    fichiers = { 'contenu/rust/01-bases/exercices/01-double/enonce.md': 'Écris double.' };
    assert.equal(await chargerFichierCode('rust', '01-bases', '01-double', 'enonce.md'), 'Écris double.');
  });

  it('précharge l’énoncé et le code de départ de l’exercice suivant', async () => {
    fichiers = {
      'contenu/python/01-bases/exercices/02-saluer/enonce.md': 'Salue.',
      'contenu/python/01-bases/exercices/02-saluer/depart.py': 'nom = input()\n',
    };
    await prechargerExercice({ chapitreCle: 'python/01-bases', id: '02-saluer' });
    assert.deepEqual(appels.sort(), Object.keys(fichiers).sort());
    appels = [];
    assert.equal(await chargerFichierCode('python', '01-bases', '02-saluer', 'depart.py'), 'nom = input()\n');
    assert.equal(appels.length, 0);
  });

  it('ne précharge rien pour un exercice à réponses', async () => {
    await prechargerExercice({ chapitreCle: 'maths/01-ensembles', id: 'e1' });
    assert.equal(appels.length, 0);
  });
});
