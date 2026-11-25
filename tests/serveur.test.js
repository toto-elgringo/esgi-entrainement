import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { DOMAINES_CODE, langageDe } from '../js/domaines.js';
import { outilsC } from '../serveur/c.js';
import { outilsPython } from '../serveur/python.js';
import { outilsRust } from '../serveur/rust.js';
import { creerProgression } from '../serveur/progression.js';
import { creerServeur, EXECUTEURS, lirePlage, politiquePage, scriptsEnLigne } from '../serveur/serveur.js';
import {
  C_DEPART,
  C_SOLUTION,
  CODE_DEPART,
  CODE_SOLUTION,
  creerContenuExemple,
  creerDossierTemporaire,
  obtenirCookie,
  PYTHON_DEPART,
  PYTHON_SOLUTION,
  raisonSansOutil,
  sansCompilation,
  supprimerDossier,
} from './aide.js';

const outils = sansCompilation ? {} : await outilsRust();
const sansRust = await raisonSansOutil(async () => outils.cargo, 'cargo');
const sansPython = await raisonSansOutil(async () => (await outilsPython()).python, 'Python 3');
const sansGcc = await raisonSansOutil(async () => (await outilsC()).gcc, 'gcc');

const SCRIPT_THEME = '\n    document.documentElement.dataset.theme = "clair";\n  ';
const PAGE = `<!doctype html><html><head><script>${SCRIPT_THEME}</script><script src="js/app.js"></script></head><body><h1>Accueil</h1></body></html>`;

describe('serveur local', () => {
  let racine;
  let serveur;
  let adresse;
  let cookie;

  async function appeler(methode, chemin, corps, entetes = {}) {
    const reponse = await fetch(`${adresse}${chemin}`, {
      method: methode,
      headers: corps ? { 'Content-Type': 'application/json', Cookie: cookie, ...entetes } : entetes,
      body: corps ? JSON.stringify(corps) : undefined,
    });
    const texte = await reponse.text();
    let donnees = texte;
    try {
      donnees = JSON.parse(texte);
    } catch {}
    return { statut: reponse.status, donnees, entetes: reponse.headers };
  }

  before(async () => {
    racine = await creerDossierTemporaire();
    await fs.writeFile(path.join(racine, 'index.html'), PAGE);
    await fs.mkdir(path.join(racine, 'js'));
    await fs.writeFile(path.join(racine, 'js', 'app.js'), 'export {};');
    await fs.writeFile(path.join(racine, 'package.json'), '{"secret":true}');
    await fs.mkdir(path.join(racine, 'serveur'));
    await fs.writeFile(path.join(racine, 'serveur', 'serveur.js'), 'secret');
    await creerContenuExemple(racine);
    const reponses = path.join(racine, 'contenu', 'maths');
    await fs.mkdir(path.join(reponses, '01-suites'), { recursive: true });
    await fs.writeFile(path.join(reponses, 'programme.json'), JSON.stringify({ matieres: [{ id: 'informatique', titre: 'Maths' }], chapitres: ['01-suites', '02-absent'] }));
    await fs.writeFile(path.join(reponses, '01-suites', 'chapitre.json'), JSON.stringify({ titre: 'Suites', matieres: ['informatique'] }));
    await fs.writeFile(path.join(reponses, '01-suites', 'exercices.json'), JSON.stringify([{ id: 'e1', titre: 'Un' }]));
    await fs.writeFile(path.join(reponses, '01-suites', 'quiz.json'), JSON.stringify([{ question: 'Q' }, { question: 'R' }]));
    const dossierSupports = path.join(racine, 'cours');
    await fs.mkdir(path.join(dossierSupports, 'Rust'), { recursive: true });
    await fs.writeFile(path.join(dossierSupports, 'Rust', 'Slides 1.pdf'), '%PDF-1.4 exemple');
    await fs.writeFile(path.join(dossierSupports, 'Rust', 'page.html'), '<p>interactif</p>');
    await fs.writeFile(path.join(dossierSupports, 'Rust', 'notes.md'), 'privé');
    serveur = creerServeur({ racine, dossierContenu: path.join(racine, 'contenu'), dossierSupports });
    await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre));
    adresse = `http://127.0.0.1:${serveur.address().port}`;
    cookie = await obtenirCookie(serveur.address().port);
  });

  after(async () => {
    await new Promise((resoudre) => serveur.close(resoudre));
    await supprimerDossier(racine);
  });

  it('sert la page d’accueil et les fichiers du contenu', async () => {
    assert.match((await appeler('GET', '/')).donnees, /Accueil/);
    const depart = await appeler('GET', '/contenu/rust/01-bases/exercices/01-double/depart.rs');
    assert.equal(depart.donnees, CODE_DEPART);
    assert.equal((await appeler('GET', '/js/app.js')).statut, 200);
  });

  it('ne sert que les fichiers publics du site', async () => {
    for (const chemin of ['/ENV~1', '/MYGES-~2.JSO', '/myges-suivi.json::$DATA', '/package.json', '/serveur/serveur.js', '/js%5C..%5Cpackage.json', '/js//app.js']) {
      const { statut, donnees } = await appeler('GET', chemin);
      assert.equal(statut, 404, chemin);
      assert.doesNotMatch(JSON.stringify(donnees), /secret/);
    }
  });

  it('pose le jeton de session sur la page d’accueil', async () => {
    const reponse = await fetch(`${adresse}/index.html`);
    await reponse.text();
    const entete = reponse.headers.get('set-cookie');
    assert.match(entete, new RegExp(`^esgi_jeton_${serveur.address().port}=[0-9a-f-]{36}; HttpOnly; SameSite=Strict; Path=/$`));
    const pageJs = await fetch(`${adresse}/js/app.js`);
    await pageJs.text();
    assert.equal(pageJs.headers.get('set-cookie'), null);
  });

  it('ajoute les en-têtes de sécurité à toutes les réponses', async () => {
    for (const chemin of ['/', '/js/app.js', '/api/etat', '/absent']) {
      const { entetes } = await appeler('GET', chemin);
      assert.equal(entetes.get('x-content-type-options'), 'nosniff', chemin);
      assert.equal(entetes.get('referrer-policy'), 'no-referrer', chemin);
      assert.equal(entetes.get('x-frame-options'), 'SAMEORIGIN', chemin);
      assert.match(entetes.get('content-security-policy'), /frame-ancestors 'self'/, chemin);
    }
  });

  it('autorise le script du thème de la page par son empreinte', async () => {
    const { entetes } = await appeler('GET', '/');
    const politique = entetes.get('content-security-policy');
    const empreinte = createHash('sha256').update(SCRIPT_THEME).digest('base64');
    assert.ok(politique.includes(`'sha256-${empreinte}'`));
    assert.match(politique, /default-src 'self'/);
    assert.match(politique, /frame-src 'self' https:/);
    assert.doesNotMatch(politique.split(';').find((partie) => partie.includes('script-src')), /unsafe-inline/);
  });

  it('repère seulement les scripts écrits dans la page', () => {
    assert.deepEqual(scriptsEnLigne('<script>a()</script><script type="module" src="x.js"></script><SCRIPT>b()</SCRIPT>'), ['a()', 'b()']);
    assert.deepEqual(scriptsEnLigne('<script>\r\na()\r\n</script>'), ['\na()\n']);
    assert.match(politiquePage('<p></p>'), /script-src 'self'(;|$)/);
    assert.doesNotMatch(politiquePage('<p></p>'), /cdnjs|jsdelivr/);
  });

  it('sert les supports originaux depuis le dossier des cours', async () => {
    const reponse = await fetch(`${adresse}/supports/Rust/Slides%201.pdf`);
    assert.equal(reponse.status, 200);
    assert.equal(reponse.headers.get('content-type'), 'application/pdf');
    assert.equal(reponse.headers.get('accept-ranges'), 'bytes');
    assert.equal(reponse.headers.get('content-length'), '16');
    assert.equal(await reponse.text(), '%PDF-1.4 exemple');
  });

  it('envoie une partie d’un support avec l’en-tête Range', async () => {
    const partie = await fetch(`${adresse}/supports/Rust/Slides%201.pdf`, { headers: { Range: 'bytes=0-3' } });
    assert.equal(partie.status, 206);
    assert.equal(partie.headers.get('content-range'), 'bytes 0-3/16');
    assert.equal(await partie.text(), '%PDF');
    const fin = await fetch(`${adresse}/supports/Rust/Slides%201.pdf`, { headers: { Range: 'bytes=-7' } });
    assert.equal(await fin.text(), 'exemple');
    const hors = await fetch(`${adresse}/supports/Rust/Slides%201.pdf`, { headers: { Range: 'bytes=100-' } });
    await hors.text();
    assert.equal(hors.status, 416);
  });

  it('lit les plages d’octets demandées', () => {
    assert.deepEqual(lirePlage('bytes=2-5', 10), { debut: 2, fin: 5 });
    assert.deepEqual(lirePlage('bytes=8-', 10), { debut: 8, fin: 9 });
    assert.deepEqual(lirePlage('bytes=-3', 10), { debut: 7, fin: 9 });
    assert.deepEqual(lirePlage('bytes=5-50', 10), { debut: 5, fin: 9 });
    assert.equal(lirePlage(undefined, 10), undefined);
    assert.equal(lirePlage('bytes=0-1,4-5', 10), undefined);
    assert.equal(lirePlage('bytes=12-', 10), null);
  });

  it('isole les supports interactifs dans un bac à sable', async () => {
    const { statut, entetes } = await appeler('GET', '/supports/Rust/page.html');
    assert.equal(statut, 200);
    assert.match(entetes.get('content-security-policy'), /^sandbox allow-scripts allow-popups/);
  });

  it('refuse les supports absents, hors dossier ou d’un autre type', async () => {
    const absent = await appeler('GET', '/supports/Rust/absent.pdf');
    assert.equal(absent.statut, 404);
    assert.match(absent.donnees, /Support introuvable/);
    assert.equal((await appeler('GET', '/supports/Rust/notes.md')).statut, 404);
    assert.equal((await appeler('GET', '/supports/Rust/%2e%2e%2f%2e%2e%2findex.html')).statut, 404);
  });

  it('refuse de sortir du dossier du site', async () => {
    assert.equal((await appeler('GET', '/%2e%2e/secret.txt')).statut, 404);
  });

  it('refuse un hôte qui n’est pas local', async () => {
    const http = await import('node:http');
    const statut = await new Promise((resoudre, rejeter) => {
      http.get({ host: '127.0.0.1', port: serveur.address().port, path: '/', headers: { Host: 'pirate.test' } }, (reponse) => {
        reponse.resume();
        resoudre(reponse.statusCode);
      }).on('error', rejeter);
    });
    assert.equal(statut, 403);
  });

  it('exige le jeton, du JSON et une origine locale pour chaque POST', async () => {
    const corps = { code: 'fn main() {}' };
    assert.equal((await appeler('POST', '/api/rust/executer', corps, { Cookie: '' })).statut, 403);
    assert.equal((await appeler('POST', '/api/rust/executer', corps, { Cookie: 'esgi_jeton_1=faux' })).statut, 403);
    assert.equal((await appeler('POST', '/api/rust/executer', corps, { 'Content-Type': 'text/plain' })).statut, 415);
    assert.equal((await appeler('POST', '/api/python/verifier', corps, { Origin: 'http://exemple.com' })).statut, 403);
  });

  it('répond 404 pour une route ou un exercice inconnu', async () => {
    assert.equal((await appeler('GET', '/api/inconnue')).statut, 404);
    const absent = await appeler('POST', '/api/rust/verifier', { chapitreId: '01-bases', exerciceId: '99-absent', code: '' });
    assert.equal(absent.statut, 404);
    const dangereux = await appeler('POST', '/api/rust/verifier', { chapitreId: '..', exerciceId: 'x', code: '' });
    assert.equal(dangereux.statut, 404);
  });

  it('exige du code', async () => {
    assert.equal((await appeler('POST', '/api/rust/executer', {})).statut, 400);
  });

  it('donne les versions de cargo et de clippy', { skip: sansRust }, async () => {
    const { donnees } = await appeler('GET', '/api/etat');
    assert.match(donnees.cargo, /cargo/);
    assert.equal(donnees.clippy, outils.clippy);
  });

  it('vérifie un exercice et exécute un programme', { skip: sansRust }, async () => {
    const echec = await appeler('POST', '/api/rust/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: CODE_DEPART });
    assert.equal(echec.donnees.statut, 'echec');
    const reussite = await appeler('POST', '/api/rust/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: CODE_SOLUTION });
    assert.equal(reussite.donnees.statut, 'reussi');
    const execution = await appeler('POST', '/api/rust/executer', { code: 'fn main() {\n    println!("Salut");\n}\n' });
    assert.equal(execution.donnees.sortie.trim(), 'Salut');
  });

  it('refuse un langage inconnu', async () => {
    assert.equal((await appeler('POST', '/api/cobol/executer', { code: '' })).statut, 404);
  });

  it('vérifie un exercice Python, avec une entrée pour un exercice de type sortie', { skip: sansPython }, async () => {
    const echec = await appeler('POST', '/api/python/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: PYTHON_DEPART });
    assert.equal(echec.donnees.statut, 'echec');
    const reussite = await appeler('POST', '/api/python/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: PYTHON_SOLUTION });
    assert.equal(reussite.donnees.statut, 'reussi');
    const salut = await appeler('POST', '/api/python/verifier', { chapitreId: '01-bases', exerciceId: '02-saluer', code: 'nom = input()\nprint(f"Bonjour {nom}")\n' });
    assert.equal(salut.donnees.statut, 'reussi');
    const execution = await appeler('POST', '/api/python/executer', { code: 'print(input() * 2)\n', entree: 'ab' });
    assert.equal(execution.donnees.sortie.trim(), 'abab');
  });

  it('coupe une sortie trop longue', { skip: sansPython }, async () => {
    const { donnees } = await appeler('POST', '/api/python/executer', { code: 'print("x" * 50000)\n' });
    assert.equal(donnees.statut, 'execute');
    assert.ok(donnees.sortie.length < 20_100);
    assert.match(donnees.sortie, /… \(sortie coupée\)$/);
  });

  it('vérifie un exercice C', { skip: sansGcc }, async () => {
    const echec = await appeler('POST', '/api/c/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: C_DEPART });
    assert.equal(echec.donnees.statut, 'echec');
    const reussite = await appeler('POST', '/api/c/verifier', { chapitreId: '01-bases', exerciceId: '01-double', code: C_SOLUTION });
    assert.equal(reussite.donnees.statut, 'reussi');
  });

  it('donne l’état de tous les outils, et le recalcule sur demande', { skip: sansCompilation && 'ESGI_SANS_COMPILATION=1' }, async () => {
    const { donnees } = await appeler('GET', '/api/etat');
    assert.deepEqual(Object.keys(donnees).sort(), ['cargo', 'clippy', 'gcc', 'python']);
    const rafraichi = await appeler('GET', '/api/etat?rafraichir=1');
    assert.deepEqual(rafraichi.donnees, donnees);
  });

  it('donne le sommaire d’un domaine de code sans les questions du quiz', async () => {
    const { statut, donnees } = await appeler('GET', '/api/sommaire/rust');
    assert.equal(statut, 200);
    const [chapitre] = donnees.chapitres;
    assert.equal(chapitre.id, '01-bases');
    assert.equal(chapitre.nombreQuestions, 1);
    assert.equal(chapitre.quiz, undefined);
    assert.deepEqual(chapitre.exercices[0].indices, ['Multiplie par 2']);
  });

  it('donne le sommaire d’un domaine à réponses dans l’ordre du programme', async () => {
    const { donnees } = await appeler('GET', '/api/sommaire/maths');
    assert.deepEqual(donnees.matieres, [{ id: 'informatique', titre: 'Maths' }]);
    assert.deepEqual(donnees.chapitres, [{ titre: 'Suites', matieres: ['informatique'], id: '01-suites', exercices: [{ id: 'e1', titre: 'Un' }], nombreQuestions: 2 }]);
    assert.deepEqual((await appeler('GET', '/api/sommaire/anglais')).donnees, { matieres: [], chapitres: [] });
    assert.equal((await appeler('GET', '/api/sommaire/inconnu')).statut, 404);
  });

  it('recalcule le sommaire quand le contenu change', async () => {
    assert.equal((await appeler('GET', '/api/sommaire/maths')).donnees.chapitres[0].titre, 'Suites');
    await fs.writeFile(path.join(racine, 'contenu', 'maths', '01-suites', 'chapitre.json'), JSON.stringify({ titre: 'Suites et séries', matieres: ['informatique'] }));
    let titre;
    for (let essai = 0; essai < 50; essai++) {
      titre = (await appeler('GET', '/api/sommaire/maths')).donnees.chapitres[0].titre;
      if (titre === 'Suites et séries') break;
      await new Promise((resoudre) => setTimeout(resoudre, 50));
    }
    assert.equal(titre, 'Suites et séries');
  });
});

describe('exécuteurs du serveur', () => {
  it('a un exécuteur pour chaque domaine de code', () => {
    for (const domaine of Object.keys(DOMAINES_CODE)) {
      const langage = langageDe(domaine);
      assert.ok(['rust', 'python', 'c'].includes(langage), domaine);
      for (const fonction of ['executerProgramme', 'verifierExercice', 'viderCacheOutils']) {
        assert.equal(typeof EXECUTEURS[langage][fonction], 'function', `${domaine} : ${fonction}`);
      }
    }
  });
});

describe('routes de la progression', () => {
  let racine;
  const serveurs = [];

  async function demarrer(options) {
    const serveur = creerServeur({ racine, dossierContenu: path.join(racine, 'contenu'), ...options });
    serveurs.push(serveur);
    await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre));
    const port = serveur.address().port;
    return { adresse: `http://127.0.0.1:${port}`, cookie: await obtenirCookie(port) };
  }

  before(async () => {
    racine = await creerDossierTemporaire();
    await fs.writeFile(path.join(racine, 'index.html'), PAGE);
    await fs.mkdir(path.join(racine, 'contenu'));
  });

  after(async () => {
    for (const serveur of serveurs) await new Promise((resoudre) => serveur.close(resoudre));
    await supprimerDossier(racine);
  });

  it('répond inactive sans progression', async () => {
    const { adresse, cookie } = await demarrer({});
    const reponse = await fetch(`${adresse}/api/progression`);
    assert.deepEqual(await reponse.json(), { active: false });
    const ecriture = await fetch(`${adresse}/api/progression`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ changements: [] }),
    });
    assert.equal(ecriture.status, 404);
    assert.deepEqual(await ecriture.json(), { erreur: 'Route inconnue' });
  });

  it('refuse l’écriture sans cookie, puis enregistre avec', async () => {
    const progression = creerProgression(path.join(racine, 'donnees', 'progression.json'));
    const { adresse, cookie } = await demarrer({ progression });
    const corps = JSON.stringify({ changements: [{ partie: 'saisies', cle: 'k', valeur: 'v', faitLe: 5 }] });
    const sansCookie = await fetch(`${adresse}/api/progression`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corps });
    assert.equal(sansCookie.status, 403);

    const vide = await (await fetch(`${adresse}/api/progression`)).json();
    assert.equal(vide.active, true);
    assert.equal(vide.existe, false);

    const ecriture = await fetch(`${adresse}/api/progression`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: corps });
    assert.equal(ecriture.status, 200);
    assert.deepEqual(await ecriture.json(), { retenus: [{ partie: 'saisies', cle: 'k', valeur: 'v' }] });

    const lu = await (await fetch(`${adresse}/api/progression`)).json();
    assert.equal(lu.existe, true);
    assert.equal(lu.progression.saisies.k, 'v');
    assert.equal(lu.dates['saisies/k'], 5);

    const ancien = await fetch(`${adresse}/api/progression`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ changements: [{ partie: 'saisies', cle: 'k', valeur: 'ancien', faitLe: 4 }] }) });
    assert.deepEqual(await ancien.json(), { retenus: [{ partie: 'saisies', cle: 'k', valeur: 'v' }] });

    const invalide = await fetch(`${adresse}/api/progression`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ changements: [{ partie: 'x', cle: 'k', valeur: 1, faitLe: 1 }] }) });
    assert.equal(invalide.status, 400);
  });
});
