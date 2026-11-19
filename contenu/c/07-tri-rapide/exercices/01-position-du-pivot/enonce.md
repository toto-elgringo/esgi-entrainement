Avant d'écrire la partition, une question : **où** le pivot va-t-il finir ?

Écris `positionFinale(t, n, indicePivot)` qui renvoie l'indice où sera rangé le pivot `t[indicePivot]` après une partition du tableau (celle du cours, avec `<`). Le tableau n'est pas modifié.

```text
t = 4 9 1 6 8 2 7, indicePivot = 3 (valeur 6)
après partition : 4 1 2 | 6 | 8 9 7
réponse : 3
```

| `t` | `indicePivot` | Réponse |
|---|---|---|
| `4 9 1 6 8 2 7` | 3 (valeur 6) | 3 |
| `4 9 1 6 8 2 7` | 2 (valeur 1) | 0 |
| `4 9 1 6 8 2 7` | 1 (valeur 9) | 6 |
| `5 3 5 1` | 0 (valeur 5) | 2 |

> [!info] Pourquoi c'est important
> Ce nombre ne dépend pas de l'ordre des autres valeurs : c'est pour ça que le pivot est **déjà à sa place définitive** après la partition, et qu'il ne bougera plus.
