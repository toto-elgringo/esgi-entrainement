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

## 2. `async fn` et `.await`

Une fonction `async` ne s'exécute **pas** quand on l'appelle. Elle renvoie une valeur appelée **future** (« un résultat à venir »).

```rust
async fn addition(a: u32, b: u32) -> u32 {
    a + b
}

fn main() {
    let futur = addition(2, 3);
    println!("rien n'a encore été calculé");
    let _ = futur;
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
```

`.await` veut dire : « je suis prêt à me mettre en pause jusqu'à ce que ce futur ait fini ».

> [!warning] Les futures sont paresseuses
> Appeler une `async fn` sans `.await` (ni exécuteur) ne fait **rien**. Le code de la fonction ne démarre jamais. C'est le piège numéro 1.

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

### Pin et Context, simplement

- **`Pin<&mut Self>`** : une référence mutable qui promet que le futur **ne sera pas déplacé** en mémoire. Un futur écrit par le compilateur peut contenir des références vers lui-même, donc le déplacer casserait tout. Pour les types simples (nombres, `String`…), `Pin` ne gêne pas : on s'en sert presque comme d'un `&mut Self`.
- **`Context`** : contient un **waker**, une sorte de sonnette. Un futur en attente la fait sonner (`cx.waker().wake_by_ref()`) pour dire à l'exécuteur : « rappelle-moi, je peux avancer ».

## 4. Pourquoi un exécuteur ?

Un futur ne bouge pas tout seul : quelqu'un doit appeler `poll`, encore et encore. Ce quelqu'un s'appelle un **exécuteur** (ou *runtime*).

`fn main` ne peut pas être `async` en Rust standard : la bibliothèque standard **ne fournit pas d'exécuteur**. On utilise une bibliothèque (tokio, smol…) ou on écrit le sien.

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

> [!tip] Exécuteur d'apprentissage
> Ce `block_on` « occupé » tourne à fond tant que le futur est `Pending`. C'est parfait pour apprendre et tester, mais un vrai exécuteur dort jusqu'à ce que le waker sonne.

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

> [!warning] Ne pas appeler `poll` après `Ready`
> Un futur terminé peut paniquer s'il est interrogé de nouveau. Un exécuteur doit arrêter de le poller dès `Ready`.

## 7. Ce que fait `async` en coulisses

Le compilateur transforme chaque `async fn` en une **machine à états** : un `enum` caché avec un état par `.await`. Chaque `poll` fait avancer jusqu'au prochain `.await` qui répond `Pending`, puis rend la main.

C'est pourquoi une tâche async coûte si peu : ce n'est qu'un petit objet, pas un fil du système.

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

**En même temps** (« concurrent ») : il faut un `join`. Il interroge chaque futur à tour de rôle et attend qu'ils soient tous finis. La bibliothèque standard n'en fournit pas (tokio et la crate `futures` ont `join!` et `select!`). Tu en écriras un dans les exercices.

> [!warning] Séquence n'est pas concurrence
> `a().await; b().await;` lance `b` **après** la fin de `a`. Pour les faire avancer ensemble, il faut un `join`.

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

> [!warning] Ne bloque jamais un exécuteur
> Un calcul long ou un `std::thread::sleep` dans une tâche async fige toutes les autres tâches du même fil. Pour du calcul lourd, utilise un vrai thread.

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
