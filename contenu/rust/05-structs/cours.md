# Structures (struct)

## 1. Pourquoi une struct ?

Une **struct** (structure) regroupe plusieurs valeurs qui vont ensemble sous un seul nom, comme une fiche avec plusieurs cases. Chaque case s'appelle un **champ**.

```rust
struct Eleve {
    nom: String,
    age: u32,
    actif: bool,
}
```

- `struct` déclare un **nouveau type**.
- Convention : le nom du type commence par une majuscule (`Eleve`), les champs sont en minuscules avec des `_` (`date_naissance`).

## 2. Créer et lire une struct

```rust
let alice = Eleve {
    nom: String::from("Alice"),
    age: 20,
    actif: true,
};
println!("{} a {} ans", alice.nom, alice.age);
```

- Il faut donner **tous** les champs, dans l'ordre qu'on veut.
- On lit un champ avec un point : `alice.age`.

### Modifier : toute la variable est `mut`

```rust
let mut bob = Eleve { nom: String::from("Bob"), age: 19, actif: true };
bob.age += 1;
```

> [!warning] Pas de champ `mut` tout seul
> On ne peut pas rendre un seul champ modifiable : c'est la **variable entière** qui est `mut` ou non.

### Deux raccourcis

```rust
fn creer_eleve(nom: String, age: u32) -> Eleve {
    Eleve { nom, age, actif: true }   // « nom » veut dire « nom: nom »
}

let carla = Eleve {
    nom: String::from("Carla"),
    ..alice                           // les autres champs viennent de alice
};
```

## 3. Struct tuple

Une **struct tuple** a des champs sans nom, numérotés à partir de 0.

```rust
struct Couleur(u8, u8, u8);
struct Metres(f64);

let orange = Couleur(255, 128, 0);
println!("vert = {}", orange.1);   // 128
```

> [!tip] Le motif « newtype »
> `struct Metres(f64)` et `struct Secondes(f64)` contiennent tous les deux un `f64`, mais ce sont **deux types différents** : impossible de passer des secondes à une fonction qui attend des mètres. Le compilateur évite les mélanges d'unités.

Il existe aussi la struct **unité**, sans aucun champ : `struct Marqueur;` (rarement utile au début).

## 4. Méthodes avec `impl`

Une **méthode** est une fonction attachée à un type. On les écrit dans un bloc `impl` :

```rust
struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

impl Rectangle {
    fn aire(&self) -> u32 {
        self.largeur * self.hauteur
    }

    fn agrandir(&mut self, facteur: u32) {
        self.largeur *= facteur;
        self.hauteur *= facteur;
    }
}

let mut r = Rectangle { largeur: 3, hauteur: 4 };
println!("{}", r.aire());   // 12
r.agrandir(2);
```

`self` désigne la valeur sur laquelle on appelle la méthode (`r` dans `r.aire()`). Le premier paramètre dit ce que la méthode fait de cette valeur :

| Premier paramètre | Ce que fait la méthode | Après l'appel |
|---|---|---|
| `&self` | **lit** la valeur (emprunt) | toujours utilisable |
| `&mut self` | **modifie** la valeur (emprunt mutable) | utilisable, mais la variable doit être `mut` |
| `self` | **prend possession** de la valeur (move) | plus utilisable |

> [!tip] Quel choix ?
> Par défaut `&self`. `&mut self` si la méthode change des champs. `self` quand la méthode **transforme** la valeur en autre chose (une commande devient un ticket).

## 5. Fonctions associées et `new`

Une fonction dans `impl` **sans** paramètre `self` est une **fonction associée** : on l'appelle avec `::` sur le type.

```rust
impl Rectangle {
    fn new(largeur: u32, hauteur: u32) -> Self {
        Self { largeur, hauteur }
    }

    fn carre(cote: u32) -> Self {
        Self { largeur: cote, hauteur: cote }
    }
}

let r = Rectangle::new(3, 4);
let c = Rectangle::carre(5);
```

- `Self` (majuscule) = le type du bloc `impl`, ici `Rectangle`.
- `new` n'est **pas** un mot-clé : c'est seulement une convention pour « fabriquer une nouvelle valeur ». Rust n'a pas de constructeur spécial.

## 6. `derive` : des capacités automatiques

Par défaut, une struct ne sait ni s'afficher, ni se copier, ni se comparer. `#[derive(...)]` demande au compilateur d'écrire ce code pour nous :

```rust
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}
```

| Trait dérivé | Ce qu'il permet |
|---|---|
| `Debug` | afficher avec `{:?}` ou `{:#?}` |
| `Clone` | faire une vraie copie avec `.clone()` |
| `PartialEq` | comparer avec `==` et `!=` (et utiliser `assert_eq!`) |
| `Copy` | copie automatique, comme les entiers (seulement si tous les champs sont `Copy`) |

Un **trait** est une capacité qu'un type peut avoir (on les étudie dans un chapitre dédié).

```rust
let p = Point { x: 1, y: 2 };
println!("{:?}", p);    // Point { x: 1, y: 2 }
println!("{:#?}", p);   // la même chose, sur plusieurs lignes
```

> [!warning] Erreur fréquente
> « `Point` doesn't implement `Debug` » : il manque `#[derive(Debug)]`. La ligne `help:` du compilateur le propose.

`println!("{}", p)` (sans `?`) demande le trait `Display`, qu'il faut écrire soi-même : on le verra avec les traits.

## 7. Struct et ownership

Une struct **possède** ses champs : quand la struct disparaît, ses champs aussi. Pour l'instant, utilise `String` (possédé) plutôt que `&str` (emprunté) dans les champs : une référence dans une struct demande des **durées de vie** (lifetimes), vues plus tard.

## À retenir

- `struct Nom { champ: Type }` pour regrouper des données ; `valeur.champ` pour les lire.
- Toute la variable est `mut`, jamais un champ seul.
- Struct tuple : `struct Metres(f64)`, accès avec `.0`.
- `impl` contient les méthodes : `&self` (lire), `&mut self` (modifier), `self` (consommer).
- Sans `self` : fonction associée, appelée avec `Type::fonction()`, comme `new`.
- `#[derive(Debug, Clone, PartialEq)]` pour `{:?}`, `.clone()` et `==`.
