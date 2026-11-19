`a` et `b` sont deux listes **triées par ordre croissant**. Écris la fonction `fusionner(a, b)` qui renvoie **une seule liste triée** contenant tous leurs maillons.

```c
Cell *r = fusionner(a, b);
```

| `a` | `b` | `r` |
|---|---|---|
| `1 -> 4 -> 6` | `2 -> 3 -> 8` | `1 -> 2 -> 3 -> 4 -> 6 -> 8` |
| vide | `5 -> 7` | `5 -> 7` |
| `2 -> 2` | `2` | `2 -> 2 -> 2` |

**Interdit de créer des maillons** : on réutilise ceux de `a` et de `b` en changeant leurs `next`. Les tests vérifient que chaque maillon du résultat est l'un des maillons de départ, et que libérer le résultat suffit à tout rendre.

> [!info] Complexité attendue
> O(N + M) : chaque maillon est accroché une seule fois. Mettre toutes les valeurs dans une liste puis la trier serait bien plus lent.
