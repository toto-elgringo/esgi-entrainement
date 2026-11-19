import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import {
  analyserBilan,
  couperResultat,
  couperTexte,
  creerReserve,
  creerVerificateurs,
  lancer,
  problemeCompilation,
  problemeExecution,
  retirerBilan,
  TAILLE_MAX_FLUX,
  TropDeDemandes,
} from '../serveur/processus.js';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('processus : bilans et vérifications communes', () => {
  it('lit et retire la ligne de bilan des tests qui porte le marqueur', () => {
    const sortie = '✓ test_a\n✗ test_b : raté\nRESULTAT m1 1 1\n';
    assert.deepEqual(analyserBilan(sortie, 'm1'), { reussis: 1, echoues: 1 });
    assert.equal(retirerBilan(sortie, 'm1'), '✓ test_a\n✗ test_b : raté');
    assert.equal(analyserBilan('rien', 'm1'), null);
  });

  it('ignore un bilan écrit sans le bon marqueur', () => {
    assert.equal(analyserBilan('RESULTAT 5 0\nRESULTAT faux 5 0\n', 'm1'), null);
    assert.equal(retirerBilan('RESULTAT 5 0', 'm1'), 'RESULTAT 5 0');
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

  it('transmet le signal d’annulation aux vérifications', async () => {
    const recus = [];
    const signal = new AbortController().signal;
    const { verifierExercice } = creerVerificateurs(
      async (code, entree, options) => { recus.push(options.signal); return { statut: 'execute', sortie: '' }; },
      async (code, tests, options) => { recus.push(options.signal); return { statut: 'reussi' }; },
    );
    await verifierExercice({ type: 'sortie', sortieAttendue: '' }, 'code', { signal });
    await verifierExercice({ type: 'tests', tests: '' }, 'code', { signal });
    assert.deepEqual(recus, [signal, signal]);
  });

  it('transforme un plantage en échec pour un exercice de type sortie', async () => {
    const { verifierSortie } = creerVerificateurs(async () => ({ statut: 'erreur_execution', sortie: 'boum' }), null);
    assert.equal((await verifierSortie('code', 'attendu')).statut, 'echec');
  });
});

describe('processus : sortie renvoyée à la page', () => {
  it('coupe un texte trop long avec une mention', () => {
    assert.equal(couperTexte('court'), 'court');
    const coupe = couperTexte('a'.repeat(TAILLE_MAX_FLUX + 10));
    assert.ok(coupe.startsWith('a'.repeat(TAILLE_MAX_FLUX)));
    assert.match(coupe, /… \(sortie coupée\)$/);
    assert.equal(couperTexte(null), null);
  });

  it('coupe chaque flux du résultat séparément', () => {
    const long = 'x'.repeat(TAILLE_MAX_FLUX * 2);
    const resultat = couperResultat({ statut: 'echec', sortie: long, avertissements: long, tests: [{ nom: 'a', obtenu: long, reussi: false }] });
    assert.equal(resultat.statut, 'echec');
    assert.ok(resultat.sortie.length < TAILLE_MAX_FLUX + 30);
    assert.ok(resultat.avertissements.length < TAILLE_MAX_FLUX + 30);
    assert.ok(resultat.tests[0].obtenu.length < TAILLE_MAX_FLUX + 30);
    assert.equal(resultat.tests[0].reussi, false);
  });
});

describe('processus : réserve de dossiers de travail', () => {
  it('réutilise en premier le dossier qui vient d’être rendu', async () => {
    const utiliser = creerReserve(['a', 'b', 'c']);
    const premier = await utiliser(async (dossier) => dossier);
    assert.equal(await utiliser(async (dossier) => dossier), premier);
  });

  it('refuse les demandes au-delà de la file d’attente', async () => {
    const utiliser = creerReserve(['a'], { attenteMax: 2 });
    let liberer;
    const bloque = utiliser(() => new Promise((resoudre) => { liberer = resoudre; }));
    const enAttente = [utiliser(async () => 1), utiliser(async () => 2)];
    await assert.rejects(utiliser(async () => 3), TropDeDemandes);
    liberer();
    await bloque;
    assert.deepEqual(await Promise.all(enAttente), [1, 2]);
  });
});

describe('processus : lancement des programmes', () => {
  it('signale un programme introuvable', async () => {
    const resultat = await lancer('commande-qui-n-existe-pas-esgi', []);
    assert.equal(resultat.introuvable, true);
    assert.equal(resultat.lancementBloque, false);
  });

  it('signale un lancement refusé par le système avec le code de l’erreur', async () => {
    const resultat = await lancer(path.join(racine, 'package.json'), []);
    assert.equal(resultat.lancementBloque, true);
    assert.equal(typeof resultat.erreur.code, 'string');
    const probleme = problemeExecution(resultat);
    assert.equal(probleme.statut, 'lancement_bloque');
    assert.match(probleme.sortie, /Windows a bloqué le lancement du programme \(Smart App Control \?\)\. Réessaie\./);
    assert.ok(probleme.sortie.includes(resultat.erreur.code));
    assert.equal(problemeCompilation(resultat, 'absent').statut, 'lancement_bloque');
  });

  it('arrête tout l’arbre de processus quand le délai est dépassé', { timeout: 20_000 }, async () => {
    const script = 'require("child_process").spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "inherit" }); setInterval(() => {}, 1000);';
    const debut = Date.now();
    const resultat = await lancer(process.execPath, ['-e', script], { delai: 500 });
    assert.equal(resultat.delaiDepasse, true);
    assert.ok(Date.now() - debut < 10_000);
    assert.equal(problemeExecution(resultat).statut, 'delai_depasse');
  });

  it('arrête le programme quand la demande est annulée', { timeout: 20_000 }, async () => {
    const controleur = new AbortController();
    setTimeout(() => controleur.abort(), 200);
    const resultat = await lancer(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { signal: controleur.signal });
    assert.equal(resultat.annule, true);
    assert.equal(problemeExecution(resultat).statut, 'annule');
    const ensuite = await lancer(process.execPath, ['-e', ''], { signal: controleur.signal });
    assert.equal(ensuite.annule, true);
  });

  it('transmet l’entrée et les variables d’environnement', async () => {
    const resultat = await lancer(process.execPath, ['-e', 'process.stdin.on("data", (d) => process.stdout.write(d + process.env.ESGI_ESSAI))'], {
      entree: 'abc',
      env: { ESGI_ESSAI: '!' },
    });
    assert.equal(resultat.code, 0);
    assert.equal(resultat.stdout, 'abc!');
  });
});
