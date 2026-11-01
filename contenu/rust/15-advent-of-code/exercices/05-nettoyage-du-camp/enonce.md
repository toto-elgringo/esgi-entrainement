> [!info] Advent of Code 2022, jour 4
> Énigme originale : [adventofcode.com/2022/day/4](https://adventofcode.com/2022/day/4). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Après un festival, des bénévoles ramassent les déchets sur le terrain de camping, découpé en emplacements numérotés. Ils travaillent **par deux**, et chacun reçoit une **plage d'emplacements**. Une ligne décrit une paire de bénévoles :

```text
3-7,2-9
10-12,13-15
4-6,6-8
1-5,1-5
20-30,25-40
8-8,8-10
11-14,5-10
```

`3-7,2-9` veut dire : le premier nettoie les emplacements 3 à 7 (3, 4, 5, 6 et 7, les bornes comprises), le second les emplacements 2 à 9. Visiblement, l'organisation laisse à désirer : certaines plages se recouvrent.

## Partie 1

Compte les paires où une plage **contient entièrement** l'autre (dans un sens ou dans l'autre) : un des deux bénévoles fait alors un travail que l'autre fait déjà.

| Paire | Contient ? |
|---|---|
| `3-7,2-9` | oui : 2-9 contient 3-7 |
| `10-12,13-15` | non |
| `4-6,6-8` | non (seul le 6 est commun) |
| `1-5,1-5` | oui : les deux plages sont identiques |
| `20-30,25-40` | non |
| `8-8,8-10` | oui : 8-10 contient 8-8 |
| `11-14,5-10` | non |

Réponse de l'exemple : **3**.

## Partie 2

Compte maintenant les paires dont les plages **se chevauchent**, c'est-à-dire qui ont au moins un emplacement en commun.

| Paire | Emplacements communs |
|---|---|
| `3-7,2-9` | 3 à 7 |
| `10-12,13-15` | aucun |
| `4-6,6-8` | 6 |
| `1-5,1-5` | 1 à 5 |
| `20-30,25-40` | 25 à 30 |
| `8-8,8-10` | 8 |
| `11-14,5-10` | aucun |

Réponse de l'exemple : **5**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
