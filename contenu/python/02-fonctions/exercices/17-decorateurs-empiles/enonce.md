On peut mettre plusieurs décorateurs au-dessus d'une fonction. Écris trois décorateurs pour des fonctions qui renvoient un texte :

- `majuscules(func)` : met le résultat en majuscules ;
- `inverser(func)` : renvoie le résultat à l'envers (`"abc"` → `"cba"`) ;
- `encadrer(gauche, droite)` : un décorateur **avec paramètres**, qui ajoute `gauche` avant le résultat et `droite` après.

Puis **décore** les deux fonctions du code de départ (sans changer leur corps) pour obtenir :

```python
print(titre("python"))      # [NOHTYP]
print(etiquette("ok"))      # <[ko]>
```

Les trois décorateurs doivent garder le nom de la fonction décorée (`functools.wraps`).
