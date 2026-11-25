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

On suit le programme pas à pas (`b'a'` est l'octet du caractère `a`, soit 97 ; `b'b'` vaut 98) :

| Instruction | `cases` | `taille` | Résultat |
|---|---|---|---|
| départ | `[0, 0, 0]` | 0 | |
| `empiler(…, b'a', …)` | `[97, 0, 0]` | 1 | `true` |
| `empiler(…, b'b', …)` | `[97, 98, 0]` | 2 | `true` |
| `depiler(…)` | `[97, 98, 0]` | 1 | `Some(98)` |

`taille` sert à la fois de compteur et de **position de la prochaine case libre** : on écrit dans `cases[taille]` puis on avance ; pour dépiler, on recule puis on lit `cases[taille]`. L'élément du haut est donc toujours dans la case `taille - 1`.

Ça marche, tout est sur la pile. Mais trois choses clochent :

- le tableau et sa longueur voyagent **séparément** : rien n'empêche de passer la longueur d'un autre tableau ;
- **trois paramètres** pour une seule idée ;
- l'idée **n'a pas de nom** : ce n'est pas « une pile bornée », c'est « un tableau et un entier qu'on a décidé de garder ensemble ».

> [!tip] Dépiler n'efface rien
> `depiler` recule seulement le compteur : l'octet reste dans le tableau, simplement hors de la zone utilisée.

Donner un nom et une seule place à ces données, c'est le rôle d'une **struct**.

**À retenir :** pile bornée = un tableau + une taille ; on écrit en `taille` puis on avance, on recule puis on lit ; le haut est en `taille - 1`.

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
- Chaque champ s'écrit `nom: Type`, et les champs sont séparés par des virgules.
- Une struct vit sur la pile comme n'importe quelle valeur : **aucune allocation**. Sa taille est connue à la compilation.

## 3. Créer et lire une struct

```rust
struct Eleve {
    nom: String,
    age: u32,
    actif: bool,
}

fn main() {
    let alice = Eleve {
        nom: String::from("Alice"),
        age: 20,
        actif: true,
    };
    println!("{} a {} ans, actif : {}", alice.nom, alice.age, alice.actif);
}
```

- Il faut donner **tous** les champs, dans l'ordre qu'on veut.
- On lit un champ avec un point : `alice.age`.

Un champ `String` a besoin d'une vraie `String`, pas d'un texte entre guillemets (`"Alice"` est un `&str`, un texte emprunté). On la fabrique avec `String::from("Alice")` ou `"Alice".to_string()`, deux écritures qui font la même chose. Si une fonction reçoit un `nom: &str`, on écrit `nom.to_string()` pour remplir le champ.

**Exemple résolu : fabriquer une fiche et la tester.**

```rust
struct Film {
    titre: String,
    duree: u32,
}

fn creer_film(titre: &str, duree: u32) -> Film {
    Film {
        titre: titre.to_string(),
        duree,
    }
}

fn est_court(film: &Film) -> bool {
    film.duree < 60
}

fn main() {
    let film = creer_film("Le Voyage", 45);
    println!("{} : court ? {}", film.titre, est_court(&film));
}
```

1. `creer_film` reçoit un `&str` : `titre.to_string()` le transforme en `String` pour le champ `titre`.
2. `duree` tout seul veut dire `duree: duree` (raccourci expliqué plus bas, dans « Deux raccourcis ») : la variable a le même nom que le champ.
3. La dernière ligne de la fonction, sans `;`, est la struct renvoyée.
4. `est_court` reçoit `&Film` : elle **emprunte** le film pour le lire. Après l'appel, `film` appartient toujours à `main`.
5. `film.duree < 60` est déjà un `bool` : pas besoin de `if … { true } else { false }`. Avec 45, on obtient `true`.

Attention au bord : « moins de 60 » s'écrit `< 60` (60 donne `false`), « 60 ou moins » s'écrit `<= 60`.

**À retenir :** `Type { champ: valeur, … }` pour créer, `valeur.champ` pour lire, `.to_string()` pour passer d'un `&str` à un champ `String`.

### Modifier : toute la variable est `mut`

```rust
struct Eleve {
    nom: String,
    age: u32,
    actif: bool,
}

fn main() {
    let mut bob = Eleve { nom: String::from("Bob"), age: 19, actif: true };
    bob.age += 1;
    println!("{} a {} ans", bob.nom, bob.age);
}
```

> [!warning] Pas de champ `mut` tout seul
> On ne peut pas rendre un seul champ modifiable : c'est la **variable entière** qui est `mut` ou non.

Il y a deux façons d'avoir le droit de modifier un champ :

| Situation | Ce qu'il faut |
|---|---|
| la struct est dans une variable locale | `let mut x = …;` |
| la struct arrive en paramètre, empruntée | le paramètre est `x: &mut Type`, et l'appel s'écrit `f(&mut x)` |

**Exemple résolu : deux erreurs, deux corrections.**

```text
struct Minuteur { secondes: u32 }

fn ajouter_minute(m: &Minuteur) {
    m.secondes += 60;    // error[E0594]: cannot assign to `m.secondes`, which is behind a `&` reference
}

let m = Minuteur { secondes: 0 };
m.secondes += 1;         // error[E0594]: cannot assign to `m.secondes`, as `m` is not declared as mutable
```

1. Dans `ajouter_minute`, `m` est un emprunt en **lecture** (`&`) : on n'a pas le droit d'écrire à travers. Il faut `&mut Minuteur`.
2. Dans `main`, `m` n'est pas `mut` : on ne peut toucher aucun de ses champs. Il faut `let mut m`.

```rust
struct Minuteur {
    secondes: u32,
}

fn ajouter_minute(m: &mut Minuteur) {
    m.secondes += 60;
}

fn main() {
    let mut m = Minuteur { secondes: 0 };
    m.secondes += 1;
    ajouter_minute(&mut m);
    println!("{} s", m.secondes);   // 61 s
}
```

**À retenir :** pour modifier un champ, la variable doit être `let mut`, ou le paramètre `&mut Type`. Jamais `mut` devant un champ.

### Deux raccourcis

```rust
struct Eleve {
    nom: String,
    age: u32,
    actif: bool,
}

fn creer_eleve(nom: String, age: u32) -> Eleve {
    Eleve { nom, age, actif: true }   // « nom » veut dire « nom: nom »
}

fn main() {
    let alice = creer_eleve(String::from("Alice"), 20);
    let carla = Eleve {
        nom: String::from("Carla"),
        ..alice                       // les autres champs viennent de alice
    };
    println!("{} {} {}", carla.nom, carla.age, carla.actif);   // Carla 20 true
}
```

- `Eleve { nom, age, … }` : quand une variable porte **exactement** le nom du champ, on l'écrit une seule fois.
- `..alice` : tous les champs qu'on n'a pas écrits sont pris dans `alice` (ici `age` et `actif`). Attention, ils sont **déplacés** : si l'un d'eux était une `String`, `alice` ne serait plus entièrement utilisable.

**À retenir :** `{ nom }` = `{ nom: nom }` ; `..autre` complète avec les champs d'une autre valeur.

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

| Champ | Position | Valeur |
|---|---|---|
| `orange.0` | 1er | 255 (rouge) |
| `orange.1` | 2e | 128 (vert) |
| `orange.2` | 3e | 0 (bleu) |

> [!tip] Le motif « newtype »
> `struct Metres(f64)` et `struct Secondes(f64)` contiennent tous les deux un `f64`, mais ce sont **deux types différents** : impossible d'additionner des mètres et des secondes, ou de passer des secondes à une fonction qui attend des mètres. Et ça ne coûte rien : ni octet, ni instruction en plus.

**Exemple résolu : convertir des mètres en centimètres.**

```rust
struct Metres(f64);
struct Centimetres(f64);

fn vers_centimetres(m: Metres) -> Centimetres {
    Centimetres(m.0 * 100.0)
}

fn est_grand(m: &Metres) -> bool {
    m.0 >= 1.8
}

fn main() {
    let taille = Metres(1.5);
    println!("grand ? {}", est_grand(&taille));   // false
    let cm = vers_centimetres(taille);
    println!("{} cm", cm.0);                       // 150 cm
}
```

1. `m.0` sort le `f64` rangé dans `Metres` (ici 1.5).
2. On calcule avec des nombres à virgule : `100.0` et pas `100`. Rust **ne convertit pas** tout seul un entier en `f64`, `m.0 * 100` est refusé.
3. `Centimetres(…)` remet le résultat dans une **nouvelle** enveloppe : la fonction renvoie bien un `Centimetres`, pas un `f64` nu.
4. Appeler `vers_centimetres(Centimetres(3.0))` est refusé à la compilation : mauvais type, même si les deux contiennent un `f64`.

**À retenir :** struct tuple : `x.0`, `x.1`… ; pour une conversion, on ouvre (`.0`), on calcule en `f64` (`100.0`), on remet dans le bon type.

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

Ici `taille` est un `u8` : pour s'en servir comme position dans le tableau, il faut le convertir en `usize` (`self.taille as usize`), le seul type accepté entre crochets. Avec un champ `taille: usize`, on écrit directement `self.cases[self.taille]`.

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
println!("{}", r.aire());   // 48
```

**Exemple résolu : que se passe-t-il à chaque appel ?**

| Appel | Écrit en entier | `self` vaut | Résultat |
|---|---|---|---|
| `r.aire()` | `Rectangle::aire(&r)` | un emprunt en lecture de `r` (3 × 4) | 12 |
| `r.agrandir(2)` | `Rectangle::agrandir(&mut r, 2)` | un emprunt en écriture de `r` | `r` devient 6 × 8 |
| `r.aire()` | `Rectangle::aire(&r)` | lecture de `r` (6 × 8) | 48 |

Dans une méthode, on accède aux champs **par `self`** : `self.largeur`, jamais `largeur` tout seul. Pour combiner deux conditions, `&&` veut dire « et » (les deux doivent être vraies) et `||` veut dire « ou » :

```rust
struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

impl Rectangle {
    fn est_plus_grand_que(&self, autre: &Rectangle) -> bool {
        self.largeur > autre.largeur && self.hauteur > autre.hauteur
    }
}

fn main() {
    let a = Rectangle { largeur: 5, hauteur: 5 };
    let b = Rectangle { largeur: 4, hauteur: 6 };
    println!("{}", a.est_plus_grand_que(&b));   // false : 5 > 4 mais 5 > 6 est faux
}
```

Une méthode peut recevoir une **autre** valeur du même type : on l'emprunte (`autre: &Rectangle`), et on lit ses champs avec `autre.largeur`.

> [!tip] Quel choix ?
> Par défaut `&self`. `&mut self` si la méthode change des champs. `self` quand la méthode **transforme** la valeur en autre chose (une commande devient un ticket).

**À retenir :** dans `impl`, les champs se lisent par `self.champ` ; `&self` lit, `&mut self` modifie, et `a.m(x)` est juste `Type::m(&a, x)`.

### Une méthode qui peut refuser

Une méthode `&mut self` qui renvoie un `bool` dit si elle a pu faire son travail. Le piège classique : les types **non signés** (`u32`, `usize`…) ne peuvent pas devenir négatifs. Calculer `5 - 8` avec des `u32` fait **planter** le programme en mode debug (*attempt to subtract with overflow*). Il faut donc **tester avant** de soustraire.

**Exemple résolu : un réservoir qu'on ne peut pas vider en dessous de 0.**

```rust
struct Reservoir {
    litres: u32,
}

impl Reservoir {
    fn plein(litres: u32) -> Self {
        Self { litres }
    }

    fn consommer(&mut self, quantite: u32) -> bool {
        if quantite > self.litres {
            return false;
        }
        self.litres -= quantite;
        true
    }

    fn litres(&self) -> u32 {
        self.litres
    }
}

fn main() {
    let mut r = Reservoir::plein(40);
    println!("{}", r.consommer(25));   // true
    println!("{}", r.consommer(25));   // false
    println!("reste {} L", r.litres()); // reste 15 L
}
```

| Appel | Test `quantite > self.litres` | Action | `litres` après | Renvoie |
|---|---|---|---|---|
| `consommer(25)` | 25 > 40 ? non | on soustrait | 15 | `true` |
| `consommer(25)` | 25 > 15 ? **oui** | `return false` : on ne touche à rien | 15 | `false` |

- `return false;` sort de la méthode tout de suite : la soustraction n'est jamais faite.
- Si la quantité est **exactement** égale au contenu (15 sur 15), `15 > 15` est faux : on soustrait, il reste 0. C'est voulu.
- La méthode `litres()` porte le même nom que le champ `litres`. Pas de confusion : `r.litres` (sans parenthèses) est le champ, `r.litres()` est la méthode.

**À retenir :** une opération qui peut échouer teste d'abord, renvoie `false` sans rien changer si c'est impossible, et sinon modifie puis renvoie `true`.

### Consommer `self` : transformer une valeur

Une méthode qui prend `self` (sans `&`) **reçoit la valeur elle-même**, comme une fonction qui prend une `String`. Si elle renvoie `Self`, on récupère la valeur modifiée et on peut **enchaîner** les appels. Pour modifier `self` dans la méthode, on écrit `mut self` : comme `mut s: String`, ce `mut` ne concerne que l'intérieur de la méthode.

**Exemple résolu : préparer une pizza, puis la cuire.**

```rust
#[derive(Debug)]
struct Pizza {
    garnitures: u32,
    prix: u32,
}

#[derive(Debug)]
struct PizzaCuite {
    prix: u32,
}

impl Pizza {
    fn nature() -> Self {
        Self { garnitures: 0, prix: 8 }
    }

    fn garnir(mut self, supplement: u32) -> Self {
        self.garnitures += 1;
        self.prix += supplement;
        self
    }

    fn cuire(self) -> PizzaCuite {
        PizzaCuite { prix: self.prix }
    }
}

fn main() {
    let pizza = Pizza::nature().garnir(2).garnir(3);
    println!("{pizza:?}");          // Pizza { garnitures: 2, prix: 13 }
    let cuite = pizza.cuire();
    println!("{cuite:?}");          // PizzaCuite { prix: 13 }
    // pizza.garnir(1);             // error[E0382]: use of moved value: `pizza`
}
```

| Étape | Ce qui se passe | Valeur obtenue |
|---|---|---|
| `Pizza::nature()` | fonction associée : crée la pizza | 0 garniture, 8 € |
| `.garnir(2)` | prend la pizza, ajoute 1 garniture et 2 €, la **renvoie** | 1 garniture, 10 € |
| `.garnir(3)` | même chose sur la pizza renvoyée | 2 garnitures, 13 € |
| `pizza.cuire()` | prend la pizza et fabrique une `PizzaCuite` | 13 € |

Après `cuire`, la variable `pizza` est **déplacée** : impossible de la garnir à nouveau. Ce n'est pas une règle de bonne conduite, c'est le compilateur qui l'interdit.

**À retenir :** `self` = la méthode avale la valeur ; `mut self` + `-> Self` + `self` en dernière ligne pour la rendre modifiée et enchaîner.

## 6. Fonctions associées et `new`

Une fonction dans `impl` **sans** paramètre `self` est une **fonction associée** : on l'appelle avec `::` sur le type.

```rust
struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

impl Rectangle {
    fn new(largeur: u32, hauteur: u32) -> Self {
        Self { largeur, hauteur }
    }

    fn carre(cote: u32) -> Self {
        Self { largeur: cote, hauteur: cote }
    }
}

fn main() {
    let r = Rectangle::new(3, 4);
    let c = Rectangle::carre(5);
    println!("{}x{} et {}x{}", r.largeur, r.hauteur, c.largeur, c.hauteur);   // 3x4 et 5x5
}
```

- `Self` (majuscule) = le type du bloc `impl`, ici `Rectangle`. `self` (minuscule) = la valeur.
- `new` n'est **pas** un mot-clé : c'est seulement une convention pour « fabriquer une nouvelle valeur ». Rust n'a pas de constructeur spécial.

**Exemple résolu : lire `Rectangle::carre(5)`.**

1. `Rectangle::` : on appelle une fonction rangée **dans le type** (pas sur une valeur, il n'y en a pas encore).
2. `carre` n'a pas de `self` : c'est une fonction associée, elle reçoit seulement `cote = 5`.
3. `Self { largeur: cote, hauteur: cote }` = `Rectangle { largeur: 5, hauteur: 5 }`.
4. Écrire `r.carre(5)` ou `Rectangle.carre(5)` est refusé : le point est réservé aux méthodes qui ont un `self`.

**À retenir :** sans `self` → `Type::fonction(…)` ; avec `self` → `valeur.methode(…)`.

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

**Exemple résolu : un benchmark donne 0,5 ms pour un milliard d'additions. Que penser ?**

1. Un processeur fait environ quelques milliards d'opérations simples par seconde : un milliard d'additions demande au moins plusieurs centaines de millisecondes.
2. 0,5 ms est donc **mille fois** trop rapide : la boucle n'a probablement pas été exécutée.
3. Cause probable : le résultat n'est jamais affiché ni passé à `black_box`, donc le compilateur l'a supprimé.
4. Vérification : ajouter `black_box` sur le résultat (ou l'afficher), recompiler en `--release`, et mesurer à nouveau.

**À retenir :** mesure en `--release`, protège le résultat avec `black_box`, et si le chiffre est trop beau, cherche ce que le compilateur a supprimé.

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
| `PartialEq` | comparer avec `==` et `!=` |
| `Copy` | copie automatique, comme les entiers (seulement si tous les champs sont `Copy`) |

Un **trait** est une capacité qu'un type peut avoir (on les étudie dans un chapitre dédié). La ligne `#[derive(…)]` se place **juste au-dessus** de `struct`, et on y met autant de traits qu'on veut, séparés par des virgules.

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };
    println!("{:?}", p);    // Point { x: 1, y: 2 }
    println!("{:#?}", p);   // la même chose, sur plusieurs lignes
}
```

`{:#?}` (l'affichage « joli ») écrit le nom du type et `{`, puis **un champ par ligne**, décalé de 4 espaces et suivi d'une virgule, puis `}` seule sur sa ligne :

```text
Point {
    x: 1,
    y: 2,
}
```

Un champ `String` s'affiche **entre guillemets** avec `{:?}` : `Ville { nom: "Lyon" }`.

> [!warning] Erreur fréquente
> « `Point` doesn't implement `Debug` » : il manque `#[derive(Debug)]`. La ligne `help:` du compilateur le propose.

**Exemple résolu : quels traits manquent ?** Ce code ne compile pas avec une struct `Point` sans `derive` :

```text
let a = Point { x: 0, y: 0 };
let b = a.clone();       // error[E0599]: no method named `clone` found
println!("{:?}", b);     // error[E0277]: `Point` doesn't implement `Debug`
println!("{}", a == b);  // error[E0369]: binary operation `==` cannot be applied to type `Point`
```

| Ligne | Capacité demandée | Trait à dériver |
|---|---|---|
| `a.clone()` | faire une copie | `Clone` |
| `{:?}` | s'afficher pour le développeur | `Debug` |
| `a == b` | se comparer | `PartialEq` |

Une seule ligne au-dessus de la struct règle les trois : `#[derive(Debug, Clone, PartialEq)]`.

`assert_eq!(a, b)` (utilisé dans les tests) a besoin de **deux** traits : `PartialEq` pour comparer, et `Debug` pour afficher les deux valeurs si le test échoue.

`println!("{}", p)` (sans `?`) demande le trait `Display`, qu'il faut écrire soi-même : on le verra avec les traits. En attendant, pour fabriquer un texte, on utilise `format!` : il marche exactement comme `println!`, mais **renvoie** une `String` au lieu de l'afficher.

```rust
struct Ville {
    nom: String,
    habitants: u32,
}

impl Ville {
    fn decrire(&self) -> String {
        format!("{} compte {} habitants", self.nom, self.habitants)
    }
}

fn main() {
    let lyon = Ville { nom: String::from("Lyon"), habitants: 520_000 };
    let texte = lyon.decrire();
    println!("{texte}");   // Lyon compte 520000 habitants
}
```

**À retenir :** `{:?}` et `{:#?}` → `Debug` ; `.clone()` → `Clone` ; `==` → `PartialEq` ; `assert_eq!` → `Debug` + `PartialEq` ; un texte à renvoyer → `format!`.

## 9. Struct et ownership

Une struct **possède** ses champs : quand la struct disparaît, ses champs aussi. Pour l'instant, utilise `String` (possédé) plutôt que `&str` (emprunté) dans les champs : une référence dans une struct demande des **durées de vie** (lifetimes), vues plus tard.

**Exemple résolu :** avec `struct Carnet { proprietaire: String, pages: u32 }`, que devient la `String` à la fin de `main` ?

1. `let c = Carnet { proprietaire: String::from("Zoé"), pages: 50 };` : `c` possède le carnet, et le carnet possède la `String`.
2. À la fin de `main`, `c` est détruit (drop).
3. En le détruisant, Rust détruit chacun de ses champs : la `String` est libérée, sans rien écrire.

**À retenir :** détruire une struct détruit tous ses champs ; mets des `String` (pas des `&str`) dans tes structs pour l'instant.

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

La ligne `impl<T, const N: usize> PileFixe<T, N>` se lit : « pour **tout** type `T` et **toute** taille `N`, voici les méthodes de `PileFixe<T, N>` ». On répète les paramètres après `impl` pour les déclarer, puis on les utilise après le nom du type. Dans les méthodes, `N` s'utilise comme un nombre ordinaire : `self.taille == N`, ou une méthode qui renvoie `N`.

**Exemple résolu : que valent `T` et `N` ?**

| Appel | Tableau reçu | `T` | `N` | Type obtenu |
|---|---|---|---|---|
| `PileFixe::depuis_tableau([0u8; 3])` | 3 cases de `u8` | `u8` | 3 | `PileFixe<u8, 3>` |
| `PileFixe::depuis_tableau([""; 2])` | 2 cases de `&str` | `&str` | 2 | `PileFixe<&str, 2>` |
| `PileFixe::depuis_tableau([0.0; 8])` | 8 cases de `f64` | `f64` | 8 | `PileFixe<f64, 8>` |

On n'écrit jamais `T` ni `N` à l'appel : le compilateur les **déduit** du tableau donné. Pour une pile de 4 `String` vides : `PileFixe::depuis_tableau([String::new(), String::new(), String::new(), String::new()])` (la forme `[x; 4]` demande que `x` soit `Copy`, ce que `String` n'est pas).

> [!tip] Pourquoi `depuis_tableau` et pas `new` ?
> Pour remplir `[T; N]` tout seul, il faudrait savoir fabriquer un `T` « par défaut ». En recevant le tableau tout fait, la struct marche pour n'importe quel `T`, sans condition.

**À retenir :** `impl<T, const N: usize> S<T, N>` déclare les paramètres ; `T` et `N` se déduisent des arguments ; `N` est une constante utilisable dans les méthodes.

### Regarder le haut sans le retirer

Pour **regarder** un élément sans le sortir, on renvoie une référence vers sa case : `Option<&T>`. `None` si la structure est vide, sinon `Some(&case)`.

**Exemple résolu : la dernière mesure d'un relevé.**

```rust
struct Releves {
    valeurs: [u32; 4],
    nombre: usize,
}

impl Releves {
    fn derniere(&self) -> Option<&u32> {
        if self.nombre == 0 {
            None
        } else {
            Some(&self.valeurs[self.nombre - 1])
        }
    }
}

fn main() {
    let vide = Releves { valeurs: [0; 4], nombre: 0 };
    let r = Releves { valeurs: [12, 15, 0, 0], nombre: 2 };
    println!("{:?} {:?}", vide.derniere(), r.derniere());   // None Some(15)
}
```

1. `nombre` compte les cases remplies : avec 2 mesures, ce sont les cases 0 et 1.
2. La dernière remplie est donc la case `nombre - 1` = 1, qui contient 15.
3. Le test `nombre == 0` passe **avant** : sinon `0 - 1` sur un `usize` ferait planter le programme.
4. La méthode prend `&self` : elle lit, rien ne bouge. Le `&` devant `self.valeurs[…]` renvoie une référence vers la case, sans la vider.

**À retenir :** « regarder » = `&self` + `Option<&T>` + la case `nombre - 1`, après avoir traité le cas vide.

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

Trois outils servent à manipuler un tableau de `Option<T>` :

| Outil | Ce qu'il fait |
|---|---|
| `std::array::from_fn(\|_\| None)` | fabrique un tableau de `N` cases, toutes à `None` |
| `case.take()` | sort la valeur (`Option<T>`) et laisse `None` dans la case |
| `case.as_ref()` | transforme `&Option<T>` en `Option<&T>` : regarde la valeur sans la sortir |

`std::array::from_fn` appelle une petite fonction pour **chaque** case ; `|_| None` est une fonction écrite sur place (une *closure*, vue plus tard) qui ignore le numéro de la case (`_`) et renvoie `None`. On ne peut pas écrire `[None; N]` : la forme `[x; N]` **copie** `x` dans chaque case, ce qui exige que `Option<T>` soit `Copy`, et c'est faux dès que `T` est une `String` (erreur E0277, *the trait bound `String: Copy` is not satisfied*).

**Exemple résolu : des casiers où l'on dépose et reprend des objets.**

```rust
struct Casiers<T, const N: usize> {
    cases: [Option<T>; N],
}

impl<T, const N: usize> Casiers<T, N> {
    fn new() -> Self {
        Self {
            cases: std::array::from_fn(|_| None),
        }
    }

    fn deposer(&mut self, numero: usize, objet: T) -> bool {
        if self.cases[numero].is_some() {
            return false;
        }
        self.cases[numero] = Some(objet);
        true
    }

    fn regarder(&self, numero: usize) -> Option<&T> {
        self.cases[numero].as_ref()
    }

    fn reprendre(&mut self, numero: usize) -> Option<T> {
        self.cases[numero].take()
    }
}

fn main() {
    let mut casiers: Casiers<String, 3> = Casiers::new();
    let _ = casiers.deposer(1, String::from("parapluie"));
    println!("{:?}", casiers.regarder(1));    // Some("parapluie")
    let objet = casiers.reprendre(1);
    println!("{objet:?}");                    // Some("parapluie"), il est à nous
    println!("{:?}", casiers.regarder(1));    // None : le casier est vide
}
```

| Étape | Case 1 avant | Opération | Case 1 après | Renvoie |
|---|---|---|---|---|
| `Casiers::new()` | | `from_fn(\|_\| None)` | `None` | |
| `deposer(1, …)` | `None` | `Some(objet)` rangé | `Some("parapluie")` | `true` |
| `regarder(1)` | `Some("parapluie")` | `as_ref()` | inchangée | `Some(&"parapluie")` |
| `reprendre(1)` | `Some("parapluie")` | `take()` | `None` | `Some("parapluie")` |

On a récupéré une vraie `String` (pas une référence), et la case est passée à `None` : aucun trou caché.

**À retenir :** pour sortir une valeur d'un tableau sans `Copy`, range des `Option<T>` : `from_fn(|_| None)` pour créer, `Some(v)` pour poser, `.as_ref()` pour regarder, `.take()` pour reprendre.

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

**Exemple résolu :** un programme utilise `PileFixe<u8, 3>`, `PileFixe<u8, 8>` et `PileFixe<String, 3>`, et appelle `empiler` sur les trois. Combien de versions de `empiler` dans le binaire ?

1. On liste les combinaisons `(T, N)` différentes : `(u8, 3)`, `(u8, 8)`, `(String, 3)`.
2. Même `T` mais `N` différent = autre type : `(u8, 3)` et `(u8, 8)` comptent pour deux.
3. Donc **3** versions de `empiler`, chacune avec sa constante écrite en dur (3, 8, 3).

**À retenir :** une version du code par combinaison `(T, N)` utilisée : rapide à l'exécution, plus long à compiler.

## 11. Attention à la pile

Tout ce qui est dans une struct sans `Box` ni `Vec` est sur la pile. Et la pile est **petite** (8 Mo en général) :

```text
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

**Exemple résolu : `PileFixe<u64, 2_000_000>` tient-elle sur la pile ?**

1. Un `u64` prend 8 octets : 2 000 000 × 8 = 16 000 000 octets, soit environ 16 Mo (plus 8 octets pour `taille`).
2. La pile fait environ 8 Mo : 16 Mo ne rentrent pas, le programme s'arrête net.
3. Avec `PileFixe<u64, 100_000>` : 800 000 octets, moins de 1 Mo, ça passe.

**À retenir :** taille = nombre de cases × taille d'une case ; au-delà de quelques Mo, passe par le tas (`Vec`, `Box`).

## 12. Lire un fichier… à la compilation

```text
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

**Exemple résolu :** le fichier `src/main.rs` contient `include_str!("../entree.txt")`. Où doit être le fichier, et que se passe-t-il si on le supprime après `cargo build` ?

1. Le chemin part du dossier du fichier `.rs`, ici `src/` : `../entree.txt` désigne `entree.txt` à la racine du projet.
2. À la compilation, son contenu est copié dans l'exécutable. S'il manque à ce moment-là, c'est une **erreur de compilation**.
3. Après le build, on peut le supprimer : le programme déjà compilé contient le texte et marche toujours.

**À retenir :** `include_str!` lit le fichier **une fois, à la compilation** ; chemin relatif au `.rs` ; résultat `&'static str`.

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

- chaque type a un alignement (`align_of`) : 1 pour `u8` et `bool`, 2 pour `u16`, 4 pour `u32`, 8 pour `u64` (pour ces nombres, l'alignement est égal à la taille) ;
- une valeur doit commencer à une adresse **multiple** de son alignement : dans `MixteC`, `b` ne peut commencer qu'à l'octet 4, d'où 3 octets vides après `a` ;
- la struct prend l'alignement de son plus grand champ (4) et sa taille en est un **multiple** : 3 octets vides après `c`, pour que les éléments d'un tableau de `MixteC` restent alignés.

Sans attribut, Rust **choisit l'ordre des champs** : ici il place `b` en tête et n'a besoin que de 2 octets de remplissage. Cet ordre n'est **pas garanti** : un programme ne doit jamais le supposer.

`offset_of!(Type, champ)` donne la **position** du champ, en octets depuis le début de la struct ; `size_of::<Type>()` sa taille totale.

> [!info] À quoi sert l'alignement ?
> Le processeur lit la mémoire par blocs alignés (des mots, des lignes de cache de 64 octets). Une valeur alignée se lit en un seul accès ; à cheval sur deux blocs, elle peut en demander deux, et certains processeurs refusent carrément. En Rust, **créer** une référence non alignée est déjà un comportement indéfini.

### Calculer la disposition à la main

Avec `#[repr(C)]`, les champs sont posés **dans l'ordre écrit**. Pour chaque champ :

1. on part de la première position libre ;
2. si elle n'est pas un multiple de l'alignement du champ, on avance jusqu'au multiple suivant (les octets sautés sont du remplissage) ;
3. on pose le champ, la position libre avance de sa taille.

À la fin, on arrondit la taille au multiple de l'alignement le plus grand.

**Exemple résolu : un paquet réseau.**

```rust
use std::mem::{offset_of, size_of};

#[repr(C)]
struct Paquet {
    drapeau: u8,
    compteur: u32,
    code: u16,
    identifiant: u64,
}

#[repr(C)]
struct PaquetRange {
    identifiant: u64,
    compteur: u32,
    code: u16,
    drapeau: u8,
}

fn main() {
    println!("Paquet : {} octets, identifiant à {}", size_of::<Paquet>(), offset_of!(Paquet, identifiant));
    println!("PaquetRange : {} octets, drapeau à {}", size_of::<PaquetRange>(), offset_of!(PaquetRange, drapeau));
}
```

Dans l'ordre écrit (`Paquet`) :

| Champ | Taille | Alignement | Position libre | Remplissage | Position du champ |
|---|---|---|---|---|---|
| `drapeau: u8` | 1 | 1 | 0 | 0 | 0 |
| `compteur: u32` | 4 | 4 | 1 | 3 (pour aller à 4) | 4 |
| `code: u16` | 2 | 2 | 8 | 0 | 8 |
| `identifiant: u64` | 8 | 8 | 10 | 6 (pour aller à 16) | 16 |

Fin à 16 + 8 = 24, déjà multiple de 8 : **24 octets**, dont 9 de remplissage pour 15 octets de données.

Rangé du plus grand alignement au plus petit (`PaquetRange`) :

| Champ | Position libre | Remplissage | Position du champ |
|---|---|---|---|
| `identifiant: u64` | 0 | 0 | 0 |
| `compteur: u32` | 8 | 0 | 8 |
| `code: u16` | 12 | 0 | 12 |
| `drapeau: u8` | 14 | 0 | 14 |

Fin à 15, arrondi au multiple de 8 suivant : **16 octets**. Il reste 1 octet de remplissage final, impossible à éviter : 15 octets de données ne font pas un multiple de 8.

**À retenir :** avec `#[repr(C)]`, chaque champ commence à un multiple de son alignement et la taille finale est un multiple du plus grand ; ranger du plus grand au plus petit supprime les trous intérieurs.

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
- `struct Nom { champ: Type }` ; `valeur.champ` ; toute la variable est `mut` (ou le paramètre `&mut`), jamais un champ seul.
- Un champ `String` se remplit avec `.to_string()` ou `String::from(…)` ; `{ nom }` = `{ nom: nom }`.
- Struct tuple `struct Metres(f64)` (newtype, gratuit, champs `.0`, `.1`) ; struct unité `struct Marqueur;`.
- `impl` contient les méthodes : `&self` (lire), `&mut self` (modifier), `self` (consommer, `mut self` + `-> Self` pour enchaîner), rien (fonction associée comme `new`). `x.m()` = `Type::m(&x)`.
- Une opération qui peut échouer teste **avant** de modifier (attention aux soustractions de `u32`).
- `#[derive(Debug, Clone, PartialEq)]` pour `{:?}`, `.clone()` et `==` ; `format!` renvoie une `String` ; `#[must_use]` pour ne pas ignorer un résultat.
- Mesurer : `--release`, `black_box`, et se méfier d'un chiffre trop beau.
- `struct S<T, const N: usize>` : générique sur un type et une taille ; **monomorphisé**, donc rapide à l'exécution mais plus long à compiler.
- Sortir une valeur d'un tableau laisse un trou : renvoyer `&T`, exiger `T: Copy`, ou stocker des `Option<T>` (`from_fn(|_| None)`, `.take()`, `.as_ref()`).
- Ce qui est gros va sur le tas : un débordement de pile arrête net le programme.
- `include_str!` / `include_bytes!` : le fichier est copié dans le binaire, en `&'static`.
- Alignement et remplissage : `size_of`, `align_of`, `offset_of!` ; `#[repr(C)]`, `packed`, `align(n)`.
