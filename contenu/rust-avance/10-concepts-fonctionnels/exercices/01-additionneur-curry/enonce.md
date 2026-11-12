Une fonction **curryfiée** prend ses arguments un par un : `f(a)(b)` au lieu de `f(a, b)`.

Écris deux fonctions :

| Fonction | Rôle |
|---|---|
| `additionneur(x)` | renvoie une fonction qui ajoute `x` à son argument |
| `multiplieur(x)` | renvoie une fonction qui multiplie son argument par `x` |

| Appel | Résultat |
|---|---|
| `additionneur(3)(4)` | `7` |
| `multiplieur(5)(6)` | `30` |

> [!tip] Pourquoi `move` ?
> La closure renvoyée sort de la fonction : elle doit emporter `x` avec elle, sinon `x` disparaîtrait.
