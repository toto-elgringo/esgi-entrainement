# Traits et génériques

## 1. Un trait : un comportement partagé

Un **trait** est une liste de méthodes qu'un type promet de fournir. C'est l'équivalent d'une **interface** dans d'autres langages. Le trait dit **quoi** (le nom et la signature des méthodes), chaque type dit **comment** (le corps des méthodes).

```rust
trait Instrument {
    fn nom(&self) -> String;
    fn son(&self) -> String;
}

struct Guitare {
    cordes: u32,
}

struct Tambour;

impl Instrument for Guitare {
    fn nom(&self) -> String {
        format!("guitare à {} cordes", self.cordes)
    }

    fn son(&self) -> String {
        "dzing".to_string()
    }
}

impl Instrument for Tambour {
    fn nom(&self) -> String {
        "tambour".to_string()
    }

    fn son(&self) -> String {
        "boum".to_string()
    }
}

fn main() {
    let g = Guitare { cordes: 6 };
    println!("{} : {}", g.nom(), g.son());
    println!("{} : {}", Tambour.nom(), Tambour.son());
}
```

On le lit morceau par morceau :

1. `trait Instrument { ... }` : la liste des méthodes promises. Chaque ligne finit par `;` : pas de corps, seulement la signature.
2. `impl Instrument for Guitare { ... }` se lit « voici comment une `Guitare` est un `Instrument` ». On y écrit **toutes** les méthodes du trait, avec leur corps.
3. `struct Tambour;` est une structure **sans champ** : on crée une valeur simplement en écrivant `Tambour`.
4. Une fois le trait implémenté, on appelle ses méthodes comme des méthodes normales : `g.nom()`. Affichage : `guitare à 6 cordes : dzing` puis `tambour : boum`.

Si un `impl` **oublie** une méthode du trait, le code ne compile pas : erreur **E0046** (« not all trait items implemented, missing: `son` »). Pas de valeur inventée, pas de panique plus tard : le compilateur vérifie la promesse tout de suite.

**À retenir :** `trait` = la liste des méthodes promises ; `impl Trait for Type` = la promesse tenue, avec toutes les méthodes.

### Méthode par défaut

Un trait peut fournir une méthode **déjà écrite** (avec un corps `{ ... }`). Chaque type l'obtient gratuitement, et peut la **remplacer** en écrivant sa propre version dans son `impl`.

Une méthode par défaut peut appeler les autres méthodes du trait avec `self.` : elle ne sait pas encore quel type l'utilisera, mais elle sait que ces méthodes existeront.

**Exemple résolu : quelle version de `decrire` est appelée ?**

```rust
trait Instrument {
    fn nom(&self) -> String;
    fn son(&self) -> String;

    fn decrire(&self) -> String {
        format!("le {} fait {}", self.nom(), self.son())
    }
}

struct Hautbois;
struct Triangle;

impl Instrument for Hautbois {
    fn nom(&self) -> String {
        "hautbois".to_string()
    }

    fn son(&self) -> String {
        "tuuu".to_string()
    }
}

impl Instrument for Triangle {
    fn nom(&self) -> String {
        "triangle".to_string()
    }

    fn son(&self) -> String {
        "ding".to_string()
    }

    fn decrire(&self) -> String {
        format!("le {} fait {}, tout doucement", self.nom(), self.son())
    }
}

fn main() {
    println!("{}", Hautbois.decrire());
    println!("{}", Triangle.decrire());
}
```

| Appel | `decrire` est-il écrit dans l'`impl` du type ? | Version utilisée | Affichage |
|---|---|---|---|
| `Hautbois.decrire()` | non | celle par défaut du trait | `le hautbois fait tuuu` |
| `Triangle.decrire()` | oui | celle de `Triangle` (elle remplace l'autre) | `le triangle fait ding, tout doucement` |

Dans la version par défaut, `self.nom()` appelle le `nom` du **hautbois** : chaque type fournit ses morceaux, la méthode par défaut les assemble. Remplacer une méthode par défaut ne demande rien de spécial (ni `unsafe`, ni `pub`) : il suffit de l'écrire dans le bloc `impl`.

**À retenir :** méthode avec corps dans le trait = version par défaut ; un type la remplace en l'écrivant dans son `impl`.

## 2. `derive` : les traits écrits automatiquement

Pour les traits les plus courants, Rust sait écrire l'implémentation tout seul. On le lui demande avec `#[derive(...)]` juste au-dessus de la structure :

| Trait | Ce qu'il permet | Sans lui, l'erreur dit... |
|---|---|---|
| `Debug` | afficher avec `{:?}` | « `Couleur` doesn't implement `Debug` » |
| `Clone` | copier explicitement avec `.clone()` | « no method named `clone` found » |
| `Copy` | copie automatique, sans `.clone()` (seulement pour les petits types sans tas : pas de `String` ni de `Vec` dedans ; demande aussi `Clone`) | « use of moved value » |
| `PartialEq` / `Eq` | comparer avec `==` et `!=` | « binary operation `==` cannot be applied to type `Couleur` » |
| `PartialOrd` / `Ord` | comparer avec `<`, `>`, trier | « binary operation `<` cannot be applied » |
| `Hash` | servir de clé dans une `HashMap` (avec `Eq`) | |
| `Default` | créer une valeur par défaut avec `Couleur::default()` | « no associated function or constant named `default` found » |

`Default` met chaque champ à **sa** valeur par défaut : `0` pour un nombre, `false` pour un `bool`, `""` pour une `String`, une liste vide pour un `Vec`.

**Exemple résolu : une couleur qu'on peut afficher, copier, comparer et créer par défaut.**

```rust
#[derive(Debug, Clone, PartialEq, Default)]
struct Couleur {
    rouge: u8,
    vert: u8,
    bleu: u8,
}

fn main() {
    let rouge = Couleur { rouge: 255, vert: 0, bleu: 0 };
    let copie = rouge.clone();
    let noir = Couleur::default();
    println!("{:?}", rouge);
    println!("{:?}", noir);
    println!("{} {}", rouge == copie, rouge == noir);
}
```

| Ligne | Trait utilisé | Résultat |
|---|---|---|
| `rouge.clone()` | `Clone` | une deuxième couleur identique |
| `Couleur::default()` | `Default` | tous les champs à 0 |
| `println!("{:?}", rouge)` | `Debug` | `Couleur { rouge: 255, vert: 0, bleu: 0 }` |
| `println!("{:?}", noir)` | `Debug` | `Couleur { rouge: 0, vert: 0, bleu: 0 }` |
| `rouge == copie` / `rouge == noir` | `PartialEq` | `true` (tous les champs égaux) / `false` |

Méthode pour corriger un code qui ne compile pas faute de trait : lis **chaque** erreur, note le trait qu'elle nomme (le `help:` propose souvent `#[derive(...)]`), et mets-les tous dans **une seule** ligne `#[derive(...)]`. Une fois la ligne ajoutée, n'oublie pas les usages que le `main` ne montre pas (par exemple `default()` utilisé ailleurs).

**À retenir :** `{:?}` → `Debug`, `.clone()` → `Clone`, `==` → `PartialEq`, `::default()` → `Default`, tous dans un seul `#[derive(...)]`.

## 3. `Display` : un affichage pour les humains

`{:?}` (Debug) peut être dérivé, mais `{}` (Display) **doit être écrit à la main** : l'affichage pour un humain est un **choix**. Une durée de 90 minutes doit-elle s'afficher `90 min`, `1 h 30` ou `1.5 h` ? Rust ne peut pas le deviner, c'est à toi de décider.

```rust
use std::fmt;

struct Duree {
    minutes: u32,
}

impl fmt::Display for Duree {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} h {:02}", self.minutes / 60, self.minutes % 60)
    }
}

fn main() {
    let film = Duree { minutes: 95 };
    println!("Le film dure {film}");
    let texte: String = film.to_string();
    println!("{} caractères", texte.len());
}
```

1. `use std::fmt;` pour écrire `fmt::Display`, `fmt::Formatter` et `fmt::Result` en version courte.
2. La signature `fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result` est **toujours la même** : recopie-la telle quelle. `f` est l'endroit où l'on écrit le texte.
3. `write!(f, ...)` marche comme `format!`, mais écrit dans `f`. Il renvoie le `fmt::Result` attendu : on le met en **dernière ligne, sans `;`** (avec un `;`, la fonction ne renverrait plus rien : erreur « mismatched types »).
4. Pour 95 minutes : `95 / 60 = 1` (division entière), `95 % 60 = 35` (le reste). `{:02}` écrit le nombre sur 2 chiffres en complétant par des 0 (5 deviendrait `05`). Affichage : `Le film dure 1 h 35`.
5. **Bonus offert :** dès qu'un type implémente `Display`, il obtient la méthode `.to_string()`. Ici `"1 h 35"` fait 6 caractères.

**Exemple résolu : un affichage qui dépend de la valeur.** Le corps de `fmt` est une fonction normale : on peut y mettre un `if`, à condition que **chaque branche** fasse son `write!`.

```rust
use std::fmt;

struct Score {
    points: u32,
}

struct Vitesse {
    kmh: f64,
}

impl fmt::Display for Score {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if self.points <= 1 {
            write!(f, "{} point", self.points)
        } else {
            write!(f, "{} points", self.points)
        }
    }
}

impl fmt::Display for Vitesse {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:.1} km/h", self.kmh)
    }
}

fn main() {
    println!("{} / {}", Score { points: 1 }, Score { points: 12 });
    println!("{} / {}", Vitesse { kmh: 87.46 }, Vitesse { kmh: 90.0 });
}
```

| Valeur | Pas à pas | Affichage |
|---|---|---|
| `Score { points: 1 }` | `1 <= 1` vrai : première branche | `1 point` |
| `Score { points: 12 }` | `12 <= 1` faux : branche `else` | `12 points` |
| `Vitesse { kmh: 87.46 }` | `{:.1}` garde **un** chiffre après la virgule, arrondi : 87,46 → 87,5 | `87.5 km/h` |
| `Vitesse { kmh: 90.0 }` | `{:.1}` écrit toujours ce chiffre, même s'il vaut 0 | `90.0 km/h` |

Le `if` / `else` est la dernière expression de `fmt` : la valeur de la branche choisie (le `write!`) est renvoyée. `{:.2}` garderait deux chiffres, `{:.0}` aucun.

**À retenir :** `impl fmt::Display for Type`, la signature recopiée, un `write!(f, ...)` sans `;` dans chaque branche ; `{:.1}` pour un chiffre après la virgule ; `to_string()` offert.

## 4. Les génériques : un code pour plusieurs types

Sans générique, il faudrait une fonction par type :

```rust
fn plus_petit_i32(a: i32, b: i32) -> i32 {
    if a < b { a } else { b }
}

fn plus_petit_f64(a: f64, b: f64) -> f64 {
    if a < b { a } else { b }
}

fn main() {
    println!("{} {}", plus_petit_i32(3, 7), plus_petit_f64(2.5, 1.5));
}
```

Le code est le même, seul le type change. Avec un **paramètre de type** `T`, on l'écrit une seule fois :

```rust
fn plus_petit<T: PartialOrd>(a: T, b: T) -> T {
    if a < b { a } else { b }
}

fn main() {
    println!("{}", plus_petit(3, 7));
    println!("{}", plus_petit(2.5, 1.5));
    println!("{}", plus_petit("kiwi", "abricot"));
    println!("{}", plus_petit('m', 'c'));
}
```

On lit la signature morceau par morceau :

1. `<T: PartialOrd>` juste après le nom : « cette fonction a un paramètre de type nommé `T` ». `T` sera remplacé par un vrai type à chaque appel.
2. `: PartialOrd` est une **contrainte** (*trait bound*) : « `T` peut être n'importe quel type, **à condition** qu'il sache se comparer avec `<` et `>` ». Ce n'est pas « `T` doit être un nombre » : du texte ou des lettres se comparent aussi.
3. `(a: T, b: T) -> T` : `a` et `b` ont **le même** type `T`, et la fonction renvoie ce type. `plus_petit(3, 2.5)` est donc refusé (un entier et un décimal).

| Appel | `T` vaut | Comparaison | Résultat |
|---|---|---|---|
| `plus_petit(3, 7)` | `i32` | 3 < 7 | `3` |
| `plus_petit(2.5, 1.5)` | `f64` | 2.5 < 1.5 est faux | `1.5` |
| `plus_petit("kiwi", "abricot")` | `&str` | ordre alphabétique : « a » vient avant « k » | `abricot` |
| `plus_petit('m', 'c')` | `char` | ordre de l'alphabet | `c` |

**Sans la contrainte**, `fn plus_petit<T>(a: T, b: T)` ne compile pas : erreur E0369 « binary operation `<` cannot be applied to type `T` », avec le conseil « consider restricting type parameter `T` with trait `PartialOrd` ». Le compilateur refuse de supposer que **n'importe quel** type sait se comparer : il faut le promettre.

**À retenir :** pour rendre une fonction générique, remplace le type par `T`, puis ajoute les contraintes dont le corps a besoin (`<` ou `>` → `PartialOrd`).

### Plusieurs contraintes, `Copy` et `?`

On combine des contraintes avec `+` : `T: PartialOrd + Copy`. `Copy` sert quand on veut **copier** des éléments hors d'une tranche avec `*x` ou le motif `&x` (sans `Copy`, on ne peut pas sortir un élément d'une liste empruntée).

**Exemple résolu : compter les éléments au-dessus d'un seuil, et prendre les deux premiers éléments.**

```rust
fn compter_au_dessus<T: PartialOrd + Copy>(liste: &[T], seuil: T) -> usize {
    let mut total = 0;
    for &x in liste {
        if x > seuil {
            total += 1;
        }
    }
    total
}

fn deux_premiers<T: Copy>(liste: &[T]) -> Option<(T, T)> {
    let a = *liste.first()?;
    let b = *liste.get(1)?;
    Some((a, b))
}

fn main() {
    println!("{}", compter_au_dessus(&[4, 12, 9, 15], 10));
    println!("{}", compter_au_dessus(&['a', 'z', 'q'], 'p'));
    println!("{:?}", deux_premiers(&[2.5, 8.0, 1.0]));
    println!("{:?}", deux_premiers(&['x']));
}
```

1. `for &x in liste` : la boucle donne des `&T`, le motif `&x` copie l'élément dans `x`. C'est permis parce que `T: Copy`.
2. `compter_au_dessus(&[4, 12, 9, 15], 10)` : 4 non, 12 oui, 9 non, 15 oui → `2`. Avec des lettres et le seuil `'p'` : `'a'` non, `'z'` oui, `'q'` oui → `2`.
3. `liste.first()?` : `first()` renvoie une `Option<&T>`. Le `?` veut dire « si c'est `None`, la fonction renvoie `None` **tout de suite** ; sinon, prends la valeur ». L'étoile copie ensuite l'élément (encore grâce à `Copy`).
4. `deux_premiers(&[2.5, 8.0, 1.0])` : `first()` donne `Some(&2.5)`, `get(1)` donne `Some(&8.0)` → `Some((2.5, 8.0))`. Avec `['x']`, `get(1)` vaut `None` : le `?` arrête la fonction, qui renvoie `None`.

Le `?` ne marche que dans une fonction qui renvoie elle-même une `Option` (ou un `Result`).

**À retenir :** `+` pour cumuler les contraintes ; `Copy` pour copier les éléments avec `*` ou `&x` ; `?` sur une `Option` pour renvoyer `None` dès qu'il manque quelque chose.

### `where` : des contraintes plus lisibles

Quand les contraintes deviennent longues, on les écrit après la signature, dans une clause `where`. C'est **exactement** la même chose, en plus lisible.

```rust
use std::fmt::{Debug, Display};

fn etiquette<T, U>(titre: T, detail: U) -> String
where
    T: Display,
    U: Debug,
{
    format!("[{titre}] {detail:?}")
}

fn main() {
    println!("{}", etiquette("Stock", vec![3, 4]));
    println!("{}", etiquette(42, Some('a')));
}
```

| Écriture dans les `< >` | Écriture avec `where` |
|---|---|
| `fn etiquette<T: Display, U: Debug>(titre: T, detail: U) -> String` | `fn etiquette<T, U>(titre: T, detail: U) -> String where T: Display, U: Debug` |

Ici `T` et `U` sont **deux** paramètres de type : `titre` et `detail` peuvent avoir des types différents. Affichage : `[Stock] [3, 4]` puis `[42] Some('a')`. Attention, `where` n'a rien à voir avec un endroit, une erreur ou une boucle : il ne sert qu'aux contraintes.

**À retenir :** `where T: Trait, U: Autre` = les mêmes contraintes qu'entre `< >`, rangées après la signature.

### Structures génériques

Une structure peut aussi avoir un paramètre de type : `Boite<i32>`, `Boite<String>`... Le bloc de méthodes s'écrit alors `impl<T> Boite<T>` (on annonce `T` après `impl`, puis on l'utilise dans `Boite<T>`).

```rust
use std::fmt::Display;

struct Boite<T> {
    contenu: T,
}

impl<T> Boite<T> {
    fn new(contenu: T) -> Self {
        Boite { contenu }
    }

    fn regarder(&self) -> &T {
        &self.contenu
    }

    fn ouvrir(self) -> T {
        self.contenu
    }
}

impl<T: Display> Boite<T> {
    fn etiquette(&self) -> String {
        format!("boîte contenant {}", self.contenu)
    }
}

fn main() {
    let b = Boite::new(7);
    println!("{} / {}", b.regarder(), b.etiquette());
    let n: i32 = b.ouvrir();
    println!("{n}");

    let liste = Boite::new(vec![1, 2]);
    println!("{:?}", liste.regarder());
}
```

1. `Self` dans `fn new(...) -> Self` veut dire « le type en train d'être décrit », ici `Boite<T>`.
2. `Boite::new(7)` : Rust devine `T = i32`. `regarder` renvoie une référence `&T` (on regarde sans prendre), `ouvrir(self)` **consomme** la boîte et rend le contenu.
3. Le second bloc `impl<T: Display> Boite<T>` ajoute `etiquette` **seulement** pour les boîtes dont le contenu sait s'afficher avec `{}`. `b.etiquette()` marche (`i32` implémente `Display`) ; `liste.etiquette()` serait refusé, car un `Vec` n'implémente pas `Display`, mais `regarder` reste disponible pour lui.
4. Affichage : `7 / boîte contenant 7`, `7`, `[1, 2]`.

Pour transformer une liste d'éléments affichables en un seul texte, on convertit chacun avec `to_string()`, on range dans un `Vec<String>`, puis `join` colle les morceaux avec un séparateur :

```rust
let notes = [12, 8, 15];
let texte = notes.iter().map(|n| n.to_string()).collect::<Vec<String>>().join(" - ");
println!("{texte}");
```

Affichage : `12 - 8 - 15`. Sur une liste vide, `join` donne un texte vide `""`.

> [!info] Zéro coût
> Le compilateur crée une copie de la fonction (ou de la structure) pour chaque type utilisé : `plus_petit::<i32>`, `plus_petit::<f64>`... C'est la **monomorphisation**. Aucun coût à l'exécution, mais un programme un peu plus gros.

**À retenir :** `struct Nom<T>` + `impl<T> Nom<T>` pour les méthodes de tous les types, `impl<T: Trait> Nom<T>` pour des méthodes réservées à certains types.

## 5. `impl Trait` : « n'importe quel type qui... »

En **paramètre**, `impl Trait` est un raccourci d'un générique avec contrainte :

| Raccourci | Version longue équivalente |
|---|---|
| `fn presenter(i: &impl Instrument) -> String` | `fn presenter<T: Instrument>(i: &T) -> String` |

En **retour**, `fn creer() -> impl Instrument` veut dire « je renvoie une valeur d'un type qui implémente `Instrument`, sans dire lequel ». Le type exact est caché à l'appelant, qui ne peut utiliser que les méthodes du trait.

**Exemple résolu.**

```rust
trait Instrument {
    fn nom(&self) -> String;
}

struct Piano {
    touches: u32,
}

struct Harpe;

impl Instrument for Piano {
    fn nom(&self) -> String {
        format!("piano ({} touches)", self.touches)
    }
}

impl Instrument for Harpe {
    fn nom(&self) -> String {
        "harpe".to_string()
    }
}

fn presenter(i: &impl Instrument) -> String {
    format!("Sur scène : {}", i.nom())
}

fn noms<T>(liste: &[T]) -> Vec<String>
where
    T: Instrument,
{
    liste.iter().map(|i| i.nom()).collect()
}

fn instrument_du_jour() -> impl Instrument {
    Piano { touches: 88 }
}

fn main() {
    println!("{}", presenter(&Harpe));
    println!("{}", presenter(&Piano { touches: 61 }));
    println!("{:?}", noms(&[Harpe, Harpe]));
    println!("{}", instrument_du_jour().nom());
}
```

1. `presenter` accepte une harpe **et** un piano : `impl Instrument` = « n'importe quel type qui implémente `Instrument` ». Dans le corps, on ne peut appeler que les méthodes du trait (`i.nom()`).
2. `noms` est générique avec `where` : une tranche de `T`, tous du **même** type. On en fait une liste de noms avec `iter().map(...).collect()`. `noms(&[Harpe, Harpe])` → `["harpe", "harpe"]`.
3. `instrument_du_jour()` renvoie un `Piano`, mais l'appelant voit seulement « un `Instrument` » : il appelle `.nom()` → `piano (88 touches)`.

Limite : une fonction `-> impl Instrument` renvoie **un seul** type concret. Renvoyer un `Piano` dans un `if` et une `Harpe` dans le `else` est refusé (« `if` and `else` have incompatible types ») : pour ça, il faut `Box<dyn Instrument>`.

Erreur fréquente : `fn presenter(i: &Instrument)` sans `impl` ni `dyn`. Depuis l'édition 2021, c'est refusé (« expected a type, found a trait ») : un trait n'est pas un type, il faut écrire `&impl Instrument` ou `&dyn Instrument`.

**À retenir :** `impl Trait` en paramètre = « n'importe quel type qui implémente le trait » ; en retour = « un type caché qui l'implémente ».

## 6. `Box<dyn Trait>` : mélanger plusieurs types

Un `Vec` ne contient qu'**un seul type** : tous ses éléments doivent avoir la même taille en mémoire. Un piano et une harpe sont deux types différents, de tailles différentes. Pour les ranger ensemble, on range des **boîtes** :

- `Box::new(valeur)` place la valeur sur le tas ; la boîte elle-même (une adresse) a toujours la même taille.
- `dyn Instrument` veut dire « une valeur d'un type quelconque qui implémente `Instrument` ».
- `Box<dyn Instrument>` est donc un type **unique**, commun au piano et à la harpe.

**Exemple résolu : qui joue quoi ?**

```rust
trait Instrument {
    fn nom(&self) -> String;
    fn son(&self) -> String;
}

struct Piano;
struct Harpe;
struct Cloche {
    notes: u32,
}

impl Instrument for Piano {
    fn nom(&self) -> String {
        "piano".to_string()
    }

    fn son(&self) -> String {
        "plink".to_string()
    }
}

impl Instrument for Harpe {
    fn nom(&self) -> String {
        "harpe".to_string()
    }

    fn son(&self) -> String {
        "glissando".to_string()
    }
}

impl Instrument for Cloche {
    fn nom(&self) -> String {
        format!("cloche à {} notes", self.notes)
    }

    fn son(&self) -> String {
        "dong".to_string()
    }
}

fn concert(orchestre: &[Box<dyn Instrument>]) -> Vec<String> {
    orchestre.iter().map(|i| format!("{} : {}", i.nom(), i.son())).collect()
}

fn main() {
    let orchestre: Vec<Box<dyn Instrument>> = vec![
        Box::new(Piano),
        Box::new(Harpe),
        Box::new(Cloche { notes: 3 }),
    ];
    for ligne in concert(&orchestre) {
        println!("{ligne}");
    }
    println!("{} instruments", orchestre.len());
}
```

1. Le type de la liste s'écrit en entier : `Vec<Box<dyn Instrument>>`. Chaque élément est mis en boîte avec `Box::new(...)`.
2. `concert` reçoit `&[Box<dyn Instrument>]` : une tranche de boîtes, comme `&[i32]` pour des nombres.
3. Dans `map`, `i` est une boîte. On appelle `i.nom()` directement : Rust ouvre la boîte tout seul.
4. Pour chaque boîte, le programme regarde **à l'exécution** quel est le vrai type dedans, et appelle sa méthode : `piano : plink`, `harpe : glissando`, `cloche à 3 notes : dong`. Puis `3 instruments`.
5. Ajouter un nouvel instrument ne demande pas de toucher à `concert` : il suffit d'écrire son `impl` et de le mettre en boîte dans la liste.

`Vec<Instrument>` est refusé (un trait n'est pas un type) ; `Vec<impl Instrument>` aussi (`impl Trait` n'est permis qu'en paramètre ou en retour de fonction, et désignerait de toute façon **un seul** type).

| | Générique `<T: Instrument>` / `impl Instrument` | `Box<dyn Instrument>` |
|---|---|---|
| Choix de la méthode | à la **compilation** (monomorphisation) | à l'**exécution** (on regarde le vrai type) |
| Plusieurs types mélangés dans une liste | non | oui |
| Coût | aucun | une petite indirection (aller chercher la bonne méthode) |

> [!tip] Lequel choisir ?
> Par défaut, les génériques. `dyn` quand il faut **mélanger** des types différents dans une même collection.

**À retenir :** pour une liste de types différents qui partagent un trait, `Vec<Box<dyn Trait>>` et `Box::new(...)` pour chaque élément.

### Additionner et comparer des `f64`

Les méthodes d'un trait renvoient souvent des `f64` (une aire, un prix, un poids). Deux outils servent souvent :

- `iter().map(|x| x.methode()).sum()` additionne les résultats (le type de retour `f64` de la fonction indique le type de la somme).
- `max()` **ne marche pas** sur des `f64` : à cause de `NaN` (« pas un nombre », par exemple `0.0 / 0.0`), deux `f64` ne sont pas toujours comparables, et `max` exige un ordre complet (erreur « the trait bound `f64: Ord` is not satisfied »). On utilise `max_by` avec `total_cmp`, qui compare quand même deux `f64`.

**Exemple résolu.**

```rust
use std::f64::consts::PI;

fn main() {
    let rayons = [1.0, 2.5, 0.5];
    let total: f64 = rayons.iter().map(|r| PI * r * r).sum();
    println!("{total:.2}");

    let plus_grand = rayons.iter().max_by(|a, b| a.total_cmp(b));
    println!("{:?}", plus_grand);

    let en_texte: Option<String> = plus_grand.map(|r| format!("rayon {r}"));
    println!("{:?}", en_texte);

    let vide: [f64; 0] = [];
    println!("{:?}", vide.iter().max_by(|a, b| a.total_cmp(b)));
}
```

1. `PI` vient de `std::f64::consts::PI`. Aires : π × 1 ≈ 3,14, π × 6,25 ≈ 19,63, π × 0,25 ≈ 0,79. Somme ≈ 23,56, affichée `23.56` avec `{:.2}`.
2. `max_by(|a, b| a.total_cmp(b))` : on donne à `max_by` la façon de comparer deux éléments. Résultat : `Some(2.5)` (une `Option`, car la liste pourrait être vide).
3. `Option::map` transforme la valeur **dans** l'`Option` : `Some(2.5)` devient `Some("rayon 2.5")`, et un `None` resterait `None`.
4. Sur la liste vide : `None`.

Avec une liste de boîtes, on compare le résultat d'une méthode : `max_by(|a, b| a.taille().total_cmp(&b.taille()))` (le `&` car `total_cmp` attend une référence).

**À retenir :** somme de `f64` avec `sum()`, maximum de `f64` avec `max_by(... total_cmp ...)`, et `.map(...)` pour transformer le `Some` obtenu.

## À retenir

- `trait` = liste de méthodes ; `impl Trait for Type` = la promesse tenue (méthode oubliée → E0046).
- Une méthode par défaut (avec corps dans le trait) peut être remplacée par chaque type dans son `impl`.
- `#[derive(Debug, Clone, PartialEq, Default)]` écrit les traits courants à ta place : `{:?}`, `.clone()`, `==`, `::default()`.
- `impl fmt::Display` pour afficher avec `{}` (avec `write!` et `{:.1}`), et `to_string()` est offert. `Display` ne se dérive pas.
- `fn f<T: Trait>(x: T)` : générique avec contrainte ; `+` pour en cumuler ; `where` pour les longues contraintes.
- `struct S<T>` + `impl<T> S<T>` ; `impl<T: Display> S<T>` pour des méthodes réservées.
- `impl Trait` en paramètre (= générique) ou en retour (type caché, un seul).
- `Vec<Box<dyn Trait>>` pour mélanger plusieurs types ; la méthode est choisie à l'exécution. Les génériques, eux, sont résolus à la compilation (monomorphisation).
