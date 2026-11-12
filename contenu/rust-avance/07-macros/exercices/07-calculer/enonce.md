Écris la macro `calculer!` qui comprend des opérations écrites avec des **mots** :

| Appel | Résultat |
|---|---|
| `calculer!(2 plus 3)` | `5` |
| `calculer!(10 moins 4)` | `6` |
| `calculer!(6 fois 7)` | `42` |
| `calculer!(9 diviser 3)` | `Some(3)` |
| `calculer!(9 diviser 0)` | `None` |

Les opérandes sont des nombres entiers ou des variables (un seul jeton).

> [!info] Pourquoi `tt` ?
> Après une expression, Rust n'autorise que `=>`, `,` ou `;`. Pour écrire `2 plus 3`, on reçoit donc chaque opérande avec `tt`.
