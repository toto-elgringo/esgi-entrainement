> [!info] Advent of Code 2022, jour 6
> Énigme originale : [adventofcode.com/2022/day/6](https://adventofcode.com/2022/day/6). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Ta vieille radio capte un signal : une longue suite de lettres, sur une seule ligne. Les lettres arrivent une par une, et la radio doit repérer un **marqueur** : un groupe de lettres **qui se suivent** et qui sont **toutes différentes**.

```text
zzyzyxzyxwvvutsrqponmlkjih
```

La réponse attendue est le **nombre de caractères lus** depuis le début du signal, jusqu'à la dernière lettre du premier marqueur (comprise). Si le signal ne contient aucun marqueur, réponds 0.

## Partie 1

Le marqueur de début de paquet fait **4** lettres. Regarde les 4 dernières lettres lues après chaque nouvelle lettre :

| Lettres lues | 4 dernières | Toutes différentes ? |
|---|---|---|
| 4 | `zzyz` | non |
| 5 | `zyzy` | non |
| 6 | `yzyx` | non |
| 7 | `zyxz` | non |
| 8 | `yxzy` | non |
| 9 | `xzyx` | non |
| 10 | `zyxw` | **oui** |

Réponse de l'exemple : **10**.

## Partie 2

Le marqueur de début de message fait **14** lettres. Tant que le groupe des 14 dernières lettres contient les deux `v` (lettres 11 et 12), il ne peut pas être bon. Le premier groupe sans doublon va de la lettre 12 à la lettre 25 : `vutsrqponmlkji`.

Réponse de l'exemple : **25**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
