Une fonction est une valeur comme une autre : on peut la passer en paramètre. Écris :

- `appliquer(l, func)` : renvoie la liste des `func(x)` pour chaque `x` de `l`. `appliquer(["4", "45"], int)` → `[4, 45]` ;
- `filtrer(l, condition)` : renvoie la liste des éléments `x` de `l` pour lesquels `condition(x)` est vrai ;
- `appliquer_n_fois(func, x, n)` : applique `n` fois la fonction à `x`. Avec `double(x)` qui renvoie `2 * x`, `appliquer_n_fois(double, 1, 3)` → `8`.

> [!warning] Sans parenthèses
> On passe `int`, pas `int()` : avec les parenthèses, on appellerait la fonction tout de suite.
