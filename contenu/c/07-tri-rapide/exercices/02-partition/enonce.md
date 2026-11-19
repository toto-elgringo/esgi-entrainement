Écris `partition(t, n, indicePivot)` : elle range **en place** les `n` cases de `t` autour du pivot `t[indicePivot]` et renvoie la **nouvelle position** du pivot.

Après l'appel, si la fonction renvoie `p` :

- `t[p]` est le pivot ;
- toutes les cases avant `p` sont **plus petites** que le pivot ;
- toutes les cases après `p` sont **plus grandes ou égales**.

```text
t = 4 9 1 6 8 2 7, indicePivot = 3 (valeur 6)
après : 4 1 2 6 8 9 7, la fonction renvoie 3
```

La fonction `echanger(t, i, j)` est fournie. N'utilise pas de deuxième tableau : la partition se fait en un seul parcours, en O(n).
