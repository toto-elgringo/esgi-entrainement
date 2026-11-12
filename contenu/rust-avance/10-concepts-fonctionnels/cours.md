# Concepts fonctionnels

Ce chapitre prend du recul : pourquoi la programmation fonctionnelle (PF) existe, ce qu'elle apporte, et quelques techniques que le chapitre « Programmation fonctionnelle » du cours Rust n'a pas vues : curryfication, point-free, pipe, motifs sur les slices.

> [!info] Déjà vu ailleurs
> Fonctions pures, `fold` / `scan`, `Option` et `Result` en chaîne, récursion, itérateurs maison et immuabilité sont dans le chapitre « Programmation fonctionnelle » du cours Rust. Newtype, typestate et « états illégaux impossibles » sont dans « Programmation par les types ». Ici, on ne les répète pas.

## 1. Pourquoi la PF n'est pas la norme

- **Abstraction élevée** : elle vient des mathématiques, le vocabulaire (monade, foncteur) fait peur.
- **Courbe d'apprentissage** : il faut changer sa façon de penser, pas seulement la syntaxe.
- **Héritage** : C, C++, Java, Python sont impératifs ou objets, et l'industrie s'est construite dessus.
- **Peu de formations** : peu d'écoles l'enseignent, donc peu de développeurs la maîtrisent.

Pourquoi l'apprendre quand même ?

| Intérêt | Ce que ça veut dire |
|---|---|
| **Robustesse** | plus d'erreurs attrapées à la compilation, moins de bugs à l'exécution |
| **Vélocité** | code lisible, court, qui se documente par ses types ; ce qu'on apprend sert dans tous les langages |

## 2. D'où ça vient

- **Années 1930** : le *calcul lambda* d'Alonzo Church, une façon de calculer avec uniquement des fonctions, sans état qui change.
- **1958** : LISP, un des premiers langages à utiliser ces idées.
- **1973** : ML, qui apporte le typage fort.
- **1990** : Haskell, langage *purement* fonctionnel, fait pour explorer les idées de la PF.

Langages **purement** fonctionnels : Haskell, Elm, Idris, PureScript. Langages **multi-paradigmes** qui en prennent beaucoup : Scala, F#, OCaml, Clojure, Elixir, et Rust.

La PF est un **ensemble de pratiques**, applicable dans n'importe quel langage. Certains langages la rendent juste plus agréable que d'autres.

## 3. Impératif contre déclaratif

- **Impératif** : on décrit le **comment** (boucles, variables qu'on modifie, étapes dans l'ordre).
- **Déclaratif** : on décrit le **quoi** (ce qu'on veut obtenir), le « comment » est caché dans des fonctions réutilisables.

```rust
fn somme_carres_pairs_imperatif(nombres: &[i32]) -> i32 {
    let mut total = 0;
    for &n in nombres {
        if n % 2 == 0 {
            total += n * n;
        }
    }
    total
}

fn somme_carres_pairs(nombres: &[i32]) -> i32 {
    nombres.iter().filter(|n| *n % 2 == 0).map(|n| n * n).sum()
}

let donnees = [1, 2, 3, 4, 5, 6];
assert_eq!(somme_carres_pairs_imperatif(&donnees), 56);
assert_eq!(somme_carres_pairs(&donnees), 56);
```

La deuxième version se lit comme la consigne : « garde les pairs, mets au carré, additionne ».

## 4. Typage statique ou dynamique

| | Dynamique (Python, JavaScript, Ruby, PHP) | Statique (Rust, Java, C++, TypeScript) |
|---|---|---|
| Types vérifiés | à l'exécution | à la compilation |
| Avantage | écriture rapide, prototypes | erreurs trouvées tôt, optimisations, types qui documentent |
| Risque | une erreur de type peut n'apparaître qu'en production | il faut écrire (ou laisser deviner) les types |

La PF aime le typage statique : une fonction `fn(i32, i32) -> i32` est un **contrat** lisible. Ce qui entre, ce qui sort, rien d'autre.

## 5. Fonctions d'ordre supérieur et closures

Une fonction **d'ordre supérieur** prend une fonction en paramètre, ou en renvoie une. `map`, `filter` et `fold` en sont. Une **closure** est une fonction anonyme qui peut **capturer** des variables autour d'elle.

```rust
fn creer_compteur() -> impl FnMut() -> i32 {
    let mut compte = 0;
    move || {
        compte += 1;
        compte
    }
}

let mut compteur = creer_compteur();
let mut autre = creer_compteur();
assert_eq!(compteur(), 1);
assert_eq!(compteur(), 2);
assert_eq!(autre(), 1);
assert_eq!(compteur(), 3);
```

`move` donne la variable `compte` à la closure : elle la garde même après la fin de `creer_compteur`. Chaque compteur a **sa propre copie**. Comme la closure modifie son état, son type est `FnMut` et la variable qui la contient doit être `mut`.

> [!info] Fn, FnMut, FnOnce
> `Fn` lit seulement ce qu'elle capture, `FnMut` le modifie, `FnOnce` le consomme (donc un seul appel).

## 6. La boîte à outils des itérateurs

| Méthode | Rôle | Renvoie |
|---|---|---|
| `map(f)` | transforme chaque élément | un itérateur |
| `filter(p)` | garde ceux qui valident `p` | un itérateur |
| `fold(init, f)` | réduit tout à une seule valeur | la valeur |
| `for_each(f)` | exécute `f` pour chaque élément (effet de bord) | `()` |
| `find(p)` | premier élément qui valide `p` | `Option<élément>` |
| `position(p)` | **index** du premier qui valide `p` | `Option<usize>` |
| `any(p)` | au moins un valide `p` ? | `bool` |
| `all(p)` | tous valident `p` ? | `bool` |

```rust
let nombres = vec![3, 8, 5, 12, 7];

assert_eq!(nombres.iter().find(|n| **n % 2 == 0), Some(&8));
assert_eq!(nombres.iter().position(|n| *n % 2 == 0), Some(1));
assert!(nombres.iter().any(|n| *n > 10));
assert!(!nombres.iter().all(|n| *n > 3));

let mut vus = Vec::new();
nombres.iter().for_each(|n| vus.push(n * 10));
assert_eq!(vus, vec![30, 80, 50, 120, 70]);
```

> [!tip] Paresse
> `map` et `filter` ne calculent rien tant qu'un consommateur (`collect`, `sum`, `fold`, `for_each`...) ne réclame pas les valeurs.

## 7. Curryfication et application partielle

Une fonction **curryfiée** ne prend qu'un argument à la fois : au lieu de `f(a, b)`, on écrit `f(a)(b)`. Appeler `f(a)` renvoie une **nouvelle fonction** qui attend `b`.

Rust ne le fait pas tout seul. On le **simule** avec une fonction qui renvoie une closure.

```rust
fn multiplier(x: i32) -> impl Fn(i32) -> i32 {
    move |y| x * y
}

let double = multiplier(2);
let triple = multiplier(3);
assert_eq!(double(5), 10);
assert_eq!(triple(5), 15);
assert_eq!(multiplier(4)(5), 20);
```

Fixer un argument pour obtenir une fonction plus simple s'appelle l'**application partielle**. `double` est `multiplier` appliquée partiellement avec 2.

On peut aussi transformer n'importe quelle fonction à deux arguments :

```rust
fn fixer_premier<A: Clone, B, C>(f: impl Fn(A, B) -> C, a: A) -> impl Fn(B) -> C {
    move |b| f(a.clone(), b)
}

let ajouter = |a: i32, b: i32| a + b;
let plus_dix = fixer_premier(ajouter, 10);
assert_eq!(plus_dix(5), 15);
```

> [!info] En Haskell
> Dans un langage purement fonctionnel, **toutes** les fonctions sont curryfiées. En Rust, on choisit : fonction classique, ou version curryfiée quand l'application partielle sert.

Même idée avec une collection : `map` curryfié renvoie une fonction « qui transforme une liste ».

```rust
fn appliquer_a_tous<T, U>(f: impl Fn(&T) -> U) -> impl Fn(&[T]) -> Vec<U> {
    move |liste| liste.iter().map(&f).collect()
}

let doubler_tout = appliquer_a_tous(|x: &i32| x * 2);
assert_eq!(doubler_tout(&[1, 2, 3]), vec![2, 4, 6]);
```

## 8. Le style point-free

Un code est **point-free** quand on ne nomme pas les arguments : on passe la fonction elle-même au lieu d'une closure qui l'appelle.

```rust
fn double(x: i32) -> i32 {
    x * 2
}

let nombres = vec![1, 2, 3];
let avec_parametre: Vec<i32> = nombres.iter().map(|x| double(*x)).collect();
let point_free: Vec<i32> = nombres.iter().copied().map(double).collect();
assert_eq!(avec_parametre, point_free);

let majuscules: Vec<String> = ["a", "b"].into_iter().map(str::to_uppercase).collect();
assert_eq!(majuscules, vec!["A", "B"]);
```

`|x| double(x)` et `double` font la même chose : la deuxième écriture est plus courte. Les méthodes aussi se passent ainsi : `str::to_uppercase`, `str::len`, `i32::abs`, `String::from`.

> [!warning] À ne pas pousser trop loin
> Le point-free est un outil de lisibilité. Si l'écriture demande de jongler avec les types ou les références, garde la closure.

## 9. Pipe : enchaîner les transformations

Le **pipe** fait passer une valeur d'une fonction à la suivante : la sortie de l'une est l'entrée de l'autre. Rust n'a pas d'opérateur pipe, mais le **chaînage de méthodes** joue ce rôle :

```rust
fn ajouter_suffixe(suffixe: &str) -> impl Fn(String) -> String {
    move |s| s + suffixe
}

let resultat = Some("hello")
    .map(str::to_uppercase)
    .map(|s| format!("\"{s}\""))
    .map(ajouter_suffixe("!"))
    .unwrap();
assert_eq!(resultat, "\"HELLO\"!");
```

Pour avoir un pipe sur **n'importe quelle valeur**, on peut écrire un trait d'extension (un trait qu'on implémente pour tous les types) :

```rust
trait Pipe: Sized {
    fn pipe<R>(self, f: impl FnOnce(Self) -> R) -> R {
        f(self)
    }
}

impl<T> Pipe for T {}

let texte = "  rust  "
    .pipe(str::trim)
    .pipe(str::to_uppercase)
    .pipe(|s| format!("<{s}>"));
assert_eq!(texte, "<RUST>");
assert_eq!(5.pipe(|x| x + 1).pipe(|x| x * 2), 12);
```

On lit de haut en bas, dans l'ordre où les choses se passent. Chaque étape est une petite fonction testable seule.

## 10. Pattern matching sur des slices

Un `match` peut décrire la **forme** d'une slice (`&[T]`) : vide, un élément, deux éléments, un premier suivi du reste...

```rust
fn decrire(liste: &[i32]) -> String {
    match liste {
        [] => "vide".to_string(),
        [seul] => format!("un seul : {seul}"),
        [a, b] => format!("deux : {a} et {b}"),
        [premier, .., dernier] => format!("de {premier} à {dernier}"),
    }
}

assert_eq!(decrire(&[]), "vide");
assert_eq!(decrire(&[4]), "un seul : 4");
assert_eq!(decrire(&[4, 5]), "deux : 4 et 5");
assert_eq!(decrire(&[4, 5, 6, 7]), "de 4 à 7");
```

`..` ignore le milieu, `reste @ ..` le **garde** sous le nom `reste`. On peut ajouter une **garde** (`if ...`) :

```rust
fn somme(liste: &[i32]) -> i32 {
    match liste {
        [] => 0,
        [premier, reste @ ..] => premier + somme(reste),
    }
}

fn est_croissante(liste: &[i32]) -> bool {
    match liste {
        [a, b, ..] if a > b => false,
        [_, reste @ ..] if reste.len() > 1 => est_croissante(reste),
        _ => true,
    }
}

assert_eq!(somme(&[1, 2, 3, 4]), 10);
assert!(est_croissante(&[1, 2, 2, 5]));
assert!(!est_croissante(&[1, 3, 2]));
```

C'est la version fonctionnelle d'une boucle : un cas de base, un cas « premier + reste ». Le compilateur vérifie que **tous** les cas sont couverts.

## 11. Option, la monade « Maybe »

Une **monade** est un type « boîte » qui possède une façon d'enchaîner des calculs en gérant l'effet à sa place. `Option<T>` est la monade **Maybe** : la boîte contient une valeur (`Some`) ou rien (`None`). Le contraste avec `panic!` :

```rust
fn diviser_panique(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        panic!("division par zéro");
    }
    a / b
}

fn diviser(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 { None } else { Some(a / b) }
}

assert_eq!(diviser_panique(10.0, 4.0), 2.5);
let moitie = diviser(10.0, 2.0);
let impossible = moitie.and_then(|x| diviser(x, 0.0));
assert_eq!(impossible, None);
assert_eq!(impossible.map(|x| x + 1.0).unwrap_or(-1.0), -1.0);
```

- La signature de `diviser_panique` **ment** : rien n'indique qu'elle peut planter, et on ne sait pas pourquoi.
- Avec `Option`, l'absence est dans le type : le compilateur t'oblige à la traiter.
- `map` transforme la valeur si elle existe, `and_then` enchaîne un calcul qui peut lui-même échouer, `unwrap_or` donne une valeur par défaut.

Pour savoir **pourquoi** ça a échoué, on utilise `Result<T, E>`, qui s'enchaîne avec les mêmes `map` et `and_then` (voir le chapitre « Programmation fonctionnelle »).

## 12. Un aperçu de la théorie des catégories

Les mots **foncteur** et **monade** viennent de la *théorie des catégories*, une branche des mathématiques qui décrit des structures par leurs opérations. Pas besoin des maths pour l'utiliser : pense **interfaces**.

| Mot | Ce qu'il promet | En Rust |
|---|---|---|
| Foncteur | on peut appliquer une fonction à ce qu'il contient (`map`) | `Option::map`, `Iterator::map` |
| Monade | on peut enchaîner des calculs qui renvoient la même « boîte » (`and_then`) | `Option::and_then`, `Result::and_then` |

En JavaScript, le projet **Fantasy Land** est une spécification qui nomme ces interfaces pour que les bibliothèques soient compatibles entre elles. L'équivalent en Rust ressemble à un **trait**, même si le langage ne permet pas (encore) d'écrire un trait « Monade » général.

## 13. Pour continuer

- Livres : *Learn You a Haskell for Great Good* (gratuit en ligne), *Functional-Light JS*, *Mostly Adequate Guide*.
- Conférences de Scott Wlaschin sur la programmation fonctionnelle et le *type driven development* (YouTube).
- Liste de ressources *awesome-functional-programming* sur GitHub.
- En TypeScript : la bibliothèque *ts-belt* pour s'entraîner à la PF.

## À retenir

- La PF apporte robustesse et lisibilité ; elle vient du calcul lambda, de LISP, ML et Haskell.
- Déclaratif = le **quoi**, impératif = le **comment**.
- Closure capturante + `move` : un état privé par appel de la fonction fabrique (`FnMut`).
- Curryfication = `f(a)(b)`, simulée avec une fonction qui renvoie une closure ; l'application partielle fixe un argument.
- Point-free : passer `double` plutôt que `|x| double(x)`.
- Pipe : chaînage de méthodes, ou un petit trait `pipe`.
- Les motifs de slices (`[premier, reste @ ..]`) remplacent les boucles par des cas.
- `Option` est le « Maybe » : l'absence est dans le type, `map` / `and_then` / `unwrap_or` remplacent `panic!`.
