Écris trois **générateurs** (des fonctions qui utilisent `yield`) :

- `pows(n, p)` : fournit les valeurs de 1 à `n` à la puissance `p`. `list(pows(3, 2))` → `[1, 4, 9]` ;
- `compte_a_rebours(n)` : fournit `n`, `n - 1`, ..., `1` ;
- `fibonacci()` : fournit **sans fin** la suite de Fibonacci `0, 1, 1, 2, 3, 5, 8, ...` (chaque nombre est la somme des deux précédents).

```python
f = fibonacci()
print(next(f), next(f), next(f), next(f))   # 0 1 1 2
```

Les tests vérifient que ce sont bien des générateurs : n'utilise pas de liste.
