import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { executerProgramme as executerC } from '../serveur/c.js';
import { ecrireFichierNeuf, recreerDossier } from '../serveur/processus.js';
import { executerProgramme as executerRust } from '../serveur/rust.js';
import { creerDossierTemporaire, supprimerDossier } from './aide.js';

const TEMOIN = 'ne pas toucher';
const enfermementReel = process.env.ESGI_ENFERMEMENT === 'bwrap' ? false : 'ESGI_ENFERMEMENT=bwrap : essai réel seulement sur hermes';

async function lienPossible(dossier) {
  try {
    await fs.symlink(path.join(dossier, 'absent'), path.join(dossier, 'essai-lien'));
    await fs.rm(path.join(dossier, 'essai-lien'));
    return false;
  } catch {
    return 'liens symboliques interdits sur cette machine';
  }
}

describe('ateliers : le serveur n’écrit jamais à travers un lien', () => {
  let dossier;
  let temoin;
  let sansLien;

  before(async () => {
    dossier = await creerDossierTemporaire();
    temoin = path.join(dossier, 'temoin.txt');
    await fs.writeFile(temoin, TEMOIN);
    sansLien = await lienPossible(dossier);
  });

  after(async () => {
    await supprimerDossier(dossier);
  });

  it('remplace un lien par un vrai fichier sans toucher sa cible', async (t) => {
    if (sansLien) return t.skip(sansLien);
    const fichier = path.join(dossier, 'programme.c');
    await fs.symlink(temoin, fichier);
    await ecrireFichierNeuf(fichier, 'int main(void) { return 0; }');
    assert.equal(await fs.readFile(temoin, 'utf8'), TEMOIN);
    assert.equal((await fs.lstat(fichier)).isSymbolicLink(), false);
    assert.equal(await fs.readFile(fichier, 'utf8'), 'int main(void) { return 0; }');
  });

  it('remplace un dossier lien par un vrai dossier vide', async (t) => {
    if (sansLien) return t.skip(sansLien);
    const cible = path.join(dossier, 'cible');
    await fs.mkdir(cible);
    await fs.writeFile(path.join(cible, 'main.rs'), TEMOIN);
    const src = path.join(dossier, 'src');
    await fs.symlink(cible, src, 'dir');
    await recreerDossier(src);
    assert.equal((await fs.lstat(src)).isDirectory(), true);
    assert.deepEqual(await fs.readdir(src), []);
    assert.equal(await fs.readFile(path.join(cible, 'main.rs'), 'utf8'), TEMOIN);
  });

  it('un programme C enfermé ne peut pas faire écrire le serveur hors de son atelier', { skip: enfermementReel }, async () => {
    const piege = await fs.mkdtemp(path.join(os.tmpdir(), 'esgi-piege-'));
    const cible = path.join(piege, 'temoin.txt');
    await fs.writeFile(cible, TEMOIN);
    const code = `#include <stdio.h>\nint unlink(const char *chemin);\nint symlink(const char *cible, const char *lien);\nint main(void) {\n  unlink("programme.c");\n  symlink("${cible}", "programme.c");\n  puts("pose");\n  return 0;\n}\n`;
    assert.equal((await executerC(code)).statut, 'execute');
    await executerC('#include <stdio.h>\nint main(void) { puts("pirate"); return 0; }\n');
    assert.equal(await fs.readFile(cible, 'utf8'), TEMOIN);
    await fs.rm(piege, { recursive: true, force: true });
  });

  it('un programme Rust enfermé ne peut pas faire écrire le serveur hors de son atelier', { skip: enfermementReel }, async () => {
    const piege = await fs.mkdtemp(path.join(os.tmpdir(), 'esgi-piege-'));
    await fs.writeFile(path.join(piege, 'main.rs'), TEMOIN);
    const code = `fn main() {\n    std::fs::remove_dir_all("src").unwrap();\n    std::os::unix::fs::symlink("${piege}", "src").unwrap();\n    println!("pose");\n}\n`;
    assert.equal((await executerRust(code)).statut, 'execute');
    await executerRust('fn main() { println!("pirate"); }\n');
    assert.equal(await fs.readFile(path.join(piege, 'main.rs'), 'utf8'), TEMOIN);
    await fs.rm(piege, { recursive: true, force: true });
  });
});
