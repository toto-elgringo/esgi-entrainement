Le trait `Resume` décrit tout ce qui peut se résumer en une ligne.

1. Implémente `resumer` :
   - pour `Article` : `"<titre>, par <auteur>"` ;
   - pour `Tweet` : `"@<pseudo> : <texte>"`.
2. `annoncer(element)` accepte **n'importe quel** type qui implémente `Resume` (grâce à `impl Resume`) et renvoie `"Nouveau : <résumé>"`.
3. `tout_resumer(elements)` est générique avec une clause `where` : elle renvoie tous les résumés séparés par `" | "`.
4. `tweet_du_jour()` renvoie un `impl Resume` : un tweet de `rustlang` qui dit `Rust 2024 est sorti`.

```rust
let a = Article { titre: "Les traits".to_string(), auteur: "Léa".to_string() };
annoncer(&a);   // "Nouveau : Les traits, par Léa"
tweet_du_jour().resumer();   // "@rustlang : Rust 2024 est sorti"
```
