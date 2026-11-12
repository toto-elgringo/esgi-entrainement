# Une liste chaînée

La liste est un type **récursif** : un maillon `Cons` contient une valeur et le reste de la liste. Il faut une `Box` pour que la taille du type soit connue.

```rust
enum Liste {
    Cons(i32, Box<Liste>),
    Vide,
}
```

Écris les quatre fonctions (par récursion, avec `match`) :

- `somme(liste)` : somme des valeurs (0 pour une liste vide) ;
- `longueur(liste)` : nombre d'éléments ;
- `contient(liste, cherche)` : `true` si la valeur est présente ;
- `depuis_tranche(valeurs)` : construit la liste qui contient les valeurs dans le même ordre.
