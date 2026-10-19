Écris la fonction `insererDebut(start, valeur)` qui ajoute un maillon de valeur `valeur` **devant** la liste. Cette fois, elle ne renvoie rien : elle reçoit **l'adresse** de la variable qui contient le début de la liste, et la modifie directement.

```c
Cell *liste = NULL;
insererDebut(&liste, 2);
insererDebut(&liste, 1);
```

Après ces appels, `liste` vaut `1 -> 2`.

| Écriture | Sens dans la fonction |
|---|---|
| `start` | l'adresse de la variable `liste` (type `Cell **`) |
| `*start` | la variable `liste` elle-même (type `Cell *`) |

> [!warning] Pourquoi pas `Cell *start` ?
> Avec `Cell *start`, la fonction travaillerait sur une **copie** de `liste` : changer la copie ne change pas `liste`.
