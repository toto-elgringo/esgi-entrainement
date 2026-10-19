La classe `Employee` est fournie. Écris la classe `ITGuy`, qui **hérite** de `Employee` :

- `ITGuy(name, salary, computer)` initialise la partie `Employee` (en appelant son initialiseur), puis range l'ordinateur dans l'attribut `computer` ;
- `description()` est **redéfinie** : elle renvoie la description d'un employé suivie de l'ordinateur ;
- `augmenter` est héritée telle quelle.

```python
bob = ITGuy("Bob", 2000, "ASUS")
print(bob.description())   # Name : Bob, Salary : 2000, Computer : ASUS
bob.augmenter(10)
print(bob.salary)          # 2200.0
```

Ne recopie pas le code de `Employee` : réutilise-le.
