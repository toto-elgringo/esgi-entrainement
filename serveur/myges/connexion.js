import { ErreurMyges } from './erreurs.js';
import { creerSession } from './session.js';
import { decoderEntites } from './html.js';

export const ADRESSE_SITE = 'https://myges.fr';

function attribut(balise, nom) {
  const trouve = new RegExp(`\\s${nom}="([^"]*)"`, 'i').exec(balise);
  return trouve ? decoderEntites(trouve[1]) : null;
}

export function lireFormulaireConnexion(html) {
  for (const [formulaire] of html.matchAll(/<form\b[\s\S]*?<\/form>/gi)) {
    const champs = {};
    for (const [balise] of formulaire.matchAll(/<input\b[^>]*>/gi)) {
      const nom = attribut(balise, 'name');
      if (nom) champs[nom] = attribut(balise, 'value') ?? '';
    }
    if ('password' in champs && 'username' in champs) {
      return { action: attribut(/<form\b[^>]*>/i.exec(formulaire)[0], 'action') ?? '', champs };
    }
  }
  return null;
}

export async function connecterSite({ identifiant, motDePasse }, { adresseSite = ADRESSE_SITE, signal } = {}) {
  const session = creerSession();
  const depart = await session.obtenir(`${adresseSite}/student/courses-files`, { signal });
  const formulaire = lireFormulaireConnexion(await depart.reponse.text());
  if (!formulaire) {
    throw new ErreurMyges('reponse_inattendue', `La page de connexion de MyGES a changé (statut ${depart.reponse.status}).`);
  }
  const champs = { ...formulaire.champs, username: identifiant, password: motDePasse };
  const arrivee = await session.obtenir(new URL(formulaire.action, depart.adresse).href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(champs).toString(),
    signal,
  });
  const page = await arrivee.reponse.text();
  if (arrivee.reponse.status === 401 || lireFormulaireConnexion(page)) {
    throw new ErreurMyges('identifiants_refuses', 'MyGES refuse l’identifiant ou le mot de passe.');
  }
  if (!arrivee.reponse.ok) {
    throw new ErreurMyges('reponse_inattendue', `Réponse inattendue de MyGES à la connexion (statut ${arrivee.reponse.status}).`);
  }
  return session;
}
