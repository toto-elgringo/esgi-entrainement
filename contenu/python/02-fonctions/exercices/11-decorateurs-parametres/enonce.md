Écris deux décorateurs **qui prennent un paramètre** :

- `repeter(n)` : la fonction décorée est appelée `n` fois, et renvoie la **liste** des `n` résultats ;
- `limiter(maximum)` : la fonction décorée peut être appelée au plus `maximum` fois. Les appels suivants lèvent une `RuntimeError` avec le message `"trop d'appels"`.

```python
@repeter(3)
def bonjour(nom):
    return "Bonjour " + nom

print(bonjour("Ada"))   # ['Bonjour Ada', 'Bonjour Ada', 'Bonjour Ada']


@limiter(2)
def tirer():
    return "pan"

tirer()
tirer()
tirer()                 # RuntimeError: trop d'appels
```
