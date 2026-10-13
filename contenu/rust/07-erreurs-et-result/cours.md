# Erreurs : `panic!` et `Result`

## 1. Deux sortes d'erreurs

| Sorte | Exemples | Outil |
|---|---|---|
| **irrécupérable** : un bug, une situation qui ne devrait jamais arriver | indice hors du tableau, état impossible | `panic!` |
| **récupérable** : un échec prévisible | saisie invalide, fichier absent, réseau coupé | `Result<T, E>` |

Rust n'a **pas d'exceptions** : une fonction qui peut échouer l'annonce dans son **type de retour**. Impossible d'oublier l'erreur sans que ça se voie.

## 2. `panic!` : tout arrêter

```rust
panic!("ça ne devrait jamais arriver");
```

Le programme s'arrête avec le message. Certaines opérations paniquent toutes seules : lire `v[10]` dans un tableau de 3 cases, un débordement d'entier en debug, `unwrap()` sur un `None`.

> [!tip] Dans les tests
> `#[should_panic(expected = "message")]` au-dessus d'un test vérifie que le code panique bien avec ce message.

## 3. `Result<T, E>` : réussir ou échouer avec une raison

```rust
enum Result<T, E> {
    Ok(T),    // succès, avec la valeur de type T
    Err(E),   // échec, avec l'erreur de type E
}
```

```rust
fn diviser(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division par zéro"))
    } else {
        Ok(a / b)
    }
}

match diviser(10, 0) {
    Ok(resultat) => println!("Résultat : {resultat}"),
    Err(erreur) => println!("Erreur : {erreur}"),
}
```

> [!info] `Option` ou `Result` ?
> `Option` dit seulement « il n'y a rien ». `Result` dit « ça a échoué, **et voici pourquoi** ».

## 4. Transformer du texte en nombre : `parse`

```rust
let ok = "42".parse::<i32>();     // Ok(42)
let ko = "abc".parse::<i32>();    // Err(ParseIntError { kind: InvalidDigit })
```

- `::<i32>` (surnommé **turbofish**) précise le type voulu. On peut aussi écrire `let n: i32 = texte.parse().unwrap();`.
- Le type de l'erreur est `std::num::ParseIntError`. Affichée avec `{}`, elle donne par exemple `invalid digit found in string`.
- Pense à `.trim()` pour enlever les espaces autour d'une saisie : `" 42 ".trim().parse::<i32>()`.

## 5. L'opérateur `?` : propager l'erreur

```rust
use std::num::ParseIntError;

fn additionner(a: &str, b: &str) -> Result<i32, ParseIntError> {
    let x = a.parse::<i32>()?;
    let y = b.parse::<i32>()?;
    Ok(x + y)
}
```

Le `?` après un `Result` veut dire :

- si c'est `Ok(valeur)` → donne `valeur` et continue ;
- si c'est `Err(erreur)` → **arrête la fonction** et renvoie `Err(erreur)` à l'appelant.

C'est un raccourci pour :

```rust
let x = match a.parse::<i32>() {
    Ok(valeur) => valeur,
    Err(erreur) => return Err(erreur),
};
```

> [!warning] Où utiliser `?`
> Seulement dans une fonction qui renvoie elle-même un `Result` (ou un `Option` pour un `?` sur un `Option`). Dans `main`, il faut écrire `fn main() -> Result<(), ...>`.

## 6. Ses propres erreurs avec une enum

```rust
#[derive(Debug, PartialEq)]
enum ErreurAge {
    Vide,
    PasUnNombre,
    TropGrand(u32),
}

fn lire_age(texte: &str) -> Result<u32, ErreurAge> { ... }
```

L'appelant peut faire un `match` sur chaque cas et réagir différemment (redemander, afficher un message précis...).

## 7. Convertir entre `Option`, `Result` et les erreurs

| Méthode | Ce qu'elle fait |
|---|---|
| `option.ok_or(erreur)` | `Option` → `Result` : `None` devient `Err(erreur)` |
| `resultat.ok()` | `Result` → `Option` : l'erreur est jetée |
| `resultat.map_err(\|e\| autre)` | remplace l'erreur par une autre |
| `resultat.unwrap_or(defaut)` | la valeur, ou `defaut` en cas d'erreur |
| `resultat.is_ok()` / `is_err()` | `true` ou `false` |

Exemple très courant, `map_err` + `?` :

```rust
let age = texte.parse::<u32>().map_err(|_| ErreurAge::PasUnNombre)?;
```

`|_|` est une closure qui ignore son paramètre (l'erreur d'origine).

## 8. `unwrap` et `expect` : quand les utiliser ?

- `unwrap()` : la valeur, ou **panique** avec un message peu clair.
- `expect("message")` : pareil, mais panique avec **ton** message.

| Acceptable | À éviter |
|---|---|
| dans les tests | saisie de l'utilisateur |
| dans un petit prototype | lecture de fichier, réseau |
| quand l'échec est vraiment impossible (avec `expect` qui explique pourquoi) | tout ce qui peut raisonnablement échouer |

> [!tip] Un bon `expect` documente
> `.expect("la configuration contient toujours un port")` explique au lecteur pourquoi l'échec est impossible.

## À retenir

- Bug ou état impossible → `panic!`. Échec prévisible → `Result`.
- `Result<T, E>` = `Ok(T)` ou `Err(E)` ; on le traite avec `match`.
- `texte.parse::<i32>()` renvoie un `Result`.
- `?` renvoie l'erreur à l'appelant ; seulement dans une fonction qui renvoie un `Result`.
- Une enum d'erreur décrit tous les échecs possibles.
- `ok_or`, `map_err`, `ok`, `unwrap_or` pour convertir.
- `unwrap` / `expect` : tests, prototypes, cas impossibles.
