Un code qui écrit `mots[position]` **panique** si l'index n'existe pas, et rien dans la signature ne le prévient. Avec `Option`, l'absence devient visible et se traite en chaîne.

Écris, **sans aucun `panic!`, `unwrap` ni `[]`** :

1. `initiale(mots, position)` : la première lettre du mot à cette position, en majuscule, sous forme de `String`. Si la position n'existe pas ou si le mot est vide, renvoie `"?"`.
2. `inverse(x)` : `Some(1.0 / x)` si `x` n'est pas nul, sinon `None`.
3. `inverse_de_inverse_plus_un(x)` : l'inverse de l'inverse de `x`, plus 1, en enchaînant avec `and_then` et `map` ; `None` si `x` vaut `0`.

| Appel | Résultat |
|---|---|
| `initiale(&["rust", "cargo"], 1)` | `"C"` |
| `initiale(&["rust"], 5)` | `"?"` |
| `initiale(&[""], 0)` | `"?"` |
| `inverse_de_inverse_plus_un(4.0)` | `Some(5.0)` |
| `inverse_de_inverse_plus_un(0.0)` | `None` |

> [!info] Les trois outils
> `map` transforme la valeur si elle existe, `and_then` enchaîne une étape qui peut elle-même échouer, `unwrap_or_else` donne une valeur par défaut.
