# Mise en pratique

Ce chapitre ne présente pas de nouvelle notion : il **assemble** tout ce qui a été vu. C'est l'entraînement le plus proche d'un vrai programme, et d'un exercice d'examen.

## 1. Une méthode pour attaquer un problème

1. **Lire l'énoncé** et repérer l'**entrée** (souvent du texte) et la **sortie** attendue (un nombre, une liste...).
2. **Découper** en petites fonctions : une qui lit (*parse*) le texte, une qui calcule, une qui affiche.
3. **Tester d'abord sur l'exemple** donné dans l'énoncé, avant les vraies données.
4. **Choisir les bons types** :

| Besoin | Outil |
|---|---|
| regrouper des données | `struct` |
| un choix entre plusieurs cas | `enum` |
| une valeur qui peut manquer | `Option<T>` |
| une opération qui peut échouer | `Result<T, E>` |
| une liste | `Vec<T>` |
| associer une clé à une valeur | `HashMap<K, V>` |

**Exemple résolu : choisir les types d'une bibliothèque de prêt.** Énoncé : « on enregistre des emprunts et des retours de livres ; on veut savoir combien d'exemplaires de chaque titre restent ; emprunter un titre absent est une erreur ».

| Morceau de l'énoncé | Question à se poser | Type choisi |
|---|---|---|
| « un emprunt **ou** un retour » | un choix entre deux cas ? | `enum Action { Emprunt(String), Retour(String) }` |
| « combien d'exemplaires **de chaque titre** » | une clé (le titre) donne une valeur (le nombre) ? | `HashMap<String, u32>` |
| « emprunter un titre absent est une **erreur** » | l'opération peut échouer ? | `Result<(), ErreurPret>` |
| la liste des actions de la journée | plusieurs valeurs dans l'ordre ? | `Vec<Action>` |

**À retenir :** relis l'énoncé en cherchant les mots « ou » (enum), « de chaque » (HashMap), « peut échouer / erreur » (Result), « peut manquer » (Option), « liste » (Vec).

## 2. L'exemple du cours : Advent of Code 2022, jour 1

**Advent of Code** est un calendrier de l'avent de petits problèmes de programmation (un par jour, du 1er au 25 décembre), parfait pour s'entraîner.

Le problème : des lutins portent de la nourriture. L'entrée liste les calories de chaque aliment, une par ligne ; une **ligne vide** sépare deux lutins.

```text
1000
2000
3000

4000

5000
6000
```

- Partie 1 : le plus gros total porté par un seul lutin.
- Partie 2 : la somme des **trois** plus gros totaux.

La solution du cours (avec un `main` qui la lance sur l'exemple) :

```rust
fn update_best(best: &mut i32, ongoing_total: i32) {
    if *best < ongoing_total {
        *best = ongoing_total;
    }
}

fn part1(input: &str) {
    let mut best = 0;
    let mut ongoing_total = 0;
    for line in input.lines() {
        if line.is_empty() {
            update_best(&mut best, ongoing_total);
            ongoing_total = 0;
        }
        let calories = line.parse().unwrap_or(0);
        ongoing_total += calories;
    }
    update_best(&mut best, ongoing_total);
    println!("{best}");
}

fn main() {
    part1("1000\n2000\n3000\n\n4000\n\n5000\n6000");
}
```

Ce qu'elle utilise :

- `input: &str` en paramètre et `input.lines()` pour parcourir les lignes ;
- `&mut i32` pour modifier un nombre depuis une autre fonction, et `*best` pour lire ou écrire la valeur **derrière** la référence (on dit **déréférencer**) ;
- `line.parse().unwrap_or(0)` : convertit le texte en nombre, et une ligne vide (conversion ratée) donne 0 ;
- `include_str!("../inputs/real_input.txt")` : le contenu du fichier est copié dans le programme à la compilation.

```text
const ENTREE: &str = include_str!("../inputs/real_input.txt");
```

`include_str!` est une **macro** (le `!`) : au moment de compiler, elle lit le fichier et colle son texte dans le programme, comme si on l'avait écrit entre guillemets. Le résultat est un `&'static str`. À l'exécution, le fichier n'est plus lu (on peut même le supprimer). Le chemin est relatif au fichier `.rs` qui contient la ligne.

> [!warning] Le piège du dernier lutin
> Le dernier lutin n'est **pas** suivi d'une ligne vide : il faut le traiter **après** la boucle, sinon son total est oublié.

**Exemple résolu : dérouler la boucle sur l'exemple.** On suit `ongoing_total` (le lutin en cours) et `best` (le record) ligne par ligne :

| Ligne lue | Vide ? | Ce qui se passe | `ongoing_total` | `best` |
|---|---|---|---|---|
| `1000` | non | + 1000 | 1000 | 0 |
| `2000` | non | + 2000 | 3000 | 0 |
| `3000` | non | + 3000 | 6000 | 0 |
| (vide) | oui | record ? 0 < 6000 oui ; remise à 0 | 0 | 6000 |
| `4000` | non | + 4000 | 4000 | 6000 |
| (vide) | oui | record ? 6000 < 4000 non ; remise à 0 | 0 | 6000 |
| `5000` | non | + 5000 | 5000 | 6000 |
| `6000` | non | + 6000 | 11000 | 6000 |
| après la boucle | | record ? 6000 < 11000 oui | | **11000** |

Sans la dernière ligne du tableau, le programme afficherait 6000 au lieu de 11000. Sur une ligne vide, `"".parse()` échoue et `unwrap_or(0)` ajoute 0 : ça ne change rien au total.

`*best < ongoing_total` lit le nombre derrière la référence, `*best = ongoing_total` écrit dedans. Sans l'étoile, on comparerait une référence à un nombre : ça ne compile pas.

Sous Windows, les lignes finissent par `\r\n` au lieu de `\n`. `lines()` enlève les deux, donc une ligne vide reste bien vide. Ajouter `trim()` sur chaque ligne protège en plus des espaces en trop.

**À retenir :** dans une boucle qui regroupe des lignes, on « ferme » un groupe à chaque séparateur **et une dernière fois après la boucle**.

### Partie 2 : garder tous les totaux, puis trier

Pour la partie 2, au lieu de garder seulement le record, on range **chaque** total dans un `Vec` (avec `push` à chaque ligne vide, et après la boucle), puis on trie du plus grand au plus petit et on additionne les premiers.

```rust
fn somme_des_meilleurs(scores: &[u32], combien: usize) -> u32 {
    let mut tries = scores.to_vec();
    tries.sort_unstable_by(|a, b| b.cmp(a));
    println!("{tries:?}");
    tries.iter().take(combien).sum()
}

fn main() {
    println!("{}", somme_des_meilleurs(&[12, 40, 7, 25], 2));
    println!("{}", somme_des_meilleurs(&[9], 2));
}
```

**Exemple résolu :**

1. `scores.to_vec()` copie la tranche dans un nouveau `Vec`, qu'on a le droit de trier (on ne trie pas une liste qu'on a seulement empruntée en lecture).
2. `a.cmp(b)` compare deux valeurs et dit si `a` est plus petit, égal ou plus grand que `b`. `sort()` range du plus petit au plus grand.
3. `sort_unstable_by(|a, b| b.cmp(a))` : on **inverse** `a` et `b` dans la comparaison, donc le tri se fait du plus grand au plus petit : `[40, 25, 12, 7]`.
4. `.iter().take(2)` garde les 2 premiers éléments : `40` et `25`. `.sum()` les additionne : `65`.
5. S'il y a moins d'éléments que demandé, `take` prend ce qui existe : avec `[9]`, `take(2)` donne seulement `9`, la somme vaut `9` (pas de panique).

Le programme affiche `[40, 25, 12, 7]`, `65`, `[9]`, `9`. Autre façon de trier à l'envers : `tries.sort();` puis `tries.reverse();`.

**À retenir :** « les N plus grands » = trier à l'envers (`b.cmp(a)`) puis `iter().take(N)`.

## 3. La boîte à outils

### Lire du texte

| Méthode | Rôle |
|---|---|
| `texte.lines()` | parcourt les lignes (gère aussi les fins de ligne Windows) |
| `texte.split_whitespace()` | découpe en mots, en ignorant les espaces en trop |
| `texte.split(',')` | découpe à chaque virgule |
| `texte.split(\|c: char\| ...)` | découpe à chaque caractère pour lequel la closure renvoie `true` |
| `texte.split_once(' ')` | coupe en deux au premier espace : `Option<(&str, &str)>` |
| `texte.trim()` | enlève les espaces au début et à la fin |
| `texte.parse::<u32>()` | convertit en nombre : `Result<u32, _>` |
| `texte.to_lowercase()` | une nouvelle `String` en minuscules |
| `c.is_alphanumeric()` | vrai si le caractère `c` est une lettre (accents compris) ou un chiffre |

`split_once` renvoie `Some((avant, après))` si le séparateur est trouvé (seulement le **premier**), et `None` sinon : `"x=1=2".split_once('=')` donne `Some(("x", "1=2"))`, `"abc".split_once('=')` donne `None`.

**Exemple résolu : découper selon une condition.**

```rust
let texte = "Salut, l'ami ! Ça va ?";
let morceaux: Vec<&str> = texte.split(|c: char| !c.is_alphanumeric()).collect();
println!("{morceaux:?}");

let mots: Vec<String> = texte
    .split(|c: char| !c.is_alphanumeric())
    .filter(|morceau| !morceau.is_empty())
    .map(|morceau| morceau.to_lowercase())
    .collect();
println!("{mots:?}");
```

1. La closure `|c: char| !c.is_alphanumeric()` renvoie `true` pour tout ce qui n'est **ni** une lettre **ni** un chiffre : la virgule, l'espace, l'apostrophe, `!`, `?`. Le texte est coupé à chacun de ces caractères.
2. Deux séparateurs qui se suivent (`,` puis espace) laissent un morceau **vide** entre eux, et un séparateur à la fin laisse un morceau vide après lui. On obtient : `["Salut", "", "l", "ami", "", "", "Ça", "va", "", ""]`.
3. `.filter(|morceau| !morceau.is_empty())` garde seulement les morceaux non vides.
4. `.map(|morceau| morceau.to_lowercase())` met chaque morceau en minuscules (`"Ça"` devient `"ça"`).
5. `.collect()` range le tout dans un `Vec<String>` : `["salut", "l", "ami", "ça", "va"]`, soit 5 mots.

**À retenir :** découper selon une condition = `split(closure)` puis **toujours** enlever les morceaux vides avec `filter`.

### Calculer avec les itérateurs

```rust
let totaux = [6000, 4000, 11000];
let max = totaux.iter().max();                       // Some(&11000)
let somme: u32 = totaux.iter().sum();                // 21000
let grands: Vec<u32> = totaux.iter().copied().filter(|t| *t > 5000).collect();
println!("{max:?} {somme} {grands:?}");
```

- `max()` renvoie une `Option` (une liste vide n'a pas de maximum) contenant une **référence** vers l'élément : `Some(&11000)`.
- `sum()` a besoin qu'on lui dise le type du résultat (`let somme: u32`).
- `copied()` transforme les `&u32` en `u32` (copie de chaque nombre), ce qui permet de ranger des `u32` dans `grands` : `[6000, 11000]`.

**Exemple résolu : additionner seulement certains cas.** On veut le nombre total de pas en avant d'un trajet, où chaque élément peut être un pas en avant, en arrière ou un arrêt. On transforme chaque élément en nombre avec `map` + `match`, puis on additionne :

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
enum Mouvement {
    Avancer(u32),
    Reculer(u32),
    Stop,
}

fn main() {
    let trajet = [Mouvement::Avancer(3), Mouvement::Reculer(1), Mouvement::Stop, Mouvement::Avancer(2)];
    let total_avance: u32 = trajet
        .iter()
        .map(|mouvement| match mouvement {
            Mouvement::Avancer(pas) => *pas,
            _ => 0,
        })
        .sum();
    println!("{total_avance}");
}
```

| Élément | Bras du `match` | Nombre produit |
|---|---|---|
| `Avancer(3)` | `Avancer(pas)` avec `pas = 3` | 3 |
| `Reculer(1)` | `_` (tout le reste) | 0 |
| `Stop` | `_` | 0 |
| `Avancer(2)` | `Avancer(pas)` avec `pas = 2` | 2 |

`iter()` donne des références, donc `pas` est un `&u32` : `*pas` lit le nombre. Somme : `3 + 0 + 0 + 2 = 5`, le programme affiche `5`.

**À retenir :** « la somme de certains cas » = `iter().map(|x| match x { cas voulu => valeur, _ => 0 }).sum()`.

### Compter avec une `HashMap`

```rust
use std::collections::HashMap;

let mut compte = HashMap::new();
for mot in "le chat et le chien".split_whitespace() {
    *compte.entry(mot).or_insert(0) += 1;
}
println!("{:?}", compte.get("le"));
```

`entry(mot).or_insert(0)` donne la case du mot, en la créant à 0 si elle n'existe pas encore.

En détail : `entry(mot)` cherche la case du mot ; `or_insert(0)` la crée avec 0 si elle manque, puis renvoie une référence modifiable (`&mut`) vers le nombre ; l'étoile `*` permet d'écrire dans ce nombre ; `+= 1` ajoute 1.

| Mot lu | Case existe ? | Après `+= 1` |
|---|---|---|
| `le` | non : créée à 0 | `le → 1` |
| `chat` | non : créée à 0 | `chat → 1` |
| `et` | non : créée à 0 | `et → 1` |
| `le` | oui (1) | `le → 2` |
| `chien` | non : créée à 0 | `chien → 1` |

Le programme affiche `Some(2)`.

Les autres outils d'une `HashMap` :

| Écriture | Rôle |
|---|---|
| `table.get(cle)` | `Some(&valeur)` ou `None` |
| `table.get(cle).copied().unwrap_or(0)` | la valeur (copiée), ou 0 si la clé manque |
| `table.insert(cle, valeur)` | crée ou **remplace** la valeur |
| `table.remove(cle)` | enlève la clé (et sa valeur) |
| `for (cle, valeur) in &table` | parcourt les couples, dans un ordre **imprévisible** |

> [!warning] Une `HashMap` n'a pas d'ordre
> L'ordre de parcours change d'une exécution à l'autre. Pour un affichage ou un résultat stable, range les couples dans un `Vec` et trie-le.

**Exemple résolu : le plat le plus voté, et ceux qui ont peu de votes.**

```rust
use std::collections::HashMap;

let mut votes: HashMap<&str, u32> = HashMap::new();
for choix in ["pizza", "sushi", "pizza", "tacos", "sushi"] {
    *votes.entry(choix).or_insert(0) += 1;
}

let mut gagnant: Option<(&str, u32)> = None;
for (&plat, &nombre) in &votes {
    let meilleur = match gagnant {
        None => true,
        Some((plat_g, nombre_g)) => nombre > nombre_g || (nombre == nombre_g && plat < plat_g),
    };
    if meilleur {
        gagnant = Some((plat, nombre));
    }
}
println!("{gagnant:?}");

let mut peu_votes: Vec<&str> = votes
    .iter()
    .filter(|(_, nombre)| **nombre < 2)
    .map(|(plat, _)| *plat)
    .collect();
peu_votes.sort();
println!("{peu_votes:?}");
```

1. Comptage : `pizza → 2`, `sushi → 2`, `tacos → 1`.
2. Pour le gagnant, on garde le meilleur couple vu jusqu'ici. Un couple remplace le gagnant s'il a **plus** de votes, ou **autant** de votes et un nom plus petit dans l'ordre alphabétique (`plat < plat_g` compare deux textes lettre par lettre : `"pizza" < "sushi"` car `p` vient avant `s`).
3. Peu importe l'ordre de parcours : `pizza` et `sushi` sont à égalité (2), et `pizza` gagne toujours car il est avant dans l'alphabet. Résultat : `Some(("pizza", 2))`. Si la table est vide, `gagnant` reste `None`.
4. Pour `peu_votes`, `iter()` donne des couples de **références** `(&&str, &u32)`, et `filter` reçoit en plus une référence vers chaque couple : il faut deux étoiles, `**nombre`, pour atteindre le nombre. Seul `tacos` (1) est `< 2`.
5. `sort()` met la liste dans l'ordre alphabétique, puisque l'ordre de la `HashMap` est imprévisible. Le programme affiche `["tacos"]`.

La même recherche du gagnant s'écrit avec un itérateur : `into_iter().max_by(|(plat_a, n_a), (plat_b, n_b)| n_a.cmp(n_b).then(plat_b.cmp(plat_a)))`. `then` sert à départager : si les nombres sont égaux, on compare les noms **à l'envers** (le plus petit nom est considéré comme le « plus grand », donc gagne).

**À retenir :** compter = `*table.entry(cle).or_insert(0) += 1` ; chercher le meilleur = parcourir en gardant le meilleur, avec une règle claire pour les égalités ; afficher = trier d'abord.

### Modéliser avec `enum` et `struct`

Une variante d'`enum` peut porter des données : entre parenthèses (`Avancer(u32)`), ou avec des noms de champs entre accolades (comme une struct).

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
enum Mouvement {
    Avancer(u32),
    Reculer(u32),
    Stop,
}

#[derive(Debug, PartialEq)]
enum ErreurTexte {
    Vide,
    TropLong { longueur: usize, maximum: usize },
}

fn decrire(mouvement: Mouvement) -> String {
    match mouvement {
        Mouvement::Avancer(0) | Mouvement::Reculer(0) => String::from("sur place"),
        Mouvement::Avancer(pas) => format!("{pas} pas en avant"),
        Mouvement::Reculer(pas) => format!("{pas} pas en arrière"),
        Mouvement::Stop => String::from("arrêt"),
    }
}

fn verifier(texte: &str) -> Result<(), ErreurTexte> {
    if texte.is_empty() {
        return Err(ErreurTexte::Vide);
    }
    if texte.len() > 5 {
        return Err(ErreurTexte::TropLong { longueur: texte.len(), maximum: 5 });
    }
    Ok(())
}

fn main() {
    let trajet = [Mouvement::Avancer(3), Mouvement::Reculer(0), Mouvement::Stop];
    for mouvement in trajet {
        println!("{}", decrire(mouvement));
    }
    println!("{}", trajet[0] == Mouvement::Avancer(3));
    println!("{:?}", verifier("bonjour"));
    println!("{:?}", verifier("oui"));
}
```

Les `derive` ajoutent des capacités au type :

| `derive` | Permet |
|---|---|
| `Debug` | l'afficher avec `{:?}` |
| `Clone`, `Copy` | le copier comme un nombre : après `let b = a;` ou après l'avoir mis dans un `Vec`, `a` reste utilisable |
| `PartialEq` | le comparer avec `==` (nécessaire pour `assert_eq!`) |

**Exemple résolu : lire le `match` de `decrire`.**

1. Les bras sont essayés **dans l'ordre**, le premier qui correspond gagne.
2. `Mouvement::Avancer(0) | Mouvement::Reculer(0)` : le `|` veut dire « ou », et le `0` exige que la donnée vaille exactement 0. `Reculer(0)` tombe ici : `"sur place"`.
3. `Mouvement::Avancer(pas)` : n'importe quelle valeur, rangée dans la variable `pas`. `Avancer(3)` donne `"3 pas en avant"`. Ce bras doit venir **après** le cas 0, sinon il l'attraperait aussi.
4. `Stop` n'a pas de donnée : `"arrêt"`.
5. Grâce à `Copy`, la boucle `for mouvement in trajet` copie les éléments : `trajet[0]` est encore utilisable après, et `==` (grâce à `PartialEq`) affiche `true`.
6. `verifier("bonjour")` : 7 octets > 5, on renvoie `Err(TropLong { longueur: 7, maximum: 5 })`. `verifier("oui")` passe les deux tests : `Ok(())`.

`Result<(), E>` : `()` (le type vide) veut dire « rien à renvoyer en cas de réussite », et `Ok(())` dit « ça a marché ».

**À retenir :** cas particulier (valeur précise) **avant** cas général dans un `match` ; `derive(Debug, PartialEq)` pour tester, `Copy` pour réutiliser une valeur après l'avoir rangée.

### Gérer les erreurs

```rust
fn lire_nombre(texte: &str) -> Result<i64, String> {
    texte.trim().parse::<i64>().map_err(|_| format!("« {texte} » n'est pas un nombre"))
}

fn somme_de_deux(a: &str, b: &str) -> Result<i64, String> {
    Ok(lire_nombre(a)? + lire_nombre(b)?)
}

fn main() {
    println!("{:?}", somme_de_deux("4", " -6 "));
    println!("{:?}", somme_de_deux("4", "six"));
}
```

- `map_err` transforme l'erreur en une erreur à nous ;
- `?` renvoie l'erreur tout de suite si l'opération échoue, sinon donne la valeur.

Ici : `somme_de_deux("4", " -6 ")` donne `Ok(-2)` (`trim` enlève les espaces, `parse::<i64>` accepte le signe moins) ; `somme_de_deux("4", "six")` donne `Err("« six » n'est pas un nombre")` : le deuxième `?` arrête la fonction.

| Outil | Part de | Donne |
|---|---|---|
| `option.ok_or_else(\|\| erreur)` | `Option<T>` | `Result<T, E>` : `None` devient `Err(erreur)` |
| `resultat.map_err(\|e\| autre)` | `Result<T, E>` | `Result<T, F>` : l'erreur est transformée |
| `valeur?` | `Result<T, E>` | la valeur si `Ok`, sinon **sortie immédiate** de la fonction avec `Err` |
| `tableau.contains(&x)` | une liste | `true` si `x` est dedans |

**Exemple résolu : un nom puis une valeur obligatoire.**

```rust
let connus = ["volume", "luminosite"];
let mut morceaux = "  volume  ".split_whitespace();
let nom = morceaux.next().unwrap_or("");
let valeur = morceaux.next().ok_or_else(|| format!("{nom} : valeur manquante"));
println!("{} {valeur:?}", connus.contains(&nom));
```

1. `split_whitespace()` sur `"  volume  "` ne donne qu'un morceau : `"volume"`.
2. Le premier `next()` donne `Some("volume")`, donc `nom = "volume"`.
3. Le deuxième `next()` donne `None` : `ok_or_else` le transforme en `Err("volume : valeur manquante")`. Dans une fonction qui renvoie un `Result`, on ajouterait `?` pour s'arrêter là.
4. `connus.contains(&nom)` vaut `true` : on passe `&nom` car `contains` attend une référence vers un élément de la liste.

Le programme affiche `true Err("volume : valeur manquante")`.

**Exemple résolu : une erreur avec son numéro de ligne.**

```rust
#[derive(Debug, PartialEq)]
enum ErreurNote {
    PasUnNombre(String),
    TropGrande { note: u32, maximum: u32 },
}

fn lire_note(texte: &str) -> Result<u32, ErreurNote> {
    let propre = texte.trim();
    let note = propre
        .parse::<u32>()
        .map_err(|_| ErreurNote::PasUnNombre(propre.to_string()))?;
    if note > 20 {
        return Err(ErreurNote::TropGrande { note, maximum: 20 });
    }
    Ok(note)
}

fn somme_des_notes(texte: &str) -> Result<u32, (usize, ErreurNote)> {
    let mut somme = 0;
    for (index, ligne) in texte.lines().enumerate() {
        if ligne.trim().is_empty() {
            continue;
        }
        let note = lire_note(ligne).map_err(|erreur| (index + 1, erreur))?;
        somme += note;
    }
    Ok(somme)
}

fn main() {
    println!("{:?}", somme_des_notes("12\n\n15"));
    println!("{:?}", somme_des_notes("12\nabc\n25"));
}
```

1. `enumerate()` donne chaque ligne avec son **indice**, qui commence à **0**. Pour un numéro de ligne « humain », on écrit `index + 1`.
2. `continue` saute directement à la ligne suivante : les lignes vides sont ignorées, mais elles **comptent** quand même dans la numérotation (l'indice avance).
3. `lire_note(ligne)` renvoie une `ErreurNote` ; `map_err(|erreur| (index + 1, erreur))` la range dans un couple avec le numéro de ligne ; `?` renvoie ce couple et arrête la boucle.

| Programme | Ligne 1 | Ligne 2 | Ligne 3 | Résultat |
|---|---|---|---|---|
| `"12\n\n15"` | 12 (somme 12) | vide : sautée | 15 (somme 27) | `Ok(27)` |
| `"12\nabc\n25"` | 12 (somme 12) | `abc` : erreur, **arrêt** | jamais lue | `Err((2, PasUnNombre("abc")))` |

Dans le deuxième cas, la ligne 3 (25, trop grande) n'est jamais lue : `?` s'arrête à la **première** erreur.

**À retenir :** `Option` → `ok_or_else` ; erreur à enrichir → `map_err` ; puis `?` pour s'arrêter à la première erreur.

### Afficher avec `Display`

Pour qu'un type s'affiche avec `{}` (et `format!("{x}")`), on implémente le trait `fmt::Display` : une méthode `fmt` qui **écrit** dans `f` avec la macro `write!` (qui marche comme `format!`).

```rust
use std::fmt;

struct Heure {
    heures: u32,
    minutes: u32,
}

impl fmt::Display for Heure {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}h{:02}", self.heures, self.minutes)
    }
}

fn main() {
    let rendez_vous = Heure { heures: 9, minutes: 5 };
    println!("{rendez_vous}");
    let texte = format!("à {rendez_vous}");
    println!("{texte}");
}
```

`{:02}` écrit le nombre sur 2 chiffres en complétant avec des 0 : `5` devient `05`. Le programme affiche `9h05` puis `à 9h05`. `write!` renvoie un `fmt::Result`, qu'on renvoie tel quel (pas de `;` à la fin).

**Exemple résolu : afficher une table dans l'ordre, une ligne par élément, sans retour à la ligne final.**

```rust
use std::collections::HashMap;

let mut notes: HashMap<String, u32> = HashMap::new();
notes.insert("Zoé".to_string(), 15);
notes.insert("Adam".to_string(), 12);

let mut couples: Vec<(&String, &u32)> = notes.iter().collect();
couples.sort();
let lignes: Vec<String> = couples
    .iter()
    .map(|(nom, note)| format!("{nom} -> {note}"))
    .collect();
let texte = lignes.join("\n");
println!("{texte}");
println!("{}", texte.ends_with('\n'));
```

1. `notes.iter().collect()` range les couples (nom, note) dans un `Vec`, dans l'ordre imprévisible de la `HashMap`.
2. `sort()` sur des couples trie d'abord sur le premier élément (le nom) : `Adam` avant `Zoé`.
3. `map` + `format!` fabrique une ligne de texte par couple : `"Adam -> 12"`, `"Zoé -> 15"`.
4. `join("\n")` colle les lignes en mettant `\n` **entre** elles, pas après la dernière : `"Adam -> 12\nZoé -> 15"`. Avec une liste vide, `join` donne `""`.
5. Dans un `impl fmt::Display`, on terminerait par `write!(f, "{}", texte)`.

Le programme affiche les deux lignes puis `false` (pas de `\n` à la fin).

**À retenir :** `Display` = `impl fmt::Display` + `write!(f, ...)` ; pour plusieurs lignes : trier, fabriquer chaque ligne, puis `join("\n")`.

> [!tip] Avancer par petits pas
> Écris une fonction, clique sur « Vérifier », lis quels tests passent, puis passe à la suivante. Les tests sont là pour te guider, pas seulement pour te noter.

## À retenir

- Lire → découper → tester sur l'exemple → choisir les types.
- `lines()`, `split_whitespace()`, `split(closure)`, `trim()`, `parse()` pour lire du texte (et enlever les morceaux vides).
- `iter()`, `sum()`, `max()`, `filter()`, `map()`, `take()`, `collect()` pour calculer ; `sort_unstable_by(|a, b| b.cmp(a))` pour trier à l'envers.
- `HashMap::entry().or_insert()` pour compter ; trier avant d'afficher, car une `HashMap` n'a pas d'ordre.
- `enum` avec données + `match` (cas précis avant cas général) ; `derive(Debug, Clone, Copy, PartialEq)`.
- `Result` + `?` + `map_err` / `ok_or_else` pour les erreurs ; `enumerate()` + 1 pour les numéros de ligne.
- `impl fmt::Display` + `write!` pour afficher avec `{}`.
- Ne pas oublier le dernier élément après une boucle de regroupement.
