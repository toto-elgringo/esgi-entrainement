Écris la fonction `creerPoint(x, y)` qui **réserve** un nouveau `Point` en mémoire avec `malloc`, le remplit avec `x` et `y`, et renvoie son adresse.

```c
Point *a = creerPoint(3, 4);
printf("(%d, %d)\n", a->x, a->y);
free(a);
```

- Si `malloc` renvoie `NULL` (plus de mémoire), arrête le programme avec `exit(EXIT_FAILURE);`.
- Deux appels doivent donner deux points **différents** (deux adresses différentes).

> [!warning] Pourquoi pas une variable locale ?
> `Point p = {x, y}; return &p;` renverrait l'adresse d'une variable qui **disparaît** à la fin de la fonction. Le point doit vivre sur le tas, d'où `malloc`.
