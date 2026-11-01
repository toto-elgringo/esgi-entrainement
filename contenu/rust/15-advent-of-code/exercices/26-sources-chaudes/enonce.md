> [!info] Advent of Code 2023, jour 12
> Énigme originale : [adventofcode.com/2023/day/12](https://adventofcode.com/2023/day/12). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Dans une station thermale, des **sources chaudes** sont alignées en rangées. Certaines sont **abîmées**. Le registre de la station est en piteux état : pour chaque rangée, une partie des états est illisible.

```text
?#?.#?? 2,1,1
..??#??.# 4,1
???.?#. 1,1,1
#??.??##. 2,4
.?.?#?#?. 1,3
??##?.?? 4,1
?????.#? 2,1,1
```

Chaque ligne décrit une rangée en deux morceaux :

- le **motif** : `#` pour une source abîmée, `.` pour une source en état, `?` pour une source dont on ne connaît pas l'état ;
- les **groupes** : la taille de chaque **groupe** de sources abîmées qui se suivent, dans l'ordre de la rangée. Deux groupes sont toujours séparés par au moins une source en état.

Par exemple, la rangée `#.##..#` correspond aux groupes `1,2,1`.

## Partie 1

Pour chaque ligne, compte de combien de façons on peut remplacer chaque `?` par `#` ou `.` pour que la rangée respecte exactement ses groupes. Additionne ces nombres sur toutes les lignes.

Pour la première ligne, `?#?.#?? 2,1,1`, il y a **2** possibilités : `##..#.#` et `.##.#.#`.

| Ligne | Possibilités |
|---|---|
| `?#?.#?? 2,1,1` | 2 |
| `..??#??.# 4,1` | 2 |
| `???.?#. 1,1,1` | 1 |
| `#??.??##. 2,4` | 1 |
| `.?.?#?#?. 1,3` | 1 |
| `??##?.?? 4,1` | 4 |
| `?????.#? 2,1,1` | 3 |

Réponse de l'exemple : **14**.

## Partie 2

En regardant mieux, le registre était **plié** ! Pour déplier une ligne, on recopie son motif **5 fois**, avec un `?` entre deux copies, et on recopie sa liste de groupes **5 fois**. Par exemple, la ligne `?#. 2` devient :

```text
?#.??#.??#.??#.??#. 2,2,2,2,2
```

Avec les lignes dépliées, compte à nouveau les possibilités et additionne-les. Le total devient énorme : utilise `u64`.

| Ligne de l'exemple | Possibilités une fois dépliée |
|---|---|
| `?#?.#?? 2,1,1` | 162 |
| `..??#??.# 4,1` | 32 |
| `???.?#. 1,1,1` | 81 |
| `#??.??##. 2,4` | 16 |
| `.?.?#?#?. 1,3` | 16 |
| `??##?.?? 4,1` | 2500 |
| `?????.#? 2,1,1` | 15160 |

Réponse de l'exemple : **17967**.

Écris `partie1(entree)` et `partie2(entree)`.

## L'idée

Essayer toutes les façons de remplacer les `?` marche pour la partie 1, mais une ligne dépliée peut contenir près de 100 `?`. Avec 80 `?`, il y a déjà 2⁸⁰ façons de les remplacer, un nombre à 25 chiffres. Il faut **compter sans énumérer**.

Regarde seulement le **premier** caractère de la rangée. S'il peut être `.`, on le saute et on compte les possibilités pour le reste. S'il peut être le début du premier groupe (de taille `t`), il faut que les `t` premières cases puissent toutes être `#` et que la case d'après puisse être `.` : on saute alors tout ce morceau et on compte pour le reste avec les groupes restants. Le total est la somme des deux. C'est une fonction **récursive** (qui s'appelle elle-même), avec des cas de fin simples : plus de groupes à placer, ou plus de cases.

Seule, cette récursion recalcule des millions de fois les mêmes questions. D'où la **mémoïsation** : on note chaque résultat dans un **cache** (un tableau indexé par « ce qu'il reste du motif » et « ce qu'il reste de groupes ») et on le réutilise au lieu de le recalculer. C'est de la **programmation dynamique** : chaque petite question n'est résolue qu'une seule fois, et le calcul devient instantané.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
