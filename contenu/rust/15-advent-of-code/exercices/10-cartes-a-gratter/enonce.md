> [!info] Advent of Code 2023, jour 4
> Énigme originale : [adventofcode.com/2023/day/4](https://adventofcode.com/2023/day/4). L'histoire et l'exemple sont réécrits ici avec nos propres données.

À la kermesse de l'école, un lutin te donne un paquet de **cartes à gratter**. Chaque carte affiche, avant la barre `|`, la liste des **numéros gagnants**, et après la barre, **tes numéros** :

```text
Card 1:  7 23 45 61 88 | 23  5 61 90 12 45 34 70
Card 2: 14  3 52 76 39 | 52 18  3 66 27 81  9 41
Card 3: 60 31  8 95 47 |  2 47 73 31 56 19 84 11
Card 4: 25 66  4 17 93 | 38 71 17 50  6 29 62 85
Card 5: 10 44 77  2 58 | 13 91 36 64  8 21 99 53
Card 6: 33 80  1 69 26 | 15 42 57  3 74 98 20 87
```

Attention : les nombres sont alignés avec des espaces, il peut donc y avoir **plusieurs espaces** à la suite (`|  2`, `Card  12:` dans la vraie entrée).

## Partie 1

Compte combien de **tes numéros** sont dans la liste des numéros gagnants. Le premier numéro trouvé vaut **1 point**, puis chaque numéro trouvé en plus **double** les points : 1, 2, 4, 8… Avec n numéros trouvés, la carte vaut 2 puissance (n − 1) points, et 0 point si n = 0. Fais la **somme** des points de toutes les cartes.

| Carte | Numéros trouvés | Points |
|---|---|---|
| 1 | 23, 61, 45 | 4 |
| 2 | 52, 3 | 2 |
| 3 | 47, 31 | 2 |
| 4 | 17 | 1 |
| 5 | aucun | 0 |
| 6 | aucun | 0 |

Réponse de l'exemple : 4 + 2 + 2 + 1 = **9**.

## Partie 2

Le lutin t'explique la vraie règle : il n'y a pas de points. Une carte avec n numéros trouvés te fait gagner **une copie de chacune des n cartes suivantes**. Si la carte 2 a 3 numéros trouvés, tu gagnes une copie des cartes 3, 4 et 5. Les copies gagnent exactement comme les originaux, et elles peuvent elles aussi faire gagner des copies. Une carte ne fait jamais gagner de carte au-delà de la dernière.

On traite les cartes dans l'ordre, en comptant combien d'**exemplaires** (original + copies) on a de chacune. On commence avec 1 exemplaire de chaque :

| Carte | Exemplaires | Trouvés | Ce qu'elle fait gagner |
|---|---|---|---|
| 1 | 1 | 3 | +1 copie des cartes 2, 3 et 4 |
| 2 | 1 + 1 = 2 | 2 | +2 copies des cartes 3 et 4 |
| 3 | 1 + 1 + 2 = 4 | 2 | +4 copies des cartes 4 et 5 |
| 4 | 1 + 1 + 2 + 4 = 8 | 1 | +8 copies de la carte 5 |
| 5 | 1 + 4 + 8 = 13 | 0 | rien |
| 6 | 1 | 0 | rien |

À la fin, tu as 1 + 2 + 4 + 8 + 13 + 1 cartes. Réponse de l'exemple : **29**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
