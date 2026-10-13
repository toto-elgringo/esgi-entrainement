import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { analyser, ErreurExpression, evaluer, versLatex } from '../js/maths/expression.js';

const calculer = (texte, x) => evaluer(analyser(texte, ['x']), { x });

describe('expression : lecture et calcul', () => {
  it('respecte les priorités des opérations', () => {
    assert.equal(calculer('2 + 3 * 4'), 14);
    assert.equal(calculer('(2 + 3) * 4'), 20);
    assert.equal(calculer('2^3^2'), 512);
    assert.equal(calculer('-2^2'), -4);
    assert.equal(calculer('2^-1'), 0.5);
  });

  it('comprend la multiplication sans étoile', () => {
    assert.equal(calculer('3x^2', 2), 12);
    assert.equal(calculer('2(x+1)', 3), 8);
    assert.equal(calculer('(x+1)(x-1)', 3), 8);
    assert.equal(calculer('2xlnx', Math.E), 2 * Math.E);
  });

  it('connaît les fonctions et les constantes', () => {
    assert.equal(calculer('ln(e^3)'), 3);
    assert.equal(calculer('log2(8)'), 3);
    assert.equal(calculer('log10(1000)'), 3);
    assert.equal(calculer('sqrt(16)'), 4);
    assert.equal(calculer('sin(pi/2)'), 1);
    assert.equal(calculer('5!'), 120);
    assert.equal(calculer('abs(-3)'), 3);
  });

  it('accepte une fonction sans parenthèses et les symboles unicode', () => {
    assert.equal(calculer('cos x', 0), 1);
    assert.equal(calculer('2×3'), 6);
    assert.equal(calculer('x²', 3), 9);
    assert.equal(calculer('2π'), 2 * Math.PI);
    assert.equal(calculer('√9'), 3);
  });

  it('accepte la virgule décimale et les espaces de milliers', () => {
    assert.equal(calculer('2,5 * 2'), 5);
    assert.equal(calculer('8 591'), 8591);
    assert.equal(calculer('1 000 000'), 1000000);
    assert.equal(calculer('6 963,38'), 6963.38);
    assert.throws(() => analyser('2 3', ['x']), /Deux nombres se suivent/);
  });

  it('refuse les écritures incompréhensibles', () => {
    assert.throws(() => analyser('2 +', ['x']), ErreurExpression);
    assert.throws(() => analyser('(2 + 3', ['x']), ErreurExpression);
    assert.throws(() => analyser('y + 1', ['x']), ErreurExpression);
    assert.throws(() => analyser('', ['x']), ErreurExpression);
    assert.throws(() => analyser('1.2.3', ['x']), ErreurExpression);
  });

  it('produit une écriture LaTeX lisible', () => {
    assert.equal(versLatex(analyser('1/3', [])), '\\frac{1}{3}');
    assert.equal(versLatex(analyser('e^(3x)', ['x'])), 'e^{3 \\times x}');
    assert.equal(versLatex(analyser('sqrt(2)', [])), '\\sqrt{2}');
    assert.equal(versLatex(analyser('2(x+1)', ['x'])), '2 \\times \\left(x + 1\\right)');
    assert.equal(versLatex(analyser('a - (b - c)'.replace(/[abc]/g, 'x'), ['x'])), 'x - \\left(x - x\\right)');
  });
});
