Écris la fonction `rotation_gauche(tab, n, k)` qui fait tourner le tableau de `k` crans vers la gauche : les `k` premières valeurs passent à la fin, dans le même ordre.

| Tableau | `k` | Résultat |
|---|---|---|
| `1 2 3 4 5` | 2 | `3 4 5 1 2` |
| `1 2 3 4 5` | 0 | `1 2 3 4 5` |
| `1 2 3 4 5` | 5 | `1 2 3 4 5` |
| `1 2 3 4 5` | 7 | `3 4 5 1 2` (7 crans = 5 + 2) |

Contraintes :

- **O(n)** en temps : décaler tout le tableau d'un cran, `k` fois, coûterait O(n × k).
- **O(1)** en mémoire : pas de second tableau, pas de `malloc`.

La fonction `inverser_portion(tab, debut, fin)` de l'exercice précédent est fournie (`fin` non compris). Il existe une solution en trois appels.

> [!warning] Le tableau vide
> `k % 0` est une division par zéro : le programme plante. Traite `n == 0` à part.
