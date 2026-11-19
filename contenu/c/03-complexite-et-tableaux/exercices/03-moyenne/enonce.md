Écris la fonction `moyenne(tab, n)` qui renvoie la moyenne des `n` valeurs du tableau, sous forme de `double`.

| Tableau | Résultat |
|---|---|
| vide (`n == 0`) | 0.0 |
| `1 2` | 1.5 |
| `-3 3 6` | 2.0 |
| `2000000000 2000000000` | 2000000000.0 |

> [!warning] Deux pièges
> - `3 / 2` vaut `1` en C quand les deux nombres sont des entiers.
> - Un `int` ne dépasse pas environ 2,1 milliards : la somme du dernier exemple ne tient pas dans un `int`.
