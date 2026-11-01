> [!info] Advent of Code 2023, jour 9
> Énigme originale : [adventofcode.com/2023/day/9](https://adventofcode.com/2023/day/9). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Au milieu du désert, ton capteur relève des mesures à intervalles réguliers. Chaque ligne est l'**historique** d'une mesure : une suite de nombres entiers, parfois **négatifs**.

```text
4 9 14 19 24 29
2 5 10 17 26 37
8 5 0 -7 -16 -27
1 2 9 28 65 126
```

Pour prévoir la suite, on écrit en dessous la ligne des **écarts** entre deux nombres voisins (le second moins le premier), puis les écarts des écarts, et ainsi de suite jusqu'à obtenir une ligne de **zéros**. Pour la troisième suite :

```text
   8     5     0    -7   -16   -27
     -3    -5    -7    -9   -11
        -2    -2    -2    -2
            0     0     0
```

## Partie 1

Prédis la **valeur suivante** de chaque suite. On ajoute un 0 au bout de la ligne de zéros, puis on remonte : chaque nouvelle valeur = la valeur à sa gauche + la nouvelle valeur juste en dessous.

```text
   8     5     0    -7   -16   -27 [-40]
     -3    -5    -7    -9   -11 [-13]
        -2    -2    -2    -2  [-2]
            0     0     0   [0]
```

-2 + 0 = -2, puis -11 + (-2) = -13, puis -27 + (-13) = **-40**.

| Suite | Valeur suivante |
|---|---|
| `4 9 14 19 24 29` | 34 |
| `2 5 10 17 26 37` | 50 |
| `8 5 0 -7 -16 -27` | -40 |
| `1 2 9 28 65 126` | 217 |

Fais la **somme** des valeurs suivantes. Réponse de l'exemple : 34 + 50 − 40 + 217 = **261**.

## Partie 2

Même idée, mais **vers l'arrière** : prédis la valeur qui viendrait **avant** le premier nombre. On ajoute un 0 au début de la ligne de zéros, puis on remonte : chaque nouvelle valeur = la valeur à sa droite − la nouvelle valeur juste en dessous.

```text
   [9]     8     5     0    -7   -16   -27
     [-1]    -3    -5    -7    -9   -11
        [-2]    -2    -2    -2    -2
            [0]     0     0     0
```

-2 − 0 = -2, puis -3 − (-2) = -1, puis 8 − (-1) = **9**.

| Suite | Valeur précédente |
|---|---|
| `4 9 14 19 24 29` | -1 |
| `2 5 10 17 26 37` | 1 |
| `8 5 0 -7 -16 -27` | 9 |
| `1 2 9 28 65 126` | 0 |

Réponse de l'exemple : −1 + 1 + 9 + 0 = **9**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
