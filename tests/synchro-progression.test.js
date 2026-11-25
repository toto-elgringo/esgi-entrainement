import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { appliquerChangement, progressionVide } from '../js/fusion-progression.js';
import { creerStockage } from '../js/stockage.js';
import { creerSynchroProgression } from '../js/synchro-progression.js';

const MAINTENANT = 1_800_000_000_000;
const ATTENTE = 'esgi-entrainement-attente';
const SYNCHRONISE = 'esgi-entrainement-synchronise';

function fausseMemoire(depart = {}) {
  const valeurs = new Map(Object.entries(depart));
  return {
    valeurs,
    getItem: (cle) => valeurs.get(cle) ?? null,
    setItem: (cle, valeur) => valeurs.set(cle, valeur),
  };
}

function fauxServeur({ active = true, existe = true, progression = {}, dates = {}, supprimes = {}, surEnvoi = () => 200 } = {}) {
  const etat = { progression: { ...progressionVide(), ...structuredClone(progression) }, dates: { ...dates }, supprimes: { ...supprimes } };
  const appels = [];
  async function requete(methode, corps, options = {}) {
    appels.push({ methode, corps: structuredClone(corps), options });
    if (methode === 'GET') return { statut: 200, donnees: active ? structuredClone({ active, existe, ...etat }) : { active: false } };
    const statut = await surEnvoi(corps);
    if (statut !== 200) return { statut, donnees: { erreur: 'refusé' } };
    const retenus = [];
    for (const changement of corps.changements) {
      const { valeur } = appliquerChangement(etat, changement);
      retenus.push({ partie: changement.partie, cle: changement.cle, valeur });
    }
    return { statut: 200, donnees: structuredClone({ retenus }) };
  }
  return { etat, appels, requete, envois: () => appels.filter((appel) => appel.methode === 'POST') };
}

function preparer({ serveur, local, attente, synchronise = true, maintenant = () => MAINTENANT, apresRelecture }) {
  const memoire = fausseMemoire({
    ...(local ? { 'esgi-entrainement': JSON.stringify(local) } : {}),
    ...(attente ? { [ATTENTE]: JSON.stringify(attente) } : {}),
    ...(synchronise ? { [SYNCHRONISE]: '1' } : {}),
  });
  const stockage = creerStockage({ memoire });
  const renouvelerJeton = mock.fn(async () => {});
  const signalerErreur = mock.fn();
  const synchro = creerSynchroProgression({ stockage, memoire, requete: serveur.requete, renouvelerJeton, maintenant, signalerErreur, apresRelecture });
  const attenteLue = () => JSON.parse(memoire.getItem(ATTENTE) ?? '[]');
  return { memoire, stockage, synchro, renouvelerJeton, signalerErreur, attenteLue };
}

const laisserFinir = () => new Promise((resoudre) => setImmediate(resoudre));

describe('synchronisation de la progression', () => {
  it('ne fait rien si le serveur répond active:false', async () => {
    const serveur = fauxServeur({ active: false });
    const { synchro, stockage, memoire } = preparer({ serveur, local: { exercices: { a: { essais: 1, reussi: true } } }, synchronise: false });
    await synchro.demarrer();
    stockage.enregistrerEssai('b', true);
    await synchro.envoyer();
    await laisserFinir();
    assert.equal(serveur.appels.length, 1);
    assert.equal(memoire.getItem(ATTENTE), null);
    assert.equal(memoire.getItem(SYNCHRONISE), null);
    assert.deepEqual(Object.keys(stockage.progression().exercices).sort(), ['a', 'b']);
  });

  it('première synchronisation : envoie tout le contenu local, puis note synchronise', async () => {
    const serveur = fauxServeur({ existe: false });
    const local = {
      exercices: { a: { essais: 2, reussi: true }, abime: { essais: 'beaucoup' } },
      quiz: { q: { score: 3, total: 4 } },
      saisies: { s: { 0: '12' } },
      codes: { c: 'fn main() {}' },
      partiesQuiz: { p: { reponses: { 0: 1 } } },
      affichages: { s: { indices: 1 } },
      theme: 'clair',
    };
    const { synchro, stockage, memoire, attenteLue } = preparer({ serveur, local, synchronise: false });
    await synchro.demarrer();
    const envois = serveur.envois();
    assert.equal(envois.length, 1);
    const envoyes = envois[0].corps.changements.map(({ partie, cle, faitLe }) => `${partie}/${cle}/${faitLe}`).sort();
    assert.deepEqual(envoyes, ['affichages/s', 'codes/c', 'exercices/a', 'partiesQuiz/p', 'quiz/q', 'saisies/s'].map((id) => `${id}/1`));
    assert.equal(memoire.getItem(SYNCHRONISE), '1');
    assert.deepEqual(attenteLue(), []);
    assert.deepEqual(serveur.etat.progression.exercices, { a: { essais: 2, reussi: true } });
    assert.deepEqual(stockage.progression().quiz, { q: { score: 3, total: 4 } });
    assert.equal(stockage.theme(), 'clair');
  });

  it('première synchronisation : hermes reste la référence (remise à zéro et valeur plus récente gardées, clé inconnue ajoutée)', async () => {
    const serveur = fauxServeur({
      progression: { codes: { x: 'hermes' } },
      dates: { 'codes/x': 100 },
      supprimes: { 'exercices/a': 100 },
    });
    const local = { exercices: { a: { essais: 3, reussi: true } }, codes: { x: 'appareil', y: 'nouveau' } };
    const { synchro, stockage, attenteLue } = preparer({ serveur, local, synchronise: false });
    await synchro.demarrer();
    assert.deepEqual(stockage.progression().exercices, {});
    assert.deepEqual(serveur.etat.progression.exercices, {});
    assert.deepEqual(stockage.progression().codes, { x: 'hermes', y: 'nouveau' });
    assert.deepEqual(serveur.etat.progression.codes, { x: 'hermes', y: 'nouveau' });
    assert.deepEqual(attenteLue(), []);
  });

  it('première synchronisation : ne remplace pas un changement déjà en attente', async () => {
    const serveur = fauxServeur({ progression: { codes: { x: 'hermes' } }, dates: { 'codes/x': 100 } });
    const attente = [{ partie: 'codes', cle: 'x', valeur: 'appareil', faitLe: MAINTENANT }];
    const { synchro, stockage } = preparer({ serveur, local: { codes: { x: 'appareil' } }, attente, synchronise: false });
    await synchro.demarrer();
    assert.equal(stockage.code('x'), 'appareil');
    assert.equal(serveur.etat.progression.codes.x, 'appareil');
  });

  it('première synchronisation : si l’attente ne peut pas être écrite, garde l’état local et ne note pas synchronise', async () => {
    const serveur = fauxServeur({ progression: { codes: { x: 'hermes' } }, dates: { 'codes/x': 100 } });
    const memoire = fausseMemoire({ 'esgi-entrainement': JSON.stringify({ codes: { x: 'appareil' }, exercices: { a: { essais: 1, reussi: true } } }) });
    const ecrireVraiment = memoire.setItem;
    memoire.setItem = (cle, valeur) => {
      if (cle === ATTENTE) throw new Error('stockage plein');
      ecrireVraiment(cle, valeur);
    };
    const stockage = creerStockage({ memoire });
    const signalerErreur = mock.fn();
    const synchro = creerSynchroProgression({ stockage, memoire, requete: serveur.requete, maintenant: () => MAINTENANT, signalerErreur });
    await synchro.demarrer();
    assert.equal(memoire.getItem(SYNCHRONISE), null);
    assert.deepEqual(stockage.progression().codes, { x: 'appareil' });
    assert.deepEqual(stockage.progression().exercices, { a: { essais: 1, reussi: true } });
    assert.equal(signalerErreur.mock.callCount(), 1);
    assert.equal(serveur.envois().length, 0);
  });

  it('une relecture ne remet pas une ancienne valeur si un envoi aboutit pendant le GET', async () => {
    const serveur = fauxServeur({ progression: { codes: { x: 'ancien' } }, dates: { 'codes/x': MAINTENANT - 10 } });
    let retenir = false;
    let repondre;
    const requete = async (methode, ...reste) => {
      if (methode === 'GET' && retenir) {
        retenir = false;
        const photo = await serveur.requete(methode, ...reste);
        return new Promise((resoudre) => { repondre = () => resoudre(photo); });
      }
      return serveur.requete(methode, ...reste);
    };
    const { synchro, stockage, attenteLue } = preparer({ serveur: { requete } });
    await synchro.demarrer();
    retenir = true;
    const relecture = synchro.demarrer();
    await laisserFinir();
    stockage.enregistrerCode('x', 'nouveau');
    stockage.ecrireMaintenant();
    await synchro.envoyer();
    assert.equal(serveur.etat.progression.codes.x, 'nouveau');
    repondre();
    await relecture;
    assert.equal(stockage.code('x'), 'nouveau');
    assert.deepEqual(attenteLue(), []);
  });

  it('attend l’envoi en cours avant de relire le serveur', async () => {
    const serveur = fauxServeur({ progression: { codes: { x: 'ancien' } }, dates: { 'codes/x': MAINTENANT - 10 } });
    let liberer;
    let retenir = false;
    const requete = async (methode, ...reste) => {
      if (methode === 'POST' && retenir) {
        retenir = false;
        await new Promise((resoudre) => { liberer = resoudre; });
      }
      return serveur.requete(methode, ...reste);
    };
    const { synchro, stockage } = preparer({ serveur: { requete } });
    await synchro.demarrer();
    retenir = true;
    stockage.enregistrerCode('x', 'nouveau');
    stockage.ecrireMaintenant();
    const envoi = synchro.envoyer();
    const relecture = synchro.demarrer();
    await laisserFinir();
    assert.equal(serveur.appels.filter((appel) => appel.methode === 'GET').length, 1);
    liberer();
    await envoi;
    await relecture;
    assert.equal(serveur.appels.filter((appel) => appel.methode === 'GET').length, 2);
    assert.equal(stockage.code('x'), 'nouveau');
  });

  it('à l’ouverture, l’état du serveur remplace l’état local, avec l’attente réappliquée par-dessus', async () => {
    const serveur = fauxServeur({ progression: { exercices: { b: { essais: 3, reussi: true } }, codes: { c: 'serveur' } } });
    const attente = [{ partie: 'codes', cle: 'd', valeur: 'en attente', faitLe: MAINTENANT - 10 }];
    const { synchro, stockage, attenteLue } = preparer({ serveur, local: { exercices: { a: { essais: 1, reussi: false } }, codes: { c: 'local' } }, attente });
    await synchro.demarrer();
    assert.deepEqual(stockage.progression().exercices, { b: { essais: 3, reussi: true } });
    assert.deepEqual(stockage.progression().codes, { c: 'serveur', d: 'en attente' });
    assert.deepEqual(serveur.envois().map((envoi) => envoi.corps.changements), [attente]);
    assert.deepEqual(attenteLue(), []);
  });

  it('un exercice remis à zéro sur le serveur ne revient pas d’un appareil déjà synchronisé', async () => {
    const serveur = fauxServeur({ supprimes: { 'exercices/a': MAINTENANT - 500 } });
    const attente = [{ partie: 'exercices', cle: 'a', valeur: { essais: 4, reussi: true }, faitLe: MAINTENANT - 1000 }];
    const { synchro, stockage, attenteLue } = preparer({ serveur, local: { exercices: { a: { essais: 4, reussi: true } } }, attente });
    await synchro.demarrer();
    assert.deepEqual(stockage.progression().exercices, {});
    assert.deepEqual(serveur.etat.progression.exercices, {});
    assert.deepEqual(attenteLue(), []);
  });

  it('garde les changements en attente si le serveur ne répond pas', async () => {
    const serveur = fauxServeur({ surEnvoi: () => { throw new Error('réseau coupé'); } });
    const { synchro, stockage, signalerErreur, attenteLue } = preparer({ serveur });
    await synchro.demarrer();
    stockage.enregistrerEssai('a', true);
    await laisserFinir();
    stockage.enregistrerEssai('a', false);
    await laisserFinir();
    assert.equal(serveur.envois().length, 2);
    assert.deepEqual(attenteLue(), [{ partie: 'exercices', cle: 'a', valeur: { essais: 2, reussi: true }, faitLe: MAINTENANT }]);
    assert.equal(signalerErreur.mock.callCount(), 1);
    assert.deepEqual(stockage.progression().exercices, { a: { essais: 2, reussi: true } });
  });

  it('renouvelle le jeton sur 403 puis renvoie une fois', async () => {
    const serveur = fauxServeur({ surEnvoi: () => 403 });
    const attente = [{ partie: 'codes', cle: 'c', valeur: 'x', faitLe: MAINTENANT }];
    const { synchro, renouvelerJeton, signalerErreur, attenteLue } = preparer({ serveur, attente });
    await synchro.demarrer();
    assert.equal(renouvelerJeton.mock.callCount(), 1);
    assert.equal(serveur.envois().length, 2);
    assert.deepEqual(attenteLue(), attente);
    assert.equal(signalerErreur.mock.callCount(), 1);
  });

  it('renvoie avec le nouveau jeton et vide l’attente si le second envoi passe', async () => {
    let refus = 1;
    const serveur = fauxServeur({ surEnvoi: () => (refus-- > 0 ? 403 : 200) });
    const attente = [{ partie: 'codes', cle: 'c', valeur: 'x', faitLe: MAINTENANT }];
    const { synchro, renouvelerJeton, signalerErreur, attenteLue } = preparer({ serveur, attente });
    await synchro.demarrer();
    assert.equal(renouvelerJeton.mock.callCount(), 1);
    assert.deepEqual(attenteLue(), []);
    assert.equal(signalerErreur.mock.callCount(), 0);
    assert.equal(serveur.etat.progression.codes.c, 'x');
  });

  it('vide l’attente après un 200, sauf une clé modifiée pendant l’envoi', async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    let horloge = MAINTENANT;
    let premier = true;
    let contexte;
    const serveur = fauxServeur({
      surEnvoi: () => {
        if (premier) {
          premier = false;
          contexte.stockage.enregistrerCode('k', 'v2');
          contexte.stockage.ecrireMaintenant();
        }
        return 200;
      },
    });
    contexte = preparer({ serveur, maintenant: () => horloge++ });
    const { synchro, stockage, attenteLue } = contexte;
    await synchro.demarrer();
    stockage.enregistrerCode('k', 'v1');
    stockage.enregistrerEssai('a', true);
    await laisserFinir();
    assert.deepEqual(serveur.envois()[0].corps.changements.map(({ cle }) => cle).sort(), ['a', 'k']);
    assert.deepEqual(attenteLue().map(({ partie, cle, valeur }) => ({ partie, cle, valeur })), [{ partie: 'codes', cle: 'k', valeur: 'v2' }]);
    assert.equal(stockage.code('k'), 'v2');
    assert.deepEqual(stockage.progression().exercices, { a: { essais: 1, reussi: true } });
    t.mock.timers.tick(300);
    await laisserFinir();
    assert.equal(serveur.envois().length, 2);
    assert.deepEqual(attenteLue(), []);
    assert.equal(serveur.etat.progression.codes.k, 'v2');
  });

  it('garde un changement fait avant la réponse du serveur', async () => {
    const serveur = fauxServeur();
    let repondre;
    const requete = (methode, ...reste) => (methode === 'GET'
      ? new Promise((resoudre) => { repondre = () => resoudre(serveur.requete(methode, ...reste)); })
      : serveur.requete(methode, ...reste));
    const { synchro, stockage, attenteLue } = preparer({ serveur: { requete } });
    const demarrage = synchro.demarrer();
    stockage.enregistrerEssai('a', true);
    stockage.enregistrerCode('k', 'v1');
    stockage.ecrireMaintenant();
    stockage.enregistrerCode('k', 'v2');
    repondre();
    await demarrage;
    assert.deepEqual(attenteLue(), []);
    assert.deepEqual(serveur.etat.progression.exercices, { a: { essais: 1, reussi: true } });
    assert.equal(serveur.etat.progression.codes.k, 'v2');
    assert.equal(stockage.code('k'), 'v2');
    assert.deepEqual(stockage.progression().exercices, { a: { essais: 1, reussi: true } });
  });

  it('découpe les envois pour que chaque corps fasse au plus 256 Kio', async () => {
    const serveur = fauxServeur();
    const gros = 'x'.repeat(60 * 1024);
    const attente = Array.from({ length: 10 }, (_, i) => ({ partie: 'codes', cle: `c${i}`, valeur: gros, faitLe: MAINTENANT }));
    const { synchro, attenteLue } = preparer({ serveur, attente });
    await synchro.demarrer();
    const envois = serveur.envois();
    assert.ok(envois.length >= 3);
    for (const envoi of envois) assert.ok(new TextEncoder().encode(JSON.stringify(envoi.corps)).length <= 256 * 1024);
    assert.equal(envois.flatMap((envoi) => envoi.corps.changements).length, 10);
    assert.deepEqual(attenteLue(), []);
  });

  it('un changement trop gros refusé par 413 est retiré et ne bloque pas les suivants', async () => {
    const serveur = fauxServeur({ surEnvoi: (corps) => (new TextEncoder().encode(JSON.stringify(corps)).length > 512 * 1024 ? 413 : 200) });
    const attente = [
      { partie: 'codes', cle: 'avant', valeur: 'a', faitLe: MAINTENANT },
      { partie: 'codes', cle: 'enorme', valeur: 'x'.repeat(600 * 1024), faitLe: MAINTENANT },
      { partie: 'codes', cle: 'apres', valeur: 'b', faitLe: MAINTENANT },
    ];
    const { synchro, signalerErreur, attenteLue } = preparer({ serveur, attente });
    await synchro.demarrer();
    assert.deepEqual(serveur.envois().map((envoi) => envoi.corps.changements.map(({ cle }) => cle)), [['avant'], ['enorme'], ['apres']]);
    assert.deepEqual(serveur.etat.progression.codes, { avant: 'a', apres: 'b' });
    assert.deepEqual(attenteLue(), []);
    assert.equal(signalerErreur.mock.callCount(), 1);
  });

  it('appelle apresRelecture une fois quand l’état du serveur change l’état local', async () => {
    const serveur = fauxServeur({ progression: { codes: { x: 'serveur' } }, dates: { 'codes/x': MAINTENANT } });
    const apresRelecture = mock.fn();
    const { synchro } = preparer({ serveur, local: { codes: { x: 'local' } }, apresRelecture });
    await synchro.demarrer();
    assert.equal(apresRelecture.mock.callCount(), 1);
  });

  it('n’appelle pas apresRelecture si l’état est le même, ni après la réponse d’un envoi', async () => {
    const serveur = fauxServeur({ progression: { codes: { x: 'pareil', y: 'serveur' } }, dates: { 'codes/x': MAINTENANT, 'codes/y': MAINTENANT + 10 } });
    const apresRelecture = mock.fn();
    const attente = [{ partie: 'codes', cle: 'y', valeur: 'ancien', faitLe: MAINTENANT }];
    const { synchro, stockage } = preparer({ serveur, local: { codes: { x: 'pareil', y: 'serveur' } }, attente, apresRelecture });
    await synchro.demarrer();
    assert.equal(stockage.code('y'), 'serveur');
    serveur.etat.progression.codes.z = 'autre appareil';
    serveur.etat.dates['codes/z'] = MAINTENANT + 100;
    stockage.enregistrerCode('z', 'nouveau');
    stockage.ecrireMaintenant();
    await synchro.envoyer();
    assert.equal(stockage.code('z'), 'autre appareil');
    assert.equal(apresRelecture.mock.callCount(), 0);
  });

  it('signale une fois quand un changement local ne peut pas être mis en attente', async () => {
    const serveur = fauxServeur();
    const memoire = fausseMemoire({ [SYNCHRONISE]: '1' });
    const ecrireVraiment = memoire.setItem;
    let plein = false;
    memoire.setItem = (cle, valeur) => {
      if (plein && cle === ATTENTE) throw new Error('stockage plein');
      ecrireVraiment(cle, valeur);
    };
    const stockage = creerStockage({ memoire });
    const signalerErreur = mock.fn();
    const synchro = creerSynchroProgression({ stockage, memoire, requete: serveur.requete, maintenant: () => MAINTENANT, signalerErreur });
    await synchro.demarrer();
    plein = true;
    stockage.enregistrerEssai('a', true);
    stockage.enregistrerEssai('b', true);
    await laisserFinir();
    assert.equal(signalerErreur.mock.callCount(), 1);
  });

  it('écarte les changements invalides avant de les mettre en attente', async () => {
    const serveur = fauxServeur();
    const attente = [
      { partie: 'exercices', cle: 'mauvais', valeur: { essais: -1 }, faitLe: MAINTENANT },
      { partie: 'inconnue', cle: 'x', valeur: 1, faitLe: MAINTENANT },
      { partie: 'codes', cle: 'bon', valeur: 'ok', faitLe: MAINTENANT },
    ];
    const { synchro, attenteLue } = preparer({ serveur, attente });
    await synchro.demarrer();
    assert.deepEqual(serveur.envois().map((envoi) => envoi.corps.changements), [[attente[2]]]);
    assert.deepEqual(attenteLue(), []);
  });

  it('envoie en keepalive quand la page se cache, sauf si le lot dépasse 64 Kio', async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const serveur = fauxServeur({ surEnvoi: () => 500 });
    const { synchro, stockage } = preparer({ serveur });
    await synchro.demarrer();
    stockage.enregistrerCode('petit', 'x');
    stockage.ecrireMaintenant();
    await laisserFinir();
    await synchro.envoyer({ keepalive: true });
    assert.deepEqual(serveur.envois().at(-1).options, { keepalive: true });
    const avant = serveur.envois().length;
    stockage.enregistrerCode('gros', 'x'.repeat(70 * 1024));
    stockage.ecrireMaintenant();
    await laisserFinir();
    const apresEnvoiNormal = serveur.envois().length;
    assert.equal(apresEnvoiNormal, avant);
    await synchro.envoyer({ keepalive: true });
    assert.equal(serveur.envois().length, apresEnvoiNormal);
  });
});
