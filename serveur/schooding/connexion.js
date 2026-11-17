import { ErreurMyges } from '../myges/erreurs.js';
import { creerSession } from '../myges/session.js';
import { lireJeton, pageDeConnexion } from './pages.js';

export const ADRESSE_SCHOODING = 'https://www.schooding.fr';
export const PAUSE_ENTRE_REQUETES = 1000;
export const ATTENTES_SI_LIMITE = [5000, 15000, 30000, 60000];

function dormir(duree, signal) {
  return new Promise((resoudre, rejeter) => {
    if (signal?.aborted) return rejeter(signal.reason);
    const minuteur = setTimeout(resoudre, duree);
    signal?.addEventListener('abort', () => {
      clearTimeout(minuteur);
      rejeter(signal.reason);
    }, { once: true });
  });
}

export function creerClient({ adresseSite = ADRESSE_SCHOODING, pause = PAUSE_ENTRE_REQUETES, attentes = ATTENTES_SI_LIMITE, signal } = {}) {
  const session = creerSession({ nomSite: 'Schooding' });
  const origine = new URL(adresseSite).origin;
  let derniere = 0;

  async function patienter() {
    const reste = derniere + pause - Date.now();
    if (reste > 0) await dormir(reste, signal);
    derniere = Date.now();
  }

  async function obtenir(chemin, { verifierSession = true, ...options } = {}) {
    const adresse = new URL(chemin, adresseSite).href;
    const surLeSite = new URL(adresse).origin === origine;
    for (let essai = 0; ; essai += 1) {
      if (surLeSite) await patienter();
      const resultat = await session.obtenir(adresse, { ...options, signal });
      if (resultat.reponse.status !== 429) {
        if (verifierSession && surLeSite && new URL(resultat.adresse).pathname.startsWith('/accounts/login')) {
          await resultat.reponse.body?.cancel();
          throw new ErreurMyges('reponse_inattendue', 'Schooding a fermé la session en cours de route.');
        }
        return resultat;
      }
      await resultat.reponse.body?.cancel();
      if (essai >= attentes.length) throw new ErreurMyges('trop_de_requetes', 'Schooding limite le nombre de requêtes (erreur 429).');
      await dormir(attentes[essai], signal);
    }
  }

  async function texte(chemin) {
    const { reponse, adresse } = await obtenir(chemin);
    if (!reponse.ok) {
      await reponse.body?.cancel();
      throw new ErreurMyges('reponse_inattendue', `Schooding répond ${reponse.status} pour ${new URL(adresse).pathname}.`);
    }
    return reponse.text();
  }

  return { obtenir, texte, adresseSite };
}

export async function connecterSchooding({ identifiant, motDePasse }, options = {}) {
  const client = creerClient(options);
  const depart = await client.obtenir('/accounts/login/?next=/', { verifierSession: false });
  const jeton = lireJeton(await depart.reponse.text());
  if (!jeton) throw new ErreurMyges('reponse_inattendue', `La page de connexion de Schooding a changé (statut ${depart.reponse.status}).`);
  const pageConnexion = new URL('/accounts/login/?next=/', client.adresseSite).href;
  const arrivee = await client.obtenir('/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Referer: pageConnexion, Origin: new URL(client.adresseSite).origin },
    body: new URLSearchParams({ csrfmiddlewaretoken: jeton, username: identifiant, password: motDePasse, next: '' }).toString(),
    verifierSession: false,
  });
  const page = await arrivee.reponse.text();
  if (arrivee.reponse.status === 401 || arrivee.reponse.status === 403 || pageDeConnexion(page)) {
    throw new ErreurMyges('identifiants_refuses', 'Schooding refuse le login ou le mot de passe.');
  }
  if (!arrivee.reponse.ok) throw new ErreurMyges('reponse_inattendue', `Réponse inattendue de Schooding à la connexion (statut ${arrivee.reponse.status}).`);
  const accueil = new URL(arrivee.adresse).pathname === '/home/' ? page : await client.texte('/home/');
  return { client, accueil };
}
