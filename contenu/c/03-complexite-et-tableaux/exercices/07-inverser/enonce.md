Écris deux fonctions :

1. `inverser_portion(tab, debut, fin)` : inverse l'ordre des cases d'indices `debut` (compris) à `fin` (**non compris**). Les autres cases ne bougent pas.
2. `inverser(tab, n)` : inverse tout le tableau, en utilisant `inverser_portion`.

| Appel sur `1 2 3 4 5 6` | Résultat |
|---|---|
| `inverser_portion(tab, 1, 4)` | `1 4 3 2 5 6` |
| `inverser_portion(tab, 2, 2)` (portion vide) | `1 2 3 4 5 6` |
| `inverser(tab, 6)` | `6 5 4 3 2 1` |

La fonction `echanger(a, b)` est fournie. Travaille **sur place** : pas de second tableau.

> [!info] Une borne « non comprise »
> Avec `fin` non compris, la portion contient `fin - debut` cases et le tableau entier est simplement `inverser_portion(tab, 0, n)`. C'est la même convention que `for (i = 0; i < n; i++)`.
