> [!info] Advent of Code 2024, jour 3
> Énigme originale : [adventofcode.com/2024/day/3](https://adventofcode.com/2024/day/3). L'histoire et l'exemple sont réécrits ici avec nos propres données.

L'ordinateur de la boutique de location de vélos a pris l'eau : sa mémoire est remplie de caractères parasites. Au milieu du désordre, on reconnaît encore des instructions de multiplication.

```text
+mul(3,4)*mul(10 ,2)%don't()_mul(5,5)?mul(2,3]
where(do()mul(100,2)from()mul(1234,1)what()mul(7,7)#don't()
xmul(6,6)'do(mul(1,9)do()]mul(4,6)
```

Une instruction **valide** s'écrit exactement `mul(X,Y)`, où `X` et `Y` sont des nombres de **1 à 3 chiffres**. Elle multiplie `X` par `Y`. Tout ce qui ne respecte pas ce format exactement ne fait **rien** : un espace en trop (`mul(10 ,2)`), un nombre de 4 chiffres (`mul(1234,1)`), une mauvaise parenthèse (`mul(2,3]`), des majuscules (`MUL(2,3)`)…

> [!info] Sans regex
> Dans d'autres langages, on utiliserait une **expression régulière** (regex : un petit langage pour décrire un motif de texte). Elles ne font pas partie de la bibliothèque standard de Rust : ici, tu analyses le texte **à la main**, position par position. C'est tout l'intérêt de l'exercice.

## Partie 1

Additionne les résultats de **toutes** les multiplications valides.

| Instruction | Valide ? | Résultat |
|---|---|---|
| `mul(3,4)` | oui | 12 |
| `mul(10 ,2)` | non (espace) | |
| `mul(5,5)` | oui | 25 |
| `mul(2,3]` | non (crochet) | |
| `mul(100,2)` | oui | 200 |
| `mul(1234,1)` | non (4 chiffres) | |
| `mul(7,7)` | oui | 49 |
| `mul(6,6)` | oui | 36 |
| `mul(1,9)` | oui | 9 |
| `mul(4,6)` | oui | 24 |

Réponse de l'exemple : **355**.

## Partie 2

La mémoire contient aussi deux autres instructions :

- `do()` **active** les multiplications qui suivent ;
- `don't()` les **désactive**.

Seule la dernière de ces deux instructions rencontrée compte. Au tout début, les multiplications sont **actives**. Toute la mémoire forme un seul programme : l'état continue d'une ligne à la suivante (ta vraie entrée a plusieurs lignes). Comme pour `mul`, l'écriture doit être exacte : `do(` sans la parenthèse fermante ne fait rien.

| Instruction | État | Compte ? |
|---|---|---|
| `mul(3,4)` | actif (début) | 12 |
| `don't()` | → inactif | |
| `mul(5,5)` | inactif | |
| `do()` | → actif | |
| `mul(100,2)` | actif | 200 |
| `mul(7,7)` | actif | 49 |
| `don't()` | → inactif | |
| `mul(6,6)` | inactif (depuis la ligne 2) | |
| `do(` | rien ne change | |
| `mul(1,9)` | inactif | |
| `do()` | → actif | |
| `mul(4,6)` | actif | 24 |

Réponse de l'exemple : **285**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
