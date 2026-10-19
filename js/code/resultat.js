import { echapper } from '../outils.js';
import { lienExercice } from '../parcours.js';
import { terminalVersHtml } from './terminal.js';

const STATUTS = {
  reussi: { classe: 'succes', titre: 'Bravo, exercice réussi !' },
  echec: { classe: 'erreur', titre: 'Pas encore : la vérification échoue' },
  erreur_compilation: { classe: 'attention', titre: 'Le code ne compile pas' },
  delai_depasse: {
    classe: 'attention',
    titre: 'Trop long !',
    conseil: 'Ton programme tourne peut-être en boucle infinie, ou ton algorithme est trop lent.',
  },
  execute: { classe: 'info', titre: 'Programme exécuté' },
  erreur_execution: { classe: 'erreur', titre: 'Le programme a planté' },
  outil_introuvable: { classe: 'erreur', titre: 'Outil introuvable sur ton ordinateur' },
  erreur_plateforme: { classe: 'erreur', titre: 'Erreur de la plateforme' },
};

const PAR_LANGAGE = {
  rust: {
    attente: 'Compilation en cours…',
    avertissements: 'Avertissements et conseils de cargo',
    erreur_compilation: { conseil: 'Lis le message jusqu’à la ligne « help: » : elle donne souvent la correction.' },
    erreur_execution: { conseil: 'Une panique arrête le programme : cherche la ligne « panicked at ».' },
    outil_introuvable: { titre: 'cargo est introuvable sur ton ordinateur' },
  },
  python: {
    attente: 'Exécution en cours…',
    avertissements: 'Avertissements',
    erreur_compilation: {
      titre: 'Erreur de syntaxe',
      conseil: 'Le « ^ » montre où Python s’est perdu. Regarde aussi la ligne d’avant : deux-points, parenthèse ou indentation oubliés ?',
    },
    erreur_execution: { conseil: 'Lis la dernière ligne (le type d’erreur), puis remonte à la ligne indiquée dans exercice.py.' },
    outil_introuvable: { titre: 'Python est introuvable sur ton ordinateur' },
  },
  c: {
    attente: 'Compilation en cours…',
    avertissements: 'Avertissements de gcc',
    erreur_compilation: { conseil: 'Corrige d’abord la première erreur : les suivantes en découlent souvent.' },
    erreur_execution: { conseil: 'En C, un plantage vient souvent d’un pointeur NULL, non initialisé ou déjà libéré.' },
    outil_introuvable: { titre: 'gcc est introuvable sur ton ordinateur' },
  },
};

function statutPour(resultat, langage) {
  const commun = STATUTS[resultat.statut] ?? STATUTS.erreur_plateforme;
  return { ...commun, ...(PAR_LANGAGE[langage]?.[resultat.statut] ?? {}) };
}

function rendreResultat(resultat, { langage, suivant }) {
  const statut = statutPour(resultat, langage);
  const resume = resultat.resume;
  const detail = resume ? `${resume.reussis} / ${resume.reussis + resume.echoues} vérifications réussies` : '';
  const comparer = resultat.statut === 'echec' && typeof resultat.attendu === 'string';

  const corps = comparer
    ? `<div class="comparaison">
        <div><h4>Ton programme affiche</h4><pre>${terminalVersHtml(resultat.sortie?.trim() || '(rien)')}</pre></div>
        <div><h4>Attendu</h4><pre>${echapper(resultat.attendu.trim())}</pre></div>
      </div>`
    : `<pre>${terminalVersHtml(resultat.sortie?.trim() || '(aucune sortie)')}</pre>`;

  const titreAvertissements = PAR_LANGAGE[langage]?.avertissements ?? 'Avertissements';
  const avertissements = resultat.avertissements?.trim()
    ? `<details class="avertissements"><summary>${titreAvertissements}</summary><pre>${terminalVersHtml(resultat.avertissements.trim())}</pre></details>`
    : '';

  const lienSuivant = resultat.statut === 'reussi' && suivant
    ? `<a class="bouton succes" href="${lienExercice(suivant)}">Exercice suivant →</a>`
    : '';

  return {
    classe: statut.classe,
    html: `
      <div class="resultat-entete">${statut.titre}<span class="detail">${detail}</span>${lienSuivant}</div>
      ${statut.conseil ? `<p class="resultat-conseil">${statut.conseil}</p>` : ''}
      ${corps}
      ${avertissements}`,
  };
}

const TAILLE_MAX_ENREGISTREE = 20000;
const STATUTS_PASSAGERS = new Set(['outil_introuvable', 'erreur_plateforme']);

function couper(texte) {
  return typeof texte === 'string' && texte.length > TAILLE_MAX_ENREGISTREE
    ? `${texte.slice(0, TAILLE_MAX_ENREGISTREE)}\n…`
    : texte;
}

export function resultatAEnregistrer(resultat) {
  if (STATUTS_PASSAGERS.has(resultat.statut)) return null;
  return Object.fromEntries(Object.entries(resultat).map(([champ, valeur]) => [champ, couper(valeur)]));
}

function remplir(zone, classe, html) {
  zone.className = `resultat ${classe}`;
  zone.innerHTML = html;
  zone.hidden = false;
}

export function afficherCompilation(zone, langage) {
  remplir(zone, 'info', `<div class="resultat-entete">${PAR_LANGAGE[langage]?.attente ?? 'Exécution en cours…'}</div>`);
}

export function afficherResultat(zone, resultat, { langage, suivant = null } = {}) {
  const { classe, html } = rendreResultat(resultat, { langage, suivant });
  remplir(zone, classe, html);
}
