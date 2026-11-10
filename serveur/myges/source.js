import fs from 'node:fs/promises';
import { estArchive, extraireZip } from './archives.js';
import { ADRESSE_SITE } from './connexion.js';
import { ErreurMyges } from './erreurs.js';
import { texteSimple } from './html.js';
import { cheminSur, nettoyerNom, nomDepuisDisposition, nomLibre } from './noms.js';

export function lirePeriode(html) {
  const choix = /<select[^>]*periodSelect_input[^>]*>[\s\S]*?<option[^>]*selected[^>]*>([^<]*)<\/option>/i.exec(html);
  return choix ? texteSimple(choix[1]) : null;
}

export function lireSupports(html) {
  if (!html.includes('coursesFilesForm')) {
    throw new ErreurMyges('reponse_inattendue', 'La page des supports de MyGES a changé.');
  }
  const supports = [];
  for (const bloc of html.split(/<h3\b[^>]*ui-accordion-header/i).slice(1)) {
    const titre = /class="mg_inherit_color">([\s\S]*?)<span/i.exec(bloc);
    if (!titre) continue;
    const matiere = texteSimple(titre[1]);
    for (const [ligne] of bloc.matchAll(/<tr\b[^>]*data-ri=[\s\S]*?<\/tr>/gi)) {
      const adresse = /window\.open\('([^']+)'\)/.exec(ligne)?.[1];
      const nom = /<a\b[^>]*>([\s\S]*?)<\/a>/i.exec(ligne)?.[1];
      if (!adresse || !nom) continue;
      supports.push({
        id: new URL(adresse).pathname.split('/').filter(Boolean).at(-1),
        matiere,
        nom: texteSimple(nom),
        type: /mimetypes\/([\w-]+)\.png/.exec(ligne)?.[1] ?? 'default',
        ajouteLe: /(\d{2}\/\d{2}\/\d{4} \d{2}h\d{2})/.exec(ligne)?.[1] ?? null,
        adresse,
      });
    }
  }
  return supports;
}

export async function listerSupports(session, { adresseSite = ADRESSE_SITE, signal } = {}) {
  const { reponse } = await session.obtenir(`${adresseSite}/student/courses-files`, { signal });
  if (!reponse.ok) throw new ErreurMyges('reponse_inattendue', `MyGES répond ${reponse.status} pour la page des supports.`);
  return lireSupports(await reponse.text());
}

function extensionDevinee(type, donnees) {
  if (estArchive('', donnees)) return '.zip';
  if (donnees.subarray(0, 5).toString('latin1') === '%PDF-') return '.pdf';
  if (/html/i.test(type ?? '')) return '.html';
  return '';
}

export async function telecharger(session, support, dossier, { signal } = {}) {
  const { reponse } = await session.obtenir(support.adresse, { signal });
  if (!reponse.ok) {
    await reponse.body?.cancel();
    throw new ErreurMyges('telechargement_rate', `MyGES répond ${reponse.status}.`);
  }
  const donnees = Buffer.from(await reponse.arrayBuffer());
  const type = reponse.headers.get('content-type');
  const nom = nettoyerNom(nomDepuisDisposition(reponse.headers.get('content-disposition')) ?? `${support.nom}${extensionDevinee(type, donnees)}`);
  await fs.mkdir(dossier, { recursive: true });
  const existants = await fs.readdir(dossier);
  if (estArchive(nom, donnees)) {
    const nomDossier = nomLibre(nettoyerNom(nom.replace(/\.zip$/i, '')), existants);
    await extraireZip(donnees, cheminSur(dossier, nomDossier));
    return nomDossier;
  }
  const final = nomLibre(nom, existants);
  const chemin = cheminSur(dossier, final);
  const partiel = `${chemin}.partiel`;
  try {
    await fs.writeFile(partiel, donnees);
    await fs.rename(partiel, chemin);
  } catch (erreur) {
    await fs.rm(partiel, { force: true });
    throw erreur;
  }
  return final;
}
