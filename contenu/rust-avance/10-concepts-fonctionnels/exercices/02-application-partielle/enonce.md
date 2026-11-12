Écris `fixer_premier(f, a)` : elle reçoit une fonction `f` à deux arguments et une valeur `a`, et renvoie une **nouvelle fonction** qui n'attend plus que le second argument.

```rust
let multiplier = |a: i32, b: i32| a * b;
let triple = fixer_premier(multiplier, 3);
// triple(5) vaut 15
```

Elle doit marcher avec n'importe quels types, par exemple du texte :

```rust
let saluer = |formule: &str, nom: &str| format!("{formule}, {nom} !");
let bonjour = fixer_premier(saluer, "Bonjour");
// bonjour("Ada") vaut "Bonjour, Ada !"
```

> [!info] Pourquoi `Clone` ?
> La fonction renvoyée peut être appelée plusieurs fois. À chaque appel, elle donne une copie de `a` à `f`.
