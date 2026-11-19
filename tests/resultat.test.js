import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rendreResultat, resultatAEnregistrer, TAILLE_MAX_AFFICHEE } from '../js/code/resultat.js';

describe('résultat enregistré', () => {
  it('garde le dernier résultat tel quel', () => {
    const resultat = { statut: 'echec', sortie: 'Bonjour', attendu: 'Salut', resume: { reussis: 1, echoues: 2 } };
    assert.deepEqual(resultatAEnregistrer(resultat), resultat);
  });

  it('coupe chaque texte trop long à 4 000 caractères', () => {
    const enregistre = resultatAEnregistrer({ statut: 'execute', sortie: 'x'.repeat(100000), avertissements: 'a'.repeat(5000) });
    assert.ok(enregistre.sortie.length <= 4002);
    assert.ok(enregistre.sortie.endsWith('…'));
    assert.ok(enregistre.avertissements.length <= 4002);
  });

  it('garde au plus 20 tests, les ratés en priorité', () => {
    const tests = Array.from({ length: 30 }, (_, rang) => ({ nom: `t${rang}`, reussi: rang !== 25, obtenu: 'o'.repeat(6000) }));
    const enregistre = resultatAEnregistrer({ statut: 'echec', sortie: '', tests });
    assert.equal(enregistre.tests.length, 20);
    assert.ok(enregistre.tests.some((test) => test.nom === 't25'));
    assert.ok(enregistre.tests.every((test) => test.obtenu.length <= 4002));
    assert.equal(tests[0].obtenu.length, 6000);
  });

  it('n’enregistre pas une panne passagère', () => {
    assert.equal(resultatAEnregistrer({ statut: 'erreur_plateforme', sortie: 'Serveur arrêté' }), null);
    assert.equal(resultatAEnregistrer({ statut: 'outil_introuvable', sortie: '' }), null);
    assert.equal(resultatAEnregistrer({ statut: 'lancement_bloque', sortie: 'os error 4551' }), null);
  });
});

describe('résultat affiché', () => {
  it('coupe une sortie trop longue à l’écran', () => {
    const { html } = rendreResultat({ statut: 'execute', sortie: 'y'.repeat(TAILLE_MAX_AFFICHEE + 500) }, { langage: 'python' });
    assert.match(html, /… \(sortie coupée\)/);
    assert.ok(html.length < TAILLE_MAX_AFFICHEE + 2000);
  });

  it('explique un programme bloqué par Windows dans les trois langages', () => {
    for (const langage of ['rust', 'python', 'c']) {
      const { classe, html } = rendreResultat({ statut: 'lancement_bloque', sortie: 'spawn UNKNOWN' }, { langage });
      assert.equal(classe, 'attention', langage);
      assert.match(html, /Windows a bloqué le lancement du programme/, langage);
      assert.match(html, /Réessaie/, langage);
      assert.match(html, /spawn UNKNOWN/, langage);
    }
  });
});
