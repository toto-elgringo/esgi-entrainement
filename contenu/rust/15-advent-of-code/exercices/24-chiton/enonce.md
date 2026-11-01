> [!info] Advent of Code 2021, jour 15
> Énigme originale : [adventofcode.com/2021/day/15](https://adventofcode.com/2021/day/15). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Ton sous-marin doit traverser une grotte dont les parois sont couvertes de **chitons**, de petits mollusques qui abîment la coque. Le sonar donne, pour chaque case de la grotte, un **niveau de risque** de 1 à 9 :

```text
1291118
6191519
8181716
7111917
9687819
5896721
8979863
```

Tu pars de la case en **haut à gauche** et tu dois arriver en **bas à droite**. À chaque pas, tu vas sur une case voisine : en haut, en bas, à gauche ou à droite (jamais en diagonale). Le **risque d'un chemin** est la somme des risques des cases où tu entres. La case de départ ne compte pas (tu y es déjà), la case d'arrivée compte.

## Partie 1

Quel est le **plus petit risque total** possible pour aller du départ à l'arrivée ?

Dans l'exemple, le meilleur chemin est celui-ci (les cases hors du chemin sont remplacées par des points) :

```text
12.111.
.1.1.1.
.1.1.1.
.111.1.
.....1.
.....21
......3
```

Il descend, puis **remonte** pour éviter les gros risques, avant de redescendre : risque total **22**. Un chemin qui ne va qu'à droite et en bas ne fait pas mieux que 24.

## Partie 2

En fait, la carte n'est qu'un petit morceau de la grotte. La vraie grotte est **5 fois plus large et 5 fois plus haute** : la carte est recopiée 5 × 5 fois. Chaque copie vers la **droite** ajoute 1 à tous les risques, et chaque copie vers le **bas** ajoute aussi 1 (les deux s'additionnent : la copie à 2 crans à droite et 1 cran en bas ajoute 3). Un risque qui dépasse 9 **revient à 1** : 9 + 1 donne 1, 8 + 3 donne 2.

Dans l'exemple, la première ligne de la carte devient, copie par copie (+0, +1, +2, +3, +4) :

```text
1291118 2312229 3423331 4534442 5645553
```

La copie tout en bas à droite ajoute 4 + 4 = 8 : la dernière ligne de la carte, `8979863`, y devient `7868752`.

Toujours en partant d'en haut à gauche pour arriver en bas à droite de cette grande carte, quel est le plus petit risque total ?

Réponse de l'exemple : **227**.

Écris `partie1(entree)` et `partie2(entree)`.

## L'idée

Le parcours en largeur (BFS) trouve le chemin avec le moins de **pas**, mais ici chaque pas a un **coût** différent : il faut l'**algorithme de Dijkstra**. Il traite les cases dans l'ordre de leur risque total depuis le départ, **du plus petit au plus grand**. Quand on sort une case, on connaît sûrement son meilleur risque, car aucun chemin passant par une case plus chère ne pourrait faire mieux. On essaie alors d'améliorer ses voisins.

Pour toujours sortir la case la moins chère rapidement, on utilise un **tas** (`BinaryHeap`) : une file où l'on retire toujours le plus grand élément. Avec `Reverse(...)`, l'ordre s'inverse et on retire le plus petit. Un tableau (`Vec`) garde le meilleur risque connu de chaque case. La grande carte de la partie 2 contient 250 000 cases pour une vraie entrée : un `Vec` est bien plus rapide qu'un `HashMap` pour ça.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
