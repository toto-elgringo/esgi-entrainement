Une **fenêtre glissante** de taille `n` parcourt une suite en regardant `n` éléments consécutifs à la fois : `[1, 2, 3, 4]` avec `n = 2` donne `(1, 2)`, `(2, 3)`, `(3, 4)`.

Écris deux fonctions qui renvoient un **générateur** :

- `fenetres(iterable, n)` : fournit les tuples de `n` éléments consécutifs ;
- `moyennes_mobiles(iterable, n)` : fournit la moyenne de chaque fenêtre. Elle doit rester rapide même pour de grandes fenêtres : ne recalcule pas la somme complète à chaque pas.

Toutes les deux doivent lever `ValueError` si `n <= 0`, **dès l'appel**, avant même qu'on parcoure le résultat. C'est le piège du code de départ : lance-le.

```python
print(list(fenetres("abcd", 3)))                  # [('a', 'b', 'c'), ('b', 'c', 'd')]
print(list(moyennes_mobiles([1, 2, 3, 4, 5], 2))) # [1.5, 2.5, 3.5, 4.5]
gen = fenetres([1, 2], 0)                         # ValueError ici, pas plus tard
```

Les itérables peuvent être **infinis**.
