> [!info] Advent of Code 2023, jour 5
> Énigme originale : [adventofcode.com/2023/day/5](https://adventofcode.com/2023/day/5). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Le jardinier de l'île te confie son vieux **carnet de plantation**, écrit en anglais. Il indique quelles graines planter, puis, étape par étape, quel sol, quel engrais, quelle eau… utiliser pour chacune, jusqu'à l'emplacement où la planter. Tout est désigné par des **numéros** :

```text
seeds: 61 8 12 25

seed-to-soil map:
70 60 10
30 10 20

soil-to-fertilizer map:
0 40 15
55 0 20

fertilizer-to-water map:
90 70 10
20 5 8

water-to-light map:
10 25 30

light-to-temperature map:
60 0 10
0 60 25

temperature-to-humidity map:
45 20 5
20 45 5

humidity-to-location map:
35 90 10
5 15 12
```

La ligne `seeds:` donne les numéros des **graines**. Ensuite viennent 7 **cartes** de conversion, toujours dans le même ordre. Leurs noms (en anglais dans ta vraie entrée aussi) se lisent « de … vers … » :

| Carte | Convertit |
|---|---|
| `seed-to-soil` | un numéro de graine (*seed*) en numéro de sol (*soil*) |
| `soil-to-fertilizer` | sol → engrais (*fertilizer*) |
| `fertilizer-to-water` | engrais → eau (*water*) |
| `water-to-light` | eau → lumière (*light*) |
| `light-to-temperature` | lumière → température (*temperature*) |
| `temperature-to-humidity` | température → humidité (*humidity*) |
| `humidity-to-location` | humidité → emplacement (*location*) |

Chaque ligne d'une carte est une **règle** de trois nombres : `destination source longueur`. Elle s'applique aux nombres de `source` à `source + longueur - 1` (la fin est exclue) : un nombre `n` de cette plage devient `destination + (n - source)`. Par exemple, la règle `70 60 10` transforme 60 en 70, 61 en 71… jusqu'à 69 en 79. Un nombre qui n'est dans **aucune** règle de la carte reste **le même**.

On passe chaque graine dans les 7 cartes, l'une après l'autre :

| Graine | Sol | Engrais | Eau | Lumière | Température | Humidité | Emplacement |
|---|---|---|---|---|---|---|---|
| 61 | 71 | 71 | 91 | 91 | 91 | 91 | 36 |
| 8 | 8 | 63 | 63 | 63 | 3 | 3 | 3 |
| 12 | 32 | 32 | 32 | 17 | 17 | 17 | 7 |
| 25 | 45 | 5 | 20 | 20 | 20 | 45 | 45 |

## Partie 1

Quel est le **plus petit numéro d'emplacement** obtenu à partir des graines de la ligne `seeds:` ?

Dans l'exemple : **3** (la graine 8).

## Partie 2

En relisant le carnet, tu comprends que la ligne `seeds:` contient en fait des **paires** : un début et une longueur. `61 8` veut dire les graines 61 à 68, et `12 25` les graines 12 à 36. Quel est le plus petit numéro d'emplacement parmi **toutes** ces graines ?

Dans l'exemple, la meilleure graine est 30 : 30 reste 30 jusqu'à l'eau, la règle `10 25 30` en fait la lumière 15, qui reste 15 jusqu'à l'humidité, puis la règle `5 15 12` donne l'emplacement **5**. Remarque que ce n'est pas le début d'un intervalle de graines : regarder seulement 61 et 12 ne suffit pas.

Écris `partie1(entree)` et `partie2(entree)`.

## L'idée

Dans ta vraie entrée, les intervalles de graines contiennent des **milliards** de graines : les essayer une par une prendrait des heures. Mais une règle décale **toute une plage d'un coup**, du même montant. On peut donc convertir des **intervalles entiers** au lieu de nombres isolés.

Pour un intervalle de graines et une règle, il y a trois morceaux possibles : la partie **commune** (décalée par la règle), le morceau qui dépasse **à gauche** de la règle et celui qui dépasse **à droite** (à tester avec les autres règles de la carte). On **découpe** ainsi chaque intervalle aux endroits où les règles commencent et finissent. Un morceau qui ne touche aucune règle passe tel quel. Après les 7 cartes, la réponse est le plus petit début d'intervalle. Il n'y a que quelques centaines de morceaux à suivre, le calcul est instantané.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
