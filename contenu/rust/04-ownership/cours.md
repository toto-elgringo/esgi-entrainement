# Ownership (la propriété)

> [!info] Le chapitre le plus important
> L'ownership est le cœur de Rust. C'est ce qui évite les bugs de mémoire **sans ramasse-miettes** (un programme qui nettoie la mémoire en arrière-plan, comme en Java ou en Python). Une fois compris, tout le reste devient plus facile.

## 1. Binding et portée

```rust
let x = 42;        // x est un binding : le nom x est lié à la valeur 42
let mut y = 42;    // y peut changer de valeur
```

Un **binding** lie un **nom** à une **valeur**. Ce lien peut être **transféré** (*move*), **prêté** (*borrow*) ou **rompu** (*drop*).

La **portée** (*scope*) d'une variable, c'est la zone où elle existe : la fonction, le bloc `{ }`, la boucle ou le bras de `match` où elle a été créée.

```rust
fn main() {
    {
        let y = 20;
        println!("{y}");   // ok
    }
    // println!("{y}");   // error[E0425]: cannot find value `y` in this scope
    for z in 1..5 {
        println!("{z}");
    }
    // z n'existe plus ici
}
```

## 2. Drop et RAII

À la fin de sa portée, une valeur est **détruite** (*drop*) : sa mémoire est rendue automatiquement. Les variables d'un même bloc sont détruites dans l'**ordre inverse** de leur création.

```rust
let _a = Bruyant::new("A");
let _b = Bruyant::new("B");
let _c = Bruyant::new("C");
// à la fin du bloc : drop C, puis drop B, puis drop A
```

Pourquoi à l'envers ? Une variable peut dépendre d'une variable créée **avant** elle, jamais après : on détruit donc d'abord les plus récentes.

On peut observer la destruction en écrivant `impl Drop for MonType { fn drop(&mut self) { ... } }`.

> [!tip] RAII
> *Resource Acquisition Is Initialization* : la vie d'une ressource (mémoire, fichier, connexion) est la vie de la valeur. Rien à écrire pour libérer (`free`, `close`...), et la libération arrive à un **moment prévisible**.

```rust
let gros = vec![0u8; 10_000_000];
traiter(&gros);
drop(gros);           // libéré tout de suite, sans attendre la fin du bloc
```

> [!warning] `_x` contre `_`
> `let _x = valeur;` garde la valeur jusqu'à la fin du bloc. `let _ = valeur;` la **détruit immédiatement** : `_` n'est pas un nom, c'est un motif qui jette la valeur.

## 3. Le masquage (shadowing)

```rust
let x = 42;
{
    let x = 51;
    println!("{x}");    // 51
}
println!("{x}");        // 42 : l'ancien x revient
let x = 66;             // nouveau binding qui masque l'ancien
```

Un deuxième `let x` n'est **pas** une modification : c'est une **nouvelle** variable qui cache l'ancienne. Elle peut même avoir un **autre type** :

```rust
let saisie = "42";                          // &str
let saisie: u32 = saisie.parse().unwrap();  // u32
```

## 4. Les trois règles de l'ownership

1. Une valeur n'a qu'**un seul propriétaire** à la fois.
2. On peut l'emprunter en lecture (`&`) **autant de fois** qu'on veut...
3. ... **ou** l'emprunter en écriture (`&mut`) **une seule fois**, jamais en même temps qu'une lecture.

| Règle | Bug évité |
|---|---|
| un seul propriétaire | libérer deux fois la même mémoire, ou l'oublier |
| le propriétaire libère en disparaissant | fichier jamais fermé, fuite de mémoire |
| plusieurs lecteurs **ou** un seul écrivain | données modifiées pendant qu'on les lit |

C'est vérifié **à la compilation** : ça ne coûte rien pendant l'exécution.

## 5. Le déplacement (move)

```rust
fn changer(mut s: String) {
    s.push('!');
}

let s = String::from("Coco");
changer(s);           // la String est DÉPLACÉE dans la fonction
println!("{s}");      // error[E0382]: borrow of moved value: `s`
```

Passer une `String` à une fonction la **déplace** : la fonction en devient propriétaire, et la détruit à sa fin. Utiliser `s` ensuite reviendrait à lire de la mémoire libérée : Rust refuse.

Deux corrections :

```rust
// 1. Rendre la valeur
fn changer(mut s: String) -> String {
    s.push('!');
    s
}
let s = changer(s);

// 2. Emprunter (le plus courant)
fn changer(s: &mut String) {
    s.push('!');
}
let mut s = String::from("Coco");
changer(&mut s);
```

> [!tip] Lequel choisir ?
> La fonction modifie la valeur et rend la main : `&mut`. Elle a juste besoin de lire : `&`. Elle « consomme » la valeur pour en produire une autre : par valeur.

## 6. Copy et Clone

```rust
let a = 5;
let b = a;
println!("{a} {b}");   // ok : les entiers sont Copy
```

- Les types **`Copy`** sont copiés automatiquement, l'original reste utilisable : entiers, flottants, `bool`, `char`, et les tuples ou tableaux de ces types.
- Un type ne peut être `Copy` que s'il n'a **rien à libérer**. `String`, `Vec<T>`, `Box<T>` ne le sont pas.
- On rend son propre type `Copy` avec `#[derive(Clone, Copy)]`.
- **`.clone()`** fait une vraie copie (y compris ce qui est sur le tas). C'est explicite, et ça coûte.

> [!warning] Le `.clone()` réflexe
> Ajouter `.clone()` juste pour faire taire le compilateur est un signal d'alarme : demande-toi plutôt **qui doit posséder quoi**, et si un emprunt ne suffit pas.

## 7. Les emprunts

```rust
let s = String::from("Hey");
let r1 = &s;
let r2 = &s;
println!("{r1} {r2}");           // deux lecteurs : ok

let mut s = String::from("Hello");
let r = &mut s;
r.push_str(" World");           // un seul écrivain : ok
```

- `&x` : référence en **lecture**. `&mut x` : référence en **écriture** (il faut `let mut x`).
- `*r` : lit (ou modifie) la valeur derrière la référence.
- Une fonction qui veut seulement lire prend une référence : `&str` plutôt que `String`, `&[i32]` plutôt que `Vec<i32>`.

### Un emprunt meurt à sa dernière utilisation

```rust
let mut v = vec![1, 2, 3];
let premier = &v[0];
println!("{premier}");   // dernière utilisation de premier
v.push(4);               // ok : plus aucun lecteur
```

Depuis 2018, l'emprunt ne dure pas jusqu'à la fin du bloc, mais jusqu'à sa **dernière utilisation** (*non-lexical lifetimes*). Beaucoup de vieux tutoriels sont faux sur ce point.

### Modifier ce qu'on parcourt

```rust
for x in &v {
    if *x == 2 {
        v.push(4);   // error[E0502]
    }
}
```

`push` peut agrandir la liste et la **déplacer** en mémoire : la boucle lirait une zone libérée. En C++ c'est un bug silencieux, en Java une erreur à l'exécution, en Rust une **erreur de compilation**.

## 8. Les erreurs à connaître

| Code | Message | Traduction |
|---|---|---|
| E0382 | borrow of moved value | tu as donné la valeur, puis tu l'utilises encore |
| E0499 | cannot borrow as mutable more than once | deux `&mut` vivants en même temps |
| E0502 | cannot borrow as mutable because it is also borrowed as immutable | tu écris pendant que quelqu'un lit |
| E0384 | cannot assign twice to immutable variable | il manque `mut` |
| E0106 | missing lifetime specifier | Rust ne sait pas combien de temps la référence renvoyée doit vivre |

## 9. `String` ou `Vec<char>` ?

| | `String` | `Vec<char>` |
|---|---|---|
| un `a` | 1 octet | 4 octets |
| un `🦀` | 4 octets | 4 octets |
| n-ième caractère | lent (il faut tout lire depuis le début) | immédiat |

- `String` pour **stocker, transmettre, écrire** du texte.
- `Vec<char>` pour **manipuler** les caractères un par un par leur position.

## À retenir

- Fin de portée = `drop` automatique, dans l'ordre **inverse**. C'est le RAII.
- Un deuxième `let x` = **masquage** (nouvelle variable, type possiblement différent).
- **Un** propriétaire ; `&` autant qu'on veut **ou** un seul `&mut`.
- Passer une valeur = **move** (sauf types `Copy`). `.clone()` copie vraiment.
- Pour lire : prendre une référence (`&str`, `&[T]`, `&T`).
- Un emprunt s'arrête à sa **dernière utilisation**.
- E0382 (move), E0499 (deux `&mut`), E0502 (lecture + écriture).
