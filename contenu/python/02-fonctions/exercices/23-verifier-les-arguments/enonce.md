Le code de départ contient trois fonctions qui marchent sur les cas « normaux »... et se trompent dès qu'on sort des sentiers battus. Corrige-les.

- `somme_intervalle(debut, fin, pas=1)` : la somme des valeurs de `debut` à `fin` **incluses**, de `pas` en `pas`. Le pas peut être **négatif** (on descend). Si on ne peut pas aller de `debut` vers `fin` dans ce sens, la somme vaut `0`. Un pas nul lève `ValueError` ;
- `factorielle(n)` : renvoie `n!`. Lève `TypeError` si `n` n'est pas un entier (**les booléens `True` et `False` sont refusés**, tout comme `3.0`), et `ValueError` si `n < 0` ;
- `convertir_tous(*valeurs)` : renvoie la liste des valeurs converties en `float`. Si une valeur ne peut pas être convertie (`"abc"`, `None`, une liste...), lève une `TypeError` dont le message contient `repr(valeur)`, **en gardant l'erreur d'origine** comme cause (`raise ... from ...`).

```python
print(somme_intervalle(1, 10, 3))     # 1 + 4 + 7 + 10 = 22
print(somme_intervalle(10, 1, -3))    # 10 + 7 + 4 + 1 = 22
print(factorielle(5))                 # 120
factorielle(True)                     # TypeError
print(convertir_tous(1, "2.5", 3))    # [1.0, 2.5, 3.0]
convertir_tous(1, None)               # TypeError: valeur invalide : None
```
