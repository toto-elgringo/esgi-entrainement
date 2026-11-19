Écris `tri_insertion(tab, n)` qui trie le tableau dans l'ordre croissant avec le **tri par insertion** : la partie gauche est triée, on y insère la valeur suivante à sa place.

```text
5 | 2 9 1      on insère 2 : 5 se décale  ->  2 5 | 9 1
2 5 | 9 1      on insère 9 : rien à faire  ->  2 5 9 | 1
2 5 9 | 1      on insère 1 : 9, 5, 2 se décalent  ->  1 2 5 9
```

Cette fois, **pas d'échanges** : on met la valeur à insérer de côté, on **décale** d'une case vers la droite les valeurs plus grandes, puis on écrit la valeur dans le trou.

La place se cherche **en partant de la droite** de la partie triée. Chercher depuis la case 0 donne aussi un tableau trié, mais on parcourt alors toute la partie triée à chaque insertion, même quand la valeur est déjà au bon endroit.

Compare avec la fonction fournie `plus_grand(a, b)`, qui compte les comparaisons. Les tests vérifient qu'un tableau **déjà trié** de 1 000 cases ne demande que **999 comparaisons** : une seule par valeur insérée.

> [!tip] Presque trié = rapide
> C'est ce qui rend le tri par insertion intéressant : sur un tableau où chaque valeur est près de sa place, la boucle de décalage s'arrête presque tout de suite.
