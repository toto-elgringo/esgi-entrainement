import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { lireAdresses } from '../serveur/reglages.js';

describe('réglages du serveur', () => {
  it('lit la liste des adresses permises', () => {
    assert.deepEqual(lireAdresses(' hermes, 100.75.25.89 ,,HERMES.tail8c471a.ts.net '), ['hermes', '100.75.25.89', 'hermes.tail8c471a.ts.net']);
  });

  it('renvoie une liste vide sans réglage', () => {
    assert.deepEqual(lireAdresses(undefined), []);
    assert.deepEqual(lireAdresses(''), []);
  });
});
