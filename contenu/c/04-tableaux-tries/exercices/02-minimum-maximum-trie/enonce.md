Le tableau `tab` de `n` entiers (avec `n > 0`) est **trié dans l'ordre croissant**. Écris :

- `minimum_trie(tab, n)`, qui renvoie sa plus petite valeur ;
- `maximum_trie(tab, n)`, qui renvoie sa plus grande valeur.

```c
int tab[] = {-6, -2, 2, 3, 5};
minimum_trie(tab, 5);
maximum_trie(tab, 5);
```

renvoient `-6` et `5`.

Les deux fonctions doivent être en **O(1)** : leur temps ne doit pas dépendre de `n`. Un des tests les appelle 200 000 fois sur un tableau de 200 000 cases : une boucle sur le tableau dépasse le temps permis.

> [!info] Profiter du tri
> Sur un tableau quelconque, le même problème coûte O(n). Ici, le rangement des valeurs donne la réponse sans rien parcourir.
