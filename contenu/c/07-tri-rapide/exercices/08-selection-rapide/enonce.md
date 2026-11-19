Écris `selectionRapide(t, n, k)` qui renvoie la valeur qui serait à l'indice `k` si le tableau était trié (on compte à partir de 0 : `k = 0` donne le minimum, `k = n / 2` la médiane quand `n` est impair). Le tableau peut être réorganisé.

```text
t = 4 9 1 6 8 2 7
trié : 1 2 4 6 7 8 9
selectionRapide(t, 7, 0) = 1    selectionRapide(t, 7, 3) = 6    selectionRapide(t, 7, 6) = 9
```

Ne trie pas tout le tableau : utilise la `partition` fournie (pivot = case du milieu de la portion) et ne continue **que du côté** où se trouve l'indice `k`. En moyenne, c'est O(n) au lieu de O(n log n).

`k` est toujours entre 0 et `n - 1`.
