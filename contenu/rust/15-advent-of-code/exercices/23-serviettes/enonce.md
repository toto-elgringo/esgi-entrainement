> [!info] Advent of Code 2024, jour 19
> Énigme originale : [adventofcode.com/2024/day/19](https://adventofcode.com/2024/day/19). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Une boutique de serviettes de bain vend des bandes de tissu à rayures colorées : `w` (blanc), `u` (bleu), `b` (noir), `r` (rouge) et `g` (vert). Chaque bande a un **motif** fixe (on ne peut pas la retourner), et le stock est **illimité** : un même motif peut servir autant de fois qu'on veut. Des clients apportent des **dessins** : la suite exacte de couleurs qu'ils veulent obtenir en mettant des bandes **bout à bout**.

```text
w, u, g, bw, rg, ub, gru, wr, bwu

bwrg
ubwu
grub
wrgu
ugrug
bbw
ubwrgu
gwubwu
wrgruwbw
```

La première ligne donne les motifs disponibles, séparés par des virgules. Après une ligne vide vient un dessin par ligne.

## Partie 1

Combien de dessins **peut-on réaliser** avec les motifs disponibles ?

Dans l'exemple :

| Dessin | Réalisable ? |
|---|---|
| `bwrg` | oui : `bw` + `rg` |
| `ubwu` | oui : `ub` + `w` + `u` |
| `grub` | non : on peut commencer par `g` ou par `gru`, mais il reste alors `rub` ou `b`, et aucun motif ne convient |
| `wrgu` | oui : `wr` + `g` + `u` |
| `ugrug` | oui : `u` + `gru` + `g` |
| `bbw` | non : aucun motif ne commence par `bb`, et `b` seul n'existe pas |
| `ubwrgu` | oui : `ub` + `wr` + `g` + `u` |
| `gwubwu` | oui : `g` + `w` + `u` + `bwu` |
| `wrgruwbw` | oui : `wr` + `gru` + `w` + `bw` |

Réponse de l'exemple : **7**.

## Partie 2

Les clients veulent connaître **toutes** les façons de faire leur dessin. Pour chaque dessin, compte le **nombre de façons différentes** de le réaliser (deux façons sont différentes si elles n'utilisent pas la même suite de motifs), puis additionne ces nombres sur tous les dessins. Utilise `u64`.

Dans l'exemple, `ubwu` se fait de 3 façons : `u` + `bw` + `u`, `u` + `bwu` et `ub` + `w` + `u`. En tout :

| Dessin | Façons |
|---|---|
| `bwrg` | 1 |
| `ubwu` | 3 |
| `grub` | 0 |
| `wrgu` | 2 (`w` + `rg` + `u`, `wr` + `g` + `u`) |
| `ugrug` | 1 |
| `bbw` | 0 |
| `ubwrgu` | 3 |
| `gwubwu` | 3 |
| `wrgruwbw` | 1 |

Réponse de l'exemple : **14**.

Écris `partie1(entree)` et `partie2(entree)`.

## L'idée

Essayer toutes les combinaisons de motifs une par une est trop long : sur un vrai dessin, il peut y avoir des milliers de milliards de façons. Pourtant, on se pose sans arrêt la **même question** : « de combien de façons peut-on fabriquer la fin du dessin à partir de telle position ? ». La réponse ne dépend que de la position, pas du chemin pour y arriver.

C'est le principe de la **programmation dynamique** : découper le problème en petites questions, répondre à chacune **une seule fois** et ranger la réponse dans un tableau pour la réutiliser. Ici, `facons[i]` = nombre de façons de fabriquer le dessin à partir de la position `i`. La fin vide se fait d'une façon (on ne pose plus rien). En remontant de la fin vers le début, `facons[i]` est la somme des `facons[i + longueur du motif]` pour chaque motif qui colle au dessin à la position `i`. La réponse est `facons[0]`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
