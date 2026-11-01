> [!info] Advent of Code 2022, jour 12
> Énigme originale : [adventofcode.com/2022/day/12](https://adventofcode.com/2022/day/12). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Ta montre ne capte plus rien au fond de la vallée : il faut grimper jusqu'au sommet où le signal passe. Ton appareil affiche une carte des **hauteurs** du terrain, case par case, de `a` (le plus bas) à `z` (le plus haut) :

```text
abcdefghi
awxyzzzzj
SvcEzyxwk
audefghil
atsrqponm
```

- `S` est ta position de départ : sa hauteur est `a`.
- `E` est le sommet où le signal passe : sa hauteur est `z`.

À chaque **pas**, tu vas sur une case voisine : en haut, en bas, à gauche ou à droite (jamais en diagonale). Tu ne grimpes pas sans matériel : la case d'arrivée peut être **au plus 1 plus haute** que ta case (de `c` tu peux aller sur `d`, mais pas sur `e`). En revanche, tu peux **descendre** d'autant que tu veux (de `m` vers `c`, par exemple), ou rester à la même hauteur.

## Partie 1

Quel est le **plus petit nombre de pas** pour aller de `S` à `E` ?

Dans l'exemple, le meilleur chemin monte d'abord de deux cases, fait le tour de la carte puis entre vers `E` (chaque flèche indique où va le pas suivant) :

```text
>>>>>>>>v
^>>v....v
^^.E....v
.^......v
.^<<<<<<<
```

Réponse de l'exemple : **27** pas.

## Partie 2

Le sentier serait plus joli s'il commençait au plus bas. Parmi **toutes les cases de hauteur `a`** (`S` compris), quel est le plus petit nombre de pas pour atteindre `E` ?

Dans l'exemple, la case `a` tout en haut à gauche est à **25** pas de `E` (le même chemin, sans les deux premiers pas).

Écris `partie1(entree)` et `partie2(entree)`.

## L'idée

Pour trouver le chemin le plus court dans une grille où chaque pas compte pareil, on utilise un **parcours en largeur** (en anglais *BFS*, *breadth-first search*). On part d'une case, on visite toutes les cases à 1 pas, puis toutes celles à 2 pas, puis à 3 pas… comme une tache d'encre qui s'étale. La première fois qu'on atteint une case, c'est forcément par le chemin le plus court.

Pour visiter les cases dans le bon ordre, on les range dans une **file d'attente** (`VecDeque`) : on retire au début, on ajoute à la fin. On note les cases déjà atteintes pour ne pas les traiter deux fois.

Astuce pour la partie 2 : au lieu de lancer un parcours depuis chaque case `a`, lance **un seul parcours à l'envers, depuis `E`** (en inversant la règle : on peut aller de la case `h` vers la case `v` si `h` est au plus 1 plus haute que `v`). Tu obtiens la distance de chaque case jusqu'au sommet, et les deux parties se lisent dans le même tableau.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
