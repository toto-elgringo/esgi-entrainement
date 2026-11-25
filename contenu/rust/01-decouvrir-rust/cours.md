# Découvrir Rust

## 1. Installer Rust

Tout passe par **rustup**, un programme qui installe et met à jour les outils Rust. Il gère plusieurs **toolchains** (versions complètes des outils : compilateur, Cargo, Clippy...).

```bash
rustup update                 # met à jour
rustup default stable         # choisit la version stable par défaut
rustup toolchain list         # liste ce qui est installé
```

Une nouvelle version **stable** sort toutes les 6 semaines. Il existe trois canaux :

| Canal | Rôle |
|---|---|
| stable | celui qu'on utilise au quotidien |
| beta | la future stable, en test pendant 6 semaines |
| nightly | la version du jour, avec les fonctions expérimentales |

**Exemple résolu : la version 1.80 sort aujourd'hui en stable. Que se passe-t-il pendant les 6 semaines suivantes ?**

1. La 1.80 est en **stable** : c'est elle que tout le monde utilise.
2. Pendant ce temps, la 1.81 est en **beta** : on la teste pour trouver ses derniers bugs.
3. Chaque nuit, une nouvelle **nightly** est construite avec les toutes dernières modifications (futur 1.82 et au-delà).
4. 6 semaines plus tard, la 1.81 passe en stable, la 1.82 en beta, et ainsi de suite.

Une version stable sort donc environ **8 à 9 fois par an** (52 semaines / 6). Ce n'est pas la même chose qu'une **édition**, qui change environ tous les 3 ans (voir plus bas).

**À retenir :** stable = maintenant, beta = dans 6 semaines, nightly = expérimental. Un saut de stable toutes les 6 semaines.

### Les outils installés

| Outil | Rôle |
|---|---|
| `rustup` | l'**installateur** : installe et met à jour tous les autres outils |
| `rustc` | le **compilateur** : transforme le code en programme. On l'appelle rarement directement |
| `cargo` | le chef d'orchestre : crée le projet, compile, teste, gère les dépendances |
| `rustfmt` | met en forme le code automatiquement (`cargo fmt`) |
| `clippy` | plus de 700 conseils pour améliorer ton code (`cargo clippy`) |
| `rust-docs` | la documentation hors ligne (`rustup doc`) |

> [!tip] Choisir son éditeur
> Le plus important : qu'il affiche les erreurs **pendant que tu tapes** (RustRover, ou VS Code avec rust-analyzer). Apprendre Rust, c'est surtout apprendre à lire les messages d'erreur.

```bash
rustc --version
cargo new hello
cd hello
cargo run          # affiche Hello, world!
```

**Exemple résolu : quel outil pour quel besoin ?**

| Besoin | Outil | Pourquoi pas un autre ? |
|---|---|---|
| installer Rust ou passer à la nouvelle version | `rustup` | `cargo` utilise les outils, il ne les installe pas |
| compiler et lancer mon programme | `cargo run` | `cargo` appelle `rustc` à ta place, avec les bons réglages |
| aligner et indenter le code proprement | `cargo fmt` (rustfmt) | il change seulement la **présentation**, jamais le sens |
| savoir si mon code peut être écrit mieux | `cargo clippy` | il donne des **conseils** (les *lints*), rustfmt ne fait que la mise en forme |

**À retenir :** `rustup` installe, `rustc` compile, `cargo` pilote tout, `rustfmt` met en forme, `clippy` conseille.

### Le premier programme

`cargo new hello` crée ce fichier `src/main.rs` :

```rust
fn main() {
    println!("Hello, world!");
}
```

On le lit ligne par ligne :

1. `fn main()` : `fn` déclare une **fonction**. Celle qui s'appelle `main` est le point de départ : c'est elle qui est lancée quand le programme démarre.
2. `{` ... `}` : le corps de la fonction, ce qu'elle fait.
3. `println!("...")` : affiche le texte entre guillemets, puis passe à la ligne.
4. Le `;` termine l'instruction.

> [!warning] Le texte affiché doit être exact
> Quand un exercice demande d'afficher `Hello, world!`, la page compare **caractère par caractère** : la majuscule, la virgule, l'espace après la virgule et le `!` comptent. `Hello world!` (sans virgule) ou `hello, world!` (sans majuscule) sont faux.

**Exemple résolu : faire afficher `Salut, Rust!` à la place.** On ne touche qu'au texte entre guillemets, en le recopiant signe par signe : `S` majuscule, `alut`, la virgule, **un** espace, `Rust`, le `!` collé.

```rust
fn main() {
    println!("Salut, Rust!");
}
```

**À retenir :** pour changer ce qui s'affiche, modifie seulement le texte entre guillemets, et recopie-le à l'identique (ponctuation et espaces compris).

## 2. D'où vient Rust ?

| Date | Événement |
|---|---|
| 2006 | Projet personnel de Graydon Hoare (Mozilla), après un ascenseur en panne à cause d'un bug logiciel. Le nom vient d'un champignon : la rouille |
| 2009 | Mozilla adopte le projet pour écrire **Servo**, un nouveau moteur de navigateur |
| 2012-2015 | Suppression du ramasse-miettes, remplacé par l'**ownership** (vérifié à la compilation) |
| 15 mai 2015 | **Rust 1.0** et la promesse de stabilité |
| 2021 | Création de la **Rust Foundation** (AWS, Google, Huawei, Microsoft, Mozilla) |
| 2022 | Rust devient le 2e langage du **noyau Linux**, après le C |
| 2024 | La Maison Blanche recommande les langages « sûrs pour la mémoire » |

La « promesse de stabilité » de la 1.0 veut dire : un programme qui compile avec Rust 1.0 doit encore compiler avec toutes les versions suivantes.

**À retenir :** 2006 = projet perso, 2009 = Mozilla, **2015 = Rust 1.0**, 2021 = fondation, 2022 = noyau Linux.

> [!info] Ramasse-miettes (garbage collector)
> Un programme qui tourne en arrière-plan pour libérer la mémoire inutilisée (Java, Python, JavaScript). Rust n'en a **pas** : la mémoire est libérée à un moment connu, décidé à la compilation.

### Comment Rust libère la mémoire : l'ownership

Il existe trois façons de libérer la mémoire :

| Méthode | Langages | Problème |
|---|---|---|
| à la main (`free()`) | C | on oublie de libérer (fuite) ou on libère deux fois (plantage) |
| ramasse-miettes | Java, Python, JavaScript | un programme en plus tourne en fond et fait des pauses |
| **ownership** (propriété) | Rust | il faut apprendre ses règles |

L'**ownership** : chaque valeur a **un seul propriétaire** (une variable). Quand le propriétaire disparaît (à la fin de son bloc `{ }`), la valeur est libérée automatiquement. Le compilateur vérifie ces règles **avant** que le programme tourne.

**Exemple résolu : quand le texte est-il libéré ?**

```rust
fn main() {
    let message = String::from("bonjour");
    {
        let autre = String::from("au revoir");
        println!("{autre}");
    }
    println!("{message}");
}
```

1. `message` est créé : il possède le texte `"bonjour"`.
2. On entre dans le bloc `{ }` : `autre` est créé, il possède `"au revoir"`.
3. À l'accolade fermante du bloc, `autre` disparaît : `"au revoir"` est libéré **à cet endroit précis**.
4. On affiche `message`, qui existe toujours.
5. À la fin de `main`, `message` disparaît à son tour et `"bonjour"` est libéré.

Personne n'a écrit `free()`, et aucun ramasse-miettes n'a tourné : le compilateur savait exactement où libérer.

**À retenir :** en Rust, la mémoire est libérée quand son propriétaire sort de son bloc, et c'est vérifié à la compilation.

### Les éditions

Chaque projet choisit son **édition** (2015, 2018, 2021, 2024) dans `Cargo.toml`. Une édition est un jeu de règles de syntaxe. Des projets d'éditions différentes fonctionnent ensemble : le langage évolue sans casser l'ancien code.

```toml
[package]
name = "hello"
version = "0.1.0"
edition = "2024"
```

**Exemple résolu : version ou édition ?**

| Phrase | C'est... |
|---|---|
| « J'ai Rust 1.99 » | une **version** du compilateur (change toutes les 6 semaines) |
| « Mon projet est en 2021 » | une **édition**, écrite dans `Cargo.toml` (une nouvelle tous les 3 ans environ) |
| « J'utilise nightly » | un **canal** (stable, beta ou nightly) |

Un compilateur récent (1.99) sait compiler un vieux projet en édition 2015 **et** un projet en 2024, et une bibliothèque en 2018 peut être utilisée par un projet en 2024.

**À retenir :** version = l'outil, édition = les règles de syntaxe choisies par le projet, canal = stable / beta / nightly.

## 3. Les trois priorités (dans cet ordre)

1. **Safety** (sûreté) : pas d'erreur mémoire, pas de bug entre threads.
2. **Performance** : aussi rapide que le C.
3. **Productivity** : de bons outils, une bonne documentation.

En cas de conflit, la sûreté gagne toujours. C'est pour ça que le compilateur refuse parfois du code que tu penses correct : il préfère refuser que prendre un risque.

**À retenir :** Safety > Performance > Productivity. Moyen mnémotechnique : **S**, **P**, **P**, la sûreté d'abord, le confort en dernier.

### Les bugs que Rust empêche

| Bug | En C/C++ | En Rust |
|---|---|---|
| utiliser une mémoire déjà libérée | lecture de données au hasard | refusé à la compilation |
| libérer deux fois | corruption de la mémoire | impossible (un seul propriétaire) |
| dépasser la fin d'un tableau | écrit chez le voisin | vérifié, arrêt propre (panique) |
| pointeur `NULL` | plantage | pas de `null`, on utilise `Option` |
| deux threads modifient la même donnée | résultat aléatoire | refusé à la compilation |

Environ **70 %** des failles de sécurité de Microsoft et de Chrome viennent d'erreurs mémoire.

#### Dépasser la fin d'un tableau : la panique

Une **panique** est un arrêt **propre** du programme : il s'arrête tout de suite et affiche un message qui dit ce qui s'est passé et à quelle ligne. Avec un tableau de 3 cases, `v[10]` ne lit pas la mémoire voisine comme en C : Rust vérifie l'indice et s'arrête.

```text
thread 'main' panicked at src/main.rs:3:13:
index out of bounds: the len is 3 but the index is 10
```

On lit le message : « indice hors limites : la longueur est 3 mais l'indice est 10 ». Pas de valeur au hasard, pas de 0 inventé, pas de case ajoutée.

Si tu ne sais pas à l'avance si la case existe, `v.get(i)` demande poliment : il renvoie `Some(valeur)` si la case existe, `None` sinon, sans paniquer.

```rust
let v = [10, 20, 30];
println!("{:?}", v.get(1));
println!("{:?}", v.get(10));
```

Pas à pas : les cases ont les indices 0, 1 et 2 (on compte à partir de 0). `v.get(1)` trouve la case 1 et affiche `Some(20)`. `v.get(10)` ne trouve rien et affiche `None`.

#### Pas de `null` : le type `Option`

En C ou en Java, une valeur absente se note `NULL` / `null`, et oublier de le vérifier fait planter le programme. Rust n'a pas de `null`. Une valeur qui **peut manquer** a le type `Option<T>`, qui a exactement deux formes :

- `Some(valeur)` : il y a une valeur ;
- `None` : il n'y en a pas.

Le compilateur oblige à traiter les deux cas avant d'utiliser la valeur.

**Exemple résolu : chercher le premier nombre pair d'une liste.**

```rust
fn main() {
    let nombres = [3, 7, 8, 5];
    let premier_pair = nombres.iter().find(|n| *n % 2 == 0);
    match premier_pair {
        Some(n) => println!("trouvé : {n}"),
        None => println!("aucun nombre pair"),
    }
}
```

1. On parcourt 3 (impair), 7 (impair), 8 (pair) : la recherche s'arrête, on obtient `Some(8)`.
2. Le `match` regarde quelle forme on a : c'est `Some(n)` avec `n = 8`, donc on affiche `trouvé : 8`.
3. Avec la liste `[3, 7, 5]`, on obtiendrait `None` et le message `aucun nombre pair`. Impossible d'oublier ce cas : sans le bras `None`, le code ne compile pas.

**À retenir :** une case hors du tableau = panique (arrêt propre avec message). Une valeur qui peut manquer = `Option` (`Some` ou `None`), jamais `null`.

### Abstraction à coût nul

« Ce que tu n'utilises pas, tu ne le paies pas. Ce que tu utilises, tu ne pourrais pas mieux le coder à la main. » Exemple : une chaîne `.iter().filter().map().sum()` devient la même boucle que si tu l'avais écrite toi-même.

**Exemple résolu : la somme des carrés des nombres pairs de 1 à 6, de deux façons.**

```rust
fn main() {
    let mut total = 0;
    for n in 1..=6 {
        if n % 2 == 0 {
            total += n * n;
        }
    }

    let total_chaine: i32 = (1..=6).filter(|n| n % 2 == 0).map(|n| n * n).sum();

    println!("{total} {total_chaine}");
}
```

Le calcul : on garde 2, 4 et 6 (les pairs), on les met au carré (4, 16, 36), on additionne : 4 + 16 + 36 = **56**. Les deux versions affichent `56 56`. La seconde est plus courte à lire, et une fois compilée en mode optimisé, elle est **aussi rapide** que la boucle écrite à la main.

**À retenir :** en Rust, écrire du code plus lisible (itérateurs, fonctions) ne coûte rien en vitesse.

## 4. L'écosystème

- **Crate** : un paquet Rust (programme ou bibliothèque), publié sur **crates.io**. C'est aussi l'unité que le compilateur compile d'un coup.
- **docs.rs** : la documentation de toutes les crates publiées.
- **blessed.rs** : une sélection commentée de bonnes crates.

Ne confonds pas avec les autres mots : un **module** est un morceau d'une crate (un fichier ou un bloc `mod`), un **trait** est une notion du langage (vue plus tard), un **package npm** est un paquet JavaScript.

> [!tip] Bien choisir une crate
> Mise à jour récente, téléchargements réguliers, issues qui reçoivent des réponses, documentation remplie et peu de dépendances.

**À retenir :** crate = paquet Rust, crates.io = là où on les publie, docs.rs = leur documentation.

## 5. Ce que Rust coûte

> [!warning] Les vrais défauts
> - **Difficile à apprendre** : l'ownership demande quelques semaines d'efforts. C'est le défaut n°1, la première raison d'abandon.
> - **Compilation longue** sur les gros projets (défaut n°2).
> - **L'async** (programmation asynchrone) est la partie la plus difficile.
> - Réécrire en Rust un logiciel qui marche est rarement une bonne idée : on écrit plutôt le **nouveau** code en Rust.

Ce que Rust n'est **pas** : il n'est pas lent (il vise la vitesse du C), il a beaucoup de bibliothèques (crates.io) et il marche sous Windows, macOS et Linux.

**À retenir :** le prix à payer, c'est l'apprentissage (ownership) et le temps de compilation, pas la vitesse.

## 6. Lire une erreur du compilateur

Le compilateur Rust explique ses refus en détail, et propose souvent la correction. Un message se lit en trois parties.

**Exemple résolu :** ce code (à ne pas taper tel quel) appelle `afficher_tout` au lieu de `afficher_total` :

```text
fn afficher_total(n: i32) { println!("{n}"); }

fn main() {
    afficher_tout(5);
}
```

Le compilateur répond :

```text
error[E0425]: cannot find function `afficher_tout` in this scope
 --> src/main.rs:4:5
  |
4 |     afficher_tout(5);
  |     ^^^^^^^^^^^^^ help: a function with a similar name exists: `afficher_total`
```

On le lit dans l'ordre :

1. `error[E0425]` : le **code** de l'erreur, puis son résumé en anglais : « impossible de trouver la fonction `afficher_tout` ici ».
2. `--> src/main.rs:4:5` : **où** regarder : le fichier `src/main.rs`, ligne 4, colonne 5. Les `^^^^` soulignent le morceau fautif.
3. `help:` : la **solution proposée** : « une fonction au nom proche existe : `afficher_total` ». On remplace le nom, et ça compile.

Le code corrigé :

```rust
fn afficher_total(n: i32) {
    println!("{n}");
}

fn main() {
    afficher_total(5);
}
```

> [!tip] Quelques codes d'erreur fréquents
> E0425 : nom introuvable (souvent une faute de frappe). E0308 : types qui ne correspondent pas. E0384 : modification d'une variable non modifiable. Tu les retrouveras dans les chapitres suivants. `rustc --explain E0425` donne une explication complète.

**À retenir :** lis le code de l'erreur, va à la ligne indiquée, puis lis le `help:` jusqu'au bout : il donne souvent la correction exacte.

## 7. Pour apprendre

- *The Rust Programming Language* (« le Book »), de préférence en anglais.
- **Rustlings** : petits exercices à réparer.
- **Rust by Example** : pour retrouver une syntaxe.

## À retenir

- Rust = sûreté mémoire + vitesse du C, **sans ramasse-miettes**, grâce à l'ownership vérifié à la compilation.
- Priorités : Safety > Performance > Productivity.
- `rustup` installe tout, `cargo` sert à tout, `clippy` et `rustfmt` dès le début.
- Une version stable toutes les 6 semaines ; les **éditions** gardent l'ancien code compatible.
- Tableau dépassé = panique ; valeur absente = `Option` (`Some` / `None`), pas de `null`.
- Une erreur se lit : code `E0...`, emplacement `-->`, puis `help:`.
