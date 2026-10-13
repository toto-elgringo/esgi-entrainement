Trois fonctions qui **modifient** une liste au lieu d'en créer une nouvelle :

1. `doubler(v)` multiplie chaque élément par 2. Le code est écrit mais **ne compile pas** : corrige-le.
2. `plafonner(v, max)` remplace chaque élément plus grand que `max` par `max`.
3. `ajouter_fin(v, valeurs)` ajoute toutes les `valeurs` à la fin de `v`, dans l'ordre.

```rust
let mut v = vec![5, 12, 8, 20];
plafonner(&mut v, 10);
// v vaut maintenant [5, 10, 8, 10]
```

> [!tip] Rappel
> `&mut [i32]` permet de modifier les éléments, mais pas d'en ajouter. Pour ajouter (`push`), il faut `&mut Vec<i32>`.
