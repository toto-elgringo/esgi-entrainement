Écris deux fonctions **récursives** (qui s'appellent elles-mêmes), **sans boucle** :

- `sommeRec(c)` renvoie la somme des valeurs de la liste qui commence au maillon `c` ;
- `tailleRec(c)` renvoie son nombre de maillons.

L'idée : une liste non vide, c'est **un premier maillon** suivi d'une **liste plus courte** (`c->next`). La fonction traite le premier maillon et se rappelle sur le reste.

```text
sommeRec(0 -> 1 -> 2) = 0 + sommeRec(1 -> 2)
                      = 0 + 1 + sommeRec(2)
                      = 0 + 1 + 2 + sommeRec(NULL)
                      = 0 + 1 + 2 + 0
```

> [!warning] Le cas d'arrêt
> Sans le test `c == NULL` au début, la fonction finit par lire `c->value` sur `NULL` : erreur de segmentation.
