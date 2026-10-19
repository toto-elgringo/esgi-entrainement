Écris quatre fonctions :

- `min_max(nombres)` : renvoie le tuple `(plus_petit, plus_grand)` d'une liste non vide, **sans** utiliser `min` ni `max`. `min_max([4, 1, 7])` → `(1, 7)` ;
- `echanger(couple)` : renvoie le couple inversé. `echanger((1, "a"))` → `("a", 1)` ;
- `tete_et_reste(sequence)` : renvoie un tuple `(premier, reste)` où `reste` est la **liste** des éléments suivants. `tete_et_reste((1, 2, 3))` → `(1, [2, 3])` ;
- `distance(p1, p2)` : renvoie la distance entre deux points donnés comme tuples `(x, y)`. `distance((0, 0), (3, 4))` → `5.0`.

Utilise l'**unpacking** (`a, b = couple`, `premier, *reste = ...`).
