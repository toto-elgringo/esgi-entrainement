> [!info] Advent of Code 2024, jour 5
> Énigme originale : [adventofcode.com/2024/day/5](https://adventofcode.com/2024/day/5). L'histoire et l'exemple sont réécrits ici avec nos propres données.

L'imprimerie du pôle Nord prépare les **mises à jour** du manuel de sécurité. Chaque mise à jour est une liste de numéros de pages à imprimer, mais certaines pages doivent passer **avant** d'autres. Ton entrée contient d'abord les **règles**, puis, après une ligne vide, les **mises à jour** :

```text
21|72
55|16
87|55
34|55
21|34
87|34
87|16
34|16
16|72
21|55
55|72
34|72
87|72
21|87
21|16

21,34,16
87,55,72,16,34
21,87,55,16,72
72,21,34
87,16,72
16,87,21,55,72
```

La règle `21|72` veut dire : si une mise à jour contient les pages 21 **et** 72, la page 21 doit être imprimée quelque part **avant** la page 72 (pas forcément juste avant). Une règle dont une des deux pages est absente de la mise à jour ne compte pas.

## Partie 1

Trouve les mises à jour **déjà dans le bon ordre** (qui respectent toutes les règles), puis fais la **somme de leur page du milieu** (chaque mise à jour a un nombre impair de pages).

| Mise à jour | Bon ordre ? | Page du milieu |
|---|---|---|
| `21,34,16` | oui | 34 |
| `87,55,72,16,34` | non : 16 doit passer avant 72 | |
| `21,87,55,16,72` | oui | 55 |
| `72,21,34` | non : 21 doit passer avant 72 | |
| `87,16,72` | oui | 16 |
| `16,87,21,55,72` | non : 87 doit passer avant 16 | |

Réponse de l'exemple : 34 + 55 + 16 = **105**.

## Partie 2

Prends seulement les mises à jour **dans le mauvais ordre**, et remets leurs pages dans le bon ordre en suivant les règles. Fais la somme de leur page du milieu **après** la remise en ordre.

| Mise à jour | Remise en ordre | Page du milieu |
|---|---|---|
| `87,55,72,16,34` | `87,34,55,16,72` | 55 |
| `72,21,34` | `21,34,72` | 34 |
| `16,87,21,55,72` | `21,87,55,16,72` | 55 |

Réponse de l'exemple : 55 + 34 + 55 = **144**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
