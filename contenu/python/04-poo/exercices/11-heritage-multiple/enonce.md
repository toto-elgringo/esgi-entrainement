Les classes `Employee` et `Geek` sont fournies, et ont toutes les deux une méthode `presentation`. Écris la classe `ITGuy`, qui hérite **des deux**, dans cet ordre : `Employee` puis `Geek`.

- `ITGuy(name, salary, computer)` initialise la partie `Employee` **et** la partie `Geek` ;
- `presentation()` d'un `ITGuy` doit être celle d'`Employee` : `"Bob (employé)"` (ne la réécris pas, l'ordre des parents suffit) ;
- `fiche()` renvoie `"Bob (employé), salaire 2000, ordinateur ASUS"` ;
- `jouer()`, méthode de `Geek`, doit marcher sur un `ITGuy`.

```python
bob = ITGuy("Bob", 2000, "ASUS")
print(bob.presentation())   # Bob (employé)
print(bob.jouer())          # Bob joue sur son ASUS
print([c.__name__ for c in ITGuy.__mro__])
# ['ITGuy', 'Employee', 'Geek', 'object']
```
