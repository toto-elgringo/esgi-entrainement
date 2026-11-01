> [!info] Advent of Code 2023, jour 1
> Énigme originale : [adventofcode.com/2023/day/1](https://adventofcode.com/2023/day/1). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Avant de lancer une montgolfière, il faut régler le brûleur à partir d'un vieux carnet. Un enfant a gribouillé dessus : chaque ligne est maintenant pleine de lettres en trop.

```text
q7zx2kb
fiveab3cd
4nkfoureightwo
twonepq
zero5nine
xsevenx
9
```

La **valeur** d'une ligne s'obtient en collant son **premier** chiffre et son **dernier** chiffre, pour former un nombre à deux chiffres. S'il n'y a qu'un seul chiffre, il sert deux fois (`ab3cd` → 33). Une ligne sans aucun chiffre vaut 0. La réponse est la somme des valeurs de toutes les lignes.

## Partie 1

Seuls les vrais chiffres (`7`, `2`…) comptent : un mot comme `five` n'est qu'une suite de lettres.

| Ligne | Chiffres trouvés | Valeur |
|---|---|---|
| `q7zx2kb` | 7, 2 | 72 |
| `fiveab3cd` | 3 | 33 |
| `4nkfoureightwo` | 4 | 44 |
| `twonepq` | aucun | 0 |
| `zero5nine` | 5 | 55 |
| `xsevenx` | aucun | 0 |
| `9` | 9 | 99 |

Réponse de l'exemple : **303**.

## Partie 2

Certains chiffres sont en fait **écrits en lettres**, et ils comptent aussi. Attention : le carnet (et ta vraie entrée) est **en anglais**. Les mots à reconnaître sont donc `one` (1), `two` (2), `three` (3), `four` (4), `five` (5), `six` (6), `seven` (7), `eight` (8) et `nine` (9). Le mot `zero` ne compte pas.

Piège : deux mots peuvent **partager une lettre**. Dans `twone`, on lit `two` **puis** `one` (le `o` sert aux deux) ; dans `eightwo`, on lit `eight` puis `two`.

| Ligne | Chiffres trouvés | Valeur |
|---|---|---|
| `q7zx2kb` | 7, 2 | 72 |
| `fiveab3cd` | five, 3 | 53 |
| `4nkfoureightwo` | 4, four, eight, two | 42 |
| `twonepq` | two, one | 21 |
| `zero5nine` | 5, nine | 59 |
| `xsevenx` | seven | 77 |
| `9` | 9 | 99 |

Réponse de l'exemple : **423**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
