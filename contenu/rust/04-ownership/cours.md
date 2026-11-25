# Ownership (la propriété)

> [!info] Le chapitre le plus important
> L'ownership est le cœur de Rust. C'est ce qui évite les bugs de mémoire **sans ramasse-miettes** (un programme qui nettoie la mémoire en arrière-plan, comme en Java ou en Python). Une fois compris, tout le reste devient plus facile.

## 1. Binding et portée

```rust
let x = 42;        // x est un binding : le nom x est lié à la valeur 42
let mut y = 42;    // y peut changer de valeur
y += 1;
println!("{x} {y}");
```

Un **binding** lie un **nom** à une **valeur**. Ce lien peut être **transféré** (*move*), **prêté** (*borrow*) ou **rompu** (*drop*).

Sans `mut`, le binding ne peut pas changer de valeur : écrire `x = 43;` donne l'erreur **E0384** (*cannot assign twice to immutable variable*), et le compilateur propose d'ajouter `mut`.

La **portée** (*scope*) d'une variable, c'est la zone où elle existe : la fonction, le bloc `{ }`, la boucle ou le bras de `match` où elle a été créée. Elle commence à la ligne du `let` et s'arrête à l'accolade `}` qui ferme ce bloc.

```rust
fn main() {
    {
        let y = 20;
        println!("{y}");   // ok
    }
    // println!("{y}");   // error[E0425]: cannot find value `y` in this scope
    for z in 1..5 {
        println!("{z}");
    }
    // z n'existe plus ici
}
```

**Exemple résolu : des frais de port qui disparaissent.** On veut 8 € de frais pour un colis de plus de 5 kg, 3 € sinon. Ce code ne compile pas :

```text
let poids = 7;
if poids > 5 {
    let frais = 8;     // ce frais vit seulement dans ce bloc
} else {
    let frais = 3;     // celui-ci aussi, dans l'autre bloc
}
println!("{frais}");   // error[E0425]: cannot find value `frais` in this scope
```

1. Le premier `let frais` est créé dans le bloc `{ }` du `if` : il disparaît à son `}`.
2. Le second est créé dans le bloc du `else` : il disparaît aussi à son `}`.
3. Au `println!`, on est sorti des deux blocs : aucun `frais` n'existe à cet endroit. Le compilateur le dit (*the binding `frais` is available in a different scope*).

La correction : créer `frais` **dans** la portée où on l'utilise. En Rust, un `if` est une **expression** : il produit une valeur (la dernière ligne de chaque bloc, **sans** `;`), qu'on range directement dans la variable.

```rust
let poids = 7;
let frais = if poids > 5 { 8 } else { 3 };
println!("frais : {frais} €");   // frais : 8 €
```

Ici `poids > 5` est vrai, le `if` vaut donc 8, et `frais` existe jusqu'à la fin de `main`. Les deux branches doivent donner le **même type** (ici deux entiers).

**À retenir :** une variable n'existe que dans le bloc `{ }` où se trouve son `let`. Pour la garder après un `if`, crée-la avant, ou écris `let x = if … { a } else { b };`.

## 2. Drop et RAII

À la fin de sa portée, une valeur est **détruite** (*drop*) : sa mémoire est rendue automatiquement. Les variables d'un même bloc sont détruites dans l'**ordre inverse** de leur création.

```rust
let _a = String::from("A");
let _b = String::from("B");
let _c = String::from("C");
// à la fin du bloc : drop C, puis drop B, puis drop A
```

Pourquoi à l'envers ? Une variable peut dépendre d'une variable créée **avant** elle, jamais après : on détruit donc d'abord les plus récentes.

On peut observer la destruction en écrivant `impl Drop for MonType { fn drop(&mut self) { ... } }` : la fonction `drop` est appelée automatiquement juste avant que la valeur disparaisse. On ne l'appelle jamais soi-même.

> [!tip] RAII
> *Resource Acquisition Is Initialization* : la vie d'une ressource (mémoire, fichier, connexion) est la vie de la valeur. Rien à écrire pour libérer (`free`, `close`...), et la libération arrive à un **moment prévisible**.

```rust
let gros = vec![0u8; 10_000_000];
println!("{} octets", gros.len());
drop(gros);           // libéré tout de suite, sans attendre la fin du bloc
```

`drop(valeur)` est une fonction toute simple : elle **prend** la valeur (elle en devient propriétaire), ne fait rien, et la valeur est détruite à la fin de `drop`. Après `drop(gros)`, la variable `gros` n'est plus utilisable.

> [!warning] `_x` contre `_`
> `let _x = valeur;` garde la valeur jusqu'à la fin du bloc. `let _ = valeur;` la **détruit immédiatement** : `_` n'est pas un nom, c'est un motif qui jette la valeur.

**Exemple résolu : dans quel ordre s'affichent les messages ?** Le type `Bavard` affiche un message à sa création et à sa destruction.

```rust
struct Bavard {
    nom: &'static str,
}

impl Bavard {
    fn new(nom: &'static str) -> Bavard {
        println!("création de {nom}");
        Bavard { nom }
    }
}

impl Drop for Bavard {
    fn drop(&mut self) {
        println!("drop {}", self.nom);
    }
}

fn main() {
    let x = Bavard::new("X");
    {
        let _y = Bavard::new("Y");
        println!("fin du bloc");
    }
    let _ = Bavard::new("W");
    let _z = Bavard::new("Z");
    drop(x);
    println!("fin du main");
}
```

On suit le programme ligne par ligne :

| Ligne | Ce qui se passe | Affichage |
|---|---|---|
| `let x = …("X")` | X est créé, il vivra jusqu'à la fin de `main` | `création de X` |
| `let _y = …("Y")` | Y est créé **dans le bloc** | `création de Y` |
| `println!` | | `fin du bloc` |
| `}` | fin du bloc : Y est détruit | `drop Y` |
| `let _ = …("W")` | W est créé puis **jeté aussitôt** par `_` | `création de W` puis `drop W` |
| `let _z = …("Z")` | Z est créé, `_z` le garde | `création de Z` |
| `drop(x)` | X est détruit tout de suite | `drop X` |
| `println!` | | `fin du main` |
| `}` de `main` | il ne reste que Z | `drop Z` |

S'il restait plusieurs variables à la fin de `main`, elles seraient détruites de la plus récente à la plus ancienne.

**À retenir :** pour savoir quand une valeur meurt, cherche le premier de ces trois événements : l'accolade `}` de son bloc, un `drop(valeur)`, ou un `let _ =` qui la jette sur-le-champ.

## 3. Le masquage (shadowing)

```rust
let x = 42;
{
    let x = 51;
    println!("{x}");    // 51
}
println!("{x}");        // 42 : l'ancien x revient
let x = 66;             // nouveau binding qui masque l'ancien
println!("{x}");        // 66
```

Un deuxième `let x` n'est **pas** une modification : c'est une **nouvelle** variable qui cache l'ancienne. Elle peut même avoir un **autre type** :

```rust
let saisie = "42";                          // &str
let saisie: u32 = saisie.parse().unwrap();  // u32
println!("{}", saisie + 1);                 // 43
```

Les outils qu'on combine souvent avec le masquage :

- `.trim()` renvoie le texte **sans les espaces** du début et de la fin : `"  7 ".trim()` donne `"7"`.
- `.parse()` essaie de transformer un texte en nombre. Il faut lui dire **quel** type de nombre : c'est le rôle de l'annotation `: u32` sur la variable.
- `.unwrap()` récupère le nombre, ou fait planter le programme si le texte n'est pas un nombre (`"abc"`).

**Exemple résolu : nettoyer puis convertir une quantité tapée au clavier.**

```rust
let quantite = "  12 ";                      // 1. &str avec des espaces
let quantite = quantite.trim();              // 2. &str : "12"
let quantite: u32 = quantite.parse().unwrap(); // 3. u32 : 12
println!("{}", quantite * 3);                // 36
```

1. Le premier `quantite` est un `&str` qui contient `"  12 "`.
2. Le deuxième `let` crée un **nouveau** `quantite`, toujours un `&str`, sans les espaces.
3. Le troisième `let` crée encore un nouveau `quantite`, cette fois de type `u32`. On peut faire des calculs avec.

Pourquoi pas `quantite = quantite.parse().unwrap();` (sans `let`) ? Sans `let`, c'est une **affectation** : on essaie de changer la valeur de l'ancienne variable. Elle n'est pas `mut` (erreur E0384) et, surtout, elle reste de type `&str` : on ne peut pas y ranger un `u32`. Seul un nouveau `let` peut changer le type.

**À retenir :** pour changer le **type** d'une variable en gardant son nom, réécris `let nom: NouveauType = …;`. Sans `let`, c'est la même variable, avec le même type.

## 4. Les trois règles de l'ownership

1. Une valeur n'a qu'**un seul propriétaire** à la fois.
2. On peut l'emprunter en lecture (`&`) **autant de fois** qu'on veut...
3. ... **ou** l'emprunter en écriture (`&mut`) **une seule fois**, jamais en même temps qu'une lecture.

| Règle | Bug évité |
|---|---|
| un seul propriétaire | libérer deux fois la même mémoire, ou l'oublier |
| le propriétaire libère en disparaissant | fichier jamais fermé, fuite de mémoire |
| plusieurs lecteurs **ou** un seul écrivain | données modifiées pendant qu'on les lit |

C'est vérifié **à la compilation** : ça ne coûte rien pendant l'exécution.

**Exemple résolu : qui a le droit de faire quoi ?**

```rust
let mut liste = vec![1, 2, 3];
let a = &liste;
let b = &liste;
println!("{a:?} {b:?}");
let c = &mut liste;
c.push(4);
println!("{liste:?}");
```

| Ligne | Emprunts vivants à ce moment | Règle respectée ? |
|---|---|---|
| `let a = &liste;` | `a` (lecture) | oui : un lecteur |
| `let b = &liste;` | `a`, `b` (lecture) | oui : plusieurs lecteurs, aucun écrivain |
| `println!` | `a` et `b` servent pour la **dernière** fois | oui |
| `let c = &mut liste;` | `c` seul (`a` et `b` ne servent plus) | oui : un seul écrivain |
| `c.push(4);` | `c` sert pour la dernière fois | oui |
| `println!("{liste:?}")` | plus aucun emprunt : le propriétaire lit | oui, affiche `[1, 2, 3, 4]` |

Si on avait écrit `println!("{a:?}")` **après** `c.push(4)`, le lecteur `a` serait encore vivant pendant l'écriture : refusé (E0502).

**À retenir :** à chaque ligne, liste les emprunts encore utilisés plus loin : soit que des `&`, soit un seul `&mut`, jamais un mélange.

## 5. Le déplacement (move)

```rust
fn changer(mut s: String) {
    s.push('!');
}

fn main() {
    let s = String::from("Coco");
    changer(s);           // la String est DÉPLACÉE dans la fonction
    // println!("{s}");   // error[E0382]: borrow of moved value: `s`
}
```

Passer une `String` à une fonction la **déplace** : la fonction en devient propriétaire, et la détruit à sa fin. Utiliser `s` ensuite reviendrait à lire de la mémoire libérée : Rust refuse. Le compilateur explique chaque étape :

```text
error[E0382]: borrow of moved value: `s`
  |
6 |     let s = String::from("Coco");
  |         - move occurs because `s` has type `String`, which does not implement the `Copy` trait
7 |     changer(s);
  |             - value moved here
8 |     println!("{s}");
  |                ^ value borrowed here after move
```

On lit le message de haut en bas : **où** la valeur est née, **où** elle est partie (*value moved here*), **où** on l'utilise trop tard. Le `mut` de `mut s: String` concerne seulement la variable `s` **à l'intérieur** de la fonction, qui a le droit de modifier sa propre `String`.

Deux corrections. La première : la fonction **rend** la valeur.

```rust
fn changer(mut s: String) -> String {
    s.push('!');
    s
}

fn main() {
    let s = String::from("Coco");
    let s = changer(s);
    println!("{s}");   // Coco!
}
```

1. `changer(s)` : la `String` part dans la fonction (move).
2. La fonction la modifie, puis la **renvoie** (dernière ligne `s`, sans `;`).
3. `let s = changer(s);` : on récupère la propriété dans un nouveau `s` (masquage). Sans ce `let s =`, la `String` renvoyée serait jetée.

La deuxième (la plus courante) : la fonction **emprunte** en écriture.

```rust
fn changer(s: &mut String) {
    s.push('!');
}

fn main() {
    let mut s = String::from("Coco");
    changer(&mut s);
    println!("{s}");   // Coco!
}
```

Il faut écrire `mut` à **trois** endroits, et chacun a son rôle :

| Où | Pourquoi |
|---|---|
| `let mut s` | le propriétaire accepte que sa valeur change |
| `changer(&mut s)` | l'appel prête la valeur en écriture |
| `s: &mut String` | la fonction annonce qu'elle reçoit un emprunt en écriture |

Dans la fonction, `s.push('!')` marche directement sur la référence : Rust va chercher la `String` derrière `s` tout seul. La fonction ne renvoie rien : c'est la `String` de l'appelant qui a changé.

> [!tip] Lequel choisir ?
> La fonction modifie la valeur et rend la main : `&mut`. Elle a juste besoin de lire : `&`. Elle « consomme » la valeur pour en produire une autre : par valeur.

> [!info] Retirer et ajouter un caractère
> `s.pop()` retire le **dernier caractère** d'une `String` et le renvoie dans un `Option` : `Some(c)` s'il y en avait un, `None` si le texte était vide. `.is_some()` répond `true` dans le premier cas. `s.push(c)` ajoute le caractère `c` à la fin.

**À retenir :** E0382 = tu as donné la valeur. Corrige en la faisant **rendre** (`let s = f(s);`) ou, le plus souvent, en la **prêtant** (`f(&mut s)` avec `let mut s` et un paramètre `&mut T`).

```anim
ownership
scenario: move
```

## 6. Copy et Clone

```rust
let a = 5;
let b = a;
println!("{a} {b}");   // ok : les entiers sont Copy
```

- Les types **`Copy`** sont copiés automatiquement, l'original reste utilisable : entiers, flottants, `bool`, `char`, et les tuples ou tableaux de ces types.
- Un type ne peut être `Copy` que s'il n'a **rien à libérer**. `String`, `Vec<T>`, `Box<T>` ne le sont pas.
- On rend son propre type `Copy` avec `#[derive(Clone, Copy)]`.
- **`.clone()`** fait une vraie copie (y compris ce qui est sur le tas). C'est explicite, et ça coûte.

**Exemple résolu : que devient l'original après `let b = a;` ?**

| Type de `a` | `Copy` ? | Après `let b = a;` |
|---|---|---|
| `i32`, `f64`, `bool`, `char` | oui | `a` et `b` sont deux copies, les deux utilisables |
| `(i32, char)`, `[u8; 4]` | oui (tout ce qu'ils contiennent est `Copy`) | les deux utilisables |
| `String`, `Vec<i32>` | non (de la mémoire sur le tas à libérer) | `a` est **déplacé** : seul `b` reste |
| une struct sans `derive` | non | `a` est déplacé |
| une struct `#[derive(Clone, Copy)]` dont tous les champs sont `Copy` | oui | les deux utilisables |

Pour une `String`, si on a vraiment besoin de deux exemplaires, on écrit `let b = a.clone();` : `a` garde sa valeur et `b` reçoit une copie neuve.

Pour sa propre struct, on demande les deux capacités ensemble. `Copy` exige `Clone` : écrire `Copy` seul est refusé.

```rust
#[derive(Debug, Clone, Copy)]
struct Taille {
    largeur: u32,
    hauteur: u32,
}

fn main() {
    let t1 = Taille { largeur: 3, hauteur: 2 };
    let t2 = t1;                       // copie, pas move
    println!("{t1:?} {t2:?}");        // les deux marchent

    let nom1 = String::from("Ferris");
    let nom2 = nom1.clone();           // vraie copie de la String
    println!("{nom1} {nom2}");
}
```

`Debug` sert seulement à pouvoir afficher la struct avec `{:?}`. Sans `Copy`, la ligne `let t2 = t1;` déplacerait `t1`, et le premier `println!` serait refusé (E0382).

```anim
ownership
scenario: clone
titre: Copy, clone ou move ?
```

> [!warning] Le `.clone()` réflexe
> Ajouter `.clone()` juste pour faire taire le compilateur est un signal d'alarme : demande-toi plutôt **qui doit posséder quoi**, et si un emprunt ne suffit pas.

**À retenir :** petit type sans tas → `#[derive(Clone, Copy)]` et il se copie tout seul ; type qui possède du tas (`String`, `Vec`) → `.clone()` quand il faut vraiment deux exemplaires.

## 7. Les emprunts

```rust
let s = String::from("Hey");
let r1 = &s;
let r2 = &s;
println!("{r1} {r2}");           // deux lecteurs : ok

let mut s = String::from("Hello");
let r = &mut s;
r.push_str(" World");           // un seul écrivain : ok
println!("{s}");
```

- `&x` : référence en **lecture**. `&mut x` : référence en **écriture** (il faut `let mut x`).
- `*r` : lit (ou modifie) la valeur derrière la référence.
- Une fonction qui veut seulement lire prend une référence : `&str` plutôt que `String`, `&[i32]` plutôt que `Vec<i32>`.

```rust
let mut n = 10;
let r = &mut n;
*r += 5;            // modifie n à travers la référence
println!("{n}");    // 15
```

### Emprunter une tranche `&[T]`

Une **tranche** (*slice*) `&[i32]` est un emprunt en lecture d'une suite d'entiers rangés les uns après les autres. C'est à `Vec<i32>` ce que `&str` est à `String`. Une fonction qui prend `&[i32]` accepte :

- un `Vec` emprunté : `&v` (Rust convertit `&Vec<i32>` en `&[i32]` tout seul) ;
- un tableau : `&[4, 8, 15]` ;
- un morceau de liste : `&v[1..3]` (les cases 1 et 2).

**Exemple résolu : trouver le plus grand nombre sans prendre la liste.**

```rust
fn plus_grand(nombres: &[i32]) -> i32 {
    let mut max = nombres[0];
    for n in nombres {
        if *n > max {
            max = *n;
        }
    }
    max
}

fn main() {
    let notes = vec![12, 18, 9];
    println!("{}", plus_grand(&notes));        // 18
    println!("{}", plus_grand(&[4, 8, 15]));   // 15
    println!("{}", plus_grand(&notes[2..]));   // 9
    println!("{} notes", notes.len());         // notes est toujours là
}
```

1. Le paramètre est `&[i32]` : la fonction **lit** la liste, elle ne la possède pas.
2. `for n in nombres` parcourt la tranche : chaque `n` est une **référence** `&i32` vers une case. On écrit `*n` pour lire le nombre lui-même (pour `+` et `+=`, Rust accepte aussi `&i32` directement).
3. À l'appel, `&notes` prête la liste. Après les appels, `notes` appartient toujours à `main` : on peut encore écrire `notes.len()`.
4. Si le paramètre était `Vec<i32>`, le premier appel aurait **déplacé** `notes`, et toute utilisation suivante aurait donné E0382.

Pour une moyenne, il faut diviser des nombres à virgule : `nombres.len()` est un `usize`, on le convertit avec `nombres.len() as f64`, et un `i32` avec `f64::from(total)`.

**À retenir :** pour lire une liste, prends `&[T]` et appelle avec `&ma_liste` : la liste reste à l'appelant.

### Un emprunt meurt à sa dernière utilisation

```rust
let mut v = vec![1, 2, 3];
let premier = &v[0];
println!("{premier}");   // dernière utilisation de premier
v.push(4);               // ok : plus aucun lecteur
```

Depuis 2018, l'emprunt ne dure pas jusqu'à la fin du bloc, mais jusqu'à sa **dernière utilisation** (*non-lexical lifetimes*). Beaucoup de vieux tutoriels sont faux sur ce point.

**Exemple résolu : deux écrivains qui se chevauchent.**

```text
let mut v = vec![1, 2];
let r1 = &mut v;
let r2 = &mut v;   // error[E0499]: cannot borrow `v` as mutable more than once at a time
r1.push(3);        // first borrow later used here
r2.push(4);
```

1. `r1` naît à la ligne 2 et sert pour la dernière fois à la ligne 4 (`r1.push(3)`).
2. `r2` naît à la ligne 3, donc **pendant** la vie de `r1` : deux `&mut` vivants en même temps, refusé.
3. Le message le dit : *first borrow later used here* pointe la ligne qui garde `r1` en vie trop longtemps.

Il suffit de déplacer la ligne qui utilise `r1` **avant** la création de `r2` :

```rust
let mut v = vec![1, 2];
let r1 = &mut v;
r1.push(3);        // dernière utilisation de r1 : il meurt ici
let r2 = &mut v;   // ok : r1 n'existe plus
r2.push(4);
println!("{v:?}"); // [1, 2, 3, 4]
```

Aucune ligne ajoutée ni supprimée : les deux emprunts se **suivent** au lieu de se chevaucher.

**À retenir :** pour corriger E0499 ou E0502, regarde où chaque emprunt sert pour la dernière fois, et réordonne pour qu'ils ne se chevauchent plus.

```anim
ownership
scenario: emprunts
titre: Plusieurs lecteurs ou un seul écrivain
```

### Modifier ce qu'on parcourt

```text
for x in &v {
    if *x == 2 {
        v.push(4);   // error[E0502]
    }
}
```

`push` peut agrandir la liste et la **déplacer** en mémoire : la boucle lirait une zone libérée. En C++ c'est un bug silencieux, en Java une erreur à l'exécution, en Rust une **erreur de compilation**.

Même problème, plus discret : garder une référence vers une case pendant qu'on écrit dans la liste.

```text
let dernier = &v[v.len() - 1];   // lecteur
v.push(*dernier);                // écrivain
println!("{dernier}");           // le lecteur sert encore après le push : E0502
```

Deux méthodes pour s'en sortir :

1. **Copier la valeur** avant d'écrire. Un `i32` est `Copy` : `let dernier = v[v.len() - 1];` (sans `&`) donne un nombre à nous, plus aucun lien avec la liste.
2. **Parcourir par position** au lieu de parcourir par référence : on note la longueur **avant** la boucle, puis on lit chaque case par son indice, en copiant sa valeur.

**Exemple résolu : recopier à la fin les nombres pairs d'une liste.**

```rust
fn recopier_les_pairs(v: &mut Vec<i32>) {
    let n = v.len();
    for i in 0..n {
        let x = v[i];
        if x % 2 == 0 {
            v.push(x);
        }
    }
}

fn main() {
    let mut liste = vec![1, 2, 3, 4];
    recopier_les_pairs(&mut liste);
    println!("{liste:?}");   // [1, 2, 3, 4, 2, 4]
}
```

| Tour | `i` | `x = v[i]` | Pair ? | Liste après le tour |
|---|---|---|---|---|
| 1 | 0 | 1 | non | `[1, 2, 3, 4]` |
| 2 | 1 | 2 | oui | `[1, 2, 3, 4, 2]` |
| 3 | 2 | 3 | non | `[1, 2, 3, 4, 2]` |
| 4 | 3 | 4 | oui | `[1, 2, 3, 4, 2, 4]` |

- `n` vaut 4 **avant** la boucle : on ne parcourt que les cases de départ, même si la liste grandit (sinon on relirait les nombres ajoutés, sans fin).
- `let x = v[i];` **copie** le nombre : quand `push` s'exécute, aucune référence vers la liste n'est vivante.

**À retenir :** pour écrire dans une liste pendant qu'on la lit, copie d'abord la valeur (`let x = v[i];`) et parcours des positions fixées à l'avance (`for i in 0..n`).

## 8. Les erreurs à connaître

| Code | Message | Traduction |
|---|---|---|
| E0382 | borrow of moved value | tu as donné la valeur, puis tu l'utilises encore |
| E0499 | cannot borrow as mutable more than once | deux `&mut` vivants en même temps |
| E0502 | cannot borrow as mutable because it is also borrowed as immutable | tu écris pendant que quelqu'un lit |
| E0384 | cannot assign twice to immutable variable | il manque `mut` |
| E0425 | cannot find value in this scope | la variable n'existe pas (ou plus) à cet endroit : regarde sa portée |
| E0106 | missing lifetime specifier | Rust ne sait pas combien de temps la référence renvoyée doit vivre |

**Exemple résolu : quelle erreur donne ce code ?**

```text
let mut nombres = vec![5, 6];
let lecteur = &nombres;
nombres.push(7);
println!("{lecteur:?}");
```

1. `lecteur` est un emprunt en **lecture**, utilisé pour la dernière fois au `println!`, donc encore vivant à la ligne 3.
2. `nombres.push(7)` demande un emprunt en **écriture** (`push` prend `&mut self`).
3. Une écriture pendant une lecture : c'est **E0502**. Pas E0499 (il n'y a qu'un seul écrivain) ni E0382 (rien n'a été déplacé).
4. Correction : faire le `println!` avant le `push`.

**À retenir :** donné puis réutilisé → E0382 ; deux écrivains → E0499 ; un écrivain pendant un lecteur → E0502 ; `mut` oublié → E0384 ; hors de portée → E0425.

## 9. `String` ou `Vec<char>` ?

| | `String` | `Vec<char>` |
|---|---|---|
| un `a` | 1 octet | 4 octets |
| un `🦀` | 4 octets | 4 octets |
| n-ième caractère | lent (il faut tout lire depuis le début) | immédiat |

- `String` pour **stocker, transmettre, écrire** du texte.
- `Vec<char>` pour **manipuler** les caractères un par un par leur position.

**Exemple résolu : le mot `été`.**

```rust
let mot = String::from("été");
let lettres: Vec<char> = mot.chars().collect();
println!("{} octets", mot.len());             // 5 octets
println!("{} caractères", lettres.len());     // 3 caractères
println!("2e lettre : {}", lettres[1]);       // t
```

1. Dans une `String`, `é` prend 2 octets et `t` 1 octet : 2 + 1 + 2 = **5** octets. `.len()` compte des octets, pas des lettres.
2. `.chars().collect()` range chaque caractère dans une case de 4 octets : 3 cases.
3. Dans le `Vec<char>`, `lettres[1]` donne directement la 2e lettre. Dans la `String`, il faudrait lire depuis le début pour savoir où elle commence.

**À retenir :** `String` pour garder du texte, `Vec<char>` quand tu as besoin de la n-ième lettre.

## À retenir

- Une variable n'existe que dans son bloc `{ }` ; `let x = if … { a } else { b };` la crée au bon endroit.
- Fin de portée = `drop` automatique, dans l'ordre **inverse**. C'est le RAII. `drop(x)` détruit tout de suite, `let _ =` aussi.
- Un deuxième `let x` = **masquage** (nouvelle variable, type possiblement différent).
- **Un** propriétaire ; `&` autant qu'on veut **ou** un seul `&mut`.
- Passer une valeur = **move** (sauf types `Copy`). `.clone()` copie vraiment. `#[derive(Clone, Copy)]` pour un petit type sans tas.
- Pour lire : prendre une référence (`&str`, `&[T]`, `&T`). Pour modifier sans prendre : `&mut T`.
- Un emprunt s'arrête à sa **dernière utilisation** : réordonner suffit souvent.
- E0382 (move), E0499 (deux `&mut`), E0502 (lecture + écriture).
