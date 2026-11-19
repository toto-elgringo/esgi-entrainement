Une pile d'entiers est rangée dans un tableau :

```c
typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;
```

- `tab` : le tableau des valeurs, le fond de la pile en `tab[0]` ;
- `size` : le nombre de valeurs dans la pile ;
- `capacity` : le nombre de cases du tableau.

Écris les deux fonctions :

- `estVide(s)` renvoie `1` si la pile ne contient aucune valeur, `0` sinon ;
- `estPleine(s)` renvoie `1` s'il n'y a plus de place, `0` sinon.

| `size` | `capacity` | `estVide` | `estPleine` |
|---|---|---|---|
| 0 | 3 | 1 | 0 |
| 2 | 3 | 0 | 0 |
| 3 | 3 | 0 | 1 |

> [!tip] Par prudence
> Si `size` a dépassé `capacity` à cause d'un bug ailleurs, la pile doit aussi être considérée comme pleine.
