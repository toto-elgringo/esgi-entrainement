Cette fois, la pile est une **liste chaînée** dont le premier maillon est le **sommet** :

```c
typedef struct cell {
    int value;
    struct cell *next;
} Cell;
```

Une pile vide est un pointeur `NULL`. Écris :

- `estVideListe(sommet)` : `1` si la pile est vide, `0` sinon ;
- `empilerListe(&sommet, valeur)` : ajoute un maillon au-dessus ;
- `depilerListe(&sommet)` : retire le maillon du dessus, **le libère** et renvoie sa valeur (on ne l'appelle jamais sur une pile vide) ;
- `viderPile(&sommet)` : dépile tout, libère tous les maillons, la pile redevient `NULL`.

```text
empiler 1, 2, 3 :   sommet --> [3|*] --> [2|*] --> [1|*] --> NULL
```

Le `main` doit afficher `3 2 1`. Les tests vérifient aussi qu'aucun maillon n'est oublié en mémoire.
