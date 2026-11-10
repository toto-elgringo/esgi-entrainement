import { ErreurMyges } from './erreurs.js';

const REDIRECTIONS_MAX = 15;
const NAVIGATEUR = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) esgi-entrainement';

export function creerSession() {
  const cookies = new Map();

  function cookiesDe(adresse) {
    const hote = new URL(adresse).hostname;
    return [...(cookies.get(hote) ?? new Map()).entries()].map(([nom, valeur]) => `${nom}=${valeur}`).join('; ');
  }

  function garderCookies(adresse, reponse) {
    const hote = new URL(adresse).hostname;
    if (!cookies.has(hote)) cookies.set(hote, new Map());
    for (const ligne of reponse.headers.getSetCookie()) {
      const paire = ligne.split(';')[0];
      const egal = paire.indexOf('=');
      if (egal > 0) cookies.get(hote).set(paire.slice(0, egal).trim(), paire.slice(egal + 1).trim());
    }
  }

  async function obtenir(adresse, { method = 'GET', headers = {}, body, signal } = {}) {
    let actuelle = adresse;
    let requete = { method, headers, body };
    for (let etape = 0; etape < REDIRECTIONS_MAX; etape += 1) {
      let reponse;
      try {
        reponse = await fetch(actuelle, {
          method: requete.method,
          body: requete.body,
          redirect: 'manual',
          signal,
          headers: { ...requete.headers, Cookie: cookiesDe(actuelle), 'User-Agent': NAVIGATEUR },
        });
      } catch (erreur) {
        if (signal?.aborted) throw erreur;
        throw new ErreurMyges('injoignable', 'MyGES ne répond pas.');
      }
      garderCookies(actuelle, reponse);
      const destination = reponse.headers.get('location');
      if (reponse.status < 300 || reponse.status >= 400 || !destination) return { reponse, adresse: actuelle };
      await reponse.body?.cancel();
      actuelle = new URL(destination, actuelle).href;
      requete = { method: 'GET', headers: {} };
    }
    throw new ErreurMyges('reponse_inattendue', 'MyGES redirige sans fin.');
  }

  return { obtenir };
}
