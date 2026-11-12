Écris `compteur(depart, pas)` : elle renvoie une fonction qui, à **chaque appel**, donne le nombre suivant d'une suite qui commence à `depart` et avance de `pas`.

```rust
let mut c = compteur(10, 5);
// c() vaut 10, puis 15, puis 20...
```

Deux compteurs créés séparément sont **indépendants** : chacun garde son propre état.

> [!tip] Capturer son état
> La closure doit emporter la variable d'état avec `move`. Comme elle la modifie, son type est `FnMut`, et la variable qui la reçoit doit être déclarée `mut`.
