La version récursive est juste, mais beaucoup trop lente : `fibonacci(90)` prendrait des siècles.

Réécris `fibonacci(n)` avec une **boucle** (version itérative) : seulement `n` additions au lieu de milliards d'appels.

Les tests demandent `fibonacci(90)` et `fibonacci(92)`. Avec le code actuel, la vérification sera arrêtée au bout de 10 secondes : essaie pour voir !

> [!tip] L'idée
> On avance deux nombres côte à côte : (0, 1) → (1, 1) → (1, 2) → (2, 3) → (3, 5)...
