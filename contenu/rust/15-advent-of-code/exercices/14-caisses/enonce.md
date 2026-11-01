> [!info] Advent of Code 2022, jour 5
> Énigme originale : [adventofcode.com/2022/day/5](https://adventofcode.com/2022/day/5). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Au port, une grue range des **caisses** marquées d'une lettre, empilées en plusieurs piles. Ton entrée contient d'abord le **dessin** des piles, puis, après une ligne vide, la liste des **mouvements** de la grue :

```text
        [S] [G]
[U]     [F] [T]
[R] [J] [W] [H]
 1   2   3   4

move 2 from 1 to 2
move 3 from 2 to 1
move 1 from 1 to 4
move 2 from 4 to 2
```

Dans le dessin, la dernière ligne donne le numéro des piles. La pile 1 contient `R` (en bas) puis `U` (en haut), la pile 2 seulement `J`, la pile 3 `W`, `F`, `S` et la pile 4 `H`, `T`, `G`. Chaque pile occupe une colonne de 4 caractères : la lettre de la pile i (en comptant à partir de 0) est au caractère **1 + 4 × i** de la ligne.

> [!warning] Les espaces comptent
> Ne retire pas les espaces au début des lignes du dessin : dans `        [S] [G]`, ce sont eux qui disent que `S` est sur la pile 3. Par contre, certaines lignes peuvent être **plus courtes** que les autres (les espaces de fin ne sont pas toujours là).

`move 2 from 1 to 2` veut dire : prends **2 caisses** en haut de la pile **1** et pose-les sur la pile **2**.

## Partie 1

La grue déplace les caisses **une par une**. Quand elle en déplace plusieurs, la caisse du haut part en premier, donc l'**ordre s'inverse**. Après tous les mouvements, la réponse est la suite des lettres **en haut de chaque pile**, de la pile 1 à la dernière.

Les piles sont écrites de bas en haut :

| Mouvement | Pile 1 | Pile 2 | Pile 3 | Pile 4 |
|---|---|---|---|---|
| départ | R U | J | W F S | H T G |
| `move 2 from 1 to 2` | | J U R | W F S | H T G |
| `move 3 from 2 to 1` | R U J | | W F S | H T G |
| `move 1 from 1 to 4` | R U | | W F S | H T G J |
| `move 2 from 4 to 2` | R U | J G | W F S | H T |

Réponse de l'exemple : **UGST** (un `String`).

## Partie 2

La grue est en fait un modèle plus récent : elle soulève **plusieurs caisses d'un coup**. Le bloc déplacé **garde son ordre**.

| Mouvement | Pile 1 | Pile 2 | Pile 3 | Pile 4 |
|---|---|---|---|---|
| départ | R U | J | W F S | H T G |
| `move 2 from 1 to 2` | | J R U | W F S | H T G |
| `move 3 from 2 to 1` | J R U | | W F S | H T G |
| `move 1 from 1 to 4` | J R | | W F S | H T G U |
| `move 2 from 4 to 2` | J R | G U | W F S | H T |

Réponse de l'exemple : **RUST**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
