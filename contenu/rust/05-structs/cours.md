# Structures (struct)

> [!info] Le fil rouge du cours
> Le cours part d'une question simple : un `Vec` range ses éléments sur le **tas** (la mémoire qu'on demande pendant l'exécution). Si on connaît d'avance le nombre maximum d'éléments, peut-on tout garder sur la **pile** (la mémoire rapide de la fonction en cours) ? La réponse mène aux structures, puis aux génériques.

## 1. Le problème : un tableau et un compteur qui se promènent séparément

Pour une pile de 3 octets sans tas, il suffit d'un tableau et d'un compteur qui dit combien de cases sont occupées :

```rust
fn empiler(cases: &mut [u8], valeur: u8, taille: &mut usize) -> bool {
    if *taille == cases.len() {
        return false;
    }
    cases[*taille] = valeur;
    *taille += 1;
    true
}

fn depiler(cases: &mut [u8], taille: &mut usize) -> Option<u8> {
    if *taille == 0 {
        return None;
    }
    *taille -= 1;
    Some(cases[*taille])
}

fn main() {
    let mut cases = [0u8; 3];
    let mut taille = 0;
    let _ = empiler(&mut cases, b'a', &mut taille);
    let _ = empiler(&mut cases, b'b', &mut taille);
    println!("{:?}", depiler(&mut cases, &mut taille));
}
```

Ça marche, tout est sur la pile. Mais trois choses clochent :

- le tableau et sa longueur voyagent **séparément** : rien n'empêche de passer la longueur d'un autre tableau ;
- **trois paramètres** pour une seule idée ;
- l'idée **n'a pas de nom** : ce n'est pas « une pile bornée », c'est « un tableau et un entier qu'on a décidé de garder ensemble ».

> [!tip] Dépiler n'efface rien
> `depiler` recule seulement le compteur : l'octet reste dans le tableau, simplement hors de la zone utilisée.

Donner un nom et une seule place à ces données, c'est le rôle d'une **struct**.

## 2. Déclarer une struct

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
- Une struct vit sur la pile comme n'importe quelle valeur : **aucune allocation**. Sa taille est connue à la compilation.

## 3. Créer et lire une struct

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

## 4. Les trois formes de struct

```rust
struct Point { x: f64, y: f64 }   // champs nommés
struct Metres(f64);               // struct tuple : champs numérotés
struct Marqueur;                  // struct unité : aucun champ, 0 octet
```

Une **struct tuple** a des champs sans nom, numérotés à partir de 0 :

```rust
struct Couleur(u8, u8, u8);

let orange = Couleur(255, 128, 0);
println!("vert = {}", orange.1);   // 128
```

> [!tip] Le motif « newtype »
> `struct Metres(f64)` et `struct Secondes(f64)` contiennent tous les deux un `f64`, mais ce sont **deux types différents** : impossible d'additionner des mètres et des secondes, ou de passer des secondes à une fonction qui attend des mètres. Et ça ne coûte rien : ni octet, ni instruction en plus.

## 5. Méthodes avec `impl`

Les **données** se déclarent dans `struct`, le **comportement** dans un bloc `impl` séparé. On peut écrire plusieurs blocs `impl` pour un même type (c'est comme ça qu'on lui fera implémenter des traits).

Voici la pile bornée du §1, rangée dans une struct :

```rust
struct PileFixe3 {
    cases: [u8; 3],
    taille: u8,
}

impl PileFixe3 {
    fn new() -> Self {
        Self { cases: [0; 3], taille: 0 }
    }

    #[must_use]
    fn empiler(&mut self, valeur: u8) -> bool {
        if self.taille == 3 {
            return false;
        }
        self.cases[self.taille as usize] = valeur;
        self.taille += 1;
        true
    }

    fn depiler(&mut self) -> Option<u8> {
        if self.taille == 0 {
            return None;
        }
        self.taille -= 1;
        Some(self.cases[self.taille as usize])
    }
}

fn main() {
    let mut pile = PileFixe3::new();
    let _ = pile.empiler(b'x');
    println!("{:?}", pile.depiler());   // Some(120), le code de 'x'
}
```

Plus de longueur à passer à la main : elle est **dans** `self`. Sa taille : 3 octets + 1 octet = 4 octets.

> [!info] `#[must_use]`
> Cet **attribut** demande au compilateur un avertissement si on ignore le `bool` renvoyé par `empiler` : on ne peut pas oublier par distraction qu'une pile pleine refuse l'élément. Pour jeter volontairement le résultat : `let _ = pile.empiler(b'x');`.

### Les trois `self` (et l'absence de `self`)

`self` désigne la valeur sur laquelle on appelle la méthode. Le premier paramètre dit ce que la méthode en fait :

| Premier paramètre | Ce que fait la méthode | Après l'appel |
|---|---|---|
| `&self` | **lit** la valeur (emprunt partagé) | toujours utilisable |
| `&mut self` | **modifie** la valeur (emprunt exclusif) | utilisable, mais la variable doit être `mut` |
| `self` | **prend possession** de la valeur (move) | plus utilisable |
| pas de `self` | fonction associée (constructeur…) | s'appelle avec `Type::fonction()` |

Ce sont exactement les trois façons de manipuler une valeur vues au chapitre Ownership : emprunter, emprunter en exclusivité, posséder. Rien de nouveau, juste la même règle appliquée à un objet.

> [!tip] Une méthode n'est qu'une fonction
> `pile.depiler()` et `PileFixe3::depiler(&mut pile)` sont **le même appel**. Le point est un raccourci qui passe la valeur comme premier paramètre.

Un autre exemple avec les trois premiers :

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

> [!tip] Quel choix ?
> Par défaut `&self`. `&mut self` si la méthode change des champs. `self` quand la méthode **transforme** la valeur en autre chose (une commande devient un ticket).

## 6. Fonctions associées et `new`

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

- `Self` (majuscule) = le type du bloc `impl`, ici `Rectangle`. `self` (minuscule) = la valeur.
- `new` n'est **pas** un mot-clé : c'est seulement une convention pour « fabriquer une nouvelle valeur ». Rust n'a pas de constructeur spécial.

## 7. Mesurer : la structure est-elle plus rapide ?

Le cours chronomètre la même boucle (100 millions de fois : 3 empilements, 3 dépilements), compilée en **release** :

| Programme | Temps |
|---|---|
| deux fonctions libres, marquées `#[inline(never)]` | 530 ms |
| la même chose avec un `Vec<u8>` | 172 ms |
| la même chose dans une struct | 66 ms |
| sans `black_box` (et sans `#[inline(never)]`) | 0,73 ms |

Deux conclusions séduisantes… et fausses :

- **0,73 ms**, c'est le temps de lancer un programme **vide**. Sans `std::hint::black_box`, personne ne lit le résultat, donc le compilateur supprime toute la boucle : `main` se réduit à une seule instruction `ret`. Rien n'était observable, donc rien n'avait besoin d'exister.
- **530 contre 66 ms** ne compare pas « fonctions contre struct » : `#[inline(never)]` interdit au compilateur de recopier le corps des fonctions à l'endroit de l'appel (l'**inlining**), ce qui force 600 millions d'appels. Ce qui gagne, c'est l'inlining, pas la struct.

> [!warning] Un chiffre trop beau est suspect
> `black_box(&mut x)` dit au compilateur « quelqu'un pourrait lire `x` » : il doit alors vraiment faire le calcul. Pour vérifier ce qui reste, on lit l'assembleur (`cargo rustc --release -- --emit=asm`).

> [!info] Et le `Vec` ?
> Créé une seule fois avant la boucle, il n'alloue qu'au premier `push` : `pop` ne rend pas la mémoire. Recréé à chaque tour, il allouerait et libérerait 100 millions de fois (environ 1,3 s).

## 8. `derive` : des capacités automatiques

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

## 9. Struct et ownership

Une struct **possède** ses champs : quand la struct disparaît, ses champs aussi. Pour l'instant, utilise `String` (possédé) plutôt que `&str` (emprunté) dans les champs : une référence dans une struct demande des **durées de vie** (lifetimes), vues plus tard.

## 10. Génériques : sur un type et sur une taille

`PileFixe3` ne marche que pour 3 octets. On la rend **générique** sur le type des éléments **et** sur leur nombre :

```rust
struct PileFixe<T, const N: usize> {
    cases: [T; N],
    taille: usize,
}

impl<T, const N: usize> PileFixe<T, N> {
    fn depuis_tableau(cases: [T; N]) -> Self {
        Self { cases, taille: 0 }
    }

    #[must_use]
    fn empiler(&mut self, valeur: T) -> bool {
        if self.taille == N {
            return false;
        }
        self.cases[self.taille] = valeur;
        self.taille += 1;
        true
    }

    fn depiler(&mut self) -> Option<&T> {
        if self.taille == 0 {
            return None;
        }
        self.taille -= 1;
        Some(&self.cases[self.taille])
    }
}

fn main() {
    let mut octets = PileFixe::depuis_tableau([0u8; 3]);
    let mut mots = PileFixe::depuis_tableau([""; 2]);
    let _ = octets.empiler(7);
    let _ = mots.empiler("rouille");
    println!("{:?} {:?}", octets.depiler(), mots.depiler());
}
```

Deux paramètres de nature différente :

- `T` : un **paramètre de type** (n'importe quel type) ;
- `const N: usize` : un **const générique**, une **valeur** connue à la compilation (depuis Rust 1.51).

`PileFixe<u8, 3>` et `PileFixe<f64, 512>` sont **deux types différents**, chacun avec sa taille.

> [!tip] Pourquoi `depuis_tableau` et pas `new` ?
> Pour remplir `[T; N]` tout seul, il faudrait savoir fabriquer un `T` « par défaut ». En recevant le tableau tout fait, la struct marche pour n'importe quel `T`, sans condition.

### Pourquoi `depiler` renvoie `Option<&T>`

Sortir la valeur du tableau y laisserait un **trou**, et `[T; N]` ne sait pas représenter un trou. Le compilateur refuse donc `Some(self.cases[self.taille])` pour un `T` quelconque (erreur E0507, « cannot move out of index »). Trois solutions :

| Solution | Ce qu'on renvoie | Condition |
|---|---|---|
| renvoyer une référence | `Option<&T>` | aucune : marche pour `String` comme pour `u8` |
| copier la valeur | `Option<T>` | ajouter la borne `T: Copy` |
| rendre le trou représentable | `Option<T>` | stocker `[Option<T>; N]` et utiliser `.take()` |

```rust
let mut case = Some(String::from("crabe"));
let sortie = case.take();     // sortie = Some("crabe"), case = None
println!("{sortie:?} {case:?}");
```

`.take()` retire la valeur d'un `Option` et laisse `None` à sa place : le trou existe, il est écrit dans le type. C'est l'ownership qui guide la conception.

### La monomorphisation

Pour chaque combinaison `(T, N)` vraiment utilisée, le compilateur écrit une **version spécialisée** de chaque méthode. C'est la **monomorphisation**.

- **Aucun coût à l'exécution** : `empiler` sur une `PileFixe<u8, 3>` est aussi rapide qu'une fonction écrite à la main pour ce cas (`N` est une constante : le test « pile pleine ? » compare avec un nombre écrit en dur).
- **Le prix se paie à la compilation** : un binaire plus gros et un `cargo build` plus long.

| Langage | Génériques |
|---|---|
| Java | **effacés** : un seul code pour tous les types (`List<Integer>` et `List<String>` sont la même classe) |
| C# | un code partagé pour les types référence, un code par type valeur |
| Rust | **toujours spécialisés** : chaque instanciation a son propre code machine |

C'est la « zero cost abstraction » à la Rust : le coût est déplacé de l'exécution vers la compilation.

## 11. Attention à la pile

Tout ce qui est dans une struct sans `Box` ni `Vec` est sur la pile. Et la pile est **petite** (8 Mo en général) :

```rust
let mut pile = PileFixe::depuis_tableau([0; 10_000_000_000]);
let _ = pile.empiler(42);
println!("{:?}", pile.depiler());
```

```text
thread 'main' has overflowed its stack
fatal runtime error: stack overflow, aborting
```

Dix milliards d'entiers (des `i32` par défaut) : 40 Go pour une pile de 8 Mo.

> [!warning] Ce n'est pas une panique
> Un débordement de pile **arrête net** le processus (`abort`, code de sortie 134) : pas de trace, même avec `RUST_BACKTRACE=full`, et `catch_unwind` ne peut rien rattraper.

Même règle qu'au chapitre 3 : ce qui est **gros**, ou dont la taille dépend de l'exécution, va sur le **tas** (`Box`, `Vec`).

## 12. Lire un fichier… à la compilation

```rust
let texte: &'static str = include_str!("../ressources/donnees.txt");
let octets: &'static [u8] = include_bytes!("../ressources/logo.png");
```

`include_str!` (texte) et `include_bytes!` (octets) **copient le contenu du fichier dans le programme** au moment de la compilation. Le chemin est relatif au fichier `.rs` qui contient la macro.

- Le fichier n'a plus besoin d'exister quand on lance le programme : il est **autonome**.
- Chargé en RAM quand ? Les données font partie de l'exécutable, que le système place en mémoire **à la demande**, au premier accès.
- Libéré quand ? **Jamais** du point de vue du programme : d'où le type `&'static`, une référence valable jusqu'à la fin.

> [!tip] Parfait pour l'Advent of Code
> L'entrée du jour voyage avec le programme, et les tests n'ont pas besoin d'un chemin correct au moment de l'exécution.

Lire un fichier **pendant l'exécution** (`std::fs::read_to_string`) peut échouer : c'est l'occasion de découvrir `Result` et l'opérateur `?`, au chapitre suivant.

## 13. Disposition en mémoire : alignement et `#[repr]`

Combien d'octets pour un `u8`, un `u32` et un `u8` ?

```rust
use std::mem::{align_of, offset_of, size_of};

struct Mixte { a: u8, b: u32, c: u8 }

#[repr(C)]
struct MixteC { a: u8, b: u32, c: u8 }

fn main() {
    println!("Mixte  : {} octets, a={} b={} c={}", size_of::<Mixte>(),
        offset_of!(Mixte, a), offset_of!(Mixte, b), offset_of!(Mixte, c));
    println!("MixteC : {} octets, a={} b={} c={}", size_of::<MixteC>(),
        offset_of!(MixteC, a), offset_of!(MixteC, b), offset_of!(MixteC, c));
    println!("alignement : {}", align_of::<MixteC>());
}
```

```text
Mixte  : 8 octets, a=4 b=0 c=5
MixteC : 12 octets, a=0 b=4 c=8
alignement : 4
```

1 + 4 + 1 = 6 octets de données, mais 8 ou 12 octets occupés : le reste est du **remplissage** (*padding*). Il vient de l'**alignement** :

- chaque type a un alignement (`align_of`) : 1 pour `u8`, 2 pour `u16`, 4 pour `u32`, 8 pour `u64` ;
- une valeur doit commencer à une adresse **multiple** de son alignement : dans `MixteC`, `b` ne peut commencer qu'à l'octet 4, d'où 3 octets vides après `a` ;
- la struct prend l'alignement de son plus grand champ (4) et sa taille en est un **multiple** : 3 octets vides après `c`, pour que les éléments d'un tableau de `MixteC` restent alignés.

Sans attribut, Rust **choisit l'ordre des champs** : ici il place `b` en tête et n'a besoin que de 2 octets de remplissage. Cet ordre n'est **pas garanti** : un programme ne doit jamais le supposer.

> [!info] À quoi sert l'alignement ?
> Le processeur lit la mémoire par blocs alignés (des mots, des lignes de cache de 64 octets). Une valeur alignée se lit en un seul accès ; à cheval sur deux blocs, elle peut en demander deux, et certains processeurs refusent carrément. En Rust, **créer** une référence non alignée est déjà un comportement indéfini.

### Choisir la disposition

| Attribut | Taille | Alignement | Usage |
|---|---|---|---|
| aucun | 8 | 4 | le compilateur choisit l'ordre |
| `#[repr(C)]` | 12 | 4 | ordre et règles du C : appeler du C (FFI), lire un format binaire |
| `#[repr(C, packed)]` | 6 | 1 | aucun remplissage : format de fichier, protocole réseau |
| `#[repr(C, align(64))]` | 64 | 64 | une valeur par ligne de cache (deux threads qui écrivent chacun la leur) |

> [!warning] `packed` et les références
> Dans une struct `packed`, les champs ne sont plus alignés : `&p.b` est refusé (`error[E0793]: reference to field of packed struct is unaligned`). On copie le champ : `let b = p.b;`.

> [!tip] Réduire le remplissage soi-même
> Avec `#[repr(C)]`, l'ordre est celui de la déclaration : ranger les champs **du plus grand alignement au plus petit** supprime la plupart des trous.

## À retenir

- Une struct donne **un nom et une seule place** à des données qui vont ensemble (le tableau et son compteur).
- `struct Nom { champ: Type }` ; `valeur.champ` ; toute la variable est `mut`, jamais un champ seul.
- Struct tuple `struct Metres(f64)` (newtype, gratuit) ; struct unité `struct Marqueur;`.
- `impl` contient les méthodes : `&self` (lire), `&mut self` (modifier), `self` (consommer), rien (fonction associée comme `new`). `x.m()` = `Type::m(&x)`.
- `#[derive(Debug, Clone, PartialEq)]` pour `{:?}`, `.clone()` et `==` ; `#[must_use]` pour ne pas ignorer un résultat.
- Mesurer : `--release`, `black_box`, et se méfier d'un chiffre trop beau.
- `struct S<T, const N: usize>` : générique sur un type et une taille ; **monomorphisé**, donc rapide à l'exécution mais plus long à compiler.
- Sortir une valeur d'un tableau laisse un trou : renvoyer `&T`, exiger `T: Copy`, ou stocker des `Option<T>` et utiliser `.take()`.
- Ce qui est gros va sur le tas : un débordement de pile arrête net le programme.
- `include_str!` / `include_bytes!` : le fichier est copié dans le binaire, en `&'static`.
- Alignement et remplissage : `size_of`, `align_of`, `offset_of!` ; `#[repr(C)]`, `packed`, `align(n)`.
