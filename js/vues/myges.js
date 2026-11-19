import { appelerApi, SERVEUR_ARRETE } from '../api.js';
import { echapper } from '../outils.js';
import { AUCUN_NOUVEAU_COURS, ETAPES_ACTIVES } from '../synchro-etats.js';

const INTERVALLE = 2000;
const REPRISE_CLAUDE = 'Si Claude n’avait pas fini d’intégrer les cours, il reprendra tout seul.';
const MESSAGES_COMMUNS = {
  claude_introuvable: 'Claude Code est introuvable : la commande « claude » doit être installée sur cet ordinateur.',
  claude_echec: 'Les cours sont téléchargés, mais Claude n’a pas fini de créer les notes et les exercices.',
  claude_incomplet: 'Les cours sont téléchargés, mais Claude s’est arrêté avant d’avoir tout intégré.',
};

const pluriel = (nombre, singulier, plurielle = `${singulier}s`) => (nombre > 1 ? plurielle : singulier);

export const SOURCES = {
  myges: {
    cle: 'myges',
    nom: 'MyGES',
    intro: 'Récupère les nouveaux supports de cours sur MyGES. Claude crée ensuite les notes et les exercices.',
    boutonLancer: '⬇ Télécharger les nouveaux cours',
    recherche: 'Recherche des nouveaux cours…',
    ajoutes: (nombre) => `${nombre} ${pluriel(nombre, 'nouveau', 'nouveaux')} cours ${pluriel(nombre, 'ajouté')}.`,
    titreAjoutes: 'Nouveaux cours',
    erreurs: {
      identifiants_manquants: 'Remplis MYGES_IDENTIFIANT et MYGES_MOT_DE_PASSE dans le fichier .env du projet (modèle : .env.exemple), puis réessaie.',
      identifiants_refuses: 'MyGES refuse la connexion : vérifie le fichier .env (ton identifiant MyGES, pas ton e-mail, et ton mot de passe).',
      injoignable: 'MyGES ne répond pas. Vérifie ta connexion internet et réessaie.',
      reponse_inattendue: 'La page de MyGES a changé : le téléchargement automatique doit être mis à jour.',
    },
  },
  schooding: {
    cle: 'schooding',
    nom: 'Schooding',
    intro: 'Récupère les cours, slides, vidéos, exercices, ton code rendu et les QCM corrigés de Schooding (Python et Algo avancée). Claude crée ensuite les notes et les exercices.',
    boutonLancer: '⬇ Télécharger depuis Schooding',
    recherche: 'Lecture des cours et des séances…',
    ajoutes: (nombre) => `${nombre} ${pluriel(nombre, 'élément')} ${pluriel(nombre, 'nouveau', 'nouveaux')} ou ${pluriel(nombre, 'mis', 'mis')} à jour.`,
    titreAjoutes: 'Nouveaux éléments',
    erreurs: {
      identifiants_manquants: 'Remplis SCHOODING_IDENTIFIANT et SCHOODING_MOT_DE_PASSE dans le fichier .env du projet (modèle : .env.exemple), puis réessaie.',
      identifiants_refuses: 'Schooding refuse la connexion : vérifie le fichier .env (ton login Schooding, pas ton e-mail, et ton mot de passe).',
      injoignable: 'Schooding ne répond pas. Vérifie ta connexion internet et réessaie.',
      reponse_inattendue: 'La page de Schooding a changé : le téléchargement automatique doit être mis à jour.',
      trop_de_requetes: 'Schooding limite le nombre de requêtes : attends quelques minutes puis réessaie (ce qui est déjà téléchargé est gardé).',
    },
  },
};

const enAttente = (etat) => etat.enAttente ?? [];

function liste(titre, elements) {
  if (!elements.length) return '';
  return `<div class="myges-liste"><span>${titre}</span><ul>${elements.map((element) => `<li>${echapper(element)}</li>`).join('')}</ul></div>`;
}

const notes = (etat) => (etat.notes ?? []).map((note) => `<p class="myges-note">${echapper(note)}</p>`).join('');

function contenu(etat, source) {
  const bouton = (action, texte, classe = 'bouton') => `<button class="${classe}" data-${source.cle}-action="${action}">${texte}</button>`;
  const nombreEnAttente = enAttente(etat).length;
  const enSuspens = nombreEnAttente
    ? {
        details: liste(`${nombreEnAttente} ${pluriel(nombreEnAttente, 'cours téléchargé', 'cours téléchargés')} pas encore ${pluriel(nombreEnAttente, 'intégré')}`, enAttente(etat)),
        actions: bouton('reprendre', '▶ Reprendre l’intégration', 'bouton principal'),
      }
    : { details: '', actions: '' };
  const fait = etat.avance ?? etat.telecharges.length + etat.rates.length;
  switch (etat.etape) {
    case 'connexion':
      return { texte: `Connexion à ${source.nom}…`, actions: bouton('arreter', 'Arrêter'), bouton };
    case 'liste':
      return { texte: source.recherche, actions: bouton('arreter', 'Arrêter'), bouton };
    case 'telechargement':
      return { texte: `Téléchargement… ${fait} / ${etat.total}`, actions: bouton('arreter', 'Arrêter'), bouton };
    case 'claude':
      return {
        texte: etat.reprise
          ? 'Reprise : Claude termine les notes et les exercices commencés avant la coupure. Tu peux fermer la page et revenir.'
          : 'Claude crée les notes et les exercices. Ça peut prendre un moment, tu peux fermer la page et revenir.',
        details: liste('Cours à intégrer', nombreEnAttente ? enAttente(etat) : etat.telecharges) + (etat.lignes.length ? `<div class="myges-journal">${etat.lignes.slice(-5).map((ligne) => `<p>${echapper(ligne)}</p>`).join('')}</div>` : ''),
        actions: bouton('arreter', 'Arrêter'),
      };
    case 'terminee': {
      if (etat.bilan === AUCUN_NOUVEAU_COURS) {
        return { texte: 'Aucun nouveau cours : tout est à jour.', details: notes(etat) + enSuspens.details, actions: enSuspens.actions + bouton('lancer', '⟳ Vérifier à nouveau') };
      }
      const nombre = etat.telecharges.length;
      return {
        texte: nombre ? source.ajoutes(nombre) : 'Synchro terminée.',
        details: liste(source.titreAjoutes, etat.telecharges)
          + etat.matieresCreees.map((matiere) => `<p class="myges-note">Nouvelle matière : ${echapper(matiere)}</p>`).join('')
          + liste('Non téléchargés', etat.rates.map(({ nom, raison }) => `${nom} (${raison})`))
          + notes(etat)
          + (etat.bilan ? `<div class="myges-bilan">${echapper(etat.bilan)}</div>` : '')
          + enSuspens.details,
        actions: enSuspens.actions + (nombre ? bouton('recharger', 'Recharger le site', 'bouton principal') : '') + bouton('lancer', '⟳ Vérifier à nouveau'),
      };
    }
    case 'erreur':
      return {
        texte: source.erreurs[etat.erreur?.code] ?? MESSAGES_COMMUNS[etat.erreur?.code] ?? 'La synchro a échoué.',
        details: (etat.erreur?.message ? `<p class="myges-note">${echapper(etat.erreur.message)}</p>` : '') + (enSuspens.details || liste(source.titreAjoutes, etat.telecharges)),
        actions: enSuspens.actions + bouton('lancer', 'Réessayer'),
      };
    default:
      return {
        texte: source.intro,
        details: enSuspens.details,
        actions: enSuspens.actions + bouton('lancer', source.boutonLancer, enSuspens.actions ? 'bouton' : 'bouton principal'),
      };
  }
}

export function rendreEtatSynchro(etat, source) {
  const { texte, details = '', actions } = contenu(etat, source);
  const classe = etat.etape === 'erreur' ? ' myges-erreur' : ETAPES_ACTIVES.includes(etat.etape) ? ' myges-actif' : '';
  return `
    <div class="myges${classe}">
      <div class="myges-texte">
        <strong>${source.nom}</strong>
        <span>${echapper(texte)}</span>
        ${details}
      </div>
      <div class="myges-actions">${actions}</div>
    </div>`;
}

export const rendreEtatMyges = (etat) => rendreEtatSynchro(etat, SOURCES.myges);
export const rendreEtatSchooding = (etat) => rendreEtatSynchro(etat, SOURCES.schooding);

const pageCachee = () => typeof document !== 'undefined' && document.visibilityState === 'hidden';

export function brancherSynchro(zone, source) {
  let minuteur = null;
  let dernierRendu = null;
  let dernierEtat = null;
  let occupe = false;
  const api = `api/${source.cle}`;
  const attribut = `${source.cle}Action`;

  const enPlace = () => zone.isConnected;

  function bloquerBoutons(bloques) {
    zone.querySelectorAll('button').forEach((bouton) => {
      bouton.disabled = bloques;
    });
  }

  function dessiner(html) {
    if (html === dernierRendu) return;
    dernierRendu = html;
    zone.innerHTML = html;
  }

  function programmer() {
    clearTimeout(minuteur);
    minuteur = null;
    if (dernierEtat && ETAPES_ACTIVES.includes(dernierEtat.etape) && !pageCachee()) minuteur = setTimeout(rafraichir, INTERVALLE);
  }

  function afficher(etat) {
    dernierEtat = etat;
    dessiner(rendreEtatSynchro(etat, source));
    programmer();
  }

  function afficherProbleme(message) {
    dernierEtat = null;
    clearTimeout(minuteur);
    dessiner(`
      <div class="myges myges-erreur">
        <div class="myges-texte"><strong>${source.nom}</strong><span>${echapper(message)}</span></div>
        <div class="myges-actions"><button class="bouton" data-${source.cle}-action="rafraichir">Réessayer</button></div>
      </div>`);
  }

  async function executer(methode, chemin) {
    const action = methode === 'POST';
    if (action && occupe) return;
    if (action) {
      occupe = true;
      bloquerBoutons(true);
    }
    try {
      const etat = await appelerApi(chemin, { methode });
      if (enPlace()) afficher(etat);
    } catch (erreur) {
      const message = erreur.message === SERVEUR_ARRETE ? `${SERVEUR_ARRETE} ${REPRISE_CLAUDE}` : erreur.message;
      if (enPlace()) afficherProbleme(message);
    } finally {
      if (action) {
        occupe = false;
        bloquerBoutons(false);
      }
    }
  }

  function rafraichir() {
    if (enPlace()) executer('GET', `${api}/etat`);
    else arreter();
  }

  function changementVisibilite() {
    if (!enPlace()) {
      arreter();
      return;
    }
    if (pageCachee()) {
      clearTimeout(minuteur);
      minuteur = null;
    } else if (dernierEtat && ETAPES_ACTIVES.includes(dernierEtat.etape)) {
      rafraichir();
    }
  }

  function arreter() {
    clearTimeout(minuteur);
    minuteur = null;
    document.removeEventListener('visibilitychange', changementVisibilite);
  }

  zone.addEventListener('click', (evenement) => {
    const action = evenement.target.closest(`[data-${source.cle}-action]`)?.dataset[attribut];
    if (action === 'lancer') executer('POST', `${api}/synchroniser`);
    if (action === 'reprendre') executer('POST', `${api}/reprendre`);
    if (action === 'arreter') executer('POST', `${api}/arreter`);
    if (action === 'rafraichir') rafraichir();
    if (action === 'recharger') location.reload();
  });

  document.addEventListener('visibilitychange', changementVisibilite);
  rafraichir();
  return arreter;
}

export const brancherMyges = (zone) => brancherSynchro(zone, SOURCES.myges);
export const brancherSchooding = (zone) => brancherSynchro(zone, SOURCES.schooding);
