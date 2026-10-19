Écris la fonction `obtenirElement(start, position)` qui renvoie le maillon situé à la position `position` (le premier maillon est en position 0), ou `NULL` si la liste est trop courte.

Dans la liste `10 -> 20 -> 30` :

| Appel | Résultat |
|---|---|
| `obtenirElement(start, 0)` | le maillon de valeur 10 |
| `obtenirElement(start, 2)` | le maillon de valeur 30 |
| `obtenirElement(start, 3)` | `NULL` |

`position` n'est jamais négative.

> [!info] Complexité
> Pour atteindre la position i, il faut suivre i pointeurs : O(N) au pire, là où un tableau répond en O(1) avec `t[i]`.
