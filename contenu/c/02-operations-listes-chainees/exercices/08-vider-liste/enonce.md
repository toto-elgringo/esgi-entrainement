Écris la fonction `viderListe(start)` qui :

1. libère **tous** les maillons de la liste avec `free` ;
2. remet la variable de l'appelant à `NULL` (la liste est alors vide et propre) ;
3. renvoie le nombre de maillons libérés.

```c
int n = viderListe(&liste);
```

Si `liste` valait `1 -> 2 -> 3`, alors `n` vaut 3 et `liste` vaut `NULL`.

Les tests vérifient aussi qu'il ne reste **aucun** maillon réservé à la fin (pas de fuite mémoire).

> [!warning] Le piège classique
> ```c
> free(cur);
> cur = cur->next;
> ```
> lit dans un maillon **déjà libéré**. Ça peut sembler marcher sur ton ordinateur, et planter ailleurs.
