Le cours range « un tableau + un compteur » dans une struct pour obtenir une **pile sans tas** de 3 octets. Complète `PileFixe3` :

| Méthode | Rôle |
|---|---|
| `PileFixe3::new()` | une pile vide (cases à 0, taille 0) |
| `empiler(&mut self, valeur) -> bool` | pose `valeur` en haut et renvoie `true`, ou renvoie `false` sans rien changer si la pile est pleine |
| `depiler(&mut self) -> Option<u8>` | retire et renvoie l'élément du haut, `None` si la pile est vide |
| `taille(&self) -> usize` | le nombre d'éléments |
| `est_vide(&self) -> bool` | `true` si la pile est vide |
| `sommet(&self) -> Option<&u8>` | **regarde** l'élément du haut sans le retirer |

```rust
let mut pile = PileFixe3::new();
let _ = pile.empiler(1);
let _ = pile.empiler(2);
pile.sommet();    // Some(&2)
pile.depiler();   // Some(2)
pile.taille();    // 1
```

> [!tip] Choisir le bon `self`
> `&self` pour ce qui lit (`taille`, `est_vide`, `sommet`), `&mut self` pour ce qui modifie (`empiler`, `depiler`), pas de `self` pour `new`.

> [!info] `#[must_use]`
> `empiler` est marquée `#[must_use]` : ignorer son résultat donne un avertissement. Pour le jeter exprès : `let _ = pile.empiler(1);`.
