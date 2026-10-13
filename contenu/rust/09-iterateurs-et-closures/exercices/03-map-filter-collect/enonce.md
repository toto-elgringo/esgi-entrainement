Écris chaque fonction en **une seule chaîne d'itérateurs**, sans boucle `for` :

1. `carres(v)` : la liste des carrés.
2. `seulement_pairs(v)` : seulement les éléments pairs, dans le même ordre.
3. `longueurs(mots)` : la longueur (en octets) de chaque mot.

| Appel | Résultat |
|---|---|
| `carres(&[1, 2, 3])` | `[1, 4, 9]` |
| `seulement_pairs(&[1, 2, 3, 4, 6])` | `[2, 4, 6]` |
| `longueurs(&["a", "rust", "ok"])` | `[1, 4, 2]` |

> [!tip] Le schéma de base
> `iter()` pour parcourir → `map` / `filter` pour transformer → `collect()` pour ranger le résultat dans un `Vec`.
