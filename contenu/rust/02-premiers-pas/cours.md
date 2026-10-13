# Premiers pas

## 1. Cargo, l'outil à tout faire

**Cargo** crée, compile, teste et gère les dépendances (les bibliothèques externes) de ton projet.

```bash
cargo new mon_projet      # nouveau projet
cargo run                 # compile (mode debug) et lance
cargo run --release       # compile optimisé et lance
cargo check               # vérifie les erreurs sans produire de programme (le plus rapide)
cargo test                # lance les tests
cargo add rand            # ajoute une dépendance
```

Un projet contient un fichier `Cargo.toml` (le **manifeste** : nom, version, édition, dépendances) et un dossier `src/` avec `main.rs`.

> [!warning] Version du compilateur ≠ édition
> La **version** (ex. 1.99) est celle de l'outil `rustc`. L'**édition** (2015, 2018, 2021, 2024) est le jeu de règles de syntaxe choisi dans `Cargo.toml`.

### Debug ou release ?

| | debug (par défaut) | release (`--release`) |
|---|---|---|
| Optimisations | aucune | maximales |
| Débordement d'entier | **panique** (arrêt du programme) | **repart à zéro** sans prévenir |
| Vitesse | 2 à 50 fois plus lent | rapide |

## 2. Le Hello World

```rust
fn main() {
    println!("Hello, world!");
}
```

- `fn` déclare une **fonction**, `main` est le point de départ du programme.
- `println!` finit par `!` : c'est une **macro** (du code qui écrit du code à la compilation), pas une fonction.
- `{}` dans le texte est remplacé par une valeur : `println!("J'ai {} ans", age)` ou `println!("J'ai {age} ans")`.

## 3. Variables : immuables par défaut

```rust
let a = 42;        // impossible à modifier
let mut b = 42;    // modifiable grâce à mut
b += 1;            // ok
// a += 1;         // error[E0384]: cannot assign twice to immutable variable
```

En Rust on parle de **binding** (une liaison entre un nom et une valeur). Tout est **immuable** (non modifiable) par défaut : on ajoute `mut` seulement quand c'est nécessaire.

> [!tip] Lire le message d'erreur jusqu'au bout
> Le compilateur propose souvent la correction exacte dans la ligne `help:`. Pour E0384 il propose `let mut ...`.

## 4. Les types de nombres

| Type | Taille | Valeurs |
|---|---|---|
| `u8` / `i8` | 8 bits | 0 à 255 / -128 à 127 |
| `u16` / `i16` | 16 bits | 0 à 65 535 / -32 768 à 32 767 |
| `u32` / `i32` | 32 bits | `i32` est le type par défaut des entiers |
| `u64` / `i64` | 64 bits | jusqu'à environ 1,8 × 10¹⁹ |
| `usize` | taille d'une adresse mémoire | obligatoire pour les indices (`v[i]`) |
| `f32` / `f64` | 32 / 64 bits | nombres à virgule, `f64` par défaut |

`u` = **unsigned** (seulement positif), `i` = **integer** signé (positif ou négatif).

### Pas de conversion automatique

```rust
let petit: u8 = 200;
let grand: u32 = 100_000;
// let somme = petit + grand;          // ne compile pas : types différents
let somme = u32::from(petit) + grand;  // conversion sûre
let tronque = grand as u8;             // coupe les bits en trop : 160
let essai = u8::try_from(grand);       // Err(...) car 100 000 ne tient pas dans un u8
```

| Méthode | Comportement |
|---|---|
| `u32::from(x)` ou `x.into()` | seulement si aucune valeur ne peut être perdue |
| `x as u8` | convertit toujours, **coupe en silence** |
| `u8::try_from(x)` | renvoie un `Result` : `Ok(valeur)` ou `Err` |

### Le débordement (overflow)

Si un calcul dépasse la valeur maximale du type : panique en debug, valeur fausse en release. Pour choisir le comportement :

| Méthode | Si ça déborde |
|---|---|
| `a.checked_add(b)` | renvoie `None` (sinon `Some(résultat)`) |
| `a.saturating_add(b)` | bloque à la valeur maximale |
| `a.wrapping_add(b)` | repart de zéro (volontairement) |

## 5. Fonctions et expressions

```rust
fn tarif(age: u32) -> u32 {
    if age < 12 {
        5
    } else {
        12
    }
}
```

- Le type des **paramètres** et du **retour** (`-> u32`) est obligatoire.
- La dernière ligne **sans point-virgule** est la valeur renvoyée. `return` sert seulement à sortir plus tôt.
- `if`/`else` est une **expression** : il produit une valeur.

> [!warning] Le point-virgule
> `x + 1` vaut `x + 1`. `x + 1;` est une **instruction** qui vaut `()` (le « rien » de Rust, appelé *unit*). Un `;` de trop à la fin d'une fonction donne l'erreur « expected `u32`, found `()` ». C'est l'erreur n°1 des débutants.

## 6. Les boucles

```rust
for i in 1..=5 { }        // 1, 2, 3, 4, 5  (..= inclut la fin)
for i in 0..5 { }         // 0, 1, 2, 3, 4  (.. exclut la fin)

let mut n = 3;
while n > 0 { n -= 1; }   // tant que la condition est vraie

let resultat = loop {     // boucle infinie...
    n += 1;
    if n == 10 {
        break n * 2;      // ...dont on sort avec break (qui peut renvoyer une valeur)
    }
};
```

## 7. `match` : le choix selon un motif

```rust
let description = match note {
    0 => "nul",
    1..=9 => "insuffisant",        // un intervalle
    10 | 11 => "passable",         // plusieurs valeurs
    n if n <= 20 => "bien",        // une condition (garde)
    _ => "note invalide",          // tout le reste
};
```

- `match` est une **expression** : tous les bras renvoient le **même type**.
- `match` est **exhaustif** : tous les cas doivent être couverts, sinon erreur E0004.
- Les bras sont testés **dans l'ordre** : dans FizzBuzz, le cas « multiple de 15 » doit venir **avant** 3 et 5.

## À retenir

- `cargo run`, `cargo check`, `cargo test` ; `--release` pour la vitesse.
- `let` = immuable, `let mut` = modifiable.
- Pas de `;` sur la dernière ligne pour renvoyer une valeur.
- Pas de conversion automatique : `from` (sûr), `as` (coupe), `try_from` (peut échouer).
- Débordement : panique en debug ; `checked_`, `saturating_`, `wrapping_` pour choisir.
- `match` couvre tous les cas, dans l'ordre.
