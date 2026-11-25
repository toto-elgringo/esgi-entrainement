# Les durées de vie (lifetimes)

## 1. Le problème : une référence qui survit à sa valeur

Ce code **ne compile pas** (clique sur « Essayer » pour voir l'erreur) :

```rust
let r;
{
    let x = 5;
    r = &x;
}                   // x est détruit ici
println!("{r}");    // error[E0597]: `x` does not live long enough
```

Une **référence** (`&x`) est un emprunt : elle regarde une valeur qui appartient à quelqu'un d'autre. Elle ne doit **jamais** vivre plus longtemps que cette valeur. Sinon ce serait une **référence pendante** (*dangling reference*) : elle pointerait vers de la mémoire déjà libérée.

Le **borrow checker** (le vérificateur d'emprunts du compilateur) compare la durée de vie de chaque référence avec celle de la valeur empruntée, et refuse le code dangereux.

**Exemple résolu : pourquoi le code ci-dessus est refusé ?**

Une variable vit de sa création jusqu'à l'accolade `}` qui ferme son bloc. On suit le code ligne par ligne :

| Ligne | `x` existe ? | `r` existe ? | Ce qui se passe |
|---|---|---|---|
| `let r;` | non | oui (vide) | `r` est déclarée dans le grand bloc |
| `let x = 5;` | oui | oui | `x` naît dans le petit bloc |
| `r = &x;` | oui | oui | `r` regarde `x` |
| `}` | **non** | oui | fin du petit bloc : `x` est détruit |
| `println!("{r}");` | non | oui | `r` regarderait une valeur morte : **refusé** |

Le problème n'est pas d'avoir écrit `r = &x`, c'est d'**utiliser** `r` après la mort de `x`. Deux corrections possibles : faire vivre `x` aussi longtemps que `r`, ou utiliser `r` avant la fin du petit bloc.

```rust
let x = 5;          // x est maintenant dans le même bloc que r
let r = &x;
println!("{r}");    // affiche 5 : x existe encore
```

**À retenir :** pour chaque référence, repère l'accolade `}` où meurt la valeur empruntée ; la référence ne doit plus servir après cette accolade.

```anim
durees-de-vie
scenario: pendante
```

## 2. Qu'est-ce qu'une durée de vie ?

C'est la portion du code pendant laquelle une référence est valable. Le compilateur la calcule tout seul presque tout le temps. Quand il faut l'écrire, on utilise une apostrophe suivie d'un nom : `'a` (on lit « durée de vie a »).

```text
&i32        une référence
&'a i32     une référence valable au moins pendant 'a
&'a mut i32 une référence modifiable valable au moins pendant 'a
```

Dans une fonction, on **déclare** d'abord la durée de vie entre chevrons `< >` après le nom (comme un type générique `<T>`), puis on l'utilise dans les types :

```text
fn nom<'a>(x: &'a str) -> &'a str
       ^^^    ^^           ^^
       |      |            le résultat est lié à 'a
       |      x vit au moins pendant 'a
       déclaration de 'a
```

> [!info] Annoter ne change rien à l'exécution
> Écrire `'a` ne prolonge **pas** la vie d'une valeur. On décrit seulement au compilateur un **lien** entre plusieurs références, pour qu'il puisse vérifier le code.

**Exemple résolu : lire à voix haute `fn choisir<'a>(x: &'a str, y: &str) -> &'a str`.**

1. `<'a>` : « il existe une durée de vie qu'on appelle `'a` ».
2. `x: &'a str` : « `x` est valable au moins pendant `'a` ».
3. `y: &str` : pas de `'a`, donc `y` n'a **aucun lien** avec le résultat.
4. `-> &'a str` : « le résultat est valable pendant `'a` », donc tant que `x` existe.

Conclusion : le résultat est forcément emprunté à `x`. On peut détruire `y` et continuer à utiliser le résultat.

**À retenir :** un même nom de durée de vie (`'a`) sur un paramètre et sur le résultat veut dire « le résultat vient de ce paramètre et ne doit pas lui survivre ».

## 3. E0106 : quand le compilateur a besoin d'aide

Ce code **ne compile pas** :

```rust
fn plus_long(a: &str, b: &str) -> &str {
    if a.len() >= b.len() { a } else { b }
}
```

```text
error[E0106]: missing lifetime specifier
  this function's return type contains a borrowed value, but the signature
  does not say whether it is borrowed from `a` or `b`
```

Le résultat est emprunté à `a` **ou** à `b` : le compilateur ne sait pas combien de temps il reste valable. On lui dit :

```rust
fn plus_long<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

fn main() {
    println!("{}", plus_long("chat", "souris"));
}
```

Se lit : « pour une durée de vie `'a`, `a` et `b` vivent au moins `'a`, et le résultat aussi ». En pratique, `'a` devient la **plus courte** des deux : le résultat est utilisable tant que **les deux** textes existent.

`a.len()` donne la longueur en **octets**. Avec `>=`, en cas d'égalité c'est `a` qui gagne (le `if` est vrai) ; avec `>`, ce serait `b`.

```anim
durees-de-vie
scenario: plus-long
titre: La plus courte des deux durées de vie
```

**Exemple résolu : le plus court de trois textes.** On veut `plus_court_de_trois(a, b, c)`, et en cas d'égalité le premier dans l'ordre `a`, `b`, `c`.

1. Le résultat peut venir de `a`, de `b` ou de `c` : les **trois** paramètres et le résultat reçoivent `'a`.
2. On peut réutiliser une fonction à deux paramètres : on compare d'abord `a` et `b`, puis le gagnant avec `c`.
3. Pour garder « le premier en cas d'égalité », on garde le paramètre de gauche quand les longueurs sont égales (`<=`).

```rust
fn plus_court<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() <= b.len() { a } else { b }
}

fn plus_court_de_trois<'a>(a: &'a str, b: &'a str, c: &'a str) -> &'a str {
    plus_court(plus_court(a, b), c)
}

fn main() {
    println!("{}", plus_court_de_trois("lion", "ours", "zebre"));
}
```

On vérifie avec `"lion"` (4), `"ours"` (4), `"zebre"` (5) :

| Appel | Comparaison | Résultat |
|---|---|---|
| `plus_court("lion", "ours")` | 4 <= 4 : vrai | `"lion"` |
| `plus_court("lion", "zebre")` | 4 <= 5 : vrai | `"lion"` |

Le programme affiche `lion` : égalité entre `lion` et `ours`, c'est bien le premier qui est gardé.

**À retenir :** si le résultat peut venir de plusieurs paramètres, mets le même `'a` sur **chacun** d'eux et sur le résultat.

## 4. Les règles d'élision : quand on n'a rien à écrire

**Élision** = le compilateur devine les durées de vie tout seul, avec trois règles :

1. Chaque paramètre qui est une référence reçoit sa propre durée de vie.
2. S'il y a **un seul** paramètre référence, sa durée de vie est donnée au résultat.
3. Dans une méthode avec `&self` ou `&mut self`, la durée de vie de `self` est donnée au résultat.

```text
fn premier_mot(phrase: &str) -> &str    règle 2 : pas besoin de 'a
```

Si après ces trois règles le compilateur ne sait toujours pas : erreur **E0106**, et c'est à toi d'écrire les `'a`.

**Exemple résolu : quelles signatures ont besoin de `'a` ?** On compte les paramètres références (ceux dont le type commence par `&`) :

| Signature | Paramètres références | Règle qui s'applique | Résultat |
|---|---|---|---|
| `fn f(texte: &str) -> &str` | 1 (`texte`) | règle 2 | compile, lié à `texte` |
| `fn f(texte: &str, n: usize) -> &str` | 1 (`n` n'est pas une référence) | règle 2 | compile, lié à `texte` |
| `fn f(a: &str, b: &str) -> &str` | 2 | aucune | **E0106** |
| `fn f(&self, autre: &str) -> &str` | 2, dont `&self` | règle 3 | compile, lié à `self` |
| `fn f(code: u32) -> &str` | 0 | aucune | **E0106** |

Piège : un `usize` ou un `u32` n'est pas une référence, il ne compte pas.

**À retenir :** zéro ou plusieurs paramètres références (sans `&self`) et un résultat référence : il faut écrire les durées de vie.

### Découper un texte sans le copier

Une fonction qui renvoie un **morceau** d'un texte reçu n'a pas besoin de créer une `String` : elle renvoie une **vue** `&str` sur ce texte. Les outils utiles :

| Outil | Ce qu'il fait | Exemple sur `"  Rust est  rapide "` |
|---|---|---|
| `split_whitespace()` | coupe aux espaces, ignore les espaces en trop | `"Rust"`, `"est"`, `"rapide"` |
| `.next()` | le premier morceau, dans une `Option` | `Some("Rust")` |
| `.last()` | le dernier morceau, dans une `Option` | `Some("rapide")` |
| `.nth(1)` | le morceau numéro 1 (on compte à partir de 0) | `Some("est")` |
| `.count()` | le nombre de morceaux | `3` |
| `split('.')` | coupe à chaque `.` (garde les espaces) | |
| `trim()` | enlève les espaces au début et à la fin | `"Rust est  rapide"` |
| `.unwrap_or("")` | la valeur dans `Some`, ou `""` si c'est `None` | |

`next`, `last` et `nth` renvoient une `Option` car il peut n'y avoir **aucun** morceau (texte vide ou seulement des espaces).

**Exemple résolu : le deuxième mot d'une phrase.**

```rust
fn deuxieme_mot(phrase: &str) -> &str {
    phrase.split_whitespace().nth(1).unwrap_or("")
}

fn main() {
    println!("[{}]", deuxieme_mot("  le   chat dort"));
    println!("[{}]", deuxieme_mot("seul"));
}
```

1. Un seul paramètre référence : règle 2, pas de `'a`, le résultat est une vue sur `phrase`.
2. `"  le   chat dort"` coupé par `split_whitespace()` donne `"le"`, `"chat"`, `"dort"` : les espaces en trop disparaissent.
3. `.nth(1)` prend le morceau d'indice 1 : `Some("chat")`, et `unwrap_or("")` sort `"chat"`.
4. `"seul"` ne donne qu'un morceau : `.nth(1)` vaut `None`, donc `unwrap_or("")` renvoie `""`.

Le programme affiche `[chat]` puis `[]`.

Pour la **première phrase** d'un texte, on coupe au point puis on nettoie : `"Il pleut. Fin.".split('.').next()` donne `Some("Il pleut")`, et sur `" Bonjour. Oui."` on obtient `Some(" Bonjour")` : il faut `trim()` pour enlever l'espace du début. S'il n'y a pas de point, `split('.')` donne le texte entier en un seul morceau.

**À retenir :** pour extraire un morceau, enchaîne « découper → choisir (`next`, `last`, `nth`) → `unwrap_or("")` » ; rien n'est copié.

## 5. Lier le résultat à un seul paramètre

On ne met `'a` que sur les paramètres dont le résultat dépend vraiment :

```text
fn premier_qui_finit_par<'a>(mots: &[&'a str], fin: &str) -> Option<&'a str>
```

`&[&'a str]` est une **tranche** (une vue sur une liste, voir le chapitre sur les collections) de textes empruntés valables pendant `'a`. Un tableau `["a", "b"]` ou un `Vec<&str>` se passent avec `&mots`.

Le résultat vient de `mots`, jamais de `fin` : le texte `fin` peut donc être détruit avant qu'on utilise le résultat.

**Exemple résolu : trouver le premier mot qui finit par un texte donné.**

```rust
fn premier_qui_finit_par<'a>(mots: &[&'a str], fin: &str) -> Option<&'a str> {
    mots.iter().find(|mot| mot.ends_with(fin)).copied()
}

fn main() {
    let mots = ["cheval", "camion", "avion"];
    let trouve;
    {
        let fin = String::from("ion");
        trouve = premier_qui_finit_par(&mots, &fin);
    }
    println!("{trouve:?}");
}
```

1. `mots.iter()` parcourt la liste élément par élément ; chaque élément est donné sous forme de référence (`&&str`).
2. `find(|mot| ...)` essaie chaque élément avec la condition entre `| |` (une closure) et s'arrête au **premier** qui la respecte. `ends_with(fin)` teste la fin d'un texte (`starts_with` teste le début).
3. On essaie `"cheval"` (finit par `"ion"` ? non), puis `"camion"` (oui) : `find` s'arrête et renvoie `Some(&"camion")`. Si aucun mot ne convient, il renvoie `None`.
4. `find` renvoie une **référence vers l'élément** (`Option<&&str>`) ; `.copied()` enlève ce `&` en trop pour obtenir le type annoncé `Option<&str>`.
5. `fin` est détruit à l'accolade `}`, mais `trouve` ne dépend que de `mots` (grâce à `'a` placé seulement sur `mots`) : le `println!` est accepté et affiche `Some("camion")`.
6. Si on avait écrit `fin: &'a str`, le compilateur considérerait que le résultat peut venir de `fin` : erreur **E0597** (`fin` does not live long enough).

La même recherche s'écrit aussi avec une boucle : `for mot in mots { if mot.ends_with(fin) { return Some(mot); } }` puis `None` après la boucle.

**À retenir :** demande-toi d'où vient **vraiment** le résultat, et mets `'a` uniquement sur ce paramètre.

## 6. Renvoyer une référence vers une variable locale : impossible

Ce code **ne compile pas** :

```rust
fn salutation(nom: &str) -> &str {
    let message = format!("Bonjour {nom}");
    &message    // error[E0515]: cannot return reference to local variable `message`
}
```

`message` est détruit à la fin de la fonction. Aucune annotation ne peut sauver ce code : il faut renvoyer la valeur **possédée**.

```rust
fn salutation(nom: &str) -> String {
    format!("Bonjour {nom}")
}

fn main() {
    println!("{}", salutation("Sam"));
}
```

> [!tip] La règle du chapitre 3
> Prendre l'emprunt (`&str`) en paramètre, rendre le possédé (`String`) quand on crée une nouvelle valeur.

**Exemple résolu : une ligne de tirets.** On veut `ligne(n)` qui renvoie `n` tirets. `"-".repeat(n)` fabrique une **nouvelle** `String` (avec `n = 4` : `"----"`).

1. La `String` est créée **dans** la fonction : elle appartient à la fonction.
2. Renvoyer `&resultat` donnerait une référence vers une variable qui meurt à l'accolade finale : E0515.
3. On renvoie donc la `String` elle-même : la fonction la **donne** à l'appelant, qui en devient propriétaire.

```rust
fn ligne(n: usize) -> String {
    "-".repeat(n)
}

fn main() {
    let tirets = ligne(4);
    println!("{tirets}");
}
```

Le programme affiche `----`.

**À retenir :** une valeur fabriquée dans la fonction (`format!`, `repeat`, `to_uppercase`, `String::from`...) se renvoie par valeur, avec le type `String`.

## 7. `'static` : valable pendant tout le programme

Les textes écrits dans le code (`"bonjour"`) sont des `&'static str` : leurs octets sont rangés dans le programme lui-même et existent du début à la fin.

```rust
fn nom_du_jour(numero: u32) -> &'static str {
    match numero {
        1 => "lundi",
        2 => "mardi",
        _ => "autre jour",
    }
}

fn main() {
    println!("{}", nom_du_jour(2));
    println!("{}", nom_du_jour(9));
}
```

Sans paramètre référence, le compilateur ne peut rien deviner : E0106, et la ligne `help:` propose justement `'static`.

**Exemple résolu : pourquoi `-> &str` seul ne marche pas ici ?**

1. On compte les paramètres références : `numero` est un `u32`, donc **zéro**.
2. Aucune règle d'élision ne s'applique : E0106.
3. D'où viennent les textes renvoyés ? De `"lundi"`, `"mardi"`, `"autre jour"`, écrits dans le code : ils existent pendant tout le programme.
4. On écrit donc `-> &'static str`. Le `match` compare `numero` à chaque cas dans l'ordre ; `_` attrape tout le reste (ici 9 donne `"autre jour"`).

**À retenir :** une fonction sans paramètre référence qui renvoie un texte écrit dans le code renvoie un `&'static str`.

> [!warning] Pas de `'static` pour faire taire le compilateur
> Une `String` créée dans la fonction n'est **pas** `'static`. Si le compilateur proteste, relis plutôt qui possède la valeur.

## 8. Une struct qui contient une référence

Une struct peut garder une référence au lieu d'une copie. Il faut alors déclarer la durée de vie à **trois** endroits : la struct, le bloc `impl` et les méthodes qui en ont besoin.

```rust
struct Citation<'a> {
    texte: &'a str,
}

impl<'a> Citation<'a> {
    fn nouvelle(texte: &'a str) -> Citation<'a> {
        Citation { texte }
    }

    fn dernier_mot(&self) -> &'a str {
        self.texte.split_whitespace().last().unwrap_or("")
    }

    fn longueur(&self) -> usize {
        self.texte.len()
    }
}

fn main() {
    let livre = String::from("Le temps passe vite");
    let mot;
    {
        let citation = Citation::nouvelle(&livre);
        println!("{} octets", citation.longueur());
        mot = citation.dernier_mot();
    }
    println!("{mot}");
}
```

`Citation<'a>` veut dire : « une `Citation` ne peut pas vivre plus longtemps que le texte qu'elle regarde ». Sans `<'a>` sur la struct, le champ `texte: &str` donne l'erreur E0106.

**Exemple résolu : pourquoi `dernier_mot` renvoie `&'a str` et pas `&str` ?**

1. Avec `-> &str`, la règle 3 d'élision lie le résultat à `&self`, c'est-à-dire à la **citation**.
2. Dans `main`, la citation meurt à l'accolade `}`, mais `mot` est utilisé après : le compilateur refuserait (E0597).
3. Or le mot est en réalité un morceau de `livre`, pas de la citation. En écrivant `-> &'a str`, on dit « le résultat est lié au **texte** », qui vit jusqu'à la fin de `main`.
4. Le programme compile et affiche `19 octets` puis `vite`.

`longueur` renvoie un `usize` (un nombre, pas une référence) : aucune durée de vie à écrire.

**À retenir :** `struct S<'a>` + `impl<'a> S<'a>` ; une méthode qui renvoie un morceau du texte regardé renvoie `&'a str` pour rester valable après la struct.

## 9. Les erreurs à connaître

| Code | Message | Traduction |
|---|---|---|
| E0106 | missing lifetime specifier | le compilateur ne sait pas d'où vient la référence renvoyée |
| E0597 | does not live long enough | la valeur meurt alors qu'elle est encore empruntée |
| E0515 | cannot return reference to local variable | tu renvoies une référence vers une valeur qui va mourir |
| E0716 | temporary value dropped while borrowed | tu empruntes une valeur temporaire détruite à la fin de la ligne |

### Corriger E0597 sans changer la signature

Ce code **ne compile pas** : `petit` meurt à la fin du bloc, alors que `choisi` (qui peut le regarder) sert après.

```rust
fn plus_court<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() <= b.len() { a } else { b }
}

fn main() {
    let grand = String::from("hippopotame");
    let choisi;
    {
        let petit = String::from("rat");
        choisi = plus_court(&grand, &petit);
    }
    println!("{choisi}");
}
```

**Exemple résolu :**

1. Le message dit « `petit` does not live long enough » : `petit` est la valeur qui meurt trop tôt.
2. `plus_court` relie le résultat à ses **deux** paramètres : `choisi` n'est valable que tant que `grand` **et** `petit` existent.
3. On supprime le bloc intérieur pour que `petit` vive jusqu'au `println!` :

```rust
fn plus_court<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() <= b.len() { a } else { b }
}

fn main() {
    let grand = String::from("hippopotame");
    let petit = String::from("rat");
    let choisi = plus_court(&grand, &petit);
    println!("{choisi}");
}
```

Le programme affiche `rat`.

**À retenir :** E0597 se corrige en déplaçant la valeur pour qu'elle vive plus longtemps (ou en utilisant la référence plus tôt), pas en ajoutant des annotations.

### Corriger E0716 : ranger la valeur temporaire

Une **valeur temporaire** est une valeur créée au milieu d'une ligne sans être rangée dans une variable. Elle est détruite à la fin de la ligne. Ce code **ne compile pas** :

```rust
let texte = String::from("rouge,vert,bleu");
let dernier = texte.replace(',', " ").split_whitespace().last().unwrap_or("");
println!("{dernier}");
```

**Exemple résolu :**

1. `texte.replace(',', " ")` fabrique une **nouvelle** `String` (`"rouge vert bleu"`), jamais rangée dans une variable : c'est une temporaire.
2. `split_whitespace().last()` renvoie une vue `&str` **dans** cette temporaire.
3. À la fin de la ligne (`;`), la temporaire est détruite, mais `dernier` la regarde encore au `println!` : E0716.
4. Correction : on range d'abord la `String` dans une variable, puis on l'emprunte.

```rust
let texte = String::from("rouge,vert,bleu");
let propre = texte.replace(',', " ");
let dernier = propre.split_whitespace().last().unwrap_or("");
println!("{dernier}");
```

`propre` vit jusqu'à la fin du bloc : le programme affiche `bleu`. `to_uppercase()`, `to_lowercase()`, `replace(...)` et `format!` créent tous une nouvelle `String` : même piège.

**À retenir :** si tu empruntes le résultat d'une méthode qui crée une `String`, range d'abord cette `String` dans une variable avec `let`.

## À retenir

- Une référence ne doit jamais vivre plus longtemps que la valeur empruntée.
- `'a` décrit un lien entre des références, ça ne change rien à l'exécution.
- Élision : un seul paramètre référence (ou `&self`) → rien à écrire.
- E0106 : ajouter `<'a>` et relier le résultat aux bons paramètres (seulement ceux d'où il vient).
- E0597 : faire vivre la valeur plus longtemps. E0716 : ranger la temporaire dans une variable.
- On ne peut pas renvoyer une référence vers une variable locale : renvoyer une `String`.
- `'static` = valable pendant tout le programme (les textes écrits dans le code).
- Struct avec référence : `struct S<'a>`, `impl<'a> S<'a>`, et `&'a str` pour les morceaux du texte regardé.
