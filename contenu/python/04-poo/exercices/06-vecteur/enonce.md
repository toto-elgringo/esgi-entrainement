Écris la classe `Vecteur(x, y)` pour que ces opérations marchent :

| Écriture | Méthode | Résultat |
|---|---|---|
| `Vecteur(1, 2) + Vecteur(3, 4)` | `__add__` | `Vecteur(4, 6)` |
| `Vecteur(5, 5) - Vecteur(1, 2)` | `__sub__` | `Vecteur(4, 3)` |
| `Vecteur(1, 2) * 3` | `__mul__` | `Vecteur(3, 6)` |
| `Vecteur(1, 2) == Vecteur(1, 2)` | `__eq__` | `True` |
| `repr(Vecteur(1, 2))` | `__repr__` | `"Vecteur(1, 2)"` |
| `Vecteur(3, 4).norme()` | méthode normale | `5.0` |

Les opérations renvoient un **nouveau** vecteur et ne modifient jamais ceux de départ.
