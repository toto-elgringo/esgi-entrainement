> [!info] Advent of Code 2024, jour 11
> Énigme originale : [adventofcode.com/2024/day/11](https://adventofcode.com/2024/day/11). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Dans un temple oublié, une rangée de **cailloux** porte chacun un nombre gravé. Bizarrement, chaque fois que tu **clignes des yeux**, tous les cailloux changent en même temps. Voici la rangée, sur une seule ligne :

```text
0 1000 7 63
```

À chaque clignement, chaque caillou suit la **première** règle qui lui correspond :

1. s'il porte `0`, il devient un caillou `1` ;
2. si son nombre a un **nombre pair de chiffres**, il se coupe en **deux cailloux** : la moitié gauche des chiffres et la moitié droite (on retire les zéros inutiles au début : `1000` donne `10` et `0`, pas `00`) ;
3. sinon, son nombre est **multiplié par 2024**.

Les cailloux gardent leur ordre, mais l'ordre n'a aucune importance pour compter.

| Clignement | Cailloux | Nombre |
|---|---|---|
| départ | `0 1000 7 63` | 4 |
| 1 | `1 10 0 14168 6 3` | 6 |
| 2 | `2024 1 0 1 28676032 12144 6072` | 7 |
| 3 | `20 24 2024 1 2024 2867 6032 24579456 60 72` | 10 |

Au clignement 1 : `0` devient `1`, `1000` se coupe en `10` et `0`, `7` (un seul chiffre) devient 7 × 2024 = `14168`, et `63` se coupe en `6` et `3`.

## Partie 1

Combien y a-t-il de cailloux après **25 clignements** ?

Dans l'exemple : **113332**.

## Partie 2

Combien y a-t-il de cailloux après **75 clignements** ? Utilise `u64`.

Dans l'exemple : **135338965633660**.

Écris `partie1(entree)` et `partie2(entree)`.

## L'idée

Garder la liste complète marche pour 25 clignements, mais pas pour 75 : il faudrait plus de cent mille milliards de cailloux en mémoire. Heureusement, le même nombre revient sans arrêt (`0`, `1`, `2024`, `20`, `24`…), et deux cailloux qui portent le même nombre donneront exactement la même descendance.

On range donc les cailloux par nombre gravé dans un `HashMap` (nombre → combien de cailloux le portent) : à chaque clignement, on transforme chaque nombre **une seule fois** et on reporte son effectif sur ses résultats. Il n'y a que quelques milliers de nombres différents, le calcul devient instantané.

Autre façon de voir la même idée : la **mémoïsation**. Une fonction `compter(caillou, clignements)` qui renvoie le nombre de cailloux obtenus se rappelle elle-même, et on **mémorise** chaque résultat dans un cache (`HashMap<(u64, u32), u64>`) pour ne jamais recalculer deux fois la même question.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
