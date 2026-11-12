Implémente le trait `Iterator` (et son type associé `Item`) pour deux structures. Tu n'écris que `next` : `take`, `sum`, `collect`... marchent ensuite tout seuls.

1. `Decompte` : `Decompte::new(3)` produit `3`, `2`, `1` puis s'arrête.
2. `Fibonacci` : `Fibonacci::new()` produit `0, 1, 1, 2, 3, 5, 8, 13...` sans jamais s'arrêter.

| Appel | Résultat |
|---|---|
| `Decompte::new(3).collect::<Vec<_>>()` | `[3, 2, 1]` |
| `Decompte::new(0).count()` | `0` |
| `Fibonacci::new().take(8).collect::<Vec<_>>()` | `[0, 1, 1, 2, 3, 5, 8, 13]` |

> [!tip] Rappel
> `next` renvoie `Some(valeur)` tant qu'il y a quelque chose, puis `None`.
