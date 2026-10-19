Écris la classe `Livre(titre, auteur, annee)` avec trois méthodes spéciales :

- `__str__` : le texte lisible, utilisé par `print` : `1984, George Orwell (1949)` ;
- `__repr__` : le texte technique, utilisé dans une liste ou l'interpréteur : `Livre('1984', 'George Orwell', 1949)` ;
- `__eq__` : deux livres sont égaux s'ils ont le même titre, le même auteur et la même année.

```python
livre = Livre("1984", "George Orwell", 1949)
print(livre)       # 1984, George Orwell (1949)
print([livre])     # [Livre('1984', 'George Orwell', 1949)]
print(livre == Livre("1984", "George Orwell", 1949))   # True
```
