Écris trois fonctions :

1. `trier_sans_doublons(v)` : la liste triée dans l'ordre croissant, sans doublons.
2. `trois_plus_grands(v)` : les trois plus grandes valeurs, de la plus grande à la plus petite (ou moins de trois si la liste est plus courte).
3. `ordre_alphabetique(mots)` : les mots triés par ordre alphabétique.

| Appel | Résultat |
|---|---|
| `trier_sans_doublons(vec![3, 1, 3, 2, 1])` | `[1, 2, 3]` |
| `trois_plus_grands(&[5, 1, 9, 7, 3])` | `[9, 7, 5]` |
| `trois_plus_grands(&[2, 8])` | `[8, 2]` |
| `ordre_alphabetique(vec!["poire", "abricot", "mangue"])` | `["abricot", "mangue", "poire"]` |

> [!info] `mut` dans un paramètre
> `fn f(mut v: Vec<i32>)` : la fonction reçoit la liste (elle en devient propriétaire) et a le droit de la modifier.
