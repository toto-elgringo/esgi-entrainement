# Collections : Vec, HashMap, HashSet

Une **collection** est une valeur qui contient plusieurs valeurs. Les trois collections à connaître :

| Collection | C'est quoi ? | Exemple d'usage |
|---|---|---|
| `Vec<T>` | une liste ordonnée qui peut grandir | des notes, des mots, des scores |
| `HashMap<K, V>` | un dictionnaire : une **clé** donne une **valeur** | nom → numéro de téléphone |
| `HashSet<T>` | un ensemble **sans doublons** | les mots déjà vus |

Les trois rangent leurs éléments sur le **tas** (la mémoire qui peut grandir pendant l'exécution) et libèrent tout automatiquement quand elles disparaissent.

**Exemple résolu : quelle collection choisir ?**

| Besoin | Collection | Pourquoi |
|---|---|---|
| garder les notes d'un élève dans l'ordre où elles arrivent | `Vec<u32>` | l'ordre compte, et la même note peut revenir deux fois |
| retrouver le prix d'un produit à partir de son nom | `HashMap<String, f64>` | on cherche une valeur (le prix) grâce à une clé (le nom) |
| savoir quels pays un voyageur a déjà visités | `HashSet<String>` | un pays visité deux fois ne compte qu'une fois |

**À retenir :** une liste dans l'ordre → `Vec` ; « je cherche par une clé » → `HashMap` ; « sans doublons, seulement présent ou pas » → `HashSet`.

## 1. `Vec<T>` : la liste

`T` est le type des éléments : `Vec<i32>` est une liste d'entiers, `Vec<String>` une liste de textes. Tous les éléments d'un `Vec` ont le **même** type.

### Créer une liste

| Écriture | Résultat |
|---|---|
| `Vec::new()` | une liste vide (il faut souvent préciser le type : `let v: Vec<i32> = Vec::new();`) |
| `vec![2, 3, 5]` | une liste remplie avec ces valeurs, dans cet ordre |
| `vec![valeur; n]` | une liste de `n` cases, **toutes** égales à `valeur` |

**Exemple résolu : que crée `vec![7; 4]` ?**

1. On lit la forme `vec![valeur; n]` : avant le `;` la **valeur**, après le `;` le **nombre de cases**.
2. Ici la valeur est `7` et le nombre de cases est `4`.
3. On obtient 4 cases qui valent toutes 7 : `[7, 7, 7, 7]`.

Piège : `vec![7, 4]` (avec une **virgule**) est une liste de deux éléments, `[7, 4]`. Et `vec![7; 4]` ne compte pas de 0 à 4 : il répète.

```rust
let vide: Vec<i32> = Vec::new();
let premiers = vec![2, 3, 5, 7];
let sept = vec![7; 4];
println!("{:?} {:?} {:?}", vide, premiers, sept);
```

**À retenir :** `;` dans `vec![...]` = « répéter », `,` = « lister ».

### Ajouter, retirer, compter : `push`, `pop`, `len`

- `v.push(x)` ajoute `x` à la **fin**. La liste doit être déclarée `mut`.
- `v.pop()` retire le **dernier** élément et le renvoie dans une `Option` : `Some(valeur)` s'il y avait un élément, `None` si la liste était vide (pas de panique).
- `v.len()` donne le nombre d'éléments (un `usize`).

> [!info] `{:?}`
> `{}` affiche une valeur « pour un humain ». `{:?}` affiche une valeur « pour un développeur » (mode *Debug*) : c'est lui qu'il faut pour un `Vec`, une `Option` ou une `HashMap`. Avec `{}`, la compilation échoue.

**Exemple résolu : on suit la liste pas à pas.**

```rust
let mut v = vec![8, 2];
v.push(6);
let a = v.pop();
let b = v.pop();
let c = v.pop();
let d = v.pop();
println!("{:?} {:?} {:?} {:?}", a, b, c, d);
println!("taille finale : {}", v.len());
```

| Ligne | Liste après la ligne | Valeur renvoyée |
|---|---|---|
| `vec![8, 2]` | `[8, 2]` | |
| `push(6)` | `[8, 2, 6]` | rien |
| `a = pop()` | `[8, 2]` | `Some(6)` : le dernier |
| `b = pop()` | `[8]` | `Some(2)` |
| `c = pop()` | `[]` | `Some(8)` |
| `d = pop()` | `[]` | `None` : la liste était vide |

Le programme affiche `Some(6) Some(2) Some(8) None` puis `taille finale : 0`.

**À retenir :** `push` et `pop` travaillent toujours à la **fin** ; `pop` sur une liste vide renvoie `None`.

### Lire un élément : `v[i]` ou `v.get(i)`

Les cases sont numérotées à partir de **0** : dans `[10, 20, 30]`, `10` est à l'indice 0, `20` à l'indice 1, `30` à l'indice 2. Il n'y a pas d'indice 3.

| Écriture | Ce qu'on reçoit | Si l'indice n'existe pas |
|---|---|---|
| `v[i]` | la valeur | le programme **panique** à l'exécution (« index out of bounds »). Ça compile quand même : le compilateur ne connaît pas la taille d'un `Vec` |
| `v.get(i)` | `Some(&valeur)`, une `Option` qui contient une **référence** | `None`, à toi de gérer |
| `v.first()` / `v.last()` | `Some(&premier)` / `Some(&dernier)` | `None` si la liste est vide |

```rust
let mut v = vec![10, 20];
v.push(30);
println!("{}", v[1]);
println!("{:?}", v.get(1));
println!("{:?}", v.get(3));
println!("{:?} {:?}", v.first(), v.last());
```

Ce programme affiche `20`, `Some(20)`, `None`, puis `Some(10) Some(30)` (avec `{:?}`, la référence `&20` s'affiche simplement `20`). Écrire `v[3]` à la place de `v.get(3)` arrêterait le programme.

> [!tip] Quand utiliser quoi ?
> `v[i]` quand tu es **sûr** que l'indice existe. `v.get(i)` quand ça dépend des données (saisie, fichier, liste peut-être vide...).

Pour sortir la valeur d'une `Option`, on fait un `match` (vu au chapitre sur les énumérations). Comme `get` donne une **référence** `&i32`, on met une étoile `*x` pour récupérer le nombre lui-même :

**Exemple résolu : afficher le score d'un tour, ou un message s'il n'existe pas.**

```rust
fn score_du_tour(scores: &[u32], tour: usize) -> String {
    match scores.get(tour) {
        Some(s) => format!("tour {tour} : {} points", *s),
        None => format!("tour {tour} : pas joué"),
    }
}

fn main() {
    let scores = vec![12, 7, 15];
    println!("{}", score_du_tour(&scores, 2));
    println!("{}", score_du_tour(&scores, 5));
}
```

1. Avec `tour = 2` : la liste a les indices 0, 1, 2. `get(2)` renvoie `Some(&15)`, on entre dans la branche `Some(s)` avec `s = &15`, et `*s` vaut `15` : « tour 2 : 15 points ».
2. Avec `tour = 5` : l'indice 5 n'existe pas, `get(5)` renvoie `None`, on entre dans la branche `None` : « tour 5 : pas joué ». Aucune panique.

Pour regarder deux `Option` à la fois (par exemple le premier **et** le dernier élément), on fait un `match` sur le **couple** `(a, b)` :

**Exemple résolu : l'écart entre le premier et le dernier élément.**

```rust
fn ecart(v: &[i32]) -> Option<i32> {
    match (v.first(), v.last()) {
        (Some(debut), Some(fin)) => Some(*fin - *debut),
        _ => None,
    }
}

fn main() {
    println!("{:?}", ecart(&[4, 9, 11]));
    println!("{:?}", ecart(&[]));
}
```

1. `[4, 9, 11]` : `first()` donne `Some(&4)`, `last()` donne `Some(&11)`. Le couple vaut `(Some(&4), Some(&11))`, il correspond à la première branche : `Some(11 - 4)` = `Some(7)`.
2. `[]` : les deux valent `None`. Le couple `(None, None)` ne correspond pas à la première branche, il tombe dans `_` (« tout le reste ») : `None`.

Avec une liste d'un seul élément, `first()` et `last()` renvoient le **même** élément.

Quand on veut agir seulement dans le cas `Some`, `if let` est plus court qu'un `match` :

```rust
let mut v = vec![3];
v.push(6);
if let Some(x) = v.get(1) {
    println!("le 2e élément vaut {x}");
}
if let Some(x) = v.get(8) {
    println!("jamais affiché : {x}");
}
```

`if let Some(x) = ...` veut dire : « si c'est un `Some`, mets la valeur dans `x` et exécute le bloc ; si c'est `None`, ne fais rien ».

**À retenir :** une lecture qui peut échouer passe par `get`, `first` ou `last`, puis par un `match` ou un `if let` ; l'étoile `*` sort la valeur de la référence.

### Parcourir une liste

Il y a trois façons de faire une boucle `for` sur une liste, selon ce qu'on veut faire des éléments :

| Boucle | Type de `x` (pour un `Vec<i32>`) | Ce qu'on peut faire | La liste après |
|---|---|---|---|
| `for x in &v` | `&i32` (référence en lecture) | lire | toujours là |
| `for x in &mut v` | `&mut i32` (référence modifiable) | modifier avec `*x = ...` | toujours là, modifiée |
| `for x in v` | `i32` (la valeur elle-même) | prendre les éléments | **détruite** : la boucle l'a consommée |

```rust
let mut v = vec![1, 2, 3];

for x in &v {
    println!("lu : {x}");
}

for x in &mut v {
    *x *= 10;
}
println!("{:?}", v);

for x in v {
    println!("pris : {x}");
}
```

Après la dernière boucle, `v` n'existe plus : la boucle a pris la **propriété** de la liste (comme un déplacement vers une fonction) et l'a libérée à la fin. Écrire `println!("{:?}", v);` après donnerait l'erreur « borrow of moved value: `v` ». Pour garder la liste, on parcourt `&v`.

**Pourquoi l'étoile dans `*x *= 10` ?** `x` n'est pas un nombre : c'est une **référence**, une flèche vers la case de la liste. `*x` veut dire « la case pointée par `x` ».

| On écrit | Ce que ça veut dire | Résultat |
|---|---|---|
| `x *= 10` | multiplier la **flèche** par 10 | erreur de compilation : on ne peut pas multiplier une référence |
| `*x *= 10` | multiplier la **case pointée** par 10 | correct |
| `v[x] *= 10` | utiliser `x` comme un indice | erreur : `x` est une valeur de la liste, pas une position |

> [!warning] Ne pas modifier une liste pendant qu'on la parcourt
> `for x in &v { v.push(*x); }` ne compile pas (erreur E0502) : on ne peut pas écrire dans `v` pendant qu'on la lit.

**À retenir :** `&v` pour lire, `&mut v` pour modifier (avec `*x`), `v` tout court pour consommer.

### Passer une liste à une fonction

`&[T]` (une **tranche**, ou *slice*) est la version empruntée d'une liste, comme `&str` pour `String`. C'est une vue sur des éléments rangés les uns après les autres en mémoire, **quelle que soit leur origine** : un `&Vec<i32>`, un tableau `&[1, 2, 3]` ou un morceau de liste `&v[1..3]` deviennent tous un `&[i32]`.

| Paramètre | Lire | Modifier les éléments | Ajouter / retirer (changer la taille) |
|---|---|---|---|
| `v: &[i32]` | oui | non | non |
| `v: &mut [i32]` | oui | oui | **non** : une tranche a une taille fixe |
| `v: &mut Vec<i32>` | oui | oui | oui (`push`, `pop`...) |
| `mut v: Vec<i32>` | oui | oui | oui : la fonction **possède** la liste et la renvoie si besoin |

> [!tip] Pourquoi pas `&Vec<i32>` ?
> `&Vec<i32>` marche, mais n'accepte **que** des `Vec`, pas un tableau. Clippy conseille `&[i32]` à la place (avertissement `ptr_arg`). Et `&Vec<i32>` est en lecture seule : avec lui, impossible de modifier les éléments.

**Exemple résolu : une fonction qui remet à zéro les nombres négatifs.**

On veut **modifier** les éléments sans changer la taille : le bon paramètre est `&mut [i32]`.

```rust
fn sans_negatifs(v: &mut [i32]) {
    for x in v {
        if *x < 0 {
            *x = 0;
        }
    }
}

fn main() {
    let mut mesures = vec![4, -2, 7, -5];
    sans_negatifs(&mut mesures);
    println!("{:?}", mesures);
}
```

1. `main` prête la liste en écriture avec `&mut mesures` (la variable doit être `mut`).
2. Dans la fonction, `v` est déjà une référence modifiable : `for x in v` donne des `&mut i32`.
3. On passe les cases une par une : `4` (pas négatif, on ne touche pas), `-2` (négatif, `*x = 0`), `7` (on ne touche pas), `-5` (devient 0).
4. Affichage : `[4, 0, 7, 0]`.

Si la fonction recevait `v: &Vec<i32>` (sans `mut`), `x` serait un `&i32` et `*x = 0` serait refusé : « cannot assign to `*x`, which is behind a `&` reference ». Il faut changer le **paramètre** en `&mut [i32]`, pas seulement l'appel.

**Exemple résolu : ajouter des éléments.** Cette fois la taille change : il faut `&mut Vec<i32>`.

```rust
fn ajouter_carres(v: &mut Vec<i32>, nombres: &[i32]) {
    for n in nombres {
        v.push(*n * *n);
    }
}

fn main() {
    let mut carres = vec![1];
    ajouter_carres(&mut carres, &[2, 3]);
    println!("{:?}", carres);
}
```

`nombres` est une tranche en lecture : `n` est un `&i32`, `*n * *n` calcule le carré. On pousse `4` puis `9` : `[1, 4, 9]`. Avec `v: &mut [i32]`, le `push` serait refusé (« no method named `push` found for mutable reference `&mut [i32]` »).

**À retenir :** lire → `&[T]` ; modifier sans changer la taille → `&mut [T]` ; ajouter ou retirer → `&mut Vec<T>`.

### Trier et nettoyer

| Méthode | Effet | Exemple sur `[3, 1, 3, 2]` |
|---|---|---|
| `sort()` | trie dans l'ordre croissant (les textes : ordre alphabétique) | `[1, 2, 3, 3]` |
| `dedup()` | retire les doublons **qui se suivent** | `[3, 1, 3, 2]` (rien ne se suit !) |
| `reverse()` | inverse l'ordre | `[2, 3, 1, 3]` |
| `truncate(n)` | garde seulement les `n` premiers (ne fait rien si la liste est plus courte) | `truncate(2)` → `[3, 1]` |
| `contains(&x)` | `true` si `x` est dans la liste | `contains(&2)` → `true` |
| `to_vec()` | crée un **nouveau** `Vec`, copie d'une tranche | |

Ces méthodes (sauf `contains` et `to_vec`) **modifient** la liste : elle doit être `mut`. Une tranche `&[T]` reçue en lecture ne peut pas être triée : on en fait d'abord une copie avec `to_vec()`.

> [!warning] `dedup` ne voit que ses voisins
> `dedup` compare chaque élément au **précédent**. Pour retirer **tous** les doublons, trie d'abord : après `sort()`, les valeurs égales sont côte à côte.

**Exemple résolu : les deux plus petites valeurs différentes de `[6, 2, 9, 2, 6]`, dans une fonction qui reçoit une tranche.**

```rust
fn deux_plus_petites(v: &[i32]) -> Vec<i32> {
    let mut copie = v.to_vec();
    copie.sort();
    copie.dedup();
    copie.truncate(2);
    copie
}

fn main() {
    println!("{:?}", deux_plus_petites(&[6, 2, 9, 2, 6]));
    println!("{:?}", deux_plus_petites(&[5]));
}
```

| Étape | Liste |
|---|---|
| `to_vec()` (copie modifiable) | `[6, 2, 9, 2, 6]` |
| `sort()` | `[2, 2, 6, 6, 9]` |
| `dedup()` | `[2, 6, 9]` |
| `truncate(2)` | `[2, 6]` |

Avec `[5]`, `truncate(2)` ne fait rien : on obtient `[5]`. Si on avait fait `dedup()` **avant** `sort()`, rien n'aurait été retiré (aucun doublon côte à côte) et on aurait obtenu `[2, 2]`.

Pour l'ordre **décroissant**, on trie puis on inverse : `sort()` puis `reverse()`.

**Paramètre `mut v: Vec<T>`.** Une fonction peut aussi recevoir la liste elle-même (elle en devient propriétaire), la modifier et la renvoyer :

```rust
fn ranger(mut prenoms: Vec<&str>) -> Vec<&str> {
    prenoms.sort();
    prenoms.reverse();
    prenoms
}

fn main() {
    println!("{:?}", ranger(vec!["Lina", "Hugo", "Zoé"]));
}
```

`sort()` sur des textes donne l'ordre alphabétique `["Hugo", "Lina", "Zoé"]`, puis `reverse()` donne `["Zoé", "Lina", "Hugo"]`. Attention, le tri compare les codes des lettres : les majuscules passent **avant** les minuscules (`"Zoé"` avant `"abricot"`).

**À retenir :** pour dédoublonner, `sort` **puis** `dedup` ; pour trier une tranche reçue en lecture, `to_vec()` d'abord ; décroissant = `sort` + `reverse` ; garder les premiers = `truncate`.

## 2. `HashMap<K, V>` : le dictionnaire

Chaque **clé** (type `K`) est associée à une **valeur** (type `V`). Une clé n'apparaît **qu'une seule fois** : insérer une clé qui existe déjà remplace sa valeur.

| Méthode | Effet | Ce qu'elle renvoie |
|---|---|---|
| `insert(k, v)` | range `v` sous la clé `k` (remplace l'ancienne valeur) | l'**ancienne** valeur : `None` si la clé était nouvelle, `Some(ancienne)` sinon |
| `get(&k)` | cherche la valeur de `k` | `Option<&V>` : `Some(&valeur)` ou `None` |
| `contains_key(&k)` | la clé existe ? | `bool` |
| `remove(&k)` | retire la clé et sa valeur | `Option<V>` : `Some(valeur retirée)` ou `None` si la clé n'existait pas |
| `len()` | nombre de clés | `usize` |

`get` renvoie une **référence** parce que la valeur reste rangée dans le dictionnaire : on la regarde sans la sortir. `remove`, lui, la sort vraiment : il la renvoie elle-même.

**Exemple résolu : on suit un dictionnaire pas à pas.**

```rust
use std::collections::HashMap;

fn main() {
    let mut stock: HashMap<String, u32> = HashMap::new();
    let r1 = stock.insert("pommes".to_string(), 10);
    let r2 = stock.insert("poires".to_string(), 4);
    let r3 = stock.insert("pommes".to_string(), 7);
    println!("{:?} {:?} {:?}", r1, r2, r3);
    println!("{:?} {:?}", stock.get("pommes"), stock.get("kiwis"));
    println!("{}", stock.contains_key("poires"));
    println!("{:?} {:?}", stock.remove("poires"), stock.remove("poires"));
    println!("{} clé(s)", stock.len());
}
```

| Ligne | Dictionnaire après | Valeur renvoyée |
|---|---|---|
| `insert("pommes", 10)` | `{pommes: 10}` | `None` : clé nouvelle |
| `insert("poires", 4)` | `{pommes: 10, poires: 4}` | `None` |
| `insert("pommes", 7)` | `{pommes: 7, poires: 4}` | `Some(10)` : l'ancienne valeur, remplacée |
| `get("pommes")` / `get("kiwis")` | inchangé | `Some(7)` / `None` |
| `contains_key("poires")` | inchangé | `true` |
| `remove("poires")` deux fois | `{pommes: 7}` | `Some(4)` la 1re fois, `None` la 2e (déjà retirée) |
| `len()` | | `1` |

Trois détails de ce code :

- `use std::collections::HashMap;` est **obligatoire** : `HashMap` n'est pas chargé automatiquement (contrairement à `Vec`).
- Les clés sont des `String` : `"pommes".to_string()` transforme le texte écrit `&str` en `String`.
- Pour **chercher**, on peut donner un simple `&str` : `stock.get("pommes")` marche même si les clés sont des `String`.

**À retenir :** `insert` renvoie l'ancienne valeur, `get` une `Option<&V>`, `remove` une `Option<V>`.

### Transformer une `Option` en ce qu'on veut

Les méthodes d'un dictionnaire renvoient souvent une `Option`. Quelques méthodes de `Option` évitent d'écrire un `match` à chaque fois :

| Méthode | Effet | Exemple |
|---|---|---|
| `is_some()` | `true` si c'est un `Some` | `Some(4).is_some()` → `true` |
| `is_none()` | `true` si c'est un `None` | `None::<u32>.is_none()` → `true` |
| `cloned()` | `Option<&T>` → `Option<T>` en copiant la valeur (marche avec `String`) | `Some(&"a".to_string())` → `Some("a".to_string())` |
| `copied()` | pareil, pour les types simples copiables (`u32`, `i32`, `char`...) | `Some(&7)` → `Some(7)` |
| `unwrap_or(d)` | la valeur si `Some`, sinon `d` | `None.unwrap_or(0)` → `0` |

**Exemple résolu : un carnet de capitales.**

```rust
use std::collections::HashMap;

fn main() {
    let mut capitales: HashMap<String, String> = HashMap::new();
    let nouveau = capitales.insert("Italie".to_string(), "Rome".to_string()).is_none();
    let encore = capitales.insert("Italie".to_string(), "Rome".to_string()).is_none();
    let trouvee: Option<String> = capitales.get("Italie").cloned();
    let absente: Option<String> = capitales.get("Pérou").cloned();
    let retiree = capitales.remove("Italie").is_some();
    println!("{nouveau} {encore} {:?} {:?} {retiree}", trouvee, absente);
}
```

1. Premier `insert` : la clé « Italie » est nouvelle, `insert` renvoie `None`, et `.is_none()` donne `true`.
2. Deuxième `insert` : la clé existe, `insert` renvoie `Some("Rome")`, `.is_none()` donne `false`.
3. `get("Italie")` renvoie un `Option<&String>` (une référence vers le texte rangé). `.cloned()` en fait un `Option<String>` (une copie à nous) : `Some("Rome")`.
4. `get("Pérou")` renvoie `None`, et `.cloned()` laisse `None`.
5. `remove("Italie")` renvoie `Some("Rome")`, `.is_some()` donne `true`.

Affichage : `true false Some("Rome") None true`.

**À retenir :** `insert(...).is_none()` = « la clé était nouvelle ? » ; `remove(...).is_some()` = « la clé existait ? » ; `get(...).cloned()` = une copie au lieu d'une référence.

### Découper un texte en mots

Pour travailler mot par mot sur un texte :

- `texte.split_whitespace()` découpe le texte aux espaces (un ou plusieurs, tabulations et retours à la ligne compris) et donne les mots un par un, sous forme de `&str`.
- `mot.to_lowercase()` renvoie une **nouvelle** `String` en minuscules (`"Rust"` → `"rust"`).

```rust
let phrase = "Un  Deux   TROIS";
let mut mots: Vec<String> = Vec::new();
for mot in phrase.split_whitespace() {
    mots.push(mot.to_lowercase());
}
println!("{:?}", mots);
```

Les espaces multiples ne créent pas de mots vides : on obtient `["un", "deux", "trois"]`.

**À retenir :** `split_whitespace()` pour les mots, `to_lowercase()` pour ne pas distinguer « Le » et « le ».

### Compter avec `entry`

Pour compter, il faut : « si la clé existe, ajouter 1 ; sinon, la créer à 1 ». `entry` fait les deux en une ligne :

```rust
use std::collections::HashMap;

fn main() {
    let mut compteur: HashMap<char, u32> = HashMap::new();
    for lettre in "banane".chars() {
        *compteur.entry(lettre).or_insert(0) += 1;
    }
    println!("{:?}", compteur.get(&'a'));
    println!("{:?}", compteur.get(&'n'));
    println!("{:?}", compteur.get(&'z'));
}
```

On lit `*compteur.entry(lettre).or_insert(0) += 1;` morceau par morceau :

1. `compteur.entry(lettre)` : « la case de cette lettre », qu'elle existe ou non.
2. `.or_insert(0)` : « si elle n'existe pas, crée-la avec 0 ». On reçoit un `&mut u32`, une référence modifiable vers le nombre rangé dans le dictionnaire.
3. `*... += 1` : l'étoile désigne le nombre lui-même, auquel on ajoute 1. Sans l'étoile, on essaierait d'ajouter 1 à une référence : erreur de compilation.

**Pas à pas sur `"banane"`** (`chars()` donne les lettres une par une) :

| Lettre lue | La case existait ? | Dictionnaire après |
|---|---|---|
| b | non → créée à 0, puis +1 | `{b: 1}` |
| a | non → créée à 0, puis +1 | `{b: 1, a: 1}` |
| n | non → créée à 0, puis +1 | `{b: 1, a: 1, n: 1}` |
| a | oui → +1 | `{b: 1, a: 2, n: 1}` |
| n | oui → +1 | `{b: 1, a: 2, n: 2}` |
| e | non → créée à 0, puis +1 | `{b: 1, a: 2, n: 2, e: 1}` |

Affichage : `Some(2)`, `Some(2)`, `None`. Pour lire un compte en renvoyant `0` quand la clé est absente, on écrit `match compteur.get(&'z') { Some(n) => *n, None => 0 }` (ou plus court : `compteur.get(&'z').copied().unwrap_or(0)`).

Erreur fréquente : `or_insert(1)` puis `+= 1` compterait 2 dès la première apparition.

**À retenir :** pour compter, `*map.entry(cle).or_insert(0) += 1;`, et l'étoile est obligatoire.

### Des listes comme valeurs : `or_default`

`entry(cle).or_default()` crée la case avec la **valeur par défaut** du type : `0` pour un nombre, `""` pour une `String`, une liste **vide** pour un `Vec`. C'est idéal pour **regrouper** : chaque clé reçoit une liste à laquelle on ajoute des éléments.

**Exemple résolu : ranger des nombres selon leur reste dans la division par 3.**

```rust
use std::collections::HashMap;

fn main() {
    let mut groupes: HashMap<i32, Vec<i32>> = HashMap::new();
    for n in [4, 9, 7, 3, 5] {
        groupes.entry(n % 3).or_default().push(n);
    }
    println!("reste 0 : {:?}", groupes.get(&0));
    println!("reste 1 : {:?}", groupes.get(&1));
    println!("reste 2 : {:?}", groupes.get(&2));
}
```

| Nombre | Reste `n % 3` | La liste existait ? | Groupes après |
|---|---|---|---|
| 4 | 1 | non → liste vide créée, puis `push(4)` | `1 → [4]` |
| 9 | 0 | non → créée, `push(9)` | `1 → [4]`, `0 → [9]` |
| 7 | 1 | oui → `push(7)` | `1 → [4, 7]`, `0 → [9]` |
| 3 | 0 | oui → `push(3)` | `1 → [4, 7]`, `0 → [9, 3]` |
| 5 | 2 | non → créée, `push(5)` | `1 → [4, 7]`, `0 → [9, 3]`, `2 → [5]` |

Dans chaque liste, les nombres gardent leur **ordre d'arrivée** (c'est un `Vec`). Ici le type complet `HashMap<i32, Vec<i32>>` est écrit sur la variable : avec `or_default`, Rust a besoin de savoir quel type de valeur créer.

**Première lettre d'un mot.** Pour regrouper des mots par initiale, il faut la première lettre : `mot.chars().next()` renvoie `Some(lettre)` (un `char`), ou `None` si le mot est vide. On l'utilise avec `if let` pour sauter les mots vides :

```rust
for mot in ["ours", "", "loup"] {
    if let Some(initiale) = mot.chars().next() {
        println!("{mot} commence par {initiale}");
    }
}
```

Le mot vide `""` donne `None` : le bloc est sauté, rien n'est affiché pour lui.

**À retenir :** pour regrouper, `map.entry(cle).or_default().push(element)` avec le type `HashMap<Cle, Vec<Element>>` écrit en entier.

### Parcourir un dictionnaire

```rust
use std::collections::HashMap;

fn main() {
    let mut ages: HashMap<&str, u32> = HashMap::new();
    ages.insert("Alice", 30);
    ages.insert("Bob", 25);
    for (nom, age) in &ages {
        println!("{nom} a {age} ans");
    }
}
```

`for (nom, age) in &ages` donne chaque couple (clé, valeur), en références.

> [!warning] L'ordre n'est pas garanti
> Une `HashMap` range ses éléments selon un calcul (le **hachage**) qui change d'une exécution à l'autre : ni l'ordre d'insertion, ni l'ordre alphabétique. Lance deux fois le programme ci-dessus : Alice et Bob peuvent changer de place. Si l'ordre compte, copie les clés dans un `Vec` et trie-le, ou utilise un `BTreeMap` (même méthodes, mais clés toujours rangées dans l'ordre croissant).

**Exemple résolu : afficher les clés dans l'ordre alphabétique.**

```rust
use std::collections::HashMap;

fn main() {
    let mut ages: HashMap<&str, u32> = HashMap::new();
    ages.insert("Zoé", 19);
    ages.insert("Alice", 30);
    ages.insert("Malo", 22);

    let mut noms = Vec::new();
    for nom in ages.keys() {
        noms.push(*nom);
    }
    noms.sort();
    for nom in noms {
        println!("{nom} : {}", ages[nom]);
    }
}
```

1. `ages.keys()` donne les clés, dans un ordre quelconque. On les copie dans une liste.
2. `noms.sort()` les range : `["Alice", "Malo", "Zoé"]`.
3. On parcourt la liste triée, et `ages[nom]` lit la valeur (ici on est sûr que la clé existe, sinon il faudrait `get`).

**À retenir :** jamais compter sur l'ordre d'une `HashMap` : trier les clés, ou prendre un `BTreeMap`.

## 3. `HashSet<T>` : l'ensemble sans doublons

Un `HashSet` est un sac de valeurs **sans doublons** et **sans ordre** : on sait seulement si une valeur est dedans ou pas.

| Méthode | Effet | Ce qu'elle renvoie |
|---|---|---|
| `insert(x)` | ajoute `x` s'il n'y est pas déjà | `true` si `x` est **nouveau**, `false` s'il était déjà là (rien ne change) |
| `contains(&x)` | `x` est dedans ? | `bool` |
| `remove(&x)` | retire `x` | `true` s'il y était |
| `len()` | nombre de valeurs **différentes** | `usize` |

```rust
use std::collections::HashSet;

fn main() {
    let mut vus = HashSet::new();
    println!("{}", vus.insert(3));
    println!("{}", vus.insert(3));
    println!("{}", vus.contains(&3));
    println!("{}", vus.len());
}
```

Affichage : `true` (3 est nouveau), `false` (déjà là : pas de doublon, pas de panique), `true`, `1`.

**Exemple résolu : le premier élément qui revient.** Puisque `insert` renvoie `false` pour une valeur déjà vue, il détecte un doublon en une ligne.

```rust
use std::collections::HashSet;

fn premier_repete(v: &[i32]) -> Option<i32> {
    let mut vus = HashSet::new();
    for x in v {
        if !vus.insert(*x) {
            return Some(*x);
        }
    }
    None
}

fn main() {
    println!("{:?}", premier_repete(&[4, 8, 1, 8, 4]));
    println!("{:?}", premier_repete(&[1, 2, 3]));
}
```

| Élément lu | `insert` renvoie | Ensemble après | Décision |
|---|---|---|---|
| 4 | `true` | `{4}` | on continue |
| 8 | `true` | `{4, 8}` | on continue |
| 1 | `true` | `{4, 8, 1}` | on continue |
| 8 | `false` | inchangé | déjà vu : on renvoie `Some(8)` |

Le 4 répété n'est jamais lu : on s'arrête au **premier** doublon rencontré. Avec `[1, 2, 3]`, la boucle va jusqu'au bout sans doublon : `None`. Le `!` devant `vus.insert(*x)` veut dire « non » : on entre dans le `if` quand `insert` renvoie `false`.

**Compter les valeurs différentes.** On met tout dans un `HashSet`, et `len()` donne le nombre de valeurs différentes : avec les lettres de `"ananas"`, l'ensemble vaut `{a, n, s}`, donc `len()` = 3.

**Exemple résolu : les valeurs de `a` absentes de `b`, sans doublon et triées.**

```rust
use std::collections::HashSet;

fn absentes(a: &[i32], b: &[i32]) -> Vec<i32> {
    let mut dans_b = HashSet::new();
    for x in b {
        dans_b.insert(*x);
    }
    let mut gardees = HashSet::new();
    for x in a {
        if !dans_b.contains(x) {
            gardees.insert(*x);
        }
    }
    let mut resultat = Vec::new();
    for x in gardees {
        resultat.push(x);
    }
    resultat.sort();
    resultat
}

fn main() {
    println!("{:?}", absentes(&[7, 2, 7, 5, 1], &[5, 6]));
}
```

1. On range `b = [5, 6]` dans un ensemble : `contains` y répond très vite, même pour une grande liste.
2. On passe `a` en revue : 7 (absent de `b`, gardé), 2 (gardé), 7 (gardé, mais déjà dans `gardees` : l'ensemble évite le doublon), 5 (présent dans `b`, ignoré), 1 (gardé). `gardees` = `{7, 2, 1}`.
3. Un `HashSet` n'a pas d'ordre : on le vide dans un `Vec` et on trie. Résultat : `[1, 2, 7]`.

Sans le tri final, le résultat sortirait dans un ordre qui change d'une exécution à l'autre.

**À retenir :** `insert` qui renvoie `false` = doublon ; `len()` = nombre de valeurs différentes ; un résultat tiré d'un `HashSet` se trie avant d'être renvoyé.

## À retenir

- `vec![v; n]` répète `v` `n` fois, `vec![a, b]` liste les valeurs.
- `Vec<T>` : `push`, `pop` (`Option`), `len`, `sort`, `dedup` (après `sort`), `reverse`, `truncate`, `contains`, `to_vec`.
- `v[i]` panique si l'indice n'existe pas, `v.get(i)`, `first()`, `last()` renvoient une `Option<&T>` : `match` ou `if let`, et `*` pour la valeur.
- `for x in &v` lit, `for x in &mut v` modifie (avec `*x`), `for x in v` consomme.
- Paramètres : `&[T]` pour lire, `&mut [T]` pour modifier, `&mut Vec<T>` pour ajouter, `mut v: Vec<T>` pour posséder.
- `HashMap<K, V>` (à importer) : `insert` (renvoie l'ancienne valeur), `get` (`Option<&V>`), `remove` (`Option<V>`), `contains_key`, `entry(k).or_insert(0)` pour compter, `entry(k).or_default().push(x)` pour regrouper.
- `HashSet<T>` (à importer) : pas de doublons, `insert` renvoie `false` si l'élément existait déjà, `len` = valeurs différentes.
- L'ordre d'une `HashMap` ou d'un `HashSet` n'est **jamais** garanti : trier, ou `BTreeMap`.
