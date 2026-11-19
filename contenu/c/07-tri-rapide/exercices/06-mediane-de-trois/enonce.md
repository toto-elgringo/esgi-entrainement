Avec le pivot en première ou en dernière case, un tableau **déjà trié** fait tomber le tri rapide dans son pire cas : O(n²), et autant d'appels récursifs empilés que de cases. La **médiane de trois** évite ce piège à moindre coût.

Écris `medianeDeTrois(t, debut, fin)` : elle regarde les trois cases `debut`, `debut + (fin - debut) / 2` (le milieu) et `fin - 1` (la dernière) de la portion `[debut, fin)`, et renvoie l'**indice** de celle qui contient la valeur du milieu des trois (ni la plus petite, ni la plus grande).

| Portion | Valeurs regardées | Réponse |
|---|---|---|
| `t = 9 4 7 1 2`, `[0, 5)` | `t[0] = 9`, `t[2] = 7`, `t[4] = 2` | 2 (valeur 7) |
| `t = 3 8 1 5 6`, `[0, 5)` | `t[0] = 3`, `t[2] = 1`, `t[4] = 6` | 0 (valeur 3) |
| `t = 0 0 1 9 4 0`, `[2, 5)` | `t[2] = 1`, `t[3] = 9`, `t[4] = 4` | 4 (valeur 4) |

Si deux valeurs sont égales, n'importe laquelle des deux cases convient. La portion a toujours au moins une case.

Le tri rapide fourni utilise ta fonction pour choisir son pivot : les tests trient ensuite 200 000 valeurs déjà triées, puis triées à l'envers.
