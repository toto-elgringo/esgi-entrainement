Un point du plan est représenté par la structure :

```c
typedef struct {
    int x;
    int y;
} Point;
```

Écris la fonction `deplacer(p, dx, dy)` qui déplace le point pointé par `p` de `dx` horizontalement et de `dy` verticalement.

```c
Point a = {3, 4};
deplacer(&a, 1, -2);
```

Après l'appel, `a` vaut `(4, 2)`.

> [!tip] Le point ou la flèche
> `a.x` sur une structure, `p->x` sur un **pointeur** vers une structure.
