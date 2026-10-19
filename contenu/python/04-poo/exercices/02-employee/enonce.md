Écris la classe `Employee` du cours :

- une **variable de classe** `emp_count`, qui compte le nombre d'employés créés ;
- `Employee(name, salary)` range le nom et le salaire dans les attributs `name` et `salary`, et augmente `emp_count` de 1 ;
- `description()` **renvoie** le texte `"Name : Tom, Salary : 2000"` ;
- `augmenter(pourcentage)` augmente le salaire du pourcentage donné, arrondi à 2 décimales. Un salaire de 2000 augmenté de 10 % devient 2200.0.

```python
emp1 = Employee("Tom", 2000)
emp2 = Employee("Bob", 5000)
print(emp1.description())        # Name : Tom, Salary : 2000
print(Employee.emp_count)        # 2
```
