Avec la même pile dans un tableau que l'exercice précédent :

```c
typedef struct {
    int *tab;
    int size;
    int capacity;
} Stack;
```

écris les trois opérations de base :

- `empiler(s, valeur)` pose `valeur` au-dessus de la pile ;
- `depiler(s)` retire la valeur du dessus et la renvoie ;
- `sommet(s)` renvoie la valeur du dessus **sans** la retirer.

Ici, on suppose que l'appelant respecte les règles : il n'empile jamais dans une pile pleine, il ne dépile jamais (et ne lit jamais le sommet d') une pile vide. Les vérifications viendront dans un exercice suivant.

Le `main` empile 4, 7 et 1, puis dépile tout. Il doit afficher :

```text
sommet : 1
je dépile 1
je dépile 7
je dépile 4
```
