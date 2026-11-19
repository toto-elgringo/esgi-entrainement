Ces fonctions **modifient la liste reçue** (elles ne renvoient pas de nouvelle liste) :

| Fonction | Effet | Exemple avec `l = [1, 2, 3]` |
|---|---|---|
| `encadrer(l, debut, fin)` | ajoute `debut` au début et `fin` à la fin. Ne renvoie rien | `encadrer(l, 0, 9)` → `l` vaut `[0, 1, 2, 3, 9]` |
| `ajouter_plusieurs(l, valeurs)` | ajoute à la fin chaque élément de l'itérable `valeurs`. Ne renvoie rien | `ajouter_plusieurs(l, "ab")` → `[1, 2, 3, "a", "b"]` |
| `retirer_toutes(l, x)` | retire **toutes** les occurrences de `x` et renvoie combien il y en avait | `retirer_toutes([1, 5, 1], 1)` → `2`, la liste vaut `[5]` |
| `garder_indices_pairs(l)` | supprime les éléments d'indice impair. Ne renvoie rien | `[10, 11, 12, 13, 14]` devient `[10, 12, 14]` |

Et une fonction de recherche :

- `position(l, x, debut=0)` : l'indice de la première occurrence de `x` à partir de l'indice `debut`, ou `-1` si `x` n'y est pas. `position([4, 7, 4], 4, 1)` → `2`.

> [!warning] Sur place
> `l = l + [fin]` dans la fonction crée une **nouvelle** liste : la liste de l'appelant ne change pas. Les tests vérifient que c'est bien la même liste qui a été modifiée.
