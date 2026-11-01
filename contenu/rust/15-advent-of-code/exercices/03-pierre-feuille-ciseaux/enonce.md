> [!info] Advent of Code 2022, jour 2
> Énigme originale : [adventofcode.com/2022/day/2](https://adventofcode.com/2022/day/2). L'histoire et l'exemple sont réécrits ici avec nos propres données.

La colonie de vacances organise un grand tournoi de pierre-feuille-ciseaux, avec des crêpes à gagner. Une amie te glisse une fiche codée : une ligne par manche, avec d'abord la lettre du coup de ton adversaire, puis une deuxième lettre pour toi.

```text
C X
A Z
B Y
A X
C Y
```

Le coup de l'adversaire : `A` = pierre, `B` = feuille, `C` = ciseaux. Rappel : la pierre casse les ciseaux, les ciseaux coupent la feuille, la feuille enveloppe la pierre.

Le **score d'une manche** = les points de la forme que **tu** joues (pierre 1, feuille 2, ciseaux 3) + les points de l'issue (perdu 0, match nul 3, gagné 6). Ton score total est la somme des scores de toutes les manches.

## Partie 1

Tu penses que la deuxième lettre donne le coup à jouer : `X` = pierre, `Y` = feuille, `Z` = ciseaux.

| Manche | Adversaire | Toi | Issue | Score |
|---|---|---|---|---|
| `C X` | ciseaux | pierre | gagné | 1 + 6 = 7 |
| `A Z` | pierre | ciseaux | perdu | 3 + 0 = 3 |
| `B Y` | feuille | feuille | nul | 2 + 3 = 5 |
| `A X` | pierre | pierre | nul | 1 + 3 = 4 |
| `C Y` | ciseaux | feuille | perdu | 2 + 0 = 2 |

Réponse de l'exemple : **21**.

## Partie 2

Ton amie t'explique enfin le code : la deuxième lettre dit comment la manche doit **finir**. `X` = tu dois perdre, `Y` = match nul, `Z` = tu dois gagner. À toi de trouver la forme à jouer, puis de compter le score de la même façon.

| Manche | Adversaire | Issue voulue | Tu joues | Score |
|---|---|---|---|---|
| `C X` | ciseaux | perdu | feuille | 2 + 0 = 2 |
| `A Z` | pierre | gagné | feuille | 2 + 6 = 8 |
| `B Y` | feuille | nul | feuille | 2 + 3 = 5 |
| `A X` | pierre | perdu | ciseaux | 3 + 0 = 3 |
| `C Y` | ciseaux | nul | ciseaux | 3 + 3 = 6 |

Réponse de l'exemple : **24**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
