# Premiers pas

## 1. Cargo, l'outil à tout faire

**Cargo** crée, compile, teste et gère les dépendances (les bibliothèques externes) de ton projet.

```bash
cargo new mon_projet      # nouveau projet
cargo run                 # compile (mode debug) et lance
cargo run --release       # compile optimisé et lance
cargo check               # vérifie les erreurs sans produire de programme (le plus rapide)
cargo test                # lance les tests
cargo add rand            # ajoute une dépendance
```

Un projet contient un fichier `Cargo.toml` (le **manifeste** : nom, version, édition, dépendances) et un dossier `src/` avec `main.rs`.

**Exemple résolu : quelle commande pour quel moment ?**

| Situation | Commande | Pourquoi |
|---|---|---|
| je corrige des erreurs et je veux juste savoir si ça compile | `cargo check` | il analyse le code **sans fabriquer** le programme : c'est le plus rapide |
| je veux voir ce que mon programme affiche | `cargo run` | il compile **puis** lance |
| je veux le programme final, rapide | `cargo build --release` ou `cargo run --release` | il optimise (plus long à compiler, beaucoup plus rapide à l'exécution) |
| je veux vérifier mes fonctions | `cargo test` | il compile les tests et les lance |

`cargo build` fabrique le programme sans le lancer ; `cargo check` s'arrête encore avant (pas de programme du tout), c'est pour ça qu'il est le plus rapide.

**À retenir :** `check` pour corriger vite, `run` pour essayer, `test` pour vérifier, `--release` pour la vitesse.

> [!warning] Version du compilateur ≠ édition
> La **version** (ex. 1.99) est celle de l'outil `rustc`. L'**édition** (2015, 2018, 2021, 2024) est le jeu de règles de syntaxe choisi dans `Cargo.toml`.

### Debug ou release ?

| | debug (par défaut) | release (`--release`) |
|---|---|---|
| Optimisations | aucune | maximales |
| Débordement d'entier | **panique** (arrêt du programme) | **repart à zéro** sans prévenir |
| Vitesse | 2 à 50 fois plus lent | rapide |

**À retenir :** debug pour développer (il attrape les débordements), release pour mesurer la vitesse et livrer.

## 2. Le Hello World

```rust
fn main() {
    println!("Hello, world!");
}
```

- `fn` déclare une **fonction**, `main` est le point de départ du programme.
- `println!` finit par `!` : c'est une **macro** (du code qui écrit du code à la compilation), pas une fonction. Une macro peut recevoir un nombre variable d'arguments, et `println!` vérifie à la compilation que le texte et les valeurs correspondent.
- `{}` dans le texte est remplacé par une valeur : `println!("J'ai {} ans", age)` ou `println!("J'ai {age} ans")`.
- Chaque `println!` affiche **une** ligne (il ajoute le retour à la ligne à la fin).

**Exemple résolu : afficher deux lignes avec une variable.** On veut exactement :

```text
Il fait beau.
Il fait 18 degrés.
```

1. Deux lignes à afficher, donc deux `println!`.
2. Le nombre 18 doit venir d'une variable : `let temperature = 18;`.
3. Dans le texte, `{temperature}` est remplacé par la valeur de la variable.

```rust
fn main() {
    let temperature = 18;
    println!("Il fait beau.");
    println!("Il fait {temperature} degrés.");
}
```

Les deux écritures `println!("Il fait {} degrés.", temperature)` et `println!("Il fait {temperature} degrés.")` donnent le même résultat. La seconde ne marche qu'avec un **nom de variable** entre les accolades (pas un calcul : pour `temperature + 1`, utilise `{}` et mets le calcul après la virgule).

**À retenir :** un `println!` par ligne, et `{nom}` (ou `{}` + la valeur après la virgule) pour insérer une valeur.

## 3. Variables : immuables par défaut

```rust
let a = 42;        // impossible à modifier
let mut b = 42;    // modifiable grâce à mut
b += 1;            // ok
// a += 1;         // error[E0384]: cannot assign twice to immutable variable
println!("{a} {b}");
```

En Rust on parle de **binding** (une liaison entre un nom et une valeur). Tout est **immuable** (non modifiable) par défaut : on ajoute `mut` seulement quand c'est nécessaire.

`b += 1` est un raccourci pour `b = b + 1`. De même `-=`, `*=`, `/=`, `%=`.

> [!tip] Lire le message d'erreur jusqu'au bout
> Le compilateur propose souvent la correction exacte dans la ligne `help:`. Pour E0384 il propose `let mut ...`.

**Exemple résolu : un compteur qui ne compile pas.**

```text
let compteur = 0;
compteur += 1;
```

Le compilateur répond :

```text
error[E0384]: cannot assign twice to immutable variable `compteur`
  |
1 |     let compteur = 0;
  |         -------- first assignment to `compteur`
2 |     compteur += 1;
  |     ^^^^^^^^^^^^^ cannot assign twice to immutable variable
  |
help: consider making this binding mutable
  |
1 |     let mut compteur = 0;
  |         +++
```

1. `E0384` : « impossible d'affecter deux fois une variable immuable ».
2. La flèche montre la ligne fautive (`compteur += 1`) et l'endroit où la variable a été créée.
3. Le `help:` montre la correction avec des `+++` sous ce qu'il faut ajouter : le mot `mut`.

```rust
let mut compteur = 0;
compteur += 1;
println!("{compteur}");
```

**À retenir :** une variable qu'on modifie (`=`, `+=`, dans une boucle...) doit être déclarée avec `let mut`. Erreur E0384 = il manque `mut`.

## 4. Les types de nombres

| Type | Taille | Valeurs |
|---|---|---|
| `u8` / `i8` | 8 bits | 0 à 255 / -128 à 127 |
| `u16` / `i16` | 16 bits | 0 à 65 535 / -32 768 à 32 767 |
| `u32` / `i32` | 32 bits | `i32` est le type par défaut des entiers |
| `u64` / `i64` | 64 bits | jusqu'à environ 1,8 × 10¹⁹ |
| `usize` | taille d'une adresse mémoire | obligatoire pour les indices (`v[i]`) |
| `f32` / `f64` | 32 / 64 bits | nombres à virgule, `f64` par défaut |

`u` = **unsigned** (seulement positif), `i` = **integer** signé (positif ou négatif). Le nombre est le nombre de **bits** : un `u8` a 8 bits, donc 2⁸ = 256 valeurs possibles, de 0 à 255.

**Exemple résolu : quel type Rust choisit-il tout seul ?**

```rust
let x = 5;
let y = 2.5;
let z: u8 = 5;
let indice: usize = 1;
let v = [10, 20, 30];
println!("{x} {y} {z} {}", v[indice]);
```

1. `x = 5` : un entier, rien n'impose de type, Rust prend **`i32`**.
2. `y = 2.5` : un nombre à virgule, Rust prend **`f64`**.
3. `z: u8` : on a écrit le type, c'est un `u8`.
4. `v[indice]` : un indice de tableau doit être un **`usize`** (sa taille dépend de la machine : 64 bits sur une machine 64 bits). Avec un `i32`, `v[x]` ne compilerait pas.

**À retenir :** entier sans précision = `i32`, virgule = `f64`, indice et longueur = `usize`.

### Pas de conversion automatique

```rust
let petit: u8 = 200;
let grand: u32 = 100_000;
// let somme = petit + grand;          // ne compile pas : types différents
let somme = u32::from(petit) + grand;  // conversion sûre
let tronque = grand as u8;             // coupe les bits en trop : 160
let essai = u8::try_from(grand);       // Err(...) car 100 000 ne tient pas dans un u8
println!("{somme} {tronque} {essai:?}");
```

| Méthode | Comportement |
|---|---|
| `u32::from(x)` ou `x.into()` | seulement si aucune valeur ne peut être perdue |
| `x as u8` | convertit toujours, **coupe en silence** |
| `u8::try_from(x)` | renvoie un `Result` : `Ok(valeur)` ou `Err` |

Le `_` dans `100_000` sert seulement à lire plus facilement : c'est le nombre 100000. `{essai:?}` affiche une valeur en mode « debug » (pour `Ok`, `Err`, `Some`, `None`...).

**Exemple résolu : que donne `300u32 as u8` ?**

Un `u8` ne garde que les 8 bits du bas, c'est-à-dire le **reste de la division par 256** :

1. 300 ne tient pas dans un `u8` (maximum 255).
2. 300 = 1 × 256 + **44**.
3. On garde le reste : `300u32 as u8` vaut **44**, sans erreur ni avertissement.

De même, 256 donne 0 (256 = 1 × 256 + 0), 100 000 donne 160 (100 000 = 390 × 256 + 160), et 200 donne 200 (il tenait déjà).

**Exemple résolu : de `Result` à `Option` avec `.ok()`.** `u8::try_from(n)` renvoie un `Result` (`Ok(valeur)` ou `Err(erreur)`). Si on veut un `Option` (`Some(valeur)` ou `None`), `.ok()` fait la traduction : `Ok(v)` devient `Some(v)`, `Err(...)` devient `None`.

```rust
let a = u8::try_from(200u32).ok();
let b = u8::try_from(300u32).ok();
println!("{a:?} {b:?}");
```

Pas à pas : 200 tient dans un `u8`, donc `Ok(200)` puis `Some(200)`. 300 ne tient pas, donc `Err(...)` puis `None`. Affichage : `Some(200) None`.

**À retenir :** `from` quand c'est sans risque, `try_from` (+ `.ok()` pour un `Option`) quand ça peut échouer, `as` quand on veut volontairement couper (reste de la division par 256 pour un `u8`).

### Le débordement (overflow)

Si un calcul dépasse la valeur maximale du type : panique en debug, valeur fausse en release. Pour choisir le comportement :

| Méthode | Si ça déborde |
|---|---|
| `a.checked_add(b)` | renvoie `None` (sinon `Some(résultat)`) |
| `a.saturating_add(b)` | bloque à la valeur maximale |
| `a.wrapping_add(b)` | repart de zéro (volontairement) |

En mode debug, `250u8 + 10` calculé pendant l'exécution arrête le programme :

```text
thread 'main' panicked at src/main.rs:4:13:
attempt to add with overflow
```

**Exemple résolu : 240 + 20 dans un `u8` (maximum 255).** Le vrai résultat, 260, ne tient pas.

```rust
let a: u8 = 240;
let b: u8 = 20;
println!("{:?}", a.checked_add(b));
println!("{}", a.saturating_add(b));
println!("{}", a.wrapping_add(b));
println!("{:?}", a.checked_add(10));
```

| Appel | Calcul | Résultat |
|---|---|---|
| `a.checked_add(b)` | 260 > 255, ça déborde | `None` |
| `a.saturating_add(b)` | ça déborde, on bloque au maximum | `255` |
| `a.wrapping_add(b)` | on repart de 0 : 260 − 256 | `4` |
| `a.checked_add(10)` | 250 ≤ 255, ça tient | `Some(250)` |

Pour `wrapping_add`, on compte comme un compteur kilométrique : 255, puis 0, 1, 2, 3, 4. C'est le même calcul que `as u8` : le reste de 260 divisé par 256.

**À retenir :** `checked_` = « dis-moi si ça déborde » (`None`), `saturating_` = « bloque au max », `wrapping_` = « repars de zéro ».

## 5. Fonctions et expressions

```rust
fn tarif(age: u32) -> u32 {
    if age < 12 {
        5
    } else {
        12
    }
}

fn main() {
    println!("{} {}", tarif(8), tarif(30));
}
```

- Le type des **paramètres** et du **retour** (`-> u32`) est obligatoire.
- La dernière ligne **sans point-virgule** est la valeur renvoyée. `return` sert seulement à sortir plus tôt.
- `if`/`else` est une **expression** : il produit une valeur. Chaque branche finit par une valeur sans `;`, et toutes les branches ont le même type.

> [!warning] Le point-virgule
> `x + 1` vaut `x + 1`. `x + 1;` est une **instruction** qui vaut `()` (le « rien » de Rust, appelé *unit*). Un `;` de trop à la fin d'une fonction donne l'erreur « expected `u32`, found `()` ». C'est l'erreur n°1 des débutants.

**Exemple résolu : que vaut ce bloc ?**

```rust
let resultat = {
    let a = 4;
    a * 10
};
println!("{resultat}");
```

1. Un bloc `{ }` vaut sa **dernière expression**.
2. La dernière ligne est `a * 10`, **sans** `;` : le bloc vaut 4 × 10 = **40**.
3. Si on écrivait `a * 10;`, la dernière ligne deviendrait une instruction : le bloc vaudrait `()` et `resultat` ne serait plus un nombre.

**Exemple résolu : renvoyer un booléen.** Une comparaison (`==`, `<`, `>=`...) est elle-même une expression qui vaut `true` ou `false`. `%` donne le **reste** de la division : `17 % 5` vaut 2 (17 = 3 × 5 + 2).

```rust
fn est_multiple_de_trois(n: i32) -> bool {
    n % 3 == 0
}

fn main() {
    println!("{} {}", est_multiple_de_trois(9), est_multiple_de_trois(10));
}
```

Pas à pas : 9 % 3 = 0, donc `0 == 0` vaut `true`. 10 % 3 = 1, donc `1 == 0` vaut `false`. Pas besoin de `if` : la comparaison est déjà la réponse.

**Exemple résolu : plusieurs cas avec `else if`.** Prix d'un parking : moins de 1 heure gratuit, jusqu'à 3 heures 2 €, 10 heures et plus 15 €, sinon 6 €.

```rust
fn prix_parking(heures: u32) -> u32 {
    if heures < 1 {
        0
    } else if heures <= 3 {
        2
    } else if heures >= 10 {
        15
    } else {
        6
    }
}

fn main() {
    for h in [0, 2, 3, 5, 12] {
        println!("{h} h : {} euros", prix_parking(h));
    }
}
```

Les conditions sont testées **de haut en bas**, et la première vraie gagne :

| Heures | `< 1` ? | `<= 3` ? | `>= 10` ? | Prix |
|---|---|---|---|---|
| 0 | oui | | | 0 |
| 2 | non | oui | | 2 |
| 3 | non | oui (3 ≤ 3) | | 2 |
| 5 | non | non | non | 6 (le `else`) |
| 12 | non | non | oui | 15 |

Le dernier `else` attrape tout ce qui reste : il faut donc tester les cas particuliers (comme `>= 10`) **avant** lui. Attention aux bornes : « jusqu'à 3 inclus » s'écrit `<= 3`, pas `< 3`.

> [!info] `todo!()`
> `todo!()` est une macro qui veut dire « pas encore écrit ». Le code compile, mais s'il passe par là, le programme panique avec `not yet implemented`. On la remplace par le vrai code.

**À retenir :** la dernière expression sans `;` est renvoyée ; une chaîne `if / else if / else` se lit de haut en bas, le premier cas vrai gagne.

## 6. Les boucles

```rust
for i in 1..=5 {          // 1, 2, 3, 4, 5  (..= inclut la fin)
    print!("{i} ");
}
for i in 0..5 {           // 0, 1, 2, 3, 4  (.. exclut la fin)
    print!("{i} ");
}

let mut n = 3;
while n > 0 {             // tant que la condition est vraie
    n -= 1;
}

let resultat = loop {     // boucle infinie...
    n += 1;
    if n == 10 {
        break n * 2;      // ...dont on sort avec break (qui peut renvoyer une valeur)
    }
};
println!("{resultat}");
```

`print!` affiche sans revenir à la ligne. Le `while` part de 3 et descend à 0, puis le `loop` remonte jusqu'à 10 et renvoie 10 × 2 = 20.

| Écriture | Valeurs | Combien ? |
|---|---|---|
| `0..3` | 0, 1, 2 | 3 (la fin est **exclue**) |
| `0..=3` | 0, 1, 2, 3 | 4 (la fin est **incluse**) |
| `1..=n` | 1, 2, ..., n | n |
| `0..n` | 0, 1, ..., n − 1 | n |

**Exemple résolu : additionner avec `for`.** La somme des multiples de 3 entre 1 et 10.

```rust
let mut somme = 0;
for i in 1..=10 {
    if i % 3 == 0 {
        somme += i;
    }
}
println!("{somme}");
```

| `i` | `i % 3` | Multiple de 3 ? | `somme` après |
|---|---|---|---|
| 1, 2 | 1, 2 | non | 0 |
| 3 | 0 | oui | 3 |
| 4, 5 | 1, 2 | non | 3 |
| 6 | 0 | oui | 9 |
| 7, 8 | 1, 2 | non | 9 |
| 9 | 0 | oui | 18 |
| 10 | 1 | non | 18 |

Résultat : **18**. `somme` est modifiée dans la boucle, elle doit donc être `mut`, et elle part de 0 (rien n'est encore ajouté).

**Exemple résolu : répéter `n` fois sans utiliser le numéro du tour.** Multiplier 1 par 3, quatre fois de suite (3⁴) :

```rust
let mut produit: u64 = 1;
for _ in 0..4 {
    produit *= 3;
}
println!("{produit}");
```

`_` veut dire « je n'ai pas besoin du numéro du tour ». `0..4` fait 4 tours : 1 → 3 → 9 → 27 → **81**. On part de **1** pour une multiplication (partir de 0 donnerait toujours 0). Et avec `0..0`, aucun tour : le résultat reste 1, ce qui est juste puisque 3⁰ = 1.

**Exemple résolu : chercher avec `while`.** Le plus petit nombre à partir de 2 qui divise 35.

```rust
let n: u32 = 35;
let mut d = 2;
while !n.is_multiple_of(d) {
    d += 1;
}
println!("{d}");
```

`!` veut dire « non » : on continue **tant que** `n` n'est **pas** un multiple de `d`. `n.is_multiple_of(d)` veut dire la même chose que `n % d == 0` (Clippy le propose pour les entiers positifs). On teste 2 (35 % 2 = 1, non), 3 (35 % 3 = 2, non), 4 (35 % 4 = 3, non), 5 (35 % 5 = 0, oui) : la boucle s'arrête, on affiche **5**.

**À retenir :** `for` quand on sait combien de tours (`1..=n` ou `0..n`), `while` quand on s'arrête sur une condition, `loop` + `break` pour une boucle sans fin dont on sort à la main. Somme : on part de 0, produit : on part de 1.

## 7. `match` : le choix selon un motif

```rust
let note = 14;
let description = match note {
    0 => "nul",
    1..=9 => "insuffisant",        // un intervalle
    10 | 11 => "passable",         // plusieurs valeurs
    n if n <= 20 => "bien",        // une condition (garde)
    _ => "note invalide",          // tout le reste
};
println!("{description}");
```

- `match` est une **expression** : tous les bras renvoient le **même type**.
- `match` est **exhaustif** : tous les cas doivent être couverts, sinon erreur E0004.
- Les bras sont testés **dans l'ordre** : dans FizzBuzz, le cas « multiple de 15 » doit venir **avant** 3 et 5.

| Motif | Veut dire |
|---|---|
| `0` | exactement 0 |
| `1..=9` | de 1 à 9, les deux inclus |
| `10 \| 11` | 10 ou 11 |
| `n if n <= 20` | n'importe quelle valeur, appelée `n`, **si** la condition (la *garde*) est vraie |
| `_` | tout le reste (le joker) |

Avec `note = 14` : `0` ? non. `1..=9` ? non. `10 | 11` ? non. `n if n <= 20` : 14 ≤ 20, oui, on obtient `"bien"`.

> [!info] `&'static str` et `String`
> Un texte écrit entre guillemets dans le code (`"bien"`) a le type `&'static str` : c'est le type de retour d'une fonction qui renvoie un de ces textes. `.to_string()` transforme une valeur (un texte, un nombre) en `String`, un texte qu'on peut fabriquer : `7.to_string()` donne `"7"`. Les deux sont détaillés au chapitre suivant.

**Exemple résolu : pourquoi l'ordre des bras compte.** Classer un nombre : multiple de 2 et de 7 à la fois → `"les deux"`, de 2 seulement → `"pair"`, de 7 seulement → `"sept"`, sinon le nombre lui-même.

```rust
fn classer(n: u32) -> String {
    match n {
        i if i.is_multiple_of(14) => "les deux".to_string(),
        i if i.is_multiple_of(2) => "pair".to_string(),
        i if i.is_multiple_of(7) => "sept".to_string(),
        i => i.to_string(),
    }
}

fn main() {
    for n in [14, 4, 21, 5] {
        println!("{n} : {}", classer(n));
    }
}
```

| `n` | multiple de 14 ? | de 2 ? | de 7 ? | Résultat |
|---|---|---|---|---|
| 14 | **oui** | | | `"les deux"` |
| 4 | non | **oui** | | `"pair"` |
| 21 | non | non | **oui** | `"sept"` |
| 5 | non | non | non | `"5"` (dernier bras) |

Si on mettait le bras « multiple de 2 » en premier, 14 tomberait dedans et afficherait `"pair"` : le bras « les deux » ne serait jamais atteint. Le cas le plus **précis** (multiple de 2 **et** de 7, donc de 14) se teste **avant** les cas plus larges.

**Exemple résolu : des tranches avec des intervalles.** Classer une vitesse en km/h :

```rust
fn allure(vitesse: u8) -> &'static str {
    match vitesse {
        0 => "arrêt",
        1..=30 => "lent",
        31..=90 => "normal",
        _ => "rapide",
    }
}

fn main() {
    println!("{} {} {}", allure(30), allure(31), allure(200));
}
```

30 est dans `1..=30` (fin incluse) : `"lent"`. 31 est dans `31..=90` : `"normal"`. 200 n'est dans aucun intervalle : le joker `_` donne `"rapide"`. Sans le `_`, les valeurs de 91 à 255 ne seraient pas couvertes et le code ne compilerait pas (E0004).

**À retenir :** dans un `match`, le premier bras qui correspond gagne : du plus précis au plus général, et `_` en dernier pour couvrir tout le reste.

## 8. La récursion : une fonction qui s'appelle elle-même

Une fonction **récursive** s'appelle elle-même sur un cas plus petit. Elle a toujours deux parties :

- un ou plusieurs **cas de base** : la réponse est connue directement, on ne s'appelle pas ;
- un **cas général** : on se ramène à des cas plus petits.

Sans cas de base, la fonction s'appellerait à l'infini et la pile déborderait.

**Exemple résolu : la factorielle**, 4! = 4 × 3 × 2 × 1. Définition : 0! = 1, et n! = n × (n − 1)!.

```rust
fn factorielle(n: u64) -> u64 {
    match n {
        0 => 1,
        _ => n * factorielle(n - 1),
    }
}

fn main() {
    println!("{}", factorielle(4));
}
```

On déroule `factorielle(4)` :

1. `factorielle(4)` = 4 × `factorielle(3)`
2. `factorielle(3)` = 3 × `factorielle(2)`
3. `factorielle(2)` = 2 × `factorielle(1)`
4. `factorielle(1)` = 1 × `factorielle(0)`
5. `factorielle(0)` = 1 (cas de base, on s'arrête)

Puis on remonte : 1 × 1 = 1, 2 × 1 = 2, 3 × 2 = 6, 4 × 6 = **24**.

> [!warning] Deux appels par appel = très lent
> Si le cas général appelle la fonction **deux fois** (comme `f(n - 1) + f(n - 2)`), le nombre d'appels double presque à chaque fois que `n` grandit de 1 : à `n = 40`, il y en a des centaines de millions. La version récursive est juste, mais vite inutilisable.

**À retenir :** une fonction récursive = cas de base d'abord, puis le cas général qui se rappelle sur plus petit.

## 9. Remplacer la récursion par une boucle

Quand chaque valeur se calcule à partir des **précédentes**, on peut avancer avec une boucle en gardant seulement les dernières valeurs dans des variables `mut`.

**Exemple résolu : la suite 2, 1, 3, 4, 7, 11, 18...** (chaque nombre est la somme des deux précédents, en partant de 2 et 1). On veut le terme numéro `n` (le terme 0 vaut 2).

```rust
fn terme(n: u32) -> u64 {
    let mut actuel: u64 = 2;
    let mut suivant: u64 = 1;
    for _ in 0..n {
        let ancien = actuel;
        actuel = suivant;
        suivant += ancien;
    }
    actuel
}

fn main() {
    println!("{} {} {}", terme(0), terme(3), terme(6));
}
```

À chaque tour, on décale la paire `(actuel, suivant)` d'un cran : le nouvel `actuel` est l'ancien `suivant`, le nouveau `suivant` est la somme des deux. La variable `ancien` garde la valeur d'`actuel` **avant** qu'on l'écrase.

| Tour | `actuel` | `suivant` |
|---|---|---|
| départ | 2 | 1 |
| 1 | 1 | 3 |
| 2 | 3 | 4 |
| 3 | 4 | 7 |
| 4 | 7 | 11 |
| 5 | 11 | 18 |
| 6 | 18 | 29 |

`terme(0)` fait 0 tour et renvoie 2, `terme(3)` renvoie 4, `terme(6)` renvoie 18. Seulement `n` additions, au lieu de milliards d'appels. `u64` (jusqu'à environ 1,8 × 10¹⁹) permet d'aller loin avant de déborder.

**À retenir :** pour une suite où chaque terme dépend des deux précédents, garde deux variables et décale-les à chaque tour, avec une variable temporaire pour ne pas perdre l'ancienne valeur.

## À retenir

- `cargo run`, `cargo check`, `cargo test` ; `--release` pour la vitesse.
- `let` = immuable, `let mut` = modifiable (E0384 sinon).
- Pas de `;` sur la dernière ligne pour renvoyer une valeur.
- Entier par défaut `i32`, virgule `f64`, indice `usize`.
- Pas de conversion automatique : `from` (sûr), `as` (coupe), `try_from` (peut échouer).
- Débordement : panique en debug ; `checked_`, `saturating_`, `wrapping_` pour choisir.
- `match` couvre tous les cas, dans l'ordre : le plus précis d'abord, `_` à la fin.
- Récursion = cas de base + cas général ; une boucle avec deux variables est bien plus rapide.
