> [!info] Advent of Code 2024, jour 1
> Énigme originale : [adventofcode.com/2024/day/1](https://adventofcode.com/2024/day/1). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Deux bibliothécaires ont fait l'inventaire de la même réserve, chacun de son côté. Ils ont noté des numéros de livres sur une même feuille : la colonne de gauche pour l'un, celle de droite pour l'autre, séparées par plusieurs espaces. Les deux listes devraient se ressembler… mais pas tout à fait.

```text
12   9
4   15
9   4
4   9
20   4
7   3
```

## Partie 1

Range chaque colonne **dans l'ordre croissant**, puis associe le plus petit nombre de gauche au plus petit de droite, le deuxième au deuxième, et ainsi de suite. Pour chaque paire, calcule l'**écart** entre les deux nombres (toujours positif : l'écart entre 3 et 7 vaut 4, comme entre 7 et 3). Additionne tous les écarts.

| Gauche triée | Droite triée | Écart |
|---|---|---|
| 4 | 3 | 1 |
| 4 | 4 | 0 |
| 7 | 4 | 3 |
| 9 | 9 | 0 |
| 12 | 9 | 3 |
| 20 | 15 | 5 |

Réponse de l'exemple : **12**.

## Partie 2

Les bibliothécaires veulent maintenant un **score de ressemblance**. Pour chaque nombre de la colonne de gauche (dans l'ordre d'origine, sans trier), compte combien de fois il apparaît dans la colonne de **droite**, puis multiplie le nombre par ce compte. Additionne tous les résultats.

| Gauche | Fois à droite | Produit |
|---|---|---|
| 12 | 0 | 0 |
| 4 | 2 | 8 |
| 9 | 2 | 18 |
| 4 | 2 | 8 |
| 20 | 0 | 0 |
| 7 | 0 | 0 |

Réponse de l'exemple : **34**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
