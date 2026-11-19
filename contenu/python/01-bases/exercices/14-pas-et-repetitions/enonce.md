Écris ces fonctions **sans boucle**, avec des tranches, `+` et `*`. Chacune renvoie une **nouvelle** liste :

| Fonction | Renvoie | Exemple |
|---|---|---|
| `un_sur_trois(l)` | les éléments d'indice 0, 3, 6... | `un_sur_trois([5, 6, 7, 8, 9])` → `[5, 8]` |
| `impairs_a_l_envers(l)` | les éléments d'indice impair, du dernier au premier | `[0, 1, 2, 3, 4, 5]` → `[5, 3, 1]` |
| `miroir(l)` | la liste suivie de son reflet | `miroir([1, 2, 3])` → `[1, 2, 3, 3, 2, 1]` |
| `motif(l, n, k)` | les `n` premiers éléments, répétés `k` fois | `motif([1, 2, 3], 2, 3)` → `[1, 2, 1, 2, 1, 2]` |
| `sauf_bouts(l)` | la liste sans son premier ni son dernier élément | `sauf_bouts([1, 2, 3, 4])` → `[2, 3]` |
| `zeros(n)` | une liste de `n` zéros | `zeros(3)` → `[0, 0, 0]` |

La liste reçue ne doit pas être modifiée.
