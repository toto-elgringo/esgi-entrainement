Écris la fonction `avantDernier(start)` qui renvoie l'adresse de l'**avant-dernier** maillon de la liste, ou `NULL` si la liste a moins de deux maillons.

| Liste | Résultat |
|---|---|
| `3 -> 8 -> 5 -> 1` | le maillon de valeur 5 |
| `4 -> 9` | le maillon de valeur 4 |
| `7` | `NULL` |
| vide | `NULL` |

C'est le maillon dont on a besoin pour **supprimer le dernier** (il faut mettre son `next` à `NULL`).

> [!warning] Lire `->` sur `NULL`
> `start->next->next` plante si `start` ou `start->next` vaut `NULL`. Écarte ces deux cas **avant** la boucle.
