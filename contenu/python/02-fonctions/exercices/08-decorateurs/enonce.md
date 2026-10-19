Écris deux décorateurs :

- `en_majuscules(func)` : la fonction décorée renvoie le résultat de `func` **en majuscules** ;
- `compter_appels(func)` : la fonction décorée fonctionne normalement, et garde dans son attribut `appels` le nombre de fois où elle a été appelée.

```python
@en_majuscules
def saluer(nom):
    return "bonjour " + nom

print(saluer("ada"))       # BONJOUR ADA


@compter_appels
def addition(a, b):
    return a + b

addition(1, 2)
addition(3, b=4)
print(addition.appels)      # 2
```

Tes décorateurs doivent marcher avec des fonctions qui ont **n'importe quels** paramètres.
