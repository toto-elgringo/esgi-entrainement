`total_panier(prix, quantite)` calcule `prix × quantite`, avec une remise de 10 € dès **10 articles** achetés.

| Appel | Résultat |
|---|---|
| `total_panier(2, 10)` | `10` (20 - 10) |
| `total_panier(3, 5)` | `15` |
| `total_panier(5, 20)` | `90` (100 - 10) |

Le code ne compile pas : la variable `remise` n'existe plus au moment où on veut l'utiliser. Corrige-le.

> [!tip] Rappel
> La **portée** d'une variable, c'est le bloc `{ }` où elle a été créée. À la sortie du bloc, elle disparaît.
