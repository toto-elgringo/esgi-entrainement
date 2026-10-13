export function cleExercice(chapitreCle, exerciceId) {
  return `${chapitreCle}/${exerciceId}`;
}

export function chapitresDeMatiere(chapitres, matiere) {
  if (!matiere) return [];
  return chapitres.filter((chapitre) => chapitre.matieres.includes(matiere));
}

export function listeExercices(chapitres) {
  return chapitres.flatMap((chapitre) =>
    chapitre.exercices.map((exercice) => ({ ...exercice, chapitreCle: chapitre.cle })),
  );
}

export function lienExercice(exercice) {
  return `#/exercice/${exercice.chapitreCle}/${exercice.id}`;
}

export function estReussi(progression, chapitreCle, exerciceId) {
  return Boolean(progression.exercices[cleExercice(chapitreCle, exerciceId)]?.reussi);
}

export function voisins(chapitres, chapitreCle, exerciceId) {
  const liste = listeExercices(chapitres);
  const index = liste.findIndex((exercice) => exercice.chapitreCle === chapitreCle && exercice.id === exerciceId);
  if (index === -1) return { precedent: null, suivant: null };
  return {
    precedent: liste[index - 1] ?? null,
    suivant: liste[index + 1] ?? null,
  };
}

export function prochainExercice(chapitres, progression) {
  return listeExercices(chapitres).find((exercice) => !estReussi(progression, exercice.chapitreCle, exercice.id)) ?? null;
}

export function compterProgression(chapitres, progression) {
  const exercices = listeExercices(chapitres);
  return {
    reussis: exercices.filter((exercice) => estReussi(progression, exercice.chapitreCle, exercice.id)).length,
    total: exercices.length,
  };
}
