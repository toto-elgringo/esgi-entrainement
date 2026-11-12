Une `async fn` renvoie un **futur** : pour lire son résultat, on écrit `.await` à l'intérieur d'une autre fonction `async`. Le `block_on` du cours est déjà fourni : il sert à lancer un futur depuis `main` (et dans les tests).

Complète deux fonctions :

1. `double_somme(a, b)` : renvoie le **double** de la somme de `a` et `b`, en utilisant `addition(...).await`.
2. `bonjour(nom)` : renvoie `"Bonjour <nom> !"`, en utilisant `formule().await` pour obtenir le mot `Bonjour`.

| Appel | Résultat |
|---|---|
| `double_somme(2, 3)` | `10` |
| `bonjour("Ada")` | `"Bonjour Ada !"` |

> [!warning] Pas de `.await` hors `async`
> `.await` ne marche que dans une fonction `async` ou un bloc `async { }`.
