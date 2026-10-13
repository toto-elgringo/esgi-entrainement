On veut analyser un texte. Un **mot** est une suite de lettres ou de chiffres : tout le reste (espaces, ponctuation, apostrophes...) sépare les mots. Les mots sont comptés **en minuscules** (`Le` et `le` sont le même mot).

Écris :

1. `compter_mots(texte)` : le nombre de mots.
2. `frequences(texte)` : une `HashMap` qui associe chaque mot (en minuscules) à son nombre d'apparitions.
3. `mot_le_plus_frequent(texte)` : `Some((mot, nombre))` pour le mot le plus fréquent, ou `None` si le texte n'a aucun mot. En cas d'égalité, choisis le premier dans l'ordre **alphabétique**.

Avec `"Le chat et le chien. LE chat !"` :

| Appel | Résultat |
|---|---|
| `compter_mots(...)` | `7` |
| `frequences(...)` | `le → 3`, `chat → 2`, `et → 1`, `chien → 1` |
| `mot_le_plus_frequent(...)` | `Some(("le".to_string(), 3))` |

> [!tip] Découper selon une condition
> `split` accepte une fonction : `texte.split(|c: char| !c.is_alphanumeric())` coupe à chaque caractère qui n'est ni une lettre ni un chiffre. Cela produit des morceaux vides à enlever.
