# Découvrir Rust

## 1. Installer Rust

Tout passe par **rustup**, un programme qui installe et met à jour les outils Rust. Il gère plusieurs **toolchains** (versions complètes des outils).

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

### Les outils installés

| Outil | Rôle |
|---|---|
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

> [!info] Ramasse-miettes (garbage collector)
> Un programme qui tourne en arrière-plan pour libérer la mémoire inutilisée (Java, Python, JavaScript). Rust n'en a **pas** : la mémoire est libérée à un moment connu, décidé à la compilation.

### Les éditions

Chaque projet choisit son **édition** (2015, 2018, 2021, 2024) dans `Cargo.toml`. Une édition est un jeu de règles de syntaxe. Des projets d'éditions différentes fonctionnent ensemble : le langage évolue sans casser l'ancien code.

## 3. Les trois priorités (dans cet ordre)

1. **Safety** (sûreté) : pas d'erreur mémoire, pas de bug entre threads.
2. **Performance** : aussi rapide que le C.
3. **Productivity** : de bons outils, une bonne documentation.

En cas de conflit, la sûreté gagne toujours. C'est pour ça que le compilateur refuse parfois du code que tu penses correct : il préfère refuser que prendre un risque.

### Les bugs que Rust empêche

| Bug | En C/C++ | En Rust |
|---|---|---|
| utiliser une mémoire déjà libérée | lecture de données au hasard | refusé à la compilation |
| libérer deux fois | corruption de la mémoire | impossible (un seul propriétaire) |
| dépasser la fin d'un tableau | écrit chez le voisin | vérifié, arrêt propre (panique) |
| pointeur `NULL` | plantage | pas de `null`, on utilise `Option` |
| deux threads modifient la même donnée | résultat aléatoire | refusé à la compilation |

Environ **70 %** des failles de sécurité de Microsoft et de Chrome viennent d'erreurs mémoire.

### Abstraction à coût nul

« Ce que tu n'utilises pas, tu ne le paies pas. Ce que tu utilises, tu ne pourrais pas mieux le coder à la main. » Exemple : une chaîne `.iter().filter().map().sum()` devient la même boucle que si tu l'avais écrite toi-même.

## 4. L'écosystème

- **Crate** : un paquet Rust (programme ou bibliothèque), publié sur **crates.io**.
- **docs.rs** : la documentation de toutes les crates publiées.
- **blessed.rs** : une sélection commentée de bonnes crates.

> [!tip] Bien choisir une crate
> Mise à jour récente, téléchargements réguliers, issues qui reçoivent des réponses, documentation remplie et peu de dépendances.

## 5. Ce que Rust coûte

> [!warning] Les vrais défauts
> - **Difficile à apprendre** : l'ownership demande quelques semaines d'efforts.
> - **Compilation longue** sur les gros projets.
> - **L'async** (programmation asynchrone) est la partie la plus difficile.
> - Réécrire en Rust un logiciel qui marche est rarement une bonne idée : on écrit plutôt le **nouveau** code en Rust.

## 6. Pour apprendre

- *The Rust Programming Language* (« le Book »), de préférence en anglais.
- **Rustlings** : petits exercices à réparer.
- **Rust by Example** : pour retrouver une syntaxe.

## À retenir

- Rust = sûreté mémoire + vitesse du C, **sans ramasse-miettes**, grâce à des vérifications à la compilation.
- Priorités : Safety > Performance > Productivity.
- `rustup` installe tout, `cargo` sert à tout, `clippy` et `rustfmt` dès le début.
- Une version stable toutes les 6 semaines ; les **éditions** gardent l'ancien code compatible.
