Une **pile** range des éléments les uns sur les autres : on ajoute en haut, on retire en haut (comme une pile d'assiettes).

`Pile<T>` est une structure **générique** : elle marche pour n'importe quel type `T` (`Pile<i32>`, `Pile<String>`...). Complète ses méthodes :

| Méthode | Rôle |
|---|---|
| `new()` | crée une pile vide |
| `empiler(valeur)` | pose `valeur` en haut |
| `depiler()` | retire et renvoie l'élément du haut (`None` si vide) |
| `sommet()` | regarde l'élément du haut sans le retirer (`None` si vide) |
| `taille()` | le nombre d'éléments |
| `est_vide()` | `true` si la pile est vide |
| `afficher()` | les éléments du bas vers le haut séparés par `" \| "`, ou `"(vide)"` |

```rust
let mut pile = Pile::new();
pile.empiler(1);
pile.empiler(2);
pile.empiler(3);
pile.afficher();   // "1 | 2 | 3"
pile.depiler();    // Some(3)
pile.sommet();     // Some(&2)
```

> [!info] Un `impl` avec contrainte
> `afficher` est dans un bloc `impl<T: Display> Pile<T>` : elle n'existe que pour les piles dont les éléments savent s'afficher.
