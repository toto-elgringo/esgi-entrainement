Une `Grille` stocke des entiers dans un seul `Vec`, ligne après ligne. Permets de lire et d'écrire une case avec la notation `grille[(ligne, colonne)]` en implémentant `Index` et `IndexMut`.

- L'index est un couple `(usize, usize)` : `(ligne, colonne)`.
- Une case en dehors de la grille doit faire **paniquer** le programme (avec `assert!`).
- `Grille::new(largeur, hauteur)` est déjà écrit : toutes les cases valent 0.

```rust
let mut g = Grille::new(3, 2);
g[(1, 2)] = 7;
println!("{}", g[(1, 2)]);
```

> [!tip] Rappel
> `IndexMut` s'appuie sur `Index` : il faut implémenter les deux, `Index` d'abord.
