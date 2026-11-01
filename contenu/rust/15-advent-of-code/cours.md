# Algorithmique : Advent of Code

L'**Advent of Code** (AoC) est un calendrier de l'avent pour développeurs : du 1er au 25 décembre, une énigme par jour, de plus en plus difficile. Chaque énigme a **deux parties** : la partie 2 se débloque quand tu as trouvé la partie 1, et elle reprend la même histoire avec une difficulté en plus. Chaque joueur reçoit sa **propre entrée** (un gros fichier de texte), donc sa propre réponse.

C'est le meilleur entraînement à l'algorithmique : lire des données, choisir les bonnes structures, trouver une méthode assez rapide.

> [!info] Comment ça marche ici
> - Les énoncés de ce chapitre sont **réécrits** avec nos propres exemples (l'auteur d'AoC demande de ne pas recopier ses textes ni ses entrées). Le lien vers l'énigme originale est en haut de chaque exercice.
> - **Vérifier** lance les tests sur l'exemple de l'énoncé.
> - Pour ta vraie énigme : colle ton entrée dans **Entrée du programme**, puis **Exécuter**. Le programme affiche tes deux réponses, à donner sur le site d'AoC.
> - Le programme est compilé en mode debug (plus lent) et arrêté au bout de 10 secondes : une bonne méthode répond en moins d'une seconde.

## 1. La méthode

1. **Lis l'énoncé jusqu'au bout** et repère : ce qu'on te donne, ce qu'on te demande, les cas particuliers.
2. **Lis l'entrée** et range-la dans une structure adaptée (`Vec`, grille, `HashMap`…). C'est souvent la moitié du travail.
3. **Résous l'exemple d'abord** : il est petit, tu peux vérifier à la main. Les tests sont là pour ça.
4. **Lance sur la vraie entrée.**
5. **Partie 2** : c'est souvent « la même chose, mais beaucoup plus grand ». Si ta solution naïve met des heures, il faut changer de méthode, pas d'ordinateur.

> [!tip] Découpe en petites fonctions
> Une fonction pour lire l'entrée, une pour la partie 1, une pour la partie 2. La lecture sert presque toujours aux deux parties.

## 2. Lire les données

Les entrées AoC sont du texte. Les outils de base :

| Besoin | Code |
|---|---|
| Parcourir les lignes | `entree.lines()` (gère aussi `\r\n`) |
| Enlever les espaces autour | `ligne.trim()` |
| Couper en deux sur un séparateur | `ligne.split_once(" -> ")` |
| Couper sur une virgule | `ligne.split(',')` |
| Couper sur les espaces (même multiples) | `ligne.split_whitespace()` |
| Transformer en nombre | `morceau.parse::<u64>()` |
| Enlever un début connu | `ligne.strip_prefix("Game ")` |
| Lire un chiffre | `caractere.to_digit(10)` |

```rust
let ligne = "move 3 from 1 to 2";
let nombres: Vec<usize> = ligne
    .split_whitespace()
    .filter_map(|mot| mot.parse().ok())
    .collect();
println!("{nombres:?}");
```

Pour des **blocs séparés par une ligne vide**, découpe sur `"\n\n"`. Remplace d'abord les fins de ligne Windows, sinon les blocs ne sont pas trouvés :

```rust
let entree = "1\r\n2\r\n\r\n3\r\n4";
let texte = entree.replace("\r\n", "\n");
let blocs: Vec<u32> = texte
    .split("\n\n")
    .map(|bloc| bloc.lines().map(|ligne| ligne.parse::<u32>().unwrap()).sum())
    .collect();
println!("{blocs:?}");
```

> [!warning] Les pièges de lecture
> - Une **ligne vide à la fin** du fichier : filtre-la ou utilise `lines()`, qui l'ignore.
> - Les **espaces multiples** : `split(' ')` donne des morceaux vides, `split_whitespace()` non.
> - `parse().unwrap()` panique sur une ligne inattendue : pendant la mise au point, `expect("ligne illisible")` aide à trouver laquelle.

## 3. Les grilles

Beaucoup d'énigmes se passent sur une carte en 2D. On la range en `Vec<Vec<u8>>` (un octet par case, plus simple que `char` pour du texte ASCII) :

```rust
let entree = "#..\n.#.\n..#";
let grille: Vec<Vec<u8>> = entree.lines().map(|ligne| ligne.bytes().collect()).collect();
println!("{} lignes, {} colonnes, case (1, 1) = {}", grille.len(), grille[0].len(), grille[1][1] as char);
```

Pour les **voisins** d'une case, garde une liste de directions et vérifie les bords. `checked_add_signed` renvoie `None` si on passe sous zéro :

```rust
const DIRECTIONS: [(isize, isize); 4] = [(-1, 0), (1, 0), (0, -1), (0, 1)];

fn voisins(ligne: usize, colonne: usize, hauteur: usize, largeur: usize) -> Vec<(usize, usize)> {
    DIRECTIONS
        .iter()
        .filter_map(|&(dl, dc)| {
            let l = ligne.checked_add_signed(dl)?;
            let c = colonne.checked_add_signed(dc)?;
            (l < hauteur && c < largeur).then_some((l, c))
        })
        .collect()
}

fn main() {
    println!("{:?}", voisins(0, 0, 3, 3));
    println!("{:?}", voisins(1, 1, 3, 3));
}
```

Pour les **diagonales**, ajoute les 4 directions `(-1, -1)`, `(-1, 1)`, `(1, -1)`, `(1, 1)`.

> [!tip] Grille immense ou presque vide
> Si la carte est infinie ou n'a que quelques cases utiles, range seulement les cases intéressantes dans un `HashSet<(i64, i64)>` ou une `HashMap<(i64, i64), T>`.

## 4. Choisir la bonne structure

| Structure | Pour… | Opération rapide |
|---|---|---|
| `Vec<T>` | une liste, une grille | accès par position |
| `HashMap<K, V>` | compter, associer un nom à une valeur | chercher par clé |
| `HashSet<T>` | « déjà vu ? », éléments uniques | `contains`, `insert` |
| `VecDeque<T>` | une file (premier arrivé, premier servi) | `push_back`, `pop_front` |
| `BinaryHeap<T>` | toujours sortir le plus grand | `push`, `pop` |
| `BTreeMap<K, V>` | une `HashMap` triée par clé | parcours dans l'ordre |

Compter des éléments est un classique :

```rust
use std::collections::HashMap;

let mots = ["pomme", "poire", "pomme", "kiwi", "pomme"];
let comptes = mots.iter().fold(HashMap::new(), |mut comptes, mot| {
    *comptes.entry(*mot).or_insert(0) += 1;
    comptes
});
println!("pomme : {}", comptes["pomme"]);
```

## 5. Compter au lieu de simuler

Quand la partie 2 demande « la même chose, mais 1000 fois plus », la solution naïve devient trop lente. Il faut estimer le **nombre d'opérations** :

| Opérations | Temps (à peu près) |
|---|---|
| 1 million | instantané |
| 100 millions | environ une seconde en release, beaucoup plus en debug |
| 10 milliards | trop long |

Un nombre qui **double** à chaque étape dépasse le milliard en 30 étapes. Si une population grandit comme ça, on ne garde pas chaque individu : on garde **combien** il y en a de chaque sorte.

Exemple : chaque jour, les jeunes lapins deviennent adultes et chaque adulte donne naissance à un jeune. Combien de lapins après 80 jours, en partant d'un jeune ?

```rust
let (mut jeunes, mut adultes) = (1u64, 0u64);
for _ in 0..80 {
    (jeunes, adultes) = (adultes, adultes + jeunes);
}
println!("{} lapins", jeunes + adultes);
```

Il y en a des dizaines de millions de milliards : impossible de les ranger un par un dans un `Vec`. Deux compteurs suffisent, quelle que soit la taille de la population.

> [!warning] Débordement
> Les réponses AoC dépassent souvent 4 milliards : utilise `u64` (ou `i64` si c'est négatif). En debug, un `u32` qui déborde fait **paniquer** le programme.

## 6. Le parcours en largeur (BFS)

Pour le **plus court chemin** quand chaque pas coûte pareil (une case = 1 pas), on explore les cases par distance croissante avec une **file** (`VecDeque`) : d'abord tous les voisins à distance 1, puis à distance 2, etc. La première fois qu'on atteint l'arrivée, c'est par le chemin le plus court.

```rust
use std::collections::VecDeque;

fn plus_court(grille: &[&[u8]], depart: (usize, usize), arrivee: (usize, usize)) -> Option<usize> {
    let (hauteur, largeur) = (grille.len(), grille[0].len());
    let mut distances = vec![vec![usize::MAX; largeur]; hauteur];
    let mut file = VecDeque::from([depart]);
    distances[depart.0][depart.1] = 0;
    while let Some((l, c)) = file.pop_front() {
        if (l, c) == arrivee {
            return Some(distances[l][c]);
        }
        let candidats = [(l.wrapping_sub(1), c), (l + 1, c), (l, c.wrapping_sub(1)), (l, c + 1)];
        for (nl, nc) in candidats {
            if nl < hauteur && nc < largeur && grille[nl][nc] != b'#' && distances[nl][nc] == usize::MAX {
                distances[nl][nc] = distances[l][c] + 1;
                file.push_back((nl, nc));
            }
        }
    }
    None
}

fn main() {
    let carte: [&[u8]; 3] = [b"..#", b"#..", b"..."];
    println!("{:?}", plus_court(&carte, (0, 0), (2, 0)));
}
```

> [!tip] Astuce `wrapping_sub`
> `0usize.wrapping_sub(1)` donne un nombre immense au lieu de paniquer : le test `nl < hauteur` l'élimine tout seul.

## 7. Dijkstra : quand les pas n'ont pas tous le même coût

Si chaque case a un **coût** différent, le BFS ne suffit plus. L'algorithme de **Dijkstra** traite toujours en premier la case la **moins chère** trouvée jusque-là. Pour sortir le plus petit d'un `BinaryHeap` (qui sort le plus grand), on enveloppe le coût dans `Reverse` :

```rust
use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn main() {
    let couts = [[1u32, 9, 1], [1, 1, 1], [9, 9, 1]];
    let mut meilleur = [[u32::MAX; 3]; 3];
    let mut tas = BinaryHeap::from([Reverse((0u32, 0usize, 0usize))]);
    meilleur[0][0] = 0;
    while let Some(Reverse((cout, l, c))) = tas.pop() {
        if cout > meilleur[l][c] {
            continue;
        }
        for (nl, nc) in [(l.wrapping_sub(1), c), (l + 1, c), (l, c.wrapping_sub(1)), (l, c + 1)] {
            if nl < 3 && nc < 3 {
                let nouveau = cout + couts[nl][nc];
                if nouveau < meilleur[nl][nc] {
                    meilleur[nl][nc] = nouveau;
                    tas.push(Reverse((nouveau, nl, nc)));
                }
            }
        }
    }
    println!("coût minimal : {}", meilleur[2][2]);
}
```

La ligne `if cout > meilleur[l][c] { continue; }` saute les entrées périmées : une case peut être ajoutée plusieurs fois au tas, seule la moins chère compte.

## 8. Mémoïsation et programmation dynamique

Quand un calcul récursif refait **les mêmes sous-calculs** des millions de fois, on retient les résultats déjà trouvés : c'est la **mémoïsation** (garder en mémoire). Exemple : le nombre de façons de monter `n` marches, une ou deux à la fois.

```rust
use std::collections::HashMap;

fn facons(n: u64, cache: &mut HashMap<u64, u64>) -> u64 {
    if n <= 1 {
        return 1;
    }
    if let Some(&deja) = cache.get(&n) {
        return deja;
    }
    let resultat = facons(n - 1, cache) + facons(n - 2, cache);
    cache.insert(n, resultat);
    resultat
}

fn main() {
    println!("{}", facons(80, &mut HashMap::new()));
}
```

Sans le cache, `facons(80)` ferait des milliards de milliards d'appels. Avec, il en fait 80.

La **programmation dynamique** est la même idée à l'envers : on remplit un tableau du plus petit cas au plus grand, chaque case utilisant les précédentes.

```rust
let n = 80;
let mut facons = vec![1u64; n + 1];
for i in 2..=n {
    facons[i] = facons[i - 1] + facons[i - 2];
}
println!("{}", facons[n]);
```

> [!info] Comment reconnaître ces énigmes
> « Combien de façons de… », un nombre de répétitions énorme, ou une récursion qui retombe sur les mêmes états : pense mémoïsation.

## 9. Les intervalles

Un intervalle de nombres se range comme `(debut, fin)`. Les questions classiques :

```rust
fn contient(a: (u32, u32), b: (u32, u32)) -> bool {
    a.0 <= b.0 && b.1 <= a.1
}

fn chevauche(a: (u32, u32), b: (u32, u32)) -> bool {
    a.0 <= b.1 && b.0 <= a.1
}

fn main() {
    println!("{} {}", contient((2, 8), (3, 7)), chevauche((2, 4), (5, 9)));
}
```

Quand une partie 2 transforme des **milliards de nombres**, on ne les traite pas un par un : on transforme des intervalles entiers, en les **coupant** aux endroits où la règle change.

> [!warning] Inclus ou exclu ?
> Décide une fois pour toutes si `fin` est comprise (`2..=8`) ou non (`2..9`), et tiens-t'y. La plupart des erreurs d'intervalles viennent d'un « plus ou moins 1 » oublié.

## 10. Quand ça ne marche pas

- **L'exemple passe mais pas la vraie entrée** : un cas absent de l'exemple (nombre à plusieurs chiffres, valeur négative, ligne vide, débordement). Relis l'énoncé mot par mot.
- **Trop lent** : compte les opérations (section 5). Une boucle dans une boucle sur 100 000 éléments, c'est 10 milliards.
- **Débogue sur l'exemple** : affiche l'état à chaque étape avec `println!("{:?}", ...)` et compare avec ce que décrit l'énoncé.
