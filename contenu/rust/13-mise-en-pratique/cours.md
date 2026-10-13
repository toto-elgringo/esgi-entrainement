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

La solution du cours :

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
```

Ce qu'elle utilise :

- `input: &str` en paramètre et `input.lines()` pour parcourir les lignes ;
- `&mut i32` pour modifier un nombre depuis une autre fonction, et `*best` pour lire ou écrire la valeur **derrière** la référence (on dit **déréférencer**) ;
- `line.parse().unwrap_or(0)` : convertit le texte en nombre, et une ligne vide (conversion ratée) donne 0 ;
- `include_str!("../inputs/real_input.txt")` : le contenu du fichier est copié dans le programme à la compilation.

> [!warning] Le piège du dernier lutin
> Le dernier lutin n'est **pas** suivi d'une ligne vide : il faut le traiter **après** la boucle, sinon son total est oublié.

## 3. La boîte à outils

### Lire du texte

| Méthode | Rôle |
|---|---|
| `texte.lines()` | parcourt les lignes (gère aussi les fins de ligne Windows) |
| `texte.split_whitespace()` | découpe en mots, en ignorant les espaces en trop |
| `texte.split(',')` | découpe à chaque virgule |
| `texte.split_once(' ')` | coupe en deux au premier espace : `Option<(&str, &str)>` |
| `texte.trim()` | enlève les espaces au début et à la fin |
| `texte.parse::<u32>()` | convertit en nombre : `Result<u32, _>` |

### Calculer avec les itérateurs

```rust
let totaux = vec![6000, 4000, 11000];
let max = totaux.iter().max();                       // Some(&11000)
let somme: u32 = totaux.iter().sum();                // 21000
let grands: Vec<u32> = totaux.iter().copied().filter(|t| *t > 5000).collect();
```

### Compter avec une `HashMap`

```rust
use std::collections::HashMap;

let mut compte = HashMap::new();
for mot in "le chat et le chien".split_whitespace() {
    *compte.entry(mot).or_insert(0) += 1;
}
```

`entry(mot).or_insert(0)` donne la case du mot, en la créant à 0 si elle n'existe pas encore.

### Gérer les erreurs

```rust
fn lire_nombre(texte: &str) -> Result<i64, String> {
    texte.trim().parse::<i64>().map_err(|_| format!("« {texte} » n'est pas un nombre"))
}

fn somme_de_deux(a: &str, b: &str) -> Result<i64, String> {
    Ok(lire_nombre(a)? + lire_nombre(b)?)
}
```

- `map_err` transforme l'erreur en une erreur à nous ;
- `?` renvoie l'erreur tout de suite si l'opération échoue, sinon donne la valeur.

> [!tip] Avancer par petits pas
> Écris une fonction, clique sur « Vérifier », lis quels tests passent, puis passe à la suivante. Les tests sont là pour te guider, pas seulement pour te noter.

## À retenir

- Lire → découper → tester sur l'exemple → choisir les types.
- `lines()`, `split_whitespace()`, `trim()`, `parse()` pour lire du texte.
- `iter()`, `sum()`, `max()`, `filter()`, `collect()` pour calculer.
- `HashMap::entry().or_insert()` pour compter.
- `Result` + `?` + `map_err` pour les erreurs.
- Ne pas oublier le dernier élément après une boucle de regroupement.
