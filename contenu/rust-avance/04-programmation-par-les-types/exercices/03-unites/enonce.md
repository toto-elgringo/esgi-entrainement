Deux `f64` ne disent pas s'ils sont en mètres ou en kilomètres. Avec deux newtypes, le compilateur interdit de les mélanger.

Complète :

1. `From<Kilometres> for Metres` (multiplie par 1000) et `From<Metres> for Kilometres` (divise par 1000).
2. `Add` pour `Metres` : additionner deux distances en mètres donne des mètres.
3. `Display` : `Metres(12.5)` s'affiche `12.5 m` et `Kilometres(2.5)` s'affiche `2.5 km`.
4. `distance_totale(&[Metres])` renvoie la somme des étapes (`Metres(0.0)` si la liste est vide).

| Appel | Résultat |
|---|---|
| `Metres::from(Kilometres(1.5))` | `Metres(1500.0)` |
| `Kilometres::from(Metres(2500.0))` | `Kilometres(2.5)` |
| `format!("{}", Metres(12.5))` | `"12.5 m"` |
