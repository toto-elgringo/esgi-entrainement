`plus_long(a, b)` renvoie le texte le plus long (en octets, avec `.len()`). En cas d'égalité, elle renvoie `a`.

Le code ne compile pas : **E0106**. Le résultat vient de `a` **ou** de `b`, et le compilateur ne sait pas lequel.

1. Ajoute une durée de vie `'a` à `plus_long` pour que le code compile.
2. Écris `plus_long_de_trois(a, b, c)` : le plus long des trois (en cas d'égalité, le premier dans l'ordre `a`, `b`, `c`). Elle aura besoin de la même annotation.

```rust
fn plus_long<'a>(a: &'a str, b: &'a str) -> &'a str
```

> [!tip] Comment le lire
> « Le résultat reste valable tant que `a` **et** `b` existent. »
