Écris la fonction `rechercher(start, valeur)` qui renvoie le **premier maillon** dont la valeur vaut `valeur`, ou `NULL` si aucun maillon ne la contient.

Dans la liste `4 -> 8 -> 15 -> 16` :

| Appel | Résultat |
|---|---|
| `rechercher(start, 15)` | le 3e maillon (l'adresse du maillon, pas la valeur) |
| `rechercher(start, 4)` | le 1er maillon, c'est-à-dire `start` |
| `rechercher(start, 42)` | `NULL` |

> [!info] Pourquoi renvoyer le maillon ?
> Avec le maillon, on peut ensuite lire sa valeur, la modifier ou insérer un maillon juste après lui.
