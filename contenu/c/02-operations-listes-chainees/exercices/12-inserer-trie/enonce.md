La liste est **triée par ordre croissant**. Écris la fonction `insererTrie(start, valeur)` qui ajoute un maillon de valeur `valeur` **à sa place**, pour que la liste reste triée.

```c
Cell *liste = NULL;
insererTrie(&liste, 5);
insererTrie(&liste, 2);
insererTrie(&liste, 9);
insererTrie(&liste, 7);
```

`liste` vaut alors `2 -> 5 -> 7 -> 9`. Les doublons sont autorisés.

Trois situations : la nouvelle valeur va **au début** (le début de la liste change), **au milieu**, ou **à la fin**.

> [!tip] Bonus
> En insérant les valeurs d'un tableau une par une avec `insererTrie`, on obtient un tri (le **tri par insertion**), en O(N²).
