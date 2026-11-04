import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SURBRILLANCE_OCCURRENCES } from '../js/code/editeur.js';

describe('surbrillance des occurrences', () => {
  it('surligne toute sélection, même d’un seul caractère ou de plusieurs mots', () => {
    assert.equal(SURBRILLANCE_OCCURRENCES.minChars, 1);
    assert.notEqual(SURBRILLANCE_OCCURRENCES.wordsOnly, true);
  });

  it('ne surligne rien quand il n’y a pas de sélection', () => {
    assert.equal(SURBRILLANCE_OCCURRENCES.showToken, false);
  });
});
