Le code **ne compile pas** : la struct `Point` ne sait pas encore

- s'afficher avec `{:?}` ;
- se copier avec `.clone()` ;
- se comparer avec `==`.

Ajoute **une seule ligne** au-dessus de la struct pour lui donner ces trois capacités. Ne touche pas au reste du code.

> [!tip] derive
> `#[derive(...)]` demande au compilateur d'écrire tout seul le code de ces capacités (appelées **traits**).
