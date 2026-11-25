# Async / await

## 1. Pourquoi de l'asynchrone ?

Beaucoup de programmes **attendent** : une réponse réseau, un fichier, une base de données. Pendant l'attente, le processeur ne fait rien.

Deux façons d'éviter de rester bloqué :

- les **threads** : un fil d'exécution par tâche, géré par le système ;
- l'**async** : une tâche peut se mettre en pause et laisser la place à une autre, dans le même fil.

| | Threads | Async |
|---|---|---|
| Qui change de tâche ? | le système | le programme, à chaque `.await` |
| Coût d'une tâche | élevé (pile mémoire dédiée) | très faible (un petit objet) |
| Idéal pour | calculs lourds en parallèle | des milliers d'attentes (réseau) |

> [!info] Concurrence et parallélisme
> **Concurrence** : plusieurs tâches avancent à tour de rôle. **Parallélisme** : plusieurs tâches avancent vraiment en même temps (plusieurs cœurs). L'async donne surtout de la concurrence.

**Exemple : trois pages web à télécharger, chacune met 1 seconde à répondre.**

| Méthode | Ce qui se passe | Durée |
|---|---|---|
| Une après l'autre, en bloquant | on attend la 1re, puis la 2e, puis la 3e | environ 3 s |
| 3 threads | chaque thread attend sa page, en même temps | environ 1 s, mais 3 piles mémoire |
| async dans un seul fil | on envoie les 3 demandes ; pendant qu'une attend, on s'occupe des autres | environ 1 s, avec 3 petits objets |

Le temps est passé à **attendre**, pas à calculer : un seul fil suffit à surveiller les trois attentes. Avec 10 000 pages, 10 000 threads coûteraient très cher en mémoire, alors que 10 000 tâches async restent légères.

**À retenir :** beaucoup d'attentes → async ; beaucoup de calcul → threads.

## 2. `async fn` et `.await`

Une fonction `async` ne s'exécute **pas** quand on l'appelle. Elle renvoie une valeur appelée **future** (« un résultat à venir »).

```rust
async fn addition(a: u32, b: u32) -> u32 {
    a + b
}

fn main() {
    let futur = addition(2, 3);
    println!("rien n'a encore été calculé");
    drop(futur);
}
```

Pour obtenir le résultat, on écrit `.await`, mais seulement **dans** une autre fonction ou un bloc `async` :

```rust
async fn addition(a: u32, b: u32) -> u32 {
    a + b
}

async fn calcul() -> u32 {
    let x = addition(1, 2).await;
    let y = addition(x, 10).await;
    y * 2
}

fn main() {
    let _futur = calcul();
}
```

`.await` veut dire : « je suis prêt à me mettre en pause jusqu'à ce que ce futur ait fini ».

**Pas à pas, quand quelqu'un exécute `calcul()` :**

1. `addition(1, 2)` crée un futur ; `.await` l'exécute jusqu'au bout : `x = 3`.
2. `addition(x, 10)` crée un autre futur ; `.await` donne `y = 13`.
3. La fonction renvoie `y * 2 = 26`.

Dans ce `main`, `calcul()` est seulement **créé** : aucune de ces étapes n'a lieu (il faudrait un exécuteur, voir partie 4).

> [!warning] Les futures sont paresseuses
> Appeler une `async fn` sans `.await` (ni exécuteur) ne fait **rien**. Le code de la fonction ne démarre jamais. C'est le piège numéro 1.

**Exemple résolu : dans quel ordre s'affichent les messages ?** On utilise `block_on` (expliqué partie 5) : il exécute un futur depuis `main` et rend son résultat.

```rust
use std::future::Future;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

fn block_on<F: Future>(futur: F) -> F::Output {
    let mut futur = pin!(futur);
    let mut contexte = Context::from_waker(Waker::noop());
    loop {
        if let Poll::Ready(valeur) = futur.as_mut().poll(&mut contexte) {
            return valeur;
        }
    }
}

async fn cuire(plat: &str) -> String {
    println!("cuisson : {plat}");
    format!("{plat} prêt")
}

fn main() {
    let commande = cuire("gratin");
    println!("commande passée");
    println!("{}", block_on(commande));

    let dessert = async {
        println!("préparation du dessert");
        3 * 4
    };
    println!("dessert prévu");
    println!("parts : {}", block_on(dessert));
}
```

| Ligne exécutée | Affichage | Pourquoi |
|---|---|---|
| `let commande = cuire("gratin");` | rien | le futur est créé, son code ne démarre pas |
| `println!("commande passée")` | `commande passée` | |
| `block_on(commande)` | `cuisson : gratin` puis `gratin prêt` | c'est **maintenant** que le code de `cuire` tourne |
| `let dessert = async { ... };` | rien | un bloc `async` est aussi un futur paresseux |
| `println!("dessert prévu")` | `dessert prévu` | |
| `block_on(dessert)` | `préparation du dessert` puis `parts : 12` | le bloc s'exécute enfin |

**À retenir :** créer un futur (appel d'`async fn` ou bloc `async`) n'exécute rien ; le code ne tourne qu'au `.await` ou dans un exécuteur.

### Utiliser le résultat d'un `.await`

`.await` s'écrit comme un champ, et il passe **avant** les opérateurs : `addition(a, b).await * 2` calcule d'abord `addition(a, b).await`, puis multiplie par 2. On peut aussi le mettre dans un `format!` :

```text
async fn titre() -> &'static str { "Docteur" }

async fn presenter(nom: &str) -> String {
    format!("{} {} !", titre().await, nom)      // "Docteur Who !" pour "Who"
}

async fn triple_somme(a: u32, b: u32) -> u32 {
    addition(a, b).await * 3                    // (a + b) * 3
}
```

**À retenir :** `f().await` se comporte comme la valeur renvoyée par `f` : on peut la multiplier, l'afficher, la ranger dans une variable.

## 3. Le trait `Future`

Un future est n'importe quel type qui implémente le trait `Future` de la bibliothèque standard :

```text
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
```

- `Output` : le type du résultat final.
- `poll` : « as-tu fini ? ». On l'appelle pour faire avancer le futur.
- `Poll` : la réponse, un `enum` à deux cas.

```text
enum Poll<T> {
    Ready(T),
    Pending,
}
```

`Ready(valeur)` : terminé, voici le résultat. `Pending` : pas encore, rappelle-moi plus tard.

**Exemple : un futur qui donne `"ok"` après deux attentes.** Chaque appel à `poll` le fait avancer d'un pas :

| Appel | Réponse | Sens |
|---|---|---|
| 1er `poll` | `Poll::Pending` | pas fini, rappelle-moi |
| 2e `poll` | `Poll::Pending` | toujours pas |
| 3e `poll` | `Poll::Ready("ok")` | fini, le résultat est `"ok"` |
| 4e `poll` | interdit | un futur terminé ne doit plus être interrogé |

**À retenir :** `poll` = « avance d'un pas » ; `Pending` = rappelle-moi, `Ready(v)` = terminé avec `v`.

### Pin et Context, simplement

- **`Pin<&mut Self>`** : une référence mutable qui promet que le futur **ne sera pas déplacé** en mémoire. Un futur écrit par le compilateur peut contenir des références vers lui-même, donc le déplacer casserait tout. Pour les types simples (nombres, `String`…), `Pin` ne gêne pas : on s'en sert presque comme d'un `&mut Self`.
- **`Context`** : contient un **waker**, une sorte de sonnette. Un futur en attente la fait sonner (`cx.waker().wake_by_ref()`) pour dire à l'exécuteur : « rappelle-moi, je peux avancer ».

**Pourquoi déplacer un futur casserait tout :** imagine un futur qui contient un tableau et une référence vers une case de ce tableau. Si on déplace le futur à une autre adresse, le tableau part avec lui, mais la référence pointe toujours vers **l'ancienne** adresse : elle désigne maintenant n'importe quoi. `Pin` interdit ce déplacement. Les types qui ne contiennent pas ce genre de référence vers eux-mêmes (nombres, `String`, `Box`, `Rc`…) sont dits `Unpin` : pour eux, `Pin` laisse tout faire.

**À retenir :** `Pin` = « ce futur ne bougera plus en mémoire » ; `Context` porte le waker qui sert à dire « rappelle-moi ».

## 4. Pourquoi un exécuteur ?

Un futur ne bouge pas tout seul : quelqu'un doit appeler `poll`, encore et encore. Ce quelqu'un s'appelle un **exécuteur** (ou *runtime*).

`fn main` ne peut pas être `async` en Rust standard : la bibliothèque standard **ne fournit pas d'exécuteur**. On utilise une bibliothèque (tokio, smol…) ou on écrit le sien.

**Pas à pas :** si `main` pouvait être `async`, il renverrait un futur. Mais qui appellerait `poll` sur ce futur ? Personne : le programme démarrerait et ne ferait rien. C'est pourquoi `async fn main()` est refusé tout seul, et accepté avec `#[tokio::main]` (qui crée un exécuteur et lui donne le futur de `main`).

**À retenir :** pas d'exécuteur, pas d'exécution ; la std n'en fournit pas.

## 5. Un mini `block_on`

Écrivons le plus petit exécuteur possible : il appelle `poll` en boucle jusqu'à `Ready`.

```rust
use std::future::Future;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

fn block_on<F: Future>(futur: F) -> F::Output {
    let mut futur = pin!(futur);
    let mut contexte = Context::from_waker(Waker::noop());
    loop {
        if let Poll::Ready(valeur) = futur.as_mut().poll(&mut contexte) {
            return valeur;
        }
    }
}

async fn addition(a: u32, b: u32) -> u32 {
    a + b
}

fn main() {
    let resultat = block_on(async {
        let x = addition(1, 2).await;
        x * 10
    });
    println!("{resultat}");
}
```

Ce qu'il faut retenir :

- `pin!(futur)` fixe le futur sur place (sur la pile) pour pouvoir le « pinner ».
- `Waker::noop()` est un waker qui ne fait rien (stable depuis Rust 1.85). On boucle sans arrêt, donc pas besoin d'être réveillé.
- `futur.as_mut().poll(...)` : un seul pas d'avancement.

**Pas à pas, ligne par ligne :**

1. `fn block_on<F: Future>(futur: F) -> F::Output` : `block_on` accepte n'importe quel futur `F`, et renvoie son type de résultat `F::Output`.
2. `let mut futur = pin!(futur);` : `futur` devient un `Pin<&mut F>`, le futur ne bougera plus.
3. `Context::from_waker(Waker::noop())` : un contexte dont la sonnette ne fait rien.
4. `loop { ... }` : à chaque tour, un `poll`. Si la réponse est `Poll::Ready(valeur)`, on sort avec `return valeur` ; sinon (`Pending`), on refait un tour.

**Pourquoi `as_mut()` ?** `poll` prend son `Pin<&mut F>` **par valeur** : il le consomme. Sans `as_mut()`, on ne pourrait appeler `poll` qu'une fois, et la boucle serait refusée. `futur.as_mut()` fabrique à chaque tour un nouveau `Pin<&mut F>` vers le même futur.

| Futur donné à `block_on` | Tours de boucle | Résultat |
|---|---|---|
| `async { 7 }` | 1 (prêt tout de suite) | 7 |
| `std::future::ready(7)` (futur déjà prêt) | 1 | 7 |
| un futur qui répond `Pending` deux fois | 3 | sa valeur au 3e tour |

Dans l'exemple ci-dessus, le bloc `async` appelle `addition(1, 2).await` (3), multiplie par 10 et `block_on` affiche `30`.

> [!tip] Exécuteur d'apprentissage
> Ce `block_on` « occupé » tourne à fond tant que le futur est `Pending`. C'est parfait pour apprendre et tester, mais un vrai exécuteur dort jusqu'à ce que le waker sonne.

**À retenir :** `block_on` = `pin!`, un contexte, puis `loop` sur `futur.as_mut().poll(...)` jusqu'à `Ready`.

## 6. Écrire un `Future` à la main

Un futur « prêt au 3e poll » :

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

struct Compteur {
    polls: u32,
}

impl Future for Compteur {
    type Output = &'static str;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        self.polls += 1;
        if self.polls < 3 {
            cx.waker().wake_by_ref();
            Poll::Pending
        } else {
            Poll::Ready("prêt !")
        }
    }
}

fn main() {
    let mut futur = Box::pin(Compteur { polls: 0 });
    let mut contexte = Context::from_waker(Waker::noop());
    for i in 1..=3 {
        println!("poll n°{i} : {:?}", futur.as_mut().poll(&mut contexte));
    }
}
```

`Box::pin(...)` place le futur sur le tas et le « pinne ». `Compteur` ne contient que des nombres : on peut donc modifier `self.polls` directement.

**Pas à pas :**

| Appel | `polls` avant | `polls` après | `polls < 3` ? | Réponse |
|---|---|---|---|---|
| poll n°1 | 0 | 1 | oui | `Pending` (et `wake_by_ref`) |
| poll n°2 | 1 | 2 | oui | `Pending` (et `wake_by_ref`) |
| poll n°3 | 2 | 3 | non | `Ready("prêt !")` |

- `type Output = &'static str;` : le résultat final est un texte.
- `mut self: Pin<&mut Self>` : le `mut` devant `self` est nécessaire pour écrire `self.polls += 1`. Comme `Compteur` est `Unpin` (il ne contient qu'un nombre), le `Pin` laisse modifier ses champs.
- `cx.waker().wake_by_ref()` avant chaque `Pending` : c'est l'habitude à prendre. Un futur qui répond `Pending` doit faire en sorte que quelqu'un sonne plus tard, sinon un vrai exécuteur ne le rappellerait jamais.

> [!warning] Ne pas appeler `poll` après `Ready`
> Un futur terminé peut paniquer s'il est interrogé de nouveau. Un exécuteur doit arrêter de le poller dès `Ready`.

**À retenir :** un futur à la main = `impl Future`, un `type Output`, et un `poll` qui renvoie `Pending` (après `wake_by_ref`) tant que ce n'est pas fini, puis `Ready(valeur)`.

### Attendre une valeur qui arrive plus tard

Un futur peut attendre qu'un **autre** morceau de code dépose une valeur. On partage une boîte `Rc<RefCell<Option<T>>>` :

- `Rc` : plusieurs propriétaires (le futur et celui qui remplit la boîte) ;
- `RefCell` : on peut modifier le contenu malgré le partage (`borrow_mut()`) ;
- `Option<T>` : `None` = rien pour l'instant, `Some(v)` = la valeur est arrivée.

```rust
use std::cell::RefCell;
use std::future::Future;
use std::pin::Pin;
use std::rc::Rc;
use std::task::{Context, Poll, Waker};

type Casier = Rc<RefCell<Option<String>>>;

struct Courrier {
    casier: Casier,
}

impl Future for Courrier {
    type Output = String;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<String> {
        match self.casier.borrow_mut().take() {
            Some(lettre) => Poll::Ready(lettre),
            None => {
                cx.waker().wake_by_ref();
                Poll::Pending
            }
        }
    }
}

fn main() {
    let casier: Casier = Rc::new(RefCell::new(None));
    let mut futur = Box::pin(Courrier { casier: Rc::clone(&casier) });
    let mut contexte = Context::from_waker(Waker::noop());

    println!("1er poll : {:?}", futur.as_mut().poll(&mut contexte));
    *casier.borrow_mut() = Some(String::from("facture"));
    println!("2e poll : {:?}", futur.as_mut().poll(&mut contexte));
    println!("casier après : {:?}", casier.borrow());
}
```

| Étape | Contenu du casier | Réponse |
|---|---|---|
| 1er poll | `None` : `take()` rend `None` | `Pending` |
| `main` dépose `"facture"` | `Some("facture")` | |
| 2e poll | `take()` rend `Some("facture")` et laisse `None` | `Ready("facture")` |
| après | `None` (la lettre a été prise) | |

- `take()` sur un `Option` : rend l'ancien contenu et laisse `None` à sa place. Le casier est donc **vidé** quand le futur prend la valeur.
- Ici `self` n'a pas besoin de `mut` : on ne change aucun champ du futur, on passe par le `RefCell` partagé.
- Dans une `async fn`, ce futur s'attend comme les autres : `async fn lire(c: Courrier) -> usize { c.await.len() }` attend la lettre puis rend sa longueur.

**À retenir :** futur qui attend une donnée partagée = `borrow_mut().take()` ; `Some(v)` → `Ready(v)`, `None` → `wake_by_ref` puis `Pending`.

## 7. Ce que fait `async` en coulisses

Le compilateur transforme chaque `async fn` en une **machine à états** : un `enum` caché avec un état par `.await`. Chaque `poll` fait avancer jusqu'au prochain `.await` qui répond `Pending`, puis rend la main.

C'est pourquoi une tâche async coûte si peu : ce n'est qu'un petit objet, pas un fil du système.

**Exemple : `calcul()` de la partie 2 vue par le compilateur (en simplifié).**

```text
enum EtatCalcul {
    Debut,
    AttendPremier { futur: AdditionFutur },
    AttendSecond { futur: AdditionFutur },
    Fini,
}
```

Imaginons que chaque `addition` réponde une fois `Pending` avant d'être prête :

| `poll` | État avant | Ce qui se passe | État après |
|---|---|---|---|
| 1 | `Debut` | crée `addition(1, 2)`, l'interroge → `Pending` | `AttendPremier` |
| 2 | `AttendPremier` | réinterroge → `Ready(3)`, donc `x = 3` ; crée `addition(3, 10)`, l'interroge → `Pending` | `AttendSecond` |
| 3 | `AttendSecond` | réinterroge → `Ready(13)`, donc `y = 13` ; répond `Ready(26)` | `Fini` |

Dans le vrai code, `addition` est prête dès son premier `poll` : tout se fait alors en **un seul** `poll` de `calcul`, sans jamais répondre `Pending`.

**À retenir :** une `async fn` devient un `enum` d'états qui implémente `Future` ; chaque `.await` est un point de pause possible.

## 8. Combiner des futures

**En séquence** : on écrit simplement `.await` l'un après l'autre.

```rust
use std::future::Future;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

fn block_on<F: Future>(futur: F) -> F::Output {
    let mut futur = pin!(futur);
    let mut contexte = Context::from_waker(Waker::noop());
    loop {
        if let Poll::Ready(valeur) = futur.as_mut().poll(&mut contexte) {
            return valeur;
        }
    }
}

async fn prix(article: &str) -> u32 {
    match article {
        "pain" => 2,
        "lait" => 1,
        _ => 0,
    }
}

async fn panier() -> u32 {
    let mut total = 0;
    for article in ["pain", "lait", "pain"] {
        total += prix(article).await;
    }
    total
}

fn main() {
    println!("total : {}", block_on(panier()));
}
```

**Pas à pas :**

| Tour | `article` | `prix(article).await` | `total` après |
|---|---|---|---|
| départ | | | 0 |
| 1 | `"pain"` | 2 | 2 |
| 2 | `"lait"` | 1 | 3 |
| 3 | `"pain"` | 2 | 5 |

On peut écrire `.await` **dans une boucle** d'une `async fn` : chaque prix est attendu avant de passer à l'article suivant. Le même schéma sert pour tout calcul « en parcourant » : une variable qu'on met à jour à chaque tour (un total, un compteur, la plus petite ou la plus grande valeur vue jusqu'ici, qui vaut `0` au départ si la liste peut être vide). Par exemple, pour compter les articles gratuits : `if prix(article).await == 0 { gratuits += 1; }`.

**En même temps** (« concurrent ») : il faut un `join`. Il interroge chaque futur à tour de rôle et attend qu'ils soient tous finis. La bibliothèque standard n'en fournit pas (tokio et la crate `futures` ont `join!` et `select!`). Tu en écriras un dans les exercices.

> [!warning] Séquence n'est pas concurrence
> `a().await; b().await;` lance `b` **après** la fin de `a`. Pour les faire avancer ensemble, il faut un `join`.

**À retenir :** `.await` dans une boucle = les attentes se font l'une après l'autre ; pour les faire avancer ensemble, il faut un `join`.

### Comment marche un `join`

Un `join` est lui-même un futur qui garde **deux futures** et **deux résultats** (des `Option`, `None` tant que pas reçu). À chaque `poll` du `join` :

1. si le résultat du premier est encore `None`, on interroge le premier ; s'il répond `Ready(v)`, on range `Some(v)` ;
2. pareil pour le second ;
3. si les deux résultats sont `Some`, le `join` répond `Ready((a, b))` ; sinon `Pending`.

**Exemple : X est prêt au 1er poll avec 4, Y est prêt au 3e poll avec 9.**

| `poll` du join | X interrogé ? | Y interrogé ? | Résultats | Réponse |
|---|---|---|---|---|
| 1 | oui → `Ready(4)` | oui → `Pending` | `(Some(4), None)` | `Pending` |
| 2 | **non** (déjà fini) | oui → `Pending` | `(Some(4), None)` | `Pending` |
| 3 | non | oui → `Ready(9)` | `(Some(4), Some(9))` | `Ready((4, 9))` |

Le point important est au 2e poll : X est **déjà terminé**, on ne l'interroge plus (ce serait interdit). C'est le rôle des `Option` : se souvenir de qui a fini. Le `join` dure 3 polls, autant que le plus lent, alors qu'en séquence il en faudrait 1 + 3 = 4.

### Exemple résolu : une « course » entre deux futures

Pour voir les outils d'un combinateur écrit à la main, voici un autre combinateur, `Course` (l'idée de `select!`) : il rend le résultat du **premier** futur qui finit.

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

type FuturBoite = Pin<Box<dyn Future<Output = &'static str>>>;

struct Lent {
    nom: &'static str,
    restant: u32,
}

impl Future for Lent {
    type Output = &'static str;

    fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<&'static str> {
        if self.restant == 0 {
            Poll::Ready(self.nom)
        } else {
            self.restant -= 1;
            Poll::Pending
        }
    }
}

struct Course {
    a: FuturBoite,
    b: FuturBoite,
}

impl Future for Course {
    type Output = &'static str;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<&'static str> {
        let this = self.get_mut();
        if let Poll::Ready(v) = this.a.as_mut().poll(cx) {
            return Poll::Ready(v);
        }
        if let Poll::Ready(v) = this.b.as_mut().poll(cx) {
            return Poll::Ready(v);
        }
        Poll::Pending
    }
}

fn main() {
    let mut course = Box::pin(Course {
        a: Box::pin(Lent { nom: "tortue", restant: 3 }),
        b: Box::pin(Lent { nom: "lièvre", restant: 1 }),
    });
    let mut contexte = Context::from_waker(Waker::noop());
    let mut tour = 1;
    loop {
        let reponse = course.as_mut().poll(&mut contexte);
        println!("tour {tour} : {reponse:?}");
        if reponse.is_ready() {
            break;
        }
        tour += 1;
    }
}
```

1. `type FuturBoite = Pin<Box<dyn Future<Output = ...>>>` : un futur quelconque, rangé dans une `Box` et pinné. On peut donc mettre des futures de types différents dans les mêmes champs.
2. `self.get_mut()` transforme le `Pin<&mut Course>` en un simple `&mut Course`. C'est permis parce que `Course` ne contient que des `Pin<Box<...>>`, qui sont `Unpin` (déplacer la `Box` ne déplace pas le futur qu'elle contient).
3. `this.a.as_mut().poll(cx)` interroge le futur rangé dans la `Box` (le même `as_mut()` que dans `block_on`), en lui passant le **même** contexte `cx`.
4. Tour 1 : la tortue répond `Pending` (2 restants), le lièvre aussi (0 restant). Tour 2 : la tortue `Pending`, le lièvre `Ready("lièvre")` : la course répond `Ready("lièvre")`.

> [!tip] Deux conditions d'un coup : `if ... && let`
> En édition 2024, on peut enchaîner une condition et un `if let` : `if resultat.is_none() && let Poll::Ready(v) = futur.as_mut().poll(cx) { ... }`. Le `poll` n'est fait **que** si la première condition est vraie : pratique pour ne pas réinterroger un futur déjà terminé.

**À retenir :** un combinateur écrit à la main = `self.get_mut()`, puis `champ.as_mut().poll(cx)` sur chaque futur ; un `join` garde les résultats dans des `Option` et n'interroge plus un futur fini.

## 9. Un exécuteur à plusieurs tâches

Une liste de futures « boxés » (`Pin<Box<dyn Future<Output = ()>>>`) interrogés à tour de rôle :

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

struct Tache {
    nom: &'static str,
    restant: u32,
}

impl Future for Tache {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<()> {
        if self.restant == 0 {
            println!("{} terminée", self.nom);
            return Poll::Ready(());
        }
        self.restant -= 1;
        println!("{} avance", self.nom);
        Poll::Pending
    }
}

fn main() {
    let mut taches: Vec<Pin<Box<dyn Future<Output = ()>>>> = vec![
        Box::pin(Tache { nom: "A", restant: 2 }),
        Box::pin(Tache { nom: "B", restant: 1 }),
    ];
    let mut contexte = Context::from_waker(Waker::noop());
    while !taches.is_empty() {
        taches.retain_mut(|t| t.as_mut().poll(&mut contexte).is_pending());
    }
}
```

On voit que A et B avancent en alternance, dans un seul fil. C'est ce que fait un vrai exécuteur, en plus malin.

**Les outils :**

- `retain_mut(|t| ...)` parcourt le `Vec` dans l'ordre et **garde** seulement les éléments pour lesquels la closure renvoie `true`. Il donne un `&mut` sur chaque élément : on peut donc appeler `poll` dessus.
- `.is_pending()` renvoie `true` pour `Pending` (la tâche n'a pas fini : on la garde) et `false` pour `Ready` (on la retire). Chaque tâche est donc interrogée une fois par tour, et jamais après son `Ready`.
- `while !taches.is_empty()` recommence un tour tant qu'il reste des tâches.

**Pas à pas :**

| Tour | A (restant) | B (restant) | Affichage | Tâches gardées |
|---|---|---|---|---|
| 1 | 2 → 1 | 1 → 0 | `A avance`, `B avance` | A, B |
| 2 | 1 → 0 | 0 : fini | `A avance`, `B terminée` | A |
| 3 | 0 : fini | | `A terminée` | aucune |

**À retenir :** un exécuteur tour à tour = `while` il reste des tâches, `retain_mut` qui fait un `poll` sur chacune et ne garde que celles encore `Pending`.

## 10. Aperçu de tokio (en texte seulement)

En vrai, on utilise une bibliothèque : **tokio** est la plus répandue. Elle fournit l'exécuteur, des minuteurs, du réseau et des fichiers asynchrones. Ce n'est pas dans la bibliothèque standard, donc **non exécutable ici**.

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

```text
#[tokio::main]
async fn main() {
    let (a, b) = tokio::join!(telecharger("a"), telecharger("b"));
    println!("{a} {b}");
}

async fn telecharger(nom: &str) -> String {
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    format!("{nom} reçu")
}
```

- `#[tokio::main]` crée l'exécuteur et lance `main` dedans.
- `tokio::join!` fait avancer plusieurs futures ensemble.
- `tokio::time::sleep` attend **sans bloquer** le fil (contrairement à `std::thread::sleep`).

**Pas à pas :** les deux `telecharger` attendent chacun 100 ms. Avec `tokio::join!`, les deux attentes se font **en même temps** : le programme met environ 100 ms. Avec `telecharger("a").await` puis `telecharger("b").await`, il mettrait environ 200 ms.

### Le runtime tokio

`#[tokio::main]` démarre un **runtime** : quelques threads « workers » (un par cœur) font avancer des milliers de tâches. Un worker sans travail **vole** des tâches aux autres (work stealing). Le runtime surveille aussi les entrées-sorties et les minuteurs, et réveille une tâche (`wake`) quand ce qu'elle attend est prêt.

```text
#[tokio::main]
async fn main() {
    let taches: Vec<_> = (0..10_000)
        .map(|i| tokio::spawn(async move { i * 2 }))
        .collect();
    let mut total = 0;
    for t in taches {
        total += t.await.unwrap();
    }
    println!("{total}");
}
```

- `tokio::spawn(futur)` ajoute **une tâche** dans une file, pas un thread : 10 000 tâches tiennent sur quelques threads.
- Le `JoinHandle` renvoyé s'attend avec `.await` et donne un `Result` (erreur si la tâche a paniqué).
- `tokio::task::JoinSet` regroupe plusieurs tâches et rend leurs résultats au fur et à mesure qu'elles finissent.

> [!warning] Ne bloque jamais un exécuteur
> Un calcul long ou un `std::thread::sleep` dans une tâche async fige le worker qui l'exécute, et toutes les tâches qui attendent ce worker prennent du retard.

**Exemple :** un worker fait avancer 1 000 tâches à tour de rôle. L'une d'elles appelle `std::thread::sleep(1 s)` : pendant cette seconde, le worker ne fait **rien d'autre**, et les 999 autres attendent. Avec `tokio::time::sleep(...).await`, la tâche répond `Pending` et le worker passe tout de suite aux autres ; le minuteur la réveillera dans une seconde.

### Sortir le calcul : `spawn_blocking`

Pour un calcul lourd (ou une lecture de fichier bloquante) dans un serveur async, on l'envoie dans un **pool de threads à part** avec `spawn_blocking`. Les workers restent libres pour les autres requêtes.

```text
let stats = tokio::task::spawn_blocking(move || {
    calculer_tout(&capteurs)
})
.await
.unwrap();
```

1. `spawn_blocking` reçoit une closure **normale** (pas `async`) et la lance sur un thread réservé aux travaux bloquants.
2. Il renvoie un `JoinHandle` qu'on attend avec `.await` : la tâche async se met en pause sans bloquer son worker.
3. `.unwrap()` sort le résultat du `Result` (erreur si le calcul a paniqué).

| Situation | Outil |
|---|---|
| Beaucoup d'attentes (réseau, base) | `async` + `.await`, `tokio::spawn` |
| Attendre plusieurs futurs ensemble | `tokio::join!` |
| Calcul lourd dans du code async | `spawn_blocking` (rayon peut tourner dedans) |
| Calcul lourd sans async | threads ou rayon |

**À retenir :** dans du code async, on attend avec `.await` (jamais `std::thread::sleep`), et un calcul lourd part dans `spawn_blocking`.

## 11. Pièges courants

- Oublier `.await` : le futur est créé mais jamais exécuté (le compilateur avertit).
- `.await` dans une fonction qui n'est pas `async` : erreur de compilation.
- Écrire `async fn main` sans `#[tokio::main]` : refusé, il faut un exécuteur.
- Interroger un futur après `Ready`.
- Croire que `async` = parallèle : sans plusieurs cœurs ni plusieurs fils, tout reste dans un seul fil.

## 12. À retenir

- `async fn` renvoie un **futur** paresseux ; `.await` attend son résultat.
- `Future::poll` renvoie `Poll::Ready(valeur)` ou `Poll::Pending`.
- Un **exécuteur** appelle `poll` en boucle ; la bibliothèque standard n'en fournit pas.
- `Pin` interdit de déplacer un futur ; `Context` / `Waker` servent à réveiller l'exécuteur.
- Threads : calcul en parallèle. Async : beaucoup d'attentes, peu de mémoire.
