# Mutabilité intérieure

## Le problème

Normalement, Rust vérifie les règles d'emprunt **à la compilation** :

- soit **plusieurs** références `&` (lecture seule),
- soit **une seule** référence `&mut` (modification),
- jamais les deux en même temps.

Parfois, on sait que notre code est correct, mais le compilateur ne peut pas le prouver. Ou alors, on a besoin de modifier une valeur alors qu'on n'a qu'un `&self`. La **mutabilité intérieure** (*interior mutability*) répond à ça : on modifie une valeur à travers une référence partagée, et la vérification se fait **pendant l'exécution**.

```text
let x = 5;
let y = &mut x;
```

> [!info] Rappel
> Le code ci-dessus ne compile pas : on ne peut pas emprunter en `&mut` une variable non déclarée `mut`. Avec les types de ce chapitre, on contourne cette règle de façon contrôlée.

## `Cell<T>` : copier dedans, copier dehors

`Cell<T>` est le plus simple. Il ne donne **jamais** de référence vers son contenu : on le **lit** (`get`, une copie) ou on le **remplace** (`set`).

```rust
use std::cell::Cell;

struct Visites {
    total: Cell<u32>,
}

impl Visites {
    fn enregistrer(&self) {
        self.total.set(self.total.get() + 1);
    }
}

fn main() {
    let v = Visites { total: Cell::new(0) };
    v.enregistrer();
    v.enregistrer();
    println!("{}", v.total.get());
}
```

Remarque : `enregistrer` prend `&self`, pas `&mut self`, et pourtant la valeur change.

- `get()` exige que le type soit `Copy` (nombres, booléens...).
- `set(v)` remplace la valeur, `replace(v)` la remplace et renvoie l'ancienne.
- `take()` renvoie la valeur et laisse la valeur par défaut à la place.
- Aucun coût à l'exécution et **aucune panique possible**.

> [!tip] Quand choisir `Cell`
> Pour de petites valeurs simples (compteur, drapeau, nombre). Pour des `String` ou des `Vec`, il faut `RefCell`.

## `RefCell<T>` : emprunter à l'exécution

`RefCell<T>` donne de vraies références vers son contenu, mais il **compte les emprunts** pendant que le programme tourne.

- `borrow()` renvoie un `Ref<T>` (lecture, comme un `&T`).
- `borrow_mut()` renvoie un `RefMut<T>` (écriture, comme un `&mut T`).

```rust
use std::cell::RefCell;

fn main() {
    let notes = RefCell::new(vec![12, 15]);

    notes.borrow_mut().push(18);

    println!("{:?}", notes.borrow());
    println!("{}", notes.borrow().len());
}
```

Un `Ref` ou `RefMut` est un **garde** : l'emprunt dure tant que le garde existe. Quand il sort de portée, l'emprunt est rendu.

### Les règles sont les mêmes... mais la sanction change

| | Références normales | `RefCell` |
|---|---|---|
| Vérification | compilation | exécution |
| Règle violée | erreur de compilation | **panique** |

```rust
use std::cell::RefCell;

fn main() {
    let boite = RefCell::new(String::from("salut"));

    let lecture = boite.borrow();
    println!("lecture : {}", lecture);

    let ecriture = boite.borrow_mut();
    println!("jamais atteint : {}", ecriture);
}
```

Ici, `borrow_mut()` panique car une lecture est encore active (message `already borrowed: BorrowMutError`).

> [!warning] Piège numéro 1
> Le compilateur ne vous prévient pas. L'erreur arrive seulement quand on exécute ce chemin du code. Un test peut passer et la panique n'apparaître qu'en production.

### Garder un emprunt trop longtemps

Le piège classique : un garde vit plus longtemps que prévu.

```rust
use std::cell::RefCell;

fn main() {
    let liste = RefCell::new(vec![1, 2, 3]);

    let taille = liste.borrow().len();
    liste.borrow_mut().push(taille as i32 + 1);

    println!("{:?}", liste.borrow());
}
```

Ici, le garde `borrow()` est un **temporaire** : il disparaît à la fin de la ligne. Si on avait écrit `let lecture = liste.borrow();` et gardé `lecture` vivant, le `borrow_mut()` suivant aurait paniqué.

> [!tip] Astuce
> Gardez les emprunts **très courts** : copiez ou clonez ce dont vous avez besoin, puis relâchez le garde. Au besoin, mettez l'emprunt dans un bloc `{ ... }` ou utilisez `drop(garde)`.

### `try_borrow` et `try_borrow_mut` : sans panique

Si on veut éviter la panique, on demande poliment :

```rust
use std::cell::RefCell;

fn main() {
    let boite = RefCell::new(10);

    let _lecture = boite.borrow();

    match boite.try_borrow_mut() {
        Ok(mut v) => *v += 1,
        Err(_) => println!("déjà emprunté, on réessaiera plus tard"),
    }

    println!("{:?}", boite.try_borrow().map(|v| *v));
}
```

Ces méthodes renvoient un `Result` : `Ok(garde)` si c'est possible, `Err(...)` sinon.

## Utilisation typique : modifier avec `&self`

Un trait impose parfois `&self` alors qu'on veut enregistrer quelque chose (un journal, un cache, un compteur d'appels) :

```rust
use std::cell::RefCell;

struct Journal {
    lignes: RefCell<Vec<String>>,
}

impl Journal {
    fn ecrire(&self, texte: &str) {
        self.lignes.borrow_mut().push(texte.to_string());
    }
}

fn main() {
    let j = Journal { lignes: RefCell::new(Vec::new()) };
    j.ecrire("démarrage");
    j.ecrire("fin");
    println!("{} lignes", j.lignes.borrow().len());
}
```

## `Rc<RefCell<T>>` : plusieurs propriétaires qui modifient

- `Rc<T>` : plusieurs propriétaires, mais en **lecture seule**.
- `RefCell<T>` : modification avec `&self`.
- Ensemble : une donnée **partagée et modifiable**.

```rust
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let compte = Rc::new(RefCell::new(100));

    let a = Rc::clone(&compte);
    let b = Rc::clone(&compte);

    *a.borrow_mut() += 50;
    *b.borrow_mut() -= 30;

    println!("solde : {}", compte.borrow());
    println!("propriétaires : {}", Rc::strong_count(&compte));
}
```

Les trois variables pointent vers la **même** valeur. Modifier via `a` change ce que voit `b`.

> [!warning] Piège numéro 2
> `Rc` et `RefCell` ne marchent **que dans un seul thread**. Pour plusieurs threads, on utilise `Arc<Mutex<T>>` (autre chapitre).

## Cycles de références et fuites

`Rc` compte ses propriétaires (*strong count*). La valeur est libérée quand ce compteur tombe à 0. Si deux valeurs se pointent l'une l'autre avec des `Rc`, le compteur **ne tombe jamais à 0** : c'est une **fuite mémoire**. Rust ne l'interdit pas (c'est du code sûr, mais ça fuit).

La solution : `Weak<T>`, une référence **faible** qui ne compte pas comme propriétaire.

- `Rc::downgrade(&rc)` crée un `Weak`.
- `weak.upgrade()` renvoie `Option<Rc<T>>` : `Some` si la valeur existe encore, `None` sinon.
- `Rc::strong_count` et `Rc::weak_count` donnent les deux compteurs.

```rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("donnée"));
    let faible = Rc::downgrade(&a);

    println!("forts : {}, faibles : {}", Rc::strong_count(&a), Rc::weak_count(&a));
    println!("{:?}", faible.upgrade());

    drop(a);
    println!("{:?}", faible.upgrade());
}
```

## Un arbre avec parent en `Weak`

Règle simple : **le parent possède ses enfants** (`Rc`), **l'enfant ne possède pas son parent** (`Weak`).

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Noeud {
    nom: String,
    parent: RefCell<Weak<Noeud>>,
    enfants: RefCell<Vec<Rc<Noeud>>>,
}

fn creer(nom: &str) -> Rc<Noeud> {
    Rc::new(Noeud {
        nom: nom.to_string(),
        parent: RefCell::new(Weak::new()),
        enfants: RefCell::new(Vec::new()),
    })
}

fn main() {
    let feuille = creer("feuille");

    {
        let branche = creer("branche");
        branche.enfants.borrow_mut().push(Rc::clone(&feuille));
        *feuille.parent.borrow_mut() = Rc::downgrade(&branche);

        let parent = feuille.parent.borrow().upgrade();
        println!("parent : {:?}", parent.map(|p| p.nom.clone()));
    }

    let parent = feuille.parent.borrow().upgrade();
    println!("après : {:?}", parent.map(|p| p.nom.clone()));
}
```

Pourquoi `RefCell` autour de `parent` et `enfants` ? Le noeud est dans un `Rc` (donc partagé, immuable), mais on doit pouvoir changer son parent et ajouter des enfants après coup.

## `OnceCell` : un aperçu

`OnceCell<T>` (dans `std::cell`) est une case qu'on ne remplit **qu'une seule fois**. Pratique pour une valeur calculée à la demande.

```rust
use std::cell::OnceCell;

fn main() {
    let config: OnceCell<String> = OnceCell::new();

    println!("{:?}", config.get());

    let valeur = config.get_or_init(|| String::from("calculée une fois"));
    println!("{}", valeur);

    println!("{:?}", config.set(String::from("autre")));
}
```

Le second `set` échoue : la case est déjà pleine, on récupère `Err(valeur)`.

## Quand l'utiliser, quand l'éviter

| Besoin | Outil |
|---|---|
| Petite valeur `Copy` modifiée via `&self` | `Cell<T>` |
| Valeur plus grosse (String, Vec) via `&self` | `RefCell<T>` |
| Plusieurs propriétaires qui modifient | `Rc<RefCell<T>>` |
| Lien vers le parent, éviter les cycles | `Weak<T>` |
| Valeur initialisée une seule fois | `OnceCell<T>` |
| Plusieurs threads | `Arc<Mutex<T>>` |

> [!tip] Bon réflexe
> Commencez **toujours** par les références normales (`&`, `&mut`) : le compilateur vous protège. N'utilisez la mutabilité intérieure que si c'est vraiment nécessaire.

À éviter :

- Mettre des `Rc<RefCell<...>>` partout par habitude : le code devient difficile à suivre et les paniques apparaissent à l'exécution.
- Garder un `Ref` ou `RefMut` vivant pendant qu'on appelle d'autres fonctions qui peuvent emprunter la même case.
- Faire un cycle avec des `Rc` : utilisez `Weak` pour le sens « retour ».

## À retenir

- `Cell` : lire / remplacer des valeurs `Copy`, pas de panique.
- `RefCell` : emprunts vérifiés à l'exécution, panique si on viole la règle.
- `borrow()` / `borrow_mut()` renvoient des gardes ; `try_borrow*` renvoient un `Result`.
- `Rc<RefCell<T>>` : donnée partagée et modifiable (un seul thread).
- `Weak` casse les cycles ; `upgrade()` renvoie un `Option`.
- `OnceCell` : une case remplie une seule fois.
