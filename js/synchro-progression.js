import { PARTIES, appliquerChangement, changementValide, progressionVide } from './fusion-progression.js';

const CLE_ATTENTE = 'esgi-entrainement-attente';
const CLE_SYNCHRONISE = 'esgi-entrainement-synchronise';
const MAX_PAR_ENVOI = 2000;
const DELAI_ENVOI = 300;
const LIMITE_KEEPALIVE = 64 * 1024;
const FAIT_LE_PREMIERE_SYNCHRO = 1;

const estObjet = (valeur) => typeof valeur === 'object' && valeur !== null && !Array.isArray(valeur);
const identifiant = ({ partie, cle }) => JSON.stringify([partie, cle]);

export function creerSynchroProgression({
  stockage,
  memoire = globalThis.localStorage,
  requete,
  renouvelerJeton = async () => {},
  maintenant = Date.now,
  signalerErreur = () => {},
  delai = DELAI_ENVOI,
}) {
  let mode = 'inconnu';
  let enMemoire = [];
  let minuteur = null;
  let envoiEnCours = null;
  let relancer = false;
  let relecture = null;
  let erreurSignalee = false;
  let ecouteursPage = false;
  let envoiFermeture = null;
  let reponsesTraitees = 0;

  function lire(cle) {
    try {
      return memoire?.getItem(cle) ?? null;
    } catch {
      return null;
    }
  }

  function ecrire(cle, valeur) {
    try {
      memoire?.setItem(cle, valeur);
      return true;
    } catch {
      return false;
    }
  }

  function lireAttente() {
    try {
      const attente = JSON.parse(lire(CLE_ATTENTE) ?? '[]');
      return Array.isArray(attente) ? attente.filter(changementValide) : [];
    } catch {
      return [];
    }
  }

  function mettreEnAttente(changements, { remplacer = true } = {}) {
    const valides = changements.filter(changementValide);
    if (valides.length === 0) return true;
    const parCle = new Map(lireAttente().map((changement) => [identifiant(changement), changement]));
    for (const changement of valides) {
      if (!remplacer && parCle.has(identifiant(changement))) continue;
      parCle.delete(identifiant(changement));
      parCle.set(identifiant(changement), changement);
    }
    return ecrire(CLE_ATTENTE, JSON.stringify([...parCle.values()]));
  }

  function retirerEnvoyes(lot) {
    const envoyes = new Map(lot.map((changement) => [identifiant(changement), JSON.stringify(changement)]));
    const reste = lireAttente().filter((changement) => envoyes.get(identifiant(changement)) !== JSON.stringify(changement));
    ecrire(CLE_ATTENTE, JSON.stringify(reste));
  }

  function contenuLocal() {
    const progression = stockage.progression();
    const faitLe = FAIT_LE_PREMIERE_SYNCHRO;
    return PARTIES.flatMap((partie) => Object.entries(estObjet(progression[partie]) ? progression[partie] : {})
      .map(([cle, valeur]) => ({ partie, cle, valeur, faitLe })));
  }

  function recopier(retenus) {
    if (!Array.isArray(retenus) || retenus.length === 0) return;
    stockage.ecrireMaintenant();
    const enAttente = new Set(lireAttente().map(identifiant));
    const actuel = stockage.progression();
    const parties = Object.fromEntries(PARTIES.map((partie) => [partie, structuredClone(estObjet(actuel[partie]) ? actuel[partie] : {})]));
    let change = false;
    for (const { partie, cle, valeur } of retenus) {
      if (!PARTIES.includes(partie) || typeof cle !== 'string' || enAttente.has(identifiant({ partie, cle }))) continue;
      const avant = Object.hasOwn(parties[partie], cle) ? parties[partie][cle] : null;
      if (JSON.stringify(avant) === JSON.stringify(valeur ?? null)) continue;
      if (valeur === null || valeur === undefined) delete parties[partie][cle];
      else parties[partie][cle] = valeur;
      change = true;
    }
    if (change) stockage.remplacerParties(parties);
  }

  function echec() {
    if (erreurSignalee) return;
    erreurSignalee = true;
    signalerErreur();
  }

  async function tenter(lot, keepalive) {
    try {
      return await requete('POST', { changements: lot }, { keepalive });
    } catch {
      return null;
    }
  }

  async function poster(lot, keepalive = false) {
    const reponse = await tenter(lot, keepalive);
    if (reponse?.statut !== 403) return reponse;
    try {
      await renouvelerJeton();
    } catch {}
    return tenter(lot, keepalive);
  }

  function traiterReponse(lot, reponse) {
    if (reponse?.statut !== 200) {
      echec();
      return false;
    }
    reponsesTraitees += 1;
    retirerEnvoyes(lot);
    recopier(reponse.donnees?.retenus);
    return true;
  }

  async function envoyerTout() {
    const attente = lireAttente();
    for (let debut = 0; debut < attente.length; debut += MAX_PAR_ENVOI) {
      const lot = attente.slice(debut, debut + MAX_PAR_ENVOI);
      if (!traiterReponse(lot, await poster(lot))) return;
    }
  }

  function envoyerAvantFermeture() {
    stockage.ecrireMaintenant();
    const lot = lireAttente().slice(0, MAX_PAR_ENVOI);
    if (lot.length === 0) return Promise.resolve();
    if (new TextEncoder().encode(JSON.stringify({ changements: lot })).length > LIMITE_KEEPALIVE) return Promise.resolve();
    const envoi = poster(lot, true).then((reponse) => {
      traiterReponse(lot, reponse);
    }, () => {}).finally(() => {
      if (envoiFermeture === envoi) envoiFermeture = null;
    });
    envoiFermeture = envoi;
    return envoi;
  }

  function envoyer({ keepalive = false } = {}) {
    if (mode !== 'actif') return Promise.resolve();
    if (keepalive) return envoyerAvantFermeture();
    clearTimeout(minuteur);
    minuteur = null;
    if (envoiEnCours) {
      relancer = true;
      return envoiEnCours;
    }
    envoiEnCours = (async () => {
      try {
        do {
          relancer = false;
          await envoyerTout();
        } while (relancer);
      } catch {
        echec();
      } finally {
        envoiEnCours = null;
      }
    })();
    return envoiEnCours;
  }

  function planifier() {
    if (!minuteur) minuteur = setTimeout(() => {
      minuteur = null;
      envoyer();
    }, delai);
  }

  function surChangementLocal(touches, { immediat }) {
    if (mode === 'inactif') return;
    const faitLe = maintenant();
    const changements = touches.map(({ partie, cle, valeur }) => ({ partie, cle, valeur, faitLe }));
    if (mode === 'inconnu') {
      enMemoire.push(...changements);
      return;
    }
    mettreEnAttente(changements);
    if (immediat) envoyer();
    else planifier();
  }

  function etatDuServeur(donnees) {
    const etat = {
      progression: progressionVide(),
      dates: estObjet(donnees.dates) ? donnees.dates : {},
      supprimes: estObjet(donnees.supprimes) ? donnees.supprimes : {},
    };
    for (const partie of PARTIES) {
      if (estObjet(donnees.progression?.[partie])) etat.progression[partie] = donnees.progression[partie];
    }
    return etat;
  }

  async function attendreEnvois() {
    while (envoiEnCours || envoiFermeture) await Promise.all([envoiEnCours, envoiFermeture]);
  }

  const envoisEnCours = () => Boolean(envoiEnCours || envoiFermeture);

  async function demanderEtat() {
    try {
      return await requete('GET');
    } catch {
      return null;
    }
  }

  async function lireServeur() {
    if (envoisEnCours()) await attendreEnvois();
    const avant = reponsesTraitees;
    const reponse = await demanderEtat();
    if (reponsesTraitees === avant) return { reponse, fiable: true };
    if (envoisEnCours()) await attendreEnvois();
    const deuxieme = reponsesTraitees;
    const nouvelle = await demanderEtat();
    return { reponse: nouvelle, fiable: reponsesTraitees === deuxieme };
  }

  async function relireMaintenant() {
    const { reponse, fiable } = await lireServeur();
    if (reponse?.statut === 200 && reponse.donnees?.active === false) {
      mode = 'inactif';
      enMemoire = [];
      return;
    }
    const enCoursDeChargement = mode === 'inconnu';
    mode = 'actif';
    if (enCoursDeChargement) {
      const garde = mettreEnAttente(enMemoire);
      enMemoire = [];
      if (!garde) {
        echec();
        return;
      }
    }
    stockage.ecrireMaintenant();
    if (reponse?.statut !== 200 || !estObjet(reponse.donnees)) {
      echec();
      return;
    }
    if (lire(CLE_SYNCHRONISE) !== '1') {
      if (!mettreEnAttente(contenuLocal(), { remplacer: false })) {
        echec();
        return;
      }
      ecrire(CLE_SYNCHRONISE, '1');
    }
    if (!fiable) {
      await envoyer();
      return;
    }
    const etat = etatDuServeur(reponse.donnees);
    for (const changement of lireAttente()) appliquerChangement(etat, changement);
    stockage.remplacerParties(etat.progression);
    await envoyer();
  }

  function relire() {
    if (!relecture) relecture = relireMaintenant().finally(() => {
      relecture = null;
    });
    return relecture;
  }

  function brancherPage() {
    if (ecouteursPage || typeof document === 'undefined' || typeof addEventListener !== 'function') return;
    ecouteursPage = true;
    addEventListener('pagehide', () => envoyer({ keepalive: true }));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') envoyer({ keepalive: true });
      else relire().catch(() => {});
    });
  }

  let ecouteurBranche = false;

  async function demarrer() {
    if (!ecouteurBranche) {
      ecouteurBranche = true;
      stockage.surChangementLocal(surChangementLocal);
    }
    await relire();
    if (mode === 'actif') brancherPage();
  }

  return { demarrer, envoyer };
}
