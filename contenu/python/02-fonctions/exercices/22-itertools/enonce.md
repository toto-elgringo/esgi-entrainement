Le module `itertools` contient des générateurs tout faits, très utiles. Écris chaque fonction en t'en servant (chacune **renvoie une liste**, ou un dictionnaire pour la dernière) :

| Fonction | Renvoie | Outil |
|---|---|---|
| `premiers(iterable, n)` | les `n` premiers éléments (l'itérable peut être infini) | `islice` |
| `paires(elements)` | toutes les paires `(a, b)` d'éléments distincts, `a` avant `b` | `combinations` |
| `codes(symboles, longueur)` | tous les textes de `longueur` symboles | `product` |
| `totaux(nombres)` | les sommes cumulées | `accumulate` |
| `regrouper(mots)` | dictionnaire : première lettre → liste des mots, dans l'ordre d'origine | `groupby` |

```python
from itertools import count

print(premiers(count(10), 3))              # [10, 11, 12]
print(paires("abc"))                       # [('a', 'b'), ('a', 'c'), ('b', 'c')]
print(codes("01", 2))                      # ['00', '01', '10', '11']
print(totaux([3, 1, 4]))                   # [3, 4, 8]
print(regrouper(["bus", "avion", "bateau", "auto"]))
# {'a': ['avion', 'auto'], 'b': ['bus', 'bateau']}
```
