Dans un tableau, une **inversion** est une paire de cases `i < j` rangées dans le mauvais ordre : `t[i] > t[j]`. Le nombre d'inversions mesure « à quel point » le tableau est en désordre (0 s'il est trié).

```text
{2, 4, 1, 3, 5} : (2, 1), (4, 1), (4, 3)    3 inversions
{3, 2, 1}       : (3, 2), (3, 1), (2, 1)    3 inversions
{2, 2, 2}       : aucune (2 n'est pas plus grand que 2)
```

Écris `compterInversions(t, n)` qui renvoie ce nombre, **sans modifier** `t`.

- Les tests utilisent un tableau de 200 000 cases : il y a alors près de 20 milliards de paires. Deux boucles imbriquées prendraient bien plus de 10 secondes. Ton calcul doit être en **O(n log n)**.
- Le résultat peut dépasser la capacité d'un `int` : il est en `long long`.
- Toute la mémoire réservée doit être libérée.

> [!tip] L'idée
> Trie une **copie** avec le tri fusion. Quand la fusion prend une valeur dans la moitié de droite, elle « double » toutes les valeurs encore en attente à gauche : ce sont autant d'inversions.
