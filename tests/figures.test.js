import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { cheminImage, estCheminRelatif, imagesDuCours } from '../js/figures.js';

const chapitre = { domaine: 'combinatoire', id: '03-metaheuristiques-et-recherche-locale' };

describe('captures des cours', () => {
  it('reconnaît un chemin relatif', () => {
    assert.equal(estCheminRelatif('images/cubes.webp'), true);
    assert.equal(estCheminRelatif('https://exemple.fr/a.png'), false);
    assert.equal(estCheminRelatif('data:image/png;base64,AAA'), false);
    assert.equal(estCheminRelatif('/contenu/a.png'), false);
    assert.equal(estCheminRelatif(''), false);
  });

  it('place une image relative dans le dossier du chapitre', () => {
    assert.equal(cheminImage('images/cubes.webp', chapitre), 'contenu/combinatoire/03-metaheuristiques-et-recherche-locale/images/cubes.webp');
    assert.equal(cheminImage('./images/cubes.webp', chapitre), 'contenu/combinatoire/03-metaheuristiques-et-recherche-locale/images/cubes.webp');
  });

  it('suit les « .. » sans sortir du contenu', () => {
    assert.equal(cheminImage('../commun/a.webp', chapitre), 'contenu/combinatoire/commun/a.webp');
  });

  it('laisse une adresse absolue telle quelle', () => {
    assert.equal(cheminImage('https://exemple.fr/a.png', chapitre), 'https://exemple.fr/a.png');
  });

  it('liste les images relatives du cours', () => {
    const markdown = [
      '![Les cubes](images/cubes.webp "Le casse-tête des 27 cubes")',
      'Texte ![petit](images/icone.png) en ligne.',
      '![web](https://exemple.fr/a.png)',
      '```md\n![dans du code](images/pas-moi.png)\n```',
      '`![en ligne](images/pas-moi-non-plus.png)`',
    ].join('\n\n');
    assert.deepEqual(imagesDuCours(markdown), ['images/cubes.webp', 'images/icone.png']);
  });
});
