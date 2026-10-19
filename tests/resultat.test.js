import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resultatAEnregistrer } from '../js/code/resultat.js';

describe('résultat enregistré', () => {
  it('garde le dernier résultat tel quel', () => {
    const resultat = { statut: 'echec', sortie: 'Bonjour', attendu: 'Salut', resume: { reussis: 1, echoues: 2 } };
    assert.deepEqual(resultatAEnregistrer(resultat), resultat);
  });

  it('coupe une sortie trop longue', () => {
    const enregistre = resultatAEnregistrer({ statut: 'execute', sortie: 'x'.repeat(100000) });
    assert.ok(enregistre.sortie.length < 25000);
    assert.ok(enregistre.sortie.endsWith('…'));
  });

  it('n’enregistre pas une panne passagère', () => {
    assert.equal(resultatAEnregistrer({ statut: 'erreur_plateforme', sortie: 'Serveur arrêté' }), null);
    assert.equal(resultatAEnregistrer({ statut: 'outil_introuvable', sortie: '' }), null);
  });
});
