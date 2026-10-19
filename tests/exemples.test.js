import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { preparerExemple } from '../js/code/exemples.js';

describe('exemples du cours en Rust', () => {
  it('garde un programme qui a déjà une fonction main', () => {
    const code = 'fn main() {\n    println!("Salut");\n}\n\n\n';
    assert.equal(preparerExemple(code, 'rust'), 'fn main() {\n    println!("Salut");\n}\n');
  });

  it('entoure un morceau de code d’une fonction main', () => {
    assert.equal(
      preparerExemple('let x = 1;\nprintln!("{x}");\n', 'rust'),
      'fn main() {\n    let x = 1;\n    println!("{x}");\n}\n',
    );
  });

  it('n’indente pas les lignes vides', () => {
    assert.equal(preparerExemple('let a = 1;\n\nlet b = 2;', 'rust'), 'fn main() {\n    let a = 1;\n\n    let b = 2;\n}\n');
  });

  it('garde les fonctions et structures dans la fonction main', () => {
    const code = 'struct Point {\n    x: i32,\n}\n\nlet p = Point { x: 1 };';
    assert.equal(preparerExemple(code, 'rust'), 'fn main() {\n    struct Point {\n        x: i32,\n    }\n\n    let p = Point { x: 1 };\n}\n');
  });

  it('ne se laisse pas tromper par une fonction qui s’appelle main_bis', () => {
    assert.match(preparerExemple('fn main_bis() {}', 'rust'), /^fn main\(\) \{\n {4}fn main_bis/);
  });
});

describe('exemples du cours en Python et en C', () => {
  it('lance un exemple Python tel quel', () => {
    assert.equal(preparerExemple('\r\nx = 1\r\nprint(x)\r\n\n', 'python'), 'x = 1\nprint(x)\n');
  });

  it('garde un programme C complet', () => {
    const code = '#include <stdio.h>\n\nint main(void) {\n    return 0;\n}\n';
    assert.equal(preparerExemple(code, 'c'), code);
  });

  it('ne propose pas d’essayer un morceau de C sans main', () => {
    assert.equal(preparerExemple('typedef struct cell {\n    int value;\n} Cell;', 'c'), null);
  });
});
