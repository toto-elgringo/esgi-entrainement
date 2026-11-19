Écris la fonction `position(tab, n, valeur)` qui renvoie la position de la **première** case égale à `valeur` dans un tableau **non trié** de `n` entiers, ou `-1` si la valeur n'y est pas.

```c
int tab[] = {42, -4, 6, 3, 6};
position(tab, 5, 6);
position(tab, 5, 2);
```

renvoient `2` (le premier `6`) et `-1`.

Le tableau peut être vide : `position(NULL, 0, 5)` renvoie `-1` sans lire aucune case.

> [!info] Pourquoi -1 ?
> `0` est une vraie position (la première case). Pour dire « absent », il faut une valeur qui ne peut **pas** être une position.
