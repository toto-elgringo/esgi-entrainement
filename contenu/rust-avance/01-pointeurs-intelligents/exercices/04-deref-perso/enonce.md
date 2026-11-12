# Ma propre boîte avec Deref

Voici une boîte maison, `MaBoite<T>`, qui range une valeur. Pour qu'elle se comporte comme une référence, il faut implémenter le trait `Deref`.

À faire :

1. `MaBoite::new(valeur)` : construit la boîte.
2. `impl Deref for MaBoite<T>` : `deref` renvoie une référence vers la valeur rangée.
3. `saluer(nom: &str)` : renvoie `"Bonjour <nom> !"`.
4. `nombre_de_lettres(texte: &str)` : renvoie le nombre de caractères (pas d'octets).

Les tests vérifient que :

- `*boite` donne la valeur ;
- `saluer(&boite_de_string)` marche : c'est la **coercion deref** (`&MaBoite<String>` devient `&String` puis `&str`) ;
- on peut appeler directement les méthodes du contenu (`boite.len()`).
