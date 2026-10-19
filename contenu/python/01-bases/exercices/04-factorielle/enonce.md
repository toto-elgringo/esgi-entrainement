Écris la fonction `facto(x)` qui renvoie la factorielle de `x` (un entier positif ou nul) :

- `facto(0)` et `facto(1)` valent `1` ;
- `facto(5)` vaut `1 × 2 × 3 × 4 × 5 = 120`.

Tu peux l'écrire de façon **récursive** (la fonction s'appelle elle-même, comme dans le cours) ou avec une boucle `for`.

> [!info] Pas de débordement
> Les `int` de Python n'ont pas de limite : `facto(25)` donne un nombre de 26 chiffres, exact.
