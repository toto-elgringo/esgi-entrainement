# Traits avancés

Le chapitre « Traits et génériques » a montré les bases : écrire un trait, l'implémenter, `derive`, `Display`. Ici, on va plus loin : les outils que la bibliothèque standard utilise partout.

## 1. Types associés

Un **type associé** est un type que chaque implémentation choisit. L'exemple le plus célèbre est `Iterator`.

```rust
struct Decompte(u32);

impl Iterator for Decompte {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.0 == 0 {
            None
        } else {
            self.0 -= 1;
            Some(self.0 + 1)
        }
    }
}

fn main() {
    let valeurs: Vec<u32> = Decompte(3).collect();
    println!("{:?}", valeurs);
    let somme: u32 = Decompte(4).map(|n| n * 2).sum();
    println!("{}", somme);
}
```

Tu écris seulement `next`. Tous les autres outils (`map`, `filter`, `sum`, `collect`...) arrivent gratuitement.

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

> [!tip] Règle simple
> Si un type n'a qu'un seul choix logique (les éléments d'un itérateur), prends un type associé. S'il peut y en avoir plusieurs (convertir vers plusieurs types), prends un générique.

## 2. Surcharge d'opérateurs

Chaque opérateur est relié à un trait de `std::ops`.

| Opérateur | Trait |
|---|---|
| `a + b` | `Add` |
| `a - b` | `Sub` |
| `a * b` | `Mul` |
| `-a` | `Neg` |
| `a[i]` | `Index` / `IndexMut` |
| `a += b` | `AddAssign` |

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

### Additionner des types différents

`Add` a un paramètre par défaut : `trait Add<Rhs = Self>`. Sans précision, on additionne deux valeurs du même type. On peut choisir autre chose :

```rust
use std::ops::Mul;

#[derive(Debug, Clone, Copy)]
struct Vecteur {
    x: f64,
    y: f64,
}

impl Mul<f64> for Vecteur {
    type Output = Vecteur;

    fn mul(self, k: f64) -> Vecteur {
        Vecteur { x: self.x * k, y: self.y * k }
    }
}

fn main() {
    let v = Vecteur { x: 1.5, y: 2.0 };
    println!("{:?}", v * 2.0);
}
```

### Indexer avec `[]`

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

> [!warning] Piège : valeurs déplacées
> `a + b` **consomme** `a` et `b` (ils sont déplacés). Pour continuer à les utiliser, le type doit être `Copy`, ou on implémente `Add` pour `&Point`.

## 3. Supertraits

Un trait peut en exiger un autre : c'est un **supertrait**.

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

- **En argument** : raccourci pour un générique (`fn annoncer<T: Display>(x: T)`).
- **En retour** : on cache le type exact. Pratique pour les chaînes d'itérateurs et les closures, dont le type est impossible à écrire.

> [!warning] Un seul type concret
> `-> impl Trait` renvoie **un** type. Un `if` qui renvoie un `Chien` d'un côté et un `Chat` de l'autre ne compile pas. Il faut alors un objet-trait (section suivante).

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

### Sécurité d'objet

Tous les traits ne peuvent pas devenir `dyn`. Un trait est **sûr pour les objets** si ses méthodes :

- n'ont pas de paramètre générique (`fn f<T>(&self)`) ;
- ne renvoient pas `Self` (`fn copie(&self) -> Self`) ;
- ont un `self` (sinon elles ne sont pas appelables via `dyn`).

Sinon : erreur « the trait cannot be made into an object ».

### `dyn` ou `impl` ?

| | `impl Trait` / générique | `dyn Trait` |
|---|---|---|
| Choix du type | compilation | exécution |
| Types mélangés dans un `Vec` | non | oui |
| Vitesse | appel direct | appel indirect (petit coût) |
| Taille du programme | une copie par type | une seule |

## 6. `From`, `Into`, `TryFrom`

- `From<A> for B` : conversion qui **réussit toujours**.
- `Into` : l'autre sens, offert gratuitement.
- `TryFrom<A> for B` : conversion qui **peut échouer**, elle renvoie un `Result`.

```rust
struct Celsius(f64);
struct Fahrenheit(f64);

impl From<Celsius> for Fahrenheit {
    fn from(c: Celsius) -> Fahrenheit {
        Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)
    }
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
    let f: Fahrenheit = Celsius(100.0).into();
    println!("{}", f.0);
    println!("{:?}", Pourcentage::try_from(150).map(|p| p.0));
    let ok: Result<Pourcentage, _> = 42.try_into();
    println!("{:?}", ok.map(|p| p.0));
}
```

> [!tip] Astuce
> Implémente `From`, jamais `Into` à la main : `Into` en découle. Et avec `From<MonErreur> for ErreurGlobale`, l'opérateur `?` convertit les erreurs tout seul.

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

La bibliothèque standard fait pareil : `impl<T: Display> ToString for T`. C'est pour ça que tout ce qui est `Display` a `.to_string()`.

## 8. Newtype et règle des orphelins

**Règle des orphelins** : on ne peut implémenter un trait que si le trait **ou** le type vient de notre crate. `impl Display for Vec<String>` est donc interdit : les deux viennent de la bibliothèque standard.

Solution : le **newtype**, une structure à un seul champ qui enveloppe le type.

```rust
use std::fmt;

struct Liste(Vec<String>);

impl fmt::Display for Liste {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

fn main() {
    let l = Liste(vec!["a".to_string(), "b".to_string()]);
    println!("{}", l);
}
```

Le newtype ne coûte rien à l'exécution. Mais il n'hérite pas des méthodes du type enveloppé : on accède au contenu par `self.0`.

Il sert aussi à éviter des confusions : `struct Metres(f64);` et `struct Secondes(f64);` sont deux types différents, impossible de les mélanger par erreur.

## 9. Trier : `PartialOrd` et `Ord`

Pour comparer et trier, il faut `Ord` (ordre total), qui demande `Eq`, `PartialOrd` et `PartialEq`.

```rust
use std::cmp::Ordering;

#[derive(Debug, PartialEq, Eq)]
struct Joueur {
    nom: String,
    score: u32,
}

impl Ord for Joueur {
    fn cmp(&self, autre: &Joueur) -> Ordering {
        autre.score.cmp(&self.score).then_with(|| self.nom.cmp(&autre.nom))
    }
}

impl PartialOrd for Joueur {
    fn partial_cmp(&self, autre: &Joueur) -> Option<Ordering> {
        Some(self.cmp(autre))
    }
}

fn main() {
    let mut joueurs = vec![
        Joueur { nom: "Lea".to_string(), score: 10 },
        Joueur { nom: "Max".to_string(), score: 30 },
    ];
    joueurs.sort();
    println!("{:?}", joueurs[0]);
}
```

- `cmp` renvoie `Less`, `Equal` ou `Greater`.
- `then_with` départage les égalités avec un second critère.
- Avec `#[derive(PartialOrd, Ord)]`, la comparaison suit l'ordre des champs.

> [!warning] Piège : `f64`
> Les `f64` n'ont pas `Ord` (à cause de `NaN`). Pour trier des flottants : `v.sort_by(|a, b| a.total_cmp(b))`.

## À retenir

- Type associé : un seul choix par implémentation ; générique : plusieurs possibles.
- Les opérateurs sont des traits de `std::ops`.
- `trait A: B` exige que `B` soit aussi implémenté.
- `impl Trait` = type connu à la compilation ; `Box<dyn Trait>` = types mélangés, choix à l'exécution.
- `From` pour les conversions sûres, `TryFrom` pour celles qui peuvent échouer.
- Blanket impl : un trait pour tous les types qui remplissent une condition.
- Newtype : contourne la règle des orphelins.
