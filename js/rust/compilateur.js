let etat = null;

export function etatCompilateur() {
  etat ??= fetch('api/etat', { cache: 'no-store' })
    .then((reponse) => (reponse.ok ? reponse.json() : null))
    .then((donnees) => (donnees ? { disponible: true, rust: donnees.rust } : { disponible: false, rust: null }))
    .catch(() => ({ disponible: false, rust: null }));
  return etat;
}

async function envoyer(chemin, corps) {
  const reponse = await fetch(chemin, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
  });
  const donnees = await reponse.json().catch(() => ({}));
  if (!reponse.ok) throw new Error(donnees.erreur ?? `Erreur ${reponse.status}`);
  return donnees;
}

export const compilateur = {
  executer: (code) => envoyer('api/rust/executer', { code }),
  verifier: (chapitreId, exerciceId, code) => envoyer('api/rust/verifier', { chapitreId, exerciceId, code }),
};
