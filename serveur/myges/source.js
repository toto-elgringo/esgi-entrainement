import fs from 'node:fs/promises';
import path from 'node:path';
import { estArchive, extraireZip } from '../commun/archives.js';
import { ErreurSynchro } from '../commun/erreurs.js';
import { texteSimple } from '../commun/html.js';
import { cheminSur, nettoyerNom, nomDepuisDisposition, nomLibre } from '../commun/noms.js';
import { cheminPartiel, DELAI_TELECHARGEMENT, enregistrerFlux } from '../commun/telechargement.js';
import { ADRESSE_SITE } from './connexion.js';

export function lirePeriode(html) {
  const choix = /<select[^>]*periodSelect_input[^>]*>[\s\S]*?<option[^>]*selected[^>]*>([^<]*)<\/option>/i.exec(html);
  return choix ? texteSimple(choix[1]) : null;
}

export function lireSupports(html) {
  if (!html.includes('coursesFilesForm')) {
    throw new ErreurSynchro('reponse_inattendue', 'La page des supports de MyGES a changé.');
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
  if (!reponse.ok) throw new ErreurSynchro('reponse_inattendue', `MyGES répond ${reponse.status} pour la page des supports.`);
  return lireSupports(await reponse.text());
}

function extensionDevinee(type, debut) {
  if (estArchive('', debut)) return '.zip';
  if (debut.subarray(0, 5).toString('latin1') === '%PDF-') return '.pdf';
  if (/html/i.test(type ?? '')) return '.html';
  return '';
}

export async function telecharger(session, support, dossier, { signal, tailleMax } = {}) {
  const { reponse } = await session.obtenir(support.adresse, { signal, delai: DELAI_TELECHARGEMENT });
  if (!reponse.ok) {
    await reponse.body?.cancel();
    throw new ErreurSynchro('telechargement_rate', `MyGES répond ${reponse.status}.`);
  }
  await fs.mkdir(dossier, { recursive: true });
  const partiel = cheminPartiel(dossier);
  try {
    const { debut } = await enregistrerFlux(reponse, partiel, { nomSite: session.nomSite, tailleMax });
    const type = reponse.headers.get('content-type');
    const nom = nettoyerNom(nomDepuisDisposition(reponse.headers.get('content-disposition')) ?? `${support.nom}${extensionDevinee(type, debut)}`);
    const existants = (await fs.readdir(dossier)).filter((existant) => existant !== path.basename(partiel));
    if (estArchive(nom, debut)) {
      const nomDossier = nomLibre(nettoyerNom(nom.replace(/\.zip$/i, '')), existants);
      await extraireZip(partiel, cheminSur(dossier, nomDossier));
      return nomDossier;
    }
    const final = nomLibre(nom, existants);
    await fs.rename(partiel, cheminSur(dossier, final));
    return final;
  } finally {
    await fs.rm(partiel, { force: true });
  }
}
