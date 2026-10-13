Un `HashSet` ne garde jamais deux fois la même valeur. Utilise-le pour écrire :

1. `a_des_doublons(v)` : `true` si au moins une valeur apparaît deux fois.
2. `valeurs_uniques(v)` : le nombre de valeurs **différentes**.
3. `elements_communs(a, b)` : les valeurs présentes dans les deux listes, **sans doublon** et **triées** dans l'ordre croissant.

| Appel | Résultat |
|---|---|
| `a_des_doublons(&[1, 2, 3, 2])` | `true` |
| `valeurs_uniques(&[1, 1, 2, 3, 3, 3])` | `3` |
| `elements_communs(&[5, 1, 3, 3], &[3, 4, 5])` | `[3, 5]` |

> [!warning] L'ordre d'un `HashSet` n'est pas garanti
> C'est pour ça que `elements_communs` doit trier son résultat avant de le renvoyer.
