Une pile dans un tableau a un défaut : sa capacité est fixe. Ici, quand la pile est pleine, `empiler` **double la capacité** au lieu de refuser la valeur.

`creerPile(capacite)` (déjà écrite) réserve la structure et son tableau avec `malloc`. Écris :

- `empiler(s, valeur)` : si la pile est pleine, agrandit d'abord le tableau avec `realloc` pour **doubler** `capacity`, puis pose la valeur ;
- `libererPile(s)` : rend toute la mémoire de la pile.

`depiler` est déjà écrite. Si `realloc` échoue (renvoie `NULL`), arrête le programme avec `exit(EXIT_FAILURE)`.

```text
creerPile(1)   capacity 1
empiler 1      capacity 1  (rempli)
empiler 2      capacity 2  (doublé)
empiler 3      capacity 4  (doublé)
empiler 4      capacity 4
empiler 5      capacity 8  (doublé)
```

Les tests empilent 100 valeurs dans une pile créée avec une capacité de 1, puis vérifient que toute la mémoire est rendue.

> [!info] Pourquoi doubler ?
> Agrandir d'une seule case à chaque fois recopierait tout le tableau à chaque empilement : O(N) par empilement. En doublant, les recopies deviennent de plus en plus rares, et l'empilement coûte **O(1) amorti**.
