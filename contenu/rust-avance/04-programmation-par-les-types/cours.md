# Programmation par les types

Idée centrale du **Type-Driven Development** (TyDD, « développement guidé par les types ») : on choisit des types qui **empêchent les erreurs avant même de lancer le programme**. Si une valeur invalide ne peut pas exister, on n'a plus besoin de la vérifier partout.

> [!info] Le slogan
> « Rendre les états illégaux impossibles à représenter. » Un état illégal, c'est par exemple un pourcentage de 250, un e-mail sans `@` ou une connexion fermée sur laquelle on envoie un message.

Plan du chapitre :

1. Le newtype : un type pour chaque idée
2. Valider à la construction : « parser, pas vérifier »
3. Des enums plutôt que des booléens
4. Le pattern builder
5. Le typestate : les états dans les types
6. Option et Result : des boîtes qu'on enchaîne
7. Les types comme contrats

## 1. Le newtype

Un **newtype** est une structure à un seul champ qui enveloppe un type existant. Elle ne coûte rien à l'exécution, mais le compilateur la voit comme un type **différent**.

```rust
struct Metres(f64);
struct Secondes(f64);

fn vitesse(distance: Metres, duree: Secondes) -> f64 {
    distance.0 / duree.0
}

let v = vitesse(Metres(100.0), Secondes(9.58));
println!("{v:.2} m/s");
```

Avec deux simples `f64`, on pourrait inverser les arguments sans que personne ne s'en rende compte. Avec des newtypes, l'inversion ne compile plus.

`.0` désigne le premier champ d'une structure à champs sans nom (un **tuple struct**).

> [!warning] Piège : le newtype n'hérite de rien
> `Metres` n'a ni `+`, ni affichage, ni comparaison. Il faut les demander : `#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]` pour les traits simples, `impl Add for Metres` ou `impl Display for Metres` à la main pour les autres.

### Conversions avec `From`

```rust
struct Kilometres(f64);
struct Metres(f64);

impl From<Kilometres> for Metres {
    fn from(km: Kilometres) -> Metres {
        Metres(km.0 * 1000.0)
    }
}

let m = Metres::from(Kilometres(1.5));
println!("{} m", m.0);
```

Les conversions entre unités deviennent **explicites** : plus de confusion entre kilomètres et mètres, comme celle qui a fait perdre une sonde à la NASA.

## 2. Valider à la construction

Un newtype devient puissant quand son constructeur **refuse les valeurs invalides**. On cache le champ (pas de `pub`) et on n'offre qu'une fonction `new` qui renvoie un `Result`.

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
struct Pourcentage(u8);

impl Pourcentage {
    fn new(valeur: u8) -> Result<Pourcentage, String> {
        if valeur <= 100 {
            Ok(Pourcentage(valeur))
        } else {
            Err(format!("{valeur} dépasse 100"))
        }
    }

    fn valeur(&self) -> u8 {
        self.0
    }
}

fn appliquer_remise(prix: u32, remise: Pourcentage) -> u32 {
    prix - prix * remise.valeur() as u32 / 100
}

println!("{:?}", Pourcentage::new(250));
if let Ok(remise) = Pourcentage::new(20) {
    println!("{}", appliquer_remise(50, remise));
}
```

Résultat : toute fonction qui reçoit un `Pourcentage` **sait** qu'il est entre 0 et 100. Elle n'a pas à le revérifier. La vérification est faite **une seule fois**, à la frontière du programme (saisie, fichier, réseau).

> [!tip] « Parser, pas vérifier »
> Vérifier renvoie un booléen que l'on oublie vite. Parser renvoie une **nouvelle valeur d'un type plus précis**. Le type garde la preuve que la vérification a eu lieu.

### Un type d'erreur précis

Plutôt qu'un `String`, une `enum` d'erreurs permet de réagir à chaque cas :

```rust
#[derive(Debug, PartialEq)]
enum ErreurEmail {
    SansArobase,
    PartieVide,
}

struct Email(String);

impl Email {
    fn new(texte: &str) -> Result<Email, ErreurEmail> {
        let (local, domaine) = texte.split_once('@').ok_or(ErreurEmail::SansArobase)?;
        if local.is_empty() || domaine.is_empty() {
            return Err(ErreurEmail::PartieVide);
        }
        Ok(Email(texte.to_string()))
    }
}

println!("{:?}", Email::new("alice.fr").err());
println!("{:?}", Email::new("alice@ecole.fr").is_ok());
```

> [!warning] Piège : le champ public
> Si le champ est `pub`, n'importe qui écrit `Pourcentage(250)` sans passer par `new`, et toute la garantie tombe. Garde le champ **privé** (dans un module, seul ce module peut construire la valeur directement).

## 3. Des enums plutôt que des booléens

Un `bool` ne dit pas ce qu'il signifie, et plusieurs booléens permettent des combinaisons absurdes.

```rust
struct PaiementMauvais {
    paye: bool,
    rembourse: bool,
}
```

Ici `paye: false, rembourse: true` est possible, alors que ça n'a aucun sens. Une `enum` n'autorise que les états voulus, et chaque état peut porter ses propres données :

```rust
enum Paiement {
    EnAttente,
    Paye { montant: u32 },
    Rembourse { montant: u32, motif: String },
}

fn libelle(p: &Paiement) -> String {
    match p {
        Paiement::EnAttente => "en attente".to_string(),
        Paiement::Paye { montant } => format!("payé : {montant} euros"),
        Paiement::Rembourse { montant, motif } => format!("remboursé {montant} euros ({motif})"),
    }
}

println!("{}", libelle(&Paiement::Paye { montant: 30 }));
println!("{}", libelle(&Paiement::EnAttente));
```

> [!tip] Le compilateur surveille les `match`
> Si tu ajoutes un état plus tard, tous les `match` sans cas par défaut cessent de compiler : le compilateur te montre tous les endroits à mettre à jour.

Même idée pour un paramètre : `ouvrir(fichier, true, false)` est illisible, alors que `ouvrir(fichier, Mode::Lecture, Ligne::Sans)` se lit tout seul.

## 4. Le pattern builder

Quand une structure a beaucoup de champs (certains facultatifs, avec des valeurs par défaut), un constructeur à dix paramètres devient illisible. Le **builder** (« constructeur pas à pas ») règle ça :

```rust
#[derive(Debug)]
struct Requete {
    url: String,
    delai: u32,
}

struct RequeteBuilder {
    url: Option<String>,
    delai: u32,
}

impl RequeteBuilder {
    fn nouveau() -> RequeteBuilder {
        RequeteBuilder { url: None, delai: 30 }
    }

    fn url(mut self, url: &str) -> RequeteBuilder {
        self.url = Some(url.to_string());
        self
    }

    fn delai(mut self, secondes: u32) -> RequeteBuilder {
        self.delai = secondes;
        self
    }

    fn construire(self) -> Result<Requete, String> {
        let url = self.url.ok_or("l'adresse est obligatoire")?;
        Ok(Requete { url, delai: self.delai })
    }
}

let requete = RequeteBuilder::nouveau().url("https://exemple.fr").delai(5).construire();
println!("{requete:?}");
println!("{:?}", RequeteBuilder::nouveau().construire());
```

Trois choses à remarquer :

- Chaque méthode **prend `self` par valeur** (`mut self`) et le **renvoie** : c'est ce qui permet d'enchaîner les appels avec des points.
- Les champs facultatifs ont une valeur par défaut dans `nouveau`.
- `construire` est le seul endroit qui vérifie la cohérence, et il renvoie un `Result`. Une `Requete` existante est donc toujours valide.

## 5. Le typestate

Le **typestate** pousse l'idée plus loin : l'**état** d'un objet est écrit dans son **type**. Une opération interdite dans un état donné **n'existe tout simplement pas** pour ce type, donc le compilateur la refuse.

Exemple : une connexion fermée ou ouverte.

```rust
use std::marker::PhantomData;

struct Fermee;
struct Ouverte;

struct Connexion<Etat> {
    adresse: String,
    etat: PhantomData<Etat>,
}

impl Connexion<Fermee> {
    fn nouvelle(adresse: &str) -> Connexion<Fermee> {
        Connexion { adresse: adresse.to_string(), etat: PhantomData }
    }

    fn ouvrir(self) -> Connexion<Ouverte> {
        println!("ouverture de {}", self.adresse);
        Connexion { adresse: self.adresse, etat: PhantomData }
    }
}

impl Connexion<Ouverte> {
    fn envoyer(&self, message: &str) {
        println!("envoi à {} : {message}", self.adresse);
    }

    fn fermer(self) -> Connexion<Fermee> {
        Connexion { adresse: self.adresse, etat: PhantomData }
    }
}

let connexion = Connexion::nouvelle("serveur:80").ouvrir();
connexion.envoyer("salut");
let _connexion = connexion.fermer();
```

Si on écrit `Connexion::nouvelle("x").envoyer("salut")`, le compilateur répond que `envoyer` n'existe pas pour `Connexion<Fermee>`. L'erreur est attrapée **à la compilation**, pas en production.

### À quoi sert `PhantomData` ?

Rust refuse un paramètre générique `Etat` qui n'est **utilisé dans aucun champ**. `PhantomData<Etat>` est un champ « fantôme » : il ne prend **aucune place en mémoire**, mais il dit au compilateur « ce type dépend de `Etat` ». Les états `Fermee` et `Ouverte` sont des structures vides : elles n'existent que comme étiquettes.

### Pourquoi les transitions prennent `self`

`ouvrir(self)` **consomme** la connexion fermée (ownership) et en rend une nouvelle, ouverte. L'ancienne variable ne peut plus servir : impossible de rouvrir deux fois, ou d'utiliser la connexion fermée par erreur.

```rust
struct Brouillon;
struct Publie { lien: String }

struct Article<Etat> {
    titre: String,
    etat: Etat,
}

impl Article<Brouillon> {
    fn publier(self) -> Article<Publie> {
        let lien = format!("/blog/{}", self.titre.to_lowercase().replace(' ', "-"));
        Article { titre: self.titre, etat: Publie { lien } }
    }
}

impl Article<Publie> {
    fn lien(&self) -> &str {
        &self.etat.lien
    }
}

let brouillon = Article { titre: "Mon Premier Article".to_string(), etat: Brouillon };
let publie = brouillon.publier();
println!("{} : {}", publie.titre, publie.lien());
```

Ici l'état n'est pas un `PhantomData` mais une vraie valeur, qui peut porter des données (le lien n'existe qu'une fois l'article publié). Les deux variantes sont courantes.

> [!info] Méthodes communes
> Les méthodes valables dans tous les états se mettent dans un `impl<Etat> Connexion<Etat> { ... }` générique.

> [!warning] Piège : trop de typestate
> Le typestate rend le code plus long. Il vaut le coup quand une erreur d'ordre est **grave** (connexion, transaction, paiement). Pour un simple drapeau interne, une `enum` suffit.

## 6. Option et Result : des boîtes qu'on enchaîne

`Option<T>` (une valeur ou rien) et `Result<T, E>` (un succès ou une erreur) sont des **boîtes** qui décrivent un calcul qui peut échouer. En programmation fonctionnelle, on appelle ce genre de boîte une **monade** : un type avec deux opérations, mettre une valeur dedans (`Some`, `Ok`) et enchaîner des étapes sans ouvrir la boîte à chaque fois (`and_then`).

Les types racontent l'échec dans la **signature** : contrairement à une exception, on ne peut pas l'ignorer.

```rust
fn lire_age(texte: &str) -> Result<u8, String> {
    texte.trim().parse::<u8>().map_err(|_| format!("« {texte} » n'est pas un âge"))
}

fn verifier_majeur(age: u8) -> Result<u8, String> {
    if age >= 18 { Ok(age) } else { Err(format!("{age} ans : trop jeune")) }
}

println!("{:?}", lire_age(" 25 ").and_then(verifier_majeur));
println!("{:?}", lire_age("abc").and_then(verifier_majeur));
println!("{:?}", lire_age("12").and_then(verifier_majeur));
```

- `map(f)` transforme la valeur **si elle est là**, sans toucher à l'erreur.
- `and_then(f)` sert quand `f` renvoie lui-même un `Result` (ou une `Option`) : on évite la double boîte.
- `map_err(f)` transforme l'**erreur** (par exemple pour passer d'un type d'erreur à un autre).
- `ok_or(e)` change une `Option` en `Result`.
- `?` fait la même chose qu'un `and_then` en plus court : il sort de la fonction à la première erreur.

> [!tip] Le style « chemin heureux »
> On écrit la suite des étapes qui réussissent. La première erreur court-circuite tout le reste, sans `if` imbriqués. Voir le chapitre de programmation fonctionnelle pour le détail de ces méthodes.

Combiné avec les newtypes, on obtient une chaîne propre : texte brut, puis nombre, puis `Pourcentage` validé.

```rust
#[derive(Debug)]
struct Pourcentage(u8);

impl Pourcentage {
    fn new(valeur: u8) -> Result<Pourcentage, String> {
        if valeur <= 100 { Ok(Pourcentage(valeur)) } else { Err(format!("{valeur} dépasse 100")) }
    }
}

fn lire_pourcentage(texte: &str) -> Result<Pourcentage, String> {
    texte
        .trim()
        .parse::<u8>()
        .map_err(|_| format!("« {texte} » n'est pas un nombre"))
        .and_then(Pourcentage::new)
}

println!("{:?}", lire_pourcentage("45"));
println!("{:?}", lire_pourcentage("145"));
```

## 7. Les types comme contrats

Une signature de fonction est un **contrat** :

| Signature | Ce qu'elle promet |
|---|---|
| `fn diviser(a: i32, b: i32) -> i32` | rien sur `b = 0` : plante peut-être |
| `fn diviser(a: i32, b: i32) -> Option<i32>` | peut ne pas avoir de résultat |
| `fn diviser(a: i32, b: NonZeroI32) -> i32` | ne peut jamais diviser par zéro |
| `fn envoyer(c: Connexion<Ouverte>)` | la connexion est forcément ouverte |

`NonZeroI32` est déjà dans la bibliothèque standard : un newtype qui interdit zéro.

```rust
use std::num::NonZeroU32;

fn partager(total: u32, personnes: NonZeroU32) -> u32 {
    total / personnes.get()
}

match NonZeroU32::new(4) {
    Some(n) => println!("{}", partager(100, n)),
    None => println!("zéro personne"),
}
```

Ce style rejoint la **conception pilotée par le domaine** (DDD) : les types portent le vocabulaire du métier (`Email`, `Pourcentage`, `Commande<Validee>`) et la **logique pure** reste séparée des entrées-sorties (la « clean architecture » : au centre, des types et fonctions sans effet de bord ; aux bords, la lecture des fichiers, du réseau, de l'écran).

## À retenir

- **Newtype** : `struct Metres(f64)` : un type distinct sans coût, pour ne plus mélanger les valeurs.
- **Constructeur validé** : champ privé, `new` renvoie un `Result` ; on valide une fois, aux frontières.
- **Enum plutôt que `bool`** : seuls les états voulus existent, chacun avec ses données.
- **Builder** : méthodes qui prennent et rendent `self`, `construire()` vérifie et renvoie un `Result`.
- **Typestate** : état dans le type (`Connexion<Ouverte>`), transitions qui prennent `self`, `PhantomData` pour un paramètre sans champ.
- **Option / Result** : on enchaîne avec `map`, `and_then`, `map_err`, `ok_or`, `?`.
- Plus le type est précis, moins il y a de vérifications et de bogues à l'exécution.
