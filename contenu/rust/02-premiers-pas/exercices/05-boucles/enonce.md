Écris trois fonctions, chacune avec une boucle différente :

1. `somme_des_pairs(n)` : la somme des nombres **pairs** entre 1 et `n` inclus, avec une boucle `for`.
   Exemple : `somme_des_pairs(6)` = 2 + 4 + 6 = `12`.
2. `puissance(base, exposant)` : `base` multiplié par lui-même `exposant` fois, **sans** utiliser `.pow()`.
   Exemple : `puissance(2, 10)` = `1024`, et `puissance(5, 0)` = `1`.
3. `plus_petit_diviseur(n)` : le plus petit nombre supérieur ou égal à 2 qui divise `n`, avec une boucle `while`.
   Exemple : `plus_petit_diviseur(15)` = `3`, `plus_petit_diviseur(13)` = `13`. On suppose `n >= 2`.

> [!tip] Rappel
> `a % b` donne le reste de la division de `a` par `b`. `n` est divisible par `d` quand `n % d == 0`.
