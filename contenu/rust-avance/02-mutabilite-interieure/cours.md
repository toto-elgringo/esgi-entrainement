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

**Exemple résolu : pourquoi a-t-on besoin de ça ?** Une méthode qui prend `&self` (référence partagée) ne peut pas changer un champ normal :

```text
struct Page { vues: u32 }
impl Page {
    fn afficher(&self) {
        self.vues += 1;   // refusé : self est une référence non mutable
    }
}
```

1. `&self` veut dire « je regarde la page sans la modifier ».
2. `self.vues += 1` modifie un champ : le compilateur refuse (*cannot assign to `self.vues`, which is behind a `&` reference*).
3. Passer à `&mut self` marcherait ici, mais c'est parfois impossible : un trait impose `&self`, ou la page est partagée par plusieurs propriétaires (`Rc`), qui ne donnent jamais de `&mut`.

Avec la mutabilité intérieure, on met `vues` dans une « case » (`Cell`, `RefCell`) qui, elle, accepte d'être modifiée à travers un `&`.

**À retenir :** mutabilité intérieure = modifier à travers un `&` ; les règles restent les mêmes, mais elles sont vérifiées pendant l'exécution.

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

**Pas à pas :**

| Appel | `get()` lit | `set(...)` écrit | Contenu de la case |
|---|---|---|---|
| `Cell::new(0)` | | | 0 |
| 1er `enregistrer()` | 0 | 0 + 1 | 1 |
| 2e `enregistrer()` | 1 | 1 + 1 | 2 |

Le programme affiche `2`. Il n'y a pas d'opérateur `+=` sur un `Cell` : on lit, on calcule, on réécrit.

- `get()` exige que le type soit `Copy` (nombres, booléens...).
- `set(v)` remplace la valeur, `replace(v)` la remplace et renvoie l'ancienne.
- `take()` renvoie la valeur et laisse la valeur par défaut à la place.
- Aucun coût à l'exécution et **aucune panique possible**.

### `replace` et `take` : récupérer l'ancienne valeur

**Exemple résolu : une caisse qui encaisse, puis qu'on vide en fin de journée.**

```rust
use std::cell::Cell;

struct Caisse {
    euros: Cell<u32>,
    ouverte: Cell<bool>,
}

impl Caisse {
    fn encaisser(&self, montant: u32) {
        self.euros.set(self.euros.get() + montant);
    }

    fn fermer(&self) -> u32 {
        self.ouverte.set(false);
        self.euros.take()
    }
}

fn main() {
    let caisse = Caisse { euros: Cell::new(0), ouverte: Cell::new(true) };
    caisse.encaisser(12);
    caisse.encaisser(30);
    let ancien = caisse.ouverte.replace(true);
    println!("était ouverte : {ancien}");
    println!("recette du jour : {}", caisse.fermer());
    println!("reste dans la caisse : {}", caisse.euros.get());
    println!("ouverte : {}", caisse.ouverte.get());
}
```

**Pas à pas :**

1. Deux `encaisser` : 0 + 12 = 12, puis 12 + 30 = 42.
2. `replace(true)` met `true` dans `ouverte` et **renvoie l'ancienne valeur** (`true` aussi ici) : affiche `était ouverte : true`.
3. `fermer()` : `set(false)` ferme, puis `take()` renvoie 42 et laisse **la valeur par défaut** de `u32`, c'est-à-dire 0. Affiche `recette du jour : 42`.
4. Il reste 0 euro, et la caisse est fermée (`false`).

`take()` revient à `replace(valeur par défaut)` : 0 pour un nombre, `false` pour un booléen, une chaîne vide pour `String`. Pour remettre à une autre valeur en récupérant l'ancienne, on prend `replace(nouvelle)`.

> [!tip] Quand choisir `Cell`
> Pour de petites valeurs simples (compteur, drapeau, nombre). Pour des `String` ou des `Vec`, il faut `RefCell`.

**À retenir :** `Cell` = lire une copie (`get`), écrire (`set`), échanger en récupérant l'ancienne (`replace`, `take`).

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

**Pas à pas : ce que compte le `RefCell` pendant ce programme.**

| Ligne | Garde créé | Lectures actives | Écriture active | Contenu |
|---|---|---|---|---|
| `notes.borrow_mut().push(18)` | un `RefMut`, détruit à la fin de la ligne | 0 | oui pendant la ligne, puis non | `[12, 15, 18]` |
| `println!("{:?}", notes.borrow())` | un `Ref`, détruit à la fin de la ligne | 1 pendant la ligne | non | inchangé |
| `notes.borrow().len()` | un `Ref`, détruit à la fin de la ligne | 1 pendant la ligne | non | affiche 3 |

Aucun garde ne survit à sa ligne : il n'y a jamais de conflit.

### Sortir une valeur d'un `RefCell`

Un `Ref` ne peut pas sortir de la fonction (il emprunte la case). Pour **renvoyer** quelque chose, on renvoie une **copie** :

- `.len()`, `.is_empty()` donnent des nombres ou des booléens : rien à copier ;
- `.first()`, `.last()`, `.get(i)` donnent un `Option<&T>` (une référence vers l'intérieur) : on le transforme en `Option<T>` avec `.copied()` (types `Copy` comme `i32`) ou `.cloned()` (types comme `String`).

```rust
use std::cell::RefCell;

struct Panier {
    articles: RefCell<Vec<String>>,
}

impl Panier {
    fn ajouter(&self, article: &str) {
        self.articles.borrow_mut().push(article.to_string());
    }

    fn premier(&self) -> Option<String> {
        self.articles.borrow().first().cloned()
    }
}

fn main() {
    let panier = Panier { articles: RefCell::new(Vec::new()) };
    println!("vide : {:?}", panier.premier());
    panier.ajouter("pain");
    panier.ajouter("lait");
    println!("premier : {:?}", panier.premier());
    println!("articles : {}", panier.articles.borrow().len());
}
```

**Pas à pas de `premier()` :** `borrow()` ouvre la lecture → `.first()` donne `Some(&"pain")` (une référence **dans** le vecteur) → `.cloned()` fabrique une `String` neuve : `Some("pain")` → à la fin de la ligne, le garde disparaît, et la copie peut sortir de la fonction. Sur un panier vide, `.first()` donne `None` et `.cloned()` le laisse en `None`.

> [!warning] Piège
> Renvoyer `self.articles.borrow().first()` (sans `cloned`) ne compile pas : ce serait une référence vers l'intérieur d'un garde qui disparaît à la fin de la fonction.

**À retenir :** `borrow()` pour lire, `borrow_mut()` pour écrire, et pour faire sortir une valeur : `.copied()` ou `.cloned()`.

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

Ici, `borrow_mut()` panique car une lecture est encore active (message `RefCell already borrowed`, ou `already borrowed: BorrowMutError` avec les anciennes versions de Rust).

**Pas à pas :**

| Ligne | Lectures actives | Écriture demandée | Résultat |
|---|---|---|---|
| `let lecture = boite.borrow();` | 1 (le garde `lecture` est rangé dans une variable) | | OK |
| `println!` | 1 | | affiche `lecture : salut` |
| `let ecriture = boite.borrow_mut();` | 1 (`lecture` existe toujours) | oui | **panique** : on ne peut pas écrire pendant une lecture |

Tableau des cas possibles (ce que le `RefCell` accepte) :

| Déjà actif | `borrow()` | `borrow_mut()` |
|---|---|---|
| rien | OK | OK |
| une ou plusieurs lectures | OK (plusieurs lectures permises) | panique |
| une écriture | panique | panique |

> [!warning] Piège numéro 1
> Le compilateur ne vous prévient pas. L'erreur arrive seulement quand on exécute ce chemin du code. Un test peut passer et la panique n'apparaître qu'en production.

**À retenir :** mêmes règles que `&` / `&mut` (plusieurs lectures **ou** une seule écriture), mais une violation fait paniquer au lieu de ne pas compiler.

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

**Combien de temps vit un garde ?**

| Écriture | Le garde vit... |
|---|---|
| `let n = case.borrow().len();` | jusqu'à la fin de la ligne (temporaire) |
| `let g = case.borrow();` | jusqu'à la fin du bloc, ou jusqu'à `drop(g)` |
| `if *case.borrow() > 0 { ... }` | seulement pendant la condition |
| `if let Some(x) = case.borrow().first() { ... }` | pendant **tout** le bloc du `if let` |
| `match *case.borrow() { ... }` | pendant **tout** le `match` |

**Exemple résolu : on vérifie avec `try_borrow_mut()` (qui répond sans paniquer, voir plus bas) si l'écriture serait possible.**

```rust
use std::cell::RefCell;

fn main() {
    let liste = RefCell::new(vec![4, 5]);

    if let Some(premier) = liste.borrow().first() {
        println!("dans le if let ({premier}) : écriture possible ? {}", liste.try_borrow_mut().is_ok());
    }

    let premier = liste.borrow().first().copied();
    println!("après copie ({premier:?}) : écriture possible ? {}", liste.try_borrow_mut().is_ok());

    if let Some(valeur) = premier {
        liste.borrow_mut().push(valeur * 10);
    }
    println!("{:?}", liste.borrow());
}
```

1. Dans le `if let`, le garde de `liste.borrow()` vit pendant tout le bloc : écrire serait refusé → `false`. Un `borrow_mut()` à cet endroit **paniquerait**.
2. Avec `let premier = ... .copied();`, on garde une **copie** (`Some(4)`) et le garde disparaît à la fin de la ligne → `true`.
3. On peut alors écrire sans risque : la liste devient `[4, 5, 40]`.

> [!tip] Astuce
> Gardez les emprunts **très courts** : copiez ou clonez ce dont vous avez besoin, puis relâchez le garde. Au besoin, mettez l'emprunt dans un bloc `{ ... }` ou utilisez `drop(garde)`.

**À retenir :** lis dans une variable (copie), relâche, puis écris ; méfie-toi des `if let` et `match` sur un `borrow()`.

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

**Pas à pas :** `_lecture` garde une lecture active. `try_borrow_mut()` voit qu'une lecture existe : il renvoie `Err`, on affiche le message, rien ne panique. `try_borrow()` (une lecture de plus) est permis : `Ok(garde)`, et `.map(|v| *v)` copie la valeur → affiche `Ok(10)`.

Pour en faire une fonction qui « prévient » au lieu de paniquer, deux formes utiles :

- `match case.try_borrow_mut() { Ok(mut g) => { ...; true } Err(_) => false }` : on agit et on répond `true`, sinon `false` ;
- `case.try_borrow().ok()` transforme le `Result` en `Option` : `Some(garde)` ou `None`. Dans une fonction qui renvoie un `Option`, on peut écrire `let g = case.try_borrow().ok()?;` : le `?` renvoie `None` tout de suite si l'emprunt est refusé.

```rust
use std::cell::RefCell;

fn doubler_si_libre(case: &RefCell<i32>) -> bool {
    match case.try_borrow_mut() {
        Ok(mut valeur) => {
            *valeur *= 2;
            true
        }
        Err(_) => false,
    }
}

fn somme_si_lisible(liste: &RefCell<Vec<i32>>) -> Option<i32> {
    let lecture = liste.try_borrow().ok()?;
    Some(lecture.iter().sum())
}

fn main() {
    let case = RefCell::new(5);
    println!("libre : {} -> {}", doubler_si_libre(&case), case.borrow());
    let lecture = case.borrow();
    println!("pendant une lecture : {}", doubler_si_libre(&case));
    drop(lecture);

    let liste = RefCell::new(vec![1, 2, 3]);
    println!("somme libre : {:?}", somme_si_lisible(&liste));
    let lecture = liste.borrow();
    println!("somme pendant une lecture : {:?}", somme_si_lisible(&liste));
    drop(lecture);
    let ecriture = liste.borrow_mut();
    println!("somme pendant une écriture : {:?}", somme_si_lisible(&liste));
    drop(ecriture);
}
```

| Situation | `doubler_si_libre` (écrit) | `somme_si_lisible` (lit) |
|---|---|---|
| rien d'actif | `true`, 5 devient 10 | `Some(6)` |
| une lecture active | `false` (écrire est refusé) | `Some(6)` (lire à plusieurs est permis) |
| une écriture active | `false` | `None` |

**À retenir :** `try_borrow*` renvoie `Ok` ou `Err` au lieu de paniquer ; `.ok()?` le transforme en « `None` si c'est occupé ».

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

**Pas à pas :** `j` n'est pas `mut`, et `ecrire` prend `&self`. Chaque appel ouvre une écriture (`borrow_mut()`), ajoute la ligne, et relâche à la fin de la ligne. Après deux appels, `borrow().len()` vaut 2.

### Un cache caché derrière `&self`

Un **cache** retient les résultats déjà calculés pour ne pas refaire le travail. Vu de l'extérieur, la méthode ne fait que répondre (`&self`) ; à l'intérieur, elle met le cache à jour.

La méthode suit toujours le même plan :

1. **chercher** dans le cache (lecture courte, on copie le résultat) ;
2. si trouvé : le renvoyer tout de suite ;
3. sinon : calculer, compter le calcul, **ranger** dans le cache (écriture), renvoyer.

```rust
use std::cell::{Cell, RefCell};
use std::collections::HashMap;

struct Voyelles {
    cache: RefCell<HashMap<String, usize>>,
    vrais_calculs: Cell<u32>,
}

impl Voyelles {
    fn compter(&self, mot: &str) -> usize {
        let deja = self.cache.borrow().get(mot).copied();
        if let Some(n) = deja {
            return n;
        }
        self.vrais_calculs.set(self.vrais_calculs.get() + 1);
        let n = mot.chars().filter(|c| "aeiouy".contains(*c)).count();
        self.cache.borrow_mut().insert(mot.to_string(), n);
        n
    }
}

fn main() {
    let v = Voyelles { cache: RefCell::new(HashMap::new()), vrais_calculs: Cell::new(0) };
    for mot in ["bateau", "rust", "bateau", "bateau"] {
        println!("{mot} : {}", v.compter(mot));
    }
    println!("vrais calculs : {}", v.vrais_calculs.get());
}
```

| Appel | Dans le cache ? | Action | `vrais_calculs` |
|---|---|---|---|
| `compter("bateau")` | non | calcule 4 (a, e, a, u), range | 1 |
| `compter("rust")` | non | calcule 1 (u), range | 2 |
| `compter("bateau")` | oui | renvoie 4 directement | 2 |
| `compter("bateau")` | oui | renvoie 4 directement | 2 |

`get(mot)` donne un `Option<&usize>` : `.copied()` en fait un `Option<usize>`, et le garde de lecture disparaît à la fin de la ligne. Le `borrow_mut()` plus bas est donc sans danger.

> [!warning] Piège
> Écrire `if let Some(n) = self.cache.borrow().get(mot) { ... } else { self.cache.borrow_mut().insert(...) }` est risqué : selon l'édition de Rust, la lecture peut encore être active dans le `else`. Copier d'abord dans une variable évite toute question.

**À retenir :** un champ `RefCell` (ou `Cell`) permet à une méthode `&self` de tenir un journal, un compteur ou un cache.

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

**Pas à pas :**

| Ligne | Valeur partagée | Propriétaires |
|---|---|---|
| `Rc::new(RefCell::new(100))` | 100 | 1 (`compte`) |
| deux `Rc::clone` | 100 | 3 (`compte`, `a`, `b`) |
| `*a.borrow_mut() += 50` | 150 | 3 |
| `*b.borrow_mut() -= 30` | 120 | 3 |

Affiche `solde : 120` et `propriétaires : 3`. Dans `*a.borrow_mut() += 50`, `a.borrow_mut()` passe à travers le `Rc` (grâce à `Deref`) et ouvre le `RefCell` ; le `*` donne accès à l'entier lui-même pour le modifier.

### Vérifier avant de modifier, et enchaîner avec `?`

**Exemple résolu : une réserve de farine partagée, qu'on ne peut pas faire passer en dessous de 0.**

```rust
use std::cell::RefCell;
use std::rc::Rc;

fn consommer(reserve: &Rc<RefCell<u32>>, grammes: u32) -> Result<(), String> {
    let disponible = *reserve.borrow();
    if disponible < grammes {
        return Err(format!("il manque {} g", grammes - disponible));
    }
    *reserve.borrow_mut() -= grammes;
    Ok(())
}

fn faire_un_gateau(farine: &Rc<RefCell<u32>>, sucre: &Rc<RefCell<u32>>) -> Result<(), String> {
    consommer(farine, 200)?;
    consommer(sucre, 100)?;
    Ok(())
}

fn main() {
    let farine = Rc::new(RefCell::new(500));
    let sucre = Rc::new(RefCell::new(150));
    let cuisine = Rc::clone(&farine);

    println!("{:?}", faire_un_gateau(&cuisine, &sucre));
    println!("{:?}", faire_un_gateau(&cuisine, &sucre));
    println!("farine : {}, sucre : {}", farine.borrow(), sucre.borrow());
}
```

**Pas à pas :**

1. `let disponible = *reserve.borrow();` **copie** la quantité dans une variable : le garde de lecture disparaît tout de suite. Le `borrow_mut()` deux lignes plus bas ne risque donc rien.
2. Si la quantité ne suffit pas, on renvoie `Err(...)` **sans rien modifier**.
3. Dans `faire_un_gateau`, le `?` après `consommer(...)` veut dire : « si c'est une `Err`, arrête ici et renvoie cette erreur ; sinon continue ».

| Appel | Farine | Sucre | Résultat |
|---|---|---|---|
| départ | 500 | 150 | |
| 1er gâteau : farine 500 ≥ 200 → 300 ; sucre 150 ≥ 100 → 50 | 300 | 50 | `Ok(())` |
| 2e gâteau : farine 300 ≥ 200 → 100 ; sucre 50 < 100 → erreur | 100 | 50 | `Err("il manque 50 g")` |

`cuisine` et `farine` sont deux propriétaires de la **même** réserve : ce que `cuisine` consomme se voit dans `farine`.

> [!warning] L'ordre compte
> Au 2e gâteau, la farine a déjà été retirée avant que le sucre manque. Si une opération doit être « tout ou rien », fais d'abord l'étape qui peut échouer (le retrait), et seulement ensuite celle qui ne peut pas échouer (un ajout).

> [!warning] Piège numéro 2
> `Rc` et `RefCell` ne marchent **que dans un seul thread**. Pour plusieurs threads, on utilise `Arc<Mutex<T>>` (autre chapitre).

**À retenir :** `Rc::clone` pour partager, `*x.borrow_mut() ±= ...` pour modifier ; lis dans une variable avant de décider, et enchaîne les étapes qui peuvent échouer avec `?`.

### Partager des objets de types différents : `Rc<dyn Trait>`

Comme `Box<dyn Trait>`, un `Rc<dyn Trait>` peut contenir n'importe quel type qui implémente le trait, mais avec **plusieurs propriétaires**. Un `Rc<MonType>` se convertit tout seul en `Rc<dyn Trait>` quand on le passe à une fonction qui attend ce type. Si le trait n'a que des méthodes `&self`, chaque type garde son état dans un `Cell` ou un `RefCell`.

**Exemple résolu : une sonnerie qui prévient tous ceux qui l'écoutent.**

```rust
use std::cell::{Cell, RefCell};
use std::rc::Rc;

trait Ecouteur {
    fn entendre(&self, message: &str);
}

struct Carnet {
    notes: RefCell<Vec<String>>,
}

struct Pointeur {
    fois: Cell<u32>,
}

impl Ecouteur for Carnet {
    fn entendre(&self, message: &str) {
        self.notes.borrow_mut().push(message.to_uppercase());
    }
}

impl Ecouteur for Pointeur {
    fn entendre(&self, _message: &str) {
        self.fois.set(self.fois.get() + 1);
    }
}

fn sonner(ecouteurs: &[Rc<dyn Ecouteur>], message: &str) {
    for ecouteur in ecouteurs {
        ecouteur.entendre(message);
    }
}

fn main() {
    let carnet = Rc::new(Carnet { notes: RefCell::new(Vec::new()) });
    let pointeur = Rc::new(Pointeur { fois: Cell::new(0) });
    let ecouteurs: Vec<Rc<dyn Ecouteur>> = vec![carnet.clone(), pointeur.clone()];

    sonner(&ecouteurs, "pause");
    sonner(&ecouteurs, "reprise");

    println!("{:?}", carnet.notes.borrow());
    println!("{} sonneries", pointeur.fois.get());
}
```

**Pas à pas :**

1. `carnet.clone()` sur un `Rc` fait la même chose que `Rc::clone(&carnet)` : un propriétaire de plus. Le `Vec` en garde un, `main` garde l'autre pour pouvoir regarder le résultat.
2. Dans le `vec![...]`, chaque `Rc<Carnet>` / `Rc<Pointeur>` devient un `Rc<dyn Ecouteur>`.
3. `sonner` parcourt la liste **dans l'ordre** et appelle `entendre` sur chacun : le carnet range le message en majuscules, le pointeur compte.
4. Résultat : `["PAUSE", "REPRISE"]` et `2 sonneries`.

**À retenir :** `Vec<Rc<dyn Trait>>` + une boucle `for` = prévenir plusieurs objets partagés ; leur état change grâce à `Cell` / `RefCell`.

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

**Pas à pas :** `a` est le seul propriétaire (forts : 1) et `faible` un lien faible (faibles : 1) → `forts : 1, faibles : 1`. `upgrade()` retrouve la valeur : `Some("donnée")`. `drop(a)` enlève le dernier propriétaire : la chaîne est libérée, même si `faible` existe encore. `upgrade()` donne alors `None`.

### Suivre les deux compteurs pas à pas

**Exemple résolu :**

```rust
use std::rc::Rc;

fn main() {
    let x = Rc::new(String::from("x"));
    let y = Rc::clone(&x);
    let z = Rc::clone(&x);
    let lien = Rc::downgrade(&x);
    println!("forts : {}, faibles : {}", Rc::strong_count(&x), Rc::weak_count(&x));
    drop(y);
    drop(z);
    println!("forts : {}, faibles : {}", Rc::strong_count(&x), Rc::weak_count(&x));
    drop(lien);
    println!("forts : {}, faibles : {}", Rc::strong_count(&x), Rc::weak_count(&x));
}
```

| Action | Forts | Faibles |
|---|---|---|
| `Rc::new` | 1 | 0 |
| deux `Rc::clone` | 3 | 0 |
| `Rc::downgrade` | 3 | 1 |
| `drop(y)`, `drop(z)` | 1 | 1 |
| `drop(lien)` | 1 | 0 |

Le programme affiche `forts : 3, faibles : 1`, puis `forts : 1, faibles : 1`, puis `forts : 1, faibles : 0`. Un `downgrade` ne change **jamais** le compteur fort, et un `clone` ne change jamais le compteur faible. Pour renvoyer les deux nombres d'un coup, une fonction peut renvoyer un **couple** `(usize, usize)`, qu'on récupère avec `let (forts, faibles) = ...;`.

**À retenir :** `Rc::clone` → +1 fort, `Rc::downgrade` → +1 faible, chaque `drop` enlève 1 au bon compteur ; la valeur meurt quand les **forts** tombent à 0.

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

**Pas à pas :**

1. Dans le bloc, `branche` reçoit `feuille` dans ses enfants (`push(Rc::clone(...))`), et `feuille` reçoit un lien faible vers `branche` (`*... .borrow_mut() = Rc::downgrade(...)` remplace le `Weak::new()` vide).
2. `upgrade()` retrouve `branche` : affiche `parent : Some("branche")`.
3. À la fin du bloc, la variable `branche` disparaît. C'était le seul propriétaire **fort** de `branche` (le lien de `feuille` est faible) : `branche` est libérée.
4. `upgrade()` ne trouve plus rien : affiche `après : None`. Pour savoir simplement si le parent existe encore : `noeud.parent.borrow().upgrade().is_some()`.

Lier un enfant à son parent demande **toujours deux** écritures : l'enfant dans la liste du parent, **et** le parent dans l'enfant. En oublier une donne un arbre à moitié relié.

### Parcourir l'arbre : descendre et remonter

- **Descendre** (vers les enfants) : une fonction récursive parcourt `noeud.enfants.borrow()` et s'appelle sur chaque enfant.
- **Remonter** (vers la racine) : une boucle `while let Some(p) = ...upgrade()` passe de parent en parent jusqu'à `None`.

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

fn relier(parent: &Rc<Noeud>, enfant: &Rc<Noeud>) {
    parent.enfants.borrow_mut().push(Rc::clone(enfant));
    *enfant.parent.borrow_mut() = Rc::downgrade(parent);
}

fn feuilles(noeud: &Rc<Noeud>) -> usize {
    let enfants = noeud.enfants.borrow();
    if enfants.is_empty() {
        return 1;
    }
    enfants.iter().map(feuilles).sum()
}

fn ancetres(noeud: &Rc<Noeud>) -> Vec<String> {
    let mut noms = Vec::new();
    let mut courant = noeud.parent.borrow().upgrade();
    while let Some(parent) = courant {
        noms.push(parent.nom.clone());
        courant = parent.parent.borrow().upgrade();
    }
    noms
}

fn main() {
    let ville = creer("ville");
    let nord = creer("nord");
    let sud = creer("sud");
    let parc = creer("parc");
    let gare = creer("gare");
    relier(&ville, &nord);
    relier(&ville, &sud);
    relier(&nord, &parc);
    relier(&nord, &gare);
    println!("feuilles : {}", feuilles(&ville));
    println!("ancêtres de gare : {:?}", ancetres(&gare));
}
```

```text
ville
├── nord
│   ├── parc
│   └── gare
└── sud
```

**Pas à pas de `feuilles(ville)`** (une feuille est un nœud sans enfant) :

| Appel | Enfants | Résultat |
|---|---|---|
| `feuilles(parc)` | aucun | 1 |
| `feuilles(gare)` | aucun | 1 |
| `feuilles(nord)` | parc, gare | 1 + 1 = 2 |
| `feuilles(sud)` | aucun | 1 |
| `feuilles(ville)` | nord, sud | 2 + 1 = **3** |

**Pas à pas de `ancetres(gare)` :** parent de `gare` = `nord` (on note « nord ») → parent de `nord` = `ville` (on note « ville ») → parent de `ville` : `None`, la boucle s'arrête. Résultat : `["nord", "ville"]`, du plus proche au plus loin. Pour avoir l'ordre « depuis la racine », on inverse la liste (`reverse()`), et pour les coller avec un séparateur : `join("/")`.

**À retenir :** descendre = récursion sur `enfants.borrow()` ; remonter = `while let Some(p) = ...upgrade()` jusqu'à `None`.

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

**Pas à pas :**

| Ligne | Case | Affichage |
|---|---|---|
| `OnceCell::new()` | vide | |
| `config.get()` | vide | `None` |
| `get_or_init(...)` | vide → la fermeture est appelée, la case est remplie | `calculée une fois` |
| `set("autre")` | déjà pleine : rien ne change | `Err("autre")` (on récupère la valeur refusée) |

Un second `get_or_init` n'appellerait **pas** la fermeture : il renverrait directement la valeur déjà rangée.

**À retenir :** `OnceCell` = remplie une fois (`get_or_init` ou `set`), ensuite seulement lue ; un `set` de trop rend `Err(valeur)`.

## Quand l'utiliser, quand l'éviter

| Besoin | Outil |
|---|---|
| Petite valeur `Copy` modifiée via `&self` | `Cell<T>` |
| Valeur plus grosse (String, Vec) via `&self` | `RefCell<T>` |
| Plusieurs propriétaires qui modifient | `Rc<RefCell<T>>` |
| Lien vers le parent, éviter les cycles | `Weak<T>` |
| Valeur initialisée une seule fois | `OnceCell<T>` |
| Plusieurs threads | `Arc<Mutex<T>>` |

**Exemple résolu : quel outil pour chaque champ d'un lecteur de musique ?**

1. Le nombre de morceaux écoutés, modifié par `jouer(&self)` : un nombre `Copy` → `Cell<u32>`.
2. La liste des derniers titres joués, modifiée par `jouer(&self)` : un `Vec<String>` → `RefCell<Vec<String>>`.
3. La playlist, partagée par plusieurs écrans qui peuvent tous ajouter un titre → `Rc<RefCell<Vec<String>>>`.
4. Le chemin du dossier de musique, lu sur le disque la première fois qu'on en a besoin → `OnceCell<String>`.

> [!tip] Bon réflexe
> Commencez **toujours** par les références normales (`&`, `&mut`) : le compilateur vous protège. N'utilisez la mutabilité intérieure que si c'est vraiment nécessaire.

À éviter :

- Mettre des `Rc<RefCell<...>>` partout par habitude : le code devient difficile à suivre et les paniques apparaissent à l'exécution.
- Garder un `Ref` ou `RefMut` vivant pendant qu'on appelle d'autres fonctions qui peuvent emprunter la même case.
- Faire un cycle avec des `Rc` : utilisez `Weak` pour le sens « retour ».

**À retenir :** `Copy` → `Cell` ; le reste → `RefCell` ; partagé → `Rc<RefCell>` ; une seule fois → `OnceCell` ; threads → `Arc<Mutex>`.

## À retenir

- `Cell` : lire / remplacer des valeurs `Copy`, pas de panique ; `replace` et `take` rendent l'ancienne valeur.
- `RefCell` : emprunts vérifiés à l'exécution, panique si on viole la règle.
- `borrow()` / `borrow_mut()` renvoient des gardes ; `try_borrow*` renvoient un `Result`.
- Garde court : copie (`copied`, `cloned`) dans une variable, relâche, puis écris.
- `Rc<RefCell<T>>` : donnée partagée et modifiable (un seul thread).
- `Weak` casse les cycles ; `upgrade()` renvoie un `Option`.
- `OnceCell` : une case remplie une seule fois.
