Écris la fonction `carres(n)` qui crée un tableau de `n` entiers **sur le tas** et le remplit avec les carrés `0, 1, 4, 9, ...` : la case `i` contient `i * i`. Elle renvoie l'adresse du tableau.

```c
int *t = carres(5);
```

`t` contient alors `0 1 4 9 16`. C'est à l'appelant de faire `free(t)` quand il a fini.

- `n` vaut au moins 1.
- Si `malloc` renvoie `NULL`, arrête le programme avec `exit(EXIT_FAILURE);`.
