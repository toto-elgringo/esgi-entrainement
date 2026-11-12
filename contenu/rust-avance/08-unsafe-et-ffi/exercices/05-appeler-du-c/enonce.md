Le bloc `unsafe extern "C"` déclare déjà deux fonctions de la bibliothèque C : `abs` (valeur absolue, marquée `safe`) et `strlen` (longueur d'un texte C).

Écris deux fonctions Rust sûres qui les utilisent :

1. `valeur_absolue(x: i32) -> i32` : appelle `abs`.
2. `longueur_c(texte: &str) -> usize` : convertit le texte en `CString`, puis appelle `strlen` avec `as_ptr()`.

| Appel | Résultat |
|---|---|
| `valeur_absolue(-7)` | `7` |
| `longueur_c("bonjour")` | `7` |
| `longueur_c("")` | `0` |

> [!tip] Rappel
> `strlen` compte les **octets** jusqu'au zéro final : `"é"` vaut 2.
