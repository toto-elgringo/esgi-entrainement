Au chapitre 2, `fizz_buzz` renvoyait un `String`, ce qui fabrique du texte sur le tas pour rien. Le cours propose mieux : une enum qui décrit les 4 résultats possibles.

```rust
enum FizzBuzz {
    Fizz,
    Buzz,
    FizzBuzz,
    Nombre(u32),
}
```

Écris :

1. `fizz_buzz(n)` qui renvoie la bonne variante (`FizzBuzz::Nombre(7)` pour 7) ;
2. `en_texte(valeur)` qui transforme une variante en texte : `"Fizz"`, `"Buzz"`, `"FizzBuzz"` ou le nombre (`"7"`).

Clique sur « Exécuter » pour voir la liste de 1 à 15.
