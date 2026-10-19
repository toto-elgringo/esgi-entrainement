Écris la fonction `insererApres(maillon, valeur)` qui insère un nouveau maillon de valeur `valeur` **juste après** `maillon` (qui n'est jamais `NULL`).

Dans la liste `1 -> 2`, `insererApres(start, 4)` donne `1 -> 4 -> 2`.

```text
avant :   [1|*] --> [2|*] --> NULL
après :   [1|*] --> [4|*] --> [2|*] --> NULL
```

Ça marche aussi après le dernier maillon : le nouveau devient alors le dernier.

> [!info] Pourquoi un simple `Cell *` ?
> On n'insère jamais **avant** le premier maillon : le début de la liste ne change pas.
