Un polynôme est donné par la liste de ses coefficients, **du degré 0 au plus haut degré** : `coefs[i]` est le coefficient de `x` puissance `i`. Par exemple `[10, 0.5, 0, 0, 1]` représente `10 + 0,5 x + x⁴`.

Écris trois fonctions :

- `valeur_polynome(coefs, x)` : la valeur du polynôme en `x`. Liste vide : `0` ;
- `derivee(coefs)` : la liste des coefficients du polynôme dérivé. La dérivée d'une constante est la liste vide ;
- `indices_extremes(valeurs)` : le couple `(indice du minimum, indice du maximum)`. Si le minimum ou le maximum apparaît plusieurs fois, on garde l'indice de sa **première** apparition. Liste vide : `ValueError`.

```python
print(valeur_polynome([0, 2, 4], 3))           # 2×3 + 4×3² = 42
print(valeur_polynome([10, 0.5, 0, 0, 1], 2))  # 10 + 1 + 16 = 27.0
print(derivee([10, 0.5, 0, 0, 1]))             # [0.5, 0, 0, 4]
print(indices_extremes([4, 1, 9, 1, 9]))       # (1, 2)
```

> [!warning] Le piège du code de départ
> `valeur_polynome` y donne un résultat faux sans aucune erreur, et `indices_extremes` renvoie la mauvaise occurrence. Lance les tests.
