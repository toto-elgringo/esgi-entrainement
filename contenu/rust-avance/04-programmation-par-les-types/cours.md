# Programmation par les types

Idée centrale du **Type-Driven Development** (TyDD, « développement guidé par les types ») : on choisit des types qui **empêchent les erreurs avant même de lancer le programme**. Si une valeur invalide ne peut pas exister, on n'a plus besoin de la vérifier partout.

> [!info] Le slogan
> « Rendre les états illégaux impossibles à représenter. » Un état illégal, c'est par exemple un pourcentage de 250, un e-mail sans `@` ou une connexion fermée sur laquelle on envoie un message.

Dit autrement : au lieu d'écrire plus de tests ou de `if` pour **attraper** les valeurs absurdes, on fait en sorte qu'elles ne puissent **pas être créées**. Le compilateur devient le premier testeur : ce qu'il refuse ne partira jamais en production.

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

**Pas à pas :**

1. `vitesse(Metres(100.0), Secondes(9.58))` : le premier argument est bien un `Metres`, le second un `Secondes`. Ça compile.
2. `distance.0 / duree.0` = `100 / 9.58` ≈ `10.438...`, et `{v:.2}` garde 2 décimales : affiché `10.44 m/s`.
3. `vitesse(Secondes(9.58), Metres(100.0))` serait refusé : « expected `Metres`, found `Secondes` ». Avec `fn vitesse(distance: f64, duree: f64)`, cette erreur passerait sans bruit et donnerait `0.0958`.

`.0` désigne le premier champ d'une structure à champs sans nom (un **tuple struct**).

### Newtype ou alias ?

`type Metres = f64;` crée un **alias** : juste un deuxième nom pour `f64`. Ce n'est **pas** un nouveau type.

```rust
type Litres = f64;
struct Kilos(f64);

let volume: Litres = 1.5;
let melange: f64 = volume + 2.0;
let poids = Kilos(3.0);
println!("{melange} {}", poids.0 + 1.0);
```

| | `type Litres = f64;` (alias) | `struct Kilos(f64);` (newtype) |
|---|---|---|
| Nouveau type pour le compilateur ? | non, c'est un `f64` | oui |
| `volume + 2.0` | permis (c'est un `f64`) | `poids + 1.0` refusé |
| Protège contre les mélanges ? | non | oui |
| Coût à l'exécution | aucun | aucun |

Un alias sert à raccourcir un nom long (`type Resultat = Result<u32, String>;`), pas à protéger.

**À retenir :** un alias (`type`) est un autre nom, un newtype (`struct X(T);`) est un autre type ; seul le newtype empêche les mélanges.

> [!warning] Piège : le newtype n'hérite de rien
> `Metres` n'a ni `+`, ni affichage, ni comparaison. Il faut les demander : `#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]` pour les traits simples, `impl Add for Metres` ou `impl Display for Metres` à la main pour les autres.

### Conversions avec `From`, addition et affichage

Exemple complet avec des durées : `Minutes` et `Secondes`, une conversion, une addition, un affichage et une somme d'une liste.

```rust
use std::fmt;
use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Minutes(f64);

#[derive(Debug, Clone, Copy, PartialEq)]
struct Secondes(f64);

impl From<Minutes> for Secondes {
    fn from(m: Minutes) -> Secondes {
        Secondes(m.0 * 60.0)
    }
}

impl Add for Secondes {
    type Output = Secondes;

    fn add(self, autre: Secondes) -> Secondes {
        Secondes(self.0 + autre.0)
    }
}

impl fmt::Display for Secondes {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} s", self.0)
    }
}

fn duree_totale(morceaux: &[Secondes]) -> Secondes {
    morceaux.iter().fold(Secondes(0.0), |total, morceau| total + *morceau)
}

let morceaux = [Secondes(30.0), Secondes::from(Minutes(2.5)), Secondes(15.5)];
println!("{}", duree_totale(&morceaux));
println!("{}", duree_totale(&[]));
```

**Pas à pas :**

1. `Secondes::from(Minutes(2.5))` : `2.5 * 60.0 = 150`, on obtient `Secondes(150.0)`.
2. `duree_totale` part de `Secondes(0.0)` et ajoute chaque morceau avec le `+` qu'on a défini :

| Étape | `total` avant | Morceau | `total` après |
|---|---|---|---|
| départ | | | 0 |
| 1 | 0 | 30 | 30 |
| 2 | 30 | 150 | 180 |
| 3 | 180 | 15.5 | 195.5 |

3. Le `Display` écrit le nombre puis ` s` : affiché `195.5 s`. Pour une liste vide, `fold` renvoie directement la valeur de départ : `0 s`.

Trois détails :

- `iter()` donne des **références** (`&Secondes`) : `*morceau` récupère la valeur (possible parce que `Secondes` est `Copy`).
- `morceaux.iter().sum()` ne marche **pas** : `sum` demande le trait `Sum`, que notre newtype n'a pas. `fold` avec notre `+` suffit.
- Un `f64` entier s'affiche sans `.0` avec `{}` : `30.0` s'affiche `30`, `12.5` s'affiche `12.5`.

Les conversions entre unités deviennent **explicites** : plus de confusion entre kilomètres et mètres, comme celle qui a fait perdre une sonde à la NASA.

**À retenir :** un newtype a seulement ce qu'on lui donne : `derive` pour les traits simples, `impl From` pour convertir, `impl Add` pour `+`, `impl Display` pour `{}`.

## 2. Valider à la construction

Un newtype devient puissant quand son constructeur **refuse les valeurs invalides**. On cache le champ (pas de `pub`) et on n'offre qu'une fonction `new` qui renvoie un `Result`.

**Exemple résolu : une note sur 20.**

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
struct Note(u8);

impl Note {
    fn new(valeur: u8) -> Result<Note, String> {
        if valeur <= 20 {
            Ok(Note(valeur))
        } else {
            Err(format!("{valeur} n'est pas une note sur 20"))
        }
    }

    fn valeur(&self) -> u8 {
        self.0
    }
}

fn sur_cent(note: Note) -> u32 {
    u32::from(note.valeur()) * 100 / 20
}

println!("{:?}", Note::new(25));
println!("{:?}", Note::new(20));
if let Ok(note) = Note::new(13) {
    println!("{}", sur_cent(note));
}
```

**Pas à pas :**

1. `Note::new(25)` : `25 <= 20` est faux, on renvoie `Err("25 n'est pas une note sur 20")`.
2. `Note::new(20)` : `20 <= 20` est vrai (la borne est **incluse** avec `<=`), on renvoie `Ok(Note(20))`.
3. `Note::new(13)` donne `Ok(Note(13))` ; `if let Ok(note)` l'ouvre. `sur_cent` calcule `13 * 100 / 20` = `1300 / 20` = `65`.

Deux pièges de calcul sur les entiers :

- **Types** : `note.valeur()` est un `u8` (maximum 255). `13 * 100` dépasserait 255 : on passe d'abord en `u32` avec `u32::from(...)` (ou `as u32`).
- **Ordre** : la division entière **coupe** la partie décimale. Multiplie **avant** de diviser.

| Calcul | Étapes | Résultat |
|---|---|---|
| `13 * 100 / 20` | `1300 / 20` | `65` (juste) |
| `13 / 20 * 100` | `13 / 20 = 0` (coupé), puis `0 * 100` | `0` (faux) |

C'est pareil pour une remise en pourcentage : `prix * taux / 100` d'abord, puis on retire ce montant du prix.

Résultat : toute fonction qui reçoit une `Note` **sait** qu'elle est entre 0 et 20. Elle n'a pas à la revérifier. La vérification est faite **une seule fois**, à la frontière du programme (saisie, fichier, réseau).

> [!tip] « Parser, pas vérifier »
> Vérifier renvoie un booléen que l'on oublie vite. Parser renvoie une **nouvelle valeur d'un type plus précis**. Le type garde la preuve que la vérification a eu lieu.

### Quel type de retour pour un constructeur qui peut refuser ?

| Retour | Ce que l'appelant reçoit | Problème |
|---|---|---|
| `Note` + `panic!` | la note, ou le programme s'arrête | un plantage pour une simple saisie ratée |
| `bool` | vrai / faux | pas de valeur, et la vérification est oubliée ensuite |
| `Option<Note>` | `Some(note)` ou `None` | on ne sait pas **pourquoi** c'est refusé |
| `Result<Note, E>` | `Ok(note)` ou `Err(raison)` | aucun : la valeur **et** la raison du refus |

**À retenir :** constructeur validé = champ privé + `new` qui renvoie `Result<Self, E>` ; la vérification est faite une fois, puis le type la garantit.

### Un type d'erreur précis

Plutôt qu'un `String`, une `enum` d'erreurs permet de réagir à chaque cas (afficher un message différent, réessayer...). Les vérifications se font **dans l'ordre** : la première qui échoue donne l'erreur.

**Exemple résolu : un pseudo de la forme `nom#numéro`** (comme `lea#42`).

```rust
#[derive(Debug, PartialEq)]
enum ErreurPseudo {
    SansDiese,
    PartieVide,
    NumeroInvalide,
}

#[derive(Debug)]
struct Pseudo(String);

impl Pseudo {
    fn new(texte: &str) -> Result<Pseudo, ErreurPseudo> {
        let (nom, numero) = texte.split_once('#').ok_or(ErreurPseudo::SansDiese)?;
        if nom.is_empty() || numero.is_empty() {
            return Err(ErreurPseudo::PartieVide);
        }
        if !numero.chars().all(|c| c.is_ascii_digit()) {
            return Err(ErreurPseudo::NumeroInvalide);
        }
        Ok(Pseudo(texte.to_string()))
    }

    fn texte(&self) -> &str {
        &self.0
    }

    fn nom(&self) -> &str {
        self.0.split_once('#').map_or("", |(nom, _)| nom)
    }
}

for essai in ["lea42", "#42", "lea#4b", "lea#42"] {
    match Pseudo::new(essai) {
        Ok(p) => println!("{} : nom {}", p.texte(), p.nom()),
        Err(e) => println!("{essai} refusé : {e:?}"),
    }
}
```

Les outils utilisés :

- `texte.split_once('#')` coupe au **premier** `#` et renvoie `Some((avant, après))`, ou `None` s'il n'y a pas de `#`.
- `.ok_or(erreur)` change cette `Option` en `Result` : `Some(x)` devient `Ok(x)`, `None` devient `Err(erreur)`.
- `?` : si c'est `Err`, on sort tout de suite de `new` avec cette erreur ; sinon on récupère la valeur (ici le couple, découpé en `nom` et `numero`).
- `is_empty()` teste une chaîne vide, `contains('.')` teste la présence d'un caractère, `chars().all(...)` vérifie que **tous** les caractères respectent une condition.
- Un accesseur renvoie un **morceau** du texte gardé : `&self.0` pour tout, `split_once(...).map_or("", |(nom, _)| nom)` pour la partie avant le `#` (`map_or` donne `""` dans le cas `None`, qui n'arrive jamais ici puisque `new` a vérifié).

**Pas à pas, essai par essai :**

| Texte | `split_once('#')` | Parties vides ? | Numéro en chiffres ? | Résultat |
|---|---|---|---|---|
| `"lea42"` | `None` | | | `Err(SansDiese)` |
| `"#42"` | `Some(("", "42"))` | oui (`nom`) | | `Err(PartieVide)` |
| `"lea#4b"` | `Some(("lea", "4b"))` | non | non (`b`) | `Err(NumeroInvalide)` |
| `"lea#42"` | `Some(("lea", "42"))` | non | oui | `Ok`, nom `lea` |

On s'arrête à la **première** vérification ratée : `"#4b"` donnerait `PartieVide`, pas `NumeroInvalide`, car la vérification des parties vides vient avant.

**À retenir :** une `enum` d'erreurs + des vérifications dans l'ordre de l'énoncé, chacune avec `return Err(...)` ou `?` ; la première qui échoue gagne.

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

Ici `paye: false, rembourse: true` est possible, alors que ça n'a aucun sens. Deux booléens donnent 2 × 2 = **4** combinaisons, alors qu'il n'y a que 3 états réels (en attente, payé, remboursé) : une combinaison est absurde, et il faut la surveiller partout. Une `enum` n'autorise que les états voulus, et chaque état peut porter ses propres données.

**Exemple résolu : le suivi d'un colis.**

```rust
#[derive(Debug)]
enum Colis {
    EnPreparation,
    Expedie { numero: u32 },
    Livre { numero: u32, signataire: String },
}

fn libelle(c: &Colis) -> String {
    match c {
        Colis::EnPreparation => "en préparation".to_string(),
        Colis::Expedie { numero } => format!("expédié (n° {numero})"),
        Colis::Livre { numero, signataire } => format!("livré (n° {numero}), signé par {signataire}"),
    }
}

fn numero_suivi(c: &Colis) -> u32 {
    match c {
        Colis::Expedie { numero } => *numero,
        _ => 0,
    }
}

fn livrer(c: Colis, signataire: &str) -> Result<Colis, String> {
    match c {
        Colis::Expedie { numero } => Ok(Colis::Livre { numero, signataire: signataire.to_string() }),
        _ => Err("seul un colis expédié peut être livré".to_string()),
    }
}

let colis = Colis::Expedie { numero: 512 };
println!("{} / suivi {}", libelle(&colis), numero_suivi(&colis));
match livrer(colis, "Sam") {
    Ok(livre) => println!("{}", libelle(&livre)),
    Err(message) => println!("{message}"),
}
println!("{:?}", livrer(Colis::EnPreparation, "Sam"));
```

**Pas à pas :**

1. `libelle(&colis)` : `match` essaie les branches dans l'ordre. `Expedie { numero }` correspond et **sort** le champ dans la variable `numero` (512) : `"expédié (n° 512)"`.
2. `numero_suivi(&colis)` : on reçoit une référence, donc `numero` est un `&u32` ; `*numero` donne le nombre. Le `_ => 0` attrape **tous les autres** états : un colis en préparation ou déjà livré renvoie 0.
3. `livrer(colis, "Sam")` reçoit le colis **par valeur** (il est consommé). La branche `Expedie { numero }` fabrique un **nouvel** état `Livre` avec le même numéro et `signataire.to_string()` (un `&str` devient un `String`). Affiché : `livré (n° 512), signé par Sam`.
4. `livrer(Colis::EnPreparation, "Sam")` tombe dans `_` : `Err("seul un colis expédié peut être livré")`.

Pour écrire un texte qui contient un champ, `format!("... {numero} ...")` met directement la variable dans les accolades.

> [!tip] Le compilateur surveille les `match`
> Si tu ajoutes un état plus tard, tous les `match` sans cas par défaut cessent de compiler : le compilateur te montre tous les endroits à mettre à jour.

Même idée pour un paramètre : `ouvrir(fichier, true, false)` est illisible, alors que `ouvrir(fichier, Mode::Lecture, Ligne::Sans)` se lit tout seul.

**À retenir :** un état = une variante d'`enum` avec ses propres champs ; `match` sort les champs, `_` regroupe « tous les autres cas », et une transition prend la valeur et en renvoie une nouvelle (ou une erreur).

## 4. Le pattern builder

Quand une structure a beaucoup de champs (certains facultatifs, avec des valeurs par défaut), un constructeur à dix paramètres devient illisible. Le **builder** (« constructeur pas à pas ») règle ça.

**Exemple résolu : préparer un message.** Un destinataire obligatoire, un sujet (`"(sans sujet)"` par défaut), une priorité de 1 à 5 (`3` par défaut) et une liste de copies.

```rust
#[derive(Debug)]
struct Message {
    destinataire: String,
    sujet: String,
    priorite: u8,
    copies: Vec<String>,
}

struct MessageBuilder {
    destinataire: Option<String>,
    sujet: String,
    priorite: u8,
    copies: Vec<String>,
}

impl MessageBuilder {
    fn nouveau() -> MessageBuilder {
        MessageBuilder {
            destinataire: None,
            sujet: "(sans sujet)".to_string(),
            priorite: 3,
            copies: Vec::new(),
        }
    }

    fn a(mut self, destinataire: &str) -> MessageBuilder {
        self.destinataire = Some(destinataire.to_string());
        self
    }

    fn priorite(mut self, niveau: u8) -> MessageBuilder {
        self.priorite = niveau;
        self
    }

    fn copie(mut self, personne: &str) -> MessageBuilder {
        self.copies.push(personne.to_string());
        self
    }

    fn construire(self) -> Result<Message, String> {
        let destinataire = self.destinataire.ok_or("il faut un destinataire")?;
        if !(1..=5).contains(&self.priorite) {
            return Err("la priorité va de 1 à 5".to_string());
        }
        Ok(Message { destinataire, sujet: self.sujet, priorite: self.priorite, copies: self.copies })
    }
}

let message = MessageBuilder::nouveau().a("lea").copie("max").copie("ana").construire();
println!("{message:?}");
println!("{:?}", MessageBuilder::nouveau().construire());
println!("{:?}", MessageBuilder::nouveau().a("lea").priorite(9).construire());
```

**Pas à pas de la première chaîne :**

| Appel | `destinataire` | `sujet` | `priorite` | `copies` |
|---|---|---|---|---|
| `nouveau()` | `None` | `"(sans sujet)"` | 3 | `[]` |
| `.a("lea")` | `Some("lea")` | inchangé | inchangé | `[]` |
| `.copie("max")` | inchangé | inchangé | inchangé | `["max"]` |
| `.copie("ana")` | inchangé | inchangé | inchangé | `["max", "ana"]` |

Puis `construire()` : le destinataire est là, `3` est entre 1 et 5, on obtient `Ok(Message { ... })` avec les copies **dans l'ordre d'ajout** (`push` ajoute à la fin).

- `MessageBuilder::nouveau().construire()` : `destinataire` vaut `None`, `ok_or(...)` donne `Err("il faut un destinataire")` et `?` sort tout de suite.
- `.priorite(9)` : le destinataire est là, mais `(1..=5).contains(&9)` est faux : `Err("la priorité va de 1 à 5")`.

Trois choses à remarquer :

- Chaque méthode **prend `self` par valeur** (`mut self`) et le **renvoie** : c'est ce qui permet d'enchaîner les appels avec des points. Chaque point reçoit le builder rendu par l'appel précédent. Ce n'est pas une copie : la même valeur est **déplacée** d'appel en appel.
- Les champs facultatifs ont une valeur par défaut dans `nouveau` ; le champ obligatoire est une `Option` qui commence à `None`.
- `construire` est le seul endroit qui vérifie la cohérence, et il renvoie un `Result`. Un `Message` existant est donc toujours valide.

Détail : `ok_or("il faut un destinataire")?` met un `&str` dans l'erreur, alors que la fonction renvoie `Result<_, String>`. Ça marche quand même : `?` convertit l'erreur avec `From` (`String` sait se construire depuis un `&str`). Avec `return Err(...)`, il n'y a pas de conversion automatique : il faut écrire `.to_string()`.

**À retenir :** builder = méthodes `fn x(mut self, ...) -> Self { ...; self }` enchaînables, valeurs par défaut dans `nouveau`, une seule vérification dans `construire() -> Result`.

## 5. Le typestate

Le **typestate** pousse l'idée plus loin : l'**état** d'un objet est écrit dans son **type**. Une opération interdite dans un état donné **n'existe tout simplement pas** pour ce type, donc le compilateur la refuse.

Exemple : une porte verrouillée ou déverrouillée, qui compte combien de fois on l'a ouverte.

```rust
use std::marker::PhantomData;

struct Verrouillee;
struct Deverrouillee;

struct Porte<Etat> {
    piece: String,
    passages: u32,
    etat: PhantomData<Etat>,
}

impl Porte<Verrouillee> {
    fn nouvelle(piece: &str) -> Porte<Verrouillee> {
        Porte { piece: piece.to_string(), passages: 0, etat: PhantomData }
    }

    fn deverrouiller(self) -> Porte<Deverrouillee> {
        Porte { piece: self.piece, passages: self.passages, etat: PhantomData }
    }
}

impl Porte<Deverrouillee> {
    fn passer(&mut self) -> u32 {
        self.passages += 1;
        self.passages
    }

    fn verrouiller(self) -> Porte<Verrouillee> {
        Porte { piece: self.piece, passages: self.passages, etat: PhantomData }
    }
}

impl<Etat> Porte<Etat> {
    fn piece(&self) -> &str {
        &self.piece
    }

    fn passages(&self) -> u32 {
        self.passages
    }
}

let porte = Porte::nouvelle("cave");
let mut porte = porte.deverrouiller();
println!("{}", porte.passer());
println!("{}", porte.passer());
let porte = porte.verrouiller();
println!("{} : {} passage(s)", porte.piece(), porte.passages());
```

**Pas à pas :**

| Ligne | Type de `porte` | `passages` | Affiché |
|---|---|---|---|
| `Porte::nouvelle("cave")` | `Porte<Verrouillee>` | 0 | |
| `porte.deverrouiller()` | `Porte<Deverrouillee>` | 0 | |
| `porte.passer()` | `Porte<Deverrouillee>` | 1 | `1` |
| `porte.passer()` | `Porte<Deverrouillee>` | 2 | `2` |
| `porte.verrouiller()` | `Porte<Verrouillee>` | 2 | |
| `piece()`, `passages()` | `Porte<Verrouillee>` | 2 | `cave : 2 passage(s)` |

- Chaque transition (`deverrouiller`, `verrouiller`) fabrique une **nouvelle** structure en **reprenant** les champs de l'ancienne (`piece: self.piece, passages: self.passages`) : rien n'est perdu en changeant d'état.
- `passer(&mut self)` modifie la porte sans changer son état : elle prend `&mut self`, pas `self`. Elle augmente le compteur puis renvoie le **nouveau** total (le premier passage renvoie 1).
- `let mut porte = ...` : on redéclare la variable (même nom, nouveau type), avec `mut` parce que `passer` la modifie.

Si on écrit `Porte::nouvelle("x").passer()`, le compilateur répond que `passer` n'existe pas pour `Porte<Verrouillee>`. L'erreur est attrapée **à la compilation**, pas en production.

**À retenir :** typestate = un paramètre de type par état, un `impl Porte<Etat>` par état avec seulement ses méthodes, des transitions qui prennent `self` et rendent la structure dans le nouvel état.

### À quoi sert `PhantomData` ?

Rust refuse un paramètre générique `Etat` qui n'est **utilisé dans aucun champ** (erreur « parameter `Etat` is never used »). `PhantomData<Etat>` est un champ « fantôme » : il ne prend **aucune place en mémoire**, mais il dit au compilateur « ce type dépend de `Etat` ». Les états `Verrouillee` et `Deverrouillee` sont des structures vides : elles n'existent que comme étiquettes. Pour créer ce champ, on écrit simplement `etat: PhantomData`.

### Pourquoi les transitions prennent `self`

`deverrouiller(self)` **consomme** la porte verrouillée (ownership) et en rend une nouvelle, déverrouillée. L'ancienne variable ne peut plus servir : impossible de déverrouiller deux fois la même porte, ou d'utiliser l'ancien état par erreur. Avec `&self`, l'ancienne valeur resterait utilisable, et deux états contradictoires existeraient en même temps.

```text
let fermee = Porte::nouvelle("cave");
let ouverte = fermee.deverrouiller();
fermee.deverrouiller();   // erreur : use of moved value: `fermee`
```

### Un état qui porte des données

```rust
struct Brouillon;
struct Publie { lien: String }

struct Article<Etat> {
    titre: String,
    etat: Etat,
}

impl Article<Brouillon> {
    fn publier(self) -> Result<Article<Publie>, String> {
        if self.titre.trim().is_empty() {
            return Err("un article sans titre ne peut pas être publié".to_string());
        }
        let lien = format!("/blog/{}", self.titre.to_lowercase().replace(' ', "-"));
        Ok(Article { titre: self.titre, etat: Publie { lien } })
    }
}

impl Article<Publie> {
    fn lien(&self) -> &str {
        &self.etat.lien
    }
}

let brouillon = Article { titre: "Mon Premier Article".to_string(), etat: Brouillon };
match brouillon.publier() {
    Ok(publie) => println!("{} : {}", publie.titre, publie.lien()),
    Err(message) => println!("{message}"),
}
let vide = Article { titre: "  ".to_string(), etat: Brouillon };
println!("{:?}", vide.publier().err());
```

Ici l'état n'est pas un `PhantomData` mais une vraie valeur, qui peut porter des données (le lien n'existe qu'une fois l'article publié). Les deux variantes sont courantes.

**Pas à pas :**

1. `"Mon Premier Article"` n'est pas vide. `to_lowercase()` donne `"mon premier article"`, `replace(' ', "-")` donne `"mon-premier-article"` : le lien vaut `/blog/mon-premier-article`.
2. La transition peut **échouer** : elle renvoie alors un `Result`. `Ok(...)` contient l'article dans le nouvel état.
3. `"  "` devient vide après `trim()` : on renvoie l'erreur, et `.err()` affiche `Some("un article sans titre ne peut pas être publié")`. Le brouillon a été consommé dans les deux cas.

**À retenir :** si un état a des données à lui, mets-les dans la structure de l'état (`Publie { lien }`) au lieu d'un `PhantomData` ; une transition qui peut rater renvoie `Result<NouvelEtat, E>`.

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
- `ok()` fait l'inverse : il change un `Result` en `Option` (`Ok(x)` devient `Some(x)`, l'erreur devient `None`).
- `?` fait la même chose qu'un `and_then` en plus court : il sort de la fonction à la première erreur.

**Pas à pas des trois lignes :**

| Texte | `lire_age` | `and_then(verifier_majeur)` | Affiché |
|---|---|---|---|
| `" 25 "` | `trim` donne `"25"`, `Ok(25)` | `25 >= 18` : `Ok(25)` | `Ok(25)` |
| `"abc"` | `parse` échoue, `map_err` : `Err("« abc » n'est pas un âge")` | pas appelé, l'erreur passe | l'erreur |
| `"12"` | `Ok(12)` | `12 < 18` : `Err("12 ans : trop jeune")` | l'erreur |

`parse::<u8>()` refuse aussi un nombre trop grand pour un `u8` (plus de 255) ou négatif : `"300"` donnerait la même erreur que `"abc"`.

**`map` ou `and_then` ?** Avec `map(verifier_majeur)`, on obtiendrait `Ok(Ok(25))` ou `Ok(Err(...))` : un `Result` dans un `Result`. `and_then` « aplatit » : il rend directement le `Result` de la fonction.

> [!tip] Le style « chemin heureux »
> On écrit la suite des étapes qui réussissent. La première erreur court-circuite tout le reste, sans `if` imbriqués. Voir le chapitre de programmation fonctionnelle pour le détail de ces méthodes.

Combiné avec les newtypes, on obtient une chaîne propre : texte brut, puis nombre, puis `Note` validée. On ajoute deux outils sur des **listes** de textes :

- `.map(...).sum::<Result<u32, String>>()` : additionne des `Result` ; s'il y a une erreur, le résultat est la **première** erreur.
- `.find_map(|t| ...ok())` : renvoie le premier élément pour lequel la fonction donne `Some`, ou `None` si aucun.

```rust
#[derive(Debug)]
struct Note(u8);

impl Note {
    fn new(valeur: u8) -> Result<Note, String> {
        if valeur <= 20 { Ok(Note(valeur)) } else { Err(format!("{valeur} dépasse 20")) }
    }
}

fn lire_note(texte: &str) -> Result<Note, String> {
    texte
        .trim()
        .parse::<u8>()
        .map_err(|_| format!("« {texte} » n'est pas une note"))
        .and_then(Note::new)
}

fn total(textes: &[&str]) -> Result<u32, String> {
    textes.iter().map(|t| lire_note(t).map(|n| u32::from(n.0))).sum()
}

fn premiere_note(textes: &[&str]) -> Option<Note> {
    textes.iter().find_map(|t| lire_note(t).ok())
}

println!("{:?}", lire_note(" 12 "));
println!("{:?}", lire_note("25"));
println!("{:?}", total(&["12", "8", "15"]));
println!("{:?}", total(&["12", "vingt", "25"]));
println!("{:?}", premiere_note(&["?", "99", "14", "3"]));
```

**Pas à pas :**

1. `lire_note(" 12 ")` : `trim` → `"12"`, `parse` → `Ok(12)`, `and_then(Note::new)` → `Ok(Note(12))`.
2. `lire_note("25")` : `parse` → `Ok(25)`, puis `Note::new(25)` → `Err("25 dépasse 20")`. C'est l'erreur de `new` qui ressort, `map_err` ne la touche pas (il est placé **avant** `and_then` et ne concerne que l'erreur de `parse`).
3. `total(&["12", "8", "15"])` : chaque texte donne `Ok(...)`, `map(|n| u32::from(n.0))` en tire le nombre en `u32`, `sum` donne `Ok(35)`.
4. `total(&["12", "vingt", "25"])` : `"vingt"` donne la première erreur, `sum` s'arrête et renvoie `Err("« vingt » n'est pas une note")` (le `"25"` n'est même pas lu).
5. `premiere_note(&["?", "99", "14", "3"])` : `"?"` → `None`, `"99"` → `None` (refusé par `new`), `"14"` → `Some(Note(14))` : on s'arrête là.

Le message d'erreur reprend `texte`, le texte **d'origine** (espaces compris), car c'est lui qu'on met dans `format!`, pas la version passée par `trim`.

**À retenir :** `map_err` pour l'erreur de l'étape d'avant, `and_then` pour une étape qui peut échouer, `map` pour une étape qui ne peut pas échouer ; `sum` sur des `Result` renvoie la première erreur, `find_map` + `ok()` le premier succès.

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

**Pas à pas :** `NonZeroU32::new(4)` renvoie `Some(...)` car 4 n'est pas zéro (`NonZeroU32::new(0)` renverrait `None`). `partager` récupère le nombre avec `.get()` et calcule `100 / 4 = 25`. Elle n'a **aucun** test « si zéro » à faire : son type d'entrée l'interdit déjà.

Ce style rejoint la **conception pilotée par le domaine** (DDD) : les types portent le vocabulaire du métier (`Email`, `Pourcentage`, `Commande<Validee>`) et la **logique pure** reste séparée des entrées-sorties (la « clean architecture » : au centre, des types et fonctions sans effet de bord ; aux bords, la lecture des fichiers, du réseau, de l'écran).

**À retenir :** lis une signature comme une promesse ; plus le type d'entrée est précis, moins la fonction a de cas à vérifier.

## À retenir

- **Newtype** : `struct Metres(f64)` : un type distinct sans coût, pour ne plus mélanger les valeurs (un alias `type` ne protège pas).
- **Constructeur validé** : champ privé, `new` renvoie un `Result` ; on valide une fois, aux frontières.
- **Enum plutôt que `bool`** : seuls les états voulus existent, chacun avec ses données.
- **Builder** : méthodes qui prennent et rendent `self`, `construire()` vérifie et renvoie un `Result`.
- **Typestate** : état dans le type (`Connexion<Ouverte>`), transitions qui prennent `self`, `PhantomData` pour un paramètre sans champ.
- **Option / Result** : on enchaîne avec `map`, `and_then`, `map_err`, `ok_or`, `ok`, `?`.
- Plus le type est précis, moins il y a de vérifications et de bogues à l'exécution.
