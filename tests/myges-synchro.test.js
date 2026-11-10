import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { lancerClaude } from '../serveur/myges/claude.js';
import { AUCUN_NOUVEAU_COURS, creerSynchro, promptClaude, TENTATIVES_AUTOMATIQUES } from '../serveur/myges/synchro.js';
import { creerDossierTemporaire, supprimerDossier } from './aide.js';
import { demarrerFauxSiteMyges, IDENTIFIANTS } from './aide-myges.js';

const FAUX_CLAUDE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'faux-claude.js');

async function attendre(condition, delai = 15_000) {
  const limite = Date.now() + delai;
  while (!condition()) {
    if (Date.now() > limite) throw new Error('Délai dépassé');
    await new Promise((resoudre) => setTimeout(resoudre, 20));
  }
}

describe('lancement de Claude', () => {
  it('lit le flux et le bilan', async () => {
    const lignes = [];
    const { fin } = lancerClaude({ commande: process.execPath, args: [FAUX_CLAUDE, '-p', '- a\n- b'], dossier: process.cwd(), surLigne: (ligne) => lignes.push(ligne) });
    assert.deepEqual(await fin, { code: 0, bilan: 'Bilan : 2 notes', erreur: null, complet: true });
    assert.deepEqual(lignes, ['Je lis les sources']);
  });

  it('signale une erreur de Claude', async () => {
    const { fin } = lancerClaude({ commande: process.execPath, args: [FAUX_CLAUDE, '--echouer'], dossier: process.cwd() });
    assert.equal((await fin).erreur, 'Plantage');
  });

  it('repère une fin sans la marque ou avec des sous-agents coupés', async () => {
    const { fin } = lancerClaude({ commande: process.execPath, args: [FAUX_CLAUDE, '--incomplet'], dossier: process.cwd() });
    const resultat = await fin;
    assert.equal(resultat.complet, false);
    assert.equal(resultat.erreur, null);
  });

  it('s’arrête sur demande', async () => {
    const debut = Date.now();
    const { fin, arreter } = lancerClaude({ commande: process.execPath, args: [FAUX_CLAUDE, '--attendre'], dossier: process.cwd() });
    setTimeout(arreter, 200);
    await fin;
    assert.ok(Date.now() - debut < 5000);
  });

  it('signale une commande introuvable', async () => {
    await assert.rejects(lancerClaude({ commande: 'commande-qui-n-existe-pas', args: [], dossier: process.cwd() }).fin, { code: 'claude_introuvable' });
  });
});

describe('consigne donnée à Claude', () => {
  it('demande la marque de fin et précise la reprise', () => {
    assert.match(promptClaude(['a.pdf']), /SYNCHRO TERMINÉE/);
    assert.doesNotMatch(promptClaude(['a.pdf']), /Reprise :/);
    assert.match(promptClaude(['a.pdf'], { reprise: true }), /Reprise :/);
  });
});

describe('synchro MyGES', () => {
  let racine;
  let vault;
  let projet;
  let faux;

  const matieres = () => [
    { nom: 'T1 - rust', fichiers: [{ id: 'R1', nom: '[Slides] Ownership' }, { id: 'R2', nom: '[Support] Enums' }] },
    { nom: 'We1 - cartographie', fichiers: [{ id: 'S1', nom: 'Carte' }] },
    { nom: 'T1 - vide', fichiers: [] },
  ];

  async function preparer({ env = `MYGES_IDENTIFIANT=${IDENTIFIANTS.identifiant}\nMYGES_MOT_DE_PASSE="${IDENTIFIANTS.motDePasse}"\n`, claudeArgs = [FAUX_CLAUDE], ...options } = {}) {
    faux = await demarrerFauxSiteMyges({ matieres: matieres(), ...options });
    await fs.writeFile(path.join(projet, '.env'), env, 'utf8');
    return creer(claudeArgs);
  }

  function creer(claudeArgs = [FAUX_CLAUDE]) {
    return creerSynchro({
      vault,
      fichierEnv: path.join(projet, '.env'),
      fichierSuivi: path.join(projet, 'myges-suivi.json'),
      fichierMatieres: path.join(projet, 'myges-matieres.json'),
      fichierAttente: path.join(projet, 'myges-a-integrer.json'),
      dossierProjet: projet,
      claude: { commande: process.execPath, args: claudeArgs },
      adresseSite: faux?.adresse,
    });
  }

  const suivi = async () => JSON.parse(await fs.readFile(path.join(projet, 'myges-suivi.json'), 'utf8'));
  const fichierAttente = () => path.join(projet, 'myges-a-integrer.json');
  const attente = async () => JSON.parse(await fs.readFile(fichierAttente(), 'utf8'));
  const existe = (fichier) => fs.access(fichier).then(() => true, () => false);
  const finie = (synchro) => () => ['terminee', 'erreur'].includes(synchro.etat().etape);

  beforeEach(async () => {
    racine = await creerDossierTemporaire();
    vault = path.join(racine, 'Claude Note', 'Cours - ESGI');
    projet = path.join(racine, 'projet');
    await fs.mkdir(path.join(vault, 'Rust', 'Sources'), { recursive: true });
    await fs.mkdir(projet, { recursive: true });
    await fs.writeFile(path.join(vault, 'Rust', 'Sources', 'Slides - Ownership.pdf'), 'ancien', 'utf8');
    await fs.writeFile(path.join(projet, 'myges-matieres.json'), JSON.stringify({ rust: 'Rust' }), 'utf8');
  });

  afterEach(async () => {
    await faux?.fermer();
    faux = null;
    await supprimerDossier(racine);
  });

  it('télécharge les nouveaux supports puis lance Claude', async () => {
    const synchro = await preparer();
    assert.equal(synchro.demarrer().etape, 'connexion');
    await attendre(finie(synchro));
    const etat = synchro.etat();
    assert.equal(etat.etape, 'terminee', JSON.stringify(etat.erreur));
    assert.deepEqual(etat.telecharges, ['Rust/Sources/[Support] Enums.pdf', 'Cartographie/Sources/Carte.pdf']);
    assert.equal(etat.dejaPresents, 1);
    assert.deepEqual(etat.matieresCreees, ['Cartographie']);
    assert.equal(etat.bilan, 'Bilan : 2 notes');
    assert.deepEqual(etat.lignes, ['Je lis les sources']);
    assert.equal(await fs.readFile(path.join(vault, 'Rust', 'Sources', 'Slides - Ownership.pdf'), 'utf8'), 'ancien');
    assert.equal(await fs.readFile(path.join(vault, 'Cartographie', 'Sources', 'Carte.pdf'), 'utf8'), 'contenu de Carte');
    assert.deepEqual(Object.keys(await suivi()).sort(), ['R1', 'R2', 'S1']);
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(projet, 'myges-matieres.json'), 'utf8')), { cartographie: 'Cartographie', rust: 'Rust' });
    assert.ok(!JSON.stringify(etat).includes(IDENTIFIANTS.motDePasse));
    assert.equal(await existe(fichierAttente()), false);
    assert.deepEqual(etat.enAttente, []);

    synchro.demarrer();
    await attendre(finie(synchro));
    assert.equal(synchro.etat().bilan, AUCUN_NOUVEAU_COURS);
    assert.deepEqual(synchro.etat().lignes, []);
    assert.equal(faux.compteurs.telechargements, 2);
  });

  it('ne lance qu’une synchro à la fois', async () => {
    const synchro = await preparer();
    synchro.demarrer();
    synchro.demarrer();
    await attendre(finie(synchro));
    assert.equal(faux.compteurs.connexions, 1);
  });

  it('continue après un téléchargement raté', async () => {
    const synchro = await preparer({
      surTelechargement: (fichier, reponse) => {
        if (fichier.id !== 'S1') return true;
        reponse.writeHead(404).end();
        return false;
      },
    });
    synchro.demarrer();
    await attendre(finie(synchro));
    const etat = synchro.etat();
    assert.equal(etat.rates.length, 1);
    assert.equal(etat.telecharges.length, 1);
    assert.equal(etat.bilan, 'Bilan : 1 notes');
  });

  it('enregistre le suivi après chaque fichier', async () => {
    let liberer;
    const bloque = new Promise((resoudre) => { liberer = resoudre; });
    let secondDemande = false;
    const synchro = await preparer({
      surTelechargement: async (fichier) => {
        if (fichier.id === 'S1') {
          secondDemande = true;
          await bloque;
        }
        return true;
      },
    });
    synchro.demarrer();
    await attendre(() => secondDemande);
    assert.ok((await suivi()).R2);
    assert.equal((await suivi()).S1, undefined);
    assert.deepEqual((await attente()).fichiers, ['Rust/Sources/[Support] Enums.pdf']);
    liberer();
    await attendre(finie(synchro));
  });

  it('arrête Claude en cours de route', async () => {
    const synchro = await preparer({ claudeArgs: [FAUX_CLAUDE, '--attendre'] });
    synchro.demarrer();
    await attendre(() => synchro.etat().lignes.length > 0);
    assert.equal(synchro.etat().etape, 'claude');
    const etat = synchro.arreter();
    assert.equal(etat.etape, 'terminee');
    assert.equal(etat.bilan, 'Synchro arrêtée');
    await new Promise((resoudre) => setTimeout(resoudre, 200));
    assert.equal((await attente()).arretee, true);
    assert.equal((await creer().reprendreAuDemarrage()).etape, 'repos');
  });

  it('garde les cours à intégrer si Claude est coupé, puis reprend au démarrage suivant', async () => {
    const synchro = await preparer({ claudeArgs: [FAUX_CLAUDE, '--incomplet'] });
    synchro.demarrer();
    await attendre(finie(synchro));
    assert.equal(synchro.etat().erreur.code, 'claude_incomplet');
    const fichiers = ['Rust/Sources/[Support] Enums.pdf', 'Cartographie/Sources/Carte.pdf'];
    assert.deepEqual((await attente()).fichiers, fichiers);
    assert.equal((await attente()).tentatives, 1);

    const apresRedemarrage = creer();
    const etat = await apresRedemarrage.reprendreAuDemarrage();
    assert.equal(etat.etape, 'claude');
    assert.deepEqual(etat.enAttente, fichiers);
    await attendre(finie(apresRedemarrage));
    assert.equal(apresRedemarrage.etat().etape, 'terminee', JSON.stringify(apresRedemarrage.etat().erreur));
    assert.equal(apresRedemarrage.etat().bilan, 'Bilan : 2 notes (reprise)');
    assert.equal(apresRedemarrage.etat().reprise, true);
    assert.equal(await existe(fichierAttente()), false);
    assert.equal(faux.compteurs.telechargements, 2);
  });

  it('intègre les cours en attente même sans nouveau cours', async () => {
    const synchro = await preparer();
    synchro.demarrer();
    await attendre(finie(synchro));
    await fs.writeFile(fichierAttente(), JSON.stringify({ fichiers: ['Rust/Sources/Ancien.pdf'], tentatives: 1 }), 'utf8');
    const suivante = creer();
    suivante.demarrer();
    await attendre(finie(suivante));
    assert.equal(suivante.etat().bilan, 'Bilan : 1 notes (reprise)');
    assert.equal(await existe(fichierAttente()), false);
  });

  it('ne relance plus seul après plusieurs échecs', async () => {
    await fs.writeFile(fichierAttente(), JSON.stringify({ fichiers: ['Rust/Sources/Ancien.pdf'], tentatives: TENTATIVES_AUTOMATIQUES }), 'utf8');
    const synchro = creer();
    const etat = await synchro.reprendreAuDemarrage();
    assert.equal(etat.etape, 'repos');
    assert.deepEqual(etat.enAttente, ['Rust/Sources/Ancien.pdf']);
    synchro.reprendre();
    await attendre(finie(synchro));
    assert.equal(synchro.etat().etape, 'terminee');
  });

  it('ne relance rien au démarrage sans cours en attente', async () => {
    assert.equal((await creer().reprendreAuDemarrage()).etape, 'repos');
  });

  it('signale l’échec de Claude', async () => {
    const synchro = await preparer({ claudeArgs: [FAUX_CLAUDE, '--echouer'] });
    synchro.demarrer();
    await attendre(finie(synchro));
    assert.deepEqual(synchro.etat().erreur, { code: 'claude_echec', message: 'Plantage' });
  });

  it('demande les identifiants s’ils manquent', async () => {
    const synchro = await preparer({ env: 'MYGES_IDENTIFIANT=\n' });
    synchro.demarrer();
    await attendre(finie(synchro));
    assert.equal(synchro.etat().erreur.code, 'identifiants_manquants');
  });

  it('signale des identifiants refusés', async () => {
    const synchro = await preparer({ env: 'MYGES_IDENTIFIANT=aandre\nMYGES_MOT_DE_PASSE=mauvais\n' });
    synchro.demarrer();
    await attendre(finie(synchro));
    assert.equal(synchro.etat().erreur.code, 'identifiants_refuses');
    assert.ok(!JSON.stringify(synchro.etat()).includes('mauvais'));
  });
});
