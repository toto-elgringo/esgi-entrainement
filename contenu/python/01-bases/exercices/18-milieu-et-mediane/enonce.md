Quatre fonctions sur une liste de nombres. **Aucune ne doit modifier la liste reçue.**

| Fonction | Renvoie | Exemple |
|---|---|---|
| `valeur_du_milieu(l)` | l'élément situé au milieu de la liste **telle qu'elle est** (pas triée), à l'indice `len(l) // 2` | `valeur_du_milieu([7, 1, 9, 4])` → `9` |
| `mediane(l)` | la médiane : on trie, puis on prend la valeur du milieu. S'il y a un nombre **pair** de valeurs, la moyenne des **deux** du milieu | `mediane([7, 1, 9])` → `7`, `mediane([7, 1, 9, 4])` → `5.5` |
| `etendue(l)` | l'écart entre la plus grande et la plus petite valeur | `etendue([12, 4, 9])` → `8` |
| `moyenne_sans_extremes(l)` | la moyenne une fois retirées **une** plus petite et **une** plus grande valeur (au moins 3 valeurs) | `moyenne_sans_extremes([10, 2, 14, 12])` → `11.0` |

> [!info] La médiane
> C'est la valeur qui coupe les données triées en deux moitiés : autant de valeurs en dessous qu'au-dessus. Contrairement à la moyenne, une valeur énorme ne la fait presque pas bouger.

Le code de départ contient une version de `valeur_du_milieu` et de `mediane` qui a l'air juste mais se trompe : lance les tests pour voir quand.
