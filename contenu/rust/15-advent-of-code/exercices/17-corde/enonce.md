> [!info] Advent of Code 2022, jour 9
> Énigme originale : [adventofcode.com/2022/day/9](https://adventofcode.com/2022/day/9). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Tu traverses un pont de cordes, et pour t'occuper l'esprit, tu imagines une **corde** posée sur une grille infinie. La corde a une **tête** (`H`) et une **queue** (`T`). Ton entrée donne les mouvements de la tête : une direction (`R` droite, `L` gauche, `U` haut, `D` bas) et un nombre de pas.

```text
L 5
D 5
L 8
U 10
R 9
D 10
R 4
```

Au départ, tous les nœuds de la corde sont sur la même case. La tête avance **un pas à la fois**. Après **chaque pas**, la queue se met à jour :

- si elle **touche** encore la tête (même case, case voisine, ou voisine **en diagonale**), elle ne bouge pas ;
- sinon, elle fait **un pas vers la tête** : un pas en ligne droite si elles sont sur la même ligne ou la même colonne, sinon un pas **en diagonale**. Autrement dit, elle avance de −1, 0 ou +1 sur chaque axe, selon le signe de l'écart.

```text
.....      .....          .....      .....
.T.H.  →   ..TH.          ...H.  →   ..TH.
.....      .....          .T...      .....
```

## Partie 1

Compte le nombre de cases **différentes** où la queue est passée, case de départ comprise. Dans l'exemple, voici les cases visitées par la queue (`s` est la case de départ) :

```text
.########.....
#........#....
#........#....
#........#....
#........#....
#........####s
#.......##....
#.......##....
#.......##....
#.......##....
.#######..###.
```

Réponse de l'exemple : **44**.

## Partie 2

La corde casse et tu la remplaces par une corde de **10 nœuds** : la tête, puis 9 nœuds. Chaque nœud suit **celui juste devant lui** avec la même règle que la queue de la partie 1. Les mouvements de la tête ne changent pas.

Compte les cases différentes visitées par le **dernier nœud**. Il bouge beaucoup moins, car il faut que les 9 nœuds devant lui se soient tendus :

```text
##.......s
.##.....#.
..##...#..
...#..#...
....##....
```

Réponse de l'exemple : **13**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
