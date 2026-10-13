# Enums et Option

## 1. Une enum : un choix parmi plusieurs possibilités

Une **enum** (énumération) est un type dont la valeur est **exactement une** de ses **variantes**.

```rust
enum Feu {
    Rouge,
    Orange,
    Vert,
}

let feu = Feu::Rouge;
```

> [!tip] struct = ET, enum = OU
> Un `Eleve` a un nom **et** un âge (struct). Un `Feu` est rouge **ou** orange **ou** vert (enum).

On écrit le nom de l'enum, puis `::`, puis la variante : `Feu::Rouge`.

## 2. `match` sur une enum

```rust
fn action(feu: &Feu) -> &'static str {
    match feu {
        Feu::Rouge => "stop",
        Feu::Orange => "ralentir",
        Feu::Vert => "passer",
    }
}
```

Le `match` doit couvrir **toutes** les variantes (il est **exhaustif**). Si on en oublie une, le code ne compile pas :

```text
error[E0004]: non-exhaustive patterns: `Feu::Vert` not covered
```

> [!warning] Le `_` paresseux
> Le jour où tu ajoutes une variante (`Feu::Clignotant`), le compilateur liste tous les `match` à mettre à jour. Un `_ => ...` le rend muet : évite-le sur tes propres enums.

## 3. Des variantes qui contiennent des données

Chaque variante peut transporter ses propres données :

```rust
enum Forme {
    Cercle { rayon: f64 },              // champs nommés, comme une struct
    Rectangle(f64, f64),                // champs numérotés, comme un tuple
    Point,                              // aucune donnée
}

let f = Forme::Rectangle(3.0, 4.0);
```

Le `match` **déstructure** la variante : il sort les données dans des variables.

```rust
let aire = match f {
    Forme::Cercle { rayon } => 3.14 * rayon * rayon,
    Forme::Rectangle(largeur, hauteur) => largeur * hauteur,
    Forme::Point => 0.0,
};
```

## 4. Méthodes et derive

Comme pour une struct, on peut écrire un bloc `impl` et utiliser `#[derive(...)]` :

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
enum Feu {
    Rouge,
    Orange,
    Vert,
}

impl Feu {
    fn suivant(self) -> Feu {
        match self {
            Feu::Vert => Feu::Orange,
            Feu::Orange => Feu::Rouge,
            Feu::Rouge => Feu::Vert,
        }
    }
}
```

## 5. `Option<T>` : il n'y a pas de `null` en Rust

Dans beaucoup de langages, une valeur peut être `null` (« rien »), et oublier de le vérifier fait planter le programme. Rust n'a **pas** de `null`. À la place, la bibliothèque standard définit :

```rust
enum Option<T> {
    Some(T),   // il y a une valeur
    None,      // il n'y a rien
}
```

`T` veut dire « n'importe quel type » : `Option<i32>`, `Option<String>`... `Some` et `None` s'utilisent directement, sans `Option::`.

```rust
fn diviser(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}
```

Un `Option<i32>` **n'est pas** un `i32` : `diviser(10, 2) + 1` ne compile pas. Le compilateur t'oblige à traiter le cas `None` avant d'utiliser la valeur.

```rust
match diviser(10, 2) {
    Some(resultat) => println!("Résultat : {resultat}"),
    None => println!("Division impossible"),
}
```

## 6. `if let` : quand un seul cas t'intéresse

```rust
if let Some(resultat) = diviser(10, 2) {
    println!("Résultat : {resultat}");
} else {
    println!("Division impossible");
}
```

`if let` est un `match` raccourci : « si la valeur correspond à ce motif, alors... ».

## 7. Les méthodes pratiques d'`Option`

| Méthode | Résultat |
|---|---|
| `x.is_some()` / `x.is_none()` | `true` ou `false` |
| `x.unwrap_or(0)` | la valeur, ou `0` s'il n'y a rien |
| `x.map(\|v\| v * 2)` | transforme la valeur si elle existe : `Some(3)` → `Some(6)`, `None` reste `None` |
| `x.unwrap()` | la valeur, ou **panique** si c'est `None` |

> [!info] Les closures
> `|v| v * 2` est une **closure** : une petite fonction sans nom. Entre les barres `|v|` le paramètre, après le résultat. On les étudie en détail au chapitre « Itérateurs et closures ».

> [!warning] `unwrap()`
> `unwrap()` sur un `None` fait planter le programme. Préfère `match`, `if let` ou `unwrap_or`. Le chapitre suivant explique quand `unwrap` est acceptable.

## 8. Le FizzBuzz du cours, version enum

Au chapitre 2, `fizz_buzz` renvoyait un `String` : une allocation sur le tas pour un texte connu d'avance. Le cours propose mieux :

```rust
enum FizzBuzz {
    Fizz,
    Buzz,
    FizzBuzz,
    Nombre(u32),
}
```

Le type dit exactement les 4 résultats possibles, sans allocation, et celui qui l'utilise est obligé de traiter les 4 cas.

## À retenir

- Une enum = **une** variante parmi plusieurs ; `Type::Variante`.
- Les variantes peuvent contenir des données ; le `match` les **déstructure**.
- `match` est exhaustif : évite `_` sur tes propres enums.
- `Option<T>` remplace `null` : `Some(valeur)` ou `None`.
- `if let Some(x) = ...` quand un seul cas compte.
- `unwrap_or`, `map`, `is_some` ; `unwrap` peut paniquer.
