import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { connecterSite } from '../serveur/myges/connexion.js';
import { dossierDeMatiere, sansPrefixe } from '../serveur/myges/matieres.js';
import { cheminSur, cleDeComparaison, nettoyerNom, nomLibre, nomDepuisDisposition } from '../serveur/myges/noms.js';
import { lirePeriode, lireSupports, listerSupports, telecharger } from '../serveur/myges/source.js';
import { trierSupports } from '../serveur/myges/tri.js';
import { creerDossierTemporaire, supprimerDossier } from './aide.js';
import { creerZip, demarrerFauxSiteMyges, IDENTIFIANTS, pageSupports } from './aide-myges.js';

describe('noms de fichiers', () => {
  it('nettoie les noms interdits sous Windows', () => {
    assert.equal(nettoyerNom('a:b?.pdf'), 'a-b-.pdf');
    assert.equal(nettoyerNom('CON'), 'CON_');
    assert.equal(nettoyerNom('nul.txt'), 'nul_.txt');
    assert.equal(nettoyerNom('rapport. '), 'rapport');
    assert.equal(nettoyerNom('../../x'), '..-..-x');
    assert.equal(nettoyerNom('..'), 'document');
    assert.equal(nettoyerNom('  '), 'document');
  });

  it('reconnaît un même document écrit autrement', () => {
    assert.equal(cleDeComparaison('[Slides] Ownership.html'), cleDeComparaison('slides - ownership.pdf'));
    assert.equal(cleDeComparaison('Séance 2 - Quantificateurs, prédicats et sommes'), cleDeComparaison('Séance 2 - Quantificateurs_ prédicats et sommes.pdf'));
    assert.equal(cleDeComparaison('Séance 1  Opérations'), cleDeComparaison('Séance 1 - Opérations.pdf'));
    assert.equal(cleDeComparaison('[Listings] 01 - 09'), cleDeComparaison('[Listings] 01 - 09'));
    assert.notEqual(cleDeComparaison('Slides - Ownership.pdf'), cleDeComparaison('Support - Ownership.pdf'));
    assert.notEqual(cleDeComparaison('Cours 1'), cleDeComparaison('Cours 1 - Exercices'));
  });

  it('garde les chemins dans le dossier', () => {
    const dossier = path.resolve('v', 'Rust', 'Sources');
    assert.equal(cheminSur(dossier, '../../x'), path.join(dossier, '..-..-x'));
  });

  it('trouve un nom libre', () => {
    assert.equal(nomLibre('Cours.pdf', []), 'Cours.pdf');
    assert.equal(nomLibre('Cours.pdf', ['cours.PDF']), 'Cours (2).pdf');
    assert.equal(nomLibre('Cours.pdf', ['Cours.pdf', 'Cours (2).pdf']), 'Cours (3).pdf');
    assert.equal(nomLibre('Listings', ['Listings']), 'Listings (2)');
  });

  it('lit le nom envoyé par MyGES', () => {
    assert.equal(nomDepuisDisposition('attachment; filename="fiche.pdf"'), 'fiche.pdf');
    assert.equal(nomDepuisDisposition(`attachment; filename="${Buffer.from('chaînées.pdf', 'utf8').toString('latin1')}"`), 'chaînées.pdf');
    assert.equal(nomDepuisDisposition("attachment; filename*=UTF-8''s%C3%A9ance.pdf"), 'séance.pdf');
    assert.equal(nomDepuisDisposition(null), null);
  });
});

describe('matières', () => {
  it('retire le préfixe de période', () => {
    assert.equal(sansPrefixe('T1 - scripting python'), 'scripting python');
    assert.equal(sansPrefixe('We1 - cartographie et sig'), 'cartographie et sig');
    assert.equal(sansPrefixe('Rust'), 'Rust');
  });

  it('trouve le dossier du vault', () => {
    const correspondance = { 'Initation à la programmation en rust': 'Rust' };
    assert.deepEqual(dossierDeMatiere(correspondance, 'T1 - Initation à la programmation en rust'), { dossier: 'Rust', nouvelle: false });
    assert.deepEqual(dossierDeMatiere(correspondance, 'T2 - initation à la programmation en Rust'), { dossier: 'Rust', nouvelle: false });
    assert.deepEqual(dossierDeMatiere(correspondance, 'T2 - big: data'), { dossier: 'Big- data', nouvelle: true });
  });
});

describe('page des supports', () => {
  const html = pageSupports('https://dl.test', [
    { nom: 'T1 - algorithmique avancée', fichiers: [{ id: 'A1', nom: 'fiche listes chainées', date: '13/10/2026 10h17' }] },
    { nom: 'T1 - Programme open & vie d\'école', fichiers: [] },
    { nom: 'T1 - combinatoire', fichiers: [{ id: 'B1', nom: '[Slides] <Intro> & co', type: 'default' }, { id: 'B2', nom: '[Support] Intro' }] },
  ]);

  it('lit chaque fichier avec sa matière', () => {
    assert.deepEqual(lireSupports(html), [
      { id: 'A1', matiere: 'T1 - algorithmique avancée', nom: 'fiche listes chainées', type: 'pdf', ajouteLe: '13/10/2026 10h17', adresse: 'https://dl.test/dl/private/A1' },
      { id: 'B1', matiere: 'T1 - combinatoire', nom: '[Slides] <Intro> & co', type: 'default', ajouteLe: '13/10/2026 10h17', adresse: 'https://dl.test/dl/private/B1' },
      { id: 'B2', matiere: 'T1 - combinatoire', nom: '[Support] Intro', type: 'pdf', ajouteLe: '13/10/2026 10h17', adresse: 'https://dl.test/dl/private/B2' },
    ]);
  });

  it('lit la période affichée', () => {
    assert.equal(lirePeriode(html), '2026-2027 - ESGI - TEST - Semestre 1');
  });

  it('refuse une page qui n’est pas celle des supports', () => {
    assert.throws(() => lireSupports('<html>Accueil</html>'), { code: 'reponse_inattendue' });
  });
});

describe('tri des supports', () => {
  const support = (id, matiere, nom) => ({ id, matiere, nom, type: 'pdf', ajouteLe: '1', adresse: `x/${id}` });
  const correspondance = { rust: 'Rust' };

  it('ignore ce qui est déjà suivi ou déjà dans le vault', () => {
    const resultat = trierSupports({
      supports: [support('1', 'T1 - rust', 'Ownership'), support('2', 'T1 - rust', '[Slides] Intro'), support('3', 'T1 - rust', 'Nouveau'), support('4', 'T1 - sig', 'Carte')],
      suivi: { 1: { chemin: 'Rust/Sources/Ownership.pdf' } },
      correspondance,
      contenuDossiers: { Rust: ['Slides - Intro.pdf'] },
    });
    assert.deepEqual(resultat.dejaPresents, [{ support: support('2', 'T1 - rust', '[Slides] Intro'), dossier: 'Rust', chemin: 'Rust/Sources/Slides - Intro.pdf' }]);
    assert.deepEqual(resultat.aTelecharger.map((d) => [d.support.id, d.dossier, d.matiereMyges]), [['3', 'Rust', 'rust'], ['4', 'Sig', 'sig']]);
    assert.deepEqual(resultat.matieresNouvelles, [{ matiere: 'sig', dossier: 'Sig' }]);
  });

  it('ne garde qu’une fois un même document listé deux fois', () => {
    const resultat = trierSupports({
      supports: [support('1', 'T1 - rust', 'Cours'), support('1', 'T1 - rust', 'Cours')],
      suivi: {},
      correspondance,
      contenuDossiers: {},
    });
    assert.equal(resultat.aTelecharger.length, 1);
  });
});

describe('téléchargement', () => {
  let vault;
  let faux;
  let session;
  const zip = creerZip([{ nom: 'listing/main.rs', contenu: 'fn main() {}' }]);
  const piege = creerZip([{ nom: '../evil.txt', contenu: 'non' }]);

  before(async () => {
    vault = await creerDossierTemporaire();
    faux = await demarrerFauxSiteMyges({
      matieres: [{
        nom: 'T1 - rust',
        fichiers: [
          { id: 'P1', nom: 'Fiche', nomFichier: 'fiche chaînées.pdf', contenu: '%PDF-1' },
          { id: 'Z1', nom: '[Listings] 01 - 09', type: 'default', nomFichier: '[Listings] 01 - 09.zip', contenu: zip },
          { id: 'Z2', nom: 'piège', type: 'default', nomFichier: 'piege.zip', contenu: piege },
          { id: 'H1', nom: '[Slides] Intro', type: 'default' },
        ],
      }],
      surTelechargement: (fichier, reponse) => {
        if (fichier?.id !== 'H1') return true;
        reponse.writeHead(200, { 'Content-Type': 'text/html' }).end('<html>slides</html>');
        return false;
      },
    });
    session = await connecterSite(IDENTIFIANTS, { adresseSite: faux.adresse });
  });

  after(async () => {
    await faux.fermer();
    await supprimerDossier(vault);
  });

  it('liste les supports du faux MyGES', async () => {
    const supports = await listerSupports(session, { adresseSite: faux.adresse });
    assert.deepEqual(supports.map((s) => s.id), ['P1', 'Z1', 'Z2', 'H1']);
  });

  it('range un fichier sous le nom donné par MyGES', async () => {
    const dossier = path.join(vault, 'Rust', 'Sources');
    const nom = await telecharger(session, { id: 'P1', nom: 'Fiche', adresse: `${faux.adresse}/dl/private/P1` }, dossier);
    assert.equal(nom, 'fiche chaînées.pdf');
    assert.equal(await fs.readFile(path.join(dossier, nom), 'utf8'), '%PDF-1');
    const encore = await telecharger(session, { id: 'P1', nom: 'Fiche', adresse: `${faux.adresse}/dl/private/P1` }, dossier);
    assert.equal(encore, 'fiche chaînées (2).pdf');
  });

  it('devine l’extension d’un fichier sans nom', async () => {
    const dossier = path.join(vault, 'Combi', 'Sources');
    assert.equal(await telecharger(session, { id: 'H1', nom: '[Slides] Intro', adresse: `${faux.adresse}/dl/private/H1` }, dossier), '[Slides] Intro.html');
  });

  it('extrait une archive dans un dossier du même nom', async () => {
    const dossier = path.join(vault, 'Rust', 'Sources');
    const nom = await telecharger(session, { id: 'Z1', nom: '[Listings] 01 - 09', adresse: `${faux.adresse}/dl/private/Z1` }, dossier);
    assert.equal(nom, '[Listings] 01 - 09');
    assert.equal(await fs.readFile(path.join(dossier, nom, 'listing', 'main.rs'), 'utf8'), 'fn main() {}');
    assert.ok(!(await fs.readdir(dossier)).some((f) => f.endsWith('.zip')));
  });

  it('refuse une archive qui sort de son dossier', async () => {
    const dossier = path.join(vault, 'Piege', 'Sources');
    await assert.rejects(telecharger(session, { id: 'Z2', nom: 'piège', adresse: `${faux.adresse}/dl/private/Z2` }, dossier), { code: 'archive_refusee' });
    await assert.rejects(fs.access(path.join(vault, 'Piege', 'evil.txt')));
    assert.deepEqual(await fs.readdir(dossier).catch(() => []), []);
  });

  it('rejette un fichier absent sans rien laisser', async () => {
    const dossier = path.join(vault, 'Vide', 'Sources');
    await assert.rejects(telecharger(session, { id: 'X', nom: 'absent', adresse: `${faux.adresse}/dl/private/X` }, dossier), { code: 'telechargement_rate' });
    assert.deepEqual(await fs.readdir(dossier).catch(() => []), []);
  });
});
