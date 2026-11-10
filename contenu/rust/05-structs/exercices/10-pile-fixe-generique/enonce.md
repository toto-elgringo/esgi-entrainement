`PileFixe3` ne sait ranger que **3 octets**. Rends-la **générique** sur le type des éléments **et** sur leur nombre, comme dans le cours :

```rust
struct PileFixe<T, const N: usize> { ... }
```

| Méthode | Rôle |
|---|---|
| `PileFixe::depuis_tableau(cases: [T; N])` | une pile vide qui utilisera ce tableau (taille 0) |
| `empiler(&mut self, valeur: T) -> bool` | `false` si la pile est pleine |
| `depiler(&mut self) -> Option<&T>` | une **référence** vers l'élément retiré, `None` si vide |
| `taille(&self) -> usize` | le nombre d'éléments |
| `capacite(&self) -> usize` | le nombre de cases, c'est-à-dire `N` |

Elle doit marcher pour des `u8`, des `f64`, des `&str` et même des `String` :

```rust
let mut noms = PileFixe::depuis_tableau([String::new(), String::new()]);
let _ = noms.empiler("Ferris".to_string());
noms.depiler();     // Some(&"Ferris")
noms.capacite();    // 2
```

> [!info] Pourquoi `depuis_tableau` ?
> Pour remplir `[T; N]` tout seul, il faudrait savoir fabriquer un `T` « vide ». En recevant le tableau tout prêt, la pile marche pour n'importe quel type, sans condition.

> [!tip] Le trou
> `depiler` renvoie `&T` et non `T` : sortir la valeur laisserait un trou dans le tableau, et `[T; N]` ne sait pas représenter un trou.
