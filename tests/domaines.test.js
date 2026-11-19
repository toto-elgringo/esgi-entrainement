import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { avecFormules, DOMAINES_CODE, estDomaineCode, langageDe, LANGAGES, langueDe, PRESENTATIONS_MATIERES, presentationMatiere, trierMatieres } from '../js/domaines.js';

describe('domaines', () => {
  it('chaque domaine de code a un langage', () => {
    for (const domaine of Object.keys(DOMAINES_CODE)) assert.ok(LANGAGES[langageDe(domaine)], domaine);
  });

  it('distingue les domaines de code des domaines à réponses', () => {
    assert.equal(estDomaineCode('python'), true);
    assert.equal(estDomaineCode('maths'), false);
    assert.equal(estDomaineCode('toString'), false);
  });

  it('active les formules seulement là où il y a des maths', () => {
    assert.equal(avecFormules('maths'), true);
    assert.equal(avecFormules('anglais'), false);
    assert.equal(avecFormules('rust'), false);
  });

  it('range les matières dans l’ordre prévu, les inconnues à la fin', () => {
    const triees = trierMatieres([{ id: 'inconnue' }, { id: 'rust' }, { id: 'informatique' }]);
    assert.deepEqual(triees.map((matiere) => matiere.id), ['informatique', 'rust', 'inconnue']);
  });

  it('Rust avancé utilise le langage Rust', () => {
    assert.equal(langageDe('rust-avance'), 'rust');
    assert.equal(langageDe('c'), 'c');
  });
});

describe('présentation des matières', () => {
  it('chaque matière connue a une icône, une couleur et un texte', () => {
    for (const [id, presentation] of Object.entries(PRESENTATIONS_MATIERES)) {
      assert.ok(presentation.icone, id);
      assert.match(presentation.couleur, /^#[0-9a-f]{6}$/i, id);
      assert.ok(presentation.texte, id);
    }
    for (const { matiere } of Object.values(DOMAINES_CODE)) assert.ok(PRESENTATIONS_MATIERES[matiere.id], matiere.id);
  });

  it('donne une présentation neutre pour une matière inconnue', () => {
    assert.equal(presentationMatiere('inconnue').icone, '?');
  });

  it('décrit tout le programme d’Algo avancée', () => {
    for (const sujet of ['tableaux', 'complexité', 'tris simples', 'fusion', 'rapide', 'tas', 'piles', 'files', 'listes chaînées']) {
      assert.match(presentationMatiere('algo-avancee').texte, new RegExp(sujet), sujet);
    }
  });

  it('le cours d’anglais est marqué en anglais', () => {
    assert.equal(langueDe('anglais'), 'en');
    assert.equal(langueDe('maths'), null);
  });
});
