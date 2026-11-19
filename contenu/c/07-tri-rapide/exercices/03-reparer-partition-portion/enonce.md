Sur Schooding, `tab.subArray(debut, fin)` donne un tableau qui **recommence à l'indice 0** : on peut écrire la partition avec `position = 0`. En C, on garde le **même** tableau et on travaille sur la portion `[debut, fin)` (de `debut` compris à `fin` non compris).

La fonction `partition(t, debut, fin, indicePivot)` ci-dessous a été recopiée de la version Schooding. Elle doit :

- ranger la portion `[debut, fin)` autour du pivot `t[indicePivot]` (`indicePivot` est dans la portion) ;
- renvoyer la nouvelle position du pivot (entre `debut` et `fin - 1`) ;
- ne **jamais** toucher aux cases hors de la portion.

Elle marche sur le tableau entier, mais pas sur une portion :

```text
t = 100 200 | 4 9 1 6 8 2 7 | 300      portion [2, 9), pivot t[5] = 6
attendu : 100 200 | 4 1 2 6 8 9 7 | 300   renvoie 5
```

Trouve les erreurs et corrige-les.
