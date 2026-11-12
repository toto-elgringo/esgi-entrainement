Écris deux fonctions **récursives**, sans `for`, sans `while` et sans itérateur, uniquement avec un `match` sur la forme de la slice.

| Fonction | Rôle |
|---|---|
| `somme(liste)` | additionne tous les éléments (`0` si la liste est vide) |
| `minimum(liste)` | le plus petit élément, ou `None` si la liste est vide |

| Appel | Résultat |
|---|---|
| `somme(&[1, 2, 3, 4])` | `10` |
| `minimum(&[5, 2, 9])` | `Some(2)` |
| `minimum(&[])` | `None` |

> [!info] Les motifs utiles
> `[]` : vide. `[x]` : un seul élément. `[premier, reste @ ..]` : un premier élément et le reste (`reste` est une slice).
