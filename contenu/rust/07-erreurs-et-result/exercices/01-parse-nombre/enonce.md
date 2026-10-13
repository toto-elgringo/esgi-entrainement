Écris deux fonctions :

1. `lire_nombre(texte)` : transforme le texte en `i32`, en ignorant les espaces autour. Elle renvoie un `Result` : `Ok(nombre)` ou l'erreur de `parse` ;
2. `lire_ou_zero(texte)` : le nombre lu, ou `0` si le texte n'est pas un nombre.

| Appel | Résultat |
|---|---|
| `lire_nombre("42")` | `Ok(42)` |
| `lire_nombre(" 7 ")` | `Ok(7)` |
| `lire_nombre("abc")` | `Err(...)` |
| `lire_ou_zero("abc")` | `0` |

> [!info] `ParseIntError`
> C'est le type d'erreur renvoyé par `parse` quand on demande un entier. La ligne `use std::num::ParseIntError;` permet d'écrire son nom court.
