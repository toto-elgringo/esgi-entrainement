Un bon décorateur marche avec **n'importe quelle** fonction, et ne la « déguise » pas : sans précaution, la fonction décorée s'appelle `wrapper` et perd sa docstring.

Écris deux décorateurs, qui gardent le nom et la docstring de la fonction décorée (`functools.wraps`) :

- `memoriser(func)` : garde en mémoire le résultat de chaque appel (arguments **par position** seulement). Si on rappelle la fonction avec les mêmes arguments, le résultat est renvoyé **sans** rappeler `func` ;
- `refuser_negatifs(func)` : avant d'appeler `func`, vérifie tous les arguments (par position **et** par mot-clé) ; si l'un d'eux est un nombre négatif, lève `ValueError` avec un message qui contient le nom de la fonction. Les arguments qui ne sont pas des nombres ne sont pas vérifiés.

```python
@refuser_negatifs
def surface(largeur, hauteur=1):
    """Surface d'un rectangle."""
    return largeur * hauteur


print(surface(3, hauteur=4))   # 12
print(surface.__name__)        # surface (et non wrapper)
surface(3, hauteur=-1)         # ValueError: surface : argument négatif
```
