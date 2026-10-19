Écris la classe `Fraction(numerateur, denominateur=1)`. Une fraction est **toujours simplifiée**, avec un **dénominateur positif** :

- `Fraction(6, 8)` est rangée comme `3/4` (attributs `num` et `den`) ;
- `Fraction(1, -2)` est rangée comme `-1/2` ;
- `Fraction(1, 0)` lève une `ZeroDivisionError`.

Méthodes à écrire :

| Méthode | Exemple |
|---|---|
| `__str__` | `str(Fraction(3, 4))` → `"3/4"`, et `str(Fraction(4, 2))` → `"2"` (dénominateur 1) |
| `__repr__` | `repr(Fraction(3, 4))` → `"Fraction(3, 4)"` |
| `__add__` | `Fraction(1, 2) + Fraction(1, 3)` → `5/6` |
| `__mul__` | `Fraction(2, 3) * Fraction(3, 4)` → `1/2` |
| `__eq__` | `Fraction(1, 2) == Fraction(2, 4)` → `True` |
| `__lt__` | `Fraction(1, 3) < Fraction(1, 2)` → `True` |

> [!tip] `math.gcd`
> `math.gcd(6, 8)` renvoie le plus grand diviseur commun : `2`.
