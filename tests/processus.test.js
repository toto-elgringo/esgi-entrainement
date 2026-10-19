import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { analyserBilan, creerVerificateurs, retirerBilan } from '../serveur/processus.js';

describe('processus : bilans et vérifications communes', () => {
  it('lit et retire la ligne de bilan des tests', () => {
    const sortie = '✓ test_a\n✗ test_b : raté\nRESULTAT 1 1\n';
    assert.deepEqual(analyserBilan(sortie), { reussis: 1, echoues: 1 });
    assert.equal(retirerBilan(sortie), '✓ test_a\n✗ test_b : raté');
    assert.equal(analyserBilan('rien'), null);
  });

  it('choisit la vérification selon le type de l’exercice', async () => {
    const appels = [];
    const executerProgramme = async (code, entree) => {
      appels.push(['executer', code, entree]);
      return { statut: 'execute', sortie: 'Bonjour  \r\n' };
    };
    const verifierAvecTests = async (code, tests) => {
      appels.push(['tests', code, tests]);
      return { statut: 'reussi' };
    };
    const { verifierExercice } = creerVerificateurs(executerProgramme, verifierAvecTests);

    const sortie = await verifierExercice({ type: 'sortie', sortieAttendue: 'Bonjour\n', entree: 'x' }, 'code');
    assert.equal(sortie.statut, 'reussi');
    await verifierExercice({ type: 'tests', tests: 'mes tests' }, 'code');
    assert.deepEqual(appels, [['executer', 'code', 'x'], ['tests', 'code', 'mes tests']]);
  });

  it('transforme un plantage en échec pour un exercice de type sortie', async () => {
    const { verifierSortie } = creerVerificateurs(async () => ({ statut: 'erreur_execution', sortie: 'boum' }), null);
    assert.equal((await verifierSortie('code', 'attendu')).statut, 'echec');
  });
});
