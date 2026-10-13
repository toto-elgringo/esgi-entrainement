# Collections : Vec, HashMap, HashSet

Une **collection** est une valeur qui contient plusieurs valeurs. Les trois collections à connaître :

| Collection | C'est quoi ? | Exemple d'usage |
|---|---|---|
| `Vec<T>` | une liste ordonnée qui peut grandir | des notes, des mots, des scores |
| `HashMap<K, V>` | un dictionnaire : une **clé** donne une **valeur** | nom → numéro de téléphone |
| `HashSet<T>` | un ensemble **sans doublons** | les mots déjà vus |

Les trois rangent leurs éléments sur le **tas** (la mémoire qui peut grandir pendant l'exécution) et libèrent tout automatiquement quand elles disparaissent.

## 1. `Vec<T>` : la liste

`T` est le type des éléments : `Vec<i32>` est une liste d'entiers, `Vec<String>` une liste de textes.

```rust
let mut notes: Vec<u32> = Vec::new();   // liste vide
let premiers = vec![2, 3, 5, 7];        // la macro vec! crée une liste remplie
let zeros = vec![0; 5];                 // [0, 0, 0, 0, 0]

notes.push(12);                         // ajoute à la fin
notes.push(15);
let derniere = notes.pop();             // retire la fin : Some(15)
println!("{}", notes.len());            // nombre d'éléments : 1
println!("{:?}", premiers);             // affiche [2, 3, 5, 7]
```

> [!info] `{:?}`
> `{}` affiche une valeur « pour un humain ». `{:?}` affiche une valeur « pour un développeur » (mode *Debug*) : c'est lui qui marche pour un `Vec`.

`pop()` renvoie une `Option` : `Some(valeur)` s'il y avait un élément, `None` si la liste était vide.

### Lire un élément : `v[i]` ou `v.get(i)`

```rust
let v = vec![10, 20, 30];
let a = v[1];          // 20
let b = v.get(1);      // Some(&20)
let c = v.get(10);     // None
let d = v[10];         // PANIQUE : index out of bounds
```

| Écriture | Si l'indice n'existe pas |
|---|---|
| `v[i]` | le programme **panique** (s'arrête) |
| `v.get(i)` | renvoie `None`, à toi de gérer |

> [!tip] Quand utiliser quoi ?
> `v[i]` quand tu es **sûr** que l'indice existe. `v.get(i)` quand ça dépend des données (saisie, fichier...). `v.first()` et `v.last()` marchent comme `get`.

### Parcourir une liste

```rust
let mut v = vec![1, 2, 3];

for x in &v {          // x est un &i32 : on lit
    println!("{x}");
}

for x in &mut v {      // x est un &mut i32 : on modifie
    *x *= 10;          // * = « la valeur derrière la référence »
}

for x in v {           // x est un i32 : on CONSOMME la liste
    println!("{x}");
}
// v n'existe plus ici : elle a été déplacée dans la boucle
```

> [!warning] Ne pas modifier une liste pendant qu'on la parcourt
> `for x in &v { v.push(*x); }` ne compile pas (erreur E0502) : on ne peut pas écrire dans `v` pendant qu'on la lit.

### Trier et nettoyer

```rust
let mut v = vec![3, 1, 3, 2];
v.sort();              // [1, 2, 3, 3]
v.dedup();             // retire les doublons QUI SE SUIVENT : [1, 2, 3]
v.reverse();           // [3, 2, 1]
v.truncate(2);         // garde les 2 premiers : [3, 2]
let present = v.contains(&3);   // true
```

`&[T]` (une **tranche**, ou *slice*) est la version empruntée d'un `Vec<T>`, comme `&str` pour `String`. Une fonction qui veut juste **lire** une liste prend `&[T]` : elle accepte un `Vec`, un tableau ou un morceau de liste.

```rust
fn somme(v: &[i32]) -> i32 {
    let mut total = 0;
    for x in v {
        total += x;
    }
    total
}
```

## 2. `HashMap<K, V>` : le dictionnaire

Chaque **clé** (`K`) est associée à une **valeur** (`V`). Une clé n'apparaît qu'une seule fois.

```rust
use std::collections::HashMap;   // il faut l'importer

let mut ages: HashMap<String, u32> = HashMap::new();
ages.insert("Alice".to_string(), 30);
ages.insert("Bob".to_string(), 25);
ages.insert("Alice".to_string(), 31);   // remplace l'ancienne valeur

let age = ages.get("Alice");            // Some(&31)
let inconnu = ages.get("Zoé");          // None
let existe = ages.contains_key("Bob");  // true
let retire = ages.remove("Bob");        // Some(25)
```

- `insert` renvoie l'**ancienne** valeur : `None` si la clé était nouvelle.
- `get` renvoie une `Option<&V>` : la valeur peut ne pas exister.

### Compter avec `entry`

```rust
let mut compteur: HashMap<&str, u32> = HashMap::new();
for mot in ["le", "chat", "le"] {
    *compteur.entry(mot).or_insert(0) += 1;
}
// {"le": 2, "chat": 1}
```

`entry(cle).or_insert(0)` veut dire : « donne-moi la case de cette clé, et crée-la avec 0 si elle n'existe pas ». On reçoit un `&mut u32`, d'où l'étoile pour ajouter 1.

> [!tip] Variante
> `entry(cle).or_default()` crée la case avec la valeur par défaut du type : `0` pour un nombre, une liste vide pour un `Vec`.

### Parcourir

```rust
for (nom, age) in &ages {
    println!("{nom} a {age} ans");
}
```

> [!warning] L'ordre n'est pas garanti
> Une `HashMap` range ses éléments dans un ordre qui change d'une exécution à l'autre. Si l'ordre compte, récupère les clés dans un `Vec` et trie-le.

## 3. `HashSet<T>` : l'ensemble sans doublons

```rust
use std::collections::HashSet;

let mut vus = HashSet::new();
vus.insert(3);              // true : nouveau
vus.insert(3);              // false : déjà présent
let present = vus.contains(&3);   // true
println!("{}", vus.len());  // 1
```

`insert` renvoie `true` si l'élément est nouveau : pratique pour détecter un doublon en une ligne.

## À retenir

- `Vec<T>` : `push`, `pop`, `len`, `sort`, `contains`. `v[i]` panique si l'indice n'existe pas, `v.get(i)` renvoie une `Option`.
- Pour lire une liste dans une fonction : paramètre `&[T]`. Pour la modifier : `&mut [T]` ou `&mut Vec<T>`.
- `for x in &v` lit, `for x in &mut v` modifie (avec `*x`), `for x in v` consomme.
- `HashMap<K, V>` : `insert`, `get`, `remove`, `contains_key`, et `entry(k).or_insert(0)` pour compter.
- `HashSet<T>` : pas de doublons, `insert` renvoie `false` si l'élément existait déjà.
- L'ordre d'une `HashMap` ou d'un `HashSet` n'est **jamais** garanti.
