const SERVEUR_ARRETE = 'Le serveur local ne répond pas : relance « npm start » dans le dossier du projet.';

let etat = null;

export function etatOutils() {
  etat ??= fetch('api/etat', { cache: 'no-store' })
    .then((reponse) => (reponse.ok ? reponse.json() : null))
    .catch(() => null)
    .then((donnees) => {
      if (!donnees) etat = null;
      return donnees;
    });
  return etat;
}

async function envoyer(chemin, corps) {
  let reponse;
  try {
    reponse = await fetch(chemin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corps),
    });
  } catch {
    throw new Error(SERVEUR_ARRETE);
  }
  const donnees = await reponse.json().catch(() => ({}));
  if (!reponse.ok) throw new Error(donnees.erreur ?? `Erreur ${reponse.status}`);
  return donnees;
}

export const compilateur = {
  executer: (langage, code, entree = '') => envoyer(`api/${langage}/executer`, { code, entree }),
  verifier: (langage, chapitreId, exerciceId, code) => envoyer(`api/${langage}/verifier`, { chapitreId, exerciceId, code }),
};
