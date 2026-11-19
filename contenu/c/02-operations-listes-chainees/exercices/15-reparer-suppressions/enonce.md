Ces deux fonctions renvoient le **nouveau début** de la liste (on les appelle avec `liste = supprimerPremier(liste);`). Elles donnent la bonne liste... mais elles **ne rendent jamais la mémoire** des maillons retirés.

Corrige-les pour que chaque maillon retiré soit libéré avec `free`, sans rien changer d'autre :

| Appel | `1 -> 2 -> 3` devient |
|---|---|
| `supprimerPremier` | `2 -> 3` |
| `supprimerDernier` | `1 -> 2` |

Sur une liste vide, les deux fonctions renvoient `NULL` sans planter. Sur une liste d'un seul maillon, elles renvoient `NULL` (liste vide).

> [!info] Pourquoi c'est sournois
> Une fuite mémoire ne se voit pas : le programme affiche les bons résultats. Elle se voit seulement quand il tourne longtemps et que la mémoire finit par manquer. Ici, les tests comptent les `malloc` et les `free`.
