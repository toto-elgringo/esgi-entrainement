La classe `Forme` est fournie : sa méthode `aire()` lève `NotImplementedError` (chaque forme doit la redéfinir). Écris :

- dans `Forme`, la méthode `description()` qui renvoie par exemple `"Rectangle d'aire 6.00"` : le **nom de la classe réelle** de l'objet, puis son aire avec 2 décimales ;
- `Rectangle(largeur, hauteur)` ;
- `Carre(cote)`, qui hérite de `Rectangle` ;
- `Cercle(rayon)`, d'aire `π × rayon²` (`math.pi`) ;
- la fonction `aire_totale(formes)` qui renvoie la somme des aires d'une liste de formes.

```python
formes = [Rectangle(2, 3), Carre(2), Cercle(1)]
for f in formes:
    print(f.description())
# Rectangle d'aire 6.00
# Carre d'aire 4.00
# Cercle d'aire 3.14
```
