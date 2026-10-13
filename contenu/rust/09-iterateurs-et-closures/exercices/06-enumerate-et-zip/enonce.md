Deux adaptateurs très utiles :

- `enumerate()` ajoute l'**indice** de chaque élément : `(0, a), (1, b)...`
- `zip(autre)` avance dans **deux** listes en même temps : `(a[0], b[0]), (a[1], b[1])...`

Écris, sans boucle `for` :

1. `positions_de(v, cible)` : tous les indices où `v` contient `cible`.
2. `produit_scalaire(a, b)` : la somme des `a[i] × b[i]`.
3. `numeroter(mots)` : chaque mot précédé de son numéro, en commençant à 1.

| Appel | Résultat |
|---|---|
| `positions_de(&[7, 3, 7, 1], 7)` | `[0, 2]` |
| `produit_scalaire(&[1, 2, 3], &[4, 5, 6])` | `32` (4 + 10 + 18) |
| `numeroter(&["pain", "lait"])` | `["1. pain", "2. lait"]` |

> [!info] Listes de tailles différentes
> `zip` s'arrête dès que la plus courte des deux listes est terminée.
