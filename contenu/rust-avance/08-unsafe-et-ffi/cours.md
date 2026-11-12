# Unsafe et FFI

## 1. Pourquoi `unsafe` existe

Le compilateur Rust vérifie beaucoup de choses : propriété, emprunts, types. Mais certaines opérations sont **impossibles à vérifier** automatiquement (parler à du code C, manipuler la mémoire à la main...). Pour ça, Rust propose le mot-clé `unsafe`.

> [!info] Ce que `unsafe` ne fait PAS
> Il ne désactive ni le vérificateur d'emprunts, ni les types. Il débloque seulement **5 opérations**. Le reste du code dans le bloc reste vérifié normalement.

Quand tu écris `unsafe`, tu dis au compilateur : « Je te promets que c'est correct, c'est moi qui vérifie. »

## 2. Les 5 super-pouvoirs

Dans un bloc `unsafe`, tu peux :

1. **Déréférencer** un pointeur brut (lire ou écrire à travers lui).
2. **Appeler** une fonction ou une méthode `unsafe`.
3. **Lire ou modifier** un `static mut` (variable globale modifiable).
4. **Implémenter** un trait `unsafe`.
5. **Lire un champ** d'une `union`.

Hors de ces cinq cas, `unsafe` ne sert à rien.

## 3. Les pointeurs bruts

Un **pointeur brut** est une adresse mémoire sans aucune garantie. Il existe en deux versions : `*const T` (lecture) et `*mut T` (écriture).

```rust
let mut x = 10;
let p1 = &x as *const i32;
let p2 = &mut x as *mut i32;

println!("p1 est nul ? {}", p1.is_null());

// SAFETY: p2 vient de x, qui est encore en vie et n'est pas emprunté ailleurs
unsafe {
    *p2 += 5;
}
println!("x vaut {}", x);
```

Créer un pointeur est **sûr**. Le lire ou l'écrire demande `unsafe`.

Différences avec une référence :

| | Référence `&T` | Pointeur brut `*const T` |
|---|---|---|
| Peut être nul | non | oui |
| Garanti valide | oui | non |
| Règles d'emprunt | oui | non |
| Déréférencement | libre | `unsafe` |

> [!warning] Pièges classiques
> - Un pointeur **nul** : le lire plante le programme.
> - Un pointeur **périmé** (la donnée a été libérée) : comportement indéfini.
> - Deux `*mut` sur la même donnée : rien ne t'empêche de les utiliser en même temps.

Le **comportement indéfini** (UB) veut dire que tout peut arriver : plantage, résultat faux, ou programme qui « marche » par hasard. C'est la pire situation en Rust.

## 4. Le commentaire `// SAFETY:`

Par convention, chaque bloc `unsafe` est précédé d'un commentaire qui explique **pourquoi** il est correct.

```rust
let v = vec![1, 2, 3];
let p = v.as_ptr();

// SAFETY: v a 3 éléments, donc l'indice 2 est valide, et v vit jusqu'à la fin
let dernier = unsafe { *p.add(2) };
println!("{}", dernier);
```

Bonnes habitudes :

- Blocs `unsafe` **les plus petits possible**.
- Un commentaire `SAFETY` à chaque bloc.
- Ne jamais en mettre « pour faire taire le compilateur ».

## 5. Fonctions `unsafe`

Une fonction peut elle-même être `unsafe` : cela veut dire que **l'appelant** doit respecter des conditions que le compilateur ne voit pas.

```rust
unsafe fn lire(p: *const i32) -> i32 {
    // SAFETY: l'appelant garantit que p est valide
    unsafe { *p }
}

fn main() {
    let x = 7;
    // SAFETY: &x est une adresse valide
    let v = unsafe { lire(&x) };
    println!("{}", v);
}
```

> [!info] Édition 2024
> Dans une `unsafe fn`, il faut quand même écrire un bloc `unsafe` autour des opérations dangereuses (sinon avertissement `unsafe_op_in_unsafe_fn`). Ainsi chaque opération risquée reste bien visible.

## 6. `static mut` et traits `unsafe`

Une variable globale modifiable est dangereuse : deux threads pourraient la modifier en même temps (**course de données**).

```rust
static mut COMPTEUR: u32 = 0;

fn incrementer() -> u32 {
    // SAFETY: un seul thread utilise COMPTEUR dans ce programme
    unsafe {
        COMPTEUR += 1;
        COMPTEUR
    }
}

fn main() {
    incrementer();
    println!("{}", incrementer());
}
```

> [!tip] À préférer
> Presque toujours, il vaut mieux utiliser `AtomicU32`, `Mutex` ou `OnceLock`, qui sont sûrs. `static mut` est un dernier recours (et prendre une *référence* vers un `static mut` est même refusé en édition 2024).

Un **trait `unsafe`** est un trait dont l'implémentation doit respecter une règle que le compilateur ne peut pas vérifier. L'exemple connu : `Send` et `Sync` (sécurité entre threads).

```rust
unsafe trait SansPointeur {}

unsafe impl SansPointeur for u32 {}
unsafe impl SansPointeur for bool {}

fn afficher<T: SansPointeur + std::fmt::Debug>(v: T) {
    println!("{:?}", v);
}

fn main() {
    afficher(5u32);
    afficher(true);
}
```

## 7. Les unions

Une **union** range plusieurs champs **au même endroit** de la mémoire. Lire un champ revient à réinterpréter les mêmes octets : c'est `unsafe`.

```rust
union Nombre {
    entier: u32,
    flottant: f32,
}

fn main() {
    let n = Nombre { flottant: 1.0 };
    // SAFETY: u32 et f32 font 4 octets et toute valeur est valide pour les deux
    let bits = unsafe { n.entier };
    println!("{:#x}", bits);
}
```

Les unions servent surtout pour parler à du code C.

## 8. Envelopper `unsafe` dans une API sûre

L'idée la plus importante du chapitre : on cache l'`unsafe` **à l'intérieur** d'une fonction dont l'interface est sûre. Les utilisateurs n'ont plus rien à vérifier.

Exemple : `split_at_mut` coupe un tableau en deux morceaux modifiables. Le compilateur refuse deux `&mut` sur le même tableau, même s'ils ne se touchent pas. On le fait donc à la main :

```rust
use std::slice;

fn couper_en_deux(t: &mut [i32], milieu: usize) -> (&mut [i32], &mut [i32]) {
    let longueur = t.len();
    let p = t.as_mut_ptr();
    assert!(milieu <= longueur);

    // SAFETY: les deux morceaux ne se chevauchent pas et restent dans t
    unsafe {
        (
            slice::from_raw_parts_mut(p, milieu),
            slice::from_raw_parts_mut(p.add(milieu), longueur - milieu),
        )
    }
}

fn main() {
    let mut t = [1, 2, 3, 4, 5];
    let (a, b) = couper_en_deux(&mut t, 2);
    a[0] = 10;
    b[0] = 30;
    println!("{:?}", t);
}
```

Le `assert!` est la vérification qui rend l'API sûre : avec un `milieu` trop grand, on panique au lieu de lire n'importe où.

## 9. FFI : appeler du C depuis Rust

**FFI** (*Foreign Function Interface*) = appeler du code écrit dans un autre langage. L'**ABI C** est la « langue commune » des langages : Rust, Python, Go... savent tous la parler.

On déclare les fonctions C dans un bloc `unsafe extern "C"` :

```rust
use std::ffi::c_int;

unsafe extern "C" {
    safe fn abs(x: c_int) -> c_int;
    fn labs(x: i64) -> i64;
}

fn main() {
    println!("{}", abs(-42));
    // SAFETY: labs accepte tout entier
    println!("{}", unsafe { labs(-7) });
}
```

- `safe fn` : tu promets qu'aucun argument ne cause de comportement indéfini, donc on peut l'appeler sans `unsafe`.
- Sans `safe` : l'appel demande `unsafe`.

> [!warning] Édition 2024
> `extern "C" { ... }` seul ne compile plus : il faut `unsafe extern "C" { ... }`.

Pour les textes, C attend une suite d'octets finie par `\0`. On utilise `std::ffi::CString` (texte possédé) et `CStr` (texte emprunté) :

```rust
use std::ffi::{CString, c_char};

unsafe extern "C" {
    fn strlen(s: *const c_char) -> usize;
}

fn main() {
    let texte = CString::new("bonjour").expect("pas de zéro dedans");
    // SAFETY: texte est terminé par un zéro et reste en vie pendant l'appel
    let n = unsafe { strlen(texte.as_ptr()) };
    println!("{}", n);
}
```

Dans l'autre sens, `CStr::from_ptr` lit un texte C reçu :

```rust
use std::ffi::{CStr, CString};

fn main() {
    let c = CString::new("salut").expect("pas de zéro dedans");
    let p = c.as_ptr();
    // SAFETY: p pointe sur un texte C valide, vivant et terminé par zéro
    let lu = unsafe { CStr::from_ptr(p) };
    println!("{}", lu.to_string_lossy());
}
```

> [!warning] Piège : durée de vie
> `CString::new("a").unwrap().as_ptr()` sur une seule ligne est **faux** : le `CString` est détruit tout de suite et le pointeur devient périmé. Garde toujours le `CString` dans une variable.

## 10. FFI : exposer du Rust à C

Dans l'autre sens, on écrit une fonction Rust que C peut appeler :

```rust
#[unsafe(no_mangle)]
pub extern "C" fn additionner(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    println!("{}", additionner(2, 3));
}
```

- `extern "C"` : la fonction suit les règles d'appel de C.
- `#[unsafe(no_mangle)]` : le nom reste `additionner` dans le binaire (sinon le compilateur le transforme). C'est `unsafe` car deux fonctions du même nom feraient des conflits.
- `pub` : visible depuis l'extérieur.

Pour échanger des structures, on impose la disposition mémoire de C avec `#[repr(C)]` :

```rust
#[repr(C)]
struct Point {
    x: i32,
    y: i32,
}

#[unsafe(no_mangle)]
pub extern "C" fn distance_carree(p: Point) -> i32 {
    p.x * p.x + p.y * p.y
}

fn main() {
    println!("{}", std::mem::size_of::<Point>());
    println!("{}", distance_carree(Point { x: 3, y: 4 }));
}
```

Sans `#[repr(C)]`, Rust a le droit de réordonner les champs : C ne les retrouverait pas.

Pour fabriquer une bibliothèque utilisable par C, on met dans `Cargo.toml` : `crate-type = ["cdylib"]`.

## 11. Aperçu : Rust dans Python avec PyO3

**PyO3** est une bibliothèque (crate) qui permet d'écrire des modules Python en Rust, par exemple pour accélérer un calcul. **maturin** compile le projet et l'installe dans Python.

```text
#[pyfunction]  : expose une fonction à Python
#[pymodule]    : un module Rust devient un module Python
Vec<f64>       : une liste Python de flottants arrive directement
```

```text
use pyo3::prelude::*;

#[pymodule]
mod metriques {
    use pyo3::prelude::*;

    #[pyfunction]
    fn somme(valeurs: Vec<f64>) -> f64 {
        valeurs.iter().sum()
    }
}
```

```text
python -m venv .venv
pip install maturin
maturin init -b pyo3 --name metriques
maturin develop
python -c "import metriques; print(metriques.somme([1.0, 2.5]))"
```

`maturin develop` compile et installe dans l'environnement virtuel actif : la première fois c'est lent, ensuite quelques secondes.

> [!info] Alternative simple
> Sans PyO3, une fonction `extern "C"` compilée en `cdylib` peut être appelée depuis Python avec le module `ctypes`.

## 12. À retenir

- `unsafe` = 5 pouvoirs, pas de vérifications désactivées.
- Un pointeur brut se crée librement, se déréférence dans `unsafe`.
- Petit bloc `unsafe` + commentaire `// SAFETY:` + API sûre autour.
- Appeler C : `unsafe extern "C" { ... }`, `CString` pour les textes.
- Exposer à C : `#[unsafe(no_mangle)] pub extern "C" fn`, et `#[repr(C)]` pour les structures.
- Python : PyO3 + maturin.
