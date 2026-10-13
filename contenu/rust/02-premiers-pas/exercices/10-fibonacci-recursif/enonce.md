La suite de Fibonacci : chaque nombre est la somme des deux précédents.

```text
F(0) = 0
F(1) = 1
F(n) = F(n - 1) + F(n - 2)
```

Ce qui donne : 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...

Écris `fibonacci(n)` de façon **récursive** (la fonction s'appelle elle-même), en recopiant directement la définition.

> [!warning] Lent !
> Chaque appel en fait deux autres : le temps double presque à chaque fois que `n` augmente de 1. Essaie `fibonacci(40)` dans `main` avec « Exécuter » pour le sentir.
