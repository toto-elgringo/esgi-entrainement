Écris `regrouper_par_initiale(mots)` qui range les mots dans une `HashMap` : la clé est la **première lettre** (`char`), la valeur est la **liste des mots** qui commencent par cette lettre, dans leur ordre d'arrivée.

Les mots vides sont ignorés.

```rust
let groupes = regrouper_par_initiale(&["pomme", "poire", "banane", "cerise", "prune"]);
// 'p' → ["pomme", "poire", "prune"]
// 'b' → ["banane"]
// 'c' → ["cerise"]
```

> [!tip] Une `HashMap` dont les valeurs sont des listes
> C'est très courant. `entry(cle).or_default()` crée une liste vide la première fois, puis renvoie toujours la même liste.
