Écris quatre générateurs qui **se souviennent** de ce qu'ils ont déjà vu. Ils doivent marcher sur des itérables **infinis** : on ne peut donc pas tout transformer en liste au début.

- `nouveautes(iterable)` : fournit chaque élément **la première fois** qu'il apparaît, et ignore les suivantes ;
- `doublons(iterable)` : fournit un élément au moment où il apparaît pour la **deuxième** fois (une seule fois par élément) ;
- `cumuls(iterable)` : fournit les sommes cumulées : `1, 2, 3, 4` donne `1, 3, 6, 10` ;
- `series(iterable)` : regroupe les éléments égaux qui se suivent, et fournit des couples `(élément, longueur)`.

```python
print(list(nouveautes("abracadabra")))   # ['a', 'b', 'r', 'c', 'd']
print(list(doublons("abracadabra")))     # ['a', 'b', 'r']
print(list(cumuls([1, 2, 3, 4])))        # [1, 3, 6, 10]
print(list(series("aaabcc")))            # [('a', 3), ('b', 1), ('c', 2)]
```
