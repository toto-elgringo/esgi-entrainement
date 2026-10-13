async function lire(chemin, format) {
  const reponse = await fetch(chemin, { cache: 'no-cache' });
  if (!reponse.ok) throw new Error(`Impossible de charger ${chemin}`);
  return format === 'texte' ? reponse.text() : reponse.json();
}

async function lireOuDefaut(chemin, defaut) {
  try {
    return await lire(chemin);
  } catch {
    return defaut;
  }
}

async function chargerChapitreMaths(id) {
  const [meta, exercices, quiz] = await Promise.all([
    lire(`contenu/maths/${id}/chapitre.json`),
    lireOuDefaut(`contenu/maths/${id}/exercices.json`, []),
    lireOuDefaut(`contenu/maths/${id}/quiz.json`, []),
  ]);
  return { ...meta, id, cle: `maths/${id}`, domaine: 'maths', matieres: meta.matieres ?? [], exercices, quiz };
}

async function chargerMaths() {
  const programme = await lire('contenu/maths/programme.json');
  const chapitres = await Promise.all(programme.chapitres.map((id) => chargerChapitreMaths(id).catch(() => null)));
  return {
    matieres: programme.matieres.map((matiere) => ({ ...matiere, domaine: 'maths' })),
    chapitres: chapitres.filter(Boolean),
  };
}

async function chargerRust() {
  const sommaire = await lire('contenu/rust/sommaire.json');
  return {
    matieres: [{ id: 'rust', titre: 'Rust', domaine: 'rust' }],
    chapitres: sommaire.chapitres.map((chapitre) => ({
      ...chapitre,
      cle: `rust/${chapitre.id}`,
      domaine: 'rust',
      matieres: ['rust'],
    })),
  };
}

export async function chargerCatalogue() {
  const [rust, maths] = await Promise.all([chargerRust(), chargerMaths()]);
  return {
    matieres: [...rust.matieres, ...maths.matieres],
    chapitres: [...rust.chapitres, ...maths.chapitres],
  };
}

const textesEnCache = new Map();

async function lireTexteEnCache(chemin) {
  if (!textesEnCache.has(chemin)) textesEnCache.set(chemin, await lire(chemin, 'texte'));
  return textesEnCache.get(chemin);
}

export function chargerCours(chapitre) {
  return lireTexteEnCache(`contenu/${chapitre.domaine}/${chapitre.id}/cours.md`);
}

export function chargerFichierRust(chapitreId, exerciceId, nom) {
  return lireTexteEnCache(`contenu/rust/${chapitreId}/exercices/${exerciceId}/${nom}`);
}
