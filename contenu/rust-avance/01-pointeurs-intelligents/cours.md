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

**Exemple résolu : où vont les données de `let nom = String::from("Rust");` ?**

| Morceau | Où ? | Pourquoi |
|---|---|---|
| la variable `nom` (adresse, longueur, capacité) | pile | sa taille est fixe : trois nombres |
| les lettres `R`, `u`, `s`, `t` | tas | le texte peut grandir, sa taille n'est pas connue à l'avance |

Quand `nom` sort de la portée, `String` libère toute seule les lettres sur le tas : c'est le « travail en plus » d'un pointeur intelligent. Une référence `&nom` ne libère rien, elle ne fait que regarder.

**À retenir :** un pointeur intelligent = une petite structure sur la pile qui **possède** des données (souvent sur le tas) et s'occupe de les libérer.

## 2. `Box<T>` : une valeur sur le tas

```rust
let x = Box::new(5);
println!("{}", x);
println!("{}", *x + 1);
```

`Box::new(5)` place le `5` sur le tas. La variable `x` (sur la pile) contient juste l'adresse. On accède à la valeur avec `*x`. Quand `x` sort de la portée, la mémoire du tas est libérée automatiquement.

**Pas à pas sur cet exemple :**

1. `Box::new(5)` : Rust réserve une place sur le tas, y écrit `5`, et renvoie une `Box<i32>` qui contient l'adresse.
2. `println!("{}", x)` affiche `5` : `println!` sait afficher ce qu'il y a dans la boîte.
3. `*x` suit l'adresse et donne le `5` ; `*x + 1` vaut donc `6`.
4. À la fin du bloc, `x` disparaît, et la place du tas est rendue.

Une `Box` sert dans trois cas :

1. un type **récursif** dont la taille n'est pas connue ;
2. une **grosse valeur** qu'on veut déplacer sans la copier ;
3. un **objet de trait** (`Box<dyn Trait>`).

### Lire et modifier la valeur d'une boîte

- `*boite` donne la valeur rangée (lecture, ou écriture si la boîte est `mut`) ;
- `&*boite` donne une référence `&T` vers la valeur ;
- si une fonction attend un `&mut T` ou un `&T`, on peut lui passer `&mut boite` ou `&boite` : Rust « ouvre » la boîte tout seul (c'est la coercion deref, expliquée en section 3).

```rust
fn tripler(valeur: &mut i32) {
    *valeur *= 3;
}

fn difference(a: &i32, b: &i32) -> Box<i32> {
    Box::new(a - b)
}

fn main() {
    let mut boite = Box::new(4);
    tripler(&mut boite);
    println!("après tripler : {}", *boite);
    let ecart = difference(&boite, &2);
    println!("écart : {ecart}");
}
```

**Pas à pas :**

| Ligne | Ce qui se passe | Valeur dans `boite` |
|---|---|---|
| `let mut boite = Box::new(4);` | une boîte contenant 4 | 4 |
| `tripler(&mut boite);` | `&mut Box<i32>` devient `&mut i32`, puis `*valeur *= 3` | 12 |
| `difference(&boite, &2)` | `&Box<i32>` devient `&i32` (vers 12) ; `a - b` vaut 10, rangé dans une **nouvelle** boîte | 12 (inchangée) |

Le programme affiche `après tripler : 12` puis `écart : 10`. Écrire `difference(&*boite, &2)` donne le même résultat : `*boite` ouvre la boîte, `&` reprend une référence vers l'entier. Rust le fait tout seul, donc `&boite` suffit.

> [!warning] Piège
> Dans `tripler`, écrire `valeur *= 3` (sans `*`) ne compile pas : `valeur` est une référence, il faut d'abord la suivre avec `*valeur` pour modifier l'entier.

**À retenir :** `*` ouvre la boîte (ou la référence) ; pour fabriquer une boîte, `Box::new(valeur)`.

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
    if let Cons(premier, suite) = &liste {
        println!("premier élément : {premier}");
        if let Cons(deuxieme, _) = &**suite {
            println!("deuxième élément : {deuxieme}");
        }
    }
}
```

Avec `Box`, la taille d'un `Cons` est fixe : un `i32` plus une adresse. Le compilateur est content.

**Pas à pas : pourquoi la taille est infinie sans `Box` ?** Le compilateur calcule la taille d'un `enum` comme la taille de sa plus grosse variante.

| Définition | Calcul de la taille de `Liste` |
|---|---|
| `Cons(i32, Liste)` | 4 octets + taille de `Liste` = 4 + (4 + taille de `Liste`) = ... jamais fini |
| `Cons(i32, Box<Liste>)` | 4 octets + taille d'une adresse (8 octets) : nombre fixe |

La `Box` casse la boucle : à l'intérieur de `Cons`, on ne range plus une liste entière, seulement son **adresse**.

> [!warning] Piège
> Écrire `Cons(i32, Liste)` donne l'erreur « recursive type has infinite size ». La solution est toujours de mettre une `Box` (ou une autre indirection comme `Rc`) à l'endroit de la récursion.

**À retenir :** un type qui se contient lui-même a besoin d'une `Box` (ou d'un `Rc`) à l'endroit où il se répète.

### Parcourir une liste par récursion

Une liste est **soit** `Vide`, **soit** `Cons(valeur, suite)`. Une fonction sur la liste a donc toujours deux bras dans son `match` :

- le cas `Vide` : la réponse directe (0, 1, `false`, ...) ;
- le cas `Cons(valeur, suite)` : on combine `valeur` avec le résultat de la fonction appelée sur `suite`.

Quand on fait `match liste` avec `liste: &Liste`, les morceaux sont des références : `valeur` est un `&i32` (on écrit `*valeur` pour l'entier) et `suite` est un `&Box<Liste>`, qu'on peut passer directement là où un `&Liste` est attendu.

```rust
enum Liste {
    Cons(i32, Box<Liste>),
    Vide,
}

use Liste::{Cons, Vide};

fn produit(liste: &Liste) -> i32 {
    match liste {
        Vide => 1,
        Cons(valeur, suite) => valeur * produit(suite),
    }
}

fn nombre_de_pairs(liste: &Liste) -> usize {
    match liste {
        Vide => 0,
        Cons(valeur, suite) => {
            let ici = if *valeur % 2 == 0 { 1 } else { 0 };
            ici + nombre_de_pairs(suite)
        }
    }
}

fn main() {
    let liste = Cons(2, Box::new(Cons(3, Box::new(Cons(4, Box::new(Vide))))));
    println!("produit : {}", produit(&liste));
    println!("pairs : {}", nombre_de_pairs(&liste));
}
```

**Pas à pas : `produit` sur la liste 2 → 3 → 4 → Vide.**

| Appel | Bras choisi | Résultat |
|---|---|---|
| `produit(2 → 3 → 4 → Vide)` | `Cons(2, suite)` | 2 × `produit(3 → 4 → Vide)` |
| `produit(3 → 4 → Vide)` | `Cons(3, suite)` | 3 × `produit(4 → Vide)` |
| `produit(4 → Vide)` | `Cons(4, suite)` | 4 × `produit(Vide)` |
| `produit(Vide)` | `Vide` | 1 |

On remonte : 4 × 1 = 4, puis 3 × 4 = 12, puis 2 × 12 = **24**. Pour le produit, le cas `Vide` vaut 1 (et pas 0, sinon tout serait multiplié par 0). Pour une somme ou un comptage, ce serait 0. Pour une recherche (« la valeur est-elle présente ? »), le cas `Vide` répond `false`, et le cas `Cons` répond « c'est cette valeur **ou** elle est dans la suite » (`||`).

**Construire une liste.** On part de la **fin** : la liste vide, puis on ajoute les maillons devant. Pour construire depuis une tranche `&[i32]`, deux façons :

- par récursion : on découpe la tranche avec le motif `[premier, reste @ ..]` (ou `split_first()`), le premier élément devient la valeur du maillon et le `reste` donne la suite ;
- avec une boucle sur la tranche à l'envers (`.iter().rev()`), en mettant chaque valeur devant ce qu'on a déjà.

```rust
fn decrire(valeurs: &[i32]) {
    match valeurs {
        [] => println!("tranche vide"),
        [premier, reste @ ..] => {
            println!("premier : {premier}, reste : {reste:?}");
            decrire(reste);
        }
    }
}

fn main() {
    decrire(&[7, 8, 9]);
}
```

Ce programme affiche `premier : 7, reste : [8, 9]`, puis `premier : 8, reste : [9]`, puis `premier : 9, reste : []`, puis `tranche vide`.

> [!warning] Piège
> Si tu construis la liste en parcourant la tranche **dans l'ordre** et en ajoutant chaque valeur **devant**, la liste sort à l'envers (`[7, 8, 9]` donne 9 → 8 → 7). Soit tu pars de la fin (`.rev()`), soit tu utilises la récursion.

**À retenir :** une fonction sur une liste = un `match` à deux bras : la réponse pour `Vide`, puis « valeur combinée avec l'appel sur la suite ».

### Un arbre binaire

Un nœud peut avoir 0, 1 ou 2 enfants : on utilise `Option<Box<Noeud>>`. `None` veut dire « pas d'enfant ici ».

```rust
struct Noeud {
    valeur: i32,
    gauche: Option<Box<Noeud>>,
    droite: Option<Box<Noeud>>,
}

fn nombre_de_noeuds(arbre: &Option<Box<Noeud>>) -> usize {
    match arbre {
        None => 0,
        Some(noeud) => 1 + nombre_de_noeuds(&noeud.gauche) + nombre_de_noeuds(&noeud.droite),
    }
}

fn main() {
    let arbre = Some(Box::new(Noeud {
        valeur: 1,
        gauche: Some(Box::new(Noeud { valeur: 2, gauche: None, droite: None })),
        droite: None,
    }));
    if let Some(racine) = &arbre {
        println!("racine : {}", racine.valeur);
    }
    println!("nœuds : {}", nombre_de_noeuds(&arbre));
}
```

Même idée que pour la liste : `None` donne la réponse directe, `Some(noeud)` combine le nœud avec les appels sur `noeud.gauche` et `noeud.droite`. Ici : 1 (la racine) + 1 (le nœud 2) + 0 (pas d'enfant à droite) = **2** nœuds.

**La hauteur** d'un arbre est son nombre de niveaux : 0 pour un arbre vide, 1 pour un nœud seul, et sinon 1 + la plus grande hauteur entre la gauche et la droite (on prend le **maximum**, pas la somme : on cherche le chemin le plus long, pas le nombre de nœuds).

| Arbre | Hauteur |
|---|---|
| vide (`None`) | 0 |
| un seul nœud | 1 + max(0, 0) = 1 |
| une racine avec un enfant à gauche | 1 + max(1, 0) = 2 |
| 4 → 5 → 6 → 7 (chaque nœud n'a qu'un enfant à droite) | 4 |

**À retenir :** `None` = arbre vide ; une fonction sur un arbre traite `None`, puis le nœud en s'appelant sur ses deux enfants.

### L'arbre binaire de recherche

Dans un **arbre binaire de recherche**, pour chaque nœud : tout ce qui est à **gauche** est plus **petit**, tout ce qui est à **droite** est plus **grand**.

**Insérer** une valeur : on part de la racine ; plus petite → on descend à gauche, plus grande → à droite, égale → elle y est déjà, on ne change rien. On s'arrête sur une place vide (`None`), où l'on crée le nouveau nœud.

**Exemple résolu : on insère 8, 3, 10, 1, 6 dans un arbre vide.**

| Valeur | Chemin suivi | Place trouvée |
|---|---|---|
| 8 | arbre vide | racine |
| 3 | 3 < 8 : gauche, vide | gauche de 8 |
| 10 | 10 > 8 : droite, vide | droite de 8 |
| 1 | 1 < 8 : gauche ; 1 < 3 : gauche, vide | gauche de 3 |
| 6 | 6 < 8 : gauche ; 6 > 3 : droite, vide | droite de 3 |

```text
        8
       / \
      3   10
     / \
    1   6
```

**Chercher** une valeur suit le même chemin : chercher 6 → 6 < 8, gauche → 6 > 3, droite → trouvé. Chercher 7 → gauche de 8, droite de 3, on arrive sur le 6 : 7 > 6, droite, `None` → absent. On ne visite **qu'une branche**, pas tout l'arbre.

**Modifier un arbre en Rust.** Pour changer un enfant, la fonction **prend** l'arbre (sans `&`), le modifie et le **renvoie**. Pour sortir un enfant de son nœud, `take()` le récupère et laisse `None` à sa place.

```rust
struct Noeud {
    valeur: i32,
    gauche: Option<Box<Noeud>>,
    droite: Option<Box<Noeud>>,
}

fn feuille(valeur: i32) -> Option<Box<Noeud>> {
    Some(Box::new(Noeud { valeur, gauche: None, droite: None }))
}

fn ajouter_dix(arbre: Option<Box<Noeud>>) -> Option<Box<Noeud>> {
    match arbre {
        None => None,
        Some(mut noeud) => {
            noeud.valeur += 10;
            noeud.gauche = ajouter_dix(noeud.gauche.take());
            noeud.droite = ajouter_dix(noeud.droite.take());
            Some(noeud)
        }
    }
}

fn prefixe(arbre: &Option<Box<Noeud>>) -> Vec<i32> {
    match arbre {
        None => Vec::new(),
        Some(noeud) => {
            let mut valeurs = vec![noeud.valeur];
            valeurs.extend(prefixe(&noeud.gauche));
            valeurs.extend(prefixe(&noeud.droite));
            valeurs
        }
    }
}

fn main() {
    let mut arbre = Some(Box::new(Noeud { valeur: 8, gauche: feuille(3), droite: feuille(10) }));
    println!("avant : {:?}", prefixe(&arbre));
    arbre = ajouter_dix(arbre);
    println!("après : {:?}", prefixe(&arbre));
}
```

**Pas à pas de `ajouter_dix` :** sur `Some(mut noeud)`, on change la valeur (8 devient 18), on **sort** l'enfant gauche avec `take()`, on lui applique la fonction, on le **remet** ; pareil à droite ; puis on renvoie `Some(noeud)`. Le programme affiche `avant : [8, 3, 10]` puis `après : [18, 13, 20]`. Sans `take()`, on ne pourrait pas donner `noeud.gauche` à la fonction (qui le prend) tout en gardant `noeud`.

**Les trois parcours** d'un arbre, sur l'arbre 8 / 3 / 10 / 1 / 6 dessiné plus haut :

| Parcours | Ordre de visite | Résultat |
|---|---|---|
| préfixe | nœud, puis gauche, puis droite | 8, 3, 1, 6, 10 |
| en ordre (infixe) | gauche, puis nœud, puis droite | 1, 3, 6, 8, 10 |
| suffixe | gauche, puis droite, puis nœud | 1, 6, 3, 10, 8 |

Dans un arbre de recherche, le parcours **en ordre** donne les valeurs **triées** : tout ce qui est à gauche (plus petit) passe avant le nœud, tout ce qui est à droite (plus grand) après. Pour l'écrire, on change juste l'ordre des lignes dans `prefixe` : d'abord la gauche, puis `push` du nœud, puis la droite.

> [!tip] Astuce
> Pour modifier un enfant, `take()` sort la valeur d'un `Option` en laissant `None` à la place : `noeud.gauche.take()`. C'est pratique pour reconstruire un arbre.

**À retenir :** insérer ou chercher = comparer puis descendre à gauche (plus petit) ou à droite (plus grand) ; modifier = prendre l'arbre, `take()` l'enfant, le remettre, renvoyer l'arbre.

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

**Pas à pas :** le `Vec` contient deux boîtes de même taille. Au premier tour, la boîte contient un `Chien` : Rust appelle la méthode `faire` de `Chien` et affiche `Wouf`. Au second tour, c'est une `Voiture` : `Vroum`. Le choix de la méthode se fait pendant l'exécution, selon ce qu'il y a vraiment dans la boîte. Un `Vec<Chien>` ne pourrait contenir que des chiens.

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

Pourquoi la `Box` ? Chaque fermeture (`|x| x * 2`, `|x| x`) a son **propre type**, unique, même si elles se ressemblent. Les bras d'un `match` doivent tous donner le même type : sans `Box`, deux fermetures différentes sont refusées. `Box<dyn Fn(i32) -> i32>` veut dire « une boîte qui contient **n'importe quelle** fonction qui prend un `i32` et renvoie un `i32` » : toutes les fermetures entrent dans ce même type.

Quand un nom peut être inconnu, on renvoie un `Option` : `Some(Box::new(...))` pour un nom connu, `None` sinon.

```rust
fn transformer(nom: &str) -> Option<Box<dyn Fn(i32) -> i32>> {
    match nom {
        "moitie" => Some(Box::new(|x| x / 2)),
        "plus_un" => Some(Box::new(|x| x + 1)),
        _ => None,
    }
}

fn main() {
    if let Some(f) = transformer("moitie") {
        println!("moitié de 30 : {}", f(30));
    }
    println!("inconnu : {}", transformer("triple").is_none());
}
```

**Pas à pas :** `transformer("moitie")` tombe dans le premier bras et renvoie `Some(boîte)` ; `if let Some(f)` sort la fonction ; `f(30)` vaut 15. `transformer("triple")` ne correspond à aucun nom : `_ => None`, donc `is_none()` affiche `true`.

**À retenir :** pour ranger ensemble des valeurs (ou des fermetures) de types différents, mets-les dans des `Box<dyn Trait>` (ou `Box<dyn Fn(...) -> ...>`).

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

**Pas à pas :**

1. `MaBoite(T)` est une structure tuple : son seul champ s'appelle `self.0`.
2. `type Target = T;` dit « quand on me suit, on tombe sur un `T` ».
3. `deref` renvoie `&self.0`, une **référence** vers la valeur rangée (pas la valeur elle-même : on ne la sort pas de la boîte).
4. `*boite` devient `*(boite.deref())` = `*(&5)` = `5`.

**À retenir :** implémenter `Deref`, c'est écrire `type Target` et une méthode `deref` qui renvoie `&` vers le contenu.

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

**Pas à pas sur `saluer(&boite)` :**

| Étape | Type obtenu | Grâce à |
|---|---|---|
| départ | `&MaBoite<String>` | |
| 1er `deref` | `&String` | notre `impl Deref for MaBoite` |
| 2e `deref` | `&str` | `String` implémente `Deref<Target = str>` |

Le type attendu (`&str`) est atteint : l'appel compile. Pour `boite.len()`, c'est pareil : `MaBoite` n'a pas de méthode `len`, alors Rust cherche dans `String` (après un `deref`) et la trouve.

> [!warning] Piège
> Le `&` reste obligatoire : `saluer(boite)` (sans `&`) donne une `MaBoite<String>`, pas une référence, et la coercion ne s'applique pas. Elle transforme une référence en une autre référence, jamais une valeur en référence.

> [!info] À savoir
> `DerefMut` fait la même chose pour les références mutables. C'est grâce à `Deref` qu'on appelle `.len()` directement sur une `Box<String>`.

**À retenir :** avec `Deref`, `&MonType` se transforme tout seul en `&Contenu` (et plus loin si besoin) quand on passe un argument ou appelle une méthode.

### Compter les lettres : `len()` ou `chars().count()` ?

Une `String` est rangée en **UTF-8** : une lettre simple (`a`, `z`) prend 1 octet, une lettre accentuée (`é`, `ë`) en prend 2.

- `texte.len()` compte les **octets** ;
- `texte.chars().count()` compte les **caractères** (les lettres qu'on voit).

```rust
let mot = "Noël";
println!("octets : {}", mot.len());
println!("caractères : {}", mot.chars().count());
```

**Pas à pas :** `N` (1 octet) + `o` (1) + `ë` (2) + `l` (1) = **5** octets, mais **4** caractères. Pour un mot sans accent, les deux donnent le même nombre, ce qui cache l'erreur.

**À retenir :** « nombre de lettres » = `chars().count()` ; `len()` = taille en octets.

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

**Pas à pas :**

| Moment | Affichage |
|---|---|
| `_a` créée, puis `_b` créée dans le bloc | (rien) |
| `println!` dans le bloc | `dans le bloc` |
| `}` : fin du bloc, `_b` sort de sa portée | `Libération de b` |
| `println!` après le bloc | `fin du main` |
| `}` : fin de `main`, `_a` sort de sa portée | `Libération de a` |

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

Ici `jeton 1 libéré` s'affiche **avant** `après drop` : `drop(j)` prend `j` (elle lui appartient maintenant) et, à la fin de cette petite fonction, la valeur sort de portée. Après cette ligne, `j` n'est plus utilisable (elle a été déplacée).

> [!warning] Piège
> `let _ = Jeton(2);` libère la valeur **tout de suite**, alors que `let _j = Jeton(2);` la garde jusqu'à la fin de la portée. Le simple `_` ne crée pas de variable.

### Plusieurs valeurs, une boîte, une boucle

**Exemple résolu : dans quel ordre ce programme affiche-t-il les libérations ?**

```rust
struct Lampe(&'static str);

impl Drop for Lampe {
    fn drop(&mut self) {
        println!("{} éteinte", self.0);
    }
}

fn main() {
    let _x = Lampe("x");
    let _y = Box::new(Lampe("y"));
    let z = Lampe("z");
    for nom in ["t1", "t2"] {
        let _tour = Lampe(nom);
        println!("tour {nom}");
    }
    drop(z);
    println!("fin");
}
```

| Moment | Affichage | Pourquoi |
|---|---|---|
| tour 1 de la boucle | `tour t1` puis `t1 éteinte` | `_tour` meurt à la fin de **chaque** tour |
| tour 2 | `tour t2` puis `t2 éteinte` | même chose |
| `drop(z)` | `z éteinte` | libérée tout de suite |
| `println!("fin")` | `fin` | |
| fin de `main` | `y éteinte` puis `x éteinte` | ordre inverse : `_y` a été créée après `_x` |

Libérer une `Box` libère ce qu'elle contient : la `Lampe("y")` dans la boîte est éteinte quand `_y` disparaît.

**À retenir :** une valeur meurt à la `}` de son bloc (ou de son tour de boucle), ou plus tôt avec `drop(valeur)` ; à la même `}`, la dernière créée meurt la première.

### Un compteur partagé avec `Cell`

Dans `drop`, on n'a que `&mut self` : pour prévenir le reste du programme, la valeur doit garder un lien vers un compteur commun. On utilise un `Rc<Cell<u32>>` :

- `Cell<T>` est une case qu'on peut modifier avec `set` même à travers une référence **non mutable** ; `get()` lit une copie de la valeur (le chapitre suivant détaille `Cell`) ;
- `Rc` permet à plusieurs valeurs de partager **la même** case (section 5).

**Exemple résolu : compter les connexions encore ouvertes.** Chaque `Connexion` ajoute 1 en naissant et enlève 1 en mourant.

```rust
use std::cell::Cell;
use std::rc::Rc;

struct Connexion {
    ouvertes: Rc<Cell<i32>>,
}

impl Connexion {
    fn ouvrir(ouvertes: &Rc<Cell<i32>>) -> Connexion {
        ouvertes.set(ouvertes.get() + 1);
        Connexion { ouvertes: Rc::clone(ouvertes) }
    }
}

impl Drop for Connexion {
    fn drop(&mut self) {
        self.ouvertes.set(self.ouvertes.get() - 1);
    }
}

fn main() {
    let ouvertes = Rc::new(Cell::new(0));
    let premiere = Connexion::ouvrir(&ouvertes);
    {
        let _seconde = Connexion::ouvrir(&ouvertes);
        println!("dans le bloc : {}", ouvertes.get());
    }
    println!("après le bloc : {}", ouvertes.get());
    drop(premiere);
    println!("après drop : {}", ouvertes.get());
}
```

| Moment | Valeur de la case |
|---|---|
| départ | 0 |
| `premiere` ouverte | 1 |
| `_seconde` ouverte | 2 → affiche `dans le bloc : 2` |
| fin du bloc : `_seconde` meurt, `drop` enlève 1 | 1 → affiche `après le bloc : 1` |
| `drop(premiere)` | 0 → affiche `après drop : 0` |

Pour modifier un `Cell`, on lit avec `get()`, on calcule, puis on réécrit avec `set(...)` : `case.set(case.get() + 1)`.

**À retenir :** pour qu'un `drop` agisse sur quelque chose de commun, la valeur garde un `Rc<Cell<...>>` et fait `set(get() ± 1)` dans `drop`.

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

**Pas à pas du compteur (il n'y a qu'un seul compteur, partagé par `a`, `b` et `c`) :**

| Ligne | Propriétaires | `strong_count` affiché |
|---|---|---|
| `Rc::new(...)` | `a` | 1 |
| `let b = Rc::clone(&a);` | `a`, `b` | 2 |
| `let c = Rc::clone(&a);` dans le bloc | `a`, `b`, `c` | 3 |
| fin du bloc, `c` disparaît | `a`, `b` | 2 (on peut le lire par `a` ou par `b`) |

La chaîne `"partagé"` n'existe qu'**une fois** en mémoire ; elle sera libérée quand `a` et `b` auront aussi disparu (compteur à 0).

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
    let a = Cons(1, Rc::clone(&commune));
    let _b = Cons(2, Rc::clone(&commune));
    println!("{}", Rc::strong_count(&commune));
    if let Cons(tete, suite) = &a {
        println!("a commence par {tete}, suite commune : {}", Rc::ptr_eq(suite, &commune));
    }
}
```

**Pas à pas :** `commune` est un propriétaire (1). `a` garde un `Rc::clone` vers `commune` (2). `_b` aussi (3). Le programme affiche **3**, puis `a commence par 1, suite commune : true` : la suite de `a` est bien `commune` elle-même (`Rc::ptr_eq`, voir plus bas), pas une copie.

```text
_a  = 1 ─┐
         ├─> 10 -> Vide   (commune)
_b = 2 ─┘
```

### Parcourir une liste faite de `Rc`

Dans `Cons(valeur, suite)`, `suite` est maintenant un `&Rc<Liste>`. Grâce à `Deref`, il se passe là où un `&Liste` est attendu : la récursion s'écrit exactement comme avec `Box`.

```rust
use std::rc::Rc;

enum Liste {
    Cons(i32, Rc<Liste>),
    Vide,
}

use Liste::{Cons, Vide};

fn plus_grand(liste: &Liste) -> Option<i32> {
    match liste {
        Vide => None,
        Cons(valeur, suite) => match plus_grand(suite) {
            Some(reste) if reste > *valeur => Some(reste),
            _ => Some(*valeur),
        },
    }
}

fn main() {
    let fin = Rc::new(Cons(7, Rc::new(Cons(2, Rc::new(Vide)))));
    let tete = Rc::new(Cons(4, Rc::clone(&fin)));
    println!("plus grand de tete : {:?}", plus_grand(&tete));
    println!("même fin partagée : {}", match &*tete {
        Cons(_, suite) => Rc::ptr_eq(suite, &fin),
        Vide => false,
    });
    println!("propriétaires de fin : {}", Rc::strong_count(&fin));
}
```

**Pas à pas :**

1. `tete` = 4 → (fin) = 4 → 7 → 2. `plus_grand` compare chaque valeur au plus grand de la suite : 2, puis max(7, 2) = 7, puis max(4, 7) = 7. Affiche `Some(7)`.
2. `&*tete` ouvre le `Rc` pour pouvoir faire un `match` sur la `Liste`. `Rc::ptr_eq(a, b)` répond `true` si les deux `Rc` pointent vers **la même** case mémoire : la suite de `tete` est bien `fin` elle-même, pas une copie.
3. `fin` a 2 propriétaires : la variable `fin` et le maillon 4.

Pour ajouter un maillon devant une liste existante sans la copier : `Rc::new(Cons(valeur, Rc::clone(&suite)))`.

> [!warning] Piège
> `Rc` ne donne que des références **non mutables** vers son contenu. Pour modifier, on le combine avec `RefCell<T>` (aperçu plus bas). `Rc` n'est pas utilisable entre threads : le compilateur refuse.

**À retenir :** `Rc::new` crée le premier propriétaire, `Rc::clone(&rc)` en ajoute un (+1), chaque disparition enlève 1 ; `Rc::strong_count` lit le total.

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

**Pas à pas :** `notes` et `autre` sont deux propriétaires du **même** `RefCell`. `autre.borrow_mut()` ouvre l'accès en écriture, `push(18)` ajoute la note, et l'accès se referme à la fin de la ligne. `notes.borrow()` lit le même vecteur : `[12, 15, 18]`.

`Rc<RefCell<T>>` est la combinaison courante : plusieurs propriétaires qui peuvent tous modifier.

**À retenir :** `Rc` partage, `RefCell` permet de modifier ce qui est partagé (`borrow()` pour lire, `borrow_mut()` pour écrire).

## 7. `Weak<T>` et les cycles

Si `A` contient un `Rc` vers `B` et `B` un `Rc` vers `A`, les compteurs ne tombent jamais à 0 : c'est une **fuite mémoire** (Rust ne l'interdit pas, c'est « sûr » mais pas gratuit).

**Pas à pas du cycle :** les variables `a` et `b` donnent chacune 1 au compteur de leur valeur, et chaque valeur donne 1 au compteur de l'autre. Compteurs : A = 2, B = 2. À la fin de `main`, les variables disparaissent : A = 1, B = 1. Chacun reste tenu par l'autre, aucun n'atteint 0, aucun n'est libéré. Le programme compile et tourne : c'est seulement de la mémoire perdue.

La solution : un lien **faible**. `Weak<T>` pointe vers la valeur sans la garder en vie.

- `Rc::downgrade(&rc)` crée un `Weak` ;
- `Weak::new()` crée un `Weak` qui ne pointe vers rien (pour « pas encore de parent ») ;
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
    println!("enfants de branche : {}", branche.enfants.borrow().len());
}
```

**Pas à pas :**

| Étape | Ce qui se passe | Affichage |
|---|---|---|
| création de `feuille` | son parent est `Weak::new()` (vide) | `upgrade()` donne `None` → `parent : None` |
| création de `branche` | sa liste d'enfants reçoit un `Rc::clone(&feuille)` | |
| `*feuille.parent.borrow_mut() = Rc::downgrade(&branche)` | on remplace le lien vide par un lien faible vers `branche` | |
| deuxième lecture du parent | `upgrade()` retrouve `branche` | `parent : Some("branche")` |
| compteurs de `branche` | forts : seulement la variable `branche` ; faibles : le lien de `feuille` | `forts : 1, faibles : 1` |

Et `feuille` ? Forts : la variable `feuille` + la liste d'enfants de `branche` = 2.

Les trois écritures à connaître :

- `*noeud.parent.borrow_mut() = Rc::downgrade(&autre);` : `borrow_mut()` ouvre la case, `*` permet de **remplacer** son contenu ;
- `noeud.enfants.borrow_mut().push(Rc::clone(&enfant));` : ajoute un enfant ;
- `noeud.parent.borrow().upgrade()` : donne `Some(Rc)` ou `None` ; `.map(|p| ...)` transforme le `Rc` en ce qu'on veut (un nom, par exemple) en gardant le `None`.

### Remonter vers la racine

Comme chaque nœud connaît son parent, on peut remonter : on demande le parent, et s'il existe, on recommence à partir de lui. On s'arrête quand `upgrade()` donne `None` (la racine).

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Noeud {
    nom: String,
    parent: RefCell<Weak<Noeud>>,
}

fn creer(nom: &str, parent: Option<&Rc<Noeud>>) -> Rc<Noeud> {
    let lien = match parent {
        Some(p) => Rc::downgrade(p),
        None => Weak::new(),
    };
    Rc::new(Noeud { nom: nom.to_string(), parent: RefCell::new(lien) })
}

fn profondeur(noeud: &Noeud) -> usize {
    match noeud.parent.borrow().upgrade() {
        Some(parent) => 1 + profondeur(&parent),
        None => 0,
    }
}

fn main() {
    let maison = creer("maison", None);
    let cuisine = creer("cuisine", Some(&maison));
    let placard = creer("placard", Some(&cuisine));
    println!("{} est à la profondeur {}", placard.nom, profondeur(&placard));
    drop(maison);
    println!("après la disparition de maison : {}", profondeur(&placard));
}
```

**Pas à pas :** `profondeur(placard)` → parent `cuisine` trouvé : 1 + `profondeur(cuisine)` → parent `maison` trouvé : 1 + `profondeur(maison)` → pas de parent : 0. Total 1 + 1 + 0 = **2**. Ensuite `drop(maison)` : personne d'autre ne possède `maison` (la cuisine n'a qu'un `Weak`), elle est libérée. Le lien faible de `cuisine` ne trouve plus rien, `upgrade()` donne `None`, et la profondeur tombe à **1**.

> [!tip] Astuce
> Si tu hésites entre `Rc` et `Weak` pour un lien : demande-toi « si cet objet disparaît, l'autre doit-il disparaître aussi ? ». Si non, c'est un `Weak`.

**À retenir :** lien qui possède = `Rc` (compte dans `strong_count`) ; lien qui connaît = `Weak` (compte dans `weak_count`), à relire avec `upgrade()` qui peut donner `None`.

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

**Pas à pas :** à chaque tour, `Arc::clone` donne au thread son propre propriétaire du **même** vecteur (le compteur monte de 1, rien n'est copié). `move` fait entrer `copie` dans le thread. Les trois threads calculent 10, 20 et 30, que `join()` récupère dans l'ordre des tâches. Avec `Rc` à la place, le compilateur refuserait `thread::spawn`.

On le retrouve presque toujours avec `Mutex<T>` (`Arc<Mutex<T>>`), vu dans le chapitre sur la concurrence.

**À retenir :** `Arc` = `Rc` pour plusieurs threads ; même usage (`Arc::new`, `Arc::clone`).

## 9. Quel pointeur choisir ?

| Besoin | Choix |
|---|---|
| Un seul propriétaire, valeur sur le tas ou récursive | `Box<T>` |
| Plusieurs types derrière un même trait | `Box<dyn Trait>` |
| Plusieurs propriétaires, un seul thread | `Rc<T>` |
| Plusieurs propriétaires, plusieurs threads | `Arc<T>` |
| Modifier à travers un `Rc` | `Rc<RefCell<T>>` |
| Lien vers le parent, éviter un cycle | `Weak<T>` |

**Exemple résolu : quel type pour chaque lien d'un logiciel de dossiers ?**

1. Un dossier contient ses sous-dossiers, et chaque sous-dossier n'a qu'un dossier parent : si le dossier disparaît, ses sous-dossiers aussi → le parent **possède** ses enfants.
2. Mais un sous-dossier doit aussi pouvoir retrouver son parent : s'il le possédait aussi, on aurait un cycle → `Weak`.
3. Comme on ajoute des enfants après la création, on met les champs dans des `RefCell`.

Résultat : `enfants: RefCell<Vec<Rc<Dossier>>>` et `parent: RefCell<Weak<Dossier>>`.

**À retenir :** pose-toi deux questions : « combien de propriétaires ? » (un : `Box`, plusieurs : `Rc` / `Arc`) et « ce lien doit-il garder l'autre en vie ? » (non : `Weak`).

## 10. À retenir

- `Box<T>` : tas, un seul propriétaire ; indispensable pour les types récursifs et `dyn Trait`.
- Une fonction sur une liste ou un arbre : un `match` avec le cas vide, puis l'appel récursif sur la suite ou les enfants.
- Arbre de recherche : plus petit à gauche, plus grand à droite ; le parcours en ordre donne les valeurs triées.
- `Deref` : fait marcher `*` et la coercion `&Box<String>` vers `&str`.
- `Drop` : code exécuté à la fin de vie, ordre inverse de création ; `drop(valeur)` pour libérer plus tôt.
- `Rc<T>` : propriété partagée ; `Rc::clone` ajoute 1 au compteur.
- `Weak<T>` : lien qui ne compte pas ; `upgrade()` renvoie un `Option`.
- Un cycle de `Rc` fuit la mémoire : on le casse avec un `Weak`.
- `Arc<T>` : l'équivalent de `Rc` pour les threads.
