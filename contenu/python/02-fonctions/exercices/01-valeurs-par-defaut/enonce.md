Écris deux fonctions qui utilisent des **valeurs par défaut** :

- `saluer(nom, salutation="Bonjour", ponctuation="!")` : renvoie par exemple `"Bonjour Ada!"`. On doit pouvoir écrire `saluer("Ada", ponctuation="?")` → `"Bonjour Ada?"` ;
- `prix_ttc(prix_ht, taux=0.2)` : renvoie le prix toutes taxes comprises, **arrondi à 2 décimales**. `prix_ttc(100)` → `120.0`, `prix_ttc(100, taux=0.055)` → `105.5`.

Les tests appellent tes fonctions par position **et** par mot-clé : garde exactement ces noms de paramètres.
