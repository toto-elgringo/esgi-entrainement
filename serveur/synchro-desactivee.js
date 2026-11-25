import { ETAPE_DESACTIVEE, MESSAGE_SYNCHRO_DESACTIVEE } from '../js/synchro-etats.js';
import { ErreurSynchro } from './commun/erreurs.js';

export function creerSynchroDesactivee(nom) {
  const refuser = () => {
    throw new ErreurSynchro(ETAPE_DESACTIVEE, MESSAGE_SYNCHRO_DESACTIVEE);
  };
  return {
    nom,
    fichiersPrives: [],
    etat: () => ({ etape: ETAPE_DESACTIVEE }),
    demarrer: refuser,
    reprendre: refuser,
    arreter: refuser,
    reprendreAuDemarrage: () => Promise.resolve({ etape: ETAPE_DESACTIVEE }),
    couper: () => {},
  };
}
