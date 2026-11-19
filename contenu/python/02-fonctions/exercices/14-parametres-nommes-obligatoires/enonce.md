Un paramètre placé **après** `*args`, ou après un `*` seul, est **nommé obligatoire** : on ne peut le donner que par mot-clé. Cela rend les appels lisibles (`compter(t, "a", ignorer_casse=True)` plutôt que `compter(t, "a", True)`).

Écris trois fonctions, avec **exactement** ces noms de paramètres (les tests les utilisent par mot-clé) :

- `arrondir_tous(*nombres, decimales=0)` : renvoie la **liste** des nombres arrondis avec `round(x, decimales)`. `arrondir_tous(1.26, 2.5, decimales=1)` → `[1.3, 2.5]` ;
- `compter(texte, motif, *, ignorer_casse=False)` : renvoie le nombre d'apparitions de `motif` dans `texte`, sans tenir compte des majuscules si `ignorer_casse` est vrai. `compter("Aa a", "a", True)` doit être **refusé** par Python (`TypeError`) ;
- `masquer(texte, visibles=4, *, caractere="*")` : remplace tous les caractères par `caractere`, sauf les `visibles` derniers. Si le texte n'est pas plus long que `visibles`, il est renvoyé tel quel.

```python
print(masquer("1234567812345678"))                  # ************5678
print(masquer("secret", visibles=0, caractere="#")) # ######
print(masquer("abc"))                               # abc
```

> [!warning] Les noms comptent
> Avec `def masquer(texte, visible=4)` (sans *s*), l'appel `masquer(t, visibles=2)` plante. Évite aussi les noms des fonctions intégrées (`pow`, `sum`, `max`...) : ils les masquent dans ta fonction.
