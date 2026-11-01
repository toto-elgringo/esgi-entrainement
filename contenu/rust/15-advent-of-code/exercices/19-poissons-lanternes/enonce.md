> [!info] Advent of Code 2021, jour 6
> Énigme originale : [adventofcode.com/2021/day/6](https://adventofcode.com/2021/day/6). L'histoire et l'exemple sont réécrits ici avec nos propres données.

Sous ton sous-marin, un banc de **poissons-lanternes** grossit à vue d'œil. Chaque poisson a un **minuteur** : le nombre de jours avant sa prochaine naissance. Tu as relevé le minuteur de chaque poisson, sur une seule ligne :

```text
2,5,1,1,4
```

Chaque jour, tous les poissons changent en même temps :

- un minuteur qui vaut 1 ou plus baisse de 1 ;
- un minuteur qui vaut 0 repasse à **6**, et le poisson crée un **nouveau poisson** dont le minuteur vaut **8** (un bébé attend donc deux jours de plus avant sa première naissance).

Le nouveau poisson est ajouté à la fin de la liste. Il ne baisse pas le jour de sa naissance : il commence le lendemain.

| Jour | Minuteurs | Poissons |
|---|---|---|
| départ | 2,5,1,1,4 | 5 |
| 1 | 1,4,0,0,3 | 5 |
| 2 | 0,3,6,6,2,8,8 | 7 |
| 3 | 6,2,5,5,1,7,7,8 | 8 |
| 4 | 5,1,4,4,0,6,6,7 | 8 |
| 5 | 4,0,3,3,6,5,5,6,8 | 9 |

## Partie 1

Combien y a-t-il de poissons après **80 jours** ?

Dans l'exemple : **5977**.

## Partie 2

Combien y a-t-il de poissons après **256 jours** ? Le nombre devient énorme : utilise `u64`.

Dans l'exemple : **27125064097**.

Écris `partie1(entree)` et `partie2(entree)`.

## L'idée

Une liste avec un nombre par poisson marche pour 80 jours, mais pas pour 256 : elle contiendrait des milliards d'éléments et ne tiendrait pas en mémoire. Or deux poissons qui ont le même minuteur se comportent exactement pareil. Il suffit donc de savoir **combien** de poissons ont chaque minuteur : un tableau de **9 compteurs** (minuteurs 0 à 8).

Chaque jour, tous les compteurs descendent d'une case, et ceux qui étaient à 0 vont à la fois en case 6 (les parents) et en case 8 (les bébés). Un jour ne coûte plus que quelques opérations, quel que soit le nombre de poissons : c'est l'idée de **compter au lieu de simuler**.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
