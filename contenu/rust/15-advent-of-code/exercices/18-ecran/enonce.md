> [!info] Advent of Code 2022, jour 10
> Énigme originale : [adventofcode.com/2022/day/10](https://adventofcode.com/2022/day/10). L'histoire et l'exemple sont réécrits ici avec nos propres données.

L'écran de ta vieille radio est cassé, et tu dois comprendre son petit processeur. Il a un seul **registre** (une case mémoire) appelé `X`, qui vaut **1** au départ, et une horloge qui avance par **cycles** (cycle 1, cycle 2, …). Ton entrée est un programme fait de deux instructions :

- `noop` : ne fait rien et dure **1 cycle** ;
- `addx V` : dure **2 cycles**, et c'est seulement **après** ces deux cycles que `X` augmente de `V` (qui peut être négatif).

L'exemple est un programme de 128 lignes qui dure 240 cycles. Il commence ainsi :

```text
noop
addx 5
noop
addx 1
addx 4
addx -1
…
```

| Cycle | Instruction en cours | X pendant le cycle |
|---|---|---|
| 1 | `noop` | 1 |
| 2 | `addx 5` (1er cycle) | 1 |
| 3 | `addx 5` (2e cycle) | 1 |
| 4 | `noop` | 6 |
| 5 | `addx 1` (1er cycle) | 6 |
| 6 | `addx 1` (2e cycle) | 6 |
| 7 | `addx 4` (1er cycle) | 7 |

Le programme complet est dans la constante `EXEMPLE` de l'éditeur.

## Partie 1

La **force du signal** pendant un cycle vaut **numéro du cycle × valeur de X pendant ce cycle**. Fais la somme des forces du signal **pendant** les cycles 20, 60, 100, 140, 180 et 220.

| Cycle | X pendant le cycle | Force du signal |
|---|---|---|
| 20 | 17 | 340 |
| 60 | 29 | 1740 |
| 100 | 22 | 2200 |
| 140 | 17 | 2380 |
| 180 | 21 | 3780 |
| 220 | 22 | 4840 |

Attention au cycle 20 : c'est le 2e cycle de l'instruction `addx 8`, donc X vaut **encore 17** (il ne passe à 25 qu'après). Réponse de l'exemple : **15280**.

## Partie 2

X est en fait la position horizontale d'un **sprite** de 3 pixels de large : il couvre les positions X − 1, X et X + 1. L'écran fait **40 pixels de large et 6 lignes de haut**, avec des positions de 0 à 39 sur chaque ligne. Il dessine **un pixel par cycle**, de gauche à droite puis ligne par ligne : pendant le cycle 1, le pixel 0 de la ligne 1 ; pendant le cycle 40, le pixel 39 de la ligne 1 ; pendant le cycle 41, le pixel 0 de la ligne 2 ; etc. Pendant le cycle c, c'est donc le pixel **(c − 1) % 40**.

Le pixel est **allumé** (`#`) si le sprite le couvre à ce moment-là (|X − position| ≤ 1), sinon il reste **éteint** (`.`).

| Cycle | Position dessinée | X | Le sprite couvre | Pixel |
|---|---|---|---|---|
| 1 | 0 | 1 | 0, 1, 2 | `#` |
| 2 | 1 | 1 | 0, 1, 2 | `#` |
| 3 | 2 | 1 | 0, 1, 2 | `#` |
| 4 | 3 | 6 | 5, 6, 7 | `.` |
| 5 | 4 | 6 | 5, 6, 7 | `.` |
| 6 | 5 | 6 | 5, 6, 7 | `#` |
| 7 | 6 | 7 | 6, 7, 8 | `#` |

`partie2` renvoie les **6 lignes** de l'écran séparées par `\n` (un `String`). Avec l'exemple, l'écran affiche :

```text
###..###..####.#..#...##..##..#..#.####.
#..#..#...#....##.#....#.#..#.#..#.#....
###...#...###..##.#....#.#..#.#..#.###..
#..#..#...#....#.##....#.#..#.#..#.#....
#..#..#...#....#.##.#..#.#..#.#..#.#....
###..###..####.#..#..##...##...##..####.
```

Huit lettres apparaissent : **BIENJOUE**. Avec ta vraie entrée, c'est toi qui lis les 8 lettres affichées et qui les tapes sur le site.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
