On veut ranger des formes **différentes** dans une même liste : `Vec<Box<dyn Forme>>`.

1. Complète `aire` pour `Rectangle` et `Cercle`.
2. Crée une nouvelle structure `Carre` (champ `cote: f64`) qui implémente `Forme`. Son nom est `"carré"`.
3. `aire_totale(formes)` : la somme des aires.
4. `nom_de_la_plus_grande(formes)` : le nom de la forme qui a la plus grande aire, ou `None` si la liste est vide.

```rust
let formes: Vec<Box<dyn Forme>> = vec![
    Box::new(Rectangle { largeur: 2.0, hauteur: 1.0 }),   // aire 2
    Box::new(Cercle { rayon: 1.0 }),                      // aire 3,14...
    Box::new(Carre { cote: 1.5 }),                        // aire 2,25
];
nom_de_la_plus_grande(&formes);   // Some("cercle")
```

> [!warning] Comparer des `f64`
> Les nombres à virgule n'ont pas d'ordre total (à cause de `NaN`, « pas un nombre ») : `max()` ne marche pas directement. `a.total_cmp(&b)` les compare quand même.
