import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { terminalVersHtml } from '../js/code/terminal.js';

const ESC = '\x1b';

describe('couleurs du terminal', () => {
  it('échappe le HTML', () => {
    assert.equal(terminalVersHtml('a < b && c'), 'a &lt; b &amp;&amp; c');
  });

  it('transforme le gras et les couleurs en classes', () => {
    const texte = `${ESC}[1m${ESC}[91merror[E0308]${ESC}[0m${ESC}[1m: types${ESC}[0m fin`;
    assert.equal(
      terminalVersHtml(texte),
      '<span class="ansi-gras ansi-rouge">error[E0308]</span><span class="ansi-gras">: types</span> fin',
    );
  });

  it('reconnaît les couleurs normales et claires', () => {
    assert.equal(terminalVersHtml(`${ESC}[33ma${ESC}[96mb${ESC}[39mc`), '<span class="ansi-jaune">a</span><span class="ansi-cyan">b</span>c');
  });

  it('ignore les codes inconnus', () => {
    assert.equal(terminalVersHtml(`${ESC}[2Kok ${ESC}[38;5;196mrouge${ESC}[0m`), 'ok rouge');
  });

  it('accepte un texte vide', () => {
    assert.equal(terminalVersHtml(), '');
  });
});
