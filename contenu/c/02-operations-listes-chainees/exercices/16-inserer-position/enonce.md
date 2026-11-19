Écris la fonction `insererPosition(start, position, valeur)` qui ajoute un maillon de valeur `valeur` pour qu'il se retrouve **en position `position`** (0 = le premier).

À partir de `10 -> 20 -> 30` :

| Appel | Résultat |
|---|---|
| `insererPosition(&l, 0, 5)` | `5 -> 10 -> 20 -> 30` |
| `insererPosition(&l, 1, 15)` | `10 -> 15 -> 20 -> 30` |
| `insererPosition(&l, 3, 35)` | `10 -> 20 -> 30 -> 35` |
| `insererPosition(&l, 99, 40)` | `10 -> 20 -> 30 -> 40` (trop loin : à la fin) |
| `insererPosition(&l, -2, 1)` | `1 -> 10 -> 20 -> 30` (négatif : au début) |

Dans une liste vide, le nouveau maillon devient le seul maillon, quelle que soit la position.

> [!tip] Vérifie sur papier
> Pour `position = 1`, le maillon d'avant est le **premier** : la boucle ne doit faire aucun tour.
