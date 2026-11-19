La fonction `inserer(tab, n, position, valeur)` insère `valeur` à la case `position` d'un tableau de `n` valeurs (on suppose qu'il reste au moins une case libre après la fin). La fonction `ajouter_devant` s'en sert pour ajouter une valeur au début.

Les insertions au milieu et à la fin marchent, mais **l'ajout devant** est faux : lance le programme et compare avec ce qui est attendu.

```text
attendu : 1 2 3 4
obtenu  : 1 3 4 0
```

Trouve le bug et corrige-le, sans changer les types.

> [!tip] Méthode
> Remplace `position` par 0 dans la condition de la boucle et calcule-la à la main, en te rappelant que `size_t` ne peut pas être négatif.
