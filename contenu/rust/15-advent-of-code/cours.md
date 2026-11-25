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

**Exemple pas à pas sur une mini-énigme.** « Chaque ligne liste les poids des colis d'un camion. Partie 1 : le poids total de tous les colis. Partie 2 : la somme, sur tous les camions, du colis le plus lourd de chaque camion. »

1. **Ce qu'on donne** : des lignes de nombres séparés par des espaces. **Ce qu'on demande** : deux nombres. **Cas particuliers** : un camion vide ? (on le saute dans la partie 2).
2. **La structure** : une liste de camions, chaque camion étant une liste de poids : `Vec<Vec<u32>>`.
3. **L'exemple à la main** : `4 7 1` / `10 2` / `3 3 3`. Partie 1 : 12 + 12 + 9 = 33. Partie 2 : 7 + 10 + 3 = 20.

```rust
const EXEMPLE: &str = "4 7 1
10 2
3 3 3";

fn lire(entree: &str) -> Vec<Vec<u32>> {
    entree
        .lines()
        .map(|ligne| ligne.split_whitespace().map(|n| n.parse().expect("poids illisible")).collect())
        .collect()
}

fn partie1(entree: &str) -> u32 {
    lire(entree).iter().flatten().sum()
}

fn partie2(entree: &str) -> u32 {
    lire(entree).iter().filter_map(|camion| camion.iter().max()).sum()
}

fn main() {
    assert_eq!(partie1(EXEMPLE), 33);
    assert_eq!(partie2(EXEMPLE), 20);
    println!("Partie 1 : {}", partie1(EXEMPLE));
    println!("Partie 2 : {}", partie2(EXEMPLE));
}
```

Les `assert_eq!` jouent le rôle des tests : tant qu'ils passent sur l'exemple, on peut essayer la vraie entrée. `flatten` met tous les poids de tous les camions dans une seule suite ; `filter_map(|camion| camion.iter().max())` donne le plus lourd de chaque camion et saute un camion vide (`max` renvoie alors `None`).

**À retenir :** comprendre → lire l'entrée dans une structure → vérifier l'exemple à la main et avec des `assert_eq!` → seulement ensuite la vraie entrée.

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
| Séparer deux colonnes | `.unzip()` sur une suite de paires |
| Écart entre deux nombres, toujours positif | `a.abs_diff(b)` |

```rust
let ligne = "move 3 from 1 to 2";
let nombres: Vec<usize> = ligne
    .split_whitespace()
    .filter_map(|mot| mot.parse().ok())
    .collect();
println!("{nombres:?}");
```

Pas à pas : `split_whitespace` donne `move`, `3`, `from`, `1`, `to`, `2`. `parse` échoue sur les mots (`None`, jetés par `filter_map`) et réussit sur les nombres : on obtient `[3, 1, 2]`. Pratique quand seuls les nombres d'une phrase comptent.

**Exemple : une ligne avec plusieurs séparateurs.** On découpe du plus gros morceau au plus petit, un séparateur à la fois :

```rust
let ligne = "Lot 7: 3-9, 12-15";
let (entete, plages) = ligne.split_once(": ").expect("pas de « : »");
let numero: u32 = entete.strip_prefix("Lot ").expect("pas de « Lot »").parse().expect("numéro illisible");
let plages: Vec<(u32, u32)> = plages
    .split(", ")
    .map(|plage| {
        let (debut, fin) = plage.split_once('-').expect("pas de « - »");
        (debut.parse().expect("début illisible"), fin.parse().expect("fin illisible"))
    })
    .collect();

assert_eq!(numero, 7);
assert_eq!(plages, vec![(3, 9), (12, 15)]);
```

| Étape | Morceau | Résultat |
|---|---|---|
| `split_once(": ")` | `"Lot 7: 3-9, 12-15"` | `"Lot 7"` et `"3-9, 12-15"` |
| `strip_prefix("Lot ")` puis `parse` | `"Lot 7"` | `"7"`, puis `7` |
| `split(", ")` | `"3-9, 12-15"` | `"3-9"` et `"12-15"` |
| `split_once('-')` puis `parse` | `"3-9"` | `(3, 9)` |
| `split_once('-')` puis `parse` | `"12-15"` | `(12, 15)` |

**Nombres négatifs et espaces.** `parse` refuse un espace en trop, et un type sans signe (`u32`, `u64`, `usize`) refuse le signe moins :

```rust
assert_eq!("-12".parse::<i64>(), Ok(-12));
assert!("-12".parse::<u64>().is_err());
assert!(" 42".parse::<u32>().is_err());
assert_eq!(" 42".trim().parse::<u32>(), Ok(42));
```

**Deux colonnes de nombres.** `unzip` range le premier élément de chaque paire dans une liste et le second dans une autre :

```rust
let entree = "5   12\n9   4\n1   7";
let (gauche, droite): (Vec<u32>, Vec<u32>) = entree
    .lines()
    .filter_map(|ligne| {
        let mut nombres = ligne.split_whitespace().map(|n| n.parse::<u32>().expect("nombre illisible"));
        Some((nombres.next()?, nombres.next()?))
    })
    .unzip();

assert_eq!(gauche, vec![5, 9, 1]);
assert_eq!(droite, vec![12, 4, 7]);
assert_eq!(5_u32.abs_diff(12), 7);
assert_eq!(12_u32.abs_diff(5), 7);
```

`nombres.next()?` prend le nombre suivant de la ligne, ou abandonne la ligne (`None`) s'il n'y en a plus. `abs_diff` donne l'écart sans se soucier de l'ordre (et sans risque de passer sous zéro avec un `u32`, contrairement à `5 - 12`, qui ferait paniquer).

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

Pas à pas pour les blocs : après `replace`, le texte vaut `"1\n2\n\n3\n4"`. `split("\n\n")` le coupe à la ligne vide : `"1\n2"` et `"3\n4"`. Chaque bloc est relu ligne par ligne et additionné : `1 + 2 = 3` et `3 + 4 = 7`. Affichage : `[3, 7]`. Sans le `replace`, le texte contient `"\r\n\r\n"` : il n'y a jamais deux `\n` collés (un `\r` est entre eux), donc un seul bloc.

### Lire caractère par caractère

Pour du texte ASCII (lettres sans accent, chiffres, ponctuation), `ligne.bytes()` donne un **octet** (`u8`) par caractère, et `b'a'` est l'octet de la lettre `a`. Les lettres se suivent dans l'ordre alphabétique, donc une soustraction donne la position d'une lettre :

```rust
let mot = "eC";
let octets = mot.as_bytes();
assert_eq!(octets[0] - b'a' + 1, 5);
assert_eq!(octets[1] - b'A' + 1, 3);
assert!(octets[0].is_ascii_lowercase());
assert!(octets[1].is_ascii_uppercase());
assert_eq!('7'.to_digit(10), Some(7));
assert_eq!('x'.to_digit(10), None);
```

`mot.as_bytes()` donne les octets du texte (ici `b'e'` et `b'C'`). `b'e' - b'a'` vaut `4` (`e` est 4 lettres après `a`), et le `+ 1` fait commencer la numérotation à 1 : `e` est la 5e lettre. De même, `b'C' - b'A' + 1 = 3`. Pour une autre numérotation (les majuscules après les minuscules, par exemple), on ajoute le décalage voulu.

**Chercher un mot à chaque position.** `&texte[i..]` est la fin du texte à partir de la position `i` ; `starts_with` dit si elle commence par un mot donné. En essayant **toutes** les positions, on trouve aussi les mots qui se chevauchent :

```rust
let texte = "unedeuxtroisdeux";
let mots = [("un", 1), ("deux", 2), ("trois", 3)];
let trouves: Vec<u32> = (0..texte.len())
    .filter_map(|i| {
        let reste = &texte[i..];
        mots.iter().find(|(mot, _)| reste.starts_with(mot)).map(|&(_, valeur)| valeur)
    })
    .collect();
assert_eq!(trouves, vec![1, 2, 3, 2]);
```

| `i` | `&texte[i..]` commence par | Trouvé |
|---|---|---|
| 0 | `un…` | `1` |
| 1, 2 | `ne…`, `ed…` | rien |
| 3 | `deux…` | `2` |
| 4 à 6 | `eux…`, `ux…`, `xt…` | rien |
| 7 | `trois…` | `3` |
| 8 à 11 | `rois…` … `sdeux` | rien |
| 12 | `deux` | `2` |

> [!warning] Positions et accents
> `&texte[i..]` utilise des positions en **octets**. Sur un texte ASCII, un caractère = un octet, tout va bien. Avec des accents (`é` prend 2 octets), couper au milieu d'un caractère fait paniquer.

**Lire un format exact.** Pour reconnaître un motif précis (par exemple `pos=12;`) sans expression régulière, on avance morceau par morceau : `strip_prefix` vérifie et enlève un début connu, une petite fonction lit les chiffres, et on vérifie ce qui suit. Au moindre écart, `?` abandonne avec `None`.

```rust
fn nombre_au_debut(texte: &str) -> Option<(u32, &str)> {
    let longueur = texte.bytes().take_while(|octet| octet.is_ascii_digit()).count();
    let nombre = texte[..longueur].parse().ok()?;
    Some((nombre, &texte[longueur..]))
}

fn lire_position(texte: &str) -> Option<u32> {
    let reste = texte.strip_prefix("pos=")?;
    let (nombre, reste) = nombre_au_debut(reste)?;
    reste.starts_with(';').then_some(nombre)
}

fn main() {
    assert_eq!(nombre_au_debut("42abc"), Some((42, "abc")));
    assert_eq!(nombre_au_debut("abc"), None);
    assert_eq!(lire_position("pos=12;"), Some(12));
    assert_eq!(lire_position("pos= 12;"), None);
    assert_eq!(lire_position("pos=12,"), None);
    println!("tout est bon");
}
```

Pas à pas pour `"pos= 12;"` : `strip_prefix("pos=")` réussit et laisse `" 12;"` ; `nombre_au_debut` compte 0 chiffre au début (c'est un espace), `""` ne se lit pas comme un nombre, donc `None` : le motif est refusé. Pour `"pos=12,"` : le nombre `12` est lu, mais ce qui suit n'est pas `;` : `then_some` donne `None`. Pour limiter le nombre de chiffres, il suffit de tester `longueur` (par exemple `(1..=3).contains(&longueur)`).

**À retenir :** découpe du plus gros séparateur au plus petit (`split_once`, `split`, `strip_prefix`), `trim` avant `parse`, `i64` s'il peut y avoir des négatifs ; pour un format exact, avance morceau par morceau avec `?`.

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

Pas à pas pour `voisins(0, 0, 3, 3)` (le coin en haut à gauche) :

| Direction `(dl, dc)` | Ligne | Colonne | Gardée ? |
|---|---|---|---|
| `(-1, 0)` (haut) | `0 - 1` : `None` | | non : on sortirait par le haut |
| `(1, 0)` (bas) | `1` | `0` | oui : `(1, 0)` |
| `(0, -1)` (gauche) | `0` | `0 - 1` : `None` | non |
| `(0, 1)` (droite) | `0` | `1` | oui : `(0, 1)` |

Le `?` après `checked_add_signed` abandonne la direction dès qu'on passerait sous zéro, et `then_some` élimine celles qui dépassent en bas ou à droite. Pour la case du centre `(1, 1)`, les 4 voisins sont gardés.

Pour les **diagonales**, ajoute les 4 directions `(-1, -1)`, `(-1, 1)`, `(1, -1)`, `(1, 1)`.

**Exemple : lire un mot dans les 8 directions.** Pour savoir si un mot part d'une case dans une direction, on lit la lettre à 0 pas, à 1 pas, à 2 pas... dans cette direction. `grille.get(l)?.get(c)` lit une case **sans paniquer** : `None` si on sort de la grille.

```rust
const HUIT: [(isize, isize); 8] = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)];

fn lettre(grille: &[Vec<u8>], (l, c): (usize, usize), (dl, dc): (isize, isize), pas: isize) -> Option<u8> {
    let nl = l.checked_add_signed(dl * pas)?;
    let nc = c.checked_add_signed(dc * pas)?;
    grille.get(nl)?.get(nc).copied()
}

fn main() {
    let grille: Vec<Vec<u8>> = "OUI\nUUO\nIOI".lines().map(|ligne| ligne.bytes().collect()).collect();
    let mot = b"OUI";
    let directions: Vec<(isize, isize)> = HUIT
        .iter()
        .copied()
        .filter(|&direction| {
            mot.iter()
                .enumerate()
                .all(|(k, &attendue)| lettre(&grille, (0, 0), direction, k as isize) == Some(attendue))
        })
        .collect();
    assert_eq!(directions, vec![(0, 1), (1, 0), (1, 1)]);
    println!("OUI part de (0, 0) dans {} directions", directions.len());
}
```

```text
O U I
U U O
I O I
```

Depuis la case `(0, 0)` (le `O` en haut à gauche) : vers la droite `(0, 1)`, on lit `O`, `U`, `I` : oui. Vers le bas `(1, 0)` : `O`, `U`, `I` : oui. En diagonale `(1, 1)` : `(0, 0)`, `(1, 1)`, `(2, 2)` donnent `O`, `U`, `I` : oui. Les 5 autres directions sortent de la grille dès le premier pas (`None`). Pour compter un mot dans toute la grille, on refait la même chose depuis **chaque** case.

> [!tip] Grille immense ou presque vide
> Si la carte est infinie ou n'a que quelques cases utiles, range seulement les cases intéressantes dans un `HashSet<(i64, i64)>` ou une `HashMap<(i64, i64), T>`.

**Exemple : avancer d'un pas vers une cible et noter les cases visitées.** Avec des coordonnées signées (`i64`), on peut aller dans le négatif sans souci. `x.signum()` vaut `-1` si `x` est négatif, `0` s'il est nul, `1` s'il est positif : ajouter le `signum` de l'écart fait avancer d'**une** case dans la bonne direction, sur chaque axe.

```rust
use std::collections::HashSet;

let cible = (3_i64, -2_i64);
let mut position = (0_i64, 0_i64);
let mut visitees = HashSet::from([position]);
while position != cible {
    position.0 += (cible.0 - position.0).signum();
    position.1 += (cible.1 - position.1).signum();
    visitees.insert(position);
}
assert_eq!(visitees.len(), 4);
```

| Position | Écart avec la cible | `signum` | Nouvelle position |
|---|---|---|---|
| `(0, 0)` | `(3, -2)` | `(1, -1)` | `(1, -1)` : un pas en diagonale |
| `(1, -1)` | `(2, -1)` | `(1, -1)` | `(2, -2)` |
| `(2, -2)` | `(1, 0)` | `(1, 0)` | `(3, -2)` : un pas en ligne droite |

Cases visitées, départ compris : `(0, 0)`, `(1, -1)`, `(2, -2)`, `(3, -2)`, soit **4**. Le `HashSet` ne garde chaque case qu'une fois : si on repasse au même endroit, `len()` n'augmente pas.

**À retenir :** une grille = `Vec<Vec<u8>>` lue avec `grille[ligne][colonne]` ; pour les bords, `checked_add_signed` ou `get(…)?` ; pour une carte infinie, des coordonnées `i64` dans un `HashSet`.

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

Pas à pas : `pomme` est absente, `or_insert(0)` crée la case à 0 puis `+= 1` la passe à 1 ; `poire` : 1 ; `pomme` : la case existe, elle passe à 2 ; `kiwi` : 1 ; `pomme` : 3. Affichage : `pomme : 3`. Ensuite, « combien de fois `x` apparaît ? » se lit instantanément avec `comptes.get(&x)` (`None` s'il n'apparaît jamais, d'où souvent `.copied().unwrap_or(0)`).

### `HashSet` : éléments communs et doublons

```rust
use std::collections::HashSet;

let a: HashSet<char> = "chocolat".chars().collect();
let b: HashSet<char> = "citron".chars().collect();
let communes: HashSet<char> = a.intersection(&b).copied().collect();
assert_eq!(communes, HashSet::from(['c', 'o', 't']));

let c: HashSet<char> = "tomate".chars().collect();
let dans_les_trois: Vec<char> = communes.iter().copied().filter(|lettre| c.contains(lettre)).collect();
assert_eq!(dans_les_trois.len(), 2);

let sans_doublon = |mot: &str| mot.chars().collect::<HashSet<char>>().len() == mot.chars().count();
assert!(sans_doublon("lune"));
assert!(!sans_doublon("soleil"));
```

- `"chocolat"` donne l'ensemble `{c, h, o, l, a, t}` (les doublons disparaissent), `"citron"` donne `{c, i, t, r, o, n}`. Les lettres des deux : `c`, `o`, `t`.
- Avec un troisième mot, on garde celles qui sont **aussi** dans le troisième ensemble : `tomate` contient `t` et `o`, pas `c` : 2 lettres.
- « Toutes les lettres sont différentes » : on compare la taille de l'ensemble au nombre de lettres. `lune` : 4 et 4, oui. `soleil` : l'ensemble `{s, o, l, e, i}` a 5 éléments pour 6 lettres, donc il y a un doublon.

Pour regrouper des lignes **par paquets** (par exemple par 3), range-les dans un `Vec` puis utilise `chunks(3)` (chapitre 14) : `entree.lines().collect::<Vec<_>>().chunks(3)`.

### La pile : le dernier arrivé sort le premier

Un `Vec` sert de **pile** : `push` pose un élément sur le dessus, `pop` retire celui du dessus (et renvoie `None` si la pile est vide). On s'en sert dès qu'il faut « revenir au dernier élément ouvert » : parenthèses, dossiers, annulations... Exemple : calculer une expression écrite **après** ses nombres (notation polonaise inverse : `3 4 +` veut dire `3 + 4`).

```rust
fn calculer(expression: &str) -> Option<i64> {
    let mut pile: Vec<i64> = Vec::new();
    for morceau in expression.split_whitespace() {
        match morceau {
            "+" | "-" | "*" => {
                let droite = pile.pop()?;
                let gauche = pile.pop()?;
                pile.push(match morceau {
                    "+" => gauche + droite,
                    "-" => gauche - droite,
                    _ => gauche * droite,
                });
            }
            nombre => pile.push(nombre.parse().ok()?),
        }
    }
    if pile.len() == 1 { pile.pop() } else { None }
}

fn main() {
    assert_eq!(calculer("3 4 + 2 *"), Some(14));
    assert_eq!(calculer("5 1 2 + -"), Some(2));
    assert_eq!(calculer("+"), None);
    println!("{:?}", calculer("3 4 + 2 *"));
}
```

| Morceau | Action | Pile après (le dessus à droite) |
|---|---|---|
| `3` | `push(3)` | `[3]` |
| `4` | `push(4)` | `[3, 4]` |
| `+` | `pop` → 4, `pop` → 3, `push(3 + 4)` | `[7]` |
| `2` | `push(2)` | `[7, 2]` |
| `*` | `pop` → 2, `pop` → 7, `push(7 × 2)` | `[14]` |

Il reste un seul nombre : le résultat, `14`. Pour `"+"`, le premier `pop` trouve une pile vide : `?` renvoie `None`. À la fin, la pile peut aussi servir telle quelle : ce qui **reste** dedans est ce qui n'a pas été refermé, à lire du dessus vers le fond (`pile.iter().rev()`).

**Une pile pour le chemin actuel.** Dans une arborescence de dossiers, `Vec<&str>` garde le chemin : entrer dans un dossier = `push`, remonter = `pop`. Tous les dossiers qui contiennent le dossier actuel sont les **débuts** de ce chemin :

```rust
let mut chemin: Vec<&str> = Vec::new();
for ordre in ["entrer photos", "entrer 2024", "remonter", "entrer 2025"] {
    match ordre.split_once(' ') {
        Some(("entrer", nom)) => chemin.push(nom),
        _ => {
            chemin.pop();
        }
    }
}
assert_eq!(chemin, vec!["photos", "2025"]);

let parents: Vec<String> = (0..=chemin.len()).map(|n| format!("/{}", chemin[..n].join("/"))).collect();
assert_eq!(parents, vec!["/", "/photos", "/photos/2025"]);
```

Pas à pas : `[photos]`, puis `[photos, 2024]`, puis `pop` → `[photos]`, puis `[photos, 2025]`. Les débuts du chemin (0, 1 puis 2 noms) donnent `/`, `/photos` et `/photos/2025` : un fichier rangé dans `2025` compte aussi pour ces trois dossiers. On utilise le **chemin complet** comme nom, car deux dossiers différents peuvent porter le même nom (`/a/archives` et `/b/archives`).

### Trier selon ses propres règles

`sort_by(|a, b| …)` accepte n'importe quelle règle, du moment qu'elle renvoie un `Ordering` : `Less` (`a` passe avant `b`), `Greater` (`a` passe après) ou `Equal`. Et deux tuples (ou deux `Vec`) se comparent **élément par élément** : le premier élément décide, et en cas d'égalité, le suivant, etc.

```rust
use std::cmp::Ordering;

let mut nombres = vec![7, 2, 9, 4, 1, 8];
nombres.sort_by(|a, b| match (a % 2 == 0, b % 2 == 0) {
    (true, false) => Ordering::Less,
    (false, true) => Ordering::Greater,
    _ => a.cmp(b),
});
assert_eq!(nombres, vec![2, 4, 8, 1, 7, 9]);

assert!((1, 9) < (2, 0));
assert!((2, 3) < (2, 5));

let ordre_des_tailles = "SMLX";
let force = |taille: char| ordre_des_tailles.find(taille).expect("taille inconnue");
let mut commandes = vec!["LS", "SM", "LM", "SX"];
commandes.sort_by_key(|commande| commande.chars().map(force).collect::<Vec<usize>>());
assert_eq!(commandes, vec!["SM", "SX", "LS", "LM"]);
```

- Premier tri : un pair passe avant un impair (`Less`), un impair après un pair (`Greater`) ; deux nombres de même parité se comparent normalement. Pairs `2, 4, 8`, puis impairs `1, 7, 9`.
- `(1, 9) < (2, 0)` : le premier élément décide (1 < 2), le 9 ne compte pas. `(2, 3) < (2, 5)` : égalité sur le premier, le second départage.
- Troisième tri : chaque taille est remplacée par sa position dans `"SMLX"` (S = 0, M = 1, L = 2, X = 3). `LS` → `[2, 0]`, `SM` → `[0, 1]`, `LM` → `[2, 1]`, `SX` → `[0, 3]`. Les listes se comparent case par case : `[0, 1] < [0, 3] < [2, 0] < [2, 1]`. Pour trier d'abord selon une catégorie puis selon ces valeurs, la clé peut être un tuple `(categorie, valeurs)`.

**Le milieu d'une liste.** Pour une liste de longueur **impaire** `n`, l'élément du milieu est à l'indice `n / 2` (division entière) : pour 5 éléments, `5 / 2 = 2`, le 3e élément (indices 0, 1, **2**, 3, 4). Pour une médiane, trie d'abord.

**À retenir :** compter → `HashMap` + `entry().or_insert(0)` ; « déjà vu / en commun » → `HashSet` ; « le dernier ouvert » → une pile (`Vec`, `push`, `pop`) ; un ordre spécial → `sort_by` qui renvoie un `Ordering`, ou une clé tuple.

## 5. Compter au lieu de simuler

Quand la partie 2 demande « la même chose, mais 1000 fois plus », la solution naïve devient trop lente. Il faut estimer le **nombre d'opérations** :

| Opérations | Temps (à peu près) |
|---|---|
| 1 million | instantané |
| 100 millions | environ une seconde en release, beaucoup plus en debug |
| 10 milliards | trop long |

**Estimer pas à pas.** Une boucle sur `n` éléments fait `n` opérations ; une boucle dans une boucle (chaque élément comparé à chaque autre) en fait `n × n`.

| `n` | Une boucle (`n`) | Deux boucles imbriquées (`n × n`) |
|---|---|---|
| 1 000 | 1 000 | 1 000 000 : instantané |
| 10 000 | 10 000 | 100 000 000 : environ une seconde, plus en debug |
| 100 000 | 100 000 | 10 000 000 000 : trop long |

Le remède habituel : trier d'abord, ou ranger les éléments dans une `HashMap` / un `HashSet` pour retrouver un élément sans tout reparcourir.

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

| Jour | `jeunes` | `adultes` | Total |
|---|---|---|---|
| départ | 1 | 0 | 1 |
| 1 | 0 | 1 | 1 |
| 2 | 1 | 1 | 2 |
| 3 | 1 | 2 | 3 |
| 4 | 2 | 3 | 5 |
| 5 | 3 | 5 | 8 |

Chaque jour : les nouveaux jeunes sont les bébés des adultes (`adultes`), et les nouveaux adultes sont les anciens adultes plus les jeunes qui ont grandi (`adultes + jeunes`). L'affectation de tuple calcule les deux nouvelles valeurs **avant** de modifier quoi que ce soit.

**Un tableau de compteurs par état.** Quand chaque individu est dans un état parmi quelques-uns (un âge, un minuteur...), on garde un compteur par état. Exemple : une cellule a un âge 0, 1 ou 2 ; chaque jour, elle vieillit d'un an, et celles d'âge 2 se divisent en deux nouvelles cellules d'âge 0.

```rust
let mut par_age = [1_u64, 0, 0];
for _ in 0..6 {
    par_age = [2 * par_age[2], par_age[0], par_age[1]];
}
assert_eq!(par_age, [4, 0, 0]);
assert_eq!(par_age.iter().sum::<u64>(), 4);
```

| Jour | Âge 0 | Âge 1 | Âge 2 |
|---|---|---|---|
| départ | 1 | 0 | 0 |
| 1 | 0 | 1 | 0 |
| 2 | 0 | 0 | 1 |
| 3 | 2 | 0 | 0 |
| 4 | 0 | 2 | 0 |
| 5 | 0 | 0 | 2 |
| 6 | 4 | 0 | 0 |

Un jour coûte 3 opérations, qu'il y ait 4 cellules ou 4 milliards. `par_age.rotate_left(1)` (décaler toutes les cases d'un cran vers la gauche, la première passant au bout) aide souvent à écrire ce genre de « tout le monde descend d'une case ».

**Une `HashMap` de compteurs quand les valeurs sont trop nombreuses.** Si les états possibles sont des nombres quelconques, on range « valeur → combien d'individus la portent ». Chaque valeur n'est transformée qu'**une fois** par étape, et son effectif est reporté sur ses résultats. Exemple : un nombre pair se coupe en deux moitiés, un nombre impair devient `n + 1`.

```rust
use std::collections::HashMap;

fn etape(comptes: &HashMap<u64, u64>) -> HashMap<u64, u64> {
    let mut suivant = HashMap::new();
    for (&valeur, &combien) in comptes {
        let enfants = if valeur % 2 == 0 { vec![valeur / 2, valeur / 2] } else { vec![valeur + 1] };
        for enfant in enfants {
            *suivant.entry(enfant).or_insert(0) += combien;
        }
    }
    suivant
}

fn main() {
    let mut comptes = HashMap::from([(6_u64, 1_u64)]);
    for _ in 0..6 {
        comptes = etape(&comptes);
    }
    assert_eq!(comptes, HashMap::from([(1, 16)]));
    println!("{} nombres", comptes.values().sum::<u64>());
}
```

| Étape | Dictionnaire (valeur : effectif) | Total |
|---|---|---|
| départ | `{6: 1}` | 1 |
| 1 | 6 est pair → deux 3 : `{3: 2}` | 2 |
| 2 | 3 est impair → 4, pour les 2 : `{4: 2}` | 2 |
| 3 | 4 → deux 2, pour les 2 : `{2: 4}` | 4 |
| 4 | 2 → deux 1 : `{1: 8}` | 8 |
| 5 | 1 → 2 : `{2: 8}` | 8 |
| 6 | 2 → deux 1 : `{1: 16}` | 16 |

On n'a jamais rangé 16 nombres un par un : seulement une ou deux cases par étape.

> [!warning] Débordement
> Les réponses AoC dépassent souvent 4 milliards : utilise `u64` (ou `i64` si c'est négatif). En debug, un `u32` qui déborde fait **paniquer** le programme.

| Type | Plus grande valeur (à peu près) |
|---|---|
| `u8` | 255 |
| `i32` | 2,1 milliards (2 147 483 647) |
| `u32` | 4,3 milliards (4 294 967 295) |
| `i64` | 9,2 × 10¹⁸ |
| `u64` | 1,8 × 10¹⁹ |

Pour une croissance qui **double** : 2¹⁰ ≈ mille, 2²⁰ ≈ un million, 2³⁰ ≈ un milliard, 2⁶⁰ ≈ un milliard de milliards (10¹⁸). Chaque groupe de 10 doublements multiplie à peu près par mille.

**À retenir :** estime le nombre d'opérations avant de coder ; si une population explose, compte combien d'individus sont dans chaque état (tableau ou `HashMap`) au lieu de les ranger un par un ; et `u64` par défaut.

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

Pas à pas sur la carte de l'exemple (départ `(0, 0)`, arrivée `(2, 0)`, `#` = mur) :

```text
. . #
# . .
. . .
```

| Case retirée de la file | Sa distance | Voisins ajoutés (avec leur distance) | File après |
|---|---|---|---|
| `(0, 0)` | 0 | `(0, 1)` : 1 (le `(1, 0)` est un mur) | `(0, 1)` |
| `(0, 1)` | 1 | `(1, 1)` : 2 (le `(0, 2)` est un mur) | `(1, 1)` |
| `(1, 1)` | 2 | `(2, 1)` : 3, `(1, 2)` : 3 | `(2, 1)`, `(1, 2)` |
| `(2, 1)` | 3 | `(2, 0)` : 4, `(2, 2)` : 4 | `(1, 2)`, `(2, 0)`, `(2, 2)` |
| `(1, 2)` | 3 | aucun (`(2, 2)` a déjà une distance) | `(2, 0)`, `(2, 2)` |
| `(2, 0)` | 4 | c'est l'arrivée : on renvoie `Some(4)` | |

Comme la file sort les cases dans l'ordre où on les a mises, toutes les cases à distance 3 passent avant celles à distance 4 : la distance trouvée est forcément la plus courte. Le test `distances[nl][nc] == usize::MAX` (« jamais atteinte ») empêche de mettre deux fois la même case dans la file.

> [!tip] Plusieurs départs, ou à l'envers
> - Plusieurs départs possibles ? Mets-les **tous** dans la file au début, avec la distance 0 : un seul parcours donne la distance au départ le plus proche.
> - Beaucoup de départs et une seule arrivée ? Lance le parcours **depuis l'arrivée**, en inversant la règle de passage (si on peut aller de A vers B, on va de B vers A) : la distance de chaque case jusqu'à l'arrivée se lit dans le même tableau.

**À retenir :** plus court chemin avec des pas qui coûtent tous 1 → BFS : une `VecDeque` (`pop_front`, `push_back`) et un tableau des distances qui sert aussi de « déjà vu ».

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

Pas à pas sur la grille des coûts (on paie le coût de chaque case où l'on **entre**, pas celui du départ) :

```text
1 9 1
1 1 1
9 9 1
```

| Sortie du tas (la moins chère) | Voisins améliorés |
|---|---|
| `(0, 0)` à 0 | `(1, 0)` : 0 + 1 = 1 ; `(0, 1)` : 0 + 9 = 9 |
| `(1, 0)` à 1 | `(1, 1)` : 1 + 1 = 2 ; `(2, 0)` : 1 + 9 = 10 |
| `(1, 1)` à 2 | `(1, 2)` : 2 + 1 = 3 ; `(2, 1)` : 2 + 9 = 11 ; `(0, 1)` : 2 + 9 = 11, pas mieux que 9 |
| `(1, 2)` à 3 | `(0, 2)` : 3 + 1 = 4 ; `(2, 2)` : 3 + 1 = 4 |
| `(0, 2)` à 4, puis `(2, 2)` à 4… | plus rien ne s'améliore |

Le chemin bas, droite, droite, bas coûte `1 + 1 + 1 + 1 = 4` : le programme affiche `coût minimal : 4`. Le tas a évité la case à 9 en haut au milieu, alors qu'un BFS (qui compte seulement les pas) ne fait pas la différence entre une case à 1 et une case à 9.

**À retenir :** des pas de coûts différents → Dijkstra : un `BinaryHeap` de `Reverse((coût, case))`, un tableau du meilleur coût connu, et on saute les entrées périmées.

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

Pas à pas pour `facons(4)` : pour arriver à la marche 4, le dernier pas part de la marche 3 (pas de 1) ou de la marche 2 (pas de 2), d'où `facons(4) = facons(3) + facons(2)`.

1. `facons(3)` demande `facons(2)` et `facons(1)`. `facons(2)` demande `facons(1) = 1` et `facons(0) = 1` : il vaut 2, **rangé dans le cache**. Donc `facons(3) = 2 + 1 = 3`, rangé aussi.
2. `facons(4)` demande ensuite `facons(2)` : il est déjà dans le cache, on lit 2 sans rien recalculer.
3. `facons(4) = 3 + 2 = 5` (1+1+1+1, 2+1+1, 1+2+1, 1+1+2, 2+2).

**Une clé à deux nombres.** Quand le résultat dépend de deux choses (une position et un nombre restant, une ligne et une colonne...), la clé du cache est un **tuple**. Exemple : le nombre de chemins d'un coin à l'autre d'une grille, en n'allant que vers la droite ou vers le bas, sans passer sur les `#`.

```rust
use std::collections::HashMap;

fn chemins(grille: &[&[u8]], (l, c): (usize, usize), cache: &mut HashMap<(usize, usize), u64>) -> u64 {
    if l >= grille.len() || c >= grille[0].len() || grille[l][c] == b'#' {
        return 0;
    }
    if (l, c) == (grille.len() - 1, grille[0].len() - 1) {
        return 1;
    }
    if let Some(&deja) = cache.get(&(l, c)) {
        return deja;
    }
    let total = chemins(grille, (l + 1, c), cache) + chemins(grille, (l, c + 1), cache);
    cache.insert((l, c), total);
    total
}

fn main() {
    let grille: [&[u8]; 3] = [b"...", b".#.", b"..."];
    assert_eq!(chemins(&grille, (0, 0), &mut HashMap::new()), 2);
    let vide: [&[u8]; 3] = [b"...", b"...", b"..."];
    println!("{}", chemins(&vide, (0, 0), &mut HashMap::new()));
}
```

Les trois cas de fin viennent d'abord : hors de la grille ou sur un mur → 0 chemin ; sur l'arrivée → 1 chemin. Ensuite, le cache ; sinon, on additionne « je descends » et « je vais à droite ». Avec le mur au centre, il reste 2 chemins (tout à droite puis tout en bas, ou l'inverse). Sans mur, le programme affiche `6`.

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

Pas à pas pour le tableau : `facons[0] = 1` et `facons[1] = 1` (le `vec![1u64; n + 1]` de départ), puis `facons[2] = 1 + 1 = 2`, `facons[3] = 2 + 1 = 3`, `facons[4] = 3 + 2 = 5`, `facons[5] = 8`, `facons[6] = 13`... Chaque case se calcule une seule fois, à partir de cases déjà remplies.

**Programmation dynamique sur un texte.** On peut aussi remplir le tableau **de la fin vers le début** : `facons[i]` = nombre de façons de traiter le texte à partir de la position `i`, avec `facons[longueur] = 1` (il ne reste rien : une seule façon, ne rien faire). Exemple : de combien de façons peut-on découper une suite de chiffres en morceaux de 1 ou 2 chiffres, chaque morceau valant entre 1 et 26 (comme des numéros de lettres) ?

```rust
fn decoupages(chiffres: &str) -> u64 {
    let octets = chiffres.as_bytes();
    let n = octets.len();
    let mut facons = vec![0_u64; n + 1];
    facons[n] = 1;
    for i in (0..n).rev() {
        if octets[i] != b'0' {
            facons[i] += facons[i + 1];
            if i + 1 < n && chiffres[i..i + 2].parse::<u32>().expect("deux chiffres") <= 26 {
                facons[i] += facons[i + 2];
            }
        }
    }
    facons[0]
}

assert_eq!(decoupages("1226"), 5);
assert_eq!(decoupages("90"), 0);
```

| `i` | Reste à découper | Morceau d'1 chiffre | Morceau de 2 chiffres | `facons[i]` |
|---|---|---|---|---|
| 4 | (rien) | | | 1 |
| 3 | `6` | `6` → `facons[4]` = 1 | impossible | 1 |
| 2 | `26` | `2` → `facons[3]` = 1 | `26` ≤ 26 → `facons[4]` = 1 | 2 |
| 1 | `226` | `2` → `facons[2]` = 2 | `22` → `facons[3]` = 1 | 3 |
| 0 | `1226` | `1` → `facons[1]` = 3 | `12` → `facons[2]` = 2 | **5** |

Les 5 découpages : 1-2-2-6, 1-2-26, 1-22-6, 12-2-6, 12-26. Un morceau ne peut pas commencer par `0` : pour `"90"`, le `0` final n'a aucune façon (0), et `90` > 26, donc 0 en tout.

**À retenir :** si un calcul retombe sur les mêmes questions, retiens chaque réponse : cache `HashMap` (clé = tout ce dont dépend la réponse, souvent un tuple) pour une récursion, ou tableau rempli du plus petit cas au plus grand.

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

Pas à pas (bornes comprises) :

| Question | Condition | `(2, 8)` et `(3, 7)` | `(2, 4)` et `(5, 9)` |
|---|---|---|---|
| `a` contient `b` ? | `a.0 <= b.0` et `b.1 <= a.1` | `2 <= 3` et `7 <= 8` : **oui** | `2 <= 5` mais `9 <= 4` faux : non |
| Ils se chevauchent ? | `a.0 <= b.1` et `b.0 <= a.1` | `2 <= 7` et `3 <= 8` : oui | `2 <= 9` mais `5 <= 4` faux : **non** |

L'idée du chevauchement : deux intervalles ne se touchent **pas** seulement si l'un finit avant que l'autre commence. La condition dit « chacun commence avant (ou au moment) où l'autre finit ». Avec des bornes comprises, `(2, 4)` et `(4, 7)` se chevauchent : ils partagent le 4. Pour « contient », pense à tester **dans les deux sens** (`a` contient `b`, ou `b` contient `a`).

Quand une partie 2 transforme des **milliards de nombres**, on ne les traite pas un par un : on transforme des intervalles entiers, en les **coupant** aux endroits où la règle change.

**Exemple : couper un intervalle par un autre.** Ici, les intervalles sont `[debut, fin)` : `debut` compris, `fin` **exclue** (comme `debut..fin` en Rust). Un morceau coupé par une zone donne jusqu'à trois parties : avant la zone, dans la zone, après la zone.

```rust
type Intervalle = (u64, u64);

fn decouper((debut, fin): Intervalle, (z_debut, z_fin): Intervalle) -> [Option<Intervalle>; 3] {
    let avant = (debut < z_debut).then_some((debut, fin.min(z_debut)));
    let dedans = (debut.max(z_debut) < fin.min(z_fin)).then_some((debut.max(z_debut), fin.min(z_fin)));
    let apres = (fin > z_fin).then_some((debut.max(z_fin), fin));
    [avant, dedans, apres]
}

fn main() {
    assert_eq!(decouper((10, 30), (20, 25)), [Some((10, 20)), Some((20, 25)), Some((25, 30))]);
    assert_eq!(decouper((10, 15), (20, 25)), [Some((10, 15)), None, None]);
    assert_eq!(decouper((22, 40), (20, 25)), [None, Some((22, 25)), Some((25, 40))]);
    println!("{:?}", decouper((10, 30), (20, 25)));
}
```

| Morceau | Zone | Avant | Dedans | Après |
|---|---|---|---|---|
| `[10, 30)` | `[20, 25)` | `[10, 20)` | `[20, 25)` | `[25, 30)` |
| `[10, 15)` | `[20, 25)` | `[10, 15)` (tout le morceau) | aucun : `max(10, 20) = 20` n'est pas `< min(15, 25) = 15` | aucun : 15 ne dépasse pas 25 |
| `[22, 40)` | `[20, 25)` | aucun : 22 n'est pas avant 20 | `[22, 25)` | `[25, 40)` |

La partie « dedans » est l'**intersection** : elle commence au plus grand des deux débuts et finit au plus petit des deux fins ; elle n'existe que si ce début est avant cette fin. La partie « dedans » subit la règle de la zone ; les parties « avant » et « après » restent à tester avec les autres zones. Quelques centaines de morceaux remplacent des milliards de nombres.

> [!warning] Inclus ou exclu ?
> Décide une fois pour toutes si `fin` est comprise (`2..=8`) ou non (`2..9`), et tiens-t'y. La plupart des erreurs d'intervalles viennent d'un « plus ou moins 1 » oublié.

**À retenir :** un intervalle = `(debut, fin)` ; chevauchement = `a.0 <= b.1 && b.0 <= a.1` (bornes comprises) ; pour d'énormes plages, découpe des intervalles entiers au lieu de traiter chaque nombre.

## 10. Quand ça ne marche pas

- **L'exemple passe mais pas la vraie entrée** : un cas absent de l'exemple (nombre à plusieurs chiffres, valeur négative, ligne vide, débordement). Relis l'énoncé mot par mot.
- **Trop lent** : compte les opérations (section 5). Une boucle dans une boucle sur 100 000 éléments, c'est 10 milliards.
- **Débogue sur l'exemple** : affiche l'état à chaque étape avec `println!("{:?}", ...)` et compare avec ce que décrit l'énoncé.

**Exemple pas à pas.** Ta solution qui additionne les nombres de chaque ligne passe l'exemple (`3 4` / `1 2`) mais pas ta vraie entrée. Tu affiches chaque ligne et son résultat, et tu repères la ligne `-5 12` : tu lisais avec `parse::<u32>()`, qui échoue sur `-5`, et ton `filter_map` jetait le nombre sans rien dire. L'exemple ne contenait aucun négatif. Correction : `i64`. Autres coupables fréquents : un nombre à plusieurs chiffres alors que l'exemple n'en avait qu'un, une ligne vide finale, un `u32` qui déborde.

**À retenir :** quand l'exemple passe mais pas la vraie entrée, cherche ce que la vraie entrée a de **différent** (taille, signes, nombre de chiffres, lignes vides) ; quand c'est trop lent, compte les opérations.
