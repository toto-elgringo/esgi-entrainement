import assert from 'node:assert/strict';
import fs from 'node:fs';
import { afterEach, describe, it } from 'node:test';
import { argumentsEnfermement, BWRAP, modeEnfermement, verifierEnfermement } from '../serveur/enfermement.js';
import { lancer } from '../serveur/processus.js';
import { executerProgramme as executerC } from '../serveur/c.js';
import { executerProgramme as executerPython } from '../serveur/python.js';

const ancienMode = process.env.ESGI_ENFERMEMENT;
const enfermementReel = ancienMode === 'bwrap' ? false : 'ESGI_ENFERMEMENT=bwrap : essai réel seulement sur hermes';

function remettreMode() {
  if (ancienMode === undefined) delete process.env.ESGI_ENFERMEMENT;
  else process.env.ESGI_ENFERMEMENT = ancienMode;
}

function valeurApres(args, option, nom) {
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === option && args[index + 1] === nom) return args[index + 2];
  }
  return undefined;
}

describe('enfermement des programmes', () => {
  afterEach(remettreMode);

  it('passe par bwrap avec la maison cachée et sans réseau', () => {
    const { commande, args } = argumentsEnfermement({
      commande: 'python3',
      args: ['-c', 'print(1)'],
      dossier: '/tmp/atelier-1',
      env: { ESGI_MARQUEUR: 'x' },
      lectureSeule: ['/home/hermes/.rustup'],
    });
    assert.equal(commande, '/usr/bin/bwrap');
    assert.ok(args.includes('--unshare-all'));
    assert.ok(args.includes('--clearenv'));
    assert.ok(args.includes('--die-with-parent'));
    assert.ok(args.join(' ').includes('--tmpfs /home'));
    assert.ok(args.join(' ').includes('--bind /tmp/atelier-1 /tmp/atelier-1'));
    assert.ok(args.join(' ').includes('--ro-bind /home/hermes/.rustup /home/hermes/.rustup'));
    assert.ok(args.join(' ').includes('--chdir /tmp/atelier-1'));
    assert.equal(valeurApres(args, '--setenv', 'ESGI_MARQUEUR'), 'x');
    assert.equal(valeurApres(args, '--setenv', 'HOME'), '/tmp/atelier-1');
    assert.equal(valeurApres(args, '--setenv', 'CARGO_HOME'), '/tmp/atelier-1/.cargo');
    assert.deepEqual(args.slice(-4), ['--', 'python3', '-c', 'print(1)']);
  });

  it('monte la maison cachée avant le dossier de travail', () => {
    const { args } = argumentsEnfermement({ commande: 'gcc', args: [], dossier: '/home/hermes/atelier', env: {}, lectureSeule: [] });
    const texte = args.join(' ');
    assert.ok(texte.indexOf('--tmpfs /home') < texte.indexOf('--bind /home/hermes/atelier /home/hermes/atelier'));
  });

  it('lit le mode dans ESGI_ENFERMEMENT', () => {
    delete process.env.ESGI_ENFERMEMENT;
    assert.equal(modeEnfermement(), null);
    process.env.ESGI_ENFERMEMENT = 'bwrap';
    assert.equal(modeEnfermement(), 'bwrap');
  });

  it('refuse de démarrer si bwrap manque', () => {
    process.env.ESGI_ENFERMEMENT = 'bwrap';
    assert.throws(() => verifierEnfermement({ chemin: '/inexistant/bwrap' }), /bwrap introuvable : exécution refusée/);
    delete process.env.ESGI_ENFERMEMENT;
    assert.doesNotThrow(() => verifierEnfermement({ chemin: '/inexistant/bwrap' }));
  });

  it('lance les programmes par bwrap quand le mode est actif', { skip: fs.existsSync(BWRAP) && 'bwrap présent : couvert par les essais réels' }, async () => {
    process.env.ESGI_ENFERMEMENT = 'bwrap';
    const resultat = await lancer(process.execPath, ['--version'], { delai: 15_000 });
    assert.equal(resultat.introuvable, true);
    delete process.env.ESGI_ENFERMEMENT;
    assert.equal((await lancer(process.execPath, ['--version'], { delai: 15_000 })).code, 0);
  });

  it('cache le dossier personnel à un programme Python', { skip: enfermementReel }, async () => {
    const resultat = await executerPython('import os\nprint(os.listdir("/home"))\n');
    assert.equal(resultat.statut, 'execute', resultat.sortie);
    assert.equal(resultat.sortie.trim(), '[]');
  });

  it('coupe le réseau d’un programme Python', { skip: enfermementReel }, async () => {
    const resultat = await executerPython('import socket\nsocket.create_connection(("1.1.1.1", 53), timeout=2)\nprint("connecte")\n');
    assert.doesNotMatch(resultat.sortie, /connecte/);
  });

  it('empêche un programme C de lire les clés SSH', { skip: enfermementReel }, async () => {
    const code = '#include <stdio.h>\nint main(void) {\n  FILE *f = fopen("/home/hermes/.ssh/id_ed25519", "r");\n  printf(f == NULL ? "cache\n" : "lu\n");\n  return 0;\n}\n';
    const resultat = await executerC(code);
    assert.equal(resultat.statut, 'execute', resultat.sortie);
    assert.equal(resultat.sortie.trim(), 'cache');
  });
});
