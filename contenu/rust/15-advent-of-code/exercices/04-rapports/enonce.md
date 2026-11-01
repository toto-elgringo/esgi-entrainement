> [!info] Advent of Code 2024, jour 2
> Énigme originale : [adventofcode.com/2024/day/2](https://adventofcode.com/2024/day/2). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Des capteurs surveillent un vieux volcan. Chaque ligne est un **rapport** : une suite de **niveaux** (des nombres) séparés par des espaces.

```text
10 12 13 16 18
20 17 15 14 10
5 6 6 7 9
63 60 58 57 55
15 11 12 13 14
9 8 7 3 2
4 7 9 8 12
2 3 3 3 4
```

Un rapport est **sûr** si les deux conditions sont vraies :

- les niveaux sont tous **en hausse** ou tous **en baisse** (strictement : deux voisins égaux, c'est interdit) ;
- deux niveaux voisins ont un **écart** d'au moins 1 et d'au plus 3.

## Partie 1

Compte les rapports sûrs.

| Rapport | Sûr ? | Pourquoi |
|---|---|---|
| `10 12 13 16 18` | oui | en hausse, écarts 2, 1, 3, 2 |
| `20 17 15 14 10` | non | de 14 à 10, l'écart vaut 4 |
| `5 6 6 7 9` | non | `6 6` : ni hausse ni baisse |
| `63 60 58 57 55` | oui | en baisse, écarts 3, 2, 1, 2 |
| `15 11 12 13 14` | non | baisse de 4, puis hausse |
| `9 8 7 3 2` | non | de 7 à 3, l'écart vaut 4 |
| `4 7 9 8 12` | non | monte, puis descend (9 → 8) |
| `2 3 3 3 4` | non | `3 3` : ni hausse ni baisse |

Réponse de l'exemple : **2**.

## Partie 2

Les capteurs ont un **amortisseur** : un rapport compte aussi comme sûr si on peut le rendre sûr en **retirant un seul niveau** (n'importe lequel, même le premier ou le dernier).

| Rapport | Sûr ? | Pourquoi |
|---|---|---|
| `10 12 13 16 18` | oui | déjà sûr |
| `20 17 15 14 10` | oui | sans le `10` : `20 17 15 14` |
| `5 6 6 7 9` | oui | sans un des `6` : `5 6 7 9` |
| `63 60 58 57 55` | oui | déjà sûr |
| `15 11 12 13 14` | oui | sans le `15` : `11 12 13 14` |
| `9 8 7 3 2` | non | aucun retrait ne marche |
| `4 7 9 8 12` | oui | sans le `8` : `4 7 9 12` |
| `2 3 3 3 4` | non | il reste toujours `3 3` |

Réponse de l'exemple : **6**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
