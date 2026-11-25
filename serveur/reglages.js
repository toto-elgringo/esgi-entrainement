export function lireAdresses(texte) {
  return (texte ?? '')
    .split(',')
    .map((adresse) => adresse.trim().toLowerCase())
    .filter(Boolean);
}
