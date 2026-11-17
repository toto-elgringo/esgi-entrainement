import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { creerSynchroSchooding, promptClaude } from '../serveur/schooding/synchro.js';
import { AUCUN_NOUVEAU_COURS, creerVerrou } from '../serveur/synchro.js';
import { creerDossierTemporaire, supprimerDossier } from './aide.js';
import { demarrerFauxSchooding, IDENTIFIANTS_SCHOODING } from './aide-schooding.js';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const FAUX_CLAUDE = path.join(ICI, 'faux-claude.js');
const FAUX_YTDLP = { commande: process.execPath, args: [path.join(ICI, 'faux-yt-dlp.js')] };

async function attendre(condition, delai = 15_000) {
  const limite = Date.now() + delai;
  while (!condition()) {
    if (Date.now() > limite) throw new Error('Délai dépassé');
    await new Promise((resoudre) => setTimeout(resoudre, 20));
  }
}

describe('consigne donnée à Claude pour Schooding', () => {
  it('demande des exercices adaptés et des quiz sur le modèle des QCM', () => {
    const prompt = promptClaude(['Scripting Python/Sources/Schooding/01 - Bases/Séance.md']);
    assert.match(prompt, /^\/obsidian -esgi/);
    assert.match(prompt, /- Scripting Python\/Sources\/Schooding\/01 - Bases\/Séance\.md/);
    assert.match(prompt, /ne recopie pas/);
    assert.match(prompt, /QCM corrigés comme modèle/);
    assert.match(prompt, /SYNCHRO TERMINÉE/);
    assert.match(promptClaude(['a'], { reprise: true }), /Reprise :/);
  });
});

describe('synchro Schooding', () => {
  let racine;
  let vault;
  let projet;
  let faux;
  let etatExercice;
  let codeExercice;

  async function preparer({ env = `SCHOODING_IDENTIFIANT=${IDENTIFIANTS_SCHOODING.identifiant}\nSCHOODING_MOT_DE_PASSE="${IDENTIFIANTS_SCHOODING.motDePasse}"\n`, ytdlp = null, ...options } = {}) {
    faux = await demarrerFauxSchooding({ etatExercice: () => etatExercice, codeExercice: (id) => codeExercice[id], ...options });
    await fs.writeFile(path.join(projet, '.env'), env, 'utf8');
    return creer({ ytdlp });
  }

  function creer({ ytdlp = null, verrou } = {}) {
    return creerSynchroSchooding({
      vault,
      fichierEnv: path.join(projet, '.env'),
      fichierSuivi: path.join(projet, 'schooding-suivi.json'),
      fichierMatieres: path.join(projet, 'schooding-matieres.json'),
      fichierAttente: path.join(projet, 'schooding-a-integrer.json'),
      dossierProjet: projet,
      claude: { commande: process.execPath, args: [FAUX_CLAUDE] },
      adresseSite: faux?.adresse,
      pause: 0,
      attentes: [10],
      chercherYtDlp: async () => ytdlp,
      verrou,
    });
  }

  const lire = (relatif) => fs.readFile(path.join(vault, ...relatif.split('/')), 'utf8');
  const existe = (relatif) => fs.access(path.join(vault, ...relatif.split('/'))).then(() => true, () => false);
  const finie = (synchro) => () => ['terminee', 'erreur'].includes(synchro.etat().etape);
  const BASES = 'Scripting Python/Sources/Schooding/01 - Les bases';

  async function lancer(synchro) {
    synchro.demarrer();
    await attendre(finie(synchro));
    return synchro.etat();
  }

  beforeEach(async () => {
    racine = await creerDossierTemporaire();
    vault = path.join(racine, 'Claude Note', 'Cours - ESGI');
    projet = path.join(racine, 'projet');
    await fs.mkdir(vault, { recursive: true });
    await fs.mkdir(projet, { recursive: true });
    await fs.writeFile(path.join(projet, 'schooding-matieres.json'), JSON.stringify({ Python: 'Scripting Python' }), 'utf8');
    etatExercice = undefined;
    codeExercice = {};
  });

  afterEach(async () => {
    await faux?.fermer();
    faux = null;
    await supprimerDossier(racine);
  });

  it('télécharge séances, documents, exercices et QCM puis lance Claude', async () => {
    const synchro = await preparer();
    const etat = await lancer(synchro);
    assert.equal(etat.etape, 'terminee', JSON.stringify(etat.erreur));
    assert.deepEqual(etat.rates, []);
    assert.deepEqual(etat.telecharges.sort(), [
      `${BASES}/Devoirs Maison/01 - Table de multiplication.md`,
      `${BASES}/Documents/01 - Cours - les variables.md`,
      `${BASES}/Documents/02 - Vidéo - l'affectation.md`,
      `${BASES}/Documents/03 - Diapos de base/03 - Diapos de base.md`,
      `${BASES}/Exercices/01 - Somme de deux entiers.md`,
      `${BASES}/Séance.md`,
      'Algo Avancée/Sources/Schooding/01 - Tableaux/Documents/poly-tableaux.pdf',
      'Algo Avancée/Sources/Schooding/01 - Tableaux/Exercices/01 - Minimum d’un tableau.md',
      'Algo Avancée/Sources/Schooding/01 - Tableaux/Séance.md',
      'Scripting Python/Sources/Schooding/Examens/QCM de rentrée - QCM Python.md',
    ].sort());
    assert.match(etat.bilan, /^Bilan : \d+ notes$/);
    assert.deepEqual(etat.matieresCreees, ['Algo Avancée']);
    assert.ok(etat.notes.some((note) => /1 séance encore verrouillée/.test(note)));
    assert.ok(etat.notes.some((note) => /1 vidéo gardée en lien YouTube/.test(note)));
    assert.ok(!JSON.stringify(etat).includes(IDENTIFIANTS_SCHOODING.motDePasse));

    const exercice = await lire(`${BASES}/Exercices/01 - Somme de deux entiers.md`);
    assert.match(exercice, /^# Somme de deux entiers/);
    assert.match(exercice, /Mon avancement : 100 % \(2 essais, dernier le 1 octobre 2026 10:05\)/);
    assert.match(exercice, /## Énoncé\n\nÉcrire une fonction/);
    assert.match(exercice, /```\nentrée : 2 3\nsortie : 5\n```/);
    assert.match(exercice, /## Mon code\n\n```python\ndef somme\(a, b\):\n    return a \+ b\n```/);
    assert.match(exercice, /## Solution officielle\n\n```python\n[^`]*# officielle\n```/);
    assert.match(await lire('Algo Avancée/Sources/Schooding/01 - Tableaux/Exercices/01 - Minimum d’un tableau.md'), /## Outils fournis\n\n- \*\*void debug\(value\)\*\*/);
    const qcm = await lire('Scripting Python/Sources/Schooding/Examens/QCM de rentrée - QCM Python.md');
    assert.match(qcm, /Mon score : 50% pour 1 point\(s\)/);
    assert.match(qcm, /- \[x\] 3 ✔/);
    assert.match(qcm, /- \[ \] tuple ✘/);
    assert.match(qcm, /- \[x\] list ✘/);
    assert.match(qcm, /- \[ \] str\n/);
    assert.match(await lire(`${BASES}/Séance.md`), /## Description\n\nDans cette session, on découvre \*\*les bases\*\*\./);
    assert.match(await lire(`${BASES}/Documents/01 - Cours - les variables.md`), /^# Cours : les variables\n\n## Les variables/);
    assert.match(await lire(`${BASES}/Documents/02 - Vidéo - l'affectation.md`), /https:\/\/www\.youtube\.com\/watch\?v=VIDEO-test1/);
    const diapos = await lire(`${BASES}/Documents/03 - Diapos de base/03 - Diapos de base.md`);
    assert.match(diapos, /## Diapo 2\n\n!\[\[diapo-002\.svg\]\]\n\nLes listes\nUne liste est modifiable/);
    assert.match(await lire(`${BASES}/Documents/03 - Diapos de base/diapo-001.svg`), /^<svg/);
    assert.equal(await lire('Algo Avancée/Sources/Schooding/01 - Tableaux/Documents/poly-tableaux.pdf'), '%PDF-1.4 faux');
    assert.equal(await existe('Algo Avancée/Sources/Schooding/01 - Tableaux/Documents/02 - Cours - les variables.md'), false);
    assert.equal(await fs.access(path.join(projet, 'schooding-a-integrer.json')).then(() => true, () => false), false);
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(projet, 'schooding-matieres.json'), 'utf8')), { 'Algo Avancée': 'Algo Avancée', Python: 'Scripting Python' });

    const pagesAvant = { ...faux.compteurs.pages };
    const deuxieme = await lancer(synchro);
    assert.equal(deuxieme.bilan, AUCUN_NOUVEAU_COURS);
    assert.deepEqual(deuxieme.telecharges, []);
    assert.equal(faux.compteurs.pages['/codingtest/201/'], pagesAvant['/codingtest/201/']);
    assert.equal(faux.compteurs.pages['/documents/show/101/'], pagesAvant['/documents/show/101/']);
  });

  it('met à jour un exercice quand mon code change sur Schooding', async () => {
    const synchro = await preparer();
    await lancer(synchro);
    const appels = faux.compteurs.pages['/codingtest/201/'];

    etatExercice = { classe: 'text-success', icone: 'sentiment_very_satisfied' };
    assert.equal((await lancer(synchro)).bilan, AUCUN_NOUVEAU_COURS);
    assert.equal(faux.compteurs.pages['/codingtest/201/'], appels);

    etatExercice = { classe: 'text-warning', icone: 'sentiment_neutral' };
    assert.equal((await lancer(synchro)).bilan, AUCUN_NOUVEAU_COURS);
    assert.equal(faux.compteurs.pages['/codingtest/201/'], appels + 1);

    etatExercice = { classe: 'text-success', icone: 'sentiment_satisfied' };
    codeExercice = { 201: 'def somme(a, b):\n    return sum([a, b])' };
    const etat = await lancer(synchro);
    assert.deepEqual(etat.telecharges, [`${BASES}/Exercices/01 - Somme de deux entiers.md`]);
    assert.match(await lire(`${BASES}/Exercices/01 - Somme de deux entiers.md`), /return sum\(\[a, b\]\)/);
  });

  it('télécharge les vidéos quand yt-dlp est installé, même après coup', async () => {
    const synchro = await preparer();
    await lancer(synchro);
    const sansVideo = creer({ ytdlp: FAUX_YTDLP });
    const etat = await lancer(sansVideo);
    assert.deepEqual(etat.telecharges, [`${BASES}/Documents/02 - Vidéo - l'affectation.md`]);
    assert.match(await lire(`${BASES}/Documents/02 - Vidéo - l'affectation.md`), /Vidéo téléchargée : !\[\[02 - Vidéo - l'affectation\.mp4\]\]/);
    assert.match(await lire(`${BASES}/Documents/02 - Vidéo - l'affectation.mp4`), /VIDEO-test1/);
    assert.ok(!etat.notes.some((note) => /yt-dlp/.test(note)));
    assert.equal((await lancer(sansVideo)).bilan, AUCUN_NOUVEAU_COURS);
  });

  it('attend puis réessaie quand Schooding limite les requêtes', async () => {
    const synchro = await preparer({ limiteSur: '/session/21/' });
    const etat = await lancer(synchro);
    assert.equal(etat.etape, 'terminee', JSON.stringify(etat.erreur));
    assert.equal(faux.compteurs.limites, 1);
    assert.ok(etat.telecharges.includes('Algo Avancée/Sources/Schooding/01 - Tableaux/Séance.md'));
  });

  it('signale des identifiants absents ou refusés', async () => {
    const sansIdentifiants = await preparer({ env: 'MYGES_IDENTIFIANT=x\n' });
    assert.equal((await lancer(sansIdentifiants)).erreur.code, 'identifiants_manquants');
    await faux.fermer();
    const refuse = await preparer({ identifiants: { identifiant: 'autre', motDePasse: 'x' } });
    const etat = await lancer(refuse);
    assert.equal(etat.erreur.code, 'identifiants_refuses');
    assert.equal(faux.compteurs.connexions, 1);
  });

  it('attend la fin d’une autre intégration avant de lancer Claude', async () => {
    faux = await demarrerFauxSchooding();
    await fs.writeFile(path.join(projet, '.env'), `SCHOODING_IDENTIFIANT=${IDENTIFIANTS_SCHOODING.identifiant}\nSCHOODING_MOT_DE_PASSE="${IDENTIFIANTS_SCHOODING.motDePasse}"\n`, 'utf8');
    const verrou = creerVerrou();
    let liberer;
    const occupation = verrou.executer(() => new Promise((resoudre) => { liberer = resoudre; }));
    const synchro = creer({ verrou });
    synchro.demarrer();
    await attendre(() => synchro.etat().etape === 'claude');
    assert.ok(synchro.etat().lignes.some((ligne) => /En attente/.test(ligne)));
    await new Promise((resoudre) => setTimeout(resoudre, 100));
    assert.equal(synchro.etat().etape, 'claude');
    liberer();
    await occupation;
    await attendre(finie(synchro));
    assert.equal(synchro.etat().etape, 'terminee');
  });
});
