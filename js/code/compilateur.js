import { appelerApi } from '../api.js';

let etat = null;

export function etatOutils({ rafraichir = false } = {}) {
  if (rafraichir) etat = null;
  etat ??= appelerApi(rafraichir ? 'api/etat?rafraichir=1' : 'api/etat')
    .catch(() => null)
    .then((donnees) => {
      if (!donnees) etat = null;
      return donnees;
    });
  return etat;
}

export const compilateur = {
  executer: (langage, code, entree = '') => appelerApi(`api/${langage}/executer`, { methode: 'POST', corps: { code, entree } }),
  verifier: (langage, domaine, chapitreId, exerciceId, code) =>
    appelerApi(`api/${langage}/verifier`, { methode: 'POST', corps: { domaine, chapitreId, exerciceId, code } }),
};
