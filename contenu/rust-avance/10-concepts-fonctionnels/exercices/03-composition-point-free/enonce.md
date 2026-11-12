Écris :

1. `composer(f, g)` : renvoie une fonction qui applique d'abord `f`, puis `g` au résultat.
2. `abs_puis_double()` : renvoie une fonction qui prend la valeur absolue d'un nombre puis la double. Écris-la en **point-free** : pas de `|x| ...`, tu passes directement `i32::abs` et `double` à `composer`.

| Appel | Résultat |
|---|---|
| `composer(\|x: i32\| x + 1, \|x\| x * 2)(5)` | `12` |
| `abs_puis_double()(-7)` | `14` |

> [!info] Point-free
> Écrire `composer(i32::abs, double)` plutôt que `composer(|x| x.abs(), |x| double(x))` : on ne nomme jamais l'argument.
