import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { commandeDistante, listerSupports, lotSftp, supportsAEnvoyer, verifierBranche, verifierDossierPropre } from '../scripts/deployer.mjs';
import { creerDossierTemporaire, supprimerDossier } from './aide.js';

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

  it('prépare les commandes sftp avec les dossiers et les guillemets', () => {
    const lot = lotSftp(['Anglais professionnel/Sources/cours du 14 sep.pdf'], 'C:/Obsidian/Cours - ESGI', 'esgi-entrainement-supports');
    assert.equal(lot, [
      '-mkdir "esgi-entrainement-supports"',
      '-mkdir "esgi-entrainement-supports/Anglais professionnel"',
      '-mkdir "esgi-entrainement-supports/Anglais professionnel/Sources"',
      'put "C:/Obsidian/Cours - ESGI/Anglais professionnel/Sources/cours du 14 sep.pdf" "esgi-entrainement-supports/Anglais professionnel/Sources/cours du 14 sep.pdf"',
      '',
    ].join('\n'));
  });

  it('refuse un nom de support avec un guillemet', () => {
    assert.throws(() => lotSftp(['Rust/"pirate".pdf'], 'C:/x', 'y'), /guillemet/);
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
