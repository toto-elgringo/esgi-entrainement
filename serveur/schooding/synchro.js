import path from 'node:path';
import { identifiantsSchooding, lireEnv } from '../commun/env.js';
import { ErreurSynchro } from '../commun/erreurs.js';
import { ecrireJson, lireJson } from '../commun/json.js';
import { ajouterMatieres } from '../myges/matieres.js';
import { creerSynchroSource, promptClaude as promptCommun } from '../synchro.js';
import { connecterSchooding } from './connexion.js';
import { recolterSchooding } from './source.js';
import { trouverYtDlp } from './videos.js';

export function promptClaude(fichiers, { reprise = false } = {}) {
  return promptCommun(fichiers, {
    reprise,
    entete: 'Nouveaux éléments (ou mis à jour) téléchargés depuis Schooding, la plateforme d’exercices de Scripting Python et d’Algorithmique avancée (chemins relatifs à « Cours - ESGI ») :',
    consignes: [
      'Dans « <Matière>/Sources/Schooding/ », chaque séance a son dossier : Séance.md (description et liste des documents et exercices), Documents/ (cours en Markdown, slides Google avec le texte et l’image SVG de chaque diapo, vidéos YouTube avec leur lien et parfois la vidéo .mp4), Exercices/ et Devoirs Maison/ (énoncé, mon code rendu ou le code de départ, mon avancement, la solution officielle quand elle existe). Examens/ contient les QCM corrigés.',
      '',
      'Intègre-les dans les notes Obsidian et dans le site :',
      '- cours : reprends toutes les notions des documents, des slides et des vidéos (pour la transcription YouTube, utilise yt-dlp avec --skip-download --write-auto-subs --sub-langs fr,en dans un dossier temporaire, puis mets ce dossier à la corbeille avec trash) ;',
      '- exercices : ne recopie pas ceux de Schooding. Crée des exercices adaptés au site, progressifs, pour bien apprendre chaque notion, avec des tests (Scripting Python → domaine python ; Algorithmique avancée → domaine c, en C17 même si Schooding utilise du C++) ;',
      '- mon code rendu : repère mes erreurs, mes oublis et mes points faibles, et ajoute des exercices ciblés dessus ;',
      '- examens : sers-toi des QCM corrigés comme modèle pour des quiz de type évaluation (même style et même niveau de questions), sans recopier les questions ;',
      '- un fichier mis à jour remplace l’ancien : n’intègre que ce qui a changé. Ne refais pas ce qui existe déjà.',
    ],
  });
}

export function creerSynchroSchooding({ vault, fichierEnv, fichierSuivi, fichierMatieres, fichierAttente, dossierProjet, claude, adresseSite, pause, attentes, delai, tailleMax, chercherYtDlp = trouverYtDlp, verrou, horloge, dossierJournal }) {
  async function recolter({ signal, etat, maintenant, ajouterEnAttente }) {
    const identifiants = identifiantsSchooding(await lireEnv(fichierEnv));
    if (!identifiants) throw new ErreurSynchro('identifiants_manquants', 'Identifiants Schooding absents du fichier .env.');
    const { client, accueil } = await connecterSchooding(identifiants, { adresseSite, pause, attentes, signal, delai });
    if (signal.aborted) return;
    etat.etape = 'liste';
    const ytdlp = await chercherYtDlp();
    const suivi = await lireJson(fichierSuivi, {});
    const correspondance = await lireJson(fichierMatieres, {});
    const { matieresNouvelles } = await recolterSchooding({
      client,
      accueil,
      vault,
      suivi,
      correspondance,
      ytdlp,
      signal,
      etat,
      maintenant,
      ajouterEnAttente,
      tailleMax,
      enregistrerSuivi: (valeur) => ecrireJson(fichierSuivi, valeur),
    });
    if (signal.aborted) return;
    await ajouterMatieres(fichierMatieres, matieresNouvelles);
    etat.matieresCreees = matieresNouvelles.map(({ dossier }) => dossier);
  }

  return creerSynchroSource({
    nom: 'Schooding',
    vault,
    fichierAttente,
    fichiersPrives: [path.basename(fichierSuivi), path.basename(fichierAttente)],
    dossierProjet,
    claude,
    recolter,
    prompt: promptClaude,
    verrou,
    horloge,
    dossierJournal,
  });
}
