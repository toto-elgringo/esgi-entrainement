# Enums et Option

> [!info] Ce que dit le cours
> Les enums de Rust ne sont **pas** des entiers nommés comme en C ou en Java. Ce sont des **types somme** (on dit aussi unions étiquetées, ou types algébriques) : chaque variante peut porter ses propres données, de types différents. C'est sans doute le trait le plus marquant du langage, et la base d'`Option` et de `Result`.

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

## 2. Types produit et types somme

Pourquoi ces noms ? Comptons les valeurs possibles de trois petits types :

```rust
enum Couleur { Rouge, Vert, Bleu }               // 3 valeurs
struct Lampe { allumee: bool, couleur: Couleur } // 2 × 3 = 6 valeurs
enum EtatLampe { Eteinte, Allumee(Couleur) }     // 1 + 3 = 4 valeurs
```

| Type | Le nombre de valeurs… | Nom |
|---|---|---|
| struct, tuple `(bool, Couleur)` | se **multiplie** : toutes les combinaisons de champs sont permises | type **produit** |
| enum | s'**additionne** : une variante **ou** une autre | type **somme** |
| `Option<bool>` | 2 + 1 = **3** (`Some(true)`, `Some(false)`, `None`) | somme |
| `()` | 1 seule valeur : l'ajouter comme champ ne change rien (× 1) | |
| `enum Vide {}` | **aucune** valeur : une struct qui en contient une ne peut pas exister (× 0) | |

La différence n'est pas qu'arithmétique : `Lampe` accepte « éteinte, mais rouge », soit 6 valeurs pour 4 états réels. `EtatLampe` en a **exactement 4**. Avec struct et enum, on décrit un domaine sans **état impossible** ni **cas oublié**.

## 3. `match` sur une enum

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

## 4. Des variantes qui contiennent des données

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

## 5. Des enums dans des enums : l'inventaire du cours

Le cours modélise l'inventaire d'un jeu. Les variantes ont des données de types différents, et une enum peut en contenir une autre :

```rust
enum Potion {
    Soin(u8),
    Mana(u8),
    Force(i8),
}

enum Arme {
    Epee { degats: u8 },
    Hache { degats: u8 },
    Arc { degats: u8, portee: u32 },
}

enum Objet {
    Rien,
    Arme(Arme),
    Armure { defense: u8 },
    Potion(Potion),
}

fn decrire(objet: &Objet) -> String {
    match objet {
        Objet::Rien => "rien".to_string(),
        Objet::Armure { defense } => format!("armure ({defense} de défense)"),
        Objet::Arme(Arme::Arc { degats, portee }) => format!("arc : {degats} dégâts à {portee} m"),
        Objet::Arme(_) => "arme de corps à corps".to_string(),
        Objet::Potion(_) => "potion".to_string(),
    }
}

fn main() {
    let sac = [
        Objet::Arme(Arme::Arc { degats: 7, portee: 40 }),
        Objet::Armure { defense: 3 },
        Objet::Rien,
    ];
    for objet in &sac {
        println!("{}", decrire(objet));
    }
}
```

Le motif va **en profondeur** : `Objet::Arme(Arme::Arc { degats, portee })` ouvre deux niveaux d'un coup et sort les champs. Les bras sont testés **dans l'ordre** : l'arc est pris avant le `Objet::Arme(_)` qui attrape les autres armes.

## 6. Méthodes et derive

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

## 7. Rendre les états impossibles inexprimables

Modélisons la connexion d'un client. Version « drapeaux » :

```rust
struct Client {
    connecte: bool,
    en_cours: bool,
    session: Option<u64>,
    pseudo: Option<String>,
}
```

2 × 2 × 2 × 2 = **16 combinaisons**, dont la plupart n'ont aucun sens : connecté **et** en cours de connexion, connecté sans session, une session sans pseudo… Il faudrait les interdire une par une, à coups de vérifications et de discipline.

Version enum :

```rust
enum Connexion {
    Deconnecte,
    EnCours { depuis_ms: u64 },
    Connecte { session: u64, pseudo: String },
}
```

**Exactement 3 états**, ceux qui existent vraiment. Les autres ne sont pas interdits : ils sont **impossibles à écrire**. Et chaque `match` sur une `Connexion` doit traiter les trois cas : c'est le compilateur qui tient la liste.

> [!tip] Le conseil de conception le plus rentable
> La communauté le résume en « *make illegal states unrepresentable* » : choisir des types où une valeur incohérente ne peut même pas être construite.

## 8. `Option<T>` : il n'y a pas de `null` en Rust

Dans beaucoup de langages, une valeur peut être `null` (« rien »), et oublier de le vérifier fait planter le programme. Tony Hoare, qui a inventé le pointeur nul en 1965, l'appelle son « erreur à un milliard de dollars ». Rust n'a **pas** de `null`. À la place, la bibliothèque standard définit une enum ordinaire :

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

> [!info] Et ça ne coûte rien
> `Option<&T>` occupe **8 octets, exactement comme `&T`** : une référence n'est jamais nulle, donc la valeur 0 est libre pour coder `None` (voir §13).

## 9. `if let` : quand un seul cas t'intéresse

```rust
if let Some(resultat) = diviser(10, 2) {
    println!("Résultat : {resultat}");
} else {
    println!("Division impossible");
}
```

`if let` est un `match` raccourci : « si la valeur correspond à ce motif, alors... ».

## 10. Les méthodes pratiques d'`Option`

| Méthode | Résultat |
|---|---|
| `x.is_some()` / `x.is_none()` | `true` ou `false` |
| `x.unwrap_or(0)` | la valeur, ou `0` s'il n'y a rien |
| `x.map(\|v\| v * 2)` | transforme la valeur si elle existe : `Some(3)` → `Some(6)`, `None` reste `None` |
| `x.take()` | sort la valeur et laisse `None` à sa place (`x` doit être `mut`) |
| `x.unwrap()` | la valeur, ou **panique** si c'est `None` |

> [!info] Les closures
> `|v| v * 2` est une **closure** : une petite fonction sans nom. Entre les barres `|v|` le paramètre, après le résultat. On les étudie en détail au chapitre « Itérateurs et closures ».

## 11. `Result<T, E>` et l'opérateur `?`

`Option` dit « peut-être rien ». Quand une opération peut **échouer pour une raison**, on utilise une autre enum de la bibliothèque standard :

```rust
enum Result<T, E> {
    Ok(T),    // réussite, avec la valeur
    Err(E),   // échec, avec l'erreur
}
```

- Une fonction qui peut échouer renvoie un `Result` : l'échec est **écrit dans sa signature**. Pas d'exception, donc pas de chemin caché.
- `Result` est marqué `#[must_use]` : jeter un `Result` sans le regarder donne un avertissement.
- Le revers : il faut traiter l'erreur à chaque étage. D'où l'opérateur `?`.

```rust
use std::fs::File;
use std::io::Read;

fn lire(chemin: &str) -> std::io::Result<String> {
    let mut fichier = File::open(chemin)?;
    let mut contenu = String::new();
    fichier.read_to_string(&mut contenu)?;
    Ok(contenu)
}

fn main() {
    match lire("absent.txt") {
        Ok(texte) => println!("{texte}"),
        Err(e) => eprintln!("impossible de lire le fichier : {e}"),
    }
}
```

`fichier?` veut dire : si c'est `Ok(v)`, **donne-moi `v`** ; si c'est `Err(e)`, **renvoie tout de suite `Err(e)`** à l'appelant. Sans `?`, il faudrait écrire :

```rust
let mut fichier = match File::open(chemin) {
    Ok(f) => f,
    Err(e) => return Err(e),
};
```

- `?` convertit aussi le type d'erreur au passage, quand une conversion existe.
- `?` ne marche que dans une fonction qui renvoie un `Result` (ou un `Option`) : sinon il n'aurait nulle part où renvoyer l'erreur. C'est pour ça que `main` peut s'écrire `fn main() -> std::io::Result<()>`.
- Raccourci : `std::fs::read_to_string(chemin)?` ouvre et lit le fichier en une ligne.

> [!warning] `unwrap` et `expect`
> `.unwrap()` extrait la valeur ou **panique**. Acceptable dans un test, un prototype, ou quand l'échec est vraiment impossible. Ailleurs, préfère `match`, `?`, ou au moins `.expect("pourquoi ça devait marcher")` : le jour où ça panique, le message t'aide. Tout cela est détaillé au chapitre « Erreurs et Result ».

> [!tip] Un programme utilisable dans un script
> En cas d'erreur, écris le message avec `eprintln!` (sortie d'erreur, pas la sortie normale) et quitte avec un code non nul : `std::process::exit(1)`.

## 12. Le FizzBuzz du cours, version enum

Au chapitre 2, `fizz_buzz` renvoyait un `String` : une allocation sur le tas pour un texte connu d'avance. Le cours propose mieux :

```rust
enum Reponse {
    Fizz,
    Buzz,
    FizzBuzz,
    Nombre(u32),
}
```

Le type dit exactement les 4 résultats possibles, sans allocation, et celui qui l'utilise est obligé de traiter les 4 cas.

## 13. Une enum en mémoire

### La taille d'une enum

Une enum occupe la taille de sa **plus grosse variante**, plus une **étiquette** (le **discriminant**) qui dit quelle variante est présente. Mesuré avec `std::mem::size_of` sur l'inventaire du §5 :

| Type | Taille | Pourquoi |
|---|---|---|
| `Potion` | 2 octets | 1 d'étiquette + 1 de donnée |
| `Arme` | 8 octets | la plus grosse variante (`u8` + `u32`), alignée sur 4 |
| `Objet` | 8 octets | son étiquette se cache dans des valeurs que celle d'`Arme` n'utilise pas |

Aucune allocation, aucun pointeur : un `Objet` tient dans un registre du processeur.

Voici `Arme` octet par octet (sur la machine du cours ; sans attribut `#[repr]`, cette disposition n'est pas garantie) :

| Octet | 0 | 1 | 2-3 | 4 à 7 |
|---|---|---|---|---|
| `Epee` | 0 | degats | vide | vide |
| `Hache` | 1 | degats | vide | vide |
| `Arc` | 2 | degats | vide | portee |

Les variantes **se partagent** les mêmes octets ; l'octet 0 dit lesquels sont valides.

### En C : une `union` et une étiquette à la main

```c
#include <stdint.h>
#include <stdio.h>

struct Arme {
    enum { EPEE, HACHE, ARC } etiquette;
    union {
        struct { uint8_t degats; } epee;
        struct { uint8_t degats; } hache;
        struct { uint8_t degats; uint32_t portee; } arc;
    } donnees;
};

int main(void) {
    printf("%zu octets\n", sizeof(struct Arme));
    return 0;
}
```

| | C | Rust |
|---|---|---|
| Qui vérifie la variante ? | personne : lire `donnees.epee` sur un arc compile sans un avertissement | le compilateur : on n'atteint les données qu'à travers un `match` |
| Taille | 12 octets (étiquette `int` de 4 octets) | 8 octets (étiquette d'1 octet) |

`#[repr(C)]` sur l'enum Rust redonne exactement la disposition du C (12 octets) : c'est ce qu'il faut pour échanger une enum avec un programme C.

### Le *niche filling* : une étiquette gratuite

```rust
use std::mem::size_of;
use std::num::NonZeroU32;

fn main() {
    println!("u32        : {} / Option : {}", size_of::<u32>(), size_of::<Option<u32>>());
    println!("NonZeroU32 : {} / Option : {}", size_of::<NonZeroU32>(), size_of::<Option<NonZeroU32>>());
    println!("&u8        : {} / Option : {}", size_of::<&u8>(), size_of::<Option<&u8>>());
    println!("bool       : {} / Option : {}", size_of::<bool>(), size_of::<Option<bool>>());
    println!("u8         : {} / Option : {}", size_of::<u8>(), size_of::<Option<u8>>());
}
```

| Type `T` | `T` | `Option<T>` | Pourquoi |
|---|---|---|---|
| `u32` | 4 | 8 | toutes les valeurs sont utilisées : il faut une étiquette, et l'alignement en fait 4 octets |
| `NonZeroU32` | 4 | 4 | ne vaut jamais 0 : 0 code `None` |
| `&u8` | 8 | 8 | une référence n'est jamais nulle : 0 code `None` |
| `bool` | 1 | 1 | n'utilise que 0 et 1 : `None` vaut 2 |
| `u8` | 1 | 2 | les 256 valeurs sont prises : 1 octet d'étiquette |

Les valeurs qu'un type n'utilise jamais s'appellent des **niches** : le compilateur s'en sert comme étiquette. C'est grâce à ça qu'un `Objet` tient dans les 8 octets d'une `Arme`.

### Les `union` de Rust

Rust a aussi des `union` sans étiquette, comme en C :

```rust
union EntierOuFlottant {
    entier: u32,
    flottant: f32,
}

fn main() {
    let u = EntierOuFlottant { entier: 1 };
    let f = unsafe { u.flottant };
    println!("{f:e}");   // 1e-45
}
```

Les 4 octets de l'entier 1, relus comme un `f32`, donnent `1e-45` : rien ne vérifie quel champ a été écrit, d'où le bloc `unsafe` (« je garantis ce que le compilateur ne peut pas vérifier »). Les `union` servent à parler au C ; partout ailleurs, l'enum fait le même travail, en sûreté.

## À retenir

- Une enum = **une** variante parmi plusieurs ; `Type::Variante`. C'est un **type somme** (les valeurs s'additionnent), une struct un **type produit** (elles se multiplient).
- Les variantes peuvent contenir des données, même d'autres enums ; le `match` les **déstructure**, en profondeur si besoin.
- `match` est exhaustif : évite `_` sur tes propres enums.
- Choisis des types où un état incohérent **ne peut pas s'écrire** (une enum plutôt que des booléens et des `Option`).
- `Option<T>` remplace `null` : `Some(valeur)` ou `None`. `if let`, `unwrap_or`, `map`, `take` ; `unwrap` peut paniquer.
- `Result<T, E>` : `Ok` ou `Err`, l'échec est dans la signature ; `?` déballe le `Ok` ou renvoie le `Err` à l'appelant.
- Taille d'une enum = plus grosse variante + étiquette, souvent cachée dans une **niche** (`Option<&T>` = 8 octets).
