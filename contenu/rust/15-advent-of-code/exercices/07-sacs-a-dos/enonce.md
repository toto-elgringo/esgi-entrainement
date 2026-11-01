> [!info] Advent of Code 2022, jour 3
> Énigme originale : [adventofcode.com/2022/day/3](https://adventofcode.com/2022/day/3). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Une troupe de randonneurs prépare ses sacs à dos. Chaque objet est noté par **une lettre**, et une minuscule n'est pas le même objet que sa majuscule (`a` et `A` sont deux objets différents). Chaque ligne donne le contenu d'un sac :

```text
dBKacehGjcif
oKnPlmtPsuqr
zAwyvxDyFKCE
JMmHLISQNMRO
WgXTVUbZmYga
qmprnovrtwsu
```

Chaque sac a **deux poches** qui contiennent autant d'objets l'une que l'autre : la première moitié de la ligne est la première poche, la seconde moitié est la seconde poche. Chaque objet a une **priorité** : de `a` à `z`, 1 à 26 ; de `A` à `Z`, 27 à 52.

## Partie 1

Dans chaque sac, il y a exactement **un** objet rangé dans les deux poches à la fois (il peut y être plusieurs fois). Trouve-le et additionne les priorités de ces objets.

| Sac | Poche 1 | Poche 2 | Objet commun | Priorité |
|---|---|---|---|---|
| 1 | `dBKace` | `hGjcif` | `c` | 3 |
| 2 | `oKnPlm` | `tPsuqr` | `P` | 42 |
| 3 | `zAwyvx` | `DyFKCE` | `y` | 25 |
| 4 | `JMmHLI` | `SQNMRO` | `M` | 39 |
| 5 | `WgXTVU` | `bZmYga` | `g` | 7 |
| 6 | `qmprno` | `vrtwsu` | `r` | 18 |

Réponse de l'exemple : **134**.

## Partie 2

Les randonneurs marchent par **groupes de trois** : les lignes 1 à 3 forment le premier groupe, les lignes 4 à 6 le deuxième, etc. Dans chaque groupe, un seul objet se trouve dans les trois sacs (n'importe où dans le sac, peu importe la poche) : c'est le **badge** du groupe. Additionne les priorités des badges.

- Groupe 1 : seul `K` est dans les trois sacs → priorité 37.
- Groupe 2 : seul `m` est dans les trois sacs → priorité 13.

Réponse de l'exemple : **50**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
