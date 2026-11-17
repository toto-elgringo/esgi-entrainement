import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { blocCode, htmlVersMarkdown } from '../serveur/schooding/markdown.js';
import { idVideo, lireCorrectionQcm, lireCours, lireDiaporama, lireDocumentMarkdown, lireExercice, lireJeton, lireSeance, lireSeances, lireSolution, pageDeConnexion, traduire } from '../serveur/schooding/pages.js';
import { pageAccueil, pageConnexion, pageCorrection, pageCours, pageDiaporama, pageDocumentMarkdown, pageExercice, pageSeance, pageSolution } from './aide-schooding.js';

describe('textes multilingues de Schooding', () => {
  it('choisit le français, sinon le texte par défaut', () => {
    assert.equal(traduire('Tris rapides 1$TR$fr Tri fusion'), 'Tri fusion');
    assert.equal(traduire('$TR$fr Python'), 'Python');
    assert.equal(traduire('Algo Avancée'), 'Algo Avancée');
    assert.equal(traduire('Hello$TR$en Hi'), 'Hello');
    assert.equal(traduire(''), '');
  });
});

describe('pages de Schooding', () => {
  it('reconnaît la page de connexion et lit le jeton', () => {
    assert.equal(pageDeConnexion(pageConnexion()), true);
    assert.equal(pageDeConnexion(pageAccueil()), false);
    assert.equal(lireJeton(pageConnexion()), 'jeton-csrf-123');
  });

  it('lit les cours de l’accueil sans doublon', () => {
    assert.deepEqual(lireCours(pageAccueil()), [{ id: '1', nom: 'Python' }, { id: '2', nom: 'Algo Avancée' }]);
    assert.throws(() => lireCours('<html></html>'), { code: 'reponse_inattendue' });
  });

  it('lit les séances et repère les examens passés', () => {
    assert.deepEqual(lireSeances(pageCours('1')), [
      { id: '11', numero: 1, titre: 'Les bases', examen: false },
      { id: '12', numero: 2, titre: 'Fonctions', examen: false },
      { id: '13', numero: null, titre: 'QCM de rentrée', examen: true },
    ]);
    assert.throws(() => lireSeances('<html></html>'), { code: 'reponse_inattendue' });
  });

  it('lit une séance : description, documents et exercices par catégorie', () => {
    const seance = lireSeance(pageSeance('11'));
    assert.equal(seance.titre, 'Les bases');
    assert.equal(seance.verrouillee, false);
    assert.match(seance.description, /<b>les bases<\/b>/);
    assert.deepEqual(seance.documents, [
      { id: '101', titre: 'Cours : les variables' },
      { id: '102', titre: 'Vidéo : l\'affectation' },
      { id: '103', titre: 'Diapos de base' },
    ]);
    assert.deepEqual(seance.exercices.map(({ id, categorie, solution, indice }) => ({ id, categorie, solution, indice })), [
      { id: '201', categorie: 'Exercices', solution: '/codingtest/solution/exocourse/201/1/?headless=1&minimal=1', indice: 'text-success|sentiment_very_satisfied' },
      { id: '202', categorie: 'Devoirs Maison', solution: null, indice: 'text-danger|sentiment_dissatisfied' },
    ]);
    assert.equal(seance.exercices[0].adresse, '/codingtest/201/?next=/session/11/&session=11');
  });

  it('repère une séance verrouillée et la correction d’un QCM', () => {
    assert.equal(lireSeance(pageSeance('12')).verrouillee, true);
    const [correction] = lireSeance(pageSeance('13')).exercices;
    assert.equal(correction.type, 'correction');
    assert.equal(correction.adresse, '/lastresult/9/301?headless=1&minimal=1');
    assert.equal(correction.indice, '50% pour 1 point(s)');
  });

  it('lit un exercice : énoncé, code, historique et outils', () => {
    const exercice = lireExercice(pageExercice('203', { code: 'int main() {\r\n  return "<ok>";\r\n}' }));
    assert.equal(exercice.titre, 'Minimum d’un tableau');
    assert.match(exercice.enonce, /travail demandé/);
    assert.match(exercice.enonce, /cas limites/);
    assert.doesNotMatch(exercice.enonce, /\$TR\$/);
    assert.equal(exercice.code, 'int main() {\r\n  return "<ok>";\r\n}');
    assert.equal(exercice.mode, 'c_cpp');
    assert.equal(exercice.commence, true);
    assert.deepEqual(exercice.historique.map((essai) => essai.progression), [50, 100]);
    assert.deepEqual(exercice.outils, [{ nom: 'void debug(value)', description: 'Affiche la valeur sur la sortie d\'erreur.' }]);
    assert.equal(lireExercice(pageExercice('201', { historique: false })).commence, false);
    assert.throws(() => lireExercice('<html></html>'), { code: 'reponse_inattendue' });
  });

  it('lit la solution officielle', () => {
    assert.deepEqual(lireSolution(pageSolution()), { code: 'def somme(a, b):\r\n    return a + b  # officielle', mode: 'python' });
    assert.equal(lireSolution('<html></html>'), null);
  });

  it('retrouve les bonnes réponses d’un QCM corrigé', () => {
    const { titre, questions } = lireCorrectionQcm(pageCorrection());
    assert.equal(titre, 'QCM Python');
    assert.equal(questions.length, 2);
    assert.deepEqual(questions[0].choix, [{ texte: '3', coche: true, bonne: true }, { texte: '2', coche: false, bonne: false }]);
    assert.deepEqual(questions[1].choix, [{ texte: 'tuple', coche: true, bonne: false }, { texte: 'list', coche: false, bonne: true }, { texte: 'str', coche: false, bonne: false }]);
    assert.throws(() => lireCorrectionQcm('<html></html>'), { code: 'reponse_inattendue' });
  });

  it('lit un document Markdown', () => {
    assert.equal(lireDocumentMarkdown(pageDocumentMarkdown()), '## Les variables\nUne variable **nomme** une valeur.\n\n```python\nx = 1\n```');
    assert.equal(lireDocumentMarkdown('<html></html>'), null);
  });

  it('lit le texte et le SVG de chaque diapo', () => {
    const { titre, diapos } = lireDiaporama(pageDiaporama());
    assert.equal(titre, 'Cours de base');
    assert.deepEqual(diapos.map((diapo) => diapo.texte), ['Python\nNotions de base', 'Les listes\nUne liste est modifiable']);
    assert.match(diapos[0].svg, /^<svg viewBox="0 0 960 540">/);
    assert.equal(lireDiaporama('<html></html>'), null);
  });

  it('reconnaît les vidéos YouTube', () => {
    assert.equal(idVideo('https://www.youtube.com/embed/AbC-12_x?si=z'), 'AbC-12_x');
    assert.equal(idVideo('https://youtu.be/AbC'), 'AbC');
    assert.equal(idVideo('https://www.youtube.com/watch?v=XyZ'), 'XyZ');
    assert.equal(idVideo('https://docs.google.com/presentation/d/e/x'), null);
  });
});

describe('conversion en Markdown', () => {
  it('garde les blocs de code, le gras et les listes', () => {
    const markdown = htmlVersMarkdown('<p>Lire un <b>entier</b> avec <code>input</code>&nbsp;:</p><pre>1 x 2 = 2\n2 x 2 = 4</pre><ul><li>un</li><li>deux &lt;3</li></ul>');
    assert.equal(markdown, 'Lire un **entier** avec `input` :\n\n```\n1 x 2 = 2\n2 x 2 = 4\n```\n\n- un\n- deux <3');
  });

  it('protège un code qui contient déjà des ```', () => {
    assert.equal(blocCode('a\r\n```\nb\n'), '````\na\n```\nb\n````');
    assert.equal(blocCode('x = 1', 'python'), '```python\nx = 1\n```');
  });
});
