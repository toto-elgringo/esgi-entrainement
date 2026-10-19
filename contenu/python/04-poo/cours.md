# Programmation orientée objet

## 1. Vocabulaire

| Terme | Définition |
|---|---|
| **Objet** | une structure qui regroupe des **données** et des **fonctions** qui agissent dessus |
| **Classe** | le **modèle** qui décrit les attributs de tous les objets de ce type |
| **Instance** | un objet fabriqué à partir d'une classe : `emp1` est une instance de `Employee` |

Les **attributs** sont de trois sortes :

- **variable d'instance** : propre à **un** objet (le nom d'un employé) ;
- **variable de classe** : **partagée** par toutes les instances (le nombre total d'employés) ;
- **méthode** : une fonction définie dans la classe, qui travaille sur l'instance.

## 2. Définir une classe

```python
class Employee:
    """Classe de base de tous les employés."""
    emp_count = 0

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary
        Employee.emp_count += 1

    def display(self):
        print("Name :", self.name, ", Salary:", self.salary)


emp1 = Employee("Tom", 2000)
emp2 = Employee("Bob", 5000)
emp1.display()
emp2.display()
print("Total Employee %d" % Employee.emp_count)
```

- `emp_count = 0`, écrit dans le corps de la classe, est une **variable de classe**. On la modifie en passant par la classe : `Employee.emp_count += 1`.
- `__init__` est l'**initialiseur** : il est appelé automatiquement à la création de l'objet et définit les **variables d'instance** (`self.name`, `self.salary`).
- Pour créer une instance, on **appelle la classe** avec les paramètres de `__init__`, sans `self`.
- On accède aux attributs avec le **point** : `emp1.name`, `emp1.display()`.

### `self`

Le premier paramètre de chaque méthode est **`self`** : une référence vers l'objet sur lequel on appelle la méthode. On ne le donne **jamais** à l'appel, Python l'ajoute : `emp1.display()` équivaut à `Employee.display(emp1)`.

> [!warning] Oublier `self`
> - `def display():` sans `self` : l'appel `emp1.display()` lève une `TypeError` (Python passe l'objet, mais la méthode n'a pas de place pour lui).
> - `name = name` au lieu de `self.name = name` crée une variable locale, perdue à la fin de `__init__`.

### Ajouter et supprimer des attributs

Python permet d'ajouter, modifier ou supprimer une variable d'instance **à la volée**, sur un seul objet :

```python
class Employee:
    emp_count = 0

    def __init__(self, name):
        self.name = name
        Employee.emp_count += 1


emp1 = Employee("Tom")
emp2 = Employee("Bob")
emp1.age = 7
emp1.age = 8
print(emp1.age, hasattr(emp2, "age"))
del emp1.age
print(hasattr(emp1, "age"))

emp1.emp_count = 100
print(Employee.emp_count, emp1.emp_count, emp2.emp_count)
```

> [!warning] Variable de classe masquée
> **Lire** `emp1.emp_count` remonte à la classe si l'objet n'a pas cet attribut. Mais **écrire** `emp1.emp_count = 100` crée une variable d'instance sur `emp1` seulement : la variable de classe ne change pas.

## 3. Encapsulation et attributs privés

Python n'a **pas d'encapsulation stricte** : tout attribut est accessible de l'extérieur. Il y a des conventions :

| Écriture | Sens |
|---|---|
| `self.x` | public |
| `self._x` | interne : « ne pas toucher de l'extérieur » (simple convention) |
| `self.__x` | privé : Python le renomme en `_Classe__x`, donc `obj.__x` ne marche plus |

Pour lire ou modifier un attribut privé, on écrit des **accesseurs** `get_x` et `set_x`, qui peuvent vérifier les valeurs :

```python
class Compte:
    def __init__(self, solde):
        self.__solde = solde

    def get_solde(self):
        return self.__solde

    def set_solde(self, valeur):
        if valeur < 0:
            raise ValueError("solde négatif interdit")
        self.__solde = valeur


c = Compte(100)
c.set_solde(c.get_solde() + 50)
print(c.get_solde())
print(hasattr(c, "__solde"), c._Compte__solde)
```

## 4. Les propriétés

Les accesseurs sont lourds à écrire à l'usage. Une **propriété** permet d'écrire `obj.x` et `obj.x = valeur` tout en passant par un getter et un setter :

1. on écrit `_get_x` et `_set_x`, qui manipulent **`self._x`** ;
2. on déclare `x = property(_get_x, _set_x)` ;
3. on utilise directement `obj.x`.

```python
class Employee:
    def __init__(self, name):
        self.name = name

    def _get_name(self):
        return self._name

    def _set_name(self, name):
        if not name:
            raise ValueError("le nom ne peut pas être vide")
        self._name = name.capitalize()

    name = property(_get_name, _set_name)


e = Employee("tom")
print(e.name)
e.name = "bob"
print(e.name)
try:
    e.name = ""
except ValueError as erreur:
    print("Refusé :", erreur)
```

> [!warning] `self._name`, pas `self.name`
> Dans le getter, `return self.name` rappellerait le getter à l'infini (`RecursionError`). La propriété s'appelle `name`, la vraie donnée est rangée dans `_name`.

La même chose avec les **décorateurs** `@property` et `@x.setter` (l'écriture la plus courante) :

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, valeur):
        if valeur < -273.15:
            raise ValueError("en dessous du zéro absolu")
        self._celsius = valeur

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32


t = Temperature(20)
print(t.celsius, t.fahrenheit)
t.celsius = 100
print(t.fahrenheit)
```

Une propriété **sans setter** est en lecture seule : `t.fahrenheit = 50` lève une `AttributeError`.

## 5. Surcharge d'opérateurs

Si une classe définit `__add__(self, autre)`, on peut écrire `x1 + x2` : Python le traduit en `x1.__add__(x2)`. Ces méthodes entourées de doubles `_` sont les **méthodes spéciales** (liste complète dans la documentation Python, rubrique « Data model »).

| Méthode | Déclenchée par |
|---|---|
| `__add__`, `__sub__`, `__mul__` | `a + b`, `a - b`, `a * b` |
| `__eq__`, `__lt__` | `a == b`, `a < b` |
| `__len__`, `__contains__` | `len(a)`, `x in a` |
| `__str__` | `print(a)`, `str(a)` : texte lisible |
| `__repr__` | affichage dans l'interpréteur ou dans une liste : texte technique |

```python
class Vecteur:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, autre):
        return Vecteur(self.x + autre.x, self.y + autre.y)

    def __eq__(self, autre):
        return self.x == autre.x and self.y == autre.y

    def __str__(self):
        return "(" + str(self.x) + ", " + str(self.y) + ")"

    def __repr__(self):
        return "Vecteur(" + str(self.x) + ", " + str(self.y) + ")"


v = Vecteur(1, 2) + Vecteur(3, 4)
print(v)
print([v])
print(v == Vecteur(4, 6))
```

> [!info] Sans `__str__` ni `__eq__`
> `print(obj)` affiche `<__main__.Classe object at 0x...>`, et `==` teste si c'est **le même objet**, pas si le contenu est égal.

## 6. L'héritage

L'**héritage** permet de créer une classe à partir d'une autre : la classe **enfant** récupère tous les attributs et méthodes de la classe **parente**, et peut en ajouter.

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def display(self):
        print("Name :", self.name, ", Salary:", self.salary)


class ITGuy(Employee):
    def __init__(self, name, salary, computer):
        Employee.__init__(self, name, salary)
        self.computer = computer

    def display(self):
        super().display()
        print("Computer :", self.computer)


bob = ITGuy("Bob", 2000, "ASUS")
bob.display()
print(isinstance(bob, Employee), issubclass(ITGuy, Employee))
```

- `class ITGuy(Employee):` : `ITGuy` hérite de `Employee` ;
- l'initialiseur de l'enfant **doit appeler** celui du parent : `Employee.__init__(self, ...)` ou `super().__init__(...)` (sans `self`) ;
- l'enfant peut **redéfinir** une méthode (ici `display`), et appeler la version du parent avec `super()`.

### Polymorphisme : toutes les méthodes sont virtuelles

C'est toujours la méthode de la classe **réelle** de l'objet qui est appelée. Une même boucle traite donc des objets différents :

```python
class Animal:
    def parler(self):
        return "..."


class Chien(Animal):
    def parler(self):
        return "Wouf"


class Chat(Animal):
    def parler(self):
        return "Miaou"


for a in [Chien(), Chat(), Animal()]:
    print(type(a).__name__, ":", a.parler())
```

## 7. L'héritage multiple

Une classe peut hériter de **plusieurs** parents. Un `ITGuy` est à la fois un `Employee` et un `Geek` :

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def presentation(self):
        return self.name + " (employé)"


class Geek:
    def __init__(self, name, computer):
        self.name = name
        self.computer = computer

    def presentation(self):
        return self.name + " (geek)"


class ITGuy(Employee, Geek):
    def __init__(self, name, salary, computer):
        Employee.__init__(self, name, salary)
        Geek.__init__(self, name, computer)


bob = ITGuy("Bob", 2000, "ASUS")
print(bob.salary, bob.computer)
print(bob.presentation())
print([c.__name__ for c in ITGuy.__mro__])
```

> [!info] Ordre de recherche (MRO)
> Si plusieurs parents ont une méthode du même nom, Python prend celle du **premier parent listé**. L'ordre complet (*Method Resolution Order*) se lit dans `Classe.__mro__` : ici `ITGuy`, `Employee`, `Geek`, `object`.

> [!tip] « Est un » ou « a un » ?
> L'héritage convient quand l'enfant **est un** parent. Si l'objet **a un** élément (un `ITGuy` a un ordinateur), un simple attribut suffit souvent.
