# Traits avancés

Le chapitre « Traits et génériques » a montré les bases : écrire un trait, l'implémenter, `derive`, `Display`. Ici, on va plus loin : les outils que la bibliothèque standard utilise partout.

Rappel express : un **trait** est une liste de méthodes qu'un type promet d'avoir. `impl MonTrait for MonType { ... }` écrit ces méthodes pour ce type. Tout ce chapitre repose sur cette idée.

## 1. Types associés

Un **type associé** est un type que chaque implémentation choisit. On le déclare dans le trait avec `type Nom;`, et chaque `impl` le remplit avec `type Nom = UnVraiType;`.

L'exemple le plus célèbre est `Iterator`. Sa définition (simplifiée) est :

```text
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

- `type Item;` : « le type des éléments produits », laissé vide.
- `Self::Item` : « le `Item` choisi par le type qui implémente le trait ».
- `next` renvoie `Some(valeur)` tant qu'il reste quelque chose, puis `None` pour dire « fini ».

**Exemple résolu : un itérateur qui avance par sauts.** `Saut::new(0, 10, 3)` doit produire `0, 3, 6, 9`, puis s'arrêter (12 dépasserait 10).

```rust
struct Saut {
    actuel: u32,
    fin: u32,
    pas: u32,
}

impl Saut {
    fn new(debut: u32, fin: u32, pas: u32) -> Saut {
        Saut { actuel: debut, fin, pas }
    }
}

impl Iterator for Saut {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.actuel > self.fin {
            None
        } else {
            let valeur = self.actuel;
            self.actuel += self.pas;
            Some(valeur)
        }
    }
}

fn main() {
    let valeurs: Vec<u32> = Saut::new(0, 10, 3).collect();
    println!("{:?}", valeurs);
    let somme: u32 = Saut::new(1, 9, 4).map(|n| n * 10).sum();
    println!("{}", somme);
    println!("{}", Saut::new(5, 2, 1).count());
}
```

On suit chaque appel à `next` pour `Saut::new(0, 10, 3)` :

| Appel | `actuel` avant | `actuel > fin` ? | Renvoie | `actuel` après |
|---|---|---|---|---|
| 1 | 0 | non | `Some(0)` | 3 |
| 2 | 3 | non | `Some(3)` | 6 |
| 3 | 6 | non | `Some(6)` | 9 |
| 4 | 9 | non | `Some(9)` | 12 |
| 5 | 12 | oui | `None` | 12 |

`collect` appelle `next` jusqu'au premier `None` : on obtient `[0, 3, 6, 9]`.

- Ligne 2 : `Saut::new(1, 9, 4)` produit `1, 5, 9`, `map` les multiplie par 10 (`10, 50, 90`), `sum` donne `150`.
- Ligne 3 : `Saut::new(5, 2, 1)` commence déjà après la fin : le tout premier `next` renvoie `None`, donc `count()` vaut `0`.

Le point délicat est l'ordre : on **garde** la valeur actuelle dans une variable, **puis** on avance l'état, **puis** on renvoie la valeur gardée. Si on avançait d'abord, le premier élément (0) serait perdu.

Tu écris seulement `next`. Tous les autres outils (`map`, `filter`, `sum`, `count`, `take`, `collect`...) arrivent gratuitement : ce sont des méthodes par défaut du trait `Iterator`, écrites une fois pour toutes à partir de `next`.

### Un itérateur qui ne s'arrête jamais

Rien n'oblige `next` à renvoyer un jour `None`. Un itérateur **infini** renvoie toujours `Some(...)`. On le coupe à l'utilisation avec `take(n)`, qui ne demande que les `n` premiers éléments.

**Exemple résolu : les puissances de 3** (`1, 3, 9, 27, ...`).

```rust
struct Puissances {
    courante: u64,
}

impl Iterator for Puissances {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let valeur = self.courante;
        self.courante *= 3;
        Some(valeur)
    }
}

fn main() {
    let debut: Vec<u64> = Puissances { courante: 1 }.take(5).collect();
    println!("{:?}", debut);
}
```

| Appel | `courante` avant | Renvoie | `courante` après |
|---|---|---|---|
| 1 | 1 | `Some(1)` | 3 |
| 2 | 3 | `Some(3)` | 9 |
| 3 | 9 | `Some(9)` | 27 |
| 4 | 27 | `Some(27)` | 81 |
| 5 | 81 | `Some(81)` | 243 |

`take(5)` s'arrête après 5 éléments : `[1, 3, 9, 27, 81]`. Sans `take`, `collect` tournerait sans fin.

Quand l'état a **deux** nombres qui dépendent l'un de l'autre (le suivant se calcule à partir des deux précédents), garde d'abord la valeur à renvoyer dans une variable, puis mets à jour les deux champs l'un après l'autre en utilisant cette variable : sinon tu écrases une valeur dont tu as encore besoin.

**À retenir :** dans `next`, garde la valeur à renvoyer, fais avancer l'état, renvoie `Some(valeur)` ; `None` quand c'est fini (ou jamais, pour un itérateur infini qu'on coupe avec `take`).

### Type associé ou générique ?

```rust
trait Conteneur {
    type Element;
    fn premier(&self) -> Option<&Self::Element>;
}

trait Convertir<T> {
    fn convertir(&self) -> T;
}
```

- **Type associé** : une seule implémentation par type. On n'a rien à préciser à l'appel.
- **Générique** (`Convertir<T>`) : un même type peut l'implémenter plusieurs fois, avec des `T` différents. C'est le cas de `From<i32>` et `From<f64>`.

**Exemple résolu : un même type, deux conversions.**

```rust
trait Convertir<T> {
    fn convertir(&self) -> T;
}

struct Age(u32);

impl Convertir<String> for Age {
    fn convertir(&self) -> String {
        format!("{} ans", self.0)
    }
}

impl Convertir<f64> for Age {
    fn convertir(&self) -> f64 {
        self.0 as f64
    }
}

fn main() {
    let a = Age(20);
    let texte: String = a.convertir();
    let nombre: f64 = a.convertir();
    println!("{} / {}", texte, nombre + 0.5);
}
```

1. `Convertir<String>` et `Convertir<f64>` sont, pour Rust, **deux traits différents** : `Age` peut implémenter les deux.
2. À l'appel `a.convertir()`, Rust doit savoir lequel prendre : c'est l'annotation `: String` ou `: f64` qui choisit.
3. Avec un type associé (`trait Convertir { type Sortie; ... }`), `Age` n'aurait pu choisir **qu'une seule** `Sortie` : un deuxième `impl Convertir for Age` serait refusé (« conflicting implementations »).

En échange, le type associé évite les annotations : pour un itérateur, `Item` est unique, donc `iter.next()` n'a jamais besoin qu'on précise le type.

> [!tip] Règle simple
> Si un type n'a qu'un seul choix logique (les éléments d'un itérateur), prends un type associé. S'il peut y en avoir plusieurs (convertir vers plusieurs types), prends un générique.

**À retenir :** type associé = un seul choix par type, rien à préciser à l'appel ; générique = plusieurs `impl` possibles, on choisit à l'appel.

## 2. Surcharge d'opérateurs

Chaque opérateur est relié à un trait de `std::ops`. Écrire `a + b`, c'est en réalité appeler `a.add(b)` : si ton type implémente `Add`, le `+` marche sur lui.

| Opérateur | Trait | Méthode appelée |
|---|---|---|
| `a + b` | `Add` | `a.add(b)` |
| `a - b` | `Sub` | `a.sub(b)` |
| `a * b` | `Mul` | `a.mul(b)` |
| `a / b` | `Div` | `a.div(b)` |
| `-a` | `Neg` | `a.neg()` |
| `a[i]` | `Index` / `IndexMut` | `a.index(i)` / `a.index_mut(i)` |
| `a += b` | `AddAssign` | `a.add_assign(b)` |

Ces traits sont dans `std::ops` : il faut les importer (`use std::ops::{Add, Neg};`). Ils n'ont rien à voir avec `std::fmt` (affichage) ni avec `Sum` (qui sert à `iter.sum()`).

```rust
use std::ops::{Add, Neg};

#[derive(Debug, Clone, Copy, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;

    fn add(self, autre: Point) -> Point {
        Point { x: self.x + autre.x, y: self.y + autre.y }
    }
}

impl Neg for Point {
    type Output = Point;

    fn neg(self) -> Point {
        Point { x: -self.x, y: -self.y }
    }
}

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = Point { x: 10, y: 20 };
    println!("{:?}", a + b);
    println!("{:?}", -a);
}
```

`Output` est un type associé : le type du résultat. Il peut être différent de `Self`.

**Pas à pas de `a + b`** avec `a = (1, 2)` et `b = (10, 20)` :

1. Rust traduit `a + b` en `a.add(b)` : dans `add`, `self` vaut `a` et `autre` vaut `b`.
2. `x` : `self.x + autre.x` = `1 + 10` = `11`.
3. `y` : `self.y + autre.y` = `2 + 20` = `22`.
4. Résultat : `Point { x: 11, y: 22 }`, du type `Output` (ici `Point`).

Pour `-a`, il n'y a qu'un seul opérande : `neg` reçoit seulement `self` et change le signe de chaque champ, `(1, 2)` donne `(-1, -2)`. La soustraction `Sub` s'écrit exactement comme `Add`, avec `-` à la place de `+` : attention à l'ordre, `a - b` calcule `self - autre` avec `self = a`.

**À retenir :** un opérateur = un trait de `std::ops` ; dans la méthode, `self` est l'opérande de gauche, l'argument celui de droite, et `type Output` dit ce qu'on renvoie.

### Additionner des types différents

`Add` a un paramètre par défaut : `trait Add<Rhs = Self>` (`Rhs` = *right hand side*, l'opérande de droite). Sans précision, on additionne deux valeurs du même type. On peut choisir autre chose :

```rust
use std::ops::Mul;

#[derive(Debug, Clone, Copy)]
struct Vitesse {
    kmh: f64,
}

impl Mul<f64> for Vitesse {
    type Output = Vitesse;

    fn mul(self, k: f64) -> Vitesse {
        Vitesse { kmh: self.kmh * k }
    }
}

fn main() {
    let v = Vitesse { kmh: 45.0 };
    println!("{:?}", v * 1.5);
}
```

**Pas à pas de `v * 1.5` :**

1. Le type de gauche est `Vitesse`, celui de droite `f64` : Rust cherche `impl Mul<f64> for Vitesse`. Il existe.
2. `mul(self, k)` reçoit `self = v` et `k = 1.5`.
3. `45.0 * 1.5 = 67.5` : on obtient `Vitesse { kmh: 67.5 }`.

Piège : `1.5 * v` ne compile **pas**. Le type de gauche est alors `f64`, il faudrait `impl Mul<Vitesse> for f64`. L'ordre des opérandes compte.

**À retenir :** `impl Mul<D> for G` rend possible `g * d` avec `g` de type `G` à gauche et `d` de type `D` à droite, et seulement dans cet ordre.

### Indexer avec `[]`

`Index` sert à **lire** avec `t[i]`, `IndexMut` à **écrire** (`t[i] = ...`, `t[i] += ...`). Deux points importants :

- `index` renvoie une **référence** (`&Self::Output`), pas une copie. Rust ajoute lui-même le `*` : `t[i]` vaut donc directement la valeur.
- `IndexMut` a `Index` comme supertrait (section 3) : il réutilise son `Output`, donc il faut implémenter `Index` d'abord, et il n'y a pas de `type Output` dans l'`impl IndexMut`.

```rust
use std::ops::{Index, IndexMut};

struct Tableau {
    valeurs: Vec<i32>,
}

impl Index<usize> for Tableau {
    type Output = i32;

    fn index(&self, i: usize) -> &i32 {
        &self.valeurs[i]
    }
}

impl IndexMut<usize> for Tableau {
    fn index_mut(&mut self, i: usize) -> &mut i32 {
        &mut self.valeurs[i]
    }
}

fn main() {
    let mut t = Tableau { valeurs: vec![1, 2, 3] };
    t[1] = 20;
    println!("{}", t[0] + t[1]);
}
```

**Pas à pas :**

1. `t[1] = 20` est une écriture : Rust appelle `index_mut(1)`, qui renvoie `&mut self.valeurs[1]`, et y range `20`. `valeurs` devient `[1, 20, 3]`.
2. `t[0] + t[1]` est une lecture : Rust appelle `index(0)` puis `index(1)`, qui donnent `1` et `20`. Affiché : `21`.
3. `t[i] += 5` serait une écriture aussi : lecture et modification de la même case, donc `index_mut`.

### Un index en deux dimensions

Le paramètre de `Index` peut être n'importe quel type, par exemple un couple `(usize, usize)`. On s'en sert pour un plateau rangé dans un seul `Vec`, **ligne après ligne**.

Pour un plateau de `largeur` 4 et `hauteur` 2, les cases sont rangées ainsi :

| | colonne 0 | colonne 1 | colonne 2 | colonne 3 |
|---|---|---|---|---|
| ligne 0 | position 0 | 1 | 2 | 3 |
| ligne 1 | position 4 | 5 | 6 | 7 |

Chaque ligne complète fait passer `largeur` cases. Donc la case `(ligne, colonne)` est à la position `ligne * largeur + colonne`. Vérification : `(1, 2)` donne `1 * 4 + 2 = 6`, c'est bien la bonne case du tableau ci-dessus.

Une case comme `(0, 5)` donnerait la position `5`, qui existe dans le `Vec`... mais c'est en réalité la case `(1, 1)` ! Il faut donc vérifier **les deux** coordonnées soi-même avec `assert!(condition, "message")`, qui fait paniquer le programme si la condition est fausse.

```rust
use std::ops::Index;

struct Plateau {
    largeur: usize,
    hauteur: usize,
    cases: Vec<char>,
}

impl Index<(usize, usize)> for Plateau {
    type Output = char;

    fn index(&self, (ligne, colonne): (usize, usize)) -> &char {
        assert!(ligne < self.hauteur, "ligne hors du plateau");
        assert!(colonne < self.largeur, "colonne hors du plateau");
        &self.cases[ligne * self.largeur + colonne]
    }
}

fn main() {
    let p = Plateau { largeur: 4, hauteur: 2, cases: "abcdefgh".chars().collect() };
    println!("{} {} {}", p[(0, 0)], p[(0, 3)], p[(1, 2)]);
}
```

`p[(1, 2)]` : les deux `assert!` passent (`1 < 2`, `2 < 4`), la position vaut `1 * 4 + 2 = 6`, et la lettre n° 6 de `"abcdefgh"` (en comptant depuis 0) est `g`. Affiché : `a d g`.

Le paramètre `(ligne, colonne): (usize, usize)` découpe le couple directement dans la signature. `IndexMut` se construit pareil, avec `&mut self` et `&mut self.cases[...]` ; une petite méthode privée qui calcule et vérifie la position évite d'écrire le calcul deux fois.

**À retenir :** `Index` pour lire, `IndexMut` (qui exige `Index`) pour écrire ; en deux dimensions, position = `ligne * largeur + colonne`, après avoir vérifié chaque coordonnée.

> [!warning] Piège : valeurs déplacées
> `a + b` **consomme** `a` et `b` (ils sont déplacés). Pour continuer à les utiliser, le type doit être `Copy`, ou on implémente `Add` pour `&Point`.

C'est pour ça que `Point` a `#[derive(Clone, Copy)]` : dans le `main` plus haut, `a` est utilisé dans `a + b` puis encore dans `-a`. Sans `Copy`, la deuxième ligne donnerait « use of moved value: `a` ».

## 3. Supertraits

Un trait peut en exiger un autre : c'est un **supertrait**. `trait Article: fmt::Display` se lit « pour être un `Article`, il faut **d'abord** être `Display` ». Ce n'est pas un héritage de champs : c'est une **condition**.

```rust
use std::fmt;

trait Article: fmt::Display {
    fn prix(&self) -> f64;

    fn etiquette(&self) -> String {
        format!("{} : {:.2} €", self, self.prix())
    }
}

struct Livre {
    titre: String,
}

impl fmt::Display for Livre {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Livre {}", self.titre)
    }
}

impl Article for Livre {
    fn prix(&self) -> f64 {
        29.9
    }
}

fn main() {
    let l = Livre { titre: "Rust".to_string() };
    println!("{}", l.etiquette());
}
```

Grâce à `: fmt::Display`, la méthode par défaut peut écrire `{}` sur `self`. Sans l'`impl Display`, `impl Article for Livre` ne compile pas.

**Pas à pas de `l.etiquette()` :**

1. `Livre` n'écrit pas `etiquette` : c'est la méthode **par défaut** du trait qui est utilisée.
2. `{}` avec `self` appelle le `fmt` de `Display` pour `Livre` : `write!(f, "Livre {}", self.titre)` écrit `Livre Rust`.
3. `{:.2}` avec `self.prix()` écrit `29.9` avec **2 chiffres après la virgule** : `29.90`.
4. Résultat : `Livre Rust : 29.90 €`.

Dans un `fmt`, on écrit le texte avec `write!(f, ...)`, qui s'utilise comme `format!` mais écrit dans `f` et renvoie un `fmt::Result` (pas de `;` à la fin : c'est la valeur renvoyée).

### Afficher un prix rangé en centimes

On range souvent un prix en **centimes** dans un entier (pas d'erreur d'arrondi). Pour l'afficher en euros : on convertit en `f64` avec `as f64`, on divise par `100.0`, et on affiche avec `{:.2}`.

```rust
fn afficher_prix(centimes: u32) -> String {
    format!("{:.2} €", centimes as f64 / 100.0)
}

fn main() {
    println!("{}", afficher_prix(4550));
    println!("{}", afficher_prix(7));
    println!("{}", afficher_prix(1200));
}
```

| Centimes | `as f64 / 100.0` | Avec `{:.2}` |
|---|---|---|
| 4550 | 45.5 | `45.50 €` |
| 7 | 0.07 | `0.07 €` |
| 1200 | 12 | `12.00 €` |

Erreur fréquente : `centimes / 100` sur des entiers fait une division **entière** (`4550 / 100 = 45`), les centimes sont perdus. Il faut passer en `f64` **avant** de diviser.

**À retenir :** `trait A: B` = tout type `A` doit aussi être `B`, donc les méthodes par défaut de `A` peuvent utiliser celles de `B` (par exemple `{}` sur `self` si `B` est `Display`).

## 4. `impl Trait` : en argument et en retour

```rust
use std::fmt::Display;

fn annoncer(x: impl Display) -> String {
    format!("Annonce : {}", x)
}

fn pairs(limite: u32) -> impl Iterator<Item = u32> {
    (0..limite).filter(|n| n % 2 == 0)
}

fn main() {
    println!("{}", annoncer(42));
    println!("{}", annoncer("salut"));
    let v: Vec<u32> = pairs(10).collect();
    println!("{:?}", v);
}
```

- **En argument** : raccourci pour un générique (`fn annoncer<T: Display>(x: T)`). C'est **l'appelant** qui choisit le type (ici `i32`, puis `&str`).
- **En retour** : on cache le type exact. C'est **la fonction** qui choisit le type, l'appelant sait seulement « c'est un itérateur de `u32` ». Pratique pour les chaînes d'itérateurs et les closures, dont le type est impossible à écrire (le vrai type de `pairs` ressemble à `Filter<Range<u32>, {closure}>`).

**Pas à pas de `pairs(10)` :** `0..10` donne `0` à `9`, `filter` garde ceux dont le reste par 2 vaut 0. On obtient `[0, 2, 4, 6, 8]`.

**Monomorphisation :** pour un générique ou un `impl Trait` en argument, le compilateur fabrique **une copie** de la fonction pour chaque type utilisé (`annoncer` pour `i32`, `annoncer` pour `&str`). L'appel est direct et rapide, mais le programme est un peu plus gros.

> [!warning] Un seul type concret
> `-> impl Trait` renvoie **un** type. Un `if` qui renvoie un `Chien` d'un côté et un `Chat` de l'autre ne compile pas. Il faut alors un objet-trait (section suivante).

```text
fn animal(chien: bool) -> impl Crier {
    if chien { Chien } else { Chat }   // erreur : `if` and `else` have incompatible types
}
```

**À retenir :** `impl Trait` en argument = l'appelant choisit le type ; en retour = la fonction choisit **un seul** type, qu'elle cache.

## 5. Objets-traits : `dyn Trait`

Avec les génériques, le type est connu à la compilation. Avec `dyn Trait`, le choix se fait **à l'exécution** : on peut mélanger plusieurs types dans un même `Vec`.

```rust
trait Forme {
    fn aire(&self) -> f64;
}

struct Carre(f64);
struct Rectangle(f64, f64);

impl Forme for Carre {
    fn aire(&self) -> f64 {
        self.0 * self.0
    }
}

impl Forme for Rectangle {
    fn aire(&self) -> f64 {
        self.0 * self.1
    }
}

fn main() {
    let formes: Vec<Box<dyn Forme>> = vec![Box::new(Carre(2.0)), Box::new(Rectangle(2.0, 3.0))];
    let total: f64 = formes.iter().map(|f| f.aire()).sum();
    println!("{}", total);
}
```

Le `Box` est nécessaire : les types n'ont pas la même taille, on les range donc sur le tas. On peut aussi emprunter : `&dyn Forme`.

**Pas à pas :**

1. `Box::new(Carre(2.0))` et `Box::new(Rectangle(2.0, 3.0))` sont deux types différents, mais tous deux deviennent des `Box<dyn Forme>` : le `Vec` les accepte ensemble.
2. Pour chaque élément, `f.aire()` regarde **à l'exécution** quel est le vrai type et appelle la bonne méthode : `2 * 2 = 4` pour le carré, `2 * 3 = 6` pour le rectangle.
3. `sum` donne `4 + 6 = 10`. Affiché : `10`.

Comment Rust trouve la bonne méthode : un `Box<dyn Forme>` contient deux pointeurs, l'un vers la valeur, l'autre vers une **table des méthodes** (la *vtable*) du vrai type. L'appel passe par cette table : c'est un appel **indirect**, un tout petit peu plus lent qu'un appel direct.

### Fabriquer et enchaîner des objets-traits

Deux gestes reviennent souvent :

- **Fabriquer** une valeur à partir d'un nom (lu dans un fichier, tapé par l'utilisateur) : un `match` qui renvoie `Option<Box<dyn Trait>>`. Chaque branche met un type **différent** dans un `Box`, ce qui est permis car le type de retour est le même pour toutes : `Box<dyn Trait>`.
- **Enchaîner** des étapes : partir d'une valeur et appliquer chaque étape sur le résultat de la précédente, avec une boucle ou avec `fold`.

```rust
trait Operation {
    fn calculer(&self, n: i64) -> i64;
}

struct Ajouter(i64);
struct Multiplier(i64);

impl Operation for Ajouter {
    fn calculer(&self, n: i64) -> i64 {
        n + self.0
    }
}

impl Operation for Multiplier {
    fn calculer(&self, n: i64) -> i64 {
        n * self.0
    }
}

fn fabriquer(nom: &str) -> Option<Box<dyn Operation>> {
    match nom {
        "plus-un" => Some(Box::new(Ajouter(1))),
        "triple" => Some(Box::new(Multiplier(3))),
        _ => None,
    }
}

fn appliquer_tout(operations: &[Box<dyn Operation>], depart: i64) -> i64 {
    operations.iter().fold(depart, |valeur, op| op.calculer(valeur))
}

fn main() {
    let operations: Vec<Box<dyn Operation>> = ["triple", "inconnu", "plus-un"]
        .iter()
        .filter_map(|nom| fabriquer(nom))
        .collect();
    println!("{} opérations", operations.len());
    println!("{}", appliquer_tout(&operations, 5));
}
```

**Pas à pas :**

1. `fabriquer("triple")` donne `Some(Multiplier(3))`, `fabriquer("inconnu")` donne `None`, `fabriquer("plus-un")` donne `Some(Ajouter(1))`.
2. `filter_map` garde ce qui est dans un `Some` et jette les `None` : il reste 2 opérations, dans l'ordre `triple` puis `plus-un`.
3. `fold(depart, |valeur, op| ...)` part de `5` et, pour chaque opération dans l'ordre, remplace `valeur` par `op.calculer(valeur)` :

| Étape | `valeur` avant | Opération | `valeur` après |
|---|---|---|---|
| départ | | | 5 |
| 1 | 5 | `Multiplier(3)` | 15 |
| 2 | 15 | `Ajouter(1)` | 16 |

Affiché : `2 opérations` puis `16`. Dans l'autre ordre (`plus-un` puis `triple`), on aurait `(5 + 1) * 3 = 18` : l'ordre des étapes change le résultat.

Pour des étapes qui transforment du texte, deux outils de `String` servent souvent : `"ab".repeat(3)` donne `"ababab"`, et `format!("{}{}{}", c, texte, c)` colle un caractère avant et après un texte. Avec `fold` sur du texte, la valeur de départ s'écrit `texte.to_string()` (un `String` qu'on remplace à chaque étape).

**À retenir :** `Box<dyn Trait>` permet de ranger des types différents ensemble et de les choisir à l'exécution (un `match` qui renvoie `Some(Box::new(...))`) ; `fold` applique des étapes dans l'ordre, chacune sur le résultat de la précédente.

### Sécurité d'objet

Tous les traits ne peuvent pas devenir `dyn`. Un trait est **sûr pour les objets** (*dyn compatible*) si ses méthodes :

- n'ont pas de paramètre générique (`fn f<T>(&self)`) ;
- ne renvoient pas `Self` (`fn copie(&self) -> Self`) ;
- ont un `self` (sinon elles ne sont pas appelables via `dyn`).

Sinon : erreur « the trait cannot be made into an object ».

**Pourquoi ?** Derrière un `dyn Trait`, le vrai type est **oublié** : il ne reste que la table des méthodes.

1. `fn copie(&self) -> Self` : quelle taille réserver pour le résultat ? Ce peut être un `Carre` ou un `Rectangle`, Rust ne le sait plus. Impossible.
2. `fn f<T>(&self)` : il faudrait une version de `f` par type `T` possible dans la table, en nombre infini. Impossible.
3. `fn creer() -> ...` sans `self` : pas de valeur pour aller chercher la table. Impossible via `dyn`.

**À retenir :** un trait devient `dyn` seulement si chacune de ses méthodes prend un `self` et ne parle ni de `Self` en retour ni d'un générique.

### `dyn` ou `impl` ?

| | `impl Trait` / générique | `dyn Trait` |
|---|---|---|
| Choix du type | compilation | exécution |
| Types mélangés dans un `Vec` | non | oui |
| Vitesse | appel direct | appel indirect (petit coût) |
| Taille du programme | une copie par type | une seule |

**À retenir :** par défaut `impl Trait` (plus rapide) ; `dyn Trait` dès qu'il faut mélanger des types ou décider à l'exécution.

## 6. `From`, `Into`, `TryFrom`

- `From<A> for B` : conversion qui **réussit toujours**.
- `Into` : l'autre sens, offert gratuitement.
- `TryFrom<A> for B` : conversion qui **peut échouer**, elle renvoie un `Result`. Son type associé `Error` dit quel type d'erreur on renvoie.

```rust
struct Kilometres(f64);
struct Metres(f64);

impl From<Kilometres> for Metres {
    fn from(k: Kilometres) -> Metres {
        Metres(k.0 * 1000.0)
    }
}

fn en_metres(k: Kilometres) -> f64 {
    let m: Metres = k.into();
    m.0
}

struct Pourcentage(u8);

impl TryFrom<i32> for Pourcentage {
    type Error = String;

    fn try_from(n: i32) -> Result<Pourcentage, String> {
        if (0..=100).contains(&n) {
            Ok(Pourcentage(n as u8))
        } else {
            Err(format!("{} n'est pas un pourcentage", n))
        }
    }
}

fn main() {
    println!("{}", en_metres(Kilometres(2.5)));
    println!("{:?}", Pourcentage::try_from(150).map(|p| p.0));
    let ok: Result<Pourcentage, _> = 42.try_into();
    println!("{:?}", ok.map(|p| p.0));
}
```

**Pas à pas :**

1. `en_metres(Kilometres(2.5))` : `k.into()` doit produire un `Metres` (l'annotation `let m: Metres` le dit). Rust trouve `From<Kilometres> for Metres` et appelle `from` : `2.5 * 1000.0 = 2500`. Affiché : `2500`.
2. `Pourcentage::try_from(150)` : `(0..=100).contains(&150)` est faux (`0..=100` va de 0 à 100 **inclus**). On renvoie `Err("150 n'est pas un pourcentage")`. `map` ne touche pas une erreur : affiché `Err("150 n'est pas un pourcentage")`.
3. `42.try_into()` : `try_into` existe grâce à `TryFrom`. 42 est dans l'intervalle : `Ok(Pourcentage(42))`, puis `map(|p| p.0)` donne `Ok(42)`.

Trois détails :

- `.into()` a besoin de savoir le type d'arrivée : une annotation (`let m: Metres`) ou le type de retour de la fonction suffit. Sans indice, erreur « type annotations needed ».
- `n as u8` est sans danger ici, car on a vérifié avant que `n` est entre 0 et 100.
- `0..=100` inclut 100, `0..100` s'arrête à 99 : vérifie toujours si les bornes de l'énoncé sont « incluses ».

> [!tip] Astuce
> Implémente `From`, jamais `Into` à la main : `Into` en découle. Et avec `From<MonErreur> for ErreurGlobale`, l'opérateur `?` convertit les erreurs tout seul.

Pourquoi `Into` est gratuit : la bibliothèque standard contient l'implémentation générale `impl<T, U: From<T>> Into<U> for T` (« pour tout `T` que `U` sait convertir, `T` a `into()` vers `U` »). C'est une *blanket impl*, la notion de la section suivante.

**À retenir :** conversion toujours possible → `From` (et `into()` vient seul) ; conversion qui peut rater → `TryFrom` avec `type Error`, qui renvoie `Ok(...)` ou `Err(...)`.

## 7. Implémentation générale (blanket impl)

On peut implémenter un trait pour **tous** les types qui respectent une condition.

```rust
use std::fmt::Display;

trait Crier {
    fn crier(&self) -> String;
}

impl<T: Display> Crier for T {
    fn crier(&self) -> String {
        self.to_string().to_uppercase() + " !"
    }
}

fn main() {
    println!("{}", "bonjour".crier());
    println!("{}", 42_i32.crier());
}
```

On lit `impl<T: Display> Crier for T` : « pour **tout** type `T`, à condition que `T` soit `Display`, voici `Crier` ». Il n'y a pas de type précis après `for`, juste le `T` : c'est ça qui rend l'implémentation générale.

**Pas à pas de `"bonjour".crier()` :**

1. `"bonjour"` est une chaîne, qui implémente `Display` : la condition est remplie, la méthode existe.
2. `self.to_string()` donne `"bonjour"`, `to_uppercase()` donne `"BONJOUR"`, `+ " !"` donne `"BONJOUR !"`.
3. Pour `42_i32` : `"42"`, la mise en majuscules ne change rien aux chiffres, résultat `"42 !"`.

Un type à toi qui implémente `Display` reçoit **lui aussi** `crier` automatiquement, sans une ligne de plus. Pour écrire le texte affiché d'une valeur dans une méthode, deux façons équivalentes : `self.to_string()` ou `format!("{}", self)`.

La bibliothèque standard fait pareil : `impl<T: Display> ToString for T`. C'est pour ça que tout ce qui est `Display` a `.to_string()`.

**À retenir :** `impl<T: Condition> MonTrait for T` donne `MonTrait` à tous les types qui remplissent la condition, présents et futurs.

## 8. Newtype et règle des orphelins

**Règle des orphelins** : on ne peut implémenter un trait que si le trait **ou** le type vient de notre crate (notre projet). `impl Display for Vec<String>` est donc interdit : les deux viennent de la bibliothèque standard.

| Trait | Type | Permis ? |
|---|---|---|
| à toi (`Crier`) | étranger (`i32`) | oui |
| étranger (`Display`) | à toi (`Livre`) | oui |
| étranger (`Display`) | étranger (`Vec<String>`) | **non** |

La raison : si deux bibliothèques pouvaient chacune écrire leur propre `Display` pour `Vec<String>`, Rust ne saurait pas lequel choisir.

Solution : le **newtype**, une structure à un seul champ qui enveloppe le type. Le type devient « à toi », la règle est respectée.

```rust
use std::fmt;

struct Chemin(Vec<String>);

impl fmt::Display for Chemin {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "/{}", self.0.join("/"))
    }
}

fn main() {
    let c = Chemin(vec!["home".to_string(), "lea".to_string()]);
    println!("{}", c);
    println!("{}", Chemin(Vec::new()));
}
```

**Pas à pas :**

1. `self.0` est le `Vec<String>` enveloppé (le champ n° 0 de la structure).
2. `join("/")` colle les éléments en mettant `"/"` **entre** eux : `["home", "lea"]` donne `"home/lea"`.
3. `write!(f, "/{}", ...)` ajoute le `/` du début : affiché `/home/lea`.
4. Pour un `Vec` vide, `join` renvoie une chaîne vide `""` : affiché `/`. Pas besoin de cas spécial.

Le newtype ne coûte rien à l'exécution. Mais il n'hérite pas des méthodes du type enveloppé : on accède au contenu par `self.0`.

Il sert aussi à éviter des confusions : `struct Metres(f64);` et `struct Secondes(f64);` sont deux types différents, impossible de les mélanger par erreur.

**Newtype + blanket impl :** dès que `Chemin` implémente `Display`, il reçoit `to_string()` (blanket impl de `ToString`) et aussi tout trait à toi écrit comme `impl<T: Display> ... for T` (comme `Crier` plus haut) : `c.crier()` donnerait `"/HOME/LEA !"`.

**À retenir :** trait étranger + type étranger = interdit ; enveloppe le type dans un `struct Nom(Type);` et implémente le trait sur l'enveloppe.

## 9. Trier : `PartialOrd` et `Ord`

Pour comparer et trier, il faut `Ord` (ordre total), qui demande `Eq`, `PartialOrd` et `PartialEq`. `sort()` et `min()` / `max()` s'en servent.

- `a.cmp(&b)` renvoie un `Ordering` : `Less` (`a` passe avant `b`), `Equal` ou `Greater` (`a` passe après).
- `sort()` range du plus « petit » au plus « grand » selon `cmp`.
- **Inverser les deux côtés inverse l'ordre** : `a.cmp(&b)` trie en croissant, `b.cmp(&a)` en décroissant.
- `premier.then_with(|| second)` : si `premier` vaut `Equal`, on utilise le second critère ; sinon on garde `premier`. (`then(second)` fait pareil, mais calcule le second critère tout de suite.)

**Exemple résolu : classer des coureurs.** On veut le **temps le plus court d'abord** (croissant), et à temps égal le **dossard le plus grand d'abord** (décroissant).

```rust
use std::cmp::Ordering;

#[derive(Debug, PartialEq, Eq)]
struct Coureur {
    dossard: u32,
    temps: u32,
}

impl Ord for Coureur {
    fn cmp(&self, autre: &Coureur) -> Ordering {
        self.temps
            .cmp(&autre.temps)
            .then_with(|| autre.dossard.cmp(&self.dossard))
    }
}

impl PartialOrd for Coureur {
    fn partial_cmp(&self, autre: &Coureur) -> Option<Ordering> {
        Some(self.cmp(autre))
    }
}

fn main() {
    let mut course = vec![
        Coureur { dossard: 7, temps: 62 },
        Coureur { dossard: 3, temps: 58 },
        Coureur { dossard: 9, temps: 62 },
    ];
    course.sort();
    for c in &course {
        println!("dossard {} en {} s", c.dossard, c.temps);
    }
    if let Some(premier) = course.iter().min() {
        println!("Vainqueur : {}", premier.dossard);
    }
}
```

**Pas à pas : on compare les coureurs deux à deux.**

| `self` | `autre` | Temps : `self.temps.cmp(&autre.temps)` | Départage | Résultat |
|---|---|---|---|---|
| n°3 (58) | n°7 (62) | `58 < 62` : `Less` | pas utilisé | n°3 avant n°7 |
| n°7 (62) | n°9 (62) | `Equal` | `9.cmp(&7)` : `Greater` | n°7 **après** n°9 |
| n°3 (58) | n°9 (62) | `Less` | pas utilisé | n°3 avant n°9 |

Ordre final : n°3, n°9, n°7. Le départage est écrit `autre.dossard.cmp(&self.dossard)` (côtés inversés), donc le plus grand dossard passe devant.

`min()` renvoie l'élément le plus « petit » selon `cmp`, c'est-à-dire celui qui serait **premier** après le tri : ici le n°3. Affiché :

```text
dossard 3 en 58 s
dossard 9 en 62 s
dossard 7 en 62 s
Vainqueur : 3
```

- `PartialOrd` se contente de renvoyer `Some(self.cmp(autre))` : on écrit la vraie règle une seule fois, dans `cmp`.
- Avec `#[derive(PartialOrd, Ord)]`, la comparaison suit l'ordre des champs, en croissant pour chacun. Pour un ordre décroissant ou un autre ordre des critères, on écrit `cmp` à la main.

> [!warning] Piège : `f64`
> Les `f64` n'ont pas `Ord` (à cause de `NaN`). Pour trier des flottants : `v.sort_by(|a, b| a.total_cmp(b))`.

**À retenir :** écris le critère principal, puis `.then_with(|| critère suivant)` ; `self` avant `autre` = croissant, `autre` avant `self` = décroissant.

## À retenir

- Type associé : un seul choix par implémentation ; générique : plusieurs possibles.
- Les opérateurs sont des traits de `std::ops`.
- `trait A: B` exige que `B` soit aussi implémenté.
- `impl Trait` = type connu à la compilation ; `Box<dyn Trait>` = types mélangés, choix à l'exécution.
- Un trait n'est utilisable en `dyn` que si ses méthodes ont un `self`, sans générique ni `Self` en retour.
- `From` pour les conversions sûres, `TryFrom` pour celles qui peuvent échouer.
- Blanket impl : un trait pour tous les types qui remplissent une condition.
- Newtype : contourne la règle des orphelins.
- `Ord` : `cmp` + `then_with`, inverser `self` et `autre` inverse l'ordre.
