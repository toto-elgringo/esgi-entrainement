import { echapper } from '../outils.js';

const ETAPES_ACTIVES = ['connexion', 'liste', 'telechargement', 'claude'];
const AUCUN_NOUVEAU_COURS = 'Aucun nouveau cours';
const INTERVALLE = 2000;
const SERVEUR_ARRETE = 'Le serveur local ne répond pas : relance « npm start » dans le dossier du projet. Si Claude n’avait pas fini d’intégrer les cours, il reprendra tout seul.';
const MESSAGES_ERREUR = {
  identifiants_manquants: 'Remplis MYGES_IDENTIFIANT et MYGES_MOT_DE_PASSE dans le fichier .env du projet (modèle : .env.exemple), puis réessaie.',
  identifiants_refuses: 'MyGES refuse la connexion : vérifie le fichier .env (ton identifiant MyGES, pas ton e-mail, et ton mot de passe).',
  injoignable: 'MyGES ne répond pas. Vérifie ta connexion internet et réessaie.',
  reponse_inattendue: 'La page de MyGES a changé : le téléchargement automatique doit être mis à jour.',
  claude_introuvable: 'Claude Code est introuvable : la commande « claude » doit être installée sur cet ordinateur.',
  claude_echec: 'Les cours sont téléchargés, mais Claude n’a pas fini de créer les notes et les exercices.',
  claude_incomplet: 'Les cours sont téléchargés, mais Claude s’est arrêté avant d’avoir tout intégré.',
};

const bouton = (action, texte, classe = 'bouton') => `<button class="${classe}" data-myges-action="${action}">${texte}</button>`;

const enAttente = (etat) => etat.enAttente ?? [];

function attente(etat) {
  const nombre = enAttente(etat).length;
  if (!nombre) return { details: '', actions: '' };
  return {
    details: liste(`${nombre} cours téléchargé${nombre > 1 ? 's' : ''} pas encore intégré${nombre > 1 ? 's' : ''}`, enAttente(etat)),
    actions: bouton('reprendre', '▶ Reprendre l’intégration', 'bouton principal'),
  };
}

function liste(titre, elements) {
  if (!elements.length) return '';
  return `<div class="myges-liste"><span>${titre}</span><ul>${elements.map((element) => `<li>${echapper(element)}</li>`).join('')}</ul></div>`;
}

function contenu(etat) {
  const fait = etat.telecharges.length + etat.rates.length;
  const enSuspens = attente(etat);
  switch (etat.etape) {
    case 'connexion':
      return { texte: 'Connexion à MyGES…', actions: bouton('arreter', 'Arrêter') };
    case 'liste':
      return { texte: 'Recherche des nouveaux cours…', actions: bouton('arreter', 'Arrêter') };
    case 'telechargement':
      return { texte: `Téléchargement… ${fait} / ${etat.total}`, actions: bouton('arreter', 'Arrêter') };
    case 'claude':
      return {
        texte: etat.reprise
          ? 'Reprise : Claude termine les notes et les exercices commencés avant la coupure. Tu peux fermer la page et revenir.'
          : 'Claude crée les notes et les exercices. Ça peut prendre un moment, tu peux fermer la page et revenir.',
        details: liste('Cours à intégrer', enAttente(etat).length ? enAttente(etat) : etat.telecharges) + (etat.lignes.length ? `<div class="myges-journal">${etat.lignes.slice(-5).map((ligne) => `<p>${echapper(ligne)}</p>`).join('')}</div>` : ''),
        actions: bouton('arreter', 'Arrêter'),
      };
    case 'terminee': {
      if (etat.bilan === AUCUN_NOUVEAU_COURS) {
        return { texte: 'Aucun nouveau cours : tout est à jour.', details: enSuspens.details, actions: enSuspens.actions + bouton('lancer', '⟳ Vérifier à nouveau') };
      }
      const nombre = etat.telecharges.length;
      return {
        texte: nombre ? `${nombre} nouveau${nombre > 1 ? 'x' : ''} cours ajouté${nombre > 1 ? 's' : ''}.` : 'Synchro terminée.',
        details: liste('Nouveaux cours', etat.telecharges)
          + etat.matieresCreees.map((matiere) => `<p class="myges-note">Nouvelle matière : ${echapper(matiere)}</p>`).join('')
          + liste('Non téléchargés', etat.rates.map(({ nom, raison }) => `${nom} (${raison})`))
          + (etat.bilan ? `<div class="myges-bilan">${echapper(etat.bilan)}</div>` : '')
          + enSuspens.details,
        actions: enSuspens.actions + (nombre ? bouton('recharger', 'Recharger le site', 'bouton principal') : '') + bouton('lancer', '⟳ Vérifier à nouveau'),
      };
    }
    case 'erreur':
      return {
        texte: MESSAGES_ERREUR[etat.erreur?.code] ?? 'La synchro a échoué.',
        details: (etat.erreur?.message ? `<p class="myges-note">${echapper(etat.erreur.message)}</p>` : '') + (enSuspens.details || liste('Nouveaux cours', etat.telecharges)),
        actions: enSuspens.actions + bouton('lancer', 'Réessayer'),
      };
    default:
      return {
        texte: 'Récupère les nouveaux supports de cours sur MyGES. Claude crée ensuite les notes et les exercices.',
        details: enSuspens.details,
        actions: enSuspens.actions + bouton('lancer', '⬇ Télécharger les nouveaux cours', enSuspens.actions ? 'bouton' : 'bouton principal'),
      };
  }
}

export function rendreEtatMyges(etat) {
  const { texte, details = '', actions } = contenu(etat);
  const classe = etat.etape === 'erreur' ? ' myges-erreur' : ETAPES_ACTIVES.includes(etat.etape) ? ' myges-actif' : '';
  return `
    <div class="myges${classe}">
      <div class="myges-texte">
        <strong>MyGES</strong>
        <span>${echapper(texte)}</span>
        ${details}
      </div>
      <div class="myges-actions">${actions}</div>
    </div>`;
}

async function appeler(methode, chemin) {
  let reponse;
  try {
    reponse = await fetch(chemin, {
      method: methode,
      cache: 'no-store',
      headers: methode === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
      body: methode === 'POST' ? '{}' : undefined,
    });
  } catch {
    throw new Error(SERVEUR_ARRETE);
  }
  const donnees = await reponse.json().catch(() => ({}));
  if (!reponse.ok) throw new Error(donnees.erreur ?? `Erreur ${reponse.status}`);
  return donnees;
}

export function brancherMyges(zone) {
  let minuteur = null;

  const enPlace = () => zone.isConnected;

  function afficher(etat) {
    clearTimeout(minuteur);
    zone.innerHTML = rendreEtatMyges(etat);
    if (ETAPES_ACTIVES.includes(etat.etape)) minuteur = setTimeout(rafraichir, INTERVALLE);
  }

  function afficherProbleme(message) {
    clearTimeout(minuteur);
    zone.innerHTML = `
      <div class="myges myges-erreur">
        <div class="myges-texte"><strong>MyGES</strong><span>${echapper(message)}</span></div>
        <div class="myges-actions">${bouton('rafraichir', 'Réessayer')}</div>
      </div>`;
  }

  async function executer(methode, chemin) {
    try {
      const etat = await appeler(methode, chemin);
      if (enPlace()) afficher(etat);
    } catch (erreur) {
      if (enPlace()) afficherProbleme(erreur.message);
    }
  }

  function rafraichir() {
    if (enPlace()) executer('GET', 'api/myges/etat');
  }

  zone.addEventListener('click', (evenement) => {
    const action = evenement.target.closest('[data-myges-action]')?.dataset.mygesAction;
    if (action === 'lancer') executer('POST', 'api/myges/synchroniser');
    if (action === 'reprendre') executer('POST', 'api/myges/reprendre');
    if (action === 'arreter') executer('POST', 'api/myges/arreter');
    if (action === 'rafraichir') rafraichir();
    if (action === 'recharger') location.reload();
  });

  rafraichir();
}
