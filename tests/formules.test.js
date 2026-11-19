import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { protegerFormules } from '../js/outils.js';

describe('repérage des formules', () => {
  it('remplace une formule en ligne par un repère', () => {
    assert.deepEqual(protegerFormules('Soit $x^2$ un carré.'), {
      texte: 'Soit ⟦0⟧ un carré.',
      formules: [{ tex: 'x^2', enBloc: false }],
    });
  });

  it('reconnaît une formule en bloc $$…$$', () => {
    const { texte, formules } = protegerFormules('Avant\n$$\\sum_{k=1}^{n} k$$\nAprès');
    assert.equal(texte, 'Avant\n⟦0⟧\nAprès');
    assert.deepEqual(formules, [{ tex: '\\sum_{k=1}^{n} k', enBloc: true }]);
  });

  it('laisse un dollar qui n’est jamais fermé', () => {
    assert.deepEqual(protegerFormules('Ça coûte 5 $ seulement.'), { texte: 'Ça coûte 5 $ seulement.', formules: [] });
  });

  it('ne prend pas une formule qui passe à la ligne', () => {
    assert.deepEqual(protegerFormules('Prix : 5 $\net 6 $').formules, []);
  });

  it('garde un \\$ comme simple dollar', () => {
    assert.deepEqual(protegerFormules('Il paie \\$10 et \\$20.'), { texte: 'Il paie $10 et $20.', formules: [] });
  });

  it('ne touche pas au code en ligne qui contient des $', () => {
    assert.deepEqual(protegerFormules('Lance `echo $HOME` puis $y$.'), {
      texte: 'Lance `echo $HOME` puis ⟦0⟧.',
      formules: [{ tex: 'y', enBloc: false }],
    });
  });

  it('ne touche pas aux blocs de code ```', () => {
    const texte = 'Avant\n```bash\necho $PATH $HOME\n```\nAprès $z$';
    const resultat = protegerFormules(texte);
    assert.equal(resultat.texte, 'Avant\n```bash\necho $PATH $HOME\n```\nAprès ⟦0⟧');
    assert.deepEqual(resultat.formules, [{ tex: 'z', enBloc: false }]);
  });

  it('garde un bloc ``` jamais fermé tel quel', () => {
    const texte = '```\n$a$ et $b$';
    assert.deepEqual(protegerFormules(texte), { texte, formules: [] });
  });

  it('numérote les formules dans l’ordre', () => {
    const { texte, formules } = protegerFormules('$a$, $$b$$ et $c$');
    assert.equal(texte, '⟦0⟧, ⟦1⟧ et ⟦2⟧');
    assert.deepEqual(formules.map((formule) => formule.tex), ['a', 'b', 'c']);
  });
});
