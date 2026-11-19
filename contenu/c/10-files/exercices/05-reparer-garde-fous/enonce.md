Cette file dans un tableau circulaire renvoie un **code de réussite** :

- `enfiler(q, valeur)` renvoie `1` si la valeur a été ajoutée, `0` si la file était **pleine** ;
- `defiler(q, &v)` range la tête dans `v`, la retire et renvoie `1`, ou renvoie `0` si la file était **vide** ;
- `lireTete(q, &v)` range la tête dans `v` sans la retirer et renvoie `1`, ou renvoie `0` si la file était **vide**.

Le code fourni ne vérifie **jamais** rien et renvoie toujours `1`. Avec le modulo, il ne sort pas du tableau... mais il fait pire :

| Appel | Ce qui doit se passer | Ce que fait le code fourni |
|---|---|---|
| `enfiler` sur une file pleine | renvoie 0, la file ne change pas | la fin tombe **sur la tête** : la valeur la plus ancienne est écrasée |
| `defiler` sur une file vide | renvoie 0, rien ne change | `size` passe à -1, `start` avance quand même |
| `lireTete` sur une file vide | renvoie 0, `v` ne change pas | range une vieille valeur sans aucun sens |

Corrige les trois fonctions. Quand l'opération est impossible, **rien** ne doit être modifié.

```text
capacity = 3 : enfiler 1, 2, 3, puis enfiler 4

attendu :         [1][2][3]   start = 0, size = 3   enfiler renvoie 0
code fourni :     [4][2][3]   start = 0, size = 4   la tête 1 a disparu
```
