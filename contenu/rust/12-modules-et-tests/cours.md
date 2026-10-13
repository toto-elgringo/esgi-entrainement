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

## 2. `pub` : tout est privé par défaut

Comme les variables sont immuables par défaut, tout ce qui est dans un module est **privé** par défaut : invisible en dehors du module.

```text
error[E0603]: function `aire_rectangle` is private
```

On ajoute `pub` (pour *public*) devant ce qu'on veut rendre accessible depuis l'extérieur.

> [!tip] Pourquoi privé par défaut ?
> On n'expose que ce qui est utile. Le reste (les fonctions d'aide internes) peut changer sans casser le code des autres.

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
```

- `pub struct` rend le **type** public, mais **pas ses champs**.
- Depuis l'extérieur, `compte.solde = 1_000_000;` donne `error[E0616]: field `solde` of struct `Compte` is private`.
- On passe par des **méthodes** publiques : c'est l'**encapsulation**. Personne ne peut mettre le compte dans un état incohérent.

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
```

> [!warning] Un module ne voit pas automatiquement son parent
> Dans `facture`, écrire `taux_tva()` seul donne `error[E0425]: cannot find function`. Il faut `super::taux_tva()` ou un `use`.

Un module enfant **peut** utiliser les éléments privés de ses parents. L'inverse est faux : le parent ne voit que les éléments `pub` de ses enfants.

## 6. Les tests

Un **test** est une fonction marquée `#[test]` qui vérifie que le code fait ce qu'on attend. `cargo test` les lance tous.

```rust
fn diviser(a: u32, b: u32) -> u32 {
    if b == 0 {
        panic!("division par zéro");
    }
    a / b
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

| Macro | Vérifie | Exemple |
|---|---|---|
| `assert!(cond)` | la condition est vraie | `assert!(est_pair(4))` |
| `assert_eq!(a, b)` | `a == b` | `assert_eq!(carre(3), 9)` |
| `assert_ne!(a, b)` | `a != b` | `assert_ne!(id_1, id_2)` |

Chaque macro accepte un message à la fin : `assert_eq!(carre(3), 9, "3 au carré doit faire 9");`.

`#[should_panic]` inverse la logique : le test réussit **seulement si** le code panique. Avec `expected = "..."`, le message de panique doit contenir ce texte.

> [!tip] Sur cette plateforme
> Le bouton « Vérifier » ajoute un module `mod tests` à la fin de ton code. Si tu écris tes propres tests, appelle ton module autrement (par exemple `mod mes_tests`). Tous les tests, les tiens compris, sont lancés.

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

## À retenir

- `mod` crée un module ; on y accède avec `module::nom`.
- Tout est **privé** par défaut, même les champs d'une `pub struct` : `pub` pour exposer.
- `use` crée un raccourci, `pub use` réexporte.
- `super::` = module parent, `crate::` = racine.
- Tests : `#[cfg(test)] mod tests { use super::*; #[test] fn ... }`.
- `assert!`, `assert_eq!`, `assert_ne!` ; `#[should_panic(expected = "...")]` pour tester une panique.
