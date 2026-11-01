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

### `filter_map`, `flat_map` et `flatten`

`filter_map(f)` : la closure renvoie une `Option` ; on garde ce qu'il y a dans les `Some` et on jette les `None`. C'est un `map` et un `filter` en une seule étape.

```rust
let code = "a1b2c3d";
let chiffres: Vec<u32> = code.chars().filter_map(|c| c.to_digit(10)).collect();
assert_eq!(chiffres, vec![1, 2, 3]);
```

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

```rust
fn age_majeur(texte: &str) -> Option<u32> {
    texte.trim().parse::<u32>().ok().filter(|&age| age >= 18)
}

assert_eq!(age_majeur(" 25 "), Some(25));
assert_eq!(age_majeur("12"), None);
assert_eq!(age_majeur("douze"), None);
```

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

> [!warning] Suite infinie + consommateur sans fin = boucle infinie
> `(1..).map(|n| n * n).sum::<u64>()` ne s'arrête jamais (ou plante quand le nombre devient trop grand). Sur une suite infinie, place toujours un `take`, un `take_while`, ou un consommateur qui s'arrête tout seul (`find`, `any`, `position`).

### Renvoyer un itérateur : `impl Iterator`

```rust
fn multiples_de(n: u32) -> impl Iterator<Item = u32> {
    (1..).map(move |k| k * n)
}

let table_de_7: Vec<u32> = multiples_de(7).take(5).collect();
assert_eq!(table_de_7, vec![7, 14, 21, 28, 35]);
```

La fonction renvoie la recette, pas le résultat : c'est l'appelant qui décide combien d'éléments il veut.

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

### Le masquage plutôt que `mut`

```rust
let texte = "  Bonjour  ";
let texte = texte.trim();
let texte = texte.to_uppercase();
assert_eq!(texte, "BONJOUR");
```

Chaque `let` crée une **nouvelle** variable qui cache l'ancienne : c'est le **masquage** (*shadowing*). Aucune valeur n'est modifiée, et le type peut même changer (`&str`, puis `String`).

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
- `filter_map` (0 ou 1 élément), `flat_map` (0 à plusieurs), `take_while` / `skip_while` (s'arrêtent au premier changement), `windows` / `chunks`, `partition`, `min_by_key` / `max_by`.
- `collect` fabrique un `Vec`, un `String`, une `HashMap`, un `BTreeSet`, un `Result<Vec<_>, _>`...
- `Option` et `Result` s'enchaînent : `map`, `and_then`, `filter`, `ok_or`, `map_err`, `unwrap_or_else`, `?`.
- Récursion : un cas de base, un cas récursif ; motifs `[]`, `[premier, reste @ ..]`, `[debut @ .., dernier]`.
- Les itérateurs sont paresseux : rien sans consommateur, et les suites infinies se limitent avec `take`. Les tiens : `successors`, `from_fn`, `impl Iterator`.
- Fabriquer une nouvelle valeur plutôt que modifier : `..ancien`, « prendre, transformer, rendre », masquage.
