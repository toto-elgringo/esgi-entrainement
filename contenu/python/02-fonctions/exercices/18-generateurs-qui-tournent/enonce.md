Écris trois générateurs :

- `tourner(iterable)` : fournit les éléments, puis recommence, **sans fin**. Si l'itérable est **vide**, le générateur s'arrête tout de suite (au lieu de bloquer le programme) ;
- `tours(iterable, n)` : fournit les éléments `n` fois de suite, puis s'arrête (rien si `n <= 0`) ;
- `alterner(*iterables)` : prend un élément de chaque itérable à tour de rôle. Un itérable épuisé est simplement sauté.

```python
from itertools import islice

print(list(islice(tourner("ab"), 5)))           # ['a', 'b', 'a', 'b', 'a']
print(list(tourner([])))                        # []
print(list(tours([1, 2], 3)))                   # [1, 2, 1, 2, 1, 2]
print(list(alterner("abc", [1], "xy")))         # ['a', 1, 'x', 'b', 'y', 'c']
```

Les itérables reçus peuvent être des **générateurs** (qu'on ne peut parcourir qu'une fois), et pour `alterner`, des itérables **infinis**.
