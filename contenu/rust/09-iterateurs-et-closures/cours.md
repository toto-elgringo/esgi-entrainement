# Itérateurs et closures

## 1. Les closures : des fonctions sans nom

Une **closure** est une petite fonction écrite directement là où on en a besoin, souvent sur une seule ligne. On la range dans une variable ou on la donne à une autre fonction.

La forme : `|paramètres| résultat`. Les paramètres vont entre deux barres verticales `| |`, puis vient l'expression calculée (pas de `return`, pas de `->` obligatoire).

```rust
let double = |x| x * 2;
let addition = |a: i32, b: i32| a + b;
let saluer = || println!("Salut !");
let carre_du_suivant = |x: i32| {
    let y = x + 1;
    y * y
};

println!("{}", double(21));
println!("{}", addition(2, 3));
saluer();
println!("{}", carre_du_suivant(4));
```

| Forme | Sens |
|---|---|
| `\|x\| x * 2` | un paramètre, renvoie son double |
| `\|a: i32, b: i32\| a + b` | deux paramètres (les types sont facultatifs : Rust les devine à l'usage) |
| `\|\| println!(...)` | aucun paramètre |
| `\|x: i32\| { ... }` | plusieurs lignes : un bloc `{ }`, la dernière expression (sans `;`) est le résultat |

| Fonction classique | Closure équivalente |
|---|---|
| `fn double(x: i32) -> i32 { x * 2 }` | `\|x\| x * 2` |

**Exemple résolu : que vaut `(|x| x + 10)(5)` ?**

1. `|x| x + 10` est une closure : elle prend `x` et renvoie `x + 10`.
2. Les parenthèses autour la « mettent en paquet », et `(5)` juste après l'**appelle** tout de suite avec `x = 5`.
3. Résultat : `5 + 10 = 15`.

Le programme ci-dessus affiche, lui, `42`, `5`, `Salut !` puis `25` (`carre_du_suivant(4)` : `y = 5`, puis `5 * 5`).

**À retenir :** `|x| expression` est une fonction sans nom ; on l'appelle comme une fonction : `f(valeur)`.

### Recevoir une closure en paramètre

Une fonction peut recevoir une closure, et l'appeler autant de fois qu'elle veut :

```rust
fn appliquer_deux_fois(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(f(x))
}

fn main() {
    println!("{}", appliquer_deux_fois(|n| n + 3, 10));
    println!("{}", appliquer_deux_fois(|n| n * n, 3));
}
```

`impl Fn(i32) -> i32` veut dire « n'importe quelle closure qui prend un `i32` et renvoie un `i32` ». De la même façon, `impl Fn(i32) -> bool` accepte toute closure qui prend un `i32` et répond `true` ou `false` : c'est une **condition**. Les traits et `impl` sont détaillés au chapitre suivant.

1. `appliquer_deux_fois(|n| n + 3, 10)` : `f(10)` = 13, puis `f(13)` = 16. Affiche `16`.
2. `appliquer_deux_fois(|n| n * n, 3)` : `f(3)` = 9, puis `f(9)` = 81. Affiche `81`.

**Exemple résolu : une fonction qui garde les éléments qui vérifient une condition.**

```rust
fn garder_si(v: &[i32], condition: impl Fn(i32) -> bool) -> Vec<i32> {
    let mut gardes = Vec::new();
    for &x in v {
        if condition(x) {
            gardes.push(x);
        }
    }
    gardes
}

fn main() {
    let v = [6, -3, 0, 15, 8];
    println!("{:?}", garder_si(&v, |x| x < 0));
    println!("{:?}", garder_si(&v, |x| x % 3 == 0));
    println!("{:?}", garder_si(&v, |x| x != 0));
}
```

- `for &x in v` : `v` est une tranche `&[i32]`, la boucle donne des `&i32`. Le motif `&x` « enlève » la référence : `x` est directement un `i32`, qu'on peut donner à `condition`.
- Avec `|x| x < 0` : on teste 6 (non), -3 (oui), 0 (non : 0 n'est pas strictement négatif), 15 (non), 8 (non) → `[-3]`.
- Avec `|x| x % 3 == 0` (le reste de la division par 3 vaut 0, donc multiple de 3) : 6 oui, -3 oui, 0 oui (0 est multiple de tout), 15 oui, 8 non → `[6, -3, 0, 15]`.
- Avec `|x| x != 0` : tout sauf le 0 → `[6, -3, 15, 8]`.

Pour « pair », on écrit `x % 2 == 0` ; pour « strictement plus grand que 0 », `x > 0` (avec `>=`, le 0 serait compté).

**À retenir :** la fonction contient la boucle, la closure contient seulement la **condition** : `|x| test sur x`.

### La capture : utiliser les variables autour

Contrairement à une fonction `fn`, une closure peut **utiliser les variables** de l'endroit où elle est écrite. On dit qu'elle les **capture**. Une `fn` ne voit que ses paramètres.

```rust
let minimum = 10;
let assez_grand = |x| x >= minimum;
println!("{} {}", assez_grand(15), assez_grand(4));
```

`minimum` n'est pas un paramètre de la closure : elle va le chercher autour d'elle. Affichage : `true false`.

Une closure capture de la façon la plus légère possible, selon ce qu'elle fait de la variable :

| Ce que fait la closure | Capture | Nom du trait | Ce qu'il faut écrire |
|---|---|---|---|
| lit la variable | par référence `&` | `Fn` | rien de spécial |
| modifie la variable | par référence modifiable `&mut` | `FnMut` | la variable **et** la closure en `mut` |
| prend la variable (avec `move`, ou en la consommant) | par valeur (déplacement) | `FnOnce` (ou `Fn` si elle la garde seulement) | `move` devant |

**Exemple résolu : une closure qui modifie une variable.**

```rust
let mut total = 0;
let mut ajouter = |n: i32| total += n;
ajouter(5);
ajouter(7);
println!("{total}");
```

1. La closure **modifie** `total` : elle le capture en `&mut`. Il faut donc `let mut total` (sinon : « cannot assign to `total`, as it is not declared as mutable »).
2. Appeler la closure change ce qu'elle a capturé : la closure elle-même doit être `let mut ajouter` (sinon : « cannot borrow `ajouter` as mutable »).
3. `ajouter(5)` : total vaut 5. `ajouter(7)` : total vaut 12.
4. Après le dernier appel, la closure n'est plus utilisée : son emprunt se termine, et on peut relire `total`. Affichage : `12`.

**À retenir :** une closure qui modifie une variable capturée → `mut` sur la variable **et** sur la closure.

### `move` : prendre possession

`move |x| ...` force la closure à **prendre possession** des variables qu'elle utilise (elles sont déplacées dedans). C'est indispensable quand la closure doit **vivre plus longtemps** que la fonction qui la crée : la renvoyer, ou la donner à un thread.

**Exemple résolu : une fonction qui fabrique une closure.**

```rust
fn creer_multiplicateur(facteur: i32) -> impl Fn(i32) -> i32 {
    move |x| x * facteur
}

fn creer_signature(auteur: String) -> impl Fn(&str) -> String {
    move |texte| format!("{texte} (par {auteur})")
}

fn main() {
    let triple = creer_multiplicateur(3);
    println!("{} {}", triple(4), triple(10));
    let signer = creer_signature("Inès".to_string());
    println!("{}", signer("Bonjour"));
    println!("{}", signer("À demain"));
}
```

1. `creer_signature` reçoit `auteur`, une variable **locale** : elle disparaît à la fin de la fonction.
2. La closure renvoyée sert **après** la fin de la fonction. Si elle se contentait d'emprunter `auteur`, elle pointerait vers une variable détruite. Rust refuse : erreur **E0373** (« closure may outlive the current function, but it borrows `auteur` »), et le `help:` propose d'ajouter `move`.
3. Avec `move`, la `String` est déplacée **dans** la closure : elle vit aussi longtemps qu'elle. On peut appeler `signer` plusieurs fois : `Bonjour (par Inès)` puis `À demain (par Inès)`.
4. `impl Fn() -> String` (ou `impl Fn(&str) -> String`) comme type de retour veut dire « je renvoie une closure de cette forme ».

Le programme affiche aussi `12 30` pour `triple`.

`move` ne rend pas la closure plus rapide et ne permet pas de la modifier : il change seulement **qui possède** les variables capturées.

**À retenir :** closure renvoyée par une fonction (ou envoyée à un thread) → `move`.

## 2. Les itérateurs

Un **itérateur** est un objet qui donne les éléments d'une collection **un par un**. La boucle `for` utilise un itérateur en coulisses.

Trois façons d'en obtenir un sur un `Vec<T>` :

| Méthode | Donne | Usage | La liste après |
|---|---|---|---|
| `v.iter()` | `&T` (lecture) | lire | intacte |
| `v.iter_mut()` | `&mut T` (modification) | modifier sur place avec `*x` | intacte, modifiée |
| `v.into_iter()` | `T` (les valeurs elles-mêmes) | réutiliser les éléments ailleurs | **consommée**, plus utilisable |

C'est le même trio que `for x in &v`, `for x in &mut v` et `for x in v`.

**Exemple résolu : les trois façons sur une liste de textes.**

```rust
fn main() {
    let mut villes = vec![String::from("lyon"), String::from("nice")];

    for v in villes.iter() {
        println!("lu : {v}");
    }

    for v in villes.iter_mut() {
        v.push('!');
    }
    println!("{:?}", villes);

    let majuscules: Vec<String> = villes.into_iter().map(|v| v.to_uppercase()).collect();
    println!("{:?}", majuscules);
}
```

1. `iter()` donne des `&String` : on lit, `villes` reste intact.
2. `iter_mut()` donne des `&mut String` : on peut modifier chaque texte. `villes` vaut `["lyon!", "nice!"]`.
3. `into_iter()` donne les `String` elles-mêmes : `map` les transforme (`to_uppercase()` crée la version en majuscules), et `collect` range le résultat. Affichage : `["LYON!", "NICE!"]`. Après cette ligne, `villes` n'existe plus : elle a été **déplacée** (plus vide, plus utilisable du tout).

Erreur classique : écrire `for x in v.iter() { *x += 1; }` pour modifier. `iter()` donne des `&T` en **lecture seule** : « cannot assign to `*x`, which is behind a `&` reference ». Il faut `iter_mut()`.

**À retenir :** `iter()` lit, `iter_mut()` modifie, `into_iter()` consomme et donne les valeurs.

### Adaptateurs : transformer

Un **adaptateur** prend un itérateur et en renvoie un autre, transformé. On les enchaîne avec des points.

| Adaptateur | Effet | Sur `[1, 2, 3, 4, 5]` |
|---|---|---|
| `map(\|x\| ...)` | transforme chaque élément | `map(\|x\| x * 10)` → 10, 20, 30, 40, 50 |
| `filter(\|x\| ...)` | garde les éléments pour lesquels la condition est vraie | `filter(\|x\| **x > 2)` → 3, 4, 5 |
| `enumerate()` | ajoute l'**indice** devant chaque élément (à partir de **0**) | (0, 1), (1, 2), (2, 3)... |
| `zip(autre)` | avance dans deux listes à la fois, par couples | avec `[7, 8]` : (1, 7), (2, 8) puis **s'arrête** (la plus courte est finie) |
| `rev()` | à l'envers | 5, 4, 3, 2, 1 |
| `skip(n)` / `take(n)` | saute les `n` premiers / garde les `n` premiers | `skip(1).take(2)` → 2, 3 |
| `copied()` | transforme des `&i32` en `i32` (copie) | |

> [!warning] Les itérateurs sont paresseux
> `v.iter().map(|x| x * 10);` tout seul ne calcule **rien**, ne modifie pas `v` et ne crée aucune liste : un adaptateur attend qu'on **consomme** le résultat. Le compilateur le signale (« iterators are lazy and do nothing unless consumed »).

```rust
let v = [1, 2, 3, 4, 5];
let fois_dix: Vec<i32> = v.iter().map(|x| x * 10).collect();
let grands: Vec<&i32> = v.iter().filter(|x| **x > 2).collect();
let milieu: Vec<&i32> = v.iter().skip(1).take(2).collect();
let envers: Vec<&i32> = v.iter().rev().collect();
println!("{:?} {:?} {:?} {:?}", fois_dix, grands, milieu, envers);
```

**À retenir :** les adaptateurs décrivent le travail, un consommateur (`collect`, `sum`, `for`...) le lance.

### Le schéma de base : `iter` → `map` / `filter` → `collect`

**Exemple résolu : les prix TTC, et seulement les prix au-dessus de 50.**

```rust
fn ttc(prix: &[u32]) -> Vec<u32> {
    prix.iter().map(|p| p * 12 / 10).collect()
}

fn chers(prix: &[u32]) -> Vec<u32> {
    prix.iter().copied().filter(|p| *p > 50).collect()
}

fn initiales(noms: &[&str]) -> Vec<char> {
    noms.iter().map(|nom| nom.chars().next().unwrap_or('?')).collect()
}

fn main() {
    println!("{:?}", ttc(&[10, 50, 100]));
    println!("{:?}", chers(&[30, 80, 51, 50]));
    println!("{:?}", initiales(&["Paul", "Eva"]));
}
```

1. `ttc` : `iter()` donne des `&u32`, `map` calcule `p * 12 / 10` pour chacun (Rust sait multiplier une référence `&u32` par un nombre, pas besoin d'étoile ici) : 12, 60, 120. `collect()` range tout dans un `Vec<u32>` : il sait quel type fabriquer grâce au **type de retour** de la fonction.
2. `chers` : `copied()` transforme les `&u32` en `u32`. `filter` reçoit une référence vers chaque élément, donc un `&u32` : on compare `*p > 50`. On garde 80 et 51 ; 50 n'est pas **strictement** plus grand. Résultat : `[80, 51]`, dans l'ordre d'origine.
3. `initiales` : `map` peut appeler des méthodes. `['P', 'E']`. Pour une longueur, `mot.len()` donne le nombre d'**octets** (`"été".len()` vaut 5, car `é` prend 2 octets).

**À retenir :** une boucle « pour chaque élément, calcule et range » s'écrit `iter().map(...).collect()` ; « garde ceux qui... » s'écrit `iter().filter(...).collect()`.

### Références de références

`v.iter()` donne des `&i32`. `filter` passe à sa closure une **référence vers l'élément**, donc un `&&i32` : d'où les `**x` (deux étoiles pour remonter jusqu'au nombre). Trois façons équivalentes d'écrire le même filtre :

```rust
let v = [1, 5, 2, 8];
let a: Vec<&i32> = v.iter().filter(|x| **x > 2).collect();
let b: Vec<&i32> = v.iter().filter(|&&x| x > 2).collect();
let c: Vec<i32> = v.iter().copied().filter(|x| *x > 2).collect();
println!("{:?} {:?} {:?}", a, b, c);
```

| Écriture | Type de `x` | Comparaison |
|---|---|---|
| `iter().filter(\|x\| ...)` | `&&i32` | `**x > 2` |
| `iter().filter(\|&&x\| ...)` | `i32` (le motif enlève les deux `&`) | `x > 2` |
| `iter().copied().filter(\|x\| ...)` | `&i32` | `*x > 2` |

`map`, lui, reçoit l'élément **directement** (pas une référence de plus) : `iter().map(|x| ...)` donne `x: &i32`.

**À retenir :** dans un `filter` après `iter()`, deux étoiles ; avec `copied()` avant, une seule.

### Consommateurs : obtenir un résultat

| Méthode | Résultat | Sur une liste vide |
|---|---|---|
| `.sum()` | la somme | `0` |
| `.count()` | le nombre d'éléments (un `usize`) | `0` |
| `.collect()` | une collection (`Vec`, `String`, `HashMap`...) | une collection vide |
| `.min()` / `.max()` | `Option` du plus petit / plus grand (une **référence** après `iter()`) | `None` |
| `.any(\|x\| ...)` | `true` si **au moins un** élément vérifie la condition | `false` |
| `.all(\|x\| ...)` | `true` si **tous** vérifient la condition | `true` |
| `.find(\|x\| ...)` | `Option` du **premier** élément qui vérifie la condition | `None` |
| `.position(\|x\| ...)` | `Option` de l'**indice** de ce premier élément | `None` |
| `.fold(depart, \|acc, x\| ...)` | une valeur construite pas à pas | `depart` |

**Exemple résolu : statistiques sur des températures.**

```rust
fn main() {
    let temperatures = [14, 21, 9, 21, 17];

    let somme: i32 = temperatures.iter().sum();
    let chaudes = temperatures.iter().filter(|t| **t >= 18).count();
    let max = temperatures.iter().max();
    let min = temperatures.iter().min().copied();
    let vide: Vec<i32> = Vec::new();

    println!("somme {somme}, chaudes {chaudes}");
    println!("{:?} {:?} {:?}", max, min, vide.iter().max());
}
```

| Calcul | Pas à pas | Résultat |
|---|---|---|
| `sum()` | 14 + 21 + 9 + 21 + 17 | `82` |
| `filter(>= 18).count()` | 21 oui, 21 oui, les autres non | `2` |
| `max()` | le plus grand est 21 ; `iter()` donne des références | `Some(21)`, de type `Option<&i32>` |
| `min().copied()` | `copied()` transforme `Option<&i32>` en `Option<i32>` | `Some(9)` |
| `max()` sur une liste vide | aucun élément | `None` |

**Moyenne.** `7 / 2` vaut `3` entre entiers (la division entière coupe la virgule). Pour une vraie moyenne, on convertit en `f64` avec `as f64`, et on traite la liste vide à part (diviser par 0 n'a pas de sens) :

```rust
fn moyenne(valeurs: &[u32]) -> Option<f64> {
    if valeurs.is_empty() {
        return None;
    }
    let somme: u32 = valeurs.iter().sum();
    Some(somme as f64 / valeurs.len() as f64)
}

fn main() {
    println!("{:?}", moyenne(&[7, 8]));
    println!("{:?}", moyenne(&[]));
}
```

`[7, 8]` : somme 15, taille 2, `15.0 / 2.0 = 7.5` → `Some(7.5)` (un `f64` s'affiche `7.5` avec `{}` ou `{:?}`). Sans `as f64`, on aurait `15 / 2 = 7`. Avec une liste de `f64`, on écrit directement `valeurs.iter().sum::<f64>()`.

**À retenir :** `min` / `max` renvoient une `Option<&T>` (`.copied()` pour la valeur) ; une moyenne = `somme as f64 / len as f64`, avec un cas à part pour la liste vide.

### `fold` : construire une valeur pas à pas

`fold(depart, |acc, x| nouvel_acc)` part de `depart`, puis pour chaque élément calcule le nouvel accumulateur `acc` à partir de l'ancien et de l'élément `x`. Le résultat est le dernier `acc`.

**Exemple résolu : `[3, 1, 4].iter().fold(1, |acc, x| acc * 2 + x)`.**

| Élément `x` | `acc` avant | Calcul `acc * 2 + x` | `acc` après |
|---|---|---|---|
| (départ) | | | `1` |
| 3 | 1 | 1 × 2 + 3 | `5` |
| 1 | 5 | 5 × 2 + 1 | `11` |
| 4 | 11 | 11 × 2 + 4 | `26` |

Résultat : `26`. Avec `fold(0, |acc, x| acc * 10 + x)`, chaque étape décale d'un rang (× 10) avant d'ajouter : c'est ainsi qu'on assemble des chiffres en nombre. Et `fold(0, |acc, x| acc + x)` fait exactement ce que fait `sum()` (Clippy conseille alors d'écrire `sum()`).

```rust
let resultat = [3, 1, 4].iter().fold(1, |acc, x| acc * 2 + x);
let phrase = ["un", "deux"].iter().fold(String::new(), |acc, mot| acc + *mot + ";");
println!("{resultat} {phrase}");
```

Affichage : `26 un;deux;`. Sur une liste vide, `fold` renvoie simplement la valeur de départ.

**À retenir :** pour `fold`, fais un tableau « élément / acc avant / acc après » en partant de la valeur de départ.

### `any`, `all`, `find`, `position` : poser une question

**Exemple résolu : sur `notes = [12, 7, 15, 7]`.**

```rust
fn main() {
    let notes = [12, 7, 15, 7];
    let un_echec = notes.iter().any(|n| *n < 10);
    let tous_admis = notes.iter().all(|n| *n >= 10);
    let premiere_bonne = notes.iter().copied().find(|n| *n >= 14);
    let ou_echec = notes.iter().position(|n| *n < 10);
    let aucune: [u32; 0] = [];
    println!("{un_echec} {tous_admis} {:?} {:?}", premiere_bonne, ou_echec);
    println!("{} {}", aucune.iter().all(|n| *n >= 10), aucune.iter().any(|n| *n >= 10));
}
```

| Question | Méthode | Pas à pas | Résultat |
|---|---|---|---|
| au moins une note sous 10 ? | `any` | 12 non, 7 **oui** : on s'arrête | `true` |
| toutes à 10 ou plus ? | `all` | 12 oui, 7 **non** : on s'arrête | `false` |
| la première note ≥ 14 ? | `find` | 12 non, 7 non, 15 **oui** | `Some(15)` |
| l'indice du premier échec ? | `position` | indice 0 (12) non, indice 1 (7) **oui** | `Some(1)` |

`find` renvoie l'**élément**, `position` renvoie son **indice** (à partir de 0). Les deux s'arrêtent au **premier** trouvé (le second 7, à l'indice 3, n'est jamais regardé) et renvoient `None` si rien ne convient.

> [!warning] `all` et `any` sur une liste vide
> `all` sur une liste vide renvoie `true` : « tous vérifient la condition » est vrai quand il n'y a personne (aucun contre-exemple). `any` renvoie `false` : il n'y a aucun élément qui la vérifie. La deuxième ligne affiche donc `true false`.

**À retenir :** `any` = au moins un, `all` = tous (vrai si vide), `find` = le premier élément, `position` = son indice.

### `enumerate` et `zip` : indices et couples

`enumerate()` donne des couples `(indice, élément)`, en commençant à **0**. `zip(autre)` donne des couples `(élément de la 1re liste, élément de la 2e)` et s'arrête dès que la plus courte est finie.

**Exemple résolu : numéroter des étapes, et additionner des quantités × prix.**

```rust
fn main() {
    let etapes = ["chauffer", "verser", "servir"];
    let lignes: Vec<String> = etapes
        .iter()
        .enumerate()
        .map(|(i, e)| format!("étape {} : {}", i + 1, e))
        .collect();
    println!("{:?}", lignes);

    let indices_longs: Vec<usize> = etapes
        .iter()
        .enumerate()
        .filter(|(_, e)| e.len() > 6)
        .map(|(i, _)| i)
        .collect();
    println!("{:?}", indices_longs);

    let quantites = [2, 1, 4];
    let prix = [3, 10, 5, 99];
    let total: i32 = quantites.iter().zip(prix.iter()).map(|(q, p)| q * p).sum();
    println!("{total}");
}
```

1. `enumerate` donne `(0, "chauffer")`, `(1, "verser")`, `(2, "servir")`. Le `map` reçoit le couple et le **découpe** avec le motif `|(i, e)|`. Comme l'indice commence à 0, on affiche `i + 1` : `["étape 1 : chauffer", "étape 2 : verser", "étape 3 : servir"]`. `format!` fonctionne comme `println!` mais renvoie une `String`.
2. Pour garder des **indices** : `filter` sur la valeur (`|(_, e)|`, le `_` ignore l'indice), puis `map(|(i, _)| i)` ne garde que l'indice. « chauffer » fait 8 octets (gardé, indice 0), « verser » 6 (pas > 6), « servir » 6 → `[0]`.
3. `zip` fait les couples (2, 3), (1, 10), (4, 5). Le 99 n'a pas de partenaire : `zip` s'arrête à la fin de `quantites`. Produits : 6, 10, 20, somme `36`.

On peut aussi écrire `quantites.iter().zip(&prix)` ou `zip(prix)` : `zip` accepte tout ce qu'on peut parcourir.

**À retenir :** `enumerate` pour avoir l'indice (+ 1 pour numéroter à partir de 1), `zip` pour avancer dans deux listes en même temps.

### Découper des couples dans une closure

Quand les éléments sont des couples `(a, b)`, on les découpe directement dans les paramètres de la closure :

**Exemple résolu : les produits en rupture de stock.**

```rust
fn en_rupture(stock: Vec<(String, u32)>) -> Vec<String> {
    stock
        .into_iter()
        .filter(|(_, quantite)| *quantite == 0)
        .map(|(nom, _)| nom)
        .collect()
}

fn main() {
    let stock = vec![("vis".to_string(), 0), ("clou".to_string(), 12), ("colle".to_string(), 0)];
    println!("{:?}", en_rupture(stock));
}
```

1. `into_iter()` consomme la liste et donne les couples `(String, u32)` eux-mêmes : on pourra **sortir** les `String` sans les copier.
2. `filter(|(_, quantite)| ...)` : `filter` reçoit une référence vers le couple, le motif le découpe et `quantite` est un `&u32`, d'où `*quantite == 0`. On garde « vis » et « colle ».
3. `map(|(nom, _)| nom)` : on garde le nom (la `String`), on jette la quantité.
4. Résultat : `["vis", "colle"]`. Avec `iter()` au lieu de `into_iter()`, on aurait des `&String`, et il faudrait les copier (`nom.clone()`) pour renvoyer des `String`.

**À retenir :** `|(a, b)|` découpe un couple ; `_` ignore une partie ; `into_iter()` quand on veut récupérer les éléments eux-mêmes.

### Indiquer le type pour `collect` et `sum`

`collect` peut fabriquer un `Vec`, une `String`, une `HashMap`... et `sum` peut produire un `i32`, un `u64`, un `f64`... Rust doit savoir lequel. Sinon : erreur « type annotations needed ».

| Façon de l'indiquer | Exemple |
|---|---|
| sur la variable | `let total: i32 = v.iter().sum();` |
| avec le **turbofish** `::<>` | `v.iter().sum::<i32>()` ou `collect::<Vec<i32>>()` |
| par le type de retour de la fonction | `fn f(v: &[i32]) -> i32 { v.iter().sum() }` |

```rust
let v = [4, 5, 6];
let total = v.iter().sum::<i32>();
let doubles = v.iter().map(|x| x * 2).collect::<Vec<i32>>();
println!("{total} {:?}", doubles);
```

`let total = v.iter().sum();` tout court ne compile pas : `sum` existe bien, `v` n'a pas besoin d'être `mut`, mais Rust ne sait pas quel type de résultat produire.

**À retenir :** « type annotations needed » sur `sum` ou `collect` → écris le type sur la variable ou avec `::<>`.

### Une chaîne remplace une boucle

```rust
let v = [1, 2, 3, 4];
let mut somme = 0;
for x in &v {
    if x % 2 == 0 {
        somme += x * x;
    }
}
println!("{somme}");
```

devient :

```rust
let v = [1, 2, 3, 4];
let somme: i32 = v.iter().filter(|x| **x % 2 == 0).map(|x| x * x).sum();
println!("{somme}");
```

Les deux affichent `20` (2 × 2 + 4 × 4). Même vitesse (le compilateur produit la même boucle : c'est une *zero cost abstraction*), mais on lit directement l'intention : « garder les pairs, les mettre au carré, additionner ».

```anim
iterateurs
scenario: boucle
```

## À retenir

- Closure : `|params| expression`. Elle peut utiliser les variables autour (capture). En paramètre : `impl Fn(i32) -> bool`.
- Closure qui modifie une variable capturée : `mut` sur la variable et sur la closure. Closure renvoyée par une fonction : `move` (sinon E0373).
- `iter()` lit (`&T`), `iter_mut()` modifie (`&mut T`), `into_iter()` consomme (`T`).
- Adaptateurs (`map`, `filter`, `enumerate`, `zip`, `copied`, `rev`, `skip`, `take`) : paresseux, ne font rien seuls.
- Consommateurs (`sum`, `count`, `collect`, `fold`, `any`, `all`, `find`, `position`, `min`, `max`) : lancent le calcul.
- `filter` après `iter()` reçoit un `&&T` (`**x`) ; `max` / `min` / `find` renvoient une `Option`.
- `all` est vrai sur une liste vide, `any` faux. `zip` s'arrête à la plus courte. `enumerate` commence à 0.
- `collect` et `sum` ont souvent besoin qu'on précise le type.
