Écris la fonction `supprimerFin(start)` qui retire le **dernier maillon** de la liste et **rend sa mémoire** avec `free`.

```c
supprimerFin(&liste);
```

| Avant | Après |
|---|---|
| `1 -> 2 -> 3` | `1 -> 2` |
| `7` | vide (`NULL`) |
| vide | vide, sans planter |

Les tests vérifient aussi qu'aucun maillon retiré n'est oublié en mémoire.

> [!warning] Le maillon retiré doit être libéré
> `prev->next = NULL;` tout seul fait disparaître le dernier maillon de la liste... mais il reste réservé, et plus personne ne connaît son adresse.
