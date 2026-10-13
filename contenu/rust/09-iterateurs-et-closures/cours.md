# Itérateurs et closures

## 1. Les closures : des fonctions sans nom

Une **closure** est une petite fonction écrite directement là où on en a besoin, souvent sur une seule ligne. On la range dans une variable ou on la donne à une autre fonction.

```rust
let double = |x| x * 2;                 // paramètre entre | |, puis le résultat
let addition = |a: i32, b: i32| a + b;  // types facultatifs
let saluer = || println!("Salut !");    // sans paramètre
let complexe = |x: i32| {               // plusieurs lignes : un bloc { }
    let y = x + 1;
    y * y
};

println!("{}", double(21));             // 42
```

| Fonction classique | Closure équivalente |
|---|---|
| `fn double(x: i32) -> i32 { x * 2 }` | `\|x\| x * 2` |

### La capture : utiliser les variables autour

Contrairement à une fonction `fn`, une closure peut **utiliser les variables** de l'endroit où elle est écrite. On dit qu'elle les **capture**.

```rust
let seuil = 10;
let est_grand = |x| x > seuil;   // utilise seuil
println!("{}", est_grand(15));   // true
```

Une closure capture de la façon la plus légère possible :

| Ce que fait la closure | Capture | Nom du trait |
|---|---|---|
| lit la variable | par référence `&` | `Fn` |
| modifie la variable | par référence modifiable `&mut` | `FnMut` |
| prend la variable (avec `move`) | par valeur (déplacement) | `FnOnce` |

```rust
let mut compteur = 0;
let mut incrementer = || compteur += 1;   // la closure doit être mut
incrementer();
incrementer();
println!("{compteur}");                   // 2
```

> [!tip] `move`
> `move |x| ...` force la closure à **prendre possession** des variables qu'elle utilise. Indispensable quand la closure doit vivre plus longtemps que la fonction qui la crée (la renvoyer, la donner à un thread).

### Recevoir une closure en paramètre

```rust
fn appliquer(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(x)
}
appliquer(|n| n + 1, 5);   // 6
```

`impl Fn(i32) -> i32` veut dire « n'importe quelle closure qui prend un `i32` et renvoie un `i32` ». Les traits et `impl` sont détaillés au chapitre suivant.

## 2. Les itérateurs

Un **itérateur** est un objet qui donne les éléments d'une collection **un par un**. La boucle `for` utilise un itérateur en coulisses.

Trois façons d'en obtenir un sur un `Vec` :

| Méthode | Donne | La liste après |
|---|---|---|
| `v.iter()` | `&T` (lecture) | intacte |
| `v.iter_mut()` | `&mut T` (modification) | modifiée |
| `v.into_iter()` | `T` (les valeurs elles-mêmes) | **consommée**, plus utilisable |

### Adaptateurs : transformer

Un **adaptateur** prend un itérateur et en renvoie un autre.

```rust
let v = vec![1, 2, 3, 4, 5];

v.iter().map(|x| x * 10)           // 10, 20, 30, 40, 50
v.iter().filter(|x| **x > 2)       // 3, 4, 5
v.iter().enumerate()               // (0, 1), (1, 2), (2, 3)...  (indice, valeur)
v.iter().zip(autre.iter())         // (v[0], autre[0]), (v[1], autre[1])...
v.iter().rev()                     // à l'envers
v.iter().skip(1).take(2)           // saute 1, garde 2 : 2, 3
```

> [!warning] Les itérateurs sont paresseux
> `v.iter().map(|x| x * 10);` ne calcule **rien** : un adaptateur attend qu'on consomme le résultat. Le compilateur le signale (« iterators are lazy and do nothing unless consumed »).

### Consommateurs : obtenir un résultat

| Méthode | Résultat |
|---|---|
| `.sum()` | la somme |
| `.count()` | le nombre d'éléments |
| `.collect()` | une collection (`Vec`, `String`, `HashMap`...) |
| `.min()` / `.max()` | `Option` du plus petit / plus grand |
| `.any(\|x\| ...)` | `true` si **au moins un** élément vérifie la condition |
| `.all(\|x\| ...)` | `true` si **tous** vérifient la condition |
| `.find(\|x\| ...)` | `Option` du premier élément qui vérifie la condition |
| `.position(\|x\| ...)` | `Option` de l'indice de ce premier élément |
| `.fold(depart, \|acc, x\| ...)` | une valeur construite pas à pas |

```rust
let v = vec![1, 2, 3, 4];
let total: i32 = v.iter().sum();                        // 10
let pairs: Vec<i32> = v.iter().filter(|x| **x % 2 == 0).copied().collect();   // [2, 4]
let produit = v.iter().fold(1, |acc, x| acc * x);       // 24
```

> [!tip] Indiquer le type pour `collect` et `sum`
> Ces méthodes peuvent produire plusieurs types. On l'indique sur la variable (`let total: i32 = ...`) ou avec le **turbofish** `::<>` : `v.iter().sum::<i32>()`.

### Références de références

`v.iter()` donne des `&i32`. `filter` reçoit une référence vers l'élément, donc un `&&i32` : d'où les `**x`. Deux astuces pour simplifier :

```rust
v.iter().filter(|&&x| x > 2)           // déstructurer les références
v.iter().copied().filter(|x| *x > 2)   // copied() transforme les &i32 en i32
```

### Une chaîne remplace une boucle

```rust
let mut somme = 0;
for x in &v {
    if x % 2 == 0 {
        somme += x * x;
    }
}
```

devient :

```rust
let somme: i32 = v.iter().filter(|x| **x % 2 == 0).map(|x| x * x).sum();
```

Même vitesse (le compilateur produit la même boucle : c'est une *zero cost abstraction*), mais on lit directement l'intention : « garder les pairs, les mettre au carré, additionner ».

## À retenir

- Closure : `|params| expression`. Elle peut utiliser les variables autour (capture).
- `move` fait prendre possession des variables capturées.
- `iter()` lit, `iter_mut()` modifie, `into_iter()` consomme.
- Adaptateurs (`map`, `filter`, `enumerate`, `zip`...) : paresseux, ne font rien seuls.
- Consommateurs (`sum`, `count`, `collect`, `fold`, `any`, `all`, `find`, `min`, `max`) : lancent le calcul.
- `collect` et `sum` ont souvent besoin qu'on précise le type.
