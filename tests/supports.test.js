import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { cheminSupportSur, lienSupport, supportsDeChapitre, typeSupport, validerSupports } from '../js/supports.js';

describe('supports originaux', () => {
  it('reconnaît les PDF et les pages HTML', () => {
    assert.equal(typeSupport('Rust/Sources/Slides.PDF'), 'PDF');
    assert.equal(typeSupport('Rust/Sources/[Slides] Ownership.html'), 'Interactif');
    assert.equal(typeSupport('Anglais/Sources/tips.docx'), null);
  });

  it('refuse les chemins qui sortent du dossier des cours', () => {
    assert.equal(cheminSupportSur('Rust/Sources/Slides.pdf'), true);
    assert.equal(cheminSupportSur('../secret.pdf'), false);
    assert.equal(cheminSupportSur('/etc/secret.pdf'), false);
    assert.equal(cheminSupportSur('C:/secret.pdf'), false);
    assert.equal(cheminSupportSur('Rust\\Sources\\a.pdf'), false);
    assert.equal(cheminSupportSur(''), false);
  });

  it('encode chaque partie du lien', () => {
    assert.equal(lienSupport("Maths pour l'informatique/Sources/Cours 1.pdf"), "supports/Maths%20pour%20l'informatique/Sources/Cours%201.pdf");
    assert.equal(lienSupport('Rust/Sources/[Slides] Premiers pas.html'), 'supports/Rust/Sources/%5BSlides%5D%20Premiers%20pas.html');
  });

  it('garde seulement les supports de la matière choisie', () => {
    const chapitre = {
      supports: [
        { titre: 'Cours', fichier: 'a.pdf' },
        { titre: 'Correction', fichier: 'b.pdf', matieres: ['big-data'] },
      ],
    };
    assert.deepEqual(supportsDeChapitre(chapitre, 'informatique').map((support) => support.titre), ['Cours']);
    assert.deepEqual(supportsDeChapitre(chapitre, 'big-data').map((support) => support.titre), ['Cours', 'Correction']);
    assert.deepEqual(supportsDeChapitre({}, 'rust'), []);
  });

  it('signale les supports mal écrits', () => {
    assert.deepEqual(validerSupports(undefined), []);
    assert.deepEqual(validerSupports([{ titre: 'Slides', fichier: 'Rust/Sources/Slides.pdf' }]), []);
    assert.equal(validerSupports('a.pdf').length, 1);
    const problemes = validerSupports([{ fichier: '../a.pdf' }, { titre: 'Word', fichier: 'a.docx', matieres: 'rust' }]);
    assert.equal(problemes.length, 4);
  });
});
