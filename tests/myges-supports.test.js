import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { extraireZip, TAILLE_MAX_EXTRAITE, verifierEntrees } from '../serveur/commun/archives.js';
import { ecrireJson, lireJson } from '../serveur/commun/json.js';
import { cheminSur, cleDeComparaison, nettoyerNom, nomLibre, nomDepuisDisposition } from '../serveur/commun/noms.js';
import { connecterSite } from '../serveur/myges/connexion.js';
import { dossierDeMatiere, sansPrefixe } from '../serveur/myges/matieres.js';
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

describe('fichiers JSON', () => {
  let dossier;

  before(async () => {
    dossier = await creerDossierTemporaire();
  });

  after(async () => {
    await supprimerDossier(dossier);
  });

  it('lit la valeur par défaut si le fichier est absent', async () => {
    assert.deepEqual(await lireJson(path.join(dossier, 'absent.json'), { vide: true }), { vide: true });
  });

  it('range les écritures d’un même fichier l’une après l’autre', async () => {
    const fichier = path.join(dossier, 'suivi.json');
    const valeur = { compteur: 0 };
    const ecritures = [];
    for (let i = 1; i <= 20; i += 1) {
      valeur.compteur = i;
      ecritures.push(ecrireJson(fichier, valeur));
    }
    await Promise.all(ecritures);
    assert.deepEqual(await lireJson(fichier, null), { compteur: 20 });
    assert.deepEqual(await fs.readdir(dossier), ['suivi.json']);
  });
});

describe('archives', () => {
  let dossier;
  const TAR = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe');

  before(async () => {
    dossier = await creerDossierTemporaire();
  });

  after(async () => {
    await supprimerDossier(dossier);
  });

  async function archive(nom, entrees) {
    const chemin = path.join(dossier, nom);
    await fs.writeFile(chemin, creerZip(entrees));
    return chemin;
  }

  it('extrait une archive créée par tar', { skip: process.platform !== 'win32' }, async () => {
    const source = path.join(dossier, 'source');
    await fs.mkdir(path.join(source, 'td'), { recursive: true });
    await fs.writeFile(path.join(source, 'td', 'main.c'), 'int main(void) { return 0; }', 'utf8');
    const chemin = path.join(dossier, 'vrai.zip');
    execFileSync(TAR, ['-a', '-cf', chemin, 'td'], { cwd: source, windowsHide: true });
    await extraireZip(chemin, path.join(dossier, 'vrai'));
    assert.equal(await fs.readFile(path.join(dossier, 'vrai', 'td', 'main.c'), 'utf8'), 'int main(void) { return 0; }');
  });

  it('refuse une archive qui contient un lien', async () => {
    const chemin = await archive('lien.zip', [{ nom: 'ok.txt', contenu: 'x' }, { nom: 'lien', contenu: '../../secret', mode: 0o120777 }]);
    await assert.rejects(extraireZip(chemin, path.join(dossier, 'lien')), { code: 'archive_refusee', message: /lien/ });
    await assert.rejects(fs.access(path.join(dossier, 'lien')));
  });

  it('refuse une archive trop grosse une fois extraite', async () => {
    const moitie = TAILLE_MAX_EXTRAITE / 2 + 1;
    const chemin = await archive('gros.zip', [{ nom: 'a.bin', contenu: 'x', tailleAnnoncee: moitie }, { nom: 'b.bin', contenu: 'y', tailleAnnoncee: moitie }]);
    await assert.rejects(extraireZip(chemin, path.join(dossier, 'gros')), { code: 'archive_refusee', message: /500 Mo/ });
    await assert.rejects(fs.access(path.join(dossier, 'gros')));
  });

  it('refuse les chemins qui sortent du dossier', async () => {
    const chemin = await archive('sortie.zip', [{ nom: '../evil.txt', contenu: 'non' }]);
    await assert.rejects(extraireZip(chemin, path.join(dossier, 'sortie')), { code: 'archive_refusee', message: /hors de son dossier/ });
  });

  it('lit la liste détaillée de tar', () => {
    const ligne = (type, taille, nom) => `${type}rw-rw-r--  0 0      0   ${taille} nov. 30  1979 ${nom}`;
    assert.doesNotThrow(() => verifierEntrees(['a  b.txt', 'd/'], [ligne('-', 12, 'a  b.txt'), ligne('d', 0, 'd/')]));
    assert.throws(() => verifierEntrees(['lien'], [ligne('l', 0, 'lien -> /etc/passwd')]), /lien/);
    assert.throws(() => verifierEntrees(['dur'], [ligne('h', 0, 'dur link to autre')]), /lien/);
    assert.throws(() => verifierEntrees(['dur'], [ligne('-', 0, 'dur link to autre')]), /lien/);
    assert.throws(() => verifierEntrees(['a', 'b'], [ligne('-', 6, 'a'), ligne('-', 6, 'b')], 10), /Mo/);
    assert.throws(() => verifierEntrees(['/abs'], [ligne('-', 1, '/abs')]), /hors de son dossier/);
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
  const gros = Buffer.alloc(64 * 1024, 'a');

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
          { id: 'G1', nom: 'Gros', nomFichier: 'gros.pdf' },
          { id: 'G2', nom: 'Gros annoncé', nomFichier: 'gros.pdf' },
        ],
      }],
      surTelechargement: (fichier, reponse) => {
        if (fichier?.id === 'H1') {
          reponse.writeHead(200, { 'Content-Type': 'text/html' }).end('<html>slides</html>');
          return false;
        }
        if (fichier?.id === 'G1') {
          reponse.writeHead(200, { 'Content-Disposition': 'attachment; filename="gros.pdf"' });
          reponse.write(gros);
          reponse.write(gros);
          reponse.end(gros);
          return false;
        }
        if (fichier?.id === 'G2') {
          reponse.writeHead(200, { 'Content-Length': String(gros.length), 'Content-Disposition': 'attachment; filename="gros.pdf"' }).end(gros);
          return false;
        }
        return true;
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
    assert.deepEqual(supports.map((s) => s.id), ['P1', 'Z1', 'Z2', 'H1', 'G1', 'G2']);
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

  it('arrête un téléchargement trop gros sans rien laisser', async () => {
    const dossier = path.join(vault, 'Gros', 'Sources');
    const support = (id) => ({ id, nom: 'Gros', adresse: `${faux.adresse}/dl/private/${id}` });
    await assert.rejects(telecharger(session, support('G1'), dossier, { tailleMax: 100 * 1024 }), { code: 'fichier_trop_gros' });
    await assert.rejects(telecharger(session, support('G2'), dossier, { tailleMax: 1024 }), { code: 'fichier_trop_gros' });
    assert.deepEqual(await fs.readdir(dossier), []);
    assert.equal(await telecharger(session, support('G1'), dossier), 'gros.pdf');
    assert.equal((await fs.stat(path.join(dossier, 'gros.pdf'))).size, gros.length * 3);
  });

  it('rejette un fichier absent sans rien laisser', async () => {
    const dossier = path.join(vault, 'Vide', 'Sources');
    await assert.rejects(telecharger(session, { id: 'X', nom: 'absent', adresse: `${faux.adresse}/dl/private/X` }, dossier), { code: 'telechargement_rate' });
    assert.deepEqual(await fs.readdir(dossier).catch(() => []), []);
  });
});
