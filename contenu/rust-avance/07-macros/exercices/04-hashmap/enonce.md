Rust n'a pas de `hashmap!` dans la std. Écris-le !

```text
let ages = hashmap! {
    "Ada" => 36,
    "Alan" => 41,
};
```

La macro construit une `HashMap` à partir de paires `cle => valeur`.

- Elle accepte **zéro, une ou plusieurs** paires.
- Elle accepte une **virgule finale**.
- Elle s'appelle aussi avec des parenthèses : `hashmap!("a" => 1)`.

> [!tip] Astuce
> `HashMap::from` accepte un tableau de paires `[(cle, valeur), ...]`.
