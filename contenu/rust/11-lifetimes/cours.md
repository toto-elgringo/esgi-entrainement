# Les durées de vie (lifetimes)

## 1. Le problème : une référence qui survit à sa valeur

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

## 2. Qu'est-ce qu'une durée de vie ?

C'est la portion du code pendant laquelle une référence est valable. Le compilateur la calcule tout seul presque tout le temps. Quand il faut l'écrire, on utilise une apostrophe suivie d'un nom : `'a` (on lit « durée de vie a »).

```rust
&i32        // une référence
&'a i32     // une référence valable au moins pendant 'a
&'a mut i32 // une référence modifiable valable au moins pendant 'a
```

> [!info] Annoter ne change rien à l'exécution
> Écrire `'a` ne prolonge **pas** la vie d'une valeur. On décrit seulement au compilateur un **lien** entre plusieurs références, pour qu'il puisse vérifier le code.

## 3. E0106 : quand le compilateur a besoin d'aide

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
```

Se lit : « pour une durée de vie `'a`, `a` et `b` vivent au moins `'a`, et le résultat aussi ». En pratique, `'a` devient la **plus courte** des deux : le résultat est utilisable tant que **les deux** textes existent.

## 4. Les règles d'élision : quand on n'a rien à écrire

**Élision** = le compilateur devine les durées de vie tout seul, avec trois règles :

1. Chaque paramètre qui est une référence reçoit sa propre durée de vie.
2. S'il y a **un seul** paramètre référence, sa durée de vie est donnée au résultat.
3. Dans une méthode avec `&self` ou `&mut self`, la durée de vie de `self` est donnée au résultat.

```rust
fn premier_mot(phrase: &str) -> &str    // règle 2 : pas besoin de 'a
```

Si après ces trois règles le compilateur ne sait toujours pas : erreur **E0106**, et c'est à toi d'écrire les `'a`.

## 5. Lier le résultat à un seul paramètre

On ne met `'a` que sur les paramètres dont le résultat dépend vraiment :

```rust
fn premier_qui_commence_par<'a>(mots: &[&'a str], prefixe: &str) -> Option<&'a str>
```

Le résultat vient de `mots`, jamais de `prefixe` : le préfixe peut donc être détruit avant qu'on utilise le résultat.

## 6. Renvoyer une référence vers une variable locale : impossible

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
```

> [!tip] La règle du chapitre 3
> Prendre l'emprunt (`&str`) en paramètre, rendre le possédé (`String`) quand on crée une nouvelle valeur.

## 7. `'static` : valable pendant tout le programme

Les textes écrits dans le code (`"bonjour"`) sont des `&'static str` : leurs octets sont rangés dans le programme lui-même et existent du début à la fin.

```rust
fn message_erreur(code: u32) -> &'static str {
    match code {
        404 => "page introuvable",
        _ => "code inconnu",
    }
}
```

Sans paramètre référence, le compilateur ne peut rien deviner : E0106, et la ligne `help:` propose justement `'static`.

> [!warning] Pas de `'static` pour faire taire le compilateur
> Une `String` créée dans la fonction n'est **pas** `'static`. Si le compilateur proteste, relis plutôt qui possède la valeur.

## 8. Une struct qui contient une référence

```rust
struct Extrait<'a> {
    texte: &'a str,
}

impl<'a> Extrait<'a> {
    fn premier_mot(&self) -> &'a str {
        self.texte.split_whitespace().next().unwrap_or("")
    }
}
```

`Extrait<'a>` veut dire : « un `Extrait` ne peut pas vivre plus longtemps que le texte qu'il regarde ». Renvoyer `&'a str` (et pas `&str`) permet au résultat de rester valable même après la destruction de l'`Extrait`, tant que le texte existe.

## 9. Les erreurs à connaître

| Code | Message | Traduction |
|---|---|---|
| E0106 | missing lifetime specifier | le compilateur ne sait pas d'où vient la référence renvoyée |
| E0597 | does not live long enough | la valeur meurt alors qu'elle est encore empruntée |
| E0515 | cannot return reference to local variable | tu renvoies une référence vers une valeur qui va mourir |
| E0716 | temporary value dropped while borrowed | tu empruntes une valeur temporaire détruite à la fin de la ligne |

## À retenir

- Une référence ne doit jamais vivre plus longtemps que la valeur empruntée.
- `'a` décrit un lien entre des références, ça ne change rien à l'exécution.
- Élision : un seul paramètre référence (ou `&self`) → rien à écrire.
- E0106 : ajouter `<'a>` et relier le résultat aux bons paramètres.
- On ne peut pas renvoyer une référence vers une variable locale : renvoyer une `String`.
- `'static` = valable pendant tout le programme (les textes écrits dans le code).
