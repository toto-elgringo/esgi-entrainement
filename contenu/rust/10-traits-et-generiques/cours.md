# Traits et génériques

## 1. Un trait : un comportement partagé

Un **trait** est une liste de méthodes qu'un type promet de fournir. C'est l'équivalent d'une **interface** dans d'autres langages.

```rust
trait Animal {
    fn nom(&self) -> String;
    fn cri(&self) -> String;
}

struct Chien;
struct Chat;

impl Animal for Chien {
    fn nom(&self) -> String { "Rex".to_string() }
    fn cri(&self) -> String { "Wouf".to_string() }
}

impl Animal for Chat {
    fn nom(&self) -> String { "Felix".to_string() }
    fn cri(&self) -> String { "Miaou".to_string() }
}
```

`impl Animal for Chien` se lit « voici comment un `Chien` est un `Animal` ». Le compilateur vérifie que **toutes** les méthodes sont écrites.

### Méthode par défaut

Un trait peut fournir une méthode déjà écrite. Chaque type l'obtient gratuitement, et peut la **remplacer** s'il le souhaite.

```rust
trait Animal {
    fn nom(&self) -> String;
    fn cri(&self) -> String;
    fn presenter(&self) -> String {
        format!("{} fait {}", self.nom(), self.cri())
    }
}
```

## 2. `derive` : les traits écrits automatiquement

Pour les traits les plus courants, Rust sait écrire l'implémentation tout seul :

```rust
#[derive(Debug, Clone, PartialEq, Default)]
struct Point {
    x: i32,
    y: i32,
}
```

| Trait | Ce qu'il permet |
|---|---|
| `Debug` | afficher avec `{:?}` |
| `Clone` | copier explicitement avec `.clone()` |
| `Copy` | copie automatique (seulement pour les petits types sans tas) |
| `PartialEq` / `Eq` | comparer avec `==` et `!=` |
| `PartialOrd` / `Ord` | comparer avec `<`, `>`, trier |
| `Hash` | servir de clé dans une `HashMap` |
| `Default` | créer une valeur par défaut avec `Point::default()` |

## 3. `Display` : un affichage pour les humains

`{:?}` (Debug) peut être dérivé, mais `{}` (Display) doit être écrit à la main : c'est à toi de décider comment ton type s'affiche.

```rust
use std::fmt;

struct Fraction {
    numerateur: i32,
    denominateur: i32,
}

impl fmt::Display for Fraction {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}/{}", self.numerateur, self.denominateur)
    }
}

let moitie = Fraction { numerateur: 1, denominateur: 2 };
println!("{moitie}");               // 1/2
let texte = moitie.to_string();     // "1/2" : offert par Display
```

`write!` marche comme `format!`, mais écrit dans `f`. Avec `{:.1}` on garde un seul chiffre après la virgule.

## 4. Les génériques : un code pour plusieurs types

Sans générique, il faudrait une fonction par type :

```rust
fn plus_grand_i32(a: i32, b: i32) -> i32 { if a > b { a } else { b } }
fn plus_grand_f64(a: f64, b: f64) -> f64 { if a > b { a } else { b } }
```

Avec un **paramètre de type** `T` :

```rust
fn plus_grand<T: PartialOrd>(a: T, b: T) -> T {
    if a > b { a } else { b }
}

plus_grand(3, 7);             // 7
plus_grand(2.5, 1.5);         // 2.5
plus_grand("pomme", "kiwi");  // "pomme"
```

`T: PartialOrd` est une **contrainte** (*trait bound*) : « `T` peut être n'importe quel type, **à condition** qu'il sache se comparer ». Sans elle, `a > b` ne compilerait pas.

Plusieurs contraintes : `T: PartialOrd + Copy`. Quand ça devient long, on utilise `where` :

```rust
fn resume<T, U>(a: T, b: U) -> String
where
    T: std::fmt::Display,
    U: std::fmt::Debug,
{
    format!("{a} et {b:?}")
}
```

### Structures génériques

```rust
struct Boite<T> {
    contenu: T,
}

impl<T> Boite<T> {
    fn ouvrir(self) -> T {
        self.contenu
    }
}
```

> [!info] Zéro coût
> Le compilateur crée une copie de la fonction pour chaque type utilisé (la *monomorphisation*). Aucun coût à l'exécution, mais un programme un peu plus gros.

## 5. `impl Trait` : « n'importe quel type qui... »

```rust
fn annoncer(animal: &impl Animal) -> String {
    format!("Voici {}", animal.nom())
}
```

C'est un raccourci pour `fn annoncer<T: Animal>(animal: &T)`. On peut aussi l'utiliser en retour : `fn creer() -> impl Animal`.

## 6. `Box<dyn Trait>` : mélanger plusieurs types

Un `Vec` ne contient qu'**un seul type**. Pour ranger un chien **et** un chat dans la même liste, on range des « boîtes vers quelque chose qui est un `Animal` » :

```rust
let animaux: Vec<Box<dyn Animal>> = vec![
    Box::new(Chien),
    Box::new(Chat),
];

for animal in &animaux {
    println!("{}", animal.cri());   // la bonne méthode est choisie à l'exécution
}
```

| | Générique `<T: Animal>` | `Box<dyn Animal>` |
|---|---|---|
| Choix de la méthode | à la compilation | à l'exécution |
| Plusieurs types mélangés | non | oui |
| Coût | aucun | une petite indirection |

> [!tip] Lequel choisir ?
> Par défaut, les génériques. `dyn` quand il faut **mélanger** des types différents dans une même collection.

## À retenir

- `trait` = liste de méthodes ; `impl Trait for Type` = la promesse tenue.
- Une méthode par défaut peut être remplacée par chaque type.
- `#[derive(Debug, Clone, PartialEq, ...)]` écrit les traits courants à ta place.
- `impl fmt::Display` pour afficher avec `{}` (et obtenir `to_string()`).
- `fn f<T: Trait>(x: T)` : générique avec contrainte ; `where` pour les longues contraintes.
- `impl Trait` en paramètre ou en retour : un raccourci lisible.
- `Vec<Box<dyn Trait>>` pour mélanger plusieurs types qui partagent un trait.
