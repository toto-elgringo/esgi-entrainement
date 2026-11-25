import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { commandeDistante, enteteEnvoi, listerSupports, RECEPTEUR, supportsAEnvoyer, verifierBranche, verifierDossierPropre } from '../scripts/deployer.mjs';
import { creerDossierTemporaire, supprimerDossier } from './aide.js';

const python = ['python3', 'python', 'py'].find((commande) => spawnSync(commande, ['-c', 'import sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)']).status === 0);

describe('déploiement sur hermes', () => {
  let contenu;

  before(async () => {
    contenu = await creerDossierTemporaire();
    const chapitre = async (domaine, nom, supports) => {
      await fs.mkdir(path.join(contenu, domaine, nom), { recursive: true });
      await fs.writeFile(path.join(contenu, domaine, nom, 'chapitre.json'), JSON.stringify({ titre: nom, supports }));
    };
    await chapitre('rust', '01-bases', [{ titre: 'Slides', fichier: 'Rust/Sources/slides 1.pdf' }]);
    await chapitre('anglais', '01-cours', [{ titre: 'Cours', fichier: 'Anglais/Sources/cours.pdf' }, { titre: 'Encore', fichier: 'Rust/Sources/slides 1.pdf' }]);
    await chapitre('maths', '01-suites', undefined);
  });

  after(async () => {
    await supprimerDossier(contenu);
  });

  it('liste les supports déclarés sans doublon', async () => {
    assert.deepEqual(await listerSupports(contenu), ['Anglais/Sources/cours.pdf', 'Rust/Sources/slides 1.pdf']);
  });

  it('met de côté les modifications avant d’aligner hermes sur main', () => {
    const commande = commandeDistante({ dossier: '~/dev/esgi-entrainement', branche: 'main' });
    const etapes = [
      'cd ~/dev/esgi-entrainement',
      'git fetch -q origin',
      'git stash push -q -m avant-deploiement',
      'git checkout -q main',
      'git pull -q --ff-only origin main',
      'bash scripts/hermes/installer.sh',
      'git log --oneline -1',
    ];
    let position = -1;
    for (const etape of etapes) {
      const suivante = commande.indexOf(etape, position + 1);
      assert.ok(suivante > position, `${etape} manque ou n’est pas à sa place`);
      position = suivante;
    }
  });

  it('ne met pas de côté les fichiers non suivis (sauvegardes d’avancement)', () => {
    assert.doesNotMatch(commandeDistante({ dossier: '~/dev/esgi-entrainement', branche: 'main' }), /stash push[^&]*-u/);
  });

  it('n’envoie que les supports absents ou changés sur hermes', () => {
    const locaux = [
      { chemin: 'Rust/a.pdf', taille: 10 },
      { chemin: 'Rust/b.pdf', taille: 20 },
      { chemin: 'Anglais/c.pdf', taille: 30 },
    ];
    const distants = new Map([['Rust/a.pdf', 10], ['Rust/b.pdf', 5]]);
    assert.deepEqual(supportsAEnvoyer(locaux, distants), ['Rust/b.pdf', 'Anglais/c.pdf']);
  });

  it('ignore les supports qui sont des liens web', async () => {
    await fs.mkdir(path.join(contenu, 'web', '01-lien'), { recursive: true });
    await fs.writeFile(path.join(contenu, 'web', '01-lien', 'chapitre.json'), JSON.stringify({ supports: [{ titre: 'Doc', url: 'https://exemple.fr' }] }));
    assert.deepEqual(await listerSupports(contenu), ['Anglais/Sources/cours.pdf', 'Rust/Sources/slides 1.pdf']);
  });

  it('écrit l’en-tête d’envoi avec la taille et le chemin', () => {
    assert.equal(enteteEnvoi('Rust/Sources/[Slides] Premiers pas.html', 42), '42 Rust/Sources/[Slides] Premiers pas.html\n');
  });

  it('refuse un chemin de support qui sortirait du dossier', () => {
    for (const chemin of ['../.ssh/authorized_keys', '/etc/passwd', 'Rust/../../x', 'a\nb', '']) {
      assert.throws(() => enteteEnvoi(chemin, 1), /Chemin de support refusé/, JSON.stringify(chemin));
    }
  });

  it('range les fichiers reçus sur hermes, crochets et accents compris', { skip: python ? false : 'Python introuvable' }, async () => {
    const arrivee = await creerDossierTemporaire();
    try {
      const fichiers = [
        ['Rust/Sources/[Slides] Premiers pas.html', Buffer.from('<p>slides</p>')],
        ['Cours électif/Sources/[carte] (v2).pdf', Buffer.from([0, 1, 2, 255])],
      ];
      const flux = Buffer.concat(fichiers.flatMap(([chemin, octets]) => [Buffer.from(enteteEnvoi(chemin, octets.length)), octets]));
      const resultat = spawnSync(python, ['-c', RECEPTEUR, arrivee], { input: flux });
      assert.equal(resultat.status, 0, resultat.stderr.toString());
      for (const [chemin, octets] of fichiers) assert.deepEqual(await fs.readFile(path.join(arrivee, chemin)), octets);
    } finally {
      await supprimerDossier(arrivee);
    }
  });

  it('le récepteur refuse un chemin qui sort du dossier', { skip: python ? false : 'Python introuvable' }, async () => {
    const arrivee = await creerDossierTemporaire();
    try {
      const resultat = spawnSync(python, ['-c', RECEPTEUR, path.join(arrivee, 'supports')], { input: Buffer.from('3 ../pirate.txt\nabc') });
      assert.notEqual(resultat.status, 0);
      await assert.rejects(fs.access(path.join(arrivee, 'pirate.txt')));
    } finally {
      await supprimerDossier(arrivee);
    }
  });

  it('refuse une autre branche que main', () => {
    assert.throws(() => verifierBranche('dev'), { message: 'Déploiement refusé : branche "dev", il faut être sur main.' });
    assert.doesNotThrow(() => verifierBranche('main'));
  });

  it('refuse un dossier qui n’est pas propre', () => {
    assert.throws(() => verifierDossierPropre(' M a.js\n'), /Déploiement refusé : le dossier n'est pas propre/);
    assert.throws(() => verifierDossierPropre(null), /git status n'a pas pu être lu/);
    assert.doesNotThrow(() => verifierDossierPropre(''));
  });
});
