Écris la macro `compter!` qui compte combien de **jetons** (`tt`) on lui donne, séparés par des espaces. Le résultat est un `usize`.

| Appel | Résultat |
|---|---|
| `compter!()` | `0` |
| `compter!(a b c)` | `3` |
| `compter!(1 + 2)` | `3` (`1`, `+` et `2` sont trois jetons) |

> [!tip] Récursion
> Retire un jeton à chaque appel jusqu'à ce qu'il n'en reste plus.
