import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { estArchive, extraireZip } from '../commun/archives.js';
import { cheminSur, nettoyerNom, nomDepuisDisposition } from '../commun/noms.js';
import { delaiDepasse, erreurDelai } from '../commun/session.js';
import { cheminPartiel, DELAI_TELECHARGEMENT, enregistrerFlux } from '../commun/telechargement.js';
import { dossierDeMatiere } from '../myges/matieres.js';
import { blocCode, htmlVersMarkdown } from './markdown.js';
import { idVideo, lireCorrectionQcm, lireCours, lireDiaporama, lireDocumentMarkdown, lireExercice, lireSeance, lireSeances, lireSolution } from './pages.js';
import { telechargerVideo } from './videos.js';

const LONGUEUR_NOM = 80;
const LANGAGES_CODE = { c_cpp: 'cpp', python: 'python', java: 'java', javascript: 'javascript', rust: 'rust' };
const EXTENSIONS = {
  'application/pdf': '.pdf',
  'application/zip': '.zip',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
};

const empreinte = (texte) => createHash('sha1').update(texte).digest('hex');
const numero = (valeur) => String(valeur).padStart(2, '0');

export function nomCourt(texte, parDefaut = 'sans titre') {
  const propre = nettoyerNom(texte.replace(/\s+/g, ' ').trim()) || parDefaut;
  return propre.length > LONGUEUR_NOM ? propre.slice(0, LONGUEUR_NOM).trim() : propre;
}

function dossierDeSeance(seance) {
  if (seance.examen) return 'Examens';
  return seance.numero ? `${numero(seance.numero)} - ${nomCourt(seance.titre)}` : nomCourt(seance.titre, `Séance ${seance.id}`);
}

function cheminVault(vault, relatif) {
  const morceaux = relatif.split('/');
  return cheminSur(path.join(vault, ...morceaux.slice(0, -1)), morceaux.at(-1));
}

async function ecrireFichier(vault, relatif, contenu) {
  const chemin = cheminVault(vault, relatif);
  await fs.mkdir(path.dirname(chemin), { recursive: true });
  const partiel = `${chemin}.partiel`;
  try {
    await fs.writeFile(partiel, contenu);
    await fs.rename(partiel, chemin);
  } catch (erreur) {
    await fs.rm(partiel, { force: true });
    throw erreur;
  }
}

export function markdownSeance({ cours, seance, infos, adresseSite }) {
  const lignes = [
    `# ${seance.examen ? 'Examen' : `Séance ${seance.numero ?? ''}`.trim()} : ${seance.titre}`,
    '',
    `- Cours Schooding : ${cours.nom}`,
    `- Lien : ${adresseSite}/course/${cours.id}/?session=${seance.id}`,
  ];
  if (infos.description) lignes.push('', '## Description', '', htmlVersMarkdown(infos.description));
  if (infos.documents.length) lignes.push('', '## Documents', '', ...infos.documents.map((document) => `- ${document.titre}`));
  const categories = [...new Set(infos.exercices.map((exercice) => exercice.categorie))];
  for (const categorie of categories) {
    lignes.push('', `## ${categorie}`, '', ...infos.exercices.filter((exercice) => exercice.categorie === categorie).map((exercice) => `- ${exercice.titre}`));
  }
  return `${lignes.join('\n')}\n`;
}

function resumeHistorique(historique) {
  if (!historique.length) return 'pas encore commencé';
  const dernier = historique.at(-1);
  const meilleur = Math.max(...historique.map((essai) => essai.progression));
  return `${meilleur} % (${historique.length} essai${historique.length > 1 ? 's' : ''}, dernier le ${dernier.date})`;
}

export function markdownExercice({ cours, seance, exercice, page, solution, adresseSite }) {
  const langage = LANGAGES_CODE[page.mode] ?? page.mode ?? '';
  const lignes = [
    `# ${page.titre || exercice.titre}`,
    '',
    `- Cours Schooding : ${cours.nom} · ${seance.examen ? 'Examen' : `séance ${seance.numero}`} : ${seance.titre}`,
    `- Catégorie : ${exercice.categorie}`,
    `- Langage sur Schooding : ${page.historique.at(-1)?.langage ?? langage}`,
    `- Mon avancement : ${resumeHistorique(page.historique)}`,
    `- Lien : ${adresseSite}${exercice.adresse.split('?')[0]}`,
    '',
    '## Énoncé',
    '',
    htmlVersMarkdown(page.enonce) || '(énoncé vide)',
  ];
  if (page.outils.length) {
    lignes.push('', '## Outils fournis', '', ...page.outils.map((outil) => `- **${outil.nom}** : ${htmlVersMarkdown(outil.description).replace(/\n+/g, '\n  ')}`));
  }
  if (page.code.trim()) lignes.push('', page.commence ? '## Mon code' : '## Code de départ', '', blocCode(page.code, langage));
  if (solution?.code.trim()) lignes.push('', '## Solution officielle', '', blocCode(solution.code, LANGAGES_CODE[solution.mode] ?? solution.mode));
  return `${lignes.join('\n')}\n`;
}

export function markdownQcm({ cours, seance, exercice, correction, adresseSite }) {
  const lignes = [
    `# QCM : ${correction.titre || exercice.titre}`,
    '',
    `- Cours Schooding : ${cours.nom} · ${seance.titre}`,
    `- Mon score : ${exercice.indice || 'inconnu'}`,
    `- Lien : ${adresseSite}${exercice.adresse.split('?')[0]}`,
    '- Légende : [x] = bonne réponse, ✔ = je l’ai cochée à raison, ✘ = erreur de ma part (cochée à tort ou oubliée)',
  ];
  correction.questions.forEach((question, indice) => {
    lignes.push('', `## Question ${indice + 1}`, '', htmlVersMarkdown(question.intitule), '');
    for (const choix of question.choix) {
      const marque = choix.coche === choix.bonne ? (choix.coche ? ' ✔' : '') : ' ✘';
      lignes.push(`- [${choix.bonne ? 'x' : ' '}] ${htmlVersMarkdown(choix.texte).replace(/\n+/g, ' ')}${marque}`);
    }
  });
  return `${lignes.join('\n')}\n`;
}

function extensionDe(type, debut) {
  if (estArchive('', debut)) return '.zip';
  if (debut.subarray(0, 5).toString('latin1') === '%PDF-') return '.pdf';
  return EXTENSIONS[(type ?? '').split(';')[0].trim()] ?? '';
}

function videoDe(adresse) {
  try {
    return idVideo(adresse);
  } catch {
    return null;
  }
}

async function enregistrerFichier({ reponse, vault, dossier, nom, type, tailleMax }) {
  const dossierDisque = path.join(vault, ...dossier.split('/'));
  await fs.mkdir(dossierDisque, { recursive: true });
  const partiel = cheminPartiel(dossierDisque);
  try {
    const { debut, empreinte: signature } = await enregistrerFlux(reponse, partiel, { nomSite: 'Schooding', tailleMax });
    const nomFichier = nomCourt(nomDepuisDisposition(reponse.headers.get('content-disposition')) ?? `${nom}${extensionDe(type, debut)}`);
    if (estArchive(nomFichier, debut)) {
      const relatif = `${dossier}/${nomCourt(nomFichier.replace(/\.zip$/i, ''))}`;
      await extraireZip(partiel, path.join(vault, ...relatif.split('/')));
      return { chemin: relatif, type: 'archive', empreinte: signature };
    }
    await fs.rename(partiel, cheminVault(vault, `${dossier}/${nomFichier}`));
    return { chemin: `${dossier}/${nomFichier}`, type: 'fichier', empreinte: signature };
  } finally {
    await fs.rm(partiel, { force: true });
  }
}

async function enregistrerDocument({ client, vault, document, base, ytdlp, signal, tailleMax }) {
  const { reponse, adresse, arrete } = await client.obtenir(`/documents/show/${document.id}/`, { arreterSur: (suivante) => videoDe(suivante) !== null, delai: DELAI_TELECHARGEMENT });
  if (!reponse.ok && !arrete) {
    await reponse.body?.cancel();
    throw new Error(`Schooding répond ${reponse.status}.`);
  }
  const dossier = base.split('/').slice(0, -1).join('/');
  const nom = base.split('/').at(-1);
  const type = reponse.headers.get('content-type') ?? '';
  const video = videoDe(adresse);
  if (video) {
    await reponse.body?.cancel();
    const lien = `https://www.youtube.com/watch?v=${video}`;
    const lignes = [`# ${document.titre}`, '', `- Vidéo YouTube : ${lien}`];
    let telechargee = false;
    let probleme = null;
    if (ytdlp) {
      try {
        const fichier = await telechargerVideo(ytdlp, lien, path.dirname(cheminVault(vault, `${base}.md`)), nom, { signal });
        lignes.push(`- Vidéo téléchargée : ![[${fichier}]]`);
        telechargee = true;
      } catch (erreur) {
        if (signal?.aborted) throw erreur;
        probleme = erreur.message;
      }
    }
    if (!telechargee) lignes.push('- Vidéo non téléchargée : lis sa transcription depuis le lien YouTube.');
    await ecrireFichier(vault, `${base}.md`, `${lignes.join('\n')}\n`);
    return { chemin: `${base}.md`, type: 'video', empreinte: telechargee ? 'video' : 'lien', probleme };
  }
  if (!/html/i.test(type)) return enregistrerFichier({ reponse, vault, dossier, nom, type, tailleMax });
  const html = await reponse.text();
  if (html.includes('SK_svgData')) {
    const diaporama = lireDiaporama(html);
    if (diaporama) {
      const lignes = [`# ${document.titre}`, '', `- Slides Google : ${adresse.split('/embed')[0]}/pub`, `- Titre des slides : ${diaporama.titre}`, `- ${diaporama.diapos.length} diapos (image SVG + texte de chaque diapo)`];
      for (const [indice, diapo] of diaporama.diapos.entries()) {
        const image = `diapo-${String(indice + 1).padStart(3, '0')}.svg`;
        await ecrireFichier(vault, `${base}/${image}`, diapo.svg);
        lignes.push('', `## Diapo ${indice + 1}`, '', `![[${image}]]`, '', diapo.texte || '(pas de texte)');
      }
      await ecrireFichier(vault, `${base}/${nom}.md`, `${lignes.join('\n')}\n`);
      return { chemin: `${base}/${nom}.md`, type: 'slides', empreinte: empreinte(html) };
    }
  }
  const markdown = lireDocumentMarkdown(html);
  if (markdown !== null) {
    await ecrireFichier(vault, `${base}.md`, `# ${document.titre}\n\n${markdown.trim()}\n`);
    return { chemin: `${base}.md`, type: 'markdown', empreinte: empreinte(markdown) };
  }
  if (new URL(adresse).origin === new URL(client.adresseSite).origin) {
    await ecrireFichier(vault, `${base}.html`, html);
    return { chemin: `${base}.html`, type: 'page', empreinte: empreinte(html) };
  }
  await ecrireFichier(vault, `${base}.md`, `# ${document.titre}\n\n- Page web : ${adresse}\n`);
  return { chemin: `${base}.md`, type: 'lien', empreinte: empreinte(adresse) };
}

function preparerTaches({ cours, seance, infos, racine, suivi, prevues, ytdlp, adresseSite }) {
  const taches = [];
  const dossier = `${racine}/${dossierDeSeance(seance)}`;
  if (!seance.examen) {
    const cle = `seance-${seance.id}`;
    const contenu = markdownSeance({ cours, seance, infos, adresseSite });
    if (suivi[cle]?.empreinte !== empreinte(contenu) && !prevues.has(cle)) {
      taches.push({ cle, nom: `${cours.nom} / ${seance.titre}`, preparer: async () => ({ chemin: suivi[cle]?.chemin ?? `${dossier}/Séance.md`, contenu }) });
    }
    prevues.add(cle);
  }
  infos.documents.forEach((document, indice) => {
    const cle = `doc-${document.id}`;
    const connu = suivi[cle];
    const aRefaire = !connu || (connu.type === 'video' && connu.empreinte === 'lien' && ytdlp);
    if (prevues.has(cle) || !aRefaire) return prevues.add(cle);
    prevues.add(cle);
    const base = connu?.base ?? `${dossier}/Documents/${numero(indice + 1)} - ${nomCourt(document.titre)}`;
    taches.push({ cle, nom: `${cours.nom} / ${document.titre}`, document, base });
  });
  const positions = {};
  for (const exercice of infos.exercices) {
    positions[exercice.categorie] = (positions[exercice.categorie] ?? 0) + 1;
    const cle = exercice.type === 'correction' ? `qcm-${exercice.id}` : `exo-${exercice.id}`;
    if (prevues.has(cle)) continue;
    prevues.add(cle);
    if (suivi[cle] && suivi[cle].indice === exercice.indice) continue;
    const nom = seance.examen
      ? `${nomCourt(seance.titre)} - ${nomCourt(exercice.titre)}.md`
      : `${nomCourt(exercice.categorie)}/${numero(positions[exercice.categorie])} - ${nomCourt(exercice.titre)}.md`;
    taches.push({ cle, nom: `${cours.nom} / ${exercice.titre}`, exercice, indice: exercice.indice, chemin: suivi[cle]?.chemin ?? `${dossier}/${nom}` });
  }
  return taches.map((tache) => ({ ...tache, cours, seance }));
}

async function contenuExercice(client, tache) {
  const { cours, seance, exercice } = tache;
  const html = await client.texte(exercice.adresse);
  if (exercice.type === 'correction') return markdownQcm({ cours, seance, exercice, correction: lireCorrectionQcm(html), adresseSite: client.adresseSite });
  if (exercice.type !== 'codingtest') {
    const corps = /<div id="mainContainer"[\s\S]*$/.exec(html)?.[0] ?? html;
    return `# ${exercice.titre}\n\n- Lien : ${client.adresseSite}${exercice.adresse.split('?')[0]}\n\n${htmlVersMarkdown(corps)}\n`;
  }
  const page = lireExercice(html);
  const solution = exercice.solution ? lireSolution(await client.texte(exercice.solution)) : null;
  return markdownExercice({ cours, seance, exercice, page, solution, adresseSite: client.adresseSite });
}

export async function recolterSchooding({ client, accueil, vault, suivi, correspondance, ytdlp, signal, etat, maintenant, enregistrerSuivi, ajouterEnAttente, tailleMax }) {
  const prevues = new Set();
  const taches = [];
  const matieresNouvelles = new Map();
  let verrouillees = 0;
  for (const cours of lireCours(accueil)) {
    if (signal.aborted) return { matieresNouvelles: [] };
    const { dossier, nouvelle } = dossierDeMatiere(correspondance, cours.nom);
    if (nouvelle) matieresNouvelles.set(dossier, { matiere: cours.nom, dossier });
    const racine = `${dossier}/Sources/Schooding`;
    for (const seance of lireSeances(await client.texte(`/course/${cours.id}/`))) {
      if (signal.aborted) return { matieresNouvelles: [] };
      const infos = lireSeance(await client.texte(`/session/${seance.id}/`));
      if (infos.verrouillee) {
        verrouillees += 1;
        continue;
      }
      taches.push(...preparerTaches({ cours, seance, infos, racine, suivi, prevues, ytdlp, adresseSite: client.adresseSite }));
    }
  }
  etat.dejaPresents = prevues.size - taches.length;
  etat.total = taches.length;
  if (verrouillees) etat.notes.push(`${verrouillees} séance${verrouillees > 1 ? 's' : ''} encore verrouillée${verrouillees > 1 ? 's' : ''} sur Schooding : elle${verrouillees > 1 ? 's seront récupérées' : ' sera récupérée'} quand tu l${verrouillees > 1 ? 'es' : 'a'} débloqueras.`);
  if (!taches.length) return { matieresNouvelles: [...matieresNouvelles.values()] };
  etat.etape = 'telechargement';
  let videosEnLien = 0;
  for (const tache of taches) {
    if (signal.aborted) break;
    try {
      let resultat;
      if (tache.document) {
        resultat = await enregistrerDocument({ client, vault, document: tache.document, base: tache.base, ytdlp, signal, tailleMax });
        if (resultat.type === 'video' && resultat.empreinte === 'lien') videosEnLien += 1;
        if (resultat.probleme) etat.rates.push({ nom: tache.nom, raison: resultat.probleme });
        suivi[tache.cle] = { chemin: resultat.chemin, base: tache.base, type: resultat.type, empreinte: resultat.empreinte, le: maintenant() };
      } else {
        const { chemin, contenu } = tache.preparer ? await tache.preparer() : { chemin: tache.chemin, contenu: await contenuExercice(client, tache) };
        const ancienne = suivi[tache.cle]?.empreinte;
        suivi[tache.cle] = { chemin, empreinte: empreinte(contenu), indice: tache.indice ?? null, le: maintenant() };
        if (ancienne === suivi[tache.cle].empreinte) {
          await enregistrerSuivi(suivi);
          etat.avance += 1;
          continue;
        }
        await ecrireFichier(vault, chemin, contenu);
        resultat = { chemin };
      }
      await enregistrerSuivi(suivi);
      await ajouterEnAttente(resultat.chemin);
      etat.telecharges.push(resultat.chemin);
    } catch (erreur) {
      if (signal.aborted) break;
      if (erreur.code === 'trop_de_requetes') throw erreur;
      etat.rates.push({ nom: tache.nom, raison: delaiDepasse(erreur) ? erreurDelai('Schooding').message : erreur.message });
    }
    etat.avance += 1;
  }
  if (videosEnLien) etat.notes.push(`${videosEnLien} vidéo${videosEnLien > 1 ? 's gardées' : ' gardée'} en lien YouTube : installe yt-dlp (py -m pip install yt-dlp) pour les télécharger à la prochaine synchro.`);
  return { matieresNouvelles: [...matieresNouvelles.values()] };
}
