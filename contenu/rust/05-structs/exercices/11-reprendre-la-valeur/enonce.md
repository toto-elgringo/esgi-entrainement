La pile générique du cours renvoie une **référence** (`Option<&T>`) quand on dépile : sortir la valeur laisserait un trou dans `[T; N]`, et ce type ne sait pas représenter un trou.

Ici, on veut vraiment **récupérer** la valeur (`Option<T>`), même pour des `String`. La solution du cours : rendre le trou **représentable** en rangeant des `Option<T>` dans les cases.

```rust
struct PileFixe<T, const N: usize> {
    cases: [Option<T>; N],
    taille: usize,
}
```

| Méthode | Rôle |
|---|---|
| `PileFixe::new()` | une pile vide : toutes les cases à `None` |
| `empiler(&mut self, valeur: T) -> bool` | `false` si la pile est pleine |
| `depiler(&mut self) -> Option<T>` | **retire et rend** la valeur du haut (pas une référence), `None` si vide |
| `sommet(&self) -> Option<&T>` | regarde la valeur du haut sans la retirer |
| `taille(&self) -> usize` | le nombre d'éléments |

```rust
let mut pile: PileFixe<String, 2> = PileFixe::new();
let _ = pile.empiler("crabe".to_string());
let mot: Option<String> = pile.depiler();   // Some("crabe"), elle est à nous maintenant
```

> [!tip] `take`
> `case.take()` renvoie ce que contient l'`Option` et y laisse `None` : la valeur sort, et la case devient « vide » de façon visible dans le type.

> [!warning] Pas de `[None; N]`
> `[None; N]` demande que `Option<T>` soit `Copy`, ce qui est faux pour une `String`. Utilise `std::array::from_fn(|_| None)`.
