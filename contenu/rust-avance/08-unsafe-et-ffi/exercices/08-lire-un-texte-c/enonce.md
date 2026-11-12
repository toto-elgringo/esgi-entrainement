Écris deux fonctions de conversion entre le monde C et le monde Rust.

1. `depuis_c(p: *const c_char) -> String` : lit le texte C pointé par `p` (terminé par un zéro) et le renvoie en `String`. Elle est `unsafe` : l'appelant garantit que `p` est valide.
2. `vers_c(texte: &str) -> Option<CString>` : renvoie le texte converti en `CString`, ou `None` s'il contient un zéro au milieu.

| Appel | Résultat |
|---|---|
| `vers_c("salut")` | `Some(...)` |
| `vers_c("a\0b")` | `None` |
| `depuis_c(` pointeur de `"salut"` `)` | `"salut"` |

> [!warning] Durée de vie
> Un `CString` doit rester vivant tant qu'on utilise son pointeur.
