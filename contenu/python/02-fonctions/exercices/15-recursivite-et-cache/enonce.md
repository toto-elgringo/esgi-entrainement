Une fonction **récursive** s'appelle elle-même. C'est souvent la façon la plus simple d'écrire une définition mathématique... mais attention au temps de calcul.

Le code de départ calcule Fibonacci (`fibo(0) = 0`, `fibo(1) = 1`, puis chaque terme est la somme des deux précédents) de façon récursive. Il est juste, mais **très lent** : lance-le.

1. Garde l'écriture récursive, mais ajoute un **cache** pour que `fibo(200)` réponde instantanément. `fibo(n)` avec `n < 0` doit lever `ValueError`.
2. Écris `nb_chemins(lignes, colonnes)` : le nombre de chemins pour aller de la case en haut à gauche à la case en bas à droite d'une grille, en ne faisant que des pas **vers la droite** ou **vers le bas**. Écris-la récursivement, avec un cache.

```python
print(nb_chemins(2, 2))    # 2 : droite puis bas, ou bas puis droite
print(nb_chemins(3, 3))    # 6
print(nb_chemins(1, 10))   # 1 : une seule ligne, on va tout droit
```

Les tests vérifient que `fibo(200)` et `nb_chemins(16, 16)` répondent en moins d'une seconde.
