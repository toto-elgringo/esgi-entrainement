# Les macros

## 1. C'est quoi une macro ?

Une macro est du **code qui écrit du code**. Elle se reconnaît au `!` après son nom : `println!`, `vec!`, `format!`.

Le compilateur remplace l'appel de la macro par le code qu'elle produit. On appelle ça **déplier** (ou *expanser*) la macro. Cela se passe **avant** la vérification des types.

Une fonction ne peut pas tout faire. Une macro, elle, peut :

- accepter un **nombre variable d'arguments** (`println!("{} {}", a, b)`) ;
- **générer des noms** de fonctions, de champs, de types ;
- écrire du code répétitif à ta place.

**Exemple résolu : que devient `vec![4, 5, 6]` ?**

1. Le compilateur lit le nom suivi de `!` : c'est une macro, pas une fonction.
2. Il donne à la macro `vec!` les morceaux de code `4`, `5`, `6`.
3. La macro produit à la place un code qui crée un vecteur contenant ces trois valeurs (en gros : « réserve 3 cases, mets 4, 5, 6 dedans »).
4. Ensuite seulement, le compilateur vérifie les types de ce code produit, comme si tu l'avais écrit toi-même.

```text
Ton code               vec![4, 5, 6]
Après dépliage         (un code qui construit un Vec avec 4, 5 et 6)
Puis                   vérification des types, compilation, exécution
```

Une fonction comme `fn creer(a: i32, b: i32, c: i32)` aurait **exactement trois** paramètres : impossible d'écrire ensuite `creer(1, 2)` ou `creer(1, 2, 3, 4)`. `vec!` accepte n'importe quel nombre d'éléments, parce que c'est du code produit sur mesure à chaque appel.

**À retenir :** un `!` après le nom = une macro, remplacée par du code **à la compilation**, avant la vérification des types.

## 2. Les macros de la bibliothèque standard

Tu en utilises déjà beaucoup :

```rust
fn main() {
    let v: Vec<i32> = vec![1, 2, 3];
    let texte = format!("{} éléments", v.len());
    println!("{texte}");
    assert!(v.len() == 3, "il devrait y avoir 3 éléments");
    assert_eq!(v[0], 1);
    let nom = stringify!(1 + 2);
    println!("{nom}");
}
```

| Macro | Rôle |
|---|---|
| `println!`, `print!` | affiche du texte |
| `format!` | construit une `String` |
| `vec!` | construit un `Vec` |
| `assert!`, `assert_eq!` | panique si la condition est fausse |
| `panic!`, `todo!`, `unreachable!` | arrêtent le programme |
| `stringify!` | transforme du code en texte, sans l'évaluer |
| `matches!` | teste si une valeur correspond à un motif |

> [!info] Pourquoi `println!` est une macro
> `println!` accepte autant d'arguments qu'on veut et vérifie le texte de format **à la compilation**. Une fonction normale ne peut pas faire ça.

**Exemple résolu : que fait chaque ligne de l'exemple ci-dessus ?**

| Ligne | Ce qui se passe | Affichage |
|---|---|---|
| `vec![1, 2, 3]` | crée un `Vec<i32>` de 3 éléments | rien |
| `format!("{} éléments", v.len())` | fabrique la `String` `"3 éléments"` sans l'afficher | rien |
| `println!("{texte}")` | affiche la variable `texte` | `3 éléments` |
| `assert!(v.len() == 3, ...)` | la condition est vraie : rien ne se passe | rien |
| `assert_eq!(v[0], 1)` | `v[0]` vaut bien 1 : rien ne se passe | rien |
| `stringify!(1 + 2)` | donne le **texte** `"1 + 2"`, le calcul n'est pas fait | rien |
| `println!("{nom}")` | affiche ce texte | `1 + 2` |

Si une condition d'`assert!` était fausse, le programme s'arrêterait (il « panique ») avec le message donné.

`stringify!` est la seule façon d'obtenir le **texte** d'un morceau de code. Une fonction ne reçoit que la **valeur** : `afficher(1 + 2)` reçoit `3`, jamais `"1 + 2"`.

`matches!` répond `true` ou `false` selon qu'une valeur a la bonne forme :

```rust
let note = 'B';
println!("{}", matches!(note, 'A' | 'B'));
let age = Some(15);
println!("{}", matches!(age, Some(n) if n >= 18));
```

1. `note` vaut `'B'`, le motif `'A' | 'B'` veut dire « `'A'` ou `'B'` » : affiche `true`.
2. `age` vaut `Some(15)` : la forme `Some(n)` correspond, mais la condition `n >= 18` est fausse (15 < 18) : affiche `false`.

**À retenir :** `format!` fabrique une `String`, `println!` l'affiche, `stringify!` donne le texte du code sans le calculer.

## 3. `macro_rules!` : un `match` sur du code

Une macro déclarative se définit avec `macro_rules!`. Elle ressemble à un `match` : à gauche de `=>` le **motif**, à droite le **code produit**.

```rust
macro_rules! cube {
    ($x:expr) => {
        $x * $x * $x
    };
}

fn main() {
    println!("{}", cube!(3));
    println!("{}", cube!(1 + 1));
}
```

Le deuxième appel affiche `8` et non `4` : `$x` est capturé comme une **expression entière**, donc le calcul est `(1 + 1) * (1 + 1) * (1 + 1)`.

**Exemple résolu : le dépliage de `cube!(1 + 1)`, étape par étape**

1. Le compilateur cherche un bras dont le motif correspond à `1 + 1`. Le seul bras est `($x:expr)`.
2. `1 + 1` est bien une expression : `$x` reçoit **tout** `1 + 1`, comme un seul bloc.
3. Dans `$x * $x * $x`, chaque `$x` est remplacé par ce bloc, qui reste groupé : `(1 + 1) * (1 + 1) * (1 + 1)`.
4. Calcul : `2 * 2 * 2 = 8`.

Avec un simple copier-coller de texte (ce que fait le C), on obtiendrait `1 + 1 * 1 + 1 * 1 + 1`. La multiplication passe avant l'addition : `1 + 1 + 1 + 1 = 4`. Faux !

> [!info] Différence avec le C
> Les macros du C (`#define`) copient du texte. Celles de Rust manipulent des morceaux de code déjà analysés : plus sûr, pas de parenthèses oubliées.

Une macro doit être **définie avant** d'être utilisée dans le fichier.

Les éléments d'une définition, dans l'ordre :

| Morceau | Rôle |
|---|---|
| `macro_rules! cube { ... }` | crée la macro nommée `cube` (sans `!` ici) |
| `($x:expr)` | le motif : ce qu'on attend entre les parenthèses de l'appel |
| `$x` | une **variable de macro** : elle commence toujours par `$` |
| `:expr` | le **fragment** : le genre de code accepté (ici, une expression) |
| `=> { ... }` | le code produit |
| `;` | sépare un bras du suivant |

**À retenir :** `$x:expr` capture une expression **entière** et la garde groupée : `cube!(1 + 1)` vaut 8, jamais 4.

## 4. Les fragments

Dans `$nom:fragment`, le fragment dit **quel genre de code** on attend.

| Fragment | Capture | Exemple |
|---|---|---|
| `expr` | une expression | `1 + 2`, `f(x)` |
| `ident` | un nom | `ma_fonction` |
| `ty` | un type | `Vec<i32>` |
| `tt` | un seul « jeton » (token tree) | `+`, `x`, `(a, b)` |
| `literal` | une valeur littérale | `42`, `"texte"` |
| `pat` | un motif de `match` | `Some(x)` |
| `block` | un bloc `{ ... }` | `{ a + b }` |

Attention : le nom exact est `literal` (et non `lit`). Un fragment au nom inconnu est une erreur de compilation.

Avec `ident` et `ty`, une macro peut **créer des fonctions** :

```rust
macro_rules! getter {
    ($nom:ident: $type:ty) => {
        fn $nom(&self) -> $type {
            self.$nom
        }
    };
}

struct Score {
    points: u32,
    moyenne: f64,
}

impl Score {
    getter!(points: u32);
    getter!(moyenne: f64);
}

fn main() {
    let s = Score { points: 12, moyenne: 14.5 };
    println!("{} {}", s.points(), s.moyenne());
}
```

**Exemple résolu : que produit `getter!(points: u32)` ?**

1. Le motif est `$nom:ident : $type:ty`. On lit l'appel morceau par morceau : `points` est un nom, donc `$nom = points` ; puis vient `:`, écrit tel quel dans le motif ; puis `u32` est un type, donc `$type = u32`.
2. On remplace dans le code produit :

```text
fn points(&self) -> u32 {
    self.points
}
```

3. Le même `$nom` sert deux fois : comme **nom de la méthode** et comme **nom du champ**. Une fonction ne peut pas faire ça : elle ne fabrique jamais de nouveaux noms.

> [!tip] `tt` : le joker
> `tt` accepte presque n'importe quel jeton. Il est très pratique pour recevoir des mots-clés personnalisés ou pour parcourir une liste élément par élément.

### Renvoyer une référence vers un champ

`self.points` marche car `u32` se **copie**. Pour un champ `String`, `self.nom` essaierait de **déplacer** le texte hors de la structure, alors qu'on ne l'a qu'emprunté (`&self`) : erreur `cannot move out of self.nom`. On renvoie donc une **référence** : type `&$type` et valeur `&self.$nom`.

```rust
macro_rules! lecteur {
    ($nom:ident: $type:ty) => {
        fn $nom(&self) -> &$type {
            &self.$nom
        }
    };
}

struct Ville {
    nom: String,
    habitants: u64,
}

impl Ville {
    lecteur!(nom: String);
    lecteur!(habitants: u64);
}

fn main() {
    let v = Ville { nom: String::from("Lyon"), habitants: 520_000 };
    println!("{} : {} habitants", v.nom(), v.habitants());
    println!("{}", *v.habitants() > 100_000);
}
```

1. `lecteur!(nom: String)` produit `fn nom(&self) -> &String { &self.nom }` : on prête le texte, on ne le déplace pas.
2. `v.habitants()` renvoie un `&u64`. `println!` sait l'afficher directement ; pour le comparer à un nombre, on le déréférence avec `*`.

### Ce qu'est un jeton (`tt`)

Un **jeton** est le plus petit morceau de code : un nom, un nombre, un texte, un symbole. Un groupe entre `( )`, `[ ]` ou `{ }` compte pour **un seul** jeton, quel que soit son contenu.

| Code | Jetons | Nombre |
|---|---|---|
| `x y z` | `x`, `y`, `z` | 3 |
| `7 * n` | `7`, `*`, `n` | 3 |
| `a >= 10` | `a`, `>=`, `10` (`>=` est un seul symbole) | 3 |
| `[1, 2, 3] x` | `[1, 2, 3]` (un groupe), `x` | 2 |
| `"bonjour"` | un texte | 1 |

**À retenir :** `expr` = un calcul entier, `ident` = un nom, `ty` = un type, `tt` = un seul jeton (un groupe entre parenthèses compte pour un).

## 5. Plusieurs bras

Comme un `match`, une macro peut avoir plusieurs **bras**. Le premier qui correspond gagne.

```rust
macro_rules! decrire {
    () => {
        println!("rien");
    };
    ($x:expr) => {
        println!("une valeur : {}", $x);
    };
    ($x:expr, $y:expr) => {
        println!("deux valeurs : {} et {}", $x, $y);
    };
}

fn main() {
    decrire!();
    decrire!(1);
    decrire!(1, 2);
}
```

Si aucun bras ne correspond, le compilateur donne une erreur : `no rules expected the token ...`.

**Exemple résolu : quel bras pour chaque appel ?**

| Appel | Bras `()` | Bras `($x:expr)` | Bras `($x:expr, $y:expr)` | Affichage |
|---|---|---|---|---|
| `decrire!()` | correspond | | | `rien` |
| `decrire!(1)` | non (il y a quelque chose) | correspond, `$x = 1` | | `une valeur : 1` |
| `decrire!(1, 2)` | non | non (il reste `, 2`) | correspond | `deux valeurs : 1 et 2` |
| `decrire!(1, 2, 3)` | non | non | non (il reste `, 3`) | erreur de compilation |

Les bras sont essayés **de haut en bas**, et un bras ne correspond que s'il consomme **tout** l'appel.

### Des mots écrits tels quels dans le motif

Tout ce qui n'est pas une variable `$...` doit apparaître **exactement** dans l'appel. On peut donc inventer des mots-clés :

```rust
macro_rules! en_metres {
    ($n:tt km) => {
        $n as f64 * 1000.0
    };
    ($n:tt cm) => {
        $n as f64 / 100.0
    };
    ($n:tt m) => {
        $n as f64
    };
}

fn main() {
    let distance = 3;
    println!("{}", en_metres!(distance km));
    println!("{}", en_metres!(250 cm));
    println!("{}", en_metres!(12 m));
}
```

1. `en_metres!(distance km)` : premier bras, `$n = distance`, puis le mot `km` est bien là. Calcul `3 * 1000 = 3000`.
2. `en_metres!(250 cm)` : le premier bras attend `km`, il échoue ; le deuxième attend `cm`, il correspond. Calcul `250 / 100 = 2.5`.
3. `en_metres!(12 m)` : seul le troisième bras correspond : `12`.

> [!warning] Pourquoi `tt` et pas `expr` ici ?
> Après un `$x:expr`, Rust n'accepte que `=>`, `,` ou `;`. Le motif `($n:expr km)` est refusé à la définition (`$n:expr is followed by km, which is not allowed for expr fragments`). En effet, Rust ne saurait pas où l'expression s'arrête. Avec `tt`, on prend **un seul jeton** (un nombre ou une variable), donc aucune ambiguïté.

### Un bras qui peut échouer : renvoyer un `Option`

Un bras produit n'importe quel code, y compris un `if` qui renvoie `Some` ou `None` :

```rust
macro_rules! pourcentage {
    ($part:tt sur $total:tt) => {
        if $total == 0 { None } else { Some($part * 100 / $total) }
    };
}

fn main() {
    let total = 0;
    println!("{:?}", pourcentage!(3 sur 4));
    println!("{:?}", pourcentage!(5 sur total));
}
```

1. `3 sur 4` : `4` n'est pas 0, on calcule `3 * 100 / 4 = 75`, résultat `Some(75)`.
2. `5 sur total` : `total` vaut 0, on ne divise pas (une division entière par 0 ferait paniquer) : résultat `None`.

### Les délimiteurs de l'appel

Une macro s'appelle au choix avec `( )`, `[ ]` ou `{ }` : `decrire!(1)`, `decrire![1]` et `decrire!{1}` sont identiques. L'usage : `( )` en général, `[ ]` pour les listes (`vec![...]`), `{ }` pour un gros bloc. Quand la macro est appelée hors d'une fonction (pour créer une structure, par exemple) avec `( )` ou `[ ]`, il faut un `;` après l'appel ; avec `{ }`, non.

**À retenir :** les bras sont testés de haut en bas, chaque mot écrit dans le motif doit être présent dans l'appel, et un `expr` ne peut être suivi que de `=>`, `,` ou `;` (sinon, `tt`).

## 6. Les répétitions

La syntaxe `$( ... ) séparateur répétition` répète un motif :

- `*` : zéro ou plusieurs ;
- `+` : au moins un ;
- `?` : zéro ou un.

Dans le code produit, on répète avec la même syntaxe :

```rust
macro_rules! somme {
    ($($x:expr),*) => {
        0 $(+ $x)*
    };
}

fn main() {
    println!("{}", somme!(1, 2, 3));
    println!("{}", somme!());
}
```

**Exemple résolu : le dépliage de `somme!(1, 2, 3)`**

1. Le motif `$($x:expr),*` veut dire : des expressions `$x`, séparées par des virgules, zéro fois ou plus.
2. L'appel contient `1`, `2`, `3` : la répétition tourne 3 fois, `$x` vaut successivement `1`, `2`, `3`.
3. Dans le code produit, `$(+ $x)*` écrit `+ $x` **une fois par valeur capturée** : `+ 1 + 2 + 3`.
4. Avec le `0` devant : `0 + 1 + 2 + 3 = 6`.
5. Pour `somme!()`, il n'y a aucune valeur : la répétition ne produit rien, il reste `0`.

Le `0` du début n'est pas décoratif : sans lui, `somme!()` produirait un code vide, et `somme!(1, 2)` produirait `+ 1 + 2`, qui n'est pas valide.

Un exemple plus proche de la vie réelle, une version simple de `vec!` :

```rust
macro_rules! liste {
    ($($x:expr),* $(,)?) => {
        {
            let mut v = Vec::new();
            $( v.push($x); )*
            v
        }
    };
}

fn main() {
    let v = liste![10, 20, 30,];
    println!("{:?}", v);
}
```

> [!tip] La virgule finale
> `$(,)?` autorise une virgule en trop à la fin : `liste![1, 2,]`. Les macros de la std font la même chose.

Remarque les doubles accolades `{ { ... } }` : les premières entourent le corps de la macro, les secondes créent un bloc qui permet d'écrire plusieurs instructions et de renvoyer `v`.

### Répéter des instructions entières

La partie répétée peut contenir des instructions complètes, par exemple un `if` et des `println!`. Elle est recopiée une fois par élément capturé :

```rust
macro_rules! verifier {
    ($($condition:expr),+ $(,)?) => {
        $(
            if $condition {
                println!("OK     {}", stringify!($condition));
            } else {
                println!("ÉCHEC  {}", stringify!($condition));
            }
        )+
    };
}

fn main() {
    let age = 20;
    let nom = "Ada";
    verifier!(age >= 18, nom.len() > 5);
}
```

1. Deux conditions capturées : le bloc `$( if ... )+` est recopié deux fois.
2. Première copie : `age >= 18` est vrai (20 ≥ 18), et `stringify!` écrit le texte de la condition : `OK     age >= 18`.
3. Deuxième copie : `nom.len()` vaut 3, et `3 > 5` est faux : `ÉCHEC  nom.len() > 5`.

### Répéter des paires avec un symbole entre les deux

Une répétition peut capturer **plusieurs variables à la fois**. Le `=>` est permis après un `expr`, on peut donc écrire des paires :

```rust
macro_rules! afficher_notes {
    ($($nom:expr => $note:expr),* $(,)?) => {
        $(
            println!("{} : {}/20", $nom, $note);
        )*
    };
}

fn main() {
    afficher_notes! {
        "Ada" => 17,
        "Linus" => 9 + 3,
    }
}
```

1. Chaque élément de la répétition est de la forme `expr => expr`. On capture `("Ada", 17)` puis `("Linus", 9 + 3)`.
2. Le `println!` est recopié deux fois, `$nom` et `$note` avancent **ensemble** : `Ada : 17/20`, puis `Linus : 12/20`.
3. L'appel avec des `{ }` permet d'écrire les paires sur plusieurs lignes, et la virgule finale est acceptée grâce à `$(,)?`.

### Construire une collection depuis un tableau

`HashSet::from` et `HashMap::from` créent une collection à partir d'un **tableau** `[...]`. Une répétition peut fabriquer ce tableau :

```rust
use std::collections::HashSet;

macro_rules! ensemble {
    ($($x:expr),* $(,)?) => {
        HashSet::from([$($x),*])
    };
}

fn main() {
    let couleurs = ensemble!["rouge", "vert", "rouge"];
    println!("{}", couleurs.len());
    let vide: HashSet<i32> = ensemble![];
    println!("{}", vide.is_empty());
}
```

1. `ensemble!["rouge", "vert", "rouge"]` devient `HashSet::from(["rouge", "vert", "rouge"])`. Le `$($x),*` remet les virgules entre les éléments.
2. Un ensemble garde chaque valeur une seule fois : `"rouge"` en double ne compte qu'une fois, la taille vaut 2.
3. `ensemble![]` devient `HashSet::from([])` : un tableau vide ne dit pas le type des éléments, il faut l'écrire (`HashSet<i32>`).

Pour une `HashMap`, le tableau contient des **paires** : `HashMap::from([("a", 1), ("b", 2)])`. Dans le code produit, on peut écrire des parenthèses autour de deux variables répétées : `$( ($a, $b) ),*`.

### Générer des items entiers (structures, `impl`)

Une macro peut produire une `struct`, un `enum` et son `impl`. Une répétition **à l'intérieur** génère alors un champ, une variante ou une méthode par élément :

```rust
macro_rules! enumeration {
    ($nom:ident { $($variante:ident),* $(,)? }) => {
        #[derive(Debug)]
        enum $nom {
            $($variante),*
        }

        impl $nom {
            fn toutes() -> Vec<$nom> {
                vec![$($nom::$variante),*]
            }

            fn texte(&self) -> &'static str {
                match self {
                    $($nom::$variante => stringify!($variante)),*
                }
            }
        }
    };
}

enumeration!(Couleur { Rouge, Vert, Bleu });

fn main() {
    for c in Couleur::toutes() {
        println!("{:?} s'écrit {}", c, c.texte());
    }
}
```

1. Le motif lit un nom (`$nom = Couleur`), puis entre accolades une liste de noms séparés par des virgules (`Rouge`, `Vert`, `Bleu`).
2. `enum $nom { $($variante),* }` devient `enum Couleur { Rouge, Vert, Bleu }`.
3. `vec![$($nom::$variante),*]` devient `vec![Couleur::Rouge, Couleur::Vert, Couleur::Bleu]`. `$nom` n'est capturé qu'une fois, mais on peut le réutiliser dans chaque répétition.
4. Le `match` reçoit un bras par variante : `Couleur::Rouge => "Rouge"`, etc.
5. L'appel est placé **hors** de `main` (c'est là qu'on définit les types), avec `( )`, donc il se termine par `;`.

> [!warning] Variable encore répétée
> Une variable capturée dans une répétition (`$variante`) ne peut être utilisée **que** dans une répétition `$( ... )` du code produit. L'oublier donne l'erreur `variable 'variante' is still repeating at this depth`.

**À retenir :** une répétition `$( ... ),*` du motif se rejoue avec `$( ... )*` dans le code produit, une fois par élément, et elle peut produire des valeurs, des instructions ou des items complets.

## 7. Les macros récursives

Une macro peut s'appeler elle-même. On traite un élément, puis on relance sur le reste.

```rust
macro_rules! produit {
    ($x:expr) => { $x };
    ($x:expr, $($reste:expr),+) => {
        $x * produit!($($reste),+)
    };
}

fn main() {
    println!("{}", produit!(5));
    println!("{}", produit!(2, 3, 4));
}
```

Le premier bras est le **cas de base** (un seul élément). Le deuxième prend le premier élément et rappelle la macro avec les autres.

**Exemple résolu : le dépliage de `produit!(2, 3, 4)`**

| Étape | Appel | Bras choisi | Résultat |
|---|---|---|---|
| 1 | `produit!(2, 3, 4)` | 2e : `$x = 2`, reste `3, 4` | `2 * produit!(3, 4)` |
| 2 | `produit!(3, 4)` | 2e : `$x = 3`, reste `4` | `3 * produit!(4)` |
| 3 | `produit!(4)` | 1er (une seule valeur) | `4` |

En remontant : `2 * (3 * 4) = 2 * 12 = 24`. Pour `produit!(5)`, on tombe tout de suite dans le cas de base : `5`.

Pourquoi le bras 2 utilise `+` et pas `*` : il faut **au moins une** valeur dans le reste. Avec `*`, l'appel `produit!(5)` correspondrait aussi au bras 2 (avec un reste vide), et `produit!()` serait rappelé sans aucun bras pour l'accepter.

L'ordre des bras compte : le cas de base est placé en premier pour qu'un seul élément s'arrête là.

Même principe pour compter. Voici une version qui compte des expressions séparées par des virgules :

```rust
macro_rules! nb_arguments {
    () => { 0usize };
    ($premier:expr $(, $reste:expr)*) => { 1usize + nb_arguments!($($reste),*) };
}

fn main() {
    println!("{}", nb_arguments!());
    println!("{}", nb_arguments!(10, "a", 2 + 2));
}
```

1. `nb_arguments!(10, "a", 2 + 2)` : `$premier = 10`, le reste est `"a", 2 + 2`. Résultat `1 + nb_arguments!("a", 2 + 2)`.
2. Puis `1 + nb_arguments!(2 + 2)`, puis `1 + nb_arguments!()`.
3. `nb_arguments!()` tombe dans le cas de base : `0`. Total : `1 + 1 + 1 + 0 = 3`.

Pour compter des **jetons** séparés par des espaces, c'est la même idée avec `tt`, sans virgule : un bras vide pour 0, et un bras qui prend un premier `tt` puis le reste `$($reste:tt)*`.

> [!tip] Le type du résultat
> `0` tout seul est un entier dont Rust devine le type (souvent `i32`). Écrire `0usize` et `1usize` force le type `usize`, celui des tailles et des longueurs (`v.len()` renvoie un `usize`).

> [!warning] Limite de récursion
> Le compilateur limite la profondeur (128 par défaut). Une macro récursive sur une très longue liste peut échouer avec `recursion limit reached`.

**À retenir :** une macro récursive = un cas de base (rien ou un seul élément) **en premier**, puis un bras « un élément + le reste » qui se rappelle sur le reste.

## 8. `#[derive]` : une macro qui écrit l'`impl`

`#[derive(Debug, Clone, PartialEq)]` n'est pas magique : c'est une **macro** qui lit la définition de ta structure et écrit l'implémentation des traits.

```rust
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = a.clone();
    println!("{:?} {}", a, a == b);
}
```

Sans `derive`, il faudrait écrire chaque `impl` à la main. L'outil `cargo expand` permet de voir le code généré.

**Exemple résolu : ce que `derive` écrit à ta place (en simplifié)**

Pour `Clone` et `PartialEq`, la macro lit les champs `x` et `y`, puis produit à peu près :

```text
impl Clone for Point {
    fn clone(&self) -> Point {
        Point { x: self.x.clone(), y: self.y.clone() }
    }
}

impl PartialEq for Point {
    fn eq(&self, autre: &Point) -> bool {
        self.x == autre.x && self.y == autre.y
    }
}
```

1. `a.clone()` copie chaque champ : `b` vaut `Point { x: 1, y: 2 }`.
2. `a == b` compare champ par champ : `1 == 1` et `2 == 2`, donc `true`.
3. `{:?}` utilise l'`impl Debug` générée : `Point { x: 1, y: 2 }`.

L'affichage complet est donc `Point { x: 1, y: 2 } true`. `derive` ne lance rien et ne change pas le mode de compilation : il **écrit du code**.

**À retenir :** `#[derive(Trait)]` = une macro qui lit ta structure et écrit l'`impl Trait` champ par champ.

## 9. Les macros procédurales (survol)

Une macro procédurale est une **fonction Rust exécutée par le compilateur** : des jetons entrent, des jetons sortent. Elle est plus puissante que `macro_rules!`, mais elle doit être dans une **crate séparée** (un projet à part, de type `proc-macro`). On ne peut donc pas l'essayer ici.

Il en existe trois familles :

| Famille | Exemple d'usage |
|---|---|
| **derive** | `#[derive(Serialize)]` (serde) |
| **attribut** | `#[tokio::main]`, `#[test]` |
| **fonction** | `sqlx::query!("SELECT ...")` |

```text
use proc_macro::TokenStream;

#[proc_macro]
pub fn quarante_deux(_entree: TokenStream) -> TokenStream {
    "40 + 2".parse().unwrap()
}
```

```text
#[proc_macro_derive(Bonjour)]
pub fn derive_bonjour(entree: TokenStream) -> TokenStream {
    ...
}
```

```text
#[proc_macro_attribute]
pub fn chronometre(attribut: TokenStream, fonction: TokenStream) -> TokenStream {
    ...
}
```

En pratique, les crates `syn` (lire le code) et `quote` (écrire le code) aident à les écrire. Retiens surtout leur existence : tu les **utilises** bien plus souvent que tu ne les écris.

**Exemple résolu : reconnaître la famille**

| Ce que tu écris | Où est la macro | Famille |
|---|---|---|
| `#[derive(Serialize)] struct Client { ... }` | dans `derive(...)`, au-dessus d'un type | derive : ajoute un `impl` |
| `#[tokio::main] async fn main() { ... }` | attribut seul au-dessus d'une fonction | attribut : peut réécrire toute la fonction |
| `query!("SELECT * FROM t")` | un appel avec `!` | fonction : ressemble à `macro_rules!`, mais c'est du code Rust qui tourne |

`quarante_deux!()` (le premier exemple) reçoit des jetons et renvoie les jetons `40 + 2` : à l'endroit de l'appel, on obtient donc `40 + 2`.

**À retenir :** procédurale = une fonction qui transforme des jetons, dans une crate `proc-macro` à part ; trois formes : `#[derive(...)]`, `#[attribut]`, `nom!(...)`.

## 10. L'hygiène

Les variables créées **dans** une macro ne se mélangent pas avec celles de l'appelant. C'est l'**hygiène**.

```rust
macro_rules! double_plus_un {
    ($e:expr) => {{
        let x = 2;
        $e * x + 1
    }};
}

fn main() {
    let x = 10;
    println!("{}", double_plus_un!(x));
}
```

Le `x` de la macro (valeur 2) et le `x` de `main` (valeur 10) sont deux variables différentes. Le résultat est `10 * 2 + 1 = 21`.

**Exemple résolu : pourquoi 21 ?**

1. L'appel passe le `x` **de `main`** : `$e` désigne la variable de `main`, qui vaut 10.
2. Dans la macro, `let x = 2;` crée une **autre** variable, qui n'existe que dans la macro. Rust les distingue, même si elles ont le même nom.
3. `$e * x + 1` = (le `x` de `main`) × (le `x` de la macro) + 1 = `10 * 2 + 1 = 21`.
4. Sans hygiène (copie de texte comme en C), on obtiendrait `x * x + 1` avec le seul `x` visible, celui de la macro : `2 * 2 + 1 = 5`. C'est le genre de bug que l'hygiène empêche.

> [!warning] Les noms d'items ne sont pas protégés
> L'hygiène protège les variables locales. Les fonctions, structures et champs générés par une macro, eux, sont visibles normalement : c'est ce qui permet à `getter!` de créer une vraie méthode.

**À retenir :** un `let` écrit dans une macro reste privé à la macro ; seuls les items générés (fonctions, structures) sont visibles dehors.

## 11. Fonction ou macro ?

Écris une **fonction** quand tu peux : elle est plus simple à lire, à tester et ses erreurs sont plus claires.

Choisis une **macro** seulement pour :

- un nombre variable d'arguments (`vec!`, `println!`) ;
- générer du code répétitif ou des noms (`getter!`) ;
- une petite syntaxe sur mesure (`hashmap!{ "a" => 1 }`).

> [!tip] Règle pratique
> Une fonction générique `fn max<T: PartialOrd>(a: T, b: T) -> T` suffit pour deux valeurs. Une macro `maximum!` est utile quand on veut accepter 1, 2, 3... valeurs.

**Exemple résolu : fonction ou macro ?**

| Besoin | Une fonction peut ? | Choix |
|---|---|---|
| calculer la moyenne de deux `f64` | oui, deux paramètres fixes | fonction |
| additionner deux valeurs de n'importe quel type numérique | oui, avec un générique `T: Add` | fonction générique |
| additionner 2, 3 ou 10 valeurs écrites à la suite | non, le nombre de paramètres est fixe | macro (ou une fonction qui reçoit une tranche `&[T]`) |
| créer une méthode `age()` pour un champ `age` | non, une fonction ne crée pas de noms | macro |
| afficher le texte d'une expression et sa valeur | non, une fonction ne reçoit que la valeur | macro (`stringify!`) |

**À retenir :** essaie d'abord une fonction (générique si besoin) ; passe à la macro seulement si la fonction ne **peut pas** faire le travail.

## 12. Pièges courants

- **Oublier le `;` entre les bras** : chaque bras se termine par `;` (sauf éventuellement le dernier).
- **Utiliser la macro avant sa définition** : elle n'existe pas encore pour le compilateur.
- **Oublier les doubles accolades** quand le corps contient plusieurs instructions.
- **Évaluer deux fois une expression** : si `$x` apparaît deux fois, l'expression est calculée deux fois. Range-la dans un `let` d'abord.
- **Mauvais séparateur** : un `expr` ne peut être suivi que de `=>`, `,` ou `;`. Pour `calculer!(2 plus 3)`, utilise `tt`.
- **Messages d'erreur difficiles** : une macro complexe produit des erreurs peu lisibles. Garde-les petites.

**Exemple résolu : l'expression calculée deux fois**

```rust
macro_rules! double_mauvais {
    ($x:expr) => {
        $x + $x
    };
}

macro_rules! double_bon {
    ($x:expr) => {{
        let valeur = $x;
        valeur + valeur
    }};
}

fn suivant(compteur: &mut i32) -> i32 {
    *compteur += 1;
    *compteur
}

fn main() {
    let mut a = 0;
    println!("{}", double_mauvais!(suivant(&mut a)));
    let mut b = 0;
    println!("{}", double_bon!(suivant(&mut b)));
}
```

1. `double_mauvais!(suivant(&mut a))` devient `suivant(&mut a) + suivant(&mut a)` : la fonction est appelée **deux fois**. Le premier appel renvoie 1, le second 2 : affiche `3` au lieu de `2`.
2. `double_bon!` range le résultat dans `valeur` **une seule fois** (`suivant` renvoie 1), puis calcule `1 + 1` : affiche `2`.
3. Les doubles accolades `{{ ... }}` sont nécessaires : le corps contient un `let` **et** une valeur à renvoyer.

C'est la même raison pour laquelle une macro qui compare deux valeurs (un maximum, un minimum) range d'abord chaque valeur dans un `let` avant le `if`.

**À retenir :** si `$x` sert plusieurs fois, commence par `let valeur = $x;` dans un bloc `{{ ... }}`.

## En résumé

| Outil | Syntaxe | Exemple |
|---|---|---|
| Macro déclarative | `macro_rules!` | `carre!(3)` |
| Fragments | `$x:expr`, `$n:ident`, `$t:ty`, `$j:tt` | `getter!(age: u32)` |
| Répétition | `$( ... ),*` | `somme!(1, 2, 3)` |
| Récursion | la macro s'appelle elle-même | `maximum!(1, 5, 3)` |
| Derive | `#[derive(...)]` | `#[derive(Debug)]` |
| Procédurales | crate séparée | `#[tokio::main]` |
