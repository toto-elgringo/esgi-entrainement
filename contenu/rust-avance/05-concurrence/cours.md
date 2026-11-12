# Concurrence

## 1. Pourquoi des threads ?

Un **thread** est un fil d'exécution : une suite d'instructions qui tourne en même temps que d'autres. Avec plusieurs threads, un programme peut faire plusieurs choses à la fois (par exemple, utiliser tous les cœurs du processeur).

Le risque : deux threads qui touchent à la même donnée en même temps donnent des bugs très difficiles à reproduire. Rust utilise son système de propriété (ownership) pour transformer beaucoup de ces bugs en **erreurs de compilation**. C'est ce qu'on appelle la « concurrence sans peur ».

> [!info] Concurrence et parallélisme
> Concurrence : plusieurs tâches avancent chacune leur tour. Parallélisme : plusieurs tâches avancent vraiment en même temps. Les threads de Rust sont de vrais threads du système, donc les deux sont possibles.

## 2. Lancer un thread : `spawn` et `join`

`thread::spawn` prend une fonction (une closure) et la lance dans un nouveau thread. Elle renvoie un `JoinHandle`, sur lequel on appelle `join()` pour **attendre la fin** du thread et récupérer son résultat.

```rust
use std::thread;

let handle = thread::spawn(|| {
    let mut somme = 0;
    for i in 1..=100 {
        somme += i;
    }
    somme
});

let resultat = handle.join().unwrap();
println!("Somme : {resultat}");
```

`join()` renvoie un `Result` : c'est `Err` si le thread a paniqué.

> [!warning] Piège : ne pas attendre
> Quand `main` se termine, tous les threads encore en cours sont arrêtés d'un coup. Si tu oublies `join()`, le thread peut ne jamais finir son travail.

### L'ordre n'est pas garanti

Le système décide quand chaque thread s'exécute. Deux lancements du même programme peuvent se dérouler dans un ordre différent.

```rust
use std::thread;

let mut handles = Vec::new();
for numero in 0..3 {
    handles.push(thread::spawn(move || numero * 10));
}
for handle in handles {
    println!("Résultat : {}", handle.join().unwrap());
}
```

Ici, l'affichage est toujours dans le même ordre, car on fait `join` dans l'ordre du `Vec`. Les calculs, eux, ont pu se faire dans n'importe quel ordre.

> [!tip] Résultats déterministes
> Dans un test ou un exercice, ne compte jamais sur le temps (`sleep`) pour « laisser le temps » à un thread. Fais toujours `join`, et compare les résultats dans un ordre fixé (par exemple en triant).

## 3. `move` : donner des données au thread

Un thread peut vivre plus longtemps que la fonction qui l'a créé. Il ne peut donc pas emprunter une variable locale. Le mot-clé `move` **déplace** les variables utilisées dans la closure : le thread en devient propriétaire.

```rust
use std::thread;

let prenom = String::from("Alice");
let handle = thread::spawn(move || {
    println!("Bonjour {prenom}");
});
handle.join().unwrap();
```

Sans `move`, le compilateur refuse : il ne peut pas prouver que `prenom` existera encore quand le thread l'utilisera.

## 4. Threads à portée : `thread::scope`

Avec `thread::scope`, les threads sont **garantis terminés** à la sortie du bloc. Ils peuvent donc emprunter des variables locales, sans `move` ni copie.

```rust
use std::thread;

let nombres = vec![1, 2, 3, 4, 5, 6];
let (gauche, droite) = nombres.split_at(3);

let (a, b) = thread::scope(|s| {
    let t1 = s.spawn(|| gauche.iter().sum::<i32>());
    let t2 = s.spawn(|| droite.iter().sum::<i32>());
    (t1.join().unwrap(), t2.join().unwrap())
});

println!("{a} + {b} = {}", a + b);
```

> [!tip] À préférer quand c'est possible
> `thread::scope` évite de cloner les données ou d'utiliser `Arc`. Les threads que tu n'as pas `join` à la main sont attendus automatiquement à la fin du bloc.

## 5. Passer des messages : les canaux

Un **canal** (`mpsc::channel`) a deux bouts : un **émetteur** (`Sender`) et un **récepteur** (`Receiver`). `mpsc` veut dire « multiple producers, single consumer » : plusieurs producteurs, un seul consommateur.

```rust
use std::sync::mpsc;
use std::thread;

let (tx, rx) = mpsc::channel();

thread::spawn(move || {
    tx.send(String::from("coucou")).unwrap();
});

let message = rx.recv().unwrap();
println!("Reçu : {message}");
```

- `send` envoie une valeur (elle est **déplacée** : l'émetteur ne peut plus l'utiliser).
- `recv` attend un message ; il renvoie `Err` quand tous les émetteurs ont disparu et que le canal est vide.
- `rx.iter()` (ou `for m in rx`) lit les messages jusqu'à la fermeture du canal.

### Plusieurs producteurs

On **clone** l'émetteur pour chaque thread.

```rust
use std::sync::mpsc;
use std::thread;

let (tx, rx) = mpsc::channel();

for id in 0..3 {
    let tx = tx.clone();
    thread::spawn(move || {
        tx.send(id * 10).unwrap();
    });
}
drop(tx);

let mut recus: Vec<i32> = rx.iter().collect();
recus.sort();
println!("{recus:?}");
```

> [!warning] Piège : oublier `drop(tx)`
> Le canal ne se ferme que quand **tous** les émetteurs sont détruits, y compris celui gardé dans le thread principal. Sans `drop(tx)`, `rx.iter()` attend pour toujours et le programme reste bloqué.

> [!tip] L'ordre d'arrivée varie
> Les messages arrivent dans l'ordre où les threads les envoient, donc dans un ordre qui change d'une exécution à l'autre. On trie avant de comparer.

## 6. Partager un état : `Mutex` et `Arc`

Un **`Mutex`** (exclusion mutuelle) protège une donnée : un seul thread à la fois peut y accéder. On appelle `lock()` pour obtenir l'accès ; il renvoie un « garde » qui libère le verrou **quand il est détruit** (à la fin de son bloc).

```rust
use std::sync::Mutex;

let compteur = Mutex::new(0);
{
    let mut valeur = compteur.lock().unwrap();
    *valeur += 1;
}
println!("{:?}", compteur);
```

Pour partager le `Mutex` entre plusieurs threads, il faut qu'ils en soient tous propriétaires. Un `Rc` ne convient pas (il n'est pas sûr entre threads). On utilise **`Arc`** (Atomic Reference Counted) : un pointeur partagé dont le compteur de références est atomique.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

let compteur = Arc::new(Mutex::new(0));
let mut handles = Vec::new();

for _ in 0..4 {
    let compteur = Arc::clone(&compteur);
    handles.push(thread::spawn(move || {
        for _ in 0..1000 {
            *compteur.lock().unwrap() += 1;
        }
    }));
}

for handle in handles {
    handle.join().unwrap();
}

println!("Total : {}", *compteur.lock().unwrap());
```

Le résultat est toujours 4000 : chaque `+= 1` se fait sous verrou.

> [!info] `Arc<Mutex<T>>`
> C'est le duo classique : `Arc` pour **partager** la propriété, `Mutex` pour **modifier** sans conflit. `Arc::clone` ne copie pas la donnée, il ajoute juste un propriétaire.

> [!warning] Verrou tenu trop longtemps
> Le garde garde le verrou tant qu'il existe. Ne fais pas de calcul long (ni d'attente) avec un verrou pris : les autres threads sont bloqués. Ouvre un petit bloc `{ ... }` pour le relâcher vite.

### Empoisonnement

Si un thread panique alors qu'il tient un verrou, le `Mutex` est **empoisonné** : les `lock()` suivants renvoient `Err`. C'est pour cela qu'on écrit `lock().unwrap()`.

## 7. `RwLock` : beaucoup de lecteurs, un seul écrivain

Un `RwLock` autorise **plusieurs lecteurs en même temps** (`read()`), ou **un seul écrivain** (`write()`) qui est alors seul.

```rust
use std::sync::RwLock;

let config = RwLock::new(String::from("v1"));

{
    let a = config.read().unwrap();
    let b = config.read().unwrap();
    println!("{a} {b}");
}

*config.write().unwrap() = String::from("v2");
println!("{}", config.read().unwrap());
```

C'est utile quand on lit souvent et qu'on écrit rarement.

## 8. Les atomiques

Pour un simple nombre ou booléen, un `Mutex` est trop lourd. Les types **atomiques** (`AtomicUsize`, `AtomicBool`...) font des opérations indivisibles, sans verrou.

```rust
use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;

let total = AtomicUsize::new(0);

thread::scope(|s| {
    for _ in 0..4 {
        s.spawn(|| {
            for _ in 0..1000 {
                total.fetch_add(1, Ordering::Relaxed);
            }
        });
    }
});

println!("{}", total.load(Ordering::Relaxed));
```

`Ordering` règle les garanties d'ordre entre threads. Pour un simple compteur, `Relaxed` suffit. Quand on hésite, `SeqCst` est le plus strict et le plus sûr.

> [!warning] Piège : lire puis écrire
> `let v = x.load(..); x.store(v + 1, ..);` n'est **pas** atomique : un autre thread peut passer entre les deux. Utilise `fetch_add`, qui fait tout en une seule opération.

## 9. `Send` et `Sync`

Ce sont deux traits « marqueurs » (sans méthode) que le compilateur vérifie tout seul :

| Trait | Sens |
|---|---|
| `Send` | La valeur peut être **envoyée** à un autre thread (on lui en donne la propriété). |
| `Sync` | On peut partager une **référence** `&T` entre threads. |

- `i32`, `String`, `Vec<T>`, `Arc<Mutex<T>>` sont `Send` (et `Sync` pour la plupart).
- `Rc<T>` n'est ni `Send` ni `Sync` : son compteur n'est pas atomique. `thread::spawn` refuse donc un `Rc` : erreur de compilation.
- `Mutex<T>` est `Sync` si `T` est `Send` : c'est ce qui permet de le partager.
- `Cell` et `RefCell` ne sont pas `Sync`.

> [!tip] Le compilateur fait le travail
> Tu écris rarement `Send` ou `Sync` toi-même. Un type les reçoit automatiquement si tous ses champs les ont. Si tu vois « cannot be sent between threads safely », remplace `Rc` par `Arc` (et `RefCell` par `Mutex`).

## 10. L'interblocage (deadlock)

Un **interblocage** arrive quand des threads s'attendent les uns les autres pour toujours. Exemple : le thread A tient le verrou 1 et veut le 2, pendant que le thread B tient le 2 et veut le 1. Personne ne peut avancer, et le programme gèle.

Un seul thread peut aussi se bloquer lui-même : prendre deux fois le même `Mutex` sans avoir relâché le premier garde.

```rust
use std::sync::Mutex;

let m = Mutex::new(1);
let premier = m.lock().unwrap();
println!("premier = {premier}");
drop(premier);
let second = m.lock().unwrap();
println!("second = {second}");
```

Sans le `drop(premier)`, le deuxième `lock()` attendrait indéfiniment.

> [!tip] Éviter les interblocages
> - Prends toujours les verrous **dans le même ordre** (par exemple par numéro croissant).
> - Garde les verrous le moins longtemps possible.
> - Évite d'appeler du code inconnu pendant qu'un verrou est pris.
> - Si possible, préfère les canaux ou les atomiques.

## 11. Choisir son outil

| Besoin | Outil |
|---|---|
| Faire un calcul à part et récupérer le résultat | `spawn` + `join` |
| Utiliser des variables locales dans des threads | `thread::scope` |
| Envoyer des résultats d'un ou plusieurs threads | `mpsc::channel` |
| Modifier une donnée partagée | `Arc<Mutex<T>>` |
| Beaucoup de lectures, peu d'écritures | `Arc<RwLock<T>>` |
| Un compteur ou un drapeau | `AtomicUsize`, `AtomicBool` |

## 12. Écrire du code concurrent testable

- **Toujours `join`** tous les threads avant de lire le résultat.
- **Jamais de `sleep`** pour synchroniser : le résultat doit être juste quelle que soit la vitesse des threads.
- **Trier ou agréger** les résultats dont l'ordre varie.
- **Ne pas afficher depuis plusieurs threads** si l'ordre compte : renvoie les résultats, puis affiche dans le thread principal.
