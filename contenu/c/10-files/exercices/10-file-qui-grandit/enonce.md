Comme la pile du chapitre précédent, une file dans un tableau a une capacité fixe. Ici, quand la file est pleine, `enfiler` **double la capacité** au lieu de refuser la valeur.

`creerFile(capacite)` (déjà écrite) réserve la structure et son tableau avec `malloc`, `defiler` est déjà écrite. Écris :

- `enfiler(q, valeur)` : si la file est pleine, agrandit d'abord le tableau pour **doubler** `capacity`, **sans changer l'ordre de la file**, puis ajoute la valeur à la fin ;
- `libererFile(q)` : rend toute la mémoire de la file.

Si une réservation de mémoire échoue, arrête le programme avec `exit(EXIT_FAILURE)`.

> [!warning] Le piège de la file qui a fait le tour
> Avec une file de capacité 4 qui a tourné, `start = 2` :
>
> ```text
> tab : [C][D][A][B]     la file est A B C D
> ```
>
> Agrandir le tableau en gardant les cases à leur place donne `[C][D][A][B][ ][ ][ ][ ]` : avec `start = 2` et `size = 4`, la file lirait `A B ? ?`. Il faut **remettre la file dans l'ordre** dans le nouveau tableau :
>
> ```text
> tab : [A][B][C][D][ ][ ][ ][ ]   start = 0, size = 4, capacity = 8
> ```

Les tests mélangent enfilements et défilements pour que la file fasse le tour avant chaque agrandissement, puis vérifient que les valeurs sortent dans l'ordre et que toute la mémoire est rendue.
