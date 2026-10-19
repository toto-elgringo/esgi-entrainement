Écris la fonction `depuisTableau(valeurs, n)` qui construit une liste chaînée contenant les `n` valeurs du tableau, **dans le même ordre**, et renvoie son premier maillon.

```c
int t[] = {10, 20, 30};
Cell *l = depuisTableau(t, 3);
```

`l` doit valoir `10 -> 20 -> 30`. Si `n` vaut 0, la fonction renvoie `NULL`.

La fonction `insererDebut` est fournie : sers-t'en.

> [!tip] Complexité
> Chaque insertion en début coûte O(1) : la construction complète est en O(N). Insérer chaque valeur à la **fin** coûterait O(N) à chaque fois, donc O(N²) au total.
