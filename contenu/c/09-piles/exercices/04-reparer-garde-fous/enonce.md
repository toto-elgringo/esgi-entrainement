Cette pile dans un tableau (`tab`, `size`, `capacity`) renvoie un **code de réussite** :

- `empiler(s, valeur)` renvoie `1` si la valeur a été posée, `0` si la pile était **pleine** ;
- `depiler(s, &v)` range la valeur du dessus dans `v` et renvoie `1`, ou renvoie `0` si la pile était **vide**.

Le code fourni ressemble beaucoup à celui qu'on écrit au premier essai : il marche dans les cas normaux, mais il ne vérifie **jamais** rien et renvoie toujours `1`.

| Appel | Ce qui doit se passer | Ce que fait le code fourni |
|---|---|---|
| `empiler` sur une pile pleine | renvoie 0, la pile ne change pas | écrit **après la fin** du tableau |
| `depiler` sur une pile vide | renvoie 0, `size` et `v` ne changent pas | `size` passe à -1, lit `tab[-1]` |

Corrige les deux fonctions. Quand l'opération est impossible, **rien** ne doit être modifié.

> [!info] Pourquoi c'est grave
> En C, écrire après la fin d'un tableau ne provoque aucune erreur sur le moment : on abîme une autre variable, et le programme se trompe (ou plante) beaucoup plus loin, là où on ne cherche pas.
