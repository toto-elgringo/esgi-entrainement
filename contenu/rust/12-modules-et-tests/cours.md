# Modules et tests

## 1. Les modules : ranger son code

Un **module** est une boîte qui regroupe des fonctions, des structs, des enums... sous un même nom. On le crée avec `mod` :

```rust
mod geometrie {
    pub fn aire_rectangle(largeur: u32, hauteur: u32) -> u32 {
        largeur * hauteur
    }
}

fn main() {
    println!("{}", geometrie::aire_rectangle(3, 4));
}
```

On accède à ce qui est dedans avec un **chemin** : `geometrie::aire_rectangle`. Le `::` sépare les noms, comme le `/` dans un chemin de fichier.

Dans un vrai projet, un module est souvent un fichier : `mod geometrie;` dans `main.rs` va chercher `src/geometrie.rs`. Ici, tout est dans un seul fichier, mais les règles sont les mêmes.

Un module peut en contenir d'autres (on dit qu'ils sont **imbriqués**). Le chemin descend alors niveau par niveau :

```rust
mod ecole {
    pub mod classe {
        pub fn effectif() -> u32 {
            28
        }
    }
}

fn main() {
    println!("{} élèves", ecole::classe::effectif());
}
```

**Exemple résolu : lire le chemin `ecole::classe::effectif()`.**

1. `ecole` : on part de la racine du fichier et on entre dans le module `ecole`.
2. `classe` : dans `ecole`, on entre dans le module `classe`.
3. `effectif()` : dans `classe`, on appelle la fonction `effectif`.

Le programme affiche `28 élèves`. Pour que ce chemin marche depuis `main`, **chaque** étape doit être publique : `pub mod classe` et `pub fn effectif` (le module `ecole` lui-même est à la racine, au même niveau que `main`, donc `main` le voit sans `pub`).

**À retenir :** un chemin `a::b::c` se lit comme `a/b/c` : chaque morceau traversé depuis l'extérieur doit être `pub`.

## 2. `pub` : tout est privé par défaut

Comme les variables sont immuables par défaut, tout ce qui est dans un module est **privé** par défaut : invisible en dehors du module.

```text
error[E0603]: function `aire_rectangle` is private
```

On ajoute `pub` (pour *public*) devant ce qu'on veut rendre accessible depuis l'extérieur.

> [!tip] Pourquoi privé par défaut ?
> On n'expose que ce qui est utile. Le reste (les fonctions d'aide internes) peut changer sans casser le code des autres.

À l'**intérieur** du module, tout le monde se voit, privé ou pas : une fonction publique peut appeler une fonction d'aide privée du même module.

**Exemple résolu : quelles fonctions rendre publiques ?**

```rust
mod notes {
    fn sur_vingt(points: u32, total: u32) -> u32 {
        points * 20 / total
    }

    pub fn note_finale(points: u32, total: u32) -> u32 {
        sur_vingt(points, total)
    }
}

fn main() {
    println!("{}/20", notes::note_finale(15, 30));
}
```

| Fonction | Appelée depuis | Doit être `pub` ? |
|---|---|---|
| `note_finale` | `main`, en dehors du module | **oui**, sinon E0603 |
| `sur_vingt` | `note_finale`, dans le même module | non, c'est une aide interne |

Calcul : `15 * 20 / 30` = `300 / 30` = `10`, le programme affiche `10/20`.

**À retenir :** mets `pub` seulement sur ce qui est appelé depuis l'extérieur du module ; les aides internes restent privées.

## 3. Les champs de struct aussi sont privés

```rust
mod banque {
    pub struct Compte {
        titulaire: String,   // privé
        solde: u64,          // privé
    }

    impl Compte {
        pub fn ouvrir(titulaire: &str) -> Compte {
            Compte { titulaire: titulaire.to_string(), solde: 0 }
        }

        pub fn solde(&self) -> u64 {
            self.solde
        }
    }
}

fn main() {
    let compte = banque::Compte::ouvrir("Inès");
    println!("{}", compte.solde());
}
```

- `pub struct` rend le **type** public, mais **pas ses champs**.
- Depuis l'extérieur, `compte.solde = 1_000_000;` donne `error[E0616]: field `solde` of struct `Compte` is private`.
- Depuis l'extérieur, on ne peut pas non plus écrire `Compte { titulaire: ..., solde: 0 }` (les champs sont invisibles) : il faut une fonction publique qui fabrique la struct, comme `ouvrir`.
- On passe par des **méthodes** publiques : c'est l'**encapsulation**. Personne ne peut mettre le compte dans un état incohérent.

| Méthode | Paramètre `self` | Pourquoi |
|---|---|---|
| lire une valeur (`solde`) | `&self` | on regarde sans modifier |
| modifier (`ajouter`, `retirer`...) | `&mut self` | on change un champ |
| créer (`ouvrir`) | pas de `self` | la struct n'existe pas encore |

Pour renvoyer un champ `String` sans le copier, on renvoie une vue : `fn titulaire(&self) -> &str { &self.titulaire }`.

**Exemple résolu : une jauge qui ne déborde jamais.** Une `Jauge` a un niveau entre 0 et 10. `remplir(n)` ajoute `n` mais s'arrête à 10 ; `vider(n)` enlève `n` et renvoie `true`, sauf s'il n'y a pas assez : alors rien ne change et elle renvoie `false`.

```rust
mod reservoir {
    pub struct Jauge {
        niveau: u32,
    }

    impl Jauge {
        pub fn nouvelle() -> Jauge {
            Jauge { niveau: 0 }
        }

        pub fn niveau(&self) -> u32 {
            self.niveau
        }

        pub fn remplir(&mut self, quantite: u32) {
            self.niveau = (self.niveau + quantite).min(10);
        }

        pub fn vider(&mut self, quantite: u32) -> bool {
            if quantite > self.niveau {
                return false;
            }
            self.niveau -= quantite;
            true
        }
    }
}

fn main() {
    let mut jauge = reservoir::Jauge::nouvelle();
    jauge.remplir(7);
    jauge.remplir(6);
    println!("{}", jauge.niveau());
    println!("{} {}", jauge.vider(4), jauge.niveau());
    println!("{} {}", jauge.vider(9), jauge.niveau());
}
```

| Appel | Calcul | Niveau après | Renvoie |
|---|---|---|---|
| `remplir(7)` | `(0 + 7).min(10)` = 7 | 7 | |
| `remplir(6)` | `(7 + 6).min(10)` = 10 | 10 | |
| `vider(4)` | 4 > 10 ? non, `10 - 4` | 6 | `true` |
| `vider(9)` | 9 > 6 ? **oui** : on s'arrête | 6 | `false` |

On teste **avant** de soustraire : un `u32` ne peut pas être négatif, et `6 - 9` ferait paniquer le programme (*attempt to subtract with overflow*). Le programme affiche `10`, `true 6`, `false 6`.

**À retenir :** champs privés + méthodes publiques qui vérifient les règles avant de modifier : la struct ne peut jamais être dans un état faux.

## 4. `use` : raccourcir les chemins

```rust
mod restaurant {
    pub mod desserts {
        pub fn du_jour() -> &'static str { "tarte" }
    }
}

use restaurant::desserts;

fn main() {
    println!("{}", desserts::du_jour());   // au lieu de restaurant::desserts::du_jour()
}
```

- `use chemin::nom;` crée un raccourci.
- `use restaurant::{desserts, entrees};` importe plusieurs noms d'un coup.
- `use std::collections::HashMap;` : même chose avec la bibliothèque standard.
- `pub use` **réexporte** : le nom devient accessible depuis le module courant, comme s'il y avait été écrit.

Sans `use` et sans chemin complet, écrire `desserts::du_jour()` à la racine donne **E0433** (*cannot find module or crate `desserts` in this scope*) : à la racine, il n'existe pas de module `desserts`, seulement `restaurant`, qui le contient.

**Exemple résolu : un magasin avec deux rayons.**

```rust
mod magasin {
    pub mod fruits {
        pub fn promo() -> &'static str {
            "pommes"
        }
    }

    pub mod legumes {
        pub fn promo() -> &'static str {
            "carottes"
        }
    }
}

use magasin::{fruits, legumes};

fn affiche() -> String {
    format!("{} et {}", fruits::promo(), legumes::promo())
}

fn main() {
    println!("{}", affiche());
}
```

1. Les deux fonctions s'appellent `promo` : on importe les **modules** (`fruits`, `legumes`) et non les fonctions, pour garder un nom différent devant chaque `promo`.
2. `use magasin::{fruits, legumes};` crée les deux raccourcis en une ligne.
3. `format!("{} et {}", a, b)` remplace chaque `{}` par la valeur suivante, dans l'ordre : `"pommes et carottes"`.
4. Sans le `use`, on écrirait `magasin::fruits::promo()` : même résultat, plus long.

**À retenir :** E0433 sur un nom de module = il manque le chemin depuis la racine ; ajoute un `use` ou écris le chemin complet.

### `pub use` : réexporter

`use` crée un raccourci **privé** (utilisable seulement là où on l'écrit). `pub use` crée un raccourci **public** : le nom devient accessible depuis ce module, comme s'il y avait été défini.

```rust
mod outils {
    pub mod texte {
        pub fn crier(mot: &str) -> String {
            mot.to_uppercase()
        }
    }
}

pub use outils::texte::crier;

fn main() {
    println!("{}", crier("salut"));
}
```

**Exemple résolu :** `main` appelle `crier("salut")` sans aucun chemin.

1. `crier` est rangée dans `outils::texte`.
2. `pub use outils::texte::crier;` à la racine rend `crier` disponible **directement** à la racine.
3. `main` (et un module `tests` qui ferait `use super::*;`) la trouvent donc sans chemin : le programme affiche `SALUT`.

**À retenir :** pour qu'une fonction rangée loin soit utilisable sans chemin, écris `pub use chemin::vers::fonction;` là où tu veux l'utiliser.

## 5. Les chemins relatifs : `super` et `crate`

| Mot | Signifie |
|---|---|
| `crate::` | la racine du programme (le fichier `main.rs`) |
| `super::` | le module **parent** (celui qui contient le module actuel) |
| `self::` | le module actuel |

```rust
fn taux_tva() -> u64 { 20 }

mod facture {
    pub fn tva(prix_ht: u64) -> u64 {
        prix_ht * super::taux_tva() / 100
    }
}

fn main() {
    println!("{}", facture::tva(250));
}
```

> [!warning] Un module ne voit pas automatiquement son parent
> Dans `facture`, écrire `taux_tva()` seul donne `error[E0425]: cannot find function`. Il faut `super::taux_tva()` ou un `use`.

Un module enfant **peut** utiliser les éléments privés de ses parents. L'inverse est faux : le parent ne voit que les éléments `pub` de ses enfants.

**Exemple résolu : remonter de deux niveaux.**

```rust
fn bonus() -> u32 {
    5
}

mod jeu {
    pub fn score_de_base(points: u32) -> u32 {
        points * 10
    }

    pub mod niveau {
        pub fn score_final(points: u32) -> u32 {
            super::score_de_base(points) + super::super::bonus()
        }
    }
}

fn main() {
    println!("{}", jeu::niveau::score_final(3));
}
```

| On est dans | `super::` désigne | `super::super::` désigne |
|---|---|---|
| `jeu::niveau` | `jeu` | la racine |
| `jeu` | la racine | (rien au-dessus) |

1. `score_final` est dans `jeu::niveau`. `score_de_base` est dans `jeu`, le parent : `super::score_de_base`.
2. `bonus` est à la racine, deux niveaux au-dessus : `super::super::bonus()` (ou `crate::bonus()`).
3. Calcul : `3 * 10 + 5` = `35`.

`bonus` n'est pas `pub` : ce n'est pas grave, un enfant voit les éléments privés de ses parents.

**À retenir :** E0425 dans un module = le nom est ailleurs ; compte les niveaux et remonte avec `super::` (un par niveau) ou pars de la racine avec `crate::`.

### Pourcentages en centimes

Pour l'argent, on compte souvent en **centimes** avec des entiers (`u64`) : pas de nombres à virgule, donc pas d'arrondis bizarres. Avec des entiers, l'ordre des opérations compte : **multiplier d'abord, diviser ensuite**.

**Exemple résolu : 15 % de 1999 centimes.**

- `1999 * 15 / 100` = `29985 / 100` = `299` (la division entière enlève les décimales).
- `1999 / 100 * 15` = `19 * 15` = `285` : faux, on a perdu les centimes dès la première division.
- Prix après remise de 15 % : `1999 - 1999 * 15 / 100` = `1999 - 299` = `1700`.

**À retenir :** pourcentage d'un entier : `valeur * pourcentage / 100`, dans cet ordre.

## 6. Les tests

Un **test** est une fonction marquée `#[test]` qui vérifie que le code fait ce qu'on attend. `cargo test` les lance tous.

```rust
fn diviser(a: u32, b: u32) -> u32 {
    if b == 0 {
        panic!("division par zéro");
    }
    a / b
}

fn main() {
    println!("{}", diviser(10, 2));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn division_simple() {
        assert_eq!(diviser(10, 2), 5);
    }

    #[test]
    #[should_panic(expected = "division par zéro")]
    fn division_par_zero() {
        diviser(1, 0);
    }
}
```

- `#[cfg(test)]` : ce module n'est compilé **que** pendant `cargo test`.
- `use super::*;` : importe tout ce qui est dans le module parent.
- Un test **réussit** s'il se termine sans paniquer, **échoue** s'il panique.
- `panic!("message")` arrête le programme avec **ton** message. Sans ce `if`, `1 / 0` panique tout seul, mais avec le message anglais de Rust (*attempt to divide by zero*).

| Macro | Vérifie | Exemple |
|---|---|---|
| `assert!(cond)` | la condition est vraie | `assert!(est_pair(4))` |
| `assert_eq!(a, b)` | `a == b` | `assert_eq!(carre(3), 9)` |
| `assert_ne!(a, b)` | `a != b` | `assert_ne!(id_1, id_2)` |

Chaque macro accepte un message à la fin : `assert_eq!(carre(3), 9, "3 au carré doit faire 9");`.

`#[should_panic]` inverse la logique : le test réussit **seulement si** le code panique. Avec `expected = "..."`, le message de panique doit contenir ce texte.

> [!tip] Sur cette plateforme
> Le bouton « Vérifier » ajoute un module `mod tests` à la fin de ton code. Si tu écris tes propres tests, appelle ton module autrement (par exemple `mod mes_tests`). Tous les tests, les tiens compris, sont lancés.

**Exemple résolu : trois tests qui ne passent pas, et pourquoi.**

```text
fn moyenne(a: u32, b: u32) -> u32 { (a + b) / 2 }

#[test] fn t1() { assert_eq!(moyenne(3, 4), 3.5); }     // ne compile pas
#[test] fn t2() { moyenne(u32::MAX, 1); }              // panique : test raté
#[test] fn t3() { assert_eq!(moyenne(3, 4), 4); }      // échoue : 3 != 4
```

1. `t1` : `moyenne` renvoie un `u32` (un entier), et `3.5` est un nombre à virgule (`f64`). On ne peut pas comparer deux types différents : erreur **E0308** (*mismatched types*). La bonne valeur est `3`, car la division entière `7 / 2` donne `3` (on jette le reste).
2. `t2` : `u32::MAX + 1` dépasse la plus grande valeur d'un `u32`, le programme panique. Si cette panique est **voulue**, on ajoute `#[should_panic]` sous `#[test]` (avec `expected = "..."` pour exiger un message précis).
3. `t3` : `assert_eq!` compare `3` à `4`, différents : la macro panique et affiche les deux valeurs (`left: 3, right: 4`). Ici c'est la valeur attendue du test qui est fausse.

**À retenir :** un test qui ne compile pas → regarde les **types** ; un test qui panique → c'est un bug, ou une panique attendue à déclarer avec `#[should_panic]`.

### Organisation dans un projet Cargo

```
mon_projet/
├── src/
│   └── lib.rs      tests unitaires : #[cfg(test)] mod tests dans chaque fichier
└── tests/
    └── api.rs      tests d'intégration : utilisent seulement l'API publique
```

```bash
cargo test                  # tous les tests
cargo test division         # seulement ceux dont le nom contient « division »
```

**Exemple résolu :** avec les tests `division_simple`, `division_par_zero` et `addition`, `cargo test division` lance les deux premiers (leur nom **contient** « division ») et ignore `addition`.

**À retenir :** le mot après `cargo test` filtre les tests par morceau de nom.

## 7. Modules imbriqués et nombres à virgule

Un module rangé dans un autre peut réutiliser son voisin : depuis `meteo::alerte`, le module `conversion` (voisin, dans le même parent `meteo`) s'atteint avec `super::conversion`. On peut aussi l'importer une fois pour toutes en haut du module : `use super::conversion::nom_de_fonction;`.

Avec des `f64` (nombres à virgule), toutes les constantes s'écrivent avec un point : `9.0 / 5.0` et pas `9 / 5`. Écrire `x * 9` avec `x: f64` ne compile pas (E0277 : on ne peut pas multiplier un `f64` par un entier).

**Exemple résolu : des distances en miles.** Un module `trajet` convertit des kilomètres en miles (`km / 1.609`) et classe un trajet.

```rust
mod trajet {
    pub mod unites {
        pub fn miles_vers_km(miles: f64) -> f64 {
            miles * 1.609
        }
    }

    pub mod categorie {
        use super::unites::miles_vers_km;

        pub fn classer(miles: f64) -> &'static str {
            let km = miles_vers_km(miles);
            if km < 5.0 {
                "court"
            } else if km < 50.0 {
                "moyen"
            } else {
                "long"
            }
        }
    }
}

pub use trajet::categorie::classer;

fn main() {
    println!("{}", classer(2.0));
    println!("{}", classer(10.0));
    println!("{}", classer(100.0));
}
```

| Miles | Kilomètres (`× 1.609`) | `< 5.0` ? | `< 50.0` ? | Catégorie |
|---|---|---|---|---|
| 2 | 3.218 | oui | | `court` |
| 10 | 16.09 | non | oui | `moyen` |
| 100 | 160.9 | non | non | `long` |

1. `classer` est dans `trajet::categorie` ; `miles_vers_km` est dans `trajet::unites`, voisin : `use super::unites::miles_vers_km;`.
2. La chaîne `if / else if / else` teste les seuils **dans l'ordre**, du plus petit au plus grand : le premier vrai gagne. Une valeur pile sur un seuil (5.0 km) n'est pas `< 5.0`, elle tombe dans la catégorie suivante.
3. `pub use trajet::categorie::classer;` permet à `main` d'écrire `classer(...)` sans chemin.

**À retenir :** voisin = `super::voisin::...` ; `f64` = constantes avec `.0` ; seuils = `if / else if` du plus petit au plus grand avec `<`.

## À retenir

- `mod` crée un module ; on y accède avec `module::nom`.
- Tout est **privé** par défaut, même les champs d'une `pub struct` : `pub` pour exposer.
- `use` crée un raccourci, `pub use` réexporte.
- `super::` = module parent, `crate::` = racine.
- Erreurs : E0603 (privé), E0616 (champ privé), E0433 (module introuvable), E0425 (fonction introuvable).
- Tests : `#[cfg(test)] mod tests { use super::*; #[test] fn ... }`.
- `assert!`, `assert_eq!`, `assert_ne!` ; `#[should_panic(expected = "...")]` pour tester une panique.
