Écris `fusionner(a, na, b, nb)` qui reçoit deux tableaux **triés** dans l'ordre croissant et renvoie un **nouveau** tableau, alloué avec `malloc`, qui contient leurs `na + nb` valeurs dans l'ordre croissant. C'est l'appelant qui le libère avec `free`.

```c
int a[] = {1, 4, 9};
int b[] = {2, 3, 10, 11};
int *res = fusionner(a, 3, b, 4);
```

`res` contient `1 2 3 4 9 10 11`.

- Les doublons sont gardés : `{2, 5}` et `{2}` donnent `2 2 5`.
- Un des tableaux (ou les deux) peut être vide. Si `na + nb` vaut 0, renvoie `NULL` sans rien allouer.
- Si `malloc` échoue, renvoie `NULL`.
- Un **seul passage** : O(na + nb). Recopier les deux tableaux bout à bout puis trier le tout coûterait plus cher. Un test fusionne deux tableaux de 300 000 cases.

> [!tip] `<=` plutôt que `<`
> En cas d'égalité, prends la valeur de `a`. Avec des entiers on ne voit pas la différence, mais avec des fiches (une note et un nom), c'est ce qui garde l'ordre d'origine des fiches de même note : la fusion est alors **stable**.
