# Programmation fonctionnelle

Au chapitre 9, tu as découvert les closures et les itérateurs. Ce chapitre va plus loin : il t'apprend à **penser en style fonctionnel**, c'est-à-dire à écrire un programme comme un assemblage de petites fonctions qui transforment des données, sans boucles et sans variables qu'on modifie.

> [!info] Lire les exemples
> Les exemples utilisent `assert_eq!(a, b)` pour montrer le résultat : le programme s'arrête avec une erreur si `a` est différent de `b`. Si rien ne s'affiche quand tu cliques sur « Essayer », c'est que tout est juste. Change une valeur pour voir l'erreur.

## 1. Le style fonctionnel, c'est quoi ?

Trois idées :

1. **Des fonctions pures** : une fonction donne toujours le même résultat pour les mêmes paramètres, et ne fait rien d'autre que calculer ce résultat.
2. **Des données immuables** : on ne modifie pas une valeur, on en fabrique une nouvelle.
3. **Tout est expression** : on décrit *ce qu'on veut obtenir*, plutôt que *les étapes pour l'obtenir*.

### Les fonctions pures

Un **effet de bord**, c'est tout ce qu'une fonction fait en plus de renvoyer son résultat : afficher du texte, modifier une variable extérieure, écrire dans un fichier, lire l'heure ou tirer un nombre au hasard...

```rust
fn prix_ttc(prix_ht: f64) -> f64 {
    prix_ht * 1.2
}

fn prix_ttc_bavard(prix_ht: f64) -> f64 {
    println!("calcul du prix de {prix_ht}");
    prix_ht * 1.2
}

assert_eq!(prix_ttc(10.0), 12.0);
assert_eq!(prix_ttc_bavard(10.0), 12.0);
```

`prix_ttc` est pure. `prix_ttc_bavard` ne l'est pas : elle affiche quelque chose.

| Fonction pure | Fonction avec effet de bord |
|---|---|
| même entrée → même sortie, toujours | le résultat peut changer d'un appel à l'autre |
| se teste avec un simple `assert_eq!` | il faut préparer ou observer « l'extérieur » pour la tester |
| se comprend toute seule | il faut connaître tout ce qu'elle touche |
| ex. : `prix_ttc`, `str::len`, `i32::max` | ex. : `println!`, lire un fichier, modifier une liste reçue en `&mut` |

Pourquoi c'est utile :

- **des tests faciles** : on appelle la fonction, on compare le résultat, c'est tout ;
- **moins de bugs** : personne ne peut changer une valeur « dans ton dos » ;
- **une lecture locale** : pour comprendre une ligne, pas besoin de remonter tout le programme.

**Exemple pas à pas : la fonction est-elle pure ?** Pour chaque fonction, pose deux questions : (1) « Si je l'appelle deux fois avec les mêmes paramètres, ai-je forcément le même résultat ? » ; (2) « Fait-elle autre chose que renvoyer son résultat ? ». Elle est pure seulement si la réponse est **oui** puis **non**.

| Fonction | Même résultat à chaque fois ? | Fait autre chose ? | Pure ? |
|---|---|---|---|
| `fn perimetre(c: u32) -> u32 { 4 * c }` | oui : `perimetre(3)` vaut toujours `12` | non | **oui** |
| une fonction qui renvoie le nombre de secondes depuis 1970 | non : la valeur change à chaque seconde | elle lit l'horloge | non |
| `fn ajouter(liste: &mut Vec<i32>, x: i32) { liste.push(x) }` | elle ne renvoie rien | elle **modifie** la liste de l'appelant | non |
| `fn moyenne(a: f64, b: f64) -> f64 { println!("…"); (a + b) / 2.0 }` | oui | elle **affiche** | non |

Le dernier cas est le piège classique : le résultat est toujours le même, mais l'affichage est un effet de bord, donc la fonction n'est pas pure.

**À retenir :** pure = même entrée, même sortie, **et** rien d'autre (ni affichage, ni lecture de l'extérieur, ni modification d'une valeur reçue).

> [!tip] Un cœur pur, des bords impurs
> Un programme doit bien afficher des choses ou lire des fichiers à un moment. L'astuce : garder les effets de bord **au bord** (dans `main`, qui lit et affiche) et mettre tous les calculs dans des fonctions pures. C'est l'organisation de tous les exercices de ce chapitre.

> [!info] Rust n'est pas « purement » fonctionnel
> Certains langages, comme Haskell, interdisent presque les effets de bord. Rust autorise les deux styles et te laisse choisir. Il emprunte beaucoup au fonctionnel : variables immuables par défaut, closures, itérateurs, `Option`, `Result`, `match`.

### Tout est expression

En Rust, `if`, `match` et les blocs `{ }` **produisent une valeur**. Au lieu de déclarer une variable puis de la remplir dans chaque branche, on la calcule directement :

```rust
let note = 14;

let mention = match note {
    16..=20 => "très bien",
    14..=15 => "bien",
    12..=13 => "assez bien",
    _ => "aucune",
};

let resultat = if note >= 10 { "reçu" } else { "recalé" };

assert_eq!(mention, "bien");
assert_eq!(resultat, "reçu");
```

Pas à pas : `note` vaut `14`. Le `match` essaie les cas dans l'ordre : `16..=20` (de 16 à 20 compris) ne contient pas 14 ; `14..=15` le contient, donc tout le `match` **vaut** `"bien"`, et cette valeur va dans `mention`. Pour `resultat`, `14 >= 10` est vrai, donc le `if` vaut `"reçu"`. Attention au `;` : il se met après le `match` ou le `if` entier, pas dans les branches.

**À retenir :** au lieu de « `let mut x;` puis remplir `x` dans chaque branche », écris `let x = if … { … } else { … };` ou `let x = match … { … };`.

## 2. Les fonctions sont des valeurs

En style fonctionnel, une fonction est une valeur comme une autre : on peut la ranger dans une variable, la donner en paramètre à une autre fonction, ou la renvoyer comme résultat. Une fonction qui reçoit ou renvoie une fonction s'appelle une **fonction d'ordre supérieur**. Tu en utilises déjà : `map`, `filter` et `fold` reçoivent une closure.

### Recevoir une fonction en paramètre

Deux écritures équivalentes :

```rust
fn appliquer_deux_fois(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(f(x))
}

fn appliquer_a_dix<F>(f: F) -> i32
where
    F: Fn(i32) -> i32,
{
    f(10)
}

fn triple(x: i32) -> i32 {
    x * 3
}

assert_eq!(appliquer_deux_fois(|x| x + 5, 1), 11);
assert_eq!(appliquer_deux_fois(triple, 2), 18);
assert_eq!(appliquer_a_dix(triple), 30);
```

- `impl Fn(i32) -> i32` : « n'importe quoi qu'on peut appeler avec un `i32` et qui renvoie un `i32` ».
- `<F>` avec `where F: Fn(i32) -> i32` : la même chose avec un **générique** nommé `F` (chapitre 10). Plus long, mais pratique quand le type revient plusieurs fois.
- Une fonction normale comme `triple` peut être donnée partout où une closure est attendue : on écrit son nom, **sans parenthèses**.

Pas à pas pour `appliquer_deux_fois(|x| x + 5, 1)` : dans la fonction, `f` est la closure « ajouter 5 » et `x` vaut `1`. On calcule d'abord l'appel intérieur `f(1) = 1 + 5 = 6`, puis l'appel extérieur `f(6) = 6 + 5 = 11`. Avec `triple` et `2` : `triple(2) = 6`, puis `triple(6) = 18`.

**Utiliser la fonction reçue dans une chaîne d'itérateurs.** Le paramètre `f` s'appelle comme une fonction normale, y compris à l'intérieur d'une closure :

```rust
fn transformer(mots: &[&str], f: impl Fn(&str) -> String) -> Vec<String> {
    mots.iter().map(|mot| f(mot)).collect()
}

fn combien_courts(mots: &[&str], est_court: impl Fn(&str) -> bool) -> usize {
    mots.iter().filter(|mot| est_court(mot)).count()
}

let mots = ["chat", "hippopotame", "rat"];
assert_eq!(transformer(&mots, |m| m.to_uppercase()), vec!["CHAT", "HIPPOPOTAME", "RAT"]);
assert_eq!(combien_courts(&mots, |m| m.len() <= 4), 2);
```

Pas à pas pour `combien_courts` : `filter` regarde chaque mot et appelle `est_court` dessus. `"chat"` (4 lettres) : vrai, gardé. `"hippopotame"` (11) : faux, jeté. `"rat"` (3) : vrai, gardé. `count` compte les gardés : `2`.

> [!info] Les `&` dans la closure de `filter`
> `iter()` donne des **références** vers les éléments (`&&str` ici, `&i32` pour une liste de `i32`), et `filter` passe à sa closure une référence vers chacune : on reçoit donc `&&i32`. Pour retrouver un `i32`, on peut écrire le motif `|&&n| condition(n)` (chaque `&` du motif enlève une référence), ou bien `|n| condition(**n)`. Avec `map`, il n'y a qu'une seule référence : `|&n| f(n)`.

**Répéter une fonction `n` fois sans boucle.** Un `fold` sur l'intervalle `0..n` fait exactement `n` tours. On ignore le numéro du tour (`_`) et on se sert seulement de l'accumulateur :

```rust
let cri = (0..3).fold(String::from("Go"), |texte, _| texte + "!");
assert_eq!(cri, "Go!!!");

let rien = (0..0).fold(String::from("Go"), |texte, _| texte + "!");
assert_eq!(rien, "Go");
```

| Tour | `texte` avant | `texte` après |
|---|---|---|
| départ | | `"Go"` |
| 0 | `"Go"` | `"Go!"` |
| 1 | `"Go!"` | `"Go!!"` |
| 2 | `"Go!!"` | `"Go!!!"` |

Avec `0..0`, il n'y a aucun tour : on récupère la valeur de départ telle quelle.

**À retenir :** un paramètre `f: impl Fn(A) -> B` s'appelle avec `f(valeur)`, partout dans la fonction ; pour répéter `n` fois, `(0..n).fold(depart, |acc, _| …)`.

> [!tip] Quel trait demander ?
> Pour un paramètre, demande le trait le **moins exigeant** pour ton usage. Tu appelles la fonction une seule fois ? `FnOnce`. Plusieurs fois, et elle peut modifier ce qu'elle capture ? `FnMut`. Sinon, `Fn`. Toute closure `Fn` peut servir de `FnMut`, et toute `FnMut` de `FnOnce` : demander `FnOnce` accepte donc le plus de closures, mais tu n'as le droit de l'appeler qu'une fois.

### Les pointeurs de fonction : `fn`

`fn(i32) -> i32`, avec un `f` **minuscule**, est un **type** : celui d'une fonction normale. Une closure qui ne capture aucune variable peut aussi s'y convertir. C'est pratique pour ranger plusieurs fonctions dans un tableau, car elles ont alors toutes le même type :

```rust
fn double(x: i32) -> i32 {
    x * 2
}

fn carre(x: i32) -> i32 {
    x * x
}

let operations: [fn(i32) -> i32; 3] = [double, carre, |x| x - 1];
let resultats: Vec<i32> = operations.iter().map(|f| f(5)).collect();
assert_eq!(resultats, vec![10, 25, 4]);
```

| Écriture | Ce que c'est | Accepte |
|---|---|---|
| `Fn(i32) -> i32` | un **trait** (majuscule) | les fonctions et les closures, même celles qui capturent des variables |
| `fn(i32) -> i32` | un **type** (minuscule) : un pointeur de fonction | les fonctions et les closures **sans capture** |

### Renvoyer une fonction

Une fonction peut fabriquer et renvoyer une closure. Chaque appel fabrique une nouvelle closure, avec sa propre valeur capturée :

```rust
fn plus_grand_que(seuil: i32) -> impl Fn(i32) -> bool {
    move |x| x > seuil
}

let est_majeur = plus_grand_que(17);
let est_positif = plus_grand_que(0);

assert!(est_majeur(18));
assert!(!est_majeur(12));
assert!(!est_positif(-3));
```

Le `move` est indispensable : `seuil` est un paramètre, qui disparaît à la fin de `plus_grand_que`. Sans `move`, la closure emprunterait une variable qui n'existe plus, et le compilateur refuse (erreur E0373). Avec `move`, la closure garde sa propre copie de `seuil`.

Pas à pas :

1. `plus_grand_que(17)` : `seuil` vaut `17` ; la fonction fabrique la closure `|x| x > 17` (avec sa copie de `17`) et la renvoie. Elle est rangée dans `est_majeur`.
2. `plus_grand_que(0)` fabrique une **autre** closure, `|x| x > 0`, rangée dans `est_positif`. Les deux ne se mélangent pas.
3. `est_majeur(18)` calcule `18 > 17` : `true`. `est_majeur(12)` : `12 > 17`, `false`. `est_positif(-3)` : `-3 > 0`, `false`.

On peut aussi appeler directement le résultat, sans le ranger : `plus_grand_que(5)(9)` vaut `9 > 5`, donc `true`. Les premières parenthèses appellent la fabrique, les secondes appellent la closure obtenue.

**À retenir :** une fabrique de fonctions renvoie `impl Fn(…) -> …` et une closure `move |…| …` qui garde une copie de ses paramètres.

### `Box<dyn Fn>` : quand il faut un type commun

Chaque closure a **son propre type**, invisible, même si deux closures se ressemblent. Or `impl Fn` veut dire « *un* type précis que je ne nomme pas » : une fonction ne peut donc pas renvoyer une closure dans le `if` et une autre dans le `else`.

```text
fn formule(poli: bool, nom: String) -> impl Fn() -> String {
    if poli {
        move || format!("Bonjour {nom}")
    } else {
        move || format!("Salut {nom}")
    }
}

error[E0308]: `if` and `else` have incompatible types
  = note: no two closures, even if identical, have the same type
```

La solution : mettre chaque closure dans une **boîte**.

```rust
fn formule(poli: bool, nom: String) -> Box<dyn Fn() -> String> {
    if poli {
        Box::new(move || format!("Bonjour {nom}"))
    } else {
        Box::new(move || format!("Salut {nom}"))
    }
}

let saluer = formule(true, "Ana".to_string());
assert_eq!(saluer(), "Bonjour Ana");
assert_eq!(formule(false, "Léo".to_string())(), "Salut Léo");
```

- `dyn Fn() -> String` : « n'importe quel type qui implémente ce trait » ; le vrai type n'est connu qu'à l'exécution (*dyn* comme *dynamique*).
- `Box<...>` : une boîte qui range la closure dans le **tas** (la mémoire réservée pendant l'exécution). Toutes les boîtes ont la même taille et le même type : on peut les mélanger.

On peut ainsi ranger des règles différentes dans une même liste. Un **alias de type** (`type Regle = ...;`) donne un nom court à un type trop long :

```rust
type Regle = Box<dyn Fn(&str) -> bool>;

let longueur_min = 8;
let regles: Vec<Regle> = vec![
    Box::new(move |mdp| mdp.chars().count() >= longueur_min),
    Box::new(|mdp| mdp.chars().any(|c| c.is_ascii_digit())),
    Box::new(|mdp| mdp.chars().any(|c| c.is_uppercase())),
];

let est_solide = |mdp: &str| regles.iter().all(|regle| regle(mdp));
assert!(est_solide("Rust2024!"));
assert!(!est_solide("rust2024"));
```

| | `impl Fn` | `Box<dyn Fn>` |
|---|---|---|
| Type réel | un seul, choisi à la compilation | n'importe lequel, découvert à l'exécution |
| Mélanger plusieurs closures | non | oui (branches d'un `if` ou d'un `match`, éléments d'un `Vec`) |
| Coût | aucun | une allocation et un appel indirect (très léger) |
| À utiliser | par défaut | quand il faut mélanger des closures |

**Exemple : choisir une closure dans un `match`.** Chaque branche fabrique sa propre closure, donc chaque branche doit la mettre dans un `Box::new(...)`. Le cas `_` (« tout le reste ») est obligatoire pour que le `match` couvre tous les textes possibles :

```rust
fn convertisseur(unite: &str) -> Box<dyn Fn(f64) -> f64> {
    match unite {
        "km" => Box::new(|m| m / 1000.0),
        "cm" => Box::new(|m| m * 100.0),
        _ => Box::new(|m| m),
    }
}

assert_eq!(convertisseur("km")(2500.0), 2.5);
assert_eq!(convertisseur("cm")(3.0), 300.0);
assert_eq!(convertisseur("??")(7.0), 7.0);
```

Pas à pas pour `convertisseur("km")(2500.0)` : le `match` compare `"km"` à chaque cas, le premier correspond ; la fonction renvoie la boîte qui contient `|m| m / 1000.0`. Le deuxième appel `(2500.0)` lance cette closure : `2500 / 1000 = 2.5`.

**Exemple : appliquer une liste de closures, l'une après l'autre.** Un `fold` part de la valeur de départ, et chaque closure de la liste transforme l'accumulateur :

```rust
type Etape = Box<dyn Fn(String) -> String>;

let etapes: Vec<Etape> = vec![
    Box::new(|t| t.trim().to_string()),
    Box::new(|t| t.to_uppercase()),
    Box::new(|t| format!("« {t} »")),
];

let resultat = etapes.iter().fold("  salut ".to_string(), |texte, etape| etape(texte));
assert_eq!(resultat, "« SALUT »");

let aucune: Vec<Etape> = Vec::new();
assert_eq!(aucune.iter().fold("tel quel".to_string(), |texte, etape| etape(texte)), "tel quel");
```

| Étape | Texte avant | Texte après |
|---|---|---|
| départ | | `"  salut "` |
| `trim` | `"  salut "` | `"salut"` |
| `to_uppercase` | `"salut"` | `"SALUT"` |
| guillemets | `"SALUT"` | `"« SALUT »"` |

Avec une liste vide, le `fold` ne fait aucun tour et renvoie la valeur de départ.

**À retenir :** plusieurs closures dans un même `if`, `match` ou `Vec` → `Box<dyn Fn(…) -> …>` et `Box::new(…)` autour de chacune ; pour les appliquer en série, `fold`.

### Composer deux fonctions

**Composer**, c'est brancher la sortie d'une fonction sur l'entrée d'une autre : `g(f(x))`.

```rust
fn composer<A, B, C>(f: impl Fn(A) -> B, g: impl Fn(B) -> C) -> impl Fn(A) -> C {
    move |x| g(f(x))
}

let est_long = composer(|mot: &str| mot.chars().count(), |n: usize| n >= 5);
assert!(est_long("pomme"));
assert!(!est_long("kiwi"));
```

`A`, `B` et `C` sont des types génériques : `composer` marche pour tous les types, à condition que la sortie de `f` (de type `B`) soit l'entrée de `g`. Un gros programme fonctionnel, c'est beaucoup de petites fonctions pures composées entre elles. Une chaîne d'itérateurs, c'est d'ailleurs exactement ça.

Pas à pas pour `est_long("pomme")` : on applique d'abord `f`, le comptage des lettres : `"pomme"` en a `5`. Ce `5` devient l'entrée de `g` : `5 >= 5`, donc `true`. Pour `"kiwi"` : `f` donne `4`, puis `g` calcule `4 >= 5`, donc `false`.

> [!warning] L'ordre compte
> `composer(f, g)` fait `f` **puis** `g`, c'est-à-dire `g(f(x))`. Avec « ajouter 1 » et « multiplier par 10 » : `composer(ajouter_1, fois_10)(2)` donne `(2 + 1) × 10 = 30`, alors que `composer(fois_10, ajouter_1)(2)` donne `2 × 10 + 1 = 21`.

**À retenir :** composer, c'est renvoyer `move |x| g(f(x))` : la sortie de la première fonction devient l'entrée de la seconde.

## 3. Les itérateurs, plus loin

### `fold` : la méthode à tout faire

`fold(depart, |acc, x| ...)` parcourt les éléments en transportant un **accumulateur** (`acc`) : la valeur construite jusque-là. Pour chaque élément, la closure renvoie le nouvel accumulateur. À la fin, `fold` renvoie le dernier.

```rust
let nombres = [3, 8, 5];
let plus_grand = nombres.iter().fold(0, |acc, &x| acc.max(x));
assert_eq!(plus_grand, 8);
```

| Étape | `acc` avant | `x` | `acc` après |
|---|---|---|---|
| départ | | | `0` |
| 1 | `0` | `3` | `3` |
| 2 | `3` | `8` | `8` |
| 3 | `8` | `5` | `8` |

L'accumulateur peut être de n'importe quel type : un `String`, un `Vec`, un dictionnaire... ou un **tuple**, pour calculer plusieurs choses en un seul passage :

```rust
let temperatures = [14, -2, 9, 21, 5];
let (minimum, maximum) = temperatures
    .iter()
    .fold((i32::MAX, i32::MIN), |(min, max), &t| (min.min(t), max.max(t)));
assert_eq!((minimum, maximum), (-2, 21));
```

La closure reçoit le tuple déjà découpé (`|(min, max), &t|`) et renvoie un **nouveau** tuple :

| `t` | `(min, max)` avant | `(min, max)` après |
|---|---|---|
| départ | | `(i32::MAX, i32::MIN)` |
| `14` | `(MAX, MIN)` | `(14, 14)` |
| `-2` | `(14, 14)` | `(-2, 14)` |
| `9` | `(-2, 14)` | `(-2, 14)` |
| `21` | `(-2, 14)` | `(-2, 21)` |
| `5` | `(-2, 21)` | `(-2, 21)` |

On part de `i32::MAX` pour le minimum (n'importe quelle température sera plus petite) et de `i32::MIN` pour le maximum. Le même principe sert pour une moyenne : l'accumulateur `(somme, combien)` se remplit en un seul passage, puis on divise à la fin. Pour diviser un `f64` par un compteur entier, convertis le compteur : `f64::from(compteur)` pour un `u32`, ou `compteur as f64` pour un `usize`.

**Un texte comme accumulateur.** On part d'un `String` vide et on renvoie à chaque tour un texte un peu plus long :

```rust
let notes = [12, 8, 15];
let bulletin = notes.iter().fold(String::new(), |texte, n| format!("{texte}[{n}]"));
assert_eq!(bulletin, "[12][8][15]");
```

| `n` | `texte` avant | `texte` après |
|---|---|---|
| départ | | `""` |
| `12` | `""` | `"[12]"` |
| `8` | `"[12]"` | `"[12][8]"` |
| `15` | `"[12][8]"` | `"[12][8][15]"` |

**Une `Option` comme accumulateur.** Quand il n'y a peut-être aucune réponse (liste vide, aucun élément qui convient), on part de `None`, et on passe à `Some(...)` dès le premier élément qui compte. Exemple : le plus petit nombre **pair** de la liste.

```rust
fn plus_petit_pair(nombres: &[i32]) -> Option<i32> {
    nombres.iter().fold(None, |trouve, &x| {
        if x % 2 != 0 {
            trouve
        } else {
            match trouve {
                None => Some(x),
                Some(m) => Some(m.min(x)),
            }
        }
    })
}

assert_eq!(plus_petit_pair(&[7, 10, 3, 4, 8]), Some(4));
assert_eq!(plus_petit_pair(&[1, 3]), None);
assert_eq!(plus_petit_pair(&[]), None);
```

| `x` | `trouve` avant | Ce qui se passe | `trouve` après |
|---|---|---|---|
| départ | | | `None` |
| `7` | `None` | impair : on ne change rien | `None` |
| `10` | `None` | premier pair : on le prend | `Some(10)` |
| `3` | `Some(10)` | impair | `Some(10)` |
| `4` | `Some(10)` | `10.min(4) = 4` | `Some(4)` |
| `8` | `Some(4)` | `4.min(8) = 4` | `Some(4)` |

> [!tip] Bien choisir la valeur de départ
> La valeur de départ, c'est **le résultat pour une liste vide** : `0` pour une somme, `1` pour un produit, `String::new()` pour un texte, `Vec::new()` pour une liste, `None` quand une liste vide n'a pas de réponse.

**À retenir :** `fold(depart, |acc, x| nouvel_acc)` : écris la valeur de départ (le résultat pour une liste vide), puis la règle qui passe de l'ancien accumulateur au nouveau ; vérifie avec un petit tableau tour par tour.

> [!tip] `sum`, `count`, `max`... sont des `fold`
> Tous les consommateurs du chapitre 9 peuvent s'écrire avec `fold`. Mais quand une méthode toute faite existe, utilise-la : `sum()` se lit mieux que `fold(0, |a, x| a + x)`, et clippy te le rappellera.

`reduce` ressemble à `fold`, mais **sans valeur de départ** : c'est le premier élément qui sert d'accumulateur. Il renvoie une `Option`, car une liste vide n'a pas de premier élément.

```rust
let fruits = ["kiwi", "banane", "figue"];
let plus_long = fruits.into_iter().reduce(|a, b| if b.len() > a.len() { b } else { a });
assert_eq!(plus_long, Some("banane"));

let aucun: [&str; 0] = [];
assert_eq!(aucun.into_iter().reduce(|a, _| a), None);
```

Pas à pas : l'accumulateur `a` commence à `"kiwi"` (le premier élément, qui n'est pas repassé à la closure). `"banane"` (6 lettres) est plus long que `"kiwi"` (4) : `a` devient `"banane"`. `"figue"` (5) n'est pas plus long que `"banane"` : `a` reste `"banane"`. Résultat : `Some("banane")`.

**À retenir :** `reduce` = `fold` dont le départ est le premier élément ; il renvoie `None` sur une liste vide.

### `scan` : garder chaque étape

`fold` ne donne que le résultat final. `scan` donne **tous les résultats intermédiaires**, sous la forme d'un nouvel itérateur. Sa closure reçoit l'état en `&mut` et renvoie `Some(valeur à produire)`, ou `None` pour arrêter la suite.

```rust
let kilometres_par_jour = [12, 8, 15, 10];
let total_chaque_soir: Vec<u32> = kilometres_par_jour
    .iter()
    .scan(0, |total, &km| {
        *total += km;
        Some(*total)
    })
    .collect();
assert_eq!(total_chaque_soir, vec![12, 20, 35, 45]);
```

| `km` | `*total` avant | `*total += km` | Élément produit |
|---|---|---|---|
| départ | `0` | | |
| `12` | `0` | `12` | `12` |
| `8` | `12` | `20` | `20` |
| `15` | `20` | `35` | `35` |
| `10` | `35` | `45` | `45` |

Il y a autant d'éléments produits que d'éléments lus (4), et la valeur de départ `0` n'est **pas** produite. L'étoile de `*total` est nécessaire : `total` est une référence `&mut` vers l'état, `*total` est l'état lui-même.

**`scan` puis `take_while` : s'arrêter selon le cumul.** On calcule d'abord tous les cumuls, puis on les garde tant qu'ils respectent une limite. Exemple : la durée d'une playlist (en minutes) au fil des chansons, en s'arrêtant avant de dépasser 10 minutes.

```rust
let durees = [3, 4, 2, 5, 1];
let cumuls: Vec<u32> = durees
    .iter()
    .scan(0, |total, &d| {
        *total += d;
        Some(*total)
    })
    .take_while(|&cumul| cumul <= 10)
    .collect();
assert_eq!(cumuls, vec![3, 7, 9]);
```

`scan` produit `3, 7, 9, 14, 15`. `take_while` garde `3`, `7`, `9`, puis voit `14 > 10` et s'arrête pour de bon : le `15` n'est jamais regardé.

**À retenir :** `scan(depart, |etat, x| { *etat = …; Some(…) })` produit l'état après **chaque** élément ; `fold` n'en donne que le dernier.

> [!info] Un `&mut` dans du code fonctionnel ?
> L'état de `scan` est modifié, mais il appartient à l'itérateur : personne d'autre ne le voit. Vue de l'extérieur, la chaîne reste pure.

### `take_while` et `skip_while`

- `take_while(condition)` garde les éléments **tant que** la condition est vraie, puis s'arrête pour de bon.
- `skip_while(condition)` saute les éléments tant que la condition est vraie, puis garde **tout** le reste.

```rust
let temperatures = [12, 15, 19, 23, 18, 25];

let debut_frais: Vec<i32> = temperatures.iter().copied().take_while(|&t| t < 20).collect();
let a_partir_du_chaud: Vec<i32> = temperatures.iter().copied().skip_while(|&t| t < 20).collect();
let toutes_les_fraiches: Vec<i32> = temperatures.iter().copied().filter(|&t| t < 20).collect();

assert_eq!(debut_frais, vec![12, 15, 19]);
assert_eq!(a_partir_du_chaud, vec![23, 18, 25]);
assert_eq!(toutes_les_fraiches, vec![12, 15, 19, 18]);
```

> [!warning] `take_while` n'est pas `filter`
> `filter` regarde **tous** les éléments. `take_while` s'arrête au premier qui ne passe pas : le `18` n'est pas gardé, car le `23` a déjà tout arrêté. C'est justement ce qui permet d'utiliser `take_while` sur une suite **infinie**.

| Température | `t < 20` ? | `take_while` | `skip_while` | `filter` |
|---|---|---|---|---|
| `12` | oui | gardée | sautée | gardée |
| `15` | oui | gardée | sautée | gardée |
| `19` | oui | gardée | sautée | gardée |
| `23` | **non** | **arrêt** | gardée (on ne saute plus) | jetée |
| `18` | oui | (jamais lue) | gardée | gardée |
| `25` | non | (jamais lue) | gardée | jetée |

**À retenir :** `take_while` = « le début, jusqu'au premier qui échoue (exclu) » ; `skip_while` = « tout à partir du premier qui échoue (inclus) » ; `filter` = « tous ceux qui passent, où qu'ils soient ».

### `filter_map`, `flat_map` et `flatten`

`filter_map(f)` : la closure renvoie une `Option` ; on garde ce qu'il y a dans les `Some` et on jette les `None`. C'est un `map` et un `filter` en une seule étape.

```rust
let code = "a1b2c3d";
let chiffres: Vec<u32> = code.chars().filter_map(|c| c.to_digit(10)).collect();
assert_eq!(chiffres, vec![1, 2, 3]);
```

| Caractère | `to_digit(10)` | Gardé ? |
|---|---|---|
| `a` | `None` | non |
| `1` | `Some(1)` | oui : `1` |
| `b` | `None` | non |
| `2` | `Some(2)` | oui : `2` |
| `c` | `None` | non |
| `3` | `Some(3)` | oui : `3` |
| `d` | `None` | non |

La closure peut être une petite chaîne d'`Option`. Exemple : dans des réglages `nom=valeur`, garder les valeurs, en ignorant les lignes sans `=` et celles où rien ne suit le `=` :

```rust
let reglages = ["son=fort", "langue", "theme=", "police=grande"];
let valeurs: Vec<&str> = reglages
    .iter()
    .filter_map(|ligne| ligne.split_once('=').map(|(_, v)| v).filter(|v| !v.is_empty()))
    .collect();
assert_eq!(valeurs, vec!["fort", "grande"]);
```

| Ligne | `split_once('=')` | `.map(\|(_, v)\| v)` | `.filter(non vide)` |
|---|---|---|---|
| `"son=fort"` | `Some(("son", "fort"))` | `Some("fort")` | `Some("fort")` : gardé |
| `"langue"` | `None` | `None` | `None` : jeté |
| `"theme="` | `Some(("theme", ""))` | `Some("")` | `None` : jeté |
| `"police=grande"` | `Some(("police", "grande"))` | `Some("grande")` | `Some("grande")` : gardé |

`split_once(c)` coupe le texte au **premier** `c` et renvoie `Some((avant, après))`, ou `None` s'il n'y a pas de `c`.

`flat_map(f)` : la closure renvoie **plusieurs** éléments (un itérateur, un `Vec`...) pour chaque élément, et tout est mis bout à bout dans une seule suite. `flatten()` aplatit directement une suite de suites.

```rust
let repetes: Vec<u32> = (1..=3).flat_map(|n| std::iter::repeat_n(n, n as usize)).collect();
assert_eq!(repetes, vec![1, 2, 2, 3, 3, 3]);

let tableau = vec![vec![1, 2], vec![], vec![3]];
let a_plat: Vec<i32> = tableau.into_iter().flatten().collect();
assert_eq!(a_plat, vec![1, 2, 3]);
```

| Méthode | La closure renvoie | Pour chaque élément, on obtient |
|---|---|---|
| `map` | une valeur | exactement 1 élément |
| `filter_map` | une `Option` | 0 ou 1 élément |
| `flat_map` | un itérateur | 0, 1 ou plusieurs éléments |

> [!tip] Deux boucles imbriquées
> `flat_map` remplace une boucle dans une boucle. Toutes les combinaisons de deux listes : `a.iter().flat_map(|x| b.iter().map(move |y| (x, y)))`. Le `move` donne à la closure intérieure sa propre copie de `x`.

Pas à pas pour `repetes` : `1` donne `[1]`, `2` donne `[2, 2]`, `3` donne `[3, 3, 3]`. `flat_map` les met bout à bout : `[1, 2, 2, 3, 3, 3]`. Avec un simple `map`, on aurait obtenu une suite de **suites** (trois morceaux séparés), pas une liste à plat.

**Exemple : couper chaque ligne en morceaux.** La closure renvoie l'itérateur `split(',')`, et `flat_map` met tous les morceaux dans une seule suite :

```rust
let lignes = ["rouge,vert", "bleu", "jaune,noir,blanc"];
let couleurs: Vec<String> = lignes.iter().flat_map(|l| l.split(',')).map(str::to_uppercase).collect();
assert_eq!(couleurs, vec!["ROUGE", "VERT", "BLEU", "JAUNE", "NOIR", "BLANC"]);
```

**Exemple : deux boucles imbriquées.** Toutes les tailles de t-shirt pour chaque couleur :

```rust
let couleurs = ["noir", "blanc"];
let tailles = ["S", "M", "L"];
let modeles: Vec<String> = couleurs
    .iter()
    .flat_map(|couleur| tailles.iter().map(move |taille| format!("{couleur}-{taille}")))
    .collect();
assert_eq!(modeles, vec!["noir-S", "noir-M", "noir-L", "blanc-S", "blanc-M", "blanc-L"]);
```

| Couleur (boucle extérieure) | Ce que renvoie la closure (boucle intérieure) |
|---|---|
| `"noir"` | `"noir-S"`, `"noir-M"`, `"noir-L"` |
| `"blanc"` | `"blanc-S"`, `"blanc-M"`, `"blanc-L"` |

L'ordre est celui de deux `for` imbriqués : la première couleur avec toutes les tailles, puis la suivante. Sans le `move`, le compilateur refuse (erreur E0373) : la closure intérieure emprunterait `couleur`, une variable de la closure extérieure qui disparaît avant que la suite soit lue.

**Les paires d'une même liste, sans doublon.** Pour associer chaque élément seulement à ceux qui sont **après** lui (comme `for j in (i + 1)..n`), on prend son indice avec `enumerate`, puis la tranche qui le suit, `&liste[i + 1..]`. Exemple : tous les matchs d'un petit tournoi où chaque équipe joue une fois contre chaque autre.

```rust
let equipes = ["A", "B", "C", "D"];
let matchs: Vec<(&str, &str)> = equipes
    .iter()
    .enumerate()
    .flat_map(|(i, &e1)| equipes[i + 1..].iter().map(move |&e2| (e1, e2)))
    .collect();
assert_eq!(matchs, vec![("A", "B"), ("A", "C"), ("A", "D"), ("B", "C"), ("B", "D"), ("C", "D")]);
```

| `i` | `e1` | `equipes[i + 1..]` | Paires produites |
|---|---|---|---|
| 0 | `"A"` | `["B", "C", "D"]` | `(A, B)`, `(A, C)`, `(A, D)` |
| 1 | `"B"` | `["C", "D"]` | `(B, C)`, `(B, D)` |
| 2 | `"C"` | `["D"]` | `(C, D)` |
| 3 | `"D"` | `[]` | aucune |

Pour ne garder que certaines paires, il suffit d'ajouter un `filter` après le `flat_map`.

**À retenir :** une valeur par élément → `map` ; 0 ou 1 → `filter_map` ; plusieurs → `flat_map` (et `move` dans la closure intérieure quand elle utilise une variable de l'extérieure).

### `chain`, `rev` et `step_by`

```rust
let matin = [8, 9, 10];
let soir = [18, 19];
let heures: Vec<i32> = matin.iter().chain(soir.iter()).copied().collect();
assert_eq!(heures, vec![8, 9, 10, 18, 19]);

let decompte: Vec<u32> = (1..=5).rev().collect();
assert_eq!(decompte, vec![5, 4, 3, 2, 1]);

let un_sur_trois: Vec<u32> = (0..10).step_by(3).collect();
assert_eq!(un_sur_trois, vec![0, 3, 6, 9]);
```

- `chain` met deux itérateurs bout à bout.
- `rev` parcourt à l'envers.
- `step_by(n)` garde le premier élément, puis un élément tous les `n`.

Pas à pas pour `(0..10).step_by(3)` : on garde `0`, on saute deux éléments (`1`, `2`), on garde `3`, on saute `4` et `5`, on garde `6`, puis `9`. Le suivant serait `12`, qui n'est plus dans `0..10`.

**À retenir :** `chain` = bout à bout, `rev` = à l'envers, `step_by(n)` = un sur `n` en commençant par le premier.

### Chercher : `find`, `position`, `any`, `all`, `enumerate`

Ces consommateurs remplacent les boucles qui s'arrêtent avec un `break` ou un `return` dès qu'elles ont trouvé :

| Méthode | Renvoie | S'arrête |
|---|---|---|
| `find(condition)` | `Some(premier élément qui passe)`, ou `None` | au premier trouvé |
| `position(condition)` | `Some(indice du premier qui passe)`, ou `None` | au premier trouvé |
| `any(condition)` | `true` si au moins un passe | au premier qui passe |
| `all(condition)` | `true` si tous passent (et `true` pour une liste vide) | au premier qui échoue |
| `enumerate()` | une suite de paires `(indice, élément)`, indices à partir de 0 | ne consomme rien : c'est un adaptateur |

```rust
let ages = [15, 17, 21, 16, 30];

assert_eq!(ages.iter().find(|&&a| a >= 18), Some(&21));
assert_eq!(ages.iter().position(|&a| a >= 18), Some(2));
assert_eq!(ages.iter().position(|&a| a > 99), None);
assert!(ages.iter().any(|&a| a >= 18));
assert!(!ages.iter().all(|&a| a >= 18));

let premier_majeur = ages.iter().enumerate().find(|&(_, &a)| a >= 18);
assert_eq!(premier_majeur, Some((2, &21)));
```

Pas à pas pour `position(|&a| a >= 18)` : indice 0, `15 >= 18` faux ; indice 1, `17 >= 18` faux ; indice 2, `21 >= 18` **vrai** : on renvoie `Some(2)` et on ne lit même pas `16` ni `30`. Attention : `position` donne l'**indice** (`2`), `find` donne l'**élément** (`21`, sous forme de référence `&21` car `iter()` donne des références).

**À retenir :** « le premier qui… » → `find` (l'élément) ou `position` (son indice) ; « est-ce qu'il y en a un » → `any` ; « est-ce que tous » → `all`.

### `windows` et `chunks` : plusieurs éléments à la fois

Ces deux méthodes s'utilisent sur une **tranche** (un tableau, un `Vec`) et donnent des morceaux de cette tranche.

| Appel sur `[a, b, c, d, e]` | Morceaux obtenus |
|---|---|
| `windows(2)` | `[a, b]`, `[b, c]`, `[c, d]`, `[d, e]` : une fenêtre qui glisse d'une case à la fois |
| `chunks(2)` | `[a, b]`, `[c, d]`, `[e]` : des paquets séparés, le dernier peut être plus court |

```rust
let mesures = [10, 12, 11, 15, 20];

let variations: Vec<i32> = mesures.windows(2).map(|w| w[1] - w[0]).collect();
assert_eq!(variations, vec![2, -1, 4, 5]);

let par_paquets: Vec<i32> = mesures.chunks(2).map(|paquet| paquet.iter().sum()).collect();
assert_eq!(par_paquets, vec![22, 26, 20]);
```

`windows(2)` remplace la variable « élément précédent » qu'on trouve souvent dans les boucles.

| Fenêtre `w` | `w[1] - w[0]` |
|---|---|
| `[10, 12]` | `2` |
| `[12, 11]` | `-1` |
| `[11, 15]` | `4` |
| `[15, 20]` | `5` |

Une liste de `n` éléments donne `n - 1` fenêtres de 2 : avec **un seul** élément (ou aucun), il n'y a **aucune** fenêtre. C'est important quand on cherche ensuite le plus grand écart : `max()` renvoie alors `None`, et il faut prévoir une valeur par défaut.

```rust
let altitudes = [300, 280, 250];
let plus_forte_montee = altitudes.windows(2).map(|w| w[1] - w[0]).max();
assert_eq!(plus_forte_montee, Some(-20));

let une_seule = [300];
assert_eq!(une_seule.windows(2).map(|w| w[1] - w[0]).max(), None);
assert_eq!(une_seule.windows(2).map(|w| w[1] - w[0]).max().unwrap_or(0), 0);
```

Ici, les deux variations sont `-20` et `-30` : la plus grande est `-20`, une « montée » négative (on ne fait que descendre). Si l'énoncé veut un plancher (par exemple « 0 s'il n'y a aucune montée »), il faut l'imposer toi-même : un `fold` qui part de ce plancher, ou un `max` suivi d'un `unwrap_or` puis d'une comparaison avec le plancher.

**À retenir :** `windows(2)` pour comparer chaque élément à son voisin (`n - 1` fenêtres) ; `chunks(k)` pour des paquets séparés (le dernier peut être plus court).

### `partition`, `min_by_key` et `max_by`

`partition` sépare les éléments en deux collections d'un coup : ceux qui vérifient la condition, et les autres.

```rust
let notes = [12, 7, 15, 9, 18];
let (recus, recales): (Vec<i32>, Vec<i32>) = notes.into_iter().partition(|&n| n >= 10);
assert_eq!(recus, vec![12, 15, 18]);
assert_eq!(recales, vec![7, 9]);
```

Pour trouver le plus petit ou le plus grand **selon un critère** :

| Méthode | Compare les éléments avec |
|---|---|
| `min_by_key(\|x\| cle)` / `max_by_key(\|x\| cle)` | une clé calculée pour chaque élément |
| `min_by(\|a, b\| ...)` / `max_by(\|a, b\| ...)` | une fonction de comparaison qui renvoie un `Ordering` (plus petit, égal, plus grand) |

```rust
let villes = [("Lyon", 522), ("Paris", 2_103), ("Nice", 342)];
let plus_peuplee = villes.iter().max_by_key(|(_, habitants)| *habitants);
assert_eq!(plus_peuplee, Some(&("Paris", 2_103)));

let releves = [("lundi", 12.5_f64), ("mardi", 17.0), ("mercredi", 9.5)];
let plus_chaud = releves.iter().max_by(|a, b| a.1.total_cmp(&b.1));
assert_eq!(plus_chaud, Some(&("mardi", 17.0)));
```

> [!warning] Les `f64` et `max_by_key`
> `max_by_key` exige une clé qu'on peut toujours comparer (le trait `Ord`). Les `f64` ne le peuvent pas, à cause de la valeur spéciale `NaN` (« pas un nombre »). Avec des décimaux, utilise `max_by` et `total_cmp`.

> [!info] En cas d'égalité
> `max_by_key` et `max_by` renvoient le **dernier** des éléments à égalité ; `min_by_key` et `min_by` renvoient le **premier**.

**Exemple : le plus grand, mais le premier en cas d'égalité.** `std::cmp::Reverse(x)` enveloppe une valeur et **inverse** l'ordre : `Reverse(5) < Reverse(3)`. Le plus **petit** `Reverse(score)` est donc le plus **grand** score, et `min_by_key` garde le premier en cas d'égalité :

```rust
use std::cmp::Reverse;

let scores = [("Ana", 12), ("Léo", 15), ("Mia", 15), ("Zoé", 9)];

let avec_max = scores.iter().max_by_key(|&&(_, s)| s);
let avec_reverse = scores.iter().min_by_key(|&&(_, s)| Reverse(s));

assert_eq!(avec_max, Some(&("Mia", 15)));
assert_eq!(avec_reverse, Some(&("Léo", 15)));
```

| Élément | Score | `Reverse(score)` |
|---|---|---|
| Ana | 12 | `Reverse(12)` |
| Léo | 15 | `Reverse(15)` : le plus petit, rencontré en premier |
| Mia | 15 | `Reverse(15)` : à égalité, mais arrive après |
| Zoé | 9 | `Reverse(9)` : le plus grand |

`max_by_key` donne Mia (la **dernière** à 15), `min_by_key` avec `Reverse` donne Léo (la **première** à 15). Autre solution : `max_by` avec un second critère, comme `a.1.cmp(&b.1).then_with(|| b.0.cmp(a.0))` (à score égal, le nom le plus petit dans l'alphabet est considéré comme le plus grand).

**À retenir :** `partition` coupe en deux listes ; `min_by_key` / `max_by_key` comparent une clé ; pour départager les égalités, choisis entre `max` (le dernier), `min` + `Reverse` (le premier), ou un second critère avec `then_with`.

### `collect` : choisir ce qu'on fabrique

`collect` sait fabriquer beaucoup de types : c'est le type demandé qui décide.

| Type demandé | Les éléments doivent être | Résultat |
|---|---|---|
| `Vec<T>` | des `T` | une liste |
| `String` | des `char` ou des `&str` | un texte |
| `HashMap<K, V>` ou `BTreeMap<K, V>` | des paires `(clé, valeur)` | un dictionnaire |
| `HashSet<T>` ou `BTreeSet<T>` | des `T` | un ensemble, sans doublons |
| `Result<Vec<T>, E>` | des `Result<T, E>` | `Ok(liste)` si tout est `Ok`, sinon la **première** erreur |
| `Option<Vec<T>>` | des `Option<T>` | `Some(liste)` si tout est `Some`, sinon `None` |

```rust
use std::collections::{BTreeSet, HashMap};

let sigle: String = ["Rust", "est", "génial"].iter().filter_map(|mot| mot.chars().next()).collect();
assert_eq!(sigle, "Reg");

let ages: HashMap<&str, u32> = [("Ana", 20), ("Léo", 19)].into_iter().collect();
assert_eq!(ages["Léo"], 19);

let lettres: BTreeSet<char> = "abracadabra".chars().collect();
assert_eq!(lettres.into_iter().collect::<String>(), "abcdr");

let tous_bons: Result<Vec<i32>, _> = ["1", "2", "3"].iter().map(|s| s.parse::<i32>()).collect();
assert_eq!(tous_bons, Ok(vec![1, 2, 3]));

let un_mauvais: Result<Vec<i32>, _> = ["1", "x", "3"].iter().map(|s| s.parse::<i32>()).collect();
assert!(un_mauvais.is_err());
```

> [!tip] `BTreeMap` et `BTreeSet`
> Ils s'utilisent comme `HashMap` et `HashSet`, mais rangent leurs clés **dans l'ordre** (alphabétique, croissant). Pratique pour afficher ou tester un résultat : l'ordre est toujours le même.

Pas à pas pour `tous_bons` et `un_mauvais` : `map` transforme chaque texte en `Result`. Pour `["1", "2", "3"]` on obtient `Ok(1)`, `Ok(2)`, `Ok(3)` : tout est `Ok`, donc `collect` rend `Ok(vec![1, 2, 3])`. Pour `["1", "x", "3"]` : `Ok(1)`, puis `Err(...)` sur `"x"` : `collect` s'arrête là et rend cette erreur ; le `"3"` n'est même pas lu. On n'obtient **jamais** une liste partielle comme `[1, 3]`.

**À retenir :** c'est le type écrit à gauche (ou dans `collect::<…>()`) qui choisit ce que `collect` fabrique ; vers `Result<Vec<_>, _>`, une seule erreur suffit à tout faire échouer.

### Compter et regrouper

Pour construire un dictionnaire pas à pas, on le donne comme accumulateur à un `fold` :

```rust
use std::collections::BTreeMap;

let mots = ["pomme", "kiwi", "poire", "kaki", "prune"];
let par_initiale: BTreeMap<char, Vec<&str>> = mots.iter().fold(BTreeMap::new(), |mut groupes, mot| {
    let initiale = mot.chars().next().unwrap_or(' ');
    groupes.entry(initiale).or_default().push(*mot);
    groupes
});

assert_eq!(par_initiale[&'k'], vec!["kiwi", "kaki"]);
assert_eq!(par_initiale[&'p'], vec!["pomme", "poire", "prune"]);
```

`entry(cle).or_default()` donne la valeur rangée sous cette clé, après l'avoir créée vide (ici un `Vec` vide) si elle n'existait pas.

> [!info] Un `mut` dans un `fold`
> `groupes` est modifié, mais il a été **donné** au `fold` : c'est une valeur que personne d'autre ne voit. On la modifie, puis on la rend pour l'étape suivante. Le code qui utilise ce `fold` reste pur.

**Additionner par groupe.** Pour un total par clé, on crée la case à `0` si elle n'existe pas (`or_insert(0)`), puis on lui ajoute le montant. `or_insert` renvoie une référence `&mut` vers la case : l'étoile `*` permet de modifier le nombre qu'elle contient.

```rust
use std::collections::BTreeMap;

let seances = [("maths", 2), ("rust", 3), ("maths", 1), ("anglais", 2), ("rust", 4)];
let heures: BTreeMap<&str, u32> = seances.iter().fold(BTreeMap::new(), |mut totaux, &(matiere, h)| {
    *totaux.entry(matiere).or_insert(0) += h;
    totaux
});

assert_eq!(heures, BTreeMap::from([("anglais", 2), ("maths", 3), ("rust", 7)]));
```

| Séance | Case avant | Case après | Dictionnaire après |
|---|---|---|---|
| `("maths", 2)` | absente → créée à `0` | `2` | `{maths: 2}` |
| `("rust", 3)` | absente → `0` | `3` | `{maths: 2, rust: 3}` |
| `("maths", 1)` | `2` | `3` | `{maths: 3, rust: 3}` |
| `("anglais", 2)` | absente → `0` | `2` | `{anglais: 2, maths: 3, rust: 3}` |
| `("rust", 4)` | `3` | `7` | `{anglais: 2, maths: 3, rust: 7}` |

Pour compter (au lieu d'additionner), on ajoute `1` à la place du montant. Et si la clé doit pouvoir changer (regrouper par client, par catégorie...), on peut la recevoir en paramètre sous forme de fonction (`cle: impl Fn(&T) -> K`, comme à la partie 2) et écrire `entry(cle(element))`.

**À retenir :** total par clé = `fold(BTreeMap::new(), |mut m, x| { *m.entry(cle).or_insert(0) += valeur; m })` ; liste par clé = `entry(cle).or_default().push(x)`.

## 4. Option et Result en chaîne

Plutôt que d'écrire un `match` ou un `if let` à chaque étape, on **enchaîne** des méthodes. Tant que tout va bien, la valeur avance d'étape en étape. Au premier `None` (ou `Err`), toutes les étapes suivantes sont sautées, et le `None` (ou l'`Err`) arrive tel quel au bout de la chaîne.

| Méthode | Sur `Some(x)` / `Ok(x)` | Sur `None` / `Err(e)` |
|---|---|---|
| `map(f)` | `Some(f(x))` / `Ok(f(x))` | rien ne change |
| `and_then(f)`, où `f` renvoie une `Option` (ou un `Result`) | `f(x)` | rien ne change |
| `filter(condition)` (Option) | `Some(x)` si la condition est vraie, sinon `None` | `None` |
| `ok_or(e)` / `ok_or_else(\|\| e)` (Option → Result) | `Ok(x)` | `Err(e)` |
| `ok()` (Result → Option) | `Some(x)` | `None` |
| `map_err(f)` (Result) | `Ok(x)` | `Err(f(e))` |
| `unwrap_or(v)` / `unwrap_or_else(\|\| v)` | `x` | `v` |
| `map_or(v, f)` | `f(x)` | `v` |

```rust
fn age_majeur(texte: &str) -> Option<u32> {
    texte.trim().parse::<u32>().ok().filter(|&age| age >= 18)
}

assert_eq!(age_majeur(" 25 "), Some(25));
assert_eq!(age_majeur("12"), None);
assert_eq!(age_majeur("douze"), None);
```

| Texte | `trim()` | `parse::<u32>()` | `.ok()` | `.filter(age >= 18)` |
|---|---|---|---|---|
| `" 25 "` | `"25"` | `Ok(25)` | `Some(25)` | `Some(25)` |
| `"12"` | `"12"` | `Ok(12)` | `Some(12)` | `None` (12 < 18) |
| `"douze"` | `"douze"` | `Err(...)` | `None` | `None` (sauté) |

Pour `"douze"`, le `None` apparaît à l'étape `ok()` : le `filter` ne regarde même pas, il laisse passer le `None`.

**`map` ou `and_then` ?** Si la fonction donnée renvoie elle-même une `Option`, `map` l'emballe deux fois. `and_then` évite cette double boîte :

```rust
let premier_mot = "7 nains".split_whitespace().next();

let avec_map: Option<Option<u32>> = premier_mot.map(|mot| mot.parse().ok());
let avec_and_then: Option<u32> = premier_mot.and_then(|mot| mot.parse().ok());

assert_eq!(avec_map, Some(Some(7)));
assert_eq!(avec_and_then, Some(7));
```

Avec `Result`, l'opérateur `?` rend la chaîne encore plus lisible : sur un `Err`, la fonction s'arrête et renvoie l'erreur ; sur un `Ok(x)`, il donne simplement `x`.

```rust
fn lire_prix(ligne: &str) -> Result<f64, String> {
    let (article, prix) = ligne
        .split_once('=')
        .ok_or_else(|| format!("il manque « = » dans « {ligne} »"))?;
    prix.trim()
        .parse::<f64>()
        .map_err(|_| format!("prix illisible pour {}", article.trim()))
}

assert_eq!(lire_prix("pain = 1.20"), Ok(1.2));
assert_eq!(lire_prix("pain"), Err("il manque « = » dans « pain »".to_string()));
assert_eq!(lire_prix("pain = cher"), Err("prix illisible pour pain".to_string()));
```

| Ligne | `split_once('=')` | `ok_or_else(...)?` | `parse` puis `map_err` | Résultat |
|---|---|---|---|---|
| `"pain = 1.20"` | `Some(("pain ", " 1.20"))` | continue avec les deux morceaux | `Ok(1.2)` | `Ok(1.2)` |
| `"pain"` | `None` | `Err("il manque…")` : **sortie** de la fonction | (pas fait) | `Err("il manque…")` |
| `"pain = cher"` | `Some(("pain ", " cher"))` | continue | `Err(...)` devient `Err("prix illisible…")` | `Err("prix illisible pour pain")` |

Les vérifications se font **dans l'ordre** des lignes : c'est la première qui échoue qui donne l'erreur.

**Vérifier une condition au milieu d'une chaîne.** Pour transformer « la valeur ne convient pas » en erreur, une astuce : mettre la valeur dans un `Some`, la filtrer, puis `ok_or`. Le type d'erreur peut être un `enum` à soi, ce qui évite de comparer des textes :

```rust
#[derive(Debug, PartialEq)]
enum ErreurCode {
    Vide,
    PasQueDesChiffres,
}

fn lire_code(texte: &str) -> Result<u32, ErreurCode> {
    let code = Some(texte.trim()).filter(|t| !t.is_empty()).ok_or(ErreurCode::Vide)?;
    code.parse().map_err(|_| ErreurCode::PasQueDesChiffres)
}

assert_eq!(lire_code(" 75001 "), Ok(75001));
assert_eq!(lire_code("   "), Err(ErreurCode::Vide));
assert_eq!(lire_code("75A01"), Err(ErreurCode::PasQueDesChiffres));

let lignes = ["13001", "", "abc", "69002"];
let valides: Vec<u32> = lignes.iter().filter_map(|l| lire_code(l).ok()).collect();
assert_eq!(valides, vec![13001, 69002]);
```

Pas à pas pour `lire_code("   ")` : `trim()` donne `""` ; `Some("")` ne passe pas le `filter` (le texte est vide), on obtient `None` ; `ok_or` le change en `Err(ErreurCode::Vide)` ; le `?` sort de la fonction avec cette erreur. Les deux dernières lignes montrent comment **ignorer** les lignes invalides : `lire_code(l).ok()` change chaque `Err` en `None`, et `filter_map` jette les `None`.

**À retenir :** une chaîne `Option` / `Result` se lit de gauche à droite ; dès qu'un `None` ou un `Err` apparaît, les étapes suivantes sont sautées. `?` sort de la fonction, `ok_or` passe d'`Option` à `Result`, `.ok()` fait l'inverse.

> [!tip] `ok_or` ou `ok_or_else` ?
> `ok_or(valeur)` calcule la valeur d'erreur **à chaque fois**, même quand tout va bien. `ok_or_else(|| ...)` ne la calcule qu'en cas de besoin. Pour une erreur simple (une variante d'enum, un texte fixe), `ok_or` suffit ; pour un `format!`, préfère `ok_or_else`. Même idée pour `unwrap_or` et `unwrap_or_else`.

> [!info] `?` marche aussi avec `Option`
> Dans une fonction qui renvoie une `Option`, `x?` renvoie `None` tout de suite si `x` vaut `None`.

## 5. La récursion

Une fonction **récursive** s'appelle elle-même sur un problème plus petit. Elle a toujours :

1. un **cas de base**, qui s'arrête sans s'appeler (par exemple : la liste vide) ;
2. un **cas récursif**, qui se ramène à un problème plus petit.

Les **motifs de tranche** de `match` découpent une liste très proprement :

```rust
fn somme(liste: &[i32]) -> i32 {
    match liste {
        [] => 0,
        [premier, reste @ ..] => premier + somme(reste),
    }
}

assert_eq!(somme(&[1, 2, 3]), 6);
```

```text
somme([1, 2, 3])
= 1 + somme([2, 3])
= 1 + (2 + somme([3]))
= 1 + (2 + (3 + somme([])))
= 1 + (2 + (3 + 0))
= 6
```

| Motif | Accepte | Variables obtenues |
|---|---|---|
| `[]` | une liste vide | aucune |
| `[x]` | exactement 1 élément | `x` |
| `[a, b]` | exactement 2 éléments | `a` et `b` |
| `[premier, reste @ ..]` | au moins 1 élément | `premier`, et `reste` : la tranche qui suit |
| `[debut @ .., dernier]` | au moins 1 élément | `debut` : la tranche avant, et `dernier` |
| `[premier, .., dernier]` | au moins 2 éléments | `premier` et `dernier` |

`..` veut dire « n'importe combien d'éléments, même zéro », et `nom @ ..` donne un nom à ces éléments. Le compilateur vérifie que tous les cas sont couverts : si tu en oublies un, il refuse de compiler.

```rust
fn decrire(liste: &[&str]) -> String {
    match liste {
        [] => "personne".to_string(),
        [seul] => format!("seulement {seul}"),
        [a, b] => format!("{a} et {b}"),
        [premier, .., dernier] => format!("de {premier} à {dernier} ({} en tout)", liste.len()),
    }
}

assert_eq!(decrire(&[]), "personne");
assert_eq!(decrire(&["Ana"]), "seulement Ana");
assert_eq!(decrire(&["Ana", "Léo"]), "Ana et Léo");
assert_eq!(decrire(&["Ana", "Léo", "Mia", "Zoé"]), "de Ana à Zoé (4 en tout)");
```

Les cas sont essayés **dans l'ordre**. Pour `["Ana", "Léo"]` : `[]` ne va pas (il y a des éléments), `[seul]` non plus (il en faut exactement 1), `[a, b]` oui. Pour 4 éléments, seul le dernier cas convient.

**Regarder deux éléments à la fois : `[a, b, ..]`.** Pour comparer chaque élément à son voisin, le motif `[a, b, ..]` prend les deux premiers ; on recommence ensuite sur la liste **sans son premier élément**, `&liste[1..]`, pour que `b` devienne le nouveau `a`. Exemple : y a-t-il deux nombres égaux côte à côte ?

```rust
fn deux_voisins_egaux(liste: &[i32]) -> bool {
    match liste {
        [a, b, ..] => a == b || deux_voisins_egaux(&liste[1..]),
        _ => false,
    }
}

assert!(deux_voisins_egaux(&[4, 7, 7, 1]));
assert!(!deux_voisins_egaux(&[4, 7, 4]));
assert!(!deux_voisins_egaux(&[]));
```

```text
deux_voisins_egaux([4, 7, 7, 1])
  a = 4, b = 7 : pas égaux → on regarde [7, 7, 1]
deux_voisins_egaux([7, 7, 1])
  a = 7, b = 7 : égaux → true (le || s'arrête là)
```

Le cas `_` attrape les listes de 0 ou 1 élément : il n'y a plus de voisins à comparer, donc `false`. Attention : si on écrivait `&liste[2..]`, on sauterait des paires (on comparerait 4 et 7, puis 7 et 1, et on raterait le 7 et 7).

**Une récursion qui renvoie une `Option`.** Le cas de base de la liste vide renvoie `None` (il n'y a pas de réponse). Exemple : le premier nombre négatif.

```rust
fn premier_negatif(liste: &[i32]) -> Option<i32> {
    match liste {
        [] => None,
        [premier, reste @ ..] => {
            if *premier < 0 {
                Some(*premier)
            } else {
                premier_negatif(reste)
            }
        }
    }
}

assert_eq!(premier_negatif(&[3, -5, -1]), Some(-5));
assert_eq!(premier_negatif(&[3, 8]), None);
```

`premier` est une **référence** vers l'élément (on découpe une tranche `&[i32]`), d'où l'étoile : `*premier`. Pour `[3, 8]` : `3` n'est pas négatif → on cherche dans `[8]` ; `8` non plus → on cherche dans `[]` → `None`. Quand il faut combiner le résultat de l'appel récursif (une `Option`) avec l'élément courant, `map_or(valeur_si_none, |r| …)` est pratique : il donne une valeur dans les deux cas.

**Une récursion qui fabrique une nouvelle liste.** On construit le résultat avec des petits `Vec` mis bout à bout : `[v1, v2].concat()` colle deux listes.

```rust
fn doubler(liste: &[i32]) -> Vec<i32> {
    match liste {
        [] => Vec::new(),
        [premier, reste @ ..] => [vec![premier * 2], doubler(reste)].concat(),
    }
}

assert_eq!(doubler(&[1, 5, 3]), vec![2, 10, 6]);
```

```text
doubler([1, 5, 3]) = [2] + doubler([5, 3])
                   = [2] + ([10] + doubler([3]))
                   = [2] + ([10] + ([6] + doubler([])))
                   = [2] + ([10] + ([6] + []))
                   = [2, 10, 6]
```

La liste reçue n'est pas modifiée : on fabrique une liste neuve. Le motif `[debut @ .., dernier]` permet la même chose en partant de la fin.

**Les gardes `if` dans un `match`.** Un cas peut avoir une condition en plus : `n if condition => ...`. Le cas ne s'applique que si le motif correspond **et** que la condition est vraie. Très utile pour une récursion sur un nombre :

```rust
fn chiffres_binaires(n: u32) -> u32 {
    match n {
        0 | 1 => 1,
        n if n % 2 == 0 => 1 + chiffres_binaires(n / 2),
        n => 1 + chiffres_binaires((n - 1) / 2),
    }
}

assert_eq!(chiffres_binaires(1), 1);
assert_eq!(chiffres_binaires(6), 3);
assert_eq!(chiffres_binaires(13), 4);
```

Pas à pas pour `13` (qui s'écrit `1101` en binaire) : 13 est impair → `1 + f(6)` ; 6 est pair → `1 + f(3)` ; 3 est impair → `1 + f(1)` ; `f(1) = 1`. Total : `1 + 1 + 1 + 1 = 4`. Comme le nombre est **divisé par 2** à chaque appel, il faut très peu d'appels, même pour un nombre énorme : c'est la même idée que l'exponentiation rapide, qui divise l'exposant par 2 au lieu de lui retirer 1. Ce qui compte pour la vitesse, c'est de ne faire **qu'un seul** appel récursif par étape : on range son résultat dans une variable (`let moitie = …;`) et on la réutilise, au lieu d'appeler deux fois la fonction.

**À retenir :** une fonction récursive sur une tranche = un `match` avec le cas vide (ou trop court) d'abord, puis un cas qui traite le début et rappelle la fonction sur le reste (`reste`, `&liste[1..]`, `debut`).

La récursion est l'outil naturel pour les données **elles-mêmes récursives**, comme un arbre : chaque nœud contient d'autres arbres.

```rust
enum Arbre {
    Feuille(i32),
    Noeud(Box<Arbre>, Box<Arbre>),
}

fn total(arbre: &Arbre) -> i32 {
    match arbre {
        Arbre::Feuille(valeur) => *valeur,
        Arbre::Noeud(gauche, droite) => total(gauche) + total(droite),
    }
}

let arbre = Arbre::Noeud(
    Box::new(Arbre::Feuille(4)),
    Box::new(Arbre::Noeud(Box::new(Arbre::Feuille(1)), Box::new(Arbre::Feuille(5)))),
);
assert_eq!(total(&arbre), 10);
```

Le `Box` est obligatoire : sans lui, un `Arbre` contiendrait directement un `Arbre`, qui contiendrait un `Arbre`... et sa taille serait infinie.

> [!warning] La pile n'est pas infinie
> Chaque appel récursif occupe un peu de mémoire (sur la **pile**) jusqu'à ce qu'il se termine. Sur une liste de plusieurs centaines de milliers d'éléments, une fonction récursive peut faire planter le programme (« stack overflow », débordement de pile). Rust ne transforme pas automatiquement la récursion en boucle : pour les très longues listes, préfère un itérateur. La récursion brille sur les arbres et les structures imbriquées, qui sont rarement très profonds.

## 6. La paresse et les itérateurs maison

### Rien ne se passe sans consommateur

Un itérateur est **paresseux** : il ne calcule un élément que lorsqu'on le lui demande. On le voit en ajoutant un affichage dans un `map` :

```rust
let nombres = [1, 2, 3, 4];
let dizaines = nombres.iter().map(|x| {
    println!("je calcule {x} × 10");
    x * 10
});
println!("rien n'est encore calculé");
let deux_premiers: Vec<i32> = dizaines.take(2).collect();
println!("{deux_premiers:?}");
```

```text
rien n'est encore calculé
je calcule 1 × 10
je calcule 2 × 10
[10, 20]
```

Les éléments 3 et 4 ne sont jamais calculés. Grâce à la paresse, on peut décrire des suites **infinies** et n'en prendre que ce qu'il faut :

```rust
let carres_impairs: Vec<u64> = (1..).map(|n| n * n).filter(|c| c % 2 == 1).take(4).collect();
assert_eq!(carres_impairs, vec![1, 9, 25, 49]);
```

```anim
iterateurs
scenarios: paresse, infini
```

> [!warning] Suite infinie + consommateur sans fin = boucle infinie
> `(1..).map(|n| n * n).sum::<u64>()` ne s'arrête jamais (ou plante quand le nombre devient trop grand). Sur une suite infinie, place toujours un `take`, un `take_while`, ou un consommateur qui s'arrête tout seul (`find`, `any`, `position`).

Pas à pas pour `carres_impairs` : `collect` demande un élément ; `(1..)` donne `1`, le carré `1` est impair, `take` le laisse passer (1 sur 4). Puis `2` → `4`, pair, jeté ; `3` → `9`, gardé (2 sur 4) ; `4` → `16`, jeté ; `5` → `25`, gardé (3 sur 4) ; `6` → `36`, jeté ; `7` → `49`, gardé (4 sur 4). `take` a son compte : tout s'arrête, `8` n'est jamais produit.

**À retenir :** une ligne d'adaptateurs (`map`, `filter`, `take`...) ne calcule rien ; c'est le consommateur (`collect`, `sum`, `count`, `find`...) qui fait tourner la chaîne, un élément à la fois.

### Renvoyer un itérateur : `impl Iterator`

```rust
fn multiples_de(n: u32) -> impl Iterator<Item = u32> {
    (1..).map(move |k| k * n)
}

let table_de_7: Vec<u32> = multiples_de(7).take(5).collect();
assert_eq!(table_de_7, vec![7, 14, 21, 28, 35]);
```

La fonction renvoie la recette, pas le résultat : c'est l'appelant qui décide combien d'éléments il veut. Le `move` est là pour la même raison qu'à la partie 2 : la closure garde sa copie de `n`, qui disparaît à la fin de la fonction. Pas à pas : `(1..)` donne `1, 2, 3, 4, 5, ...`, le `map` les change en `7, 14, 21, 28, 35, ...`, et `take(5)` s'arrête après le cinquième.

**À retenir :** `-> impl Iterator<Item = T>` renvoie une suite paresseuse ; rien n'est calculé avant que l'appelant consomme.

### `successors` : chaque élément à partir du précédent

`std::iter::successors(premier, suivant)` part d'une `Option` et calcule chaque élément à partir du précédent. La suite s'arrête quand `suivant` renvoie `None`.

```rust
use std::iter::successors;

let puissances_de_2: Vec<u32> = successors(Some(1), |&x| Some(x * 2)).take_while(|&x| x < 100).collect();
assert_eq!(puissances_de_2, vec![1, 2, 4, 8, 16, 32, 64]);

let divisions: Vec<u32> = successors(Some(1000), |&x| (x >= 10).then_some(x / 10)).collect();
assert_eq!(divisions, vec![1000, 100, 10, 1]);
```

`condition.then_some(valeur)` vaut `Some(valeur)` si la condition est vraie, `None` sinon.

| Élément actuel `x` | `x >= 10` ? | Élément suivant |
|---|---|---|
| `1000` (le premier, donné par `Some(1000)`) | oui | `Some(100)` |
| `100` | oui | `Some(10)` |
| `10` | oui | `Some(1)` |
| `1` | non | `None` : fin de la suite |

Le premier élément fait partie de la suite, et le dernier produit est celui pour lequel la closure a renvoyé `None` (ici `1`).

**La closure peut contenir un `match`.** Exemple : diviser par 3 tant que c'est possible.

```rust
use std::iter::successors;

let divisions_par_3: Vec<u32> = successors(Some(162), |&x| match x % 3 {
    0 => Some(x / 3),
    _ => None,
})
.collect();
assert_eq!(divisions_par_3, vec![162, 54, 18, 6, 2]);
```

162 → 54 → 18 → 6 → 2 ; `2 % 3` vaut `2`, pas `0` : la closure renvoie `None` et la suite s'arrête, avec `2` comme dernier élément.

**Ne pas planter quand le nombre devient trop grand : `checked_mul`.** Chaque type entier a une limite (`u8::MAX = 255`, `u64::MAX` environ 1,8 × 10¹⁹). En mode debug, une multiplication qui dépasse provoque une **panique** (« attempt to multiply with overflow »). `a.checked_mul(b)` renvoie `Some(a × b)` si le résultat tient dans le type, et `None` sinon. C'est exactement ce qu'attend `successors` pour s'arrêter :

```rust
use std::iter::successors;

let puissances_de_10: Vec<u8> = successors(Some(1_u8), |&x| x.checked_mul(10)).collect();
assert_eq!(puissances_de_10, vec![1, 10, 100]);
```

`1 × 10 = 10` tient dans un `u8` ; `10 × 10 = 100` aussi ; `100 × 10 = 1000` dépasse 255 : `checked_mul` renvoie `None`, la suite s'arrête proprement au lieu de planter. Il existe aussi `checked_add`, `checked_sub`, `checked_pow`...

> [!tip] `then_some` ou `then` ?
> `condition.then_some(valeur)` calcule `valeur` **avant** de regarder la condition ; `condition.then(|| valeur)` ne la calcule que si la condition est vraie. Si le calcul peut dépasser la limite ou coûte cher, préfère `then(|| ...)`.

**À retenir :** `successors(Some(premier), |x| …)` = une suite où chaque élément vient du précédent ; renvoyer `None` l'arrête (pratique avec `checked_mul` pour ne jamais dépasser la limite du type).

### `from_fn` : un état caché

`std::iter::from_fn(f)` appelle la closure `f` chaque fois qu'on demande un élément. La closure est `move` : elle garde son propre état, que personne d'autre ne voit. Exemple : un petit générateur de nombres pseudo-aléatoires (la même graine donne toujours la même suite).

```rust
let mut graine: u32 = 42;
let des = std::iter::from_fn(move || {
    graine = graine.wrapping_mul(1_103_515_245).wrapping_add(12_345);
    Some(graine % 6 + 1)
});

let lancers: Vec<u32> = des.take(5).collect();
println!("{lancers:?}");
assert!(lancers.iter().all(|de| (1..=6).contains(de)));
```

`wrapping_mul` et `wrapping_add` « font le tour » au lieu de paniquer quand le résultat dépasse la limite du type.

### Ton propre type d'itérateur

Pour un itérateur réutilisable, avec un nom, on crée une `struct` qui garde l'état, et on implémente le trait `Iterator`. Il n'y a **qu'une seule méthode** à écrire : `next`, qui renvoie `Some(élément suivant)`, ou `None` quand c'est fini.

```rust
struct CompteARebours {
    reste: u32,
}

impl Iterator for CompteARebours {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.reste == 0 {
            None
        } else {
            self.reste -= 1;
            Some(self.reste + 1)
        }
    }
}

let fusee: Vec<u32> = CompteARebours { reste: 3 }.collect();
assert_eq!(fusee, vec![3, 2, 1]);

let total_des_pairs: u32 = CompteARebours { reste: 10 }.filter(|n| n % 2 == 0).sum();
assert_eq!(total_des_pairs, 30);
```

- `type Item = u32;` : le type des éléments produits (un **type associé** au trait).
- `next` prend `&mut self` : l'itérateur avance en modifiant son propre état. C'est sa seule modification, et elle reste cachée à l'intérieur.
- En échange de cette seule méthode, tu obtiens **gratuitement** toutes les autres : `map`, `filter`, `sum`, `take`, `collect`...

Pas à pas pour `CompteARebours { reste: 3 }` : chaque appel à `next` fait un tour du tableau.

| Appel à `next` | `reste` avant | Ce qui se passe | `reste` après | Renvoie |
|---|---|---|---|---|
| 1 | `3` | pas 0 : on retire 1 | `2` | `Some(3)` |
| 2 | `2` | on retire 1 | `1` | `Some(2)` |
| 3 | `1` | on retire 1 | `0` | `Some(1)` |
| 4 | `0` | c'est fini | `0` | `None` |

`collect` appelle `next` jusqu'au premier `None` : on obtient `[3, 2, 1]`.

**Un état à deux champs.** Souvent, `next` doit **renvoyer la valeur actuelle**, puis **préparer la suivante**. La méthode sûre : ranger d'abord la valeur à renvoyer dans une variable, mettre à jour l'état, puis renvoyer la variable. Pour changer deux champs en même temps à partir de leurs anciennes valeurs, on peut affecter un tuple : `(a, b) = (nouveau_a, nouveau_b)` calcule tout le côté droit **avant** de modifier quoi que ce soit. Exemple : les nombres triangulaires (1, 1 + 2, 1 + 2 + 3...), une suite **infinie**.

```rust
struct Triangulaires {
    rang: u64,
    total: u64,
}

impl Triangulaires {
    fn new() -> Self {
        Triangulaires { rang: 1, total: 1 }
    }
}

impl Iterator for Triangulaires {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let valeur = self.total;
        (self.rang, self.total) = (self.rang + 1, self.total + self.rang + 1);
        Some(valeur)
    }
}

let debut: Vec<u64> = Triangulaires::new().take(5).collect();
assert_eq!(debut, vec![1, 3, 6, 10, 15]);

let sous_20: Vec<u64> = Triangulaires::new().take_while(|&t| t < 20).collect();
assert_eq!(sous_20, vec![1, 3, 6, 10, 15]);

let impairs: Vec<u64> = Triangulaires::new().filter(|t| t % 2 == 1).take(3).collect();
assert_eq!(impairs, vec![1, 3, 15]);
```

| Appel | `(rang, total)` avant | Renvoie | `(rang, total)` après |
|---|---|---|---|
| 1 | `(1, 1)` | `Some(1)` | `(2, 3)` |
| 2 | `(2, 3)` | `Some(3)` | `(3, 6)` |
| 3 | `(3, 6)` | `Some(6)` | `(4, 10)` |
| 4 | `(4, 10)` | `Some(10)` | `(5, 15)` |

Comme `next` ne renvoie jamais `None`, la suite est infinie : il faut toujours la limiter (`take`, `take_while`). Attention à l'ordre de `filter` et `take` : `filter(...).take(3)` donne les 3 premiers **impairs** ; `take(3).filter(...)` garderait les impairs **parmi les 3 premiers** seulement (`[1, 3]`).

**À retenir :** un itérateur maison = une `struct` pour l'état + `impl Iterator` avec `type Item` et `next` (garder la valeur, avancer l'état, renvoyer `Some(valeur)` ; `None` pour finir).

| Besoin | Outil |
|---|---|
| chaque élément se calcule à partir du précédent | `successors` |
| un état quelconque, pour un usage unique | `from_fn` |
| une suite infinie simple | `(1..)`, `std::iter::repeat`, `cycle()` |
| un itérateur réutilisable, avec un nom | une `struct` + `impl Iterator` |
| une fonction qui renvoie une suite | `-> impl Iterator<Item = T>` |

## 7. Des données immuables

Le style fonctionnel ne modifie pas les valeurs : il en fabrique de nouvelles. Rust t'y aide déjà, puisque tout est immuable par défaut.

### Une nouvelle struct à partir d'une ancienne : `..ancien`

```rust
#[derive(Debug, Clone, PartialEq)]
struct Joueur {
    nom: String,
    points: u32,
    niveau: u32,
}

fn gagner(joueur: Joueur, points: u32) -> Joueur {
    Joueur {
        points: joueur.points + points,
        ..joueur
    }
}

let ana = Joueur { nom: "Ana".to_string(), points: 10, niveau: 1 };
let ana_apres = gagner(ana.clone(), 5);

assert_eq!(ana.points, 10);
assert_eq!(ana_apres.points, 15);
assert_eq!(ana_apres.nom, "Ana");
```

`..joueur` veut dire « pour tous les champs que je n'ai pas écrits, reprends ceux de `joueur` » : ici `nom` et `niveau`.

> [!warning] `..ancien` déplace les champs
> Les champs repris sont **déplacés** depuis l'ancienne valeur. Pour un champ comme un `String`, l'ancienne struct n'est alors plus utilisable en entier. Si tu veux la garder, travaille sur une référence et clone : `Joueur { points: 0, ..joueur.clone() }`.

**Exemple : une nouvelle liste où seuls certains éléments changent.** On parcourt la liste avec `iter()` (sans rien modifier), et pour chaque élément on fabrique soit une copie modifiée, soit une copie identique (`clone()`). Exemple : les produits du rayon « frais » augmentent de 10 %, en centimes entiers.

```rust
#[derive(Debug, Clone, PartialEq)]
struct Produit {
    nom: String,
    rayon: String,
    prix: u32,
}

fn hausse(produits: &[Produit], rayon: &str, pourcentage: u32) -> Vec<Produit> {
    produits
        .iter()
        .map(|p| {
            if p.rayon == rayon {
                Produit { prix: p.prix * (100 + pourcentage) / 100, ..p.clone() }
            } else {
                p.clone()
            }
        })
        .collect()
}

let stock = vec![
    Produit { nom: "lait".to_string(), rayon: "frais".to_string(), prix: 95 },
    Produit { nom: "riz".to_string(), rayon: "épicerie".to_string(), prix: 180 },
];
let nouveaux = hausse(&stock, "frais", 10);

assert_eq!(nouveaux[0].prix, 104);
assert_eq!(nouveaux[1].prix, 180);
assert_eq!(stock[0].prix, 95);
```

Pas à pas pour le lait : `95 × 110 = 10 450`, puis `10 450 / 100 = 104` (et pas 104,5) : entre deux entiers, `/` **coupe** la partie décimale, ce qui arrondit vers le bas pour des nombres positifs. Multiplier **avant** de diviser évite de perdre de la précision : `95 / 100 × 110` donnerait `0 × 110 = 0`. Le riz n'est pas dans le rayon « frais » : il est cloné tel quel. Et `stock` n'a pas bougé.

### Prendre, transformer, rendre

Certaines méthodes modifient sur place, comme `sort`. Pour les utiliser sans rien modifier chez l'appelant, la fonction **prend** la valeur (elle lui appartient), la modifie **chez elle**, puis la **rend** :

```rust
fn trier(mut nombres: Vec<i32>) -> Vec<i32> {
    nombres.sort();
    nombres
}

let notes = vec![14, 9, 17];
let triees = trier(notes.clone());

assert_eq!(notes, vec![14, 9, 17]);
assert_eq!(triees, vec![9, 14, 17]);
```

Vue de l'extérieur, `trier` est pure : elle reçoit une liste et en rend une autre. Le `mut` ne concerne que sa variable locale.

> [!tip] Trier selon un critère
> `sort_by_key(|x| cle)` trie selon une clé, `sort_by(|a, b| ...)` avec une comparaison. Pour l'ordre décroissant : `sort_by(|a, b| b.cmp(a))`, ou `sort_by_key(|x| std::cmp::Reverse(cle))`. Ces tris sont **stables** : deux éléments égaux gardent leur ordre de départ. Et `a.cmp(&b).then_with(|| ...)` départage les égalités avec un second critère.

**Exemple : un classement, du plus grand score au plus petit, puis par nom en cas d'égalité, et seulement les premiers.**

```rust
fn podium(mut joueurs: Vec<(String, u32)>, n: usize) -> Vec<(String, u32)> {
    joueurs.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));
    joueurs.into_iter().take(n).collect()
}

let joueurs = vec![
    ("Zoé".to_string(), 40),
    ("Ana".to_string(), 55),
    ("Léo".to_string(), 40),
    ("Mia".to_string(), 12),
];
assert_eq!(
    podium(joueurs, 3),
    vec![("Ana".to_string(), 55), ("Léo".to_string(), 40), ("Zoé".to_string(), 40)]
);
```

Pas à pas :

1. `b.1.cmp(&a.1)` compare les scores **à l'envers** (`b` avant `a`) : le plus grand passe devant. Ana (55) est première ; Zoé et Léo (40) sont à égalité ; Mia (12) est dernière.
2. Pour Zoé et Léo, la première comparaison dit « égal » : `then_with` passe alors au second critère, `a.0.cmp(&b.0)`, l'ordre alphabétique **normal** (`a` avant `b`) : « Léo » < « Zoé », donc Léo passe devant.
3. Ordre obtenu : Ana, Léo, Zoé, Mia. `take(3)` garde les trois premiers.

Comme `sort_by` trie sur place, la fonction **prend** la liste (`mut joueurs`) puis la rend : l'appelant ne voit aucune modification.

**À retenir :** pour classer : `sort_by(|a, b| critere1.then_with(|| critere2))` ; `b.cmp(a)` pour décroissant, `a.cmp(b)` pour croissant ; puis `take(n)` pour les premiers.

### Le masquage plutôt que `mut`

```rust
let texte = "  Bonjour  ";
let texte = texte.trim();
let texte = texte.to_uppercase();
assert_eq!(texte, "BONJOUR");
```

Chaque `let` crée une **nouvelle** variable qui cache l'ancienne : c'est le **masquage** (*shadowing*). Aucune valeur n'est modifiée, et le type peut même changer (`&str`, puis `String`).

**À retenir :** pour « changer » une valeur en style fonctionnel, fabrique-en une nouvelle : `Struct { champ: nouveau, ..ancien.clone() }`, une fonction qui prend puis rend, ou un nouveau `let` du même nom.

## 8. De l'impératif au fonctionnel

Le style **impératif** décrit les étapes : « crée une liste vide ; pour chaque élément, si..., ajoute... ». Le style **fonctionnel** décrit le résultat : « les éléments qui..., transformés en... ».

**Avant**, en impératif :

```rust
let commandes = [("ana", 30), ("léo", 8), ("mia", 12), ("zoé", 45)];

let mut gros_clients = Vec::new();
let mut total = 0;
for (client, montant) in commandes {
    if montant >= 10 {
        gros_clients.push(client.to_uppercase());
        total += montant;
    }
}

assert_eq!(gros_clients, vec!["ANA", "MIA", "ZOÉ"]);
assert_eq!(total, 87);
```

**Après**, en fonctionnel :

```rust
let commandes = [("ana", 30), ("léo", 8), ("mia", 12), ("zoé", 45)];

let grosses: Vec<(&str, u32)> = commandes.into_iter().filter(|&(_, montant)| montant >= 10).collect();
let gros_clients: Vec<String> = grosses.iter().map(|(client, _)| client.to_uppercase()).collect();
let total: u32 = grosses.iter().map(|(_, montant)| montant).sum();

assert_eq!(gros_clients, vec!["ANA", "MIA", "ZOÉ"]);
assert_eq!(total, 87);
```

Chaque variable porte une seule idée, et chaque ligne se lit comme une phrase : « les grosses commandes », « leurs clients en majuscules », « leur total ».

Pour traduire une boucle, cherche ces formes :

| Dans la boucle | En fonctionnel |
|---|---|
| `if condition { ... }` qui écarte des éléments | `filter` |
| `resultat.push(transformation(x))` | `map` puis `collect` |
| `total += x` | `sum`, ou `fold` |
| `compteur += 1` | `count` |
| `break` au premier élément trouvé | `find`, `position`, `any` |
| `break` dès qu'une condition devient fausse | `take_while` |
| une variable « élément précédent » | `windows(2)` |
| une liste des valeurs successives d'une variable | `scan` |
| `for i in 0..v.len()` pour lire `v[i]` | `iter()`, ou `enumerate()` si l'indice sert |
| deux boucles imbriquées | `flat_map` |

**Exemple pas à pas : traduire une boucle avec le tableau.**

```rust
fn longueur_premier_mot_long_imperatif(phrase: &str) -> Option<usize> {
    for mot in phrase.split_whitespace() {
        let longueur = mot.chars().count();
        if longueur > 5 {
            return Some(longueur);
        }
    }
    None
}

fn longueur_premier_mot_long(phrase: &str) -> Option<usize> {
    phrase
        .split_whitespace()
        .map(|mot| mot.chars().count())
        .find(|&longueur| longueur > 5)
}

let phrase = "un jour magnifique ensoleillé";
assert_eq!(longueur_premier_mot_long(phrase), Some(10));
assert_eq!(longueur_premier_mot_long(phrase), longueur_premier_mot_long_imperatif(phrase));
assert_eq!(longueur_premier_mot_long("trop court"), None);
```

1. **D'où viennent les éléments ?** La boucle parcourt `phrase.split_whitespace()` : c'est le début de la chaîne.
2. **Une transformation ?** Chaque mot devient sa longueur : `map(|mot| mot.chars().count())`.
3. **Que produit la boucle ?** Elle s'arrête au premier élément qui passe (`return Some(...)`), et renvoie `None` si aucun ne passe : c'est exactement `find`.
4. **Vérifier** sur l'exemple : « un » (2), « jour » (4), « magnifique » (10 > 5) : `Some(10)`, comme la boucle.

**À retenir :** pour traduire une boucle, repère la source, les `if` (→ `filter`), les transformations (→ `map`) et ce que la boucle produit à la fin (→ le consommateur).

### Les limites

Le style fonctionnel n'est pas toujours le plus clair.

> [!warning] Quand une boucle reste plus claire
> - Le but est un **effet** (afficher, écrire dans un fichier) : `for ligne in lignes { println!(...) }` se lit mieux qu'un `for_each`.
> - Plusieurs variables évoluent ensemble selon des règles compliquées : un `fold` avec un accumulateur à quatre champs devient vite illisible.
> - Il faut sortir au milieu selon plusieurs conditions différentes (`break`, `continue`, `return` mélangés).
> - Une chaîne de plus de cinq ou six étapes : découpe-la en variables ou en petites fonctions avec un nom.

La règle : choisis la version qu'un camarade comprendra le plus vite. Côté vitesse, une chaîne d'itérateurs est aussi rapide qu'une boucle ; seule la récursion profonde coûte plus cher (la pile).

## À retenir

- Fonction **pure** : même entrée, même sortie, aucun effet de bord. Les effets de bord restent au bord (`main`).
- Une fonction est une valeur : en paramètre (`impl Fn`, générique `F: Fn`, pointeur `fn`), en résultat (`impl Fn` + `move`, ou `Box<dyn Fn>` pour mélanger des closures).
- `fold` construit n'importe quoi, `reduce` part du premier élément, `scan` garde chaque étape.
- `filter_map` (0 ou 1 élément), `flat_map` (0 à plusieurs), `take_while` / `skip_while` (s'arrêtent au premier changement), `windows` / `chunks`, `partition`, `min_by_key` / `max_by` (et `Reverse` pour départager les égalités).
- Chercher : `find` (l'élément), `position` (l'indice), `any`, `all` ; `enumerate` pour avoir l'indice.
- Compter ou additionner par groupe : `fold` + `*entry(cle).or_insert(0) += valeur` ; classer : `sort_by` + `then_with`.
- `collect` fabrique un `Vec`, un `String`, une `HashMap`, un `BTreeSet`, un `Result<Vec<_>, _>`...
- `Option` et `Result` s'enchaînent : `map`, `and_then`, `filter`, `ok_or`, `map_err`, `unwrap_or_else`, `?`.
- Récursion : un cas de base, un cas récursif ; motifs `[]`, `[premier, reste @ ..]`, `[debut @ .., dernier]`, `[a, b, ..]`, gardes `n if condition`.
- Les itérateurs sont paresseux : rien sans consommateur, et les suites infinies se limitent avec `take`. Les tiens : `successors` (avec `checked_mul` pour ne pas dépasser), `from_fn`, `impl Iterator`.
- Fabriquer une nouvelle valeur plutôt que modifier : `..ancien`, « prendre, transformer, rendre », masquage.
