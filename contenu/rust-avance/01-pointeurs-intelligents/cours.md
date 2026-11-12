# Pointeurs intelligents

## 1. C'est quoi un pointeur intelligent ?

Une **référence** (`&T`) emprunte une valeur : elle ne possède rien. Un **pointeur intelligent** est une structure qui **possède** la valeur vers laquelle il pointe, et qui fait un petit travail en plus (libérer la mémoire, compter les propriétaires...).

Tu en as déjà croisé sans le savoir : `String` et `Vec<T>` sont des pointeurs intelligents. Ce chapitre voit les autres :

| Type | Rôle |
|---|---|
| `Box<T>` | mettre une valeur sur le tas, un seul propriétaire |
| `Rc<T>` | plusieurs propriétaires (comptage de références) |
| `Weak<T>` | lien qui ne garde pas la valeur en vie |
| `Arc<T>` | comme `Rc`, mais utilisable entre threads |

Deux traits donnent leur comportement à ces types : `Deref` (se comporter comme une référence) et `Drop` (faire quelque chose quand la valeur disparaît).

> [!info] Pile et tas
> La **pile** (stack) est une zone rapide où les variables locales ont une taille connue à la compilation. Le **tas** (heap) est une zone plus souple, pour les données dont la taille change ou qu'on veut garder plus longtemps. Une variable sur la pile peut contenir une adresse vers le tas.

## 2. `Box<T>` : une valeur sur le tas

```rust
let x = Box::new(5);
println!("{}", x);
println!("{}", *x + 1);
```

`Box::new(5)` place le `5` sur le tas. La variable `x` (sur la pile) contient juste l'adresse. On accède à la valeur avec `*x`. Quand `x` sort de la portée, la mémoire du tas est libérée automatiquement.

Une `Box` sert dans trois cas :

1. un type **récursif** dont la taille n'est pas connue ;
2. une **grosse valeur** qu'on veut déplacer sans la copier ;
3. un **objet de trait** (`Box<dyn Trait>`).

### Types récursifs

Une liste chaînée contient une liste... Sans `Box`, le compilateur ne peut pas calculer la taille du type : elle serait infinie.

```rust
enum Liste {
    Cons(i32, Box<Liste>),
    Vide,
}

use Liste::{Cons, Vide};

fn main() {
    let liste = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Vide))))));
    if let Cons(premier, _) = liste {
        println!("premier élément : {premier}");
    }
}
```

Avec `Box`, la taille d'un `Cons` est fixe : un `i32` plus une adresse. Le compilateur est content.

> [!warning] Piège
> Écrire `Cons(i32, Liste)` donne l'erreur « recursive type has infinite size ». La solution est toujours de mettre une `Box` (ou une autre indirection comme `Rc`) à l'endroit de la récursion.

### Un arbre binaire

Un nœud peut avoir 0, 1 ou 2 enfants : on utilise `Option<Box<Noeud>>`.

```rust
struct Noeud {
    valeur: i32,
    gauche: Option<Box<Noeud>>,
    droite: Option<Box<Noeud>>,
}

fn hauteur(arbre: &Option<Box<Noeud>>) -> usize {
    match arbre {
        None => 0,
        Some(noeud) => 1 + hauteur(&noeud.gauche).max(hauteur(&noeud.droite)),
    }
}

fn main() {
    let arbre = Some(Box::new(Noeud {
        valeur: 1,
        gauche: Some(Box::new(Noeud { valeur: 2, gauche: None, droite: None })),
        droite: None,
    }));
    println!("hauteur : {}", hauteur(&arbre));
}
```

> [!tip] Astuce
> Pour modifier un enfant, `take()` sort la valeur d'un `Option` en laissant `None` à la place : `noeud.gauche.take()`. C'est pratique pour reconstruire un arbre.

### `Box<dyn Trait>`

On ne peut pas mettre dans un même `Vec` des types différents. Mais on peut y mettre des `Box<dyn Trait>` : tous ont la même taille (une adresse), et l'appel de méthode est choisi **à l'exécution**.

```rust
trait Bruit {
    fn faire(&self) -> String;
}

struct Chien;
struct Voiture;

impl Bruit for Chien {
    fn faire(&self) -> String { "Wouf".to_string() }
}

impl Bruit for Voiture {
    fn faire(&self) -> String { "Vroum".to_string() }
}

fn main() {
    let bruits: Vec<Box<dyn Bruit>> = vec![Box::new(Chien), Box::new(Voiture)];
    for bruit in &bruits {
        println!("{}", bruit.faire());
    }
}
```

On peut aussi renvoyer une fonction choisie à l'exécution : `Box<dyn Fn(i32) -> i32>`.

```rust
fn operation(nom: &str) -> Box<dyn Fn(i32) -> i32> {
    match nom {
        "double" => Box::new(|x| x * 2),
        _ => Box::new(|x| x),
    }
}

fn main() {
    println!("{}", operation("double")(21));
}
```

## 3. Le trait `Deref` : se comporter comme une référence

L'opérateur `*` sait suivre une référence. Pour qu'il marche sur notre propre type, on implémente `Deref`.

```rust
use std::ops::Deref;

struct MaBoite<T>(T);

impl<T> MaBoite<T> {
    fn new(valeur: T) -> MaBoite<T> {
        MaBoite(valeur)
    }
}

impl<T> Deref for MaBoite<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

fn main() {
    let boite = MaBoite::new(5);
    println!("{}", *boite);
}
```

En coulisses, `*boite` est transformé en `*(boite.deref())`.

### La coercion deref

Quand une fonction attend un `&str` et qu'on lui donne un `&MaBoite<String>`, Rust applique `deref` autant de fois que nécessaire : `&MaBoite<String>` devient `&String`, puis `&str`. C'est la **coercion deref**. Elle est automatique, uniquement au moment de passer un argument ou d'appeler une méthode.

```rust
use std::ops::Deref;

struct MaBoite<T>(T);

impl<T> Deref for MaBoite<T> {
    type Target = T;
    fn deref(&self) -> &T { &self.0 }
}

fn saluer(nom: &str) {
    println!("Bonjour {nom}");
}

fn main() {
    let boite = MaBoite(String::from("Léa"));
    saluer(&boite);
    println!("{}", boite.len());
}
```

> [!info] À savoir
> `DerefMut` fait la même chose pour les références mutables. C'est grâce à `Deref` qu'on appelle `.len()` directement sur une `Box<String>`.

## 4. Le trait `Drop` : du code à la fin de vie

`Drop` permet d'exécuter du code quand une valeur sort de la portée : fermer un fichier, libérer une ressource, etc.

```rust
struct Etiquette {
    nom: String,
}

impl Drop for Etiquette {
    fn drop(&mut self) {
        println!("Libération de {}", self.nom);
    }
}

fn main() {
    let _a = Etiquette { nom: "a".to_string() };
    {
        let _b = Etiquette { nom: "b".to_string() };
        println!("dans le bloc");
    }
    println!("fin du main");
}
```

Règles à retenir :

- les variables sont libérées dans l'**ordre inverse** de leur création ;
- les champs d'une structure sont libérés dans l'ordre où ils sont déclarés ;
- on ne peut pas appeler `valeur.drop()` soi-même.

Pour libérer plus tôt, on utilise la fonction `drop(valeur)` du prélude (elle prend la valeur et la laisse mourir).

```rust
struct Jeton(u32);

impl Drop for Jeton {
    fn drop(&mut self) {
        println!("jeton {} libéré", self.0);
    }
}

fn main() {
    let j = Jeton(1);
    drop(j);
    println!("après drop");
}
```

> [!warning] Piège
> `let _ = Jeton(2);` libère la valeur **tout de suite**, alors que `let _j = Jeton(2);` la garde jusqu'à la fin de la portée. Le simple `_` ne crée pas de variable.

## 5. `Rc<T>` : plusieurs propriétaires

Parfois une valeur doit appartenir à plusieurs endroits (un nœud de graphe partagé, par exemple). `Rc` signifie *Reference Counted* : il compte combien de propriétaires existent et libère la valeur quand le compteur tombe à 0.

```rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("partagé"));
    println!("liens : {}", Rc::strong_count(&a));
    let b = Rc::clone(&a);
    println!("liens : {}", Rc::strong_count(&a));
    {
        let c = Rc::clone(&a);
        println!("liens : {} ({c})", Rc::strong_count(&a));
    }
    println!("liens : {}", Rc::strong_count(&b));
}
```

`Rc::clone(&a)` ne copie pas la donnée : il ajoute seulement 1 au compteur. C'est très rapide.

Un exemple classique : deux listes qui partagent la même fin.

```rust
use std::rc::Rc;

enum Liste {
    Cons(i32, Rc<Liste>),
    Vide,
}

use Liste::{Cons, Vide};

fn main() {
    let commune = Rc::new(Cons(10, Rc::new(Vide)));
    let _a = Cons(1, Rc::clone(&commune));
    let _b = Cons(2, Rc::clone(&commune));
    println!("{}", Rc::strong_count(&commune));
}
```

> [!warning] Piège
> `Rc` ne donne que des références **non mutables** vers son contenu. Pour modifier, on le combine avec `RefCell<T>` (aperçu plus bas). `Rc` n'est pas utilisable entre threads : le compilateur refuse.

## 6. Mutabilité intérieure : aperçu de `RefCell`

`RefCell<T>` permet de modifier une valeur même à travers une référence non mutable. Les règles d'emprunt sont vérifiées **à l'exécution** au lieu de la compilation : deux emprunts mutables en même temps font **paniquer** le programme.

```rust
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let notes = Rc::new(RefCell::new(vec![12, 15]));
    let autre = Rc::clone(&notes);
    autre.borrow_mut().push(18);
    println!("{:?}", notes.borrow());
}
```

- `borrow()` donne un accès en lecture ;
- `borrow_mut()` donne un accès en écriture.

`Rc<RefCell<T>>` est la combinaison courante : plusieurs propriétaires qui peuvent tous modifier.

## 7. `Weak<T>` et les cycles

Si `A` contient un `Rc` vers `B` et `B` un `Rc` vers `A`, les compteurs ne tombent jamais à 0 : c'est une **fuite mémoire** (Rust ne l'interdit pas, c'est « sûr » mais pas gratuit).

La solution : un lien **faible**. `Weak<T>` pointe vers la valeur sans la garder en vie.

- `Rc::downgrade(&rc)` crée un `Weak` ;
- `weak.upgrade()` renvoie `Option<Rc<T>>` : `None` si la valeur a déjà disparu ;
- `Rc::strong_count` compte les propriétaires, `Rc::weak_count` les liens faibles.

La règle d'or : le parent **possède** ses enfants (`Rc`), l'enfant **connaît** son parent par un `Weak`.

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Noeud {
    nom: String,
    parent: RefCell<Weak<Noeud>>,
    enfants: RefCell<Vec<Rc<Noeud>>>,
}

fn main() {
    let feuille = Rc::new(Noeud {
        nom: "feuille".to_string(),
        parent: RefCell::new(Weak::new()),
        enfants: RefCell::new(vec![]),
    });
    println!("parent : {:?}", feuille.parent.borrow().upgrade().map(|p| p.nom.clone()));

    let branche = Rc::new(Noeud {
        nom: "branche".to_string(),
        parent: RefCell::new(Weak::new()),
        enfants: RefCell::new(vec![Rc::clone(&feuille)]),
    });
    *feuille.parent.borrow_mut() = Rc::downgrade(&branche);
    println!("parent : {:?}", feuille.parent.borrow().upgrade().map(|p| p.nom.clone()));
    println!("forts : {}, faibles : {}", Rc::strong_count(&branche), Rc::weak_count(&branche));
}
```

> [!tip] Astuce
> Si tu hésites entre `Rc` et `Weak` pour un lien : demande-toi « si cet objet disparaît, l'autre doit-il disparaître aussi ? ». Si non, c'est un `Weak`.

## 8. `Arc<T>` : l'aperçu pour les threads

`Arc` (*Atomic Reference Counted*) fonctionne comme `Rc`, mais son compteur est protégé pour être utilisé par plusieurs **threads** (tâches en parallèle). Il est un peu plus lent, donc on prend `Rc` quand on reste dans un seul thread.

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    let donnees = Arc::new(vec![1, 2, 3]);
    let mut taches = Vec::new();
    for i in 0..3 {
        let copie = Arc::clone(&donnees);
        taches.push(thread::spawn(move || copie[i] * 10));
    }
    for tache in taches {
        println!("{}", tache.join().unwrap());
    }
}
```

On le retrouve presque toujours avec `Mutex<T>` (`Arc<Mutex<T>>`), vu dans le chapitre sur la concurrence.

## 9. Quel pointeur choisir ?

| Besoin | Choix |
|---|---|
| Un seul propriétaire, valeur sur le tas ou récursive | `Box<T>` |
| Plusieurs types derrière un même trait | `Box<dyn Trait>` |
| Plusieurs propriétaires, un seul thread | `Rc<T>` |
| Plusieurs propriétaires, plusieurs threads | `Arc<T>` |
| Modifier à travers un `Rc` | `Rc<RefCell<T>>` |
| Lien vers le parent, éviter un cycle | `Weak<T>` |

## 10. À retenir

- `Box<T>` : tas, un seul propriétaire ; indispensable pour les types récursifs et `dyn Trait`.
- `Deref` : fait marcher `*` et la coercion `&Box<String>` vers `&str`.
- `Drop` : code exécuté à la fin de vie, ordre inverse de création.
- `Rc<T>` : propriété partagée ; `Rc::clone` ajoute 1 au compteur.
- `Weak<T>` : lien qui ne compte pas ; `upgrade()` renvoie un `Option`.
- Un cycle de `Rc` fuit la mémoire : on le casse avec un `Weak`.
- `Arc<T>` : l'équivalent de `Rc` pour les threads.
