# Enums et Option

> [!info] Ce que dit le cours
> Les enums de Rust ne sont **pas** des entiers nommés comme en C ou en Java. Ce sont des **types somme** (on dit aussi unions étiquetées, ou types algébriques) : chaque variante peut porter ses propres données, de types différents. C'est sans doute le trait le plus marquant du langage, et la base d'`Option` et de `Result`.

## 1. Une enum : un choix parmi plusieurs possibilités

Une **enum** (énumération) est un type dont la valeur est **exactement une** de ses **variantes**.

```rust
enum Feu {
    Rouge,
    Orange,
    Vert,
}

let feu = Feu::Rouge;
```

> [!tip] struct = ET, enum = OU
> Un `Eleve` a un nom **et** un âge (struct). Un `Feu` est rouge **ou** orange **ou** vert (enum).

On écrit le nom de l'enum, puis `::`, puis la variante : `Feu::Rouge`.

**Exemple résolu : une enum pour les saisons, et comment l'afficher**

```rust
#[derive(Debug, PartialEq)]
enum Saison {
    Printemps,
    Ete,
    Automne,
    Hiver,
}

fn main() {
    let maintenant = Saison::Ete;
    let plus_tard = Saison::Hiver;
    println!("{maintenant:?} puis {plus_tard:?}");
    println!("Même saison ? {}", maintenant == plus_tard);
    println!("Printemps et automne différents ? {}", Saison::Printemps != Saison::Automne);
}
```

1. `enum Saison { ... }` crée un **nouveau type**, `Saison`, qui a 4 valeurs possibles.
2. `Saison::Ete` fabrique une valeur de ce type : le nom du type, `::`, la variante. Écrire `Ete` tout seul ou `Saison.Ete` ne compile pas.
3. `#[derive(Debug)]` permet l'affichage avec `{:?}` (ici `Ete puis Hiver`). Sans lui, `println!("{maintenant:?}")` ne compile pas.
4. `#[derive(PartialEq)]` permet de comparer avec `==` et `!=`. Les tests (`assert_eq!`) ont besoin des deux : `PartialEq` pour comparer, `Debug` pour afficher la valeur fautive.

**À retenir :** une valeur d'enum s'écrit `Type::Variante` ; ajoute `#[derive(Debug, PartialEq)]` pour pouvoir l'afficher et la comparer.

## 2. Types produit et types somme

Pourquoi ces noms ? Comptons les valeurs possibles de trois petits types :

```rust
enum Couleur { Rouge, Vert, Bleu }               // 3 valeurs
struct Lampe { allumee: bool, couleur: Couleur } // 2 × 3 = 6 valeurs
enum EtatLampe { Eteinte, Allumee(Couleur) }     // 1 + 3 = 4 valeurs
```

| Type | Le nombre de valeurs… | Nom |
|---|---|---|
| struct, tuple `(bool, Couleur)` | se **multiplie** : toutes les combinaisons de champs sont permises | type **produit** |
| enum | s'**additionne** : une variante **ou** une autre | type **somme** |
| `Option<bool>` | 2 + 1 = **3** (`Some(true)`, `Some(false)`, `None`) | somme |
| `()` | 1 seule valeur : l'ajouter comme champ ne change rien (× 1) | |
| `enum Vide {}` | **aucune** valeur : une struct qui en contient une ne peut pas exister (× 0) | |

La différence n'est pas qu'arithmétique : `Lampe` accepte « éteinte, mais rouge », soit 6 valeurs pour 4 états réels. `EtatLampe` en a **exactement 4**. Avec struct et enum, on décrit un domaine sans **état impossible** ni **cas oublié**.

**Exemple résolu : compter les valeurs d'une commande de café**

On part de `enum Taille { Petit, Moyen, Grand }` (3 valeurs) et on compte, type par type :

| Type | Calcul | Nombre de valeurs |
|---|---|---|
| `struct Boisson { glace: bool, taille: Taille }` | produit : 2 (`bool`) × 3 (`Taille`) | 6 |
| `(Taille, Taille)` | produit : 3 × 3 | 9 |
| `enum Commande { Rien, Cafe(Taille), The { sucre: bool } }` | somme : 1 (`Rien`) + 3 (`Cafe` avec chaque taille) + 2 (`The` sucré ou non) | 6 |
| `Option<Taille>` | somme : 3 (`Some` avec chaque taille) + 1 (`None`) | 4 |

Méthode : une variante **sans** donnée compte pour 1 ; une variante **avec** une donnée compte autant que cette donnée a de valeurs ; une struct multiplie ses champs.

**À retenir :** struct ou tuple = on **multiplie** les possibilités des champs ; enum = on **additionne** celles des variantes.

## 3. `match` sur une enum

```rust
fn action(feu: &Feu) -> &'static str {
    match feu {
        Feu::Rouge => "stop",
        Feu::Orange => "ralentir",
        Feu::Vert => "passer",
    }
}
```

Le `match` doit couvrir **toutes** les variantes (il est **exhaustif**). Si on en oublie une, le code ne compile pas :

```text
error[E0004]: non-exhaustive patterns: `Feu::Vert` not covered
```

> [!warning] Le `_` paresseux
> Le jour où tu ajoutes une variante (`Feu::Clignotant`), le compilateur liste tous les `match` à mettre à jour. Un `_ => ...` le rend muet : évite-le sur tes propres enums.

Comment le `match` s'exécute :

1. Il compare la valeur avec le **motif** de chaque bras (ce qui est à gauche de `=>`), **de haut en bas**.
2. Le **premier** bras qui correspond gagne : son expression (à droite de `=>`) est le résultat du `match`. Les bras suivants ne sont pas regardés.
3. Le `match` est une **expression** : il donne une valeur, qu'on peut renvoyer ou ranger dans une variable. Tous les bras doivent donc donner le **même type**.

Le type `&'static str` veut dire « un texte écrit directement dans le programme » (comme `"stop"`) : il existe pendant toute l'exécution.

**Exemple résolu : la météo des saisons**

```rust
#[derive(Debug)]
enum Saison {
    Printemps,
    Ete,
    Automne,
    Hiver,
}

fn temperature(saison: &Saison) -> i32 {
    match saison {
        Saison::Printemps => 15,
        Saison::Ete => 28,
        Saison::Automne => 12,
        Saison::Hiver => 3,
    }
}

fn conseil(saison: &Saison) -> &'static str {
    match saison {
        Saison::Ete => "short",
        Saison::Printemps | Saison::Automne => "veste",
        Saison::Hiver => "manteau",
    }
}

fn suivante(saison: Saison) -> Saison {
    match saison {
        Saison::Printemps => Saison::Ete,
        Saison::Ete => Saison::Automne,
        Saison::Automne => Saison::Hiver,
        Saison::Hiver => Saison::Printemps,
    }
}

fn main() {
    let saisons = [Saison::Printemps, Saison::Ete, Saison::Automne, Saison::Hiver];
    for saison in &saisons {
        println!("{saison:?} : {} °C, {}", temperature(saison), conseil(saison));
    }
    let s = suivante(Saison::Hiver);
    println!("Après l'hiver : {s:?}");
}
```

Suivons `conseil(&Saison::Automne)` :

| Bras testé | Correspond à `Automne` ? |
|---|---|
| `Saison::Ete` | non, on passe au suivant |
| `Saison::Printemps \| Saison::Automne` | **oui** : le `\|` veut dire « l'un **ou** l'autre » |

Résultat : `"veste"`. Le bras `Hiver` n'est même pas regardé.

- `Saison::Printemps | Saison::Automne` regroupe deux variantes dans un seul bras, sans `_` : si on ajoute une variante plus tard, le compilateur le signalera quand même.
- `temperature` et `conseil` reçoivent `&Saison` : elles **empruntent** la saison et la laissent au propriétaire. `suivante` reçoit `Saison` (sans `&`) : elle **prend** la valeur et en rend une nouvelle.
- Pour corriger une erreur E0004, lis le nom de la variante citée dans le message (`not covered`) et ajoute **son** bras.

### Les gardes : un `if` dans un bras

Sur un nombre, on peut ajouter une condition à un motif : `x if condition => ...` (on appelle ça une **garde**). Le bras ne gagne que si le motif correspond **et** que la condition est vraie.

```rust
fn classer(n: u32) -> &'static str {
    match n {
        0 => "zéro",
        x if x % 4 == 0 => "multiple de 4",
        x if x % 2 == 0 => "pair",
        _ => "impair",
    }
}

fn main() {
    for n in [0, 8, 6, 7] {
        println!("{n} : {}", classer(n));
    }
}
```

| `n` | `0` ? | `% 4 == 0` ? | `% 2 == 0` ? | Résultat |
|---|---|---|---|---|
| 0 | **oui** | | | zéro |
| 8 | non | **oui** | | multiple de 4 |
| 6 | non | non (6 % 4 = 2) | **oui** | pair |
| 7 | non | non | non | `_` : impair |

L'**ordre** compte : si le bras « pair » était avant « multiple de 4 », 8 serait classé « pair » (premier bras qui correspond) et le bras « multiple de 4 » ne servirait jamais. Mets toujours le cas le **plus précis** en premier.

Ici, le `_` final est obligatoire et normal : un `u32` a plus de 4 milliards de valeurs, on ne peut pas toutes les écrire. Si tu as besoin de la valeur dans ce dernier bras, donne-lui un nom à la place de `_` : `x => ...`.

**À retenir :** le `match` teste les bras de haut en bas et prend le premier qui correspond ; regroupe des variantes avec `|`, mets les cas précis avant les cas généraux, et garde `_` pour « tout le reste » d'un nombre ou d'un texte.

## 4. Des variantes qui contiennent des données

Chaque variante peut transporter ses propres données :

```rust
enum Forme {
    Cercle { rayon: f64 },              // champs nommés, comme une struct
    Rectangle(f64, f64),                // champs numérotés, comme un tuple
    Point,                              // aucune donnée
}

let f = Forme::Rectangle(3.0, 4.0);
```

Le `match` **déstructure** la variante : il sort les données dans des variables.

```rust
let aire = match f {
    Forme::Cercle { rayon } => std::f64::consts::PI * rayon * rayon,
    Forme::Rectangle(largeur, hauteur) => largeur * hauteur,
    Forme::Point => 0.0,
};
```

Les trois façons d'écrire le motif d'une variante :

| Variante | Motif qui sort les données | Motif qui les ignore |
|---|---|---|
| `Cercle { rayon: f64 }` (champs nommés) | `Forme::Cercle { rayon }` : la variable porte le nom du champ | `Forme::Cercle { .. }` |
| `Rectangle(f64, f64)` (champs numérotés) | `Forme::Rectangle(l, h)` : tu choisis les noms, dans l'ordre | `Forme::Rectangle(..)` ou `Forme::Rectangle(_, _)` |
| `Point` (aucune donnée) | `Forme::Point` | `Forme::Point` |

Pour un champ nommé, tu peux aussi renommer : `Forme::Cercle { rayon: r }` met le rayon dans `r`.

> [!tip] π et les décimales
> π s'écrit `std::f64::consts::PI` (ou `use std::f64::consts::PI;` en haut du fichier, puis `PI`). N'écris pas `3.14` : clippy le refuse, la valeur est trop approximative. Pour afficher 2 décimales : `{:.2}`.

**Exemple résolu : le total d'un paiement**

```rust
enum Paiement {
    Especes(f64),
    Carte { montant: f64, frais: f64 },
    Gratuit,
}

impl Paiement {
    fn total(&self) -> f64 {
        match self {
            Paiement::Especes(somme) => *somme,
            Paiement::Carte { montant, frais } => montant + frais,
            Paiement::Gratuit => 0.0,
        }
    }

    fn moyen(&self) -> &'static str {
        match self {
            Paiement::Especes(..) => "espèces",
            Paiement::Carte { .. } => "carte",
            Paiement::Gratuit => "gratuit",
        }
    }
}

fn main() {
    let paiements = [
        Paiement::Especes(12.5),
        Paiement::Carte { montant: 40.0, frais: 0.6 },
        Paiement::Gratuit,
    ];
    for p in &paiements {
        println!("{} : {:.2} €", p.moyen(), p.total());
    }
}
```

Suivons `Paiement::Carte { montant: 40.0, frais: 0.6 }.total()` :

1. Bras `Especes(somme)` : ce n'est pas des espèces, on passe.
2. Bras `Carte { montant, frais }` : ça correspond. Le motif crée deux variables, `montant` (40.0) et `frais` (0.6).
3. Le bras calcule `montant + frais` = 40.6, c'est le résultat du `match`, donc de la fonction.

Affichage : `espèces : 12.50 €`, `carte : 40.60 €`, `gratuit : 0.00 €`.

Un détail : `total` reçoit `&self` (une **référence** vers le paiement). Les variables sorties par le motif sont alors elles aussi des références : `somme` est un `&f64`, pas un `f64`. Les calculs (`montant + frais`) acceptent les références, mais pour **renvoyer** la valeur seule, il faut la sortir de la référence avec `*` : `*somme`.

**À retenir :** le motif d'un bras a la même forme que la variante (`{ champ }` ou `(a, b)`) ; `..` ignore les données ; sur `&self`, les données sorties sont des références, `*` donne la valeur.

## 5. Des enums dans des enums : l'inventaire du cours

Le cours modélise l'inventaire d'un jeu. Les variantes ont des données de types différents, et une enum peut en contenir une autre :

```rust
enum Potion {
    Soin(u8),
    Mana(u8),
    Force(i8),
}

enum Arme {
    Epee { degats: u8 },
    Hache { degats: u8 },
    Arc { degats: u8, portee: u32 },
}

enum Objet {
    Rien,
    Arme(Arme),
    Armure { defense: u8 },
    Potion(Potion),
}

fn decrire(objet: &Objet) -> String {
    match objet {
        Objet::Rien => "rien".to_string(),
        Objet::Armure { defense } => format!("armure ({defense} de défense)"),
        Objet::Arme(Arme::Arc { degats, portee }) => format!("arc : {degats} dégâts à {portee} m"),
        Objet::Arme(_) => "arme de corps à corps".to_string(),
        Objet::Potion(_) => "potion".to_string(),
    }
}

fn main() {
    let sac = [
        Objet::Arme(Arme::Arc { degats: 7, portee: 40 }),
        Objet::Armure { defense: 3 },
        Objet::Rien,
    ];
    for objet in &sac {
        println!("{}", decrire(objet));
    }
}
```

Le motif va **en profondeur** : `Objet::Arme(Arme::Arc { degats, portee })` ouvre deux niveaux d'un coup et sort les champs. Les bras sont testés **dans l'ordre** : l'arc est pris avant le `Objet::Arme(_)` qui attrape les autres armes.

### Trois outils pour les motifs : `|`, `..` et `*`

| Outil | Exemple | Effet |
|---|---|---|
| `\|` | `Arme::Epee { degats } \| Arme::Hache { degats }` | l'un **ou** l'autre ; chaque côté doit sortir les **mêmes** variables, du même type |
| `..` | `Arme::Arc { portee, .. }` | ignore les champs qu'on ne cite pas |
| `*` | `*degats` | sort la valeur d'une référence (nécessaire pour renvoyer un `u8` quand le motif a donné un `&u8`) |

Pour fabriquer un texte, chaque bras doit donner un `String` : `"rien".to_string()` pour un texte fixe, `format!("... {variable} ...")` pour un texte avec des valeurs. `{:+}` affiche toujours le signe d'un nombre : `format!("{:+}", 3)` donne `+3`, `format!("{:+}", -2)` donne `-2`.

**Exemple résolu : un garage**

```rust
enum Moteur {
    Essence { chevaux: u16 },
    Diesel { chevaux: u16 },
    Electrique { chevaux: u16, autonomie_km: u32 },
}

enum Vehicule {
    Velo,
    Voiture(Moteur),
    Trottinette { pente_max: i8 },
}

fn puissance(v: &Vehicule) -> u16 {
    match v {
        Vehicule::Voiture(
            Moteur::Essence { chevaux } | Moteur::Diesel { chevaux } | Moteur::Electrique { chevaux, .. },
        ) => *chevaux,
        Vehicule::Velo | Vehicule::Trottinette { .. } => 0,
    }
}

fn autonomie(v: &Vehicule) -> Option<u32> {
    match v {
        Vehicule::Voiture(Moteur::Electrique { autonomie_km, .. }) => Some(*autonomie_km),
        _ => None,
    }
}

fn decrire(v: &Vehicule) -> String {
    match v {
        Vehicule::Velo => "vélo".to_string(),
        Vehicule::Voiture(Moteur::Electrique { .. }) => "voiture électrique".to_string(),
        Vehicule::Voiture(Moteur::Essence { .. } | Moteur::Diesel { .. }) => "voiture thermique".to_string(),
        Vehicule::Trottinette { pente_max } => format!("trottinette (pente {pente_max:+} %)"),
    }
}

fn main() {
    let garage = [
        Vehicule::Voiture(Moteur::Electrique { chevaux: 150, autonomie_km: 400 }),
        Vehicule::Voiture(Moteur::Diesel { chevaux: 90 }),
        Vehicule::Voiture(Moteur::Essence { chevaux: 110 }),
        Vehicule::Trottinette { pente_max: 8 },
        Vehicule::Velo,
    ];
    for v in &garage {
        println!("{} | {} ch | autonomie {:?}", decrire(v), puissance(v), autonomie(v));
    }
}
```

Suivons la voiture électrique :

1. `puissance` : le premier bras ouvre `Vehicule::Voiture(...)`, puis essaie les trois moteurs séparés par `|`. `Electrique { chevaux, .. }` correspond : `chevaux` vaut `&150` (le `..` ignore l'autonomie). On renvoie `*chevaux`, soit `150`.
2. `autonomie` : le motif ouvre deux niveaux et sort `autonomie_km` ; on renvoie `Some(400)`. Pour le diesel, ce bras ne correspond pas : `_` donne `None`. Ici le `_` est voulu, il veut vraiment dire « tous les autres véhicules ».
3. `decrire` : chaque variante a son bras (pas de `_`), donc ajouter un moteur `Hybride` plus tard ferait signaler ce `match` par le compilateur. La trottinette affiche `pente +8 %` grâce à `{:+}`.

**À retenir :** écris le motif comme la valeur, niveau par niveau ; `|` regroupe des variantes qui sortent les mêmes variables, `..` ignore le reste, `*` sort la valeur d'une référence.

## 6. Méthodes et derive

Comme pour une struct, on peut écrire un bloc `impl` et utiliser `#[derive(...)]` :

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
enum Feu {
    Rouge,
    Orange,
    Vert,
}

impl Feu {
    fn suivant(self) -> Feu {
        match self {
            Feu::Vert => Feu::Orange,
            Feu::Orange => Feu::Rouge,
            Feu::Rouge => Feu::Vert,
        }
    }
}
```

Ce que donne chaque `derive` :

| derive | Permet |
|---|---|
| `Debug` | l'affichage `{:?}` (et les messages des tests) |
| `PartialEq` | la comparaison `==` / `!=` (et `assert_eq!`) |
| `Clone` | `.clone()` : une copie explicite |
| `Copy` | la copie automatique : passer la valeur à une fonction ne la « déplace » plus, l'ancienne variable reste utilisable |

**Exemple résolu : une enum de commandes qui modifie une struct**

Une enum sert souvent à décrire des **messages** (des ordres) qu'on applique à un objet. La méthode reçoit `&mut self` : elle **modifie** l'objet sur place.

```rust
#[derive(Debug)]
enum Ordre {
    Regler { min: i32, max: i32 },
    Decaler(i32, i32),
    Renommer(String),
    Eteindre,
}

#[derive(Debug)]
struct Thermostat {
    plage: (i32, i32),
    nom: String,
    allume: bool,
}

impl Thermostat {
    fn new() -> Self {
        Self {
            plage: (18, 22),
            nom: String::new(),
            allume: true,
        }
    }

    fn appliquer(&mut self, ordre: Ordre) {
        if !self.allume {
            return;
        }
        match ordre {
            Ordre::Regler { min, max } => self.plage = (min, max),
            Ordre::Decaler(bas, haut) => {
                self.plage.0 += bas;
                self.plage.1 += haut;
            }
            Ordre::Renommer(nom) => self.nom = nom,
            Ordre::Eteindre => self.allume = false,
        }
    }
}

fn main() {
    let mut t = Thermostat::new();
    t.appliquer(Ordre::Decaler(1, 2));
    t.appliquer(Ordre::Renommer(String::from("salon")));
    t.appliquer(Ordre::Eteindre);
    t.appliquer(Ordre::Regler { min: 5, max: 10 });
    println!("{t:?}");
}
```

| Ordre reçu | Allumé ? | État après |
|---|---|---|
| (départ) | oui | plage `(18, 22)`, nom `""` |
| `Decaler(1, 2)` | oui | `plage.0` : 18 + 1 = 19, `plage.1` : 22 + 2 = 24 → `(19, 24)` |
| `Renommer("salon")` | oui | nom `"salon"` |
| `Eteindre` | oui | `allume` passe à `false` |
| `Regler { min: 5, max: 10 }` | **non** | le `return` du début sort tout de suite : rien ne change |

Affichage : `Thermostat { plage: (19, 24), nom: "salon", allume: false }`.

- `self.plage.0` et `self.plage.1` lisent ou modifient les cases d'un tuple (numérotées à partir de 0).
- `if !self.allume { return; }` en tête de méthode : une fois éteint, tous les ordres suivants sont ignorés.
- `Renommer(nom)` **remplace** le nom. Pour **ajouter** du texte à la fin d'un `String`, on écrirait `self.nom.push_str(&nom)`.
- `let mut t` : sans `mut`, on ne pourrait pas appeler une méthode `&mut self`.

**À retenir :** `&self` pour lire, `&mut self` pour modifier sur place, `self` pour consommer la valeur ; `derive` ajoute affichage, comparaison et copie.

## 7. Rendre les états impossibles inexprimables

Modélisons la connexion d'un client. Version « drapeaux » :

```rust
struct Client {
    connecte: bool,
    en_cours: bool,
    session: Option<u64>,
    pseudo: Option<String>,
}
```

2 × 2 × 2 × 2 = **16 combinaisons**, dont la plupart n'ont aucun sens : connecté **et** en cours de connexion, connecté sans session, une session sans pseudo… Il faudrait les interdire une par une, à coups de vérifications et de discipline.

Version enum :

```rust
enum Connexion {
    Deconnecte,
    EnCours { depuis_ms: u64 },
    Connecte { session: u64, pseudo: String },
}
```

**Exactement 3 états**, ceux qui existent vraiment. Les autres ne sont pas interdits : ils sont **impossibles à écrire**. Et chaque `match` sur une `Connexion` doit traiter les trois cas : c'est le compilateur qui tient la liste.

> [!tip] Le conseil de conception le plus rentable
> La communauté le résume en « *make illegal states unrepresentable* » : choisir des types où une valeur incohérente ne peut même pas être construite.

**Exemple résolu : le suivi d'un colis, avec des transitions**

On passe d'un état à l'autre avec des méthodes qui prennent `self` (sans `&`) : elles **consomment** l'ancien état et renvoient le nouveau. Une transition qui n'a pas de sens renvoie l'état tel quel.

```rust
#[derive(Debug)]
enum Colis {
    EnPreparation,
    Expedie { jour: u32 },
    Livre { signataire: String },
}

impl Colis {
    fn expedier(self, aujourdhui: u32) -> Colis {
        match self {
            Colis::EnPreparation => Colis::Expedie { jour: aujourdhui },
            autre => autre,
        }
    }

    fn livrer(self, nom: &str) -> Colis {
        match self {
            Colis::Expedie { .. } => Colis::Livre {
                signataire: nom.to_string(),
            },
            autre => autre,
        }
    }

    fn signataire(&self) -> Option<&str> {
        match self {
            Colis::Livre { signataire } => Some(signataire.as_str()),
            Colis::EnPreparation | Colis::Expedie { .. } => None,
        }
    }

    fn en_retard(&self, aujourdhui: u32, delai: u32) -> bool {
        match self {
            Colis::Expedie { jour } => aujourdhui - *jour > delai,
            Colis::EnPreparation | Colis::Livre { .. } => false,
        }
    }
}

fn main() {
    let colis = Colis::EnPreparation.livrer("Léa");
    println!("{colis:?}");
    let colis = colis.expedier(3);
    println!("{colis:?}, en retard au jour 10 ? {}", colis.en_retard(10, 5));
    let colis = colis.livrer("Léa");
    println!("{colis:?}, signé par {:?}", colis.signataire());
}
```

Pas à pas :

1. `Colis::EnPreparation.livrer("Léa")` : livrer un colis pas encore expédié n'a pas de sens. Le bras `Expedie { .. }` ne correspond pas, on tombe sur `autre => autre`. `autre` est un **nom de variable** : ce motif attrape n'importe quelle valeur et la range dans `autre`, qu'on renvoie sans y toucher. Résultat : toujours `EnPreparation`.
2. `.expedier(3)` : `EnPreparation` correspond au premier bras → `Expedie { jour: 3 }`.
3. `.en_retard(10, 5)` : `jour` vaut `&3`, donc `10 - 3 = 7`, et `7 > 5` → `true`. « Plus de » se traduit par `>` : avec exactement 5 jours d'écart, ce ne serait pas encore un retard.
4. `.livrer("Léa")` : depuis `Expedie`, on passe à `Livre { signataire: "Léa" }` (`nom.to_string()` fabrique un `String` à partir du `&str`).
5. `.signataire()` : `signataire` est un `&String` ; `.as_str()` le transforme en `&str`, et on renvoie `Some("Léa")`.

Comme chaque transition consomme `self`, on réécrit `let colis = colis.expedier(3);` : l'ancienne valeur n'existe plus, impossible de la réutiliser par erreur.

**À retenir :** une machine à états = une enum + des méthodes `self -> Self` ; `autre => autre` laisse passer les cas où rien ne change.

## 8. `Option<T>` : il n'y a pas de `null` en Rust

Dans beaucoup de langages, une valeur peut être `null` (« rien »), et oublier de le vérifier fait planter le programme. Tony Hoare, qui a inventé le pointeur nul en 1965, l'appelle son « erreur à un milliard de dollars ». Rust n'a **pas** de `null`. À la place, la bibliothèque standard définit une enum ordinaire :

```rust
enum Option<T> {
    Some(T),   // il y a une valeur
    None,      // il n'y a rien
}
```

`T` veut dire « n'importe quel type » : `Option<i32>`, `Option<String>`... `Some` et `None` s'utilisent directement, sans `Option::`.

```rust
fn diviser(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}
```

Un `Option<i32>` **n'est pas** un `i32` : `diviser(10, 2) + 1` ne compile pas. Le compilateur t'oblige à traiter le cas `None` avant d'utiliser la valeur.

```rust
match diviser(10, 2) {
    Some(resultat) => println!("Résultat : {resultat}"),
    None => println!("Division impossible"),
}
```

> [!info] Et ça ne coûte rien
> `Option<&T>` occupe **8 octets, exactement comme `&T`** : une référence n'est jamais nulle, donc la valeur 0 est libre pour coder `None` (voir §13).

**Exemple résolu : une fonction qui peut ne rien trouver**

```rust
fn racine(x: f64) -> Option<f64> {
    if x < 0.0 {
        None
    } else {
        Some(x.sqrt())
    }
}

fn main() {
    for x in [9.0, -4.0] {
        match racine(x) {
            Some(r) => println!("racine de {x} : {r}"),
            None => println!("{x} n'a pas de racine réelle"),
        }
    }
    println!("{:?}", "été".chars().next());
    println!("{:?}", "été".chars().last());
    println!("{:?}", "".chars().next());
}
```

1. `racine(9.0)` : 9 n'est pas négatif, on renvoie `Some(3.0)`. Le `match` prend le bras `Some(r)`, `r` vaut 3 : on affiche `racine de 9 : 3`.
2. `racine(-4.0)` : négatif, on renvoie `None`. Le bras `None` affiche le message.
3. `"été".chars()` parcourt les caractères du texte un par un. `.next()` donne le **premier** (`Some('é')`), `.last()` le **dernier** (`Some('é')` aussi ici). Sur un texte vide, il n'y a aucun caractère : `None`. Le type est `Option<char>`.
4. `{:?}` affiche un `Option` tel quel : `Some('é')`, `None`.

Il n'est jamais besoin d'écrire `Option::Some` : `Some(...)` et `None` suffisent. Et dans une fonction qui renvoie `Option<i32>`, on renvoie `Some(5)`, jamais `5` tout seul.

**À retenir :** une fonction qui peut ne rien donner renvoie `Option<T>` : `Some(valeur)` si elle a trouvé, `None` sinon ; l'appelant est obligé de traiter les deux cas.

## 9. `if let` : quand un seul cas t'intéresse

```rust
if let Some(resultat) = diviser(10, 2) {
    println!("Résultat : {resultat}");
} else {
    println!("Division impossible");
}
```

`if let` est un `match` raccourci : « si la valeur correspond à ce motif, alors... ».

**Exemple résolu : des prix en rayon**

```rust
fn prix(article: &str) -> Option<u32> {
    match article {
        "pain" => Some(2),
        "lait" => Some(1),
        _ => None,
    }
}

fn main() {
    for article in ["lait", "caviar", "pain"] {
        if let Some(p) = prix(article) {
            println!("{article} : {p} €");
        } else {
            println!("{article} : pas en rayon");
        }
    }
}
```

| Article | `prix(article)` | Motif `Some(p)` ? | Ligne affichée |
|---|---|---|---|
| `"lait"` | `Some(1)` | oui, `p = 1` | `lait : 1 €` |
| `"caviar"` | `None` | non → bloc `else` | `caviar : pas en rayon` |
| `"pain"` | `Some(2)` | oui, `p = 2` | `pain : 2 €` |

- La variable `p` n'existe **que** dans le premier bloc : dans le `else`, il n'y a pas de valeur.
- Le `else` est facultatif : sans lui, on ne fait simplement rien quand c'est `None`.
- Le même code avec `match` demanderait deux bras, `Some(p) => ...` et `None => ...` : `if let` est plus court quand un seul cas compte vraiment.

**À retenir :** `if let Some(v) = expression { ... } else { ... }` : le premier bloc reçoit la valeur, le `else` traite l'absence.

## 10. Les méthodes pratiques d'`Option`

| Méthode | Résultat |
|---|---|
| `x.is_some()` / `x.is_none()` | `true` ou `false` |
| `x.unwrap_or(0)` | la valeur, ou `0` s'il n'y a rien |
| `x.map(\|v\| v * 2)` | transforme la valeur si elle existe : `Some(3)` → `Some(6)`, `None` reste `None` |
| `x.take()` | sort la valeur et laisse `None` à sa place (`x` doit être `mut`) |
| `x.unwrap()` | la valeur, ou **panique** si c'est `None` |

> [!info] Les closures
> `|v| v * 2` est une **closure** : une petite fonction sans nom. Entre les barres `|v|` le paramètre, après le résultat. On les étudie en détail au chapitre « Itérateurs et closures ».

**Exemple résolu : chaque méthode sur une valeur présente et une valeur absente**

```rust
fn note(eleve: &str) -> Option<u32> {
    if eleve == "Léa" { Some(14) } else { None }
}

fn main() {
    let lea = note("Léa");
    let tom = note("Tom");

    println!("{:?} {:?}", lea.map(|n| n + 2), tom.map(|n| n + 2));
    println!("{} {}", lea.unwrap_or(0), tom.unwrap_or(0));
    println!("{}", lea.map(|n| n * 5).unwrap_or(0));

    let nom: Option<&str> = Some("Léa");
    println!("{}", nom.map(|t| t.len()).unwrap_or(0));

    println!("{}", 3_u32.saturating_sub(5));
    println!("{:?}", lea.map(|n| n.saturating_sub(20)));

    let mut ticket = Some(42);
    let pris = ticket.take();
    println!("{pris:?} {ticket:?}");
}
```

| Ligne | Calcul | Affiché |
|---|---|---|
| `map(\|n\| n + 2)` | `Some(14)` : on ouvre, 14 + 2 = 16, on referme ; `None` reste `None` | `Some(16) None` |
| `unwrap_or(0)` | `Some(14)` donne 14 ; `None` donne la valeur de secours 0 | `14 0` |
| `map(...).unwrap_or(0)` | on transforme (14 × 5 = 70), **puis** on sort la valeur | `70` |
| `nom.map(\|t\| t.len())` | `"Léa".len()` compte les **octets** : L (1) + é (2) + a (1) = 4 | `4` |
| `3_u32.saturating_sub(5)` | 3 − 5 descendrait sous 0 : on s'arrête à 0 | `0` |
| `map(\|n\| n.saturating_sub(20))` | 14 − 20 bloqué à 0, toujours dans le `Some` | `Some(0)` |
| `take()` | sort `Some(42)` et laisse `None` dans `ticket` | `Some(42) None` |

- Enchaîner `map` puis `unwrap_or` évite tout `match` : « transforme s'il y a une valeur, sinon prends le défaut ».
- Pourquoi `saturating_sub` ? Un `u32` ne peut pas être négatif. `3_u32 - 5` fait **paniquer** le programme en mode debug (« attempt to subtract with overflow »). `a.saturating_sub(b)` fait la soustraction mais s'arrête à 0.
- `unwrap_or` reçoit une valeur du **même type** que le contenu : `Option<u32>` → `unwrap_or(0)`, pas `unwrap_or("rien")`.

**À retenir :** `map` transforme l'intérieur sans ouvrir l'enveloppe, `unwrap_or` ouvre avec une valeur de secours ; enchaîne les deux pour éviter un `match`.

## 11. `Result<T, E>` et l'opérateur `?`

`Option` dit « peut-être rien ». Quand une opération peut **échouer pour une raison**, on utilise une autre enum de la bibliothèque standard :

```rust
enum Result<T, E> {
    Ok(T),    // réussite, avec la valeur
    Err(E),   // échec, avec l'erreur
}
```

- Une fonction qui peut échouer renvoie un `Result` : l'échec est **écrit dans sa signature**. Pas d'exception, donc pas de chemin caché.
- `Result` est marqué `#[must_use]` : jeter un `Result` sans le regarder donne un avertissement.
- Le revers : il faut traiter l'erreur à chaque étage. D'où l'opérateur `?`.

```rust
use std::fs::File;
use std::io::Read;

fn lire(chemin: &str) -> std::io::Result<String> {
    let mut fichier = File::open(chemin)?;
    let mut contenu = String::new();
    fichier.read_to_string(&mut contenu)?;
    Ok(contenu)
}

fn main() {
    match lire("absent.txt") {
        Ok(texte) => println!("{texte}"),
        Err(e) => eprintln!("impossible de lire le fichier : {e}"),
    }
}
```

`fichier?` veut dire : si c'est `Ok(v)`, **donne-moi `v`** ; si c'est `Err(e)`, **renvoie tout de suite `Err(e)`** à l'appelant. Sans `?`, il faudrait écrire :

```rust
let mut fichier = match File::open(chemin) {
    Ok(f) => f,
    Err(e) => return Err(e),
};
```

- `?` convertit aussi le type d'erreur au passage, quand une conversion existe.
- `?` ne marche que dans une fonction qui renvoie un `Result` (ou un `Option`) : sinon il n'aurait nulle part où renvoyer l'erreur. C'est pour ça que `main` peut s'écrire `fn main() -> std::io::Result<()>`.
- Raccourci : `std::fs::read_to_string(chemin)?` ouvre et lit le fichier en une ligne.

> [!warning] `unwrap` et `expect`
> `.unwrap()` extrait la valeur ou **panique**. Acceptable dans un test, un prototype, ou quand l'échec est vraiment impossible. Ailleurs, préfère `match`, `?`, ou au moins `.expect("pourquoi ça devait marcher")` : le jour où ça panique, le message t'aide. Tout cela est détaillé au chapitre « Erreurs et Result ».

> [!tip] Un programme utilisable dans un script
> En cas d'erreur, écris le message avec `eprintln!` (sortie d'erreur, pas la sortie normale) et quitte avec un code non nul : `std::process::exit(1)`.

**Exemple résolu : compter les mots d'un fichier**

```rust
fn compter_mots(chemin: &str) -> std::io::Result<usize> {
    let texte = std::fs::read_to_string(chemin)?;
    Ok(texte.split_whitespace().count())
}

fn bilan(chemin: &str) -> String {
    match compter_mots(chemin) {
        Ok(n) => format!("{chemin} : {n} mots"),
        Err(e) => format!("{chemin} illisible : {e}"),
    }
}

fn main() {
    println!("{}", bilan("Cargo.toml"));
    println!("{}", bilan("introuvable.txt"));
}
```

Suivons les deux appels :

| Étape | `"Cargo.toml"` (existe) | `"introuvable.txt"` (absent) |
|---|---|---|
| `read_to_string(chemin)` | `Ok(texte du fichier)` | `Err(erreur « fichier introuvable »)` |
| `?` | sort le texte, on continue | **arrête** `compter_mots` et renvoie le `Err` |
| `split_whitespace().count()` | compte les mots (séparés par des espaces ou des retours à la ligne) | jamais exécuté |
| résultat de `compter_mots` | `Ok(nombre)` | `Err(e)` |
| `match` dans `bilan` | bras `Ok(n)` | bras `Err(e)` : `{e}` affiche le message du système |

- `Ok(...)` à la fin de `compter_mots` est obligatoire : la fonction renvoie un `Result`, pas un `usize` tout seul.
- `bilan` renvoie un simple `String` : c'est elle qui **traite** l'erreur, avec un `match`, sans `unwrap` ni `expect`. Le texte de l'erreur dépend du système (en français sur un Windows français).
- Pour compter des lignes plutôt que des mots : `texte.lines().count()` (un texte vide a 0 ligne).

**À retenir :** la fonction qui lit renvoie `Result` et propage avec `?` ; celle qui affiche fait un `match` sur `Ok` / `Err`.

## 12. Le FizzBuzz du cours, version enum

Au chapitre 2, `fizz_buzz` renvoyait un `String` : une allocation sur le tas pour un texte connu d'avance. Le cours propose mieux :

```rust
enum Reponse {
    Fizz,
    Buzz,
    FizzBuzz,
    Nombre(u32),
}
```

Le type dit exactement les 4 résultats possibles, sans allocation, et celui qui l'utilise est obligé de traiter les 4 cas.

**Exemple résolu : classer une température, puis la transformer en texte**

On sépare les deux travaux : une fonction **calcule** la variante, une autre la **traduit** en texte.

```rust
#[derive(Debug, PartialEq)]
enum Meteo {
    Gel,
    Canicule,
    Normale(i32),
}

fn classer(temperature: i32) -> Meteo {
    match temperature {
        t if t <= 0 => Meteo::Gel,
        t if t >= 35 => Meteo::Canicule,
        t => Meteo::Normale(t),
    }
}

fn en_texte(m: &Meteo) -> String {
    match m {
        Meteo::Gel => "gel".to_string(),
        Meteo::Canicule => "canicule".to_string(),
        Meteo::Normale(t) => t.to_string(),
    }
}

fn main() {
    for t in [-3, 20, 38] {
        println!("{t} → {:?} → {}", classer(t), en_texte(&classer(t)));
    }
}
```

| `t` | `t <= 0` ? | `t >= 35` ? | Variante | Texte |
|---|---|---|---|---|
| -3 | **oui** | | `Gel` | `gel` |
| 20 | non | non | `t => ...` : `Normale(20)` | `20` |
| 38 | non | **oui** | `Canicule` | `canicule` |

- Les gardes (`t if ...`) sont testées dans l'ordre (voir §3). Quand deux conditions peuvent être vraies en même temps, place la plus précise en premier.
- Le dernier bras `t => Meteo::Normale(t)` attrape tout ce qui reste **et** garde la valeur dans `t`.
- `en_texte` doit renvoyer un `String` dans **chaque** bras : `"gel".to_string()` pour un texte fixe, `t.to_string()` pour transformer un nombre en texte (`20` → `"20"`).

**À retenir :** une fonction choisit la variante (gardes du plus précis au plus général), une autre la traduit ; chaque bras renvoie le même type.

## 13. Une enum en mémoire

### La taille d'une enum

Une enum occupe la taille de sa **plus grosse variante**, plus une **étiquette** (le **discriminant**) qui dit quelle variante est présente. Mesuré avec `std::mem::size_of` sur l'inventaire du §5 :

| Type | Taille | Pourquoi |
|---|---|---|
| `Potion` | 2 octets | 1 d'étiquette + 1 de donnée |
| `Arme` | 8 octets | la plus grosse variante (`u8` + `u32`), alignée sur 4 |
| `Objet` | 8 octets | son étiquette se cache dans des valeurs que celle d'`Arme` n'utilise pas |

Aucune allocation, aucun pointeur : un `Objet` tient dans un registre du processeur.

Voici `Arme` octet par octet (sur la machine du cours ; sans attribut `#[repr]`, cette disposition n'est pas garantie) :

| Octet | 0 | 1 | 2-3 | 4 à 7 |
|---|---|---|---|---|
| `Epee` | 0 | degats | vide | vide |
| `Hache` | 1 | degats | vide | vide |
| `Arc` | 2 | degats | vide | portee |

Les variantes **se partagent** les mêmes octets ; l'octet 0 dit lesquels sont valides.

Sur l'image (la même enum en anglais : `Sword` = `Epee`, `Axe` = `Hache`, `Bow` = `Arc`, `damage` = `degats`, `range` = `portee`) : la colonne orange (octet 0) est l'**étiquette**, 0, 1 ou 2. Chaque ligne est une variante posée sur les **mêmes** 8 octets ; les cases hachurées ne servent pas pour cette variante.

![L'enum WeaponType octet par octet : étiquette 0, 1 ou 2 dans l'octet 0, damage dans l'octet 1, range dans les octets 4 à 7 pour Bow](images/enum-en-memoire-etiquette.webp "Une enum = une étiquette (octet 0) + la place de la plus grosse variante : 8 octets pour toutes")

**L'alignement, en deux phrases.** Le processeur lit plus vite un `u32` rangé à une adresse multiple de 4 : un champ de `n` octets (`u8` : 1, `u16` : 2, `u32` / `char` : 4, `u64` / référence : 8) est placé sur un multiple de `n`, quitte à laisser des octets vides. Et la taille totale est arrondie au multiple de l'alignement du plus gros champ.

**Exemple résolu : la taille de `enum Signal { Arret, Vitesse(u16), Position { x: u8, y: u32 } }`**

1. On mesure chaque variante, étiquette comprise (1 octet d'étiquette suffit pour 3 variantes) :

| Variante | Placement | Octets utilisés |
|---|---|---|
| `Arret` | étiquette (octet 0) | 1 |
| `Vitesse(u16)` | étiquette (0), vide (1), `u16` aligné sur 2 (octets 2-3) | 4 |
| `Position { x, y }` | étiquette (0), `x` (1), vide (2-3), `y` aligné sur 4 (octets 4 à 7) | 8 |

2. La plus grosse variante fait 8 octets.
3. Le plus gros champ est le `u32` (alignement 4) ; 8 est déjà un multiple de 4.

Taille : **8 octets**. On vérifie :

```rust
use std::mem::size_of;

#[allow(dead_code)]
enum Signal {
    Arret,
    Vitesse(u16),
    Position { x: u8, y: u32 },
}

fn main() {
    println!("Signal         : {}", size_of::<Signal>());
    println!("Option<Signal> : {}", size_of::<Option<Signal>>());
    println!("(u8, u32)      : {}", size_of::<(u8, u32)>());
    println!("Option<u16>    : {}", size_of::<Option<u16>>());
    println!("Option<char>   : {}", size_of::<Option<char>>());
}
```

(`#[allow(dead_code)]` coupe seulement l'avertissement « jamais utilisé » : ici on mesure le type sans fabriquer de valeur.)

| Type | Taille | Raisonnement |
|---|---|---|
| `Signal` | 8 | calcul ci-dessus |
| `Option<Signal>` | 8 | l'étiquette de `Signal` n'utilise que 0, 1, 2 : `None` prend une valeur libre (une **niche**, voir plus bas) |
| `(u8, u32)` | 8 | 1 + 3 octets vides + 4 : même sans enum, l'alignement compte |
| `Option<u16>` | 4 | les 65 536 valeurs d'un `u16` sont prises : étiquette en plus, arrondie à l'alignement 2 → 2 + 2 |
| `Option<char>` | 4 | un `char` ne dépasse jamais 0x10FFFF : les valeurs au-delà sont libres, `None` en prend une |

**À retenir :** taille d'une enum = plus grosse variante (étiquette comprise), arrondie au multiple de l'alignement du plus gros champ ; si le type a des valeurs inutilisées, l'étiquette s'y cache.

### En C : une `union` et une étiquette à la main

```c
#include <stdint.h>
#include <stdio.h>

struct Arme {
    enum { EPEE, HACHE, ARC } etiquette;
    union {
        struct { uint8_t degats; } epee;
        struct { uint8_t degats; } hache;
        struct { uint8_t degats; uint32_t portee; } arc;
    } donnees;
};

int main(void) {
    printf("%zu octets\n", sizeof(struct Arme));
    return 0;
}
```

| | C | Rust |
|---|---|---|
| Qui vérifie la variante ? | personne : lire `donnees.epee` sur un arc compile sans un avertissement | le compilateur : on n'atteint les données qu'à travers un `match` |
| Taille | 12 octets (étiquette `int` de 4 octets) | 8 octets (étiquette d'1 octet) |

`#[repr(C)]` sur l'enum Rust redonne exactement la disposition du C (12 octets) : c'est ce qu'il faut pour échanger une enum avec un programme C.

### Le *niche filling* : une étiquette gratuite

```rust
use std::mem::size_of;
use std::num::NonZeroU32;

fn main() {
    println!("u32        : {} / Option : {}", size_of::<u32>(), size_of::<Option<u32>>());
    println!("NonZeroU32 : {} / Option : {}", size_of::<NonZeroU32>(), size_of::<Option<NonZeroU32>>());
    println!("&u8        : {} / Option : {}", size_of::<&u8>(), size_of::<Option<&u8>>());
    println!("bool       : {} / Option : {}", size_of::<bool>(), size_of::<Option<bool>>());
    println!("u8         : {} / Option : {}", size_of::<u8>(), size_of::<Option<u8>>());
}
```

| Type `T` | `T` | `Option<T>` | Pourquoi |
|---|---|---|---|
| `u32` | 4 | 8 | toutes les valeurs sont utilisées : il faut une étiquette, et l'alignement en fait 4 octets |
| `NonZeroU32` | 4 | 4 | ne vaut jamais 0 : 0 code `None` |
| `&u8` | 8 | 8 | une référence n'est jamais nulle : 0 code `None` |
| `bool` | 1 | 1 | n'utilise que 0 et 1 : `None` vaut 2 |
| `u8` | 1 | 2 | les 256 valeurs sont prises : 1 octet d'étiquette |

Les valeurs qu'un type n'utilise jamais s'appellent des **niches** : le compilateur s'en sert comme étiquette. C'est grâce à ça qu'un `Objet` tient dans les 8 octets d'une `Arme`.

**Méthode pour prédire la taille de `Option<T>`** : demande-toi « est-ce que `T` utilise **toutes** ses valeurs possibles ? ».

1. **Non** (référence, `NonZero…`, `bool`, `char`, une enum à peu de variantes) : `None` prend une valeur libre, `Option<T>` a la même taille que `T`.
2. **Oui** (`u8`, `u32`, `i64`…) : il faut une étiquette en plus, puis on arrondit à l'alignement de `T` : `Option<u8>` = 1 + 1 = 2, `Option<u32>` = 4 + 4 = 8.

**À retenir :** une valeur jamais utilisée par `T` (une niche) suffit à coder `None` gratuitement ; sinon l'étiquette coûte un alignement complet.

### Les `union` de Rust

Rust a aussi des `union` sans étiquette, comme en C :

```rust
union EntierOuFlottant {
    entier: u32,
    flottant: f32,
}

fn main() {
    let u = EntierOuFlottant { entier: 1 };
    let f = unsafe { u.flottant };
    println!("{f:e}");   // 1e-45
}
```

Les 4 octets de l'entier 1, relus comme un `f32`, donnent `1e-45` : rien ne vérifie quel champ a été écrit, d'où le bloc `unsafe` (« je garantis ce que le compilateur ne peut pas vérifier »). Les `union` servent à parler au C ; partout ailleurs, l'enum fait le même travail, en sûreté.

## À retenir

- Une enum = **une** variante parmi plusieurs ; `Type::Variante`. C'est un **type somme** (les valeurs s'additionnent), une struct un **type produit** (elles se multiplient).
- Les variantes peuvent contenir des données, même d'autres enums ; le `match` les **déstructure**, en profondeur si besoin.
- `match` est exhaustif et teste les bras de haut en bas : évite `_` sur tes propres enums, regroupe avec `|`, ignore avec `..`, mets les gardes précises en premier.
- Sur `&self`, les données sorties sont des références : `*` donne la valeur. `&self` lit, `&mut self` modifie, `self` consomme (transitions d'états).
- Choisis des types où un état incohérent **ne peut pas s'écrire** (une enum plutôt que des booléens et des `Option`).
- `Option<T>` remplace `null` : `Some(valeur)` ou `None`. `if let`, `unwrap_or`, `map`, `take` ; `unwrap` peut paniquer ; `saturating_sub` évite de passer sous 0.
- `Result<T, E>` : `Ok` ou `Err`, l'échec est dans la signature ; `?` déballe le `Ok` ou renvoie le `Err` à l'appelant.
- Taille d'une enum = plus grosse variante + étiquette, arrondie à l'alignement, et l'étiquette se cache souvent dans une **niche** (`Option<&T>` = 8 octets).
