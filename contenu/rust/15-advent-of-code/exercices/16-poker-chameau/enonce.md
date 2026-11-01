> [!info] Advent of Code 2023, jour 7
> Énigme originale : [adventofcode.com/2023/day/7](https://adventofcode.com/2023/day/7). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Pour passer le temps pendant la traversée du désert, une caravanière t'apprend le **poker à dos de chameau**. Chaque ligne contient une **main** de 5 cartes, puis ta **mise** :

```text
77J27 320
TT8A8 95
KQJ93 480
5A5A5 27
JJ6JJ 610
T8T8A 200
J8888 130
```

Les cartes, de la plus forte à la plus faible : `A`, `K`, `Q`, `J`, `T` (le 10), `9`, `8`, `7`, `6`, `5`, `4`, `3`, `2`. Les couleurs n'existent pas.

## Partie 1

Chaque main a un **type**, du plus fort au plus faible :

| Type | Exemple |
|---|---|
| Cinq identiques | `99999` |
| Carré (4 identiques) | `9Q999` |
| Full (3 identiques + 2 identiques) | `Q9Q9Q` |
| Brelan (3 identiques, les 2 autres différentes) | `K9KK3` |
| Deux paires | `K9K39` |
| Une paire | `K9K35` |
| Carte haute (toutes différentes) | `K9235` |

Une main d'un type plus fort bat toujours une main d'un type plus faible. Si deux mains ont le **même type**, on compare leur **première carte** : la plus forte gagne. Si elles sont égales, on compare la deuxième, et ainsi de suite. Attention, on compare les cartes **dans l'ordre où elles sont écrites** : `T8T8A` et `TT8A8` sont deux paires toutes les deux, la première carte est égale (`T`), mais la deuxième (`8` contre `T`) fait gagner `TT8A8`.

Classe les mains de la plus faible (**rang 1**) à la plus forte (rang 7 ici). Chaque main rapporte **mise × rang**. Fais la somme :

| Rang | Main | Type | Gain |
|---|---|---|---|
| 1 | `KQJ93` | carte haute | 480 × 1 = 480 |
| 2 | `T8T8A` | deux paires | 200 × 2 = 400 |
| 3 | `TT8A8` | deux paires | 95 × 3 = 285 |
| 4 | `77J27` | brelan | 320 × 4 = 1280 |
| 5 | `5A5A5` | full | 27 × 5 = 135 |
| 6 | `J8888` | carré (8 < J sur la 2ᵉ carte) | 130 × 6 = 780 |
| 7 | `JJ6JJ` | carré | 610 × 7 = 4270 |

Réponse de l'exemple : **7630**.

## Partie 2

Nouvelle règle : les `J` sont des **jokers**. Un joker prend la valeur qui donne **le meilleur type** possible à sa main : `77J27` devient un carré, `KQJ93` une paire. Mais pour **départager** deux mains du même type, le joker reste un `J` et devient la carte **la plus faible**, plus faible que `2` : l'ordre est maintenant `A`, `K`, `Q`, `T`, `9`, … , `2`, `J`.

| Rang | Main | Type avec les jokers | Gain |
|---|---|---|---|
| 1 | `KQJ93` | une paire | 480 × 1 = 480 |
| 2 | `T8T8A` | deux paires | 200 × 2 = 400 |
| 3 | `TT8A8` | deux paires | 95 × 3 = 285 |
| 4 | `5A5A5` | full | 27 × 4 = 108 |
| 5 | `77J27` | carré | 320 × 5 = 1600 |
| 6 | `JJ6JJ` | cinq identiques (J < 8 sur la 2ᵉ carte) | 610 × 6 = 3660 |
| 7 | `J8888` | cinq identiques | 130 × 7 = 910 |

`JJ6JJ` et `J8888` ont toutes les deux le meilleur type, mais cette fois le `J` en deuxième position est plus faible que le `8`. Réponse de l'exemple : **7443**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
