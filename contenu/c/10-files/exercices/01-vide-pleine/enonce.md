Une file d'entiers est rangée dans un **tableau circulaire** :

```c
typedef struct {
    int *tab;
    int start;
    int size;
    int capacity;
} Queue;
```

- `tab` : le tableau des valeurs ;
- `start` : l'indice de la tête (la valeur la plus ancienne) ;
- `size` : le nombre de valeurs dans la file ;
- `capacity` : le nombre de cases du tableau.

Écris les deux fonctions :

- `estVide(q)` renvoie `1` si la file ne contient aucune valeur, `0` sinon ;
- `estPleine(q)` renvoie `1` s'il n'y a plus de place, `0` sinon.

| `start` | `size` | `capacity` | `estVide` | `estPleine` |
|---|---|---|---|---|
| 0 | 0 | 4 | 1 | 0 |
| 3 | 0 | 4 | 1 | 0 |
| 2 | 3 | 4 | 0 | 0 |
| 3 | 4 | 4 | 0 | 1 |

> [!tip] Par prudence
> Si `size` a dépassé `capacity` à cause d'un bug ailleurs, la file doit aussi être considérée comme pleine : sinon, on continuerait à enfiler par-dessus les valeurs.
