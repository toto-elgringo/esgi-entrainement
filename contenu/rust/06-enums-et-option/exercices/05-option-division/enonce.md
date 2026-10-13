Écris trois fonctions qui utilisent `Option` :

1. `diviser(a, b)` : `Some(a / b)`, ou `None` si `b` vaut 0 ;
2. `diviser_ou_zero(a, b)` : le résultat de la division, ou `0` si elle est impossible ;
3. `premiere_lettre(mot)` : la première lettre du mot, ou `None` si le mot est vide.

| Appel | Résultat |
|---|---|
| `diviser(10, 2)` | `Some(5)` |
| `diviser(7, 0)` | `None` |
| `diviser_ou_zero(7, 0)` | `0` |
| `premiere_lettre("Rust")` | `Some('R')` |
| `premiere_lettre("")` | `None` |

> [!info] `.chars().next()`
> `mot.chars()` parcourt les caractères du texte ; `.next()` donne le premier, emballé dans un `Option` (il n'y en a peut-être pas).
