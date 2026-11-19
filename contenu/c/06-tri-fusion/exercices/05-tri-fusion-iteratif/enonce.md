Le tri fusion peut aussi s'écrire **sans appel récursif**, en partant des petits morceaux :

```text
largeur 1 :  [7] [3] [10] [2] [9] [3] [6]   ->  [3 7] [2 10] [3 9] [6]
largeur 2 :  [3 7] [2 10] [3 9] [6]          ->  [2 3 7 10] [3 6 9]
largeur 4 :  [2 3 7 10] [3 6 9]              ->  [2 3 3 6 7 9 10]
```

À chaque passage, on fusionne les blocs voisins deux par deux, puis la largeur des blocs double. On s'arrête quand un bloc couvre tout le tableau.

La fonction `fusionnerParties(t, aux, debut, milieu, fin)` est **déjà écrite** (comme dans le cours). Écris `triFusionIteratif(t, n)`, **sans récursivité** :

- `aux` : un brouillon de `n` cases, réservé une fois avec `malloc` et libéré avec `free` ;
- si `n < 2`, rien à faire ;
- `n` n'est pas forcément une puissance de 2 : le dernier bloc peut être plus court, ou ne pas avoir de voisin.
