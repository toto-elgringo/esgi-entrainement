import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { avecFormules, DOMAINES_CODE, estDomaineCode, LANGAGES, trierMatieres } from '../js/domaines.js';

describe('domaines', () => {
  it('chaque domaine de code a un langage', () => {
    for (const domaine of Object.keys(DOMAINES_CODE)) assert.ok(LANGAGES[domaine], domaine);
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
});
