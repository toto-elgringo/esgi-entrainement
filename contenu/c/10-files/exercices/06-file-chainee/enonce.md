Cette fois, la file est une **liste chaînée** qui garde un pointeur vers son premier **et** son dernier maillon :

```c
typedef struct cell {
    int value;
    struct cell *next;
} Cell;

typedef struct {
    Cell *premier;
    Cell *dernier;
    int taille;
} File;
```

Une file vide vaut `{NULL, NULL, 0}`. Écris :

- `estVideFile(f)` : `1` si la file est vide, `0` sinon ;
- `enfilerListe(f, valeur)` : ajoute un maillon **à la fin**, en O(1) ;
- `defilerListe(f)` : retire le **premier** maillon, **le libère** et renvoie sa valeur (on ne l'appelle jamais sur une file vide) ;
- `viderFile(f)` : retire et libère tous les maillons, la file redevient `{NULL, NULL, 0}`.

```text
enfiler 1, 2, 3 :

premier               dernier
   |                     |
   v                     v
 [1|*] --> [2|*] --> [3|/]
```

Le `main` doit afficher `1 2 3 4`. Les tests vérifient aussi `dernier` et `taille` après chaque opération, et qu'aucun maillon n'est oublié en mémoire.
