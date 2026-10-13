# Strings et mémoire

## 1. Deux grandes familles de texte

En C, `char *` sert à tout et ne dit rien : qui libère la mémoire ? quel encodage ? Rust met ces informations **dans le type**.

| Type | Qui possède le texte ? | Modifiable ? | Usage |
|---|---|---|---|
| `&str` | personne : on l'**emprunte** (on le regarde) | non | lire du texte, paramètre de fonction |
| `String` | la variable le **possède** (rangé sur le tas) | oui | construire, modifier, renvoyer du texte |
| `Box<str>` | possédé | non | texte figé, sans place en trop |
| `&[u8]` / `Vec<u8>` | emprunté / possédé | — | octets bruts (pas forcément du texte valide) |

Chaque ligne est une paire **emprunté / possédé** : `&str` / `String`, `&[T]` / `Vec<T>`, `&Path` / `PathBuf`.

> [!tip] La règle des signatures
> **Prendre l'emprunt, rendre le possédé.** Un paramètre `&str` accepte un texte écrit dans le code, une `String` (avec `&`) ou un morceau de texte. Une fonction qui fabrique un nouveau texte renvoie une `String`.

```rust
fn saluer(nom: &str) -> String {
    format!("Bonjour {nom} !")
}

let prenom = String::from("Alice");
saluer(&prenom);   // une String empruntée
saluer("Bob");     // un texte écrit dans le code
```

Un texte entre guillemets (`"Bob"`) est un `&'static str` : ses octets sont rangés dans le programme lui-même et existent pendant toute l'exécution (c'est le sens de `'static`).

### Créer et modifier une `String`

```rust
let mut s = String::new();          // vide
let mut s = String::from("Salut");  // à partir d'un texte
let s2 = "Salut".to_string();       // pareil
s.push(' ');                        // ajoute UN caractère (char, guillemets simples)
s.push_str("à tous");               // ajoute un texte
let phrase = format!("{s} !");      // comme println!, mais renvoie une String
```

## 2. UTF-8 : un caractère = 1 à 4 octets

Le texte Rust est toujours en **UTF-8** : une façon de transformer chaque caractère en une suite d'octets.

| Caractères | Octets | Exemple |
|---|---|---|
| ASCII (lettres sans accent, chiffres, ponctuation) | 1 | `H` |
| lettres accentuées, grecques... | 2 | `é` |
| autres symboles | 3 | `€` |
| émojis | 4 | `🦀` |

```rust
assert_eq!("Hello, 🦀".len(), 11);           // nombre d'OCTETS
assert_eq!("Hello, 🦀".chars().count(), 8);  // nombre de CARACTÈRES
```

- `.len()` : nombre d'**octets**, instantané (la longueur est rangée dans la `String`).
- `.chars()` : parcourt les **caractères** un par un. `.chars().count()` doit lire tout le texte.
- `.char_indices()` : donne des paires (position en octets, caractère).

```rust
for (position, caractere) in "Hé!".char_indices() {
    println!("{position} : {caractere}");   // 0 : H   puis 1 : é   puis 3 : !
}
```

> [!info] Le type `char`
> Un `char` s'écrit entre guillemets simples : `'a'`, `'🦀'`. Il prend **toujours 4 octets**, alors que dans une `String` le même caractère prend de 1 à 4 octets. `c.len_utf8()` donne sa taille en UTF-8.

### Couper un texte

`&s[debut..fin]` donne un **morceau** (une *tranche*, ou *slice*) du texte. Les positions sont en **octets**.

```rust
let s = "Hello, 🦀";
let debut = &s[0..7];   // "Hello, "
let reste = &s[7..];    // "🦀"
let faux = &s[0..8];    // PANIQUE : 8 tombe au milieu du crabe
```

> [!warning] Piège
> Couper au milieu d'un caractère fait **paniquer** le programme : `byte index 8 is not a char boundary`. Outils sûrs :
> - `s.is_char_boundary(i)` : `true` si on peut couper à la position `i` ;
> - `s.get(0..8)` : renvoie `None` au lieu de paniquer ;
> - `s.chars()` et `s.char_indices()` pour avancer caractère par caractère.

## 3. La pile et le tas

Un programme range ses données dans deux zones de mémoire :

| | Pile (*stack*) | Tas (*heap*) |
|---|---|---|
| Rapidité | très rapide | plus lent (il faut demander de la place) |
| Taille des données | connue à la compilation | décidée pendant l'exécution |
| Libération | à la fin du bloc | quand le propriétaire disparaît |
| Place disponible | petite (1 Mo sous Windows, 8 Mo sous Linux) | toute la mémoire |

En Rust, pas de `malloc` ni de `new` : c'est le **type** qui décide où va la valeur.

```rust
let sur_la_pile: u64 = 42;
let sur_le_tas: Box<u64> = Box::new(42);
let total = sur_la_pile + *sur_le_tas;   // * lit la valeur rangée dans la boîte
```

- `Box<T>` est une **boîte** : une adresse (8 octets sur la pile) qui pointe vers une valeur rangée sur le tas. La valeur est libérée automatiquement quand la boîte disparaît.
- `String` et `Vec<T>` rangent aussi leur contenu sur le tas.

### Taille sur la pile (machine 64 bits)

| Type | Sur la pile | Sur le tas |
|---|---|---|
| `&str` | 16 octets (adresse + longueur) | rien, il emprunte |
| `String` | 24 octets (adresse + longueur + capacité) | le texte + de la place libre |
| `Box<u64>` | 8 octets (adresse) | la valeur |

La **capacité** d'une `String` est la place réservée : le texte peut grandir sans redemander de la mémoire à chaque caractère. `std::mem::size_of::<T>()` donne la taille d'un type sur la pile.

### Le débordement de pile

```rust
let gros = [0u8; 9_000_000];       // 9 Mo sur la pile : CRASH
let gros = vec![0u8; 9_000_000];   // 9 Mo sur le tas : ok
```

> [!warning] Stack overflow = arrêt brutal
> `thread 'main' has overflowed its stack` : ce n'est pas une panique, le programme est tué immédiatement, sans rien nettoyer. Les gros tableaux vont sur le tas avec `vec!`.

## 4. Mesurer la vitesse

- Toujours mesurer en `--release` (le mode debug est 2 à 50 fois plus lent).
- Répéter la mesure : l'outil **hyperfine** lance le programme plusieurs fois et donne la moyenne et l'écart.
- Se méfier de l'**optimiseur** : en release, le compilateur peut calculer un résultat à l'avance et supprimer ta boucle. `std::hint::black_box(x)` l'empêche de « tricher ».

> [!tip] Se demander ce qu'on mesure
> Dans le cours, la somme sur la pile (0,65 ms) semblait 1 800 fois plus rapide que sur le tas (1,15 s). Fausse conclusion : le compilateur avait remplacé toute la boucle par le résultat final. Pour vérifier, on regarde l'assembleur (sur godbolt.org par exemple).

## À retenir

- Paramètre qui lit du texte : `&str`. Texte fabriqué renvoyé : `String`.
- `len()` = octets, `chars().count()` = caractères.
- Couper au milieu d'un caractère panique : utiliser `get`, `is_char_boundary`, `char_indices`.
- Pile : rapide mais petite. Tas : grand mais plus lent (`Box`, `Vec`, `String`).
- Les gros tableaux se créent avec `vec![...]`.
- Mesurer en `--release`, avec `black_box`, et vérifier ce que le compilateur a gardé.
