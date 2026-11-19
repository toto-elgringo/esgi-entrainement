La recherche dichotomique coupe en deux, à chaque étape, la partie du tableau où elle cherche. Sa complexité dépend donc du nombre de fois où l'on peut diviser `n` par deux avant d'arriver à une seule case.

Écris la fonction `etapes(n)` qui renvoie ce nombre : combien de divisions entières par 2 faut-il pour passer de `n` à 1 ? (`n` vaut au moins 1.)

| `n` | Divisions | Résultat |
|---|---|---|
| 1 | aucune | 0 |
| 8 | 8 → 4 → 2 → 1 | 3 |
| 10 | 10 → 5 → 2 → 1 | 3 |
| 1 000 | ... | 9 |
| 1 000 000 | ... | 19 |

Regarde le `main` : un million de cases, mais seulement une vingtaine d'étapes. C'est ce que veut dire O(log n).
