Deux tableaux de même taille `n` sont **égaux** s'ils contiennent les mêmes valeurs, **le même nombre de fois**, dans n'importe quel ordre :

- `{1, 1, 2, 3, 4}` et `{3, 2, 1, 4, 1}` sont égaux ;
- `{1, 2, 2, 3}` et `{1, 2, 3, 3}` ne le sont pas (deux 2 d'un côté, un seul de l'autre).

Écris `egaux(a, b, n)`, qui renvoie `1` ou `0`. Trois contraintes :

1. **Ne pas modifier** `a` ni `b` : les tests vérifient qu'ils sont intacts après l'appel (c'est le sens du `const`).
2. **O(n log n)** : un test compare deux tableaux de 100 000 cases. Chercher chaque valeur de `a` dans tout `b` (O(n²)) dépasse le temps permis.
3. **Aucune fuite** : toute la mémoire allouée doit être rendue.

> [!info] `qsort`, le tri de la bibliothèque standard
> `qsort(tab, n, sizeof(int), comparer)` trie `tab` en O(n log n) en moyenne (`#include <stdlib.h>`). `comparer` reçoit les adresses de deux cases et renvoie un nombre négatif, nul ou positif selon que la première est plus petite, égale ou plus grande que la seconde.

> [!warning] Comparer les sommes ne suffit pas
> `{1, 4}` et `{2, 3}` ont la même somme sans être égaux.
