Écris la classe `Point`, qui représente un point du plan :

- `Point(x, y)` crée un point ; les coordonnées sont rangées dans les attributs `x` et `y` ;
- `distance_origine()` renvoie la distance entre le point et l'origine `(0, 0)` ;
- `deplacer(dx, dy)` **modifie** le point en ajoutant `dx` à `x` et `dy` à `y` ;
- `symetrique()` renvoie un **nouveau** point, symétrique par rapport à l'origine (`(-x, -y)`), sans modifier le point d'origine.

```python
p = Point(3, 4)
print(p.distance_origine())   # 5.0
p.deplacer(1, -1)
print(p.x, p.y)               # 4 3
```
