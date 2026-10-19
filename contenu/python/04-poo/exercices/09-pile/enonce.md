Une **pile** fonctionne comme une pile d'assiettes : on ajoute et on retire toujours **par le dessus** (le dernier arrivé sort en premier). Écris la classe `Pile` :

- `empiler(x)` : ajoute `x` au sommet ;
- `depiler()` : retire et renvoie l'élément du sommet. Lève `IndexError("pile vide")` si la pile est vide ;
- `sommet()` : renvoie l'élément du sommet **sans** le retirer (même erreur si la pile est vide) ;
- `__len__` : pour que `len(pile)` donne le nombre d'éléments (et qu'une pile vide soit fausse dans un `if`) ;
- `__repr__` : `Pile([1, 2, 3])` (du bas vers le sommet).

```python
p = Pile()
p.empiler(1)
p.empiler(2)
print(p, len(p))   # Pile([1, 2]) 2
print(p.depiler()) # 2
```
