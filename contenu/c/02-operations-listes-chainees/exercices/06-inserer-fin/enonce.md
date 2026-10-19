Écris la fonction `insererFin(start, valeur)` qui ajoute un maillon de valeur `valeur` à la **fin** de la liste.

```c
Cell *liste = NULL;
insererFin(&liste, 1);
insererFin(&liste, 2);
insererFin(&liste, 3);
```

`liste` vaut alors `1 -> 2 -> 3`.

La fonction `creerCell` est fournie (elle met déjà `next` à `NULL`).

> [!info] Pourquoi `Cell **` ?
> Quand la liste est vide, le nouveau maillon devient le premier : la variable `liste` de l'appelant doit changer.
