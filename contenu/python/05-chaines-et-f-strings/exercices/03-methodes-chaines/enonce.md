Écris trois fonctions avec les méthodes des chaînes :

- `compter(texte, sous)` : le nombre d'apparitions de `sous` dans le texte, **sans tenir compte des majuscules**. `compter("Banane", "AN")` → `2` ;
- `censurer_voyelles(texte, caractere="*")` : remplace chaque voyelle minuscule (`aeiouy`) par le caractère. `censurer_voyelles("bonjour")` → `"b*nj**r"` ;
- `est_entier(texte)` : `True` si le texte représente un entier, éventuellement négatif : `"42"` et `"-12"` oui, `"4.2"`, `"12a"`, `"-"` et `""` non.
