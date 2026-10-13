Ces deux fonctions marchent... tant que la liste est assez longue. Sinon, elles **paniquent**.

1. `element_ou_zero(v, i)` doit renvoyer l'élément à l'indice `i`, ou `0` si cet indice n'existe pas.
2. `premier_et_dernier(v)` doit renvoyer `Some((premier, dernier))`, ou `None` si la liste est vide.

| Appel | Résultat |
|---|---|
| `element_ou_zero(&[10, 20, 30], 1)` | `20` |
| `element_ou_zero(&[10, 20, 30], 3)` | `0` |
| `premier_et_dernier(&[5, 6, 7])` | `Some((5, 7))` |
| `premier_et_dernier(&[])` | `None` |

Clique sur « Vérifier » pour voir les paniques, puis corrige le code avec `get`, `first` et `last`.
