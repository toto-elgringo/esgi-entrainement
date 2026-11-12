# Les macros

## 1. C'est quoi une macro ?

Une macro est du **code qui écrit du code**. Elle se reconnaît au `!` après son nom : `println!`, `vec!`, `format!`.

Le compilateur remplace l'appel de la macro par le code qu'elle produit. On appelle ça **déplier** (ou *expanser*) la macro. Cela se passe **avant** la vérification des types.

Une fonction ne peut pas tout faire. Une macro, elle, peut :

- accepter un **nombre variable d'arguments** (`println!("{} {}", a, b)`) ;
- **générer des noms** de fonctions, de champs, de types ;
- écrire du code répétitif à ta place.

## 2. Les macros de la bibliothèque standard

Tu en utilises déjà beaucoup :

```rust
fn main() {
    let v = vec![1, 2, 3];
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

## 3. `macro_rules!` : un `match` sur du code

Une macro déclarative se définit avec `macro_rules!`. Elle ressemble à un `match` : à gauche de `=>` le **motif**, à droite le **code produit**.

```rust
macro_rules! carre {
    ($x:expr) => {
        $x * $x
    };
}

fn main() {
    println!("{}", carre!(4));
    println!("{}", carre!(1 + 2));
}
```

Le deuxième appel affiche `9` et non `5` : `$x` est capturé comme une **expression entière**, donc le calcul est `(1 + 2) * (1 + 2)`.

> [!info] Différence avec le C
> Les macros du C (`#define`) copient du texte. Celles de Rust manipulent des morceaux de code déjà analysés : plus sûr, pas de parenthèses oubliées.

Une macro doit être **définie avant** d'être utilisée dans le fichier.

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

> [!tip] `tt` : le joker
> `tt` accepte presque n'importe quel jeton. Il est très pratique pour recevoir des mots-clés personnalisés ou pour parcourir une liste élément par élément.

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

## 7. Les macros récursives

Une macro peut s'appeler elle-même. On traite un élément, puis on relance sur le reste.

```rust
macro_rules! maximum {
    ($x:expr) => { $x };
    ($x:expr, $($reste:expr),+) => {{
        let a = $x;
        let b = maximum!($($reste),+);
        if a > b { a } else { b }
    }};
}

fn main() {
    println!("{}", maximum!(3));
    println!("{}", maximum!(4, 9, 2));
}
```

Le premier bras est le **cas de base** (un seul élément). Le deuxième prend le premier élément et rappelle la macro avec les autres.

Même principe pour compter avec `tt` :

```rust
macro_rules! compter {
    () => { 0 };
    ($premier:tt $($reste:tt)*) => { 1 + compter!($($reste)*) };
}

fn main() {
    println!("{}", compter!(a b c d));
}
```

> [!warning] Limite de récursion
> Le compilateur limite la profondeur (128 par défaut). Une macro récursive sur une très longue liste peut échouer avec `recursion limit reached`.

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

> [!warning] Les noms d'items ne sont pas protégés
> L'hygiène protège les variables locales. Les fonctions, structures et champs générés par une macro, eux, sont visibles normalement : c'est ce qui permet à `getter!` de créer une vraie méthode.

## 11. Fonction ou macro ?

Écris une **fonction** quand tu peux : elle est plus simple à lire, à tester et ses erreurs sont plus claires.

Choisis une **macro** seulement pour :

- un nombre variable d'arguments (`vec!`, `println!`) ;
- générer du code répétitif ou des noms (`getter!`) ;
- une petite syntaxe sur mesure (`hashmap!{ "a" => 1 }`).

> [!tip] Règle pratique
> Une fonction générique `fn max<T: PartialOrd>(a: T, b: T) -> T` suffit pour deux valeurs. Une macro `maximum!` est utile quand on veut accepter 1, 2, 3... valeurs.

## 12. Pièges courants

- **Oublier le `;` entre les bras** : chaque bras se termine par `;` (sauf éventuellement le dernier).
- **Utiliser la macro avant sa définition** : elle n'existe pas encore pour le compilateur.
- **Oublier les doubles accolades** quand le corps contient plusieurs instructions.
- **Évaluer deux fois une expression** : si `$x` apparaît deux fois, l'expression est calculée deux fois. Range-la dans un `let` d'abord.
- **Mauvais séparateur** : un `expr` ne peut être suivi que de `=>`, `,` ou `;`. Pour `calculer!(2 plus 3)`, utilise `tt`.
- **Messages d'erreur difficiles** : une macro complexe produit des erreurs peu lisibles. Garde-les petites.

## En résumé

| Outil | Syntaxe | Exemple |
|---|---|---|
| Macro déclarative | `macro_rules!` | `carre!(3)` |
| Fragments | `$x:expr`, `$n:ident`, `$t:ty`, `$j:tt` | `getter!(age: u32)` |
| Répétition | `$( ... ),*` | `somme!(1, 2, 3)` |
| Récursion | la macro s'appelle elle-même | `maximum!(1, 5, 3)` |
| Derive | `#[derive(...)]` | `#[derive(Debug)]` |
| Procédurales | crate séparée | `#[tokio::main]` |
