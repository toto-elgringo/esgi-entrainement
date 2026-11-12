Écris la macro `carre!` qui renvoie le carré d'une expression.

| Appel | Résultat |
|---|---|
| `carre!(4)` | `16` |
| `carre!(1.5)` | `2.25` |
| `carre!(2 + 3)` | `25` (et non `11`) |

> [!tip] Pourquoi 25 ?
> `$x:expr` capture `2 + 3` comme **un seul bloc**. Le calcul est donc `(2 + 3) * (2 + 3)`.
