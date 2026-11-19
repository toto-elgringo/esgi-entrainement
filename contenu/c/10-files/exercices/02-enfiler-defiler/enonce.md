Avec la même file dans un tableau circulaire (`tab`, `start`, `size`, `capacity`), écris :

- `enfiler(q, valeur)` : ajoute `valeur` à la **fin** de la file ;
- `defiler(q)` : retire la valeur de la **tête** et la renvoie ;
- `tete(q)` : renvoie la valeur de la tête **sans** la retirer.

On n'appelle jamais `enfiler` sur une file pleine, ni `defiler` ou `tete` sur une file vide.

```text
capacity = 3, au départ start = 0, size = 0

enfiler 1, 2, 3   [1][2][3]   start = 0, size = 3
defiler -> 1      [1][2][3]   start = 1, size = 2
enfiler 4         [4][2][3]   start = 1, size = 3   (la fin a fait le tour)
defiler -> 2      [4][2][3]   start = 2, size = 2
```

Les tests enfilent et défilent bien plus de valeurs que le tableau n'a de cases : la file doit **tourner** sans jamais sortir du tableau.
