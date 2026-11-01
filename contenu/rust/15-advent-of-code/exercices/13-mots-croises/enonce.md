> [!info] Advent of Code 2024, jour 4
> Énigme originale : [adventofcode.com/2024/day/4](https://adventofcode.com/2024/day/4). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Pendant une pause, un lutin te tend sa grille de **mots mêlés**. Il ne cherche qu'un seul mot : `XMAS`.

```text
MAMSXXMAMA
XXMSASMSXS
AXMAMSAMXS
XMASSMXAMS
XXAXXMAMAM
SMMMSMAMSA
XAAMMSASAX
SSMSASASSS
```

## Partie 1

Compte combien de fois `XMAS` apparaît. Le mot peut se lire dans les **8 directions** : horizontalement, verticalement, en diagonale, à l'endroit comme **à l'envers** (`SAMX`). Deux mots peuvent **partager des lettres**.

Voici la même grille où seules les lettres qui font partie d'un `XMAS` sont gardées :

```text
..........
.......S..
.....SAMX.
XMAS.M..M.
XXAXX...A.
.MMM.M..S.
XAA...A...
SS.S...S..
```

| Position du `X` (ligne, colonne) | Direction de lecture |
|---|---|
| 3, 9 | vers la gauche |
| 3, 9 | vers le bas |
| 4, 1 | vers la droite |
| 5, 1 | en bas à droite |
| 5, 2 | vers le bas |
| 5, 4 | en bas à gauche |
| 5, 5 | en bas à droite |
| 5, 5 | en bas à gauche |
| 5, 5 | en haut à droite |
| 7, 1 | en haut à droite |

Le `X` de la ligne 5, colonne 5 sert à lui seul à trois mots. Réponse de l'exemple : **10**.

## Partie 2

Le lutin s'est trompé de consigne : il ne fallait pas chercher `XMAS`, mais des **croix de `MAS`**. Une croix, c'est un `A` dont les **deux diagonales** se lisent `MAS` (dans un sens ou dans l'autre, donc `MAS` ou `SAM`) :

```text
M.S      S.M      M.M
.A.      .A.      .A.
M.S      S.M      S.S
```

Compte les croix de la grille. Voici la grille où seules les lettres des croix sont gardées :

```text
..........
..........
..........
..........
.....M.M..
SMMM.MAM..
.AA..SAS..
SSMS.S.S..
```

Les `A` des croix sont en (6, 7), (7, 2), (7, 3) et (7, 7) : deux croix peuvent se toucher et partager des lettres. Réponse de l'exemple : **4**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
