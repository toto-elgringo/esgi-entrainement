export const SERVEUR_ARRETE = 'Le serveur local ne répond pas : relance « npm start » dans le dossier du projet.';

export async function appelerApi(chemin, { methode = 'GET', corps } = {}) {
  const envoi = methode === 'POST';
  let reponse;
  try {
    reponse = await fetch(chemin, {
      method: methode,
      cache: 'no-store',
      headers: envoi ? { 'Content-Type': 'application/json' } : undefined,
      body: envoi ? JSON.stringify(corps ?? {}) : undefined,
    });
  } catch {
    throw new Error(SERVEUR_ARRETE);
  }
  const donnees = await reponse.json().catch(() => ({}));
  if (!reponse.ok) throw new Error(donnees.erreur ?? `Erreur ${reponse.status}`);
  return donnees;
}
