> [!info] Advent of Code 2021, jour 1
> Énigme originale : [adventofcode.com/2021/day/1](https://adventofcode.com/2021/day/1). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Ton sous-marin descend vers le fond de l'océan. Le sonar mesure la **profondeur** du fond, une mesure par ligne :

```text
100
102
101
105
110
108
112
120
90
125
```

## Partie 1

Compte combien de mesures sont **plus grandes que la mesure juste avant**. La première mesure n'a pas de mesure avant elle, elle ne compte pas.

Dans l'exemple : `102` (> 100), `105`, `110`, `112`, `120` et `125` → **6**.

## Partie 2

Les mesures sont bruitées. On les additionne donc **par paquets de trois qui se suivent** (fenêtre glissante) : 100 + 102 + 101 = 303, puis 102 + 101 + 105 = 308, puis 101 + 105 + 110 = 316, etc. Compte combien de sommes sont **plus grandes que la somme juste avant**.

| Fenêtre | Somme | Augmente ? |
|---|---|---|
| 100, 102, 101 | 303 | |
| 102, 101, 105 | 308 | oui |
| 101, 105, 110 | 316 | oui |
| 105, 110, 108 | 323 | oui |
| 110, 108, 112 | 330 | oui |
| 108, 112, 120 | 340 | oui |
| 112, 120, 90 | 322 | non |
| 120, 90, 125 | 335 | oui |

Réponse de l'exemple : **6**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
