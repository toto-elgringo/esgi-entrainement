La structure `Point` ne sait rien faire : ni se copier, ni s'afficher, ni se comparer. Le code **ne compile pas**.

Ajoute la bonne ligne `#[derive(...)]` au-dessus de `struct Point` pour que :

- `p.clone()` fonctionne ;
- `println!("{:?}", p)` affiche `Point { x: 1, y: 2 }` ;
- `a == b` compare deux points ;
- `Point::default()` crée le point `(0, 0)`.

> [!tip] Lis les erreurs
> Chaque message d'erreur nomme le trait qui manque, et le `help:` propose souvent le `#[derive(...)]` à ajouter.
