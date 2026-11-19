Écris la fonction `numeroter(chemin, sauter_vides=False)`, qui renvoie la **liste** des lignes du fichier, chacune précédée de son numéro (à partir de 1) puis de `": "`.

Si le fichier contient :

```text
Bonjour

La programmation, c'est sympa !
```

alors :

```python
numeroter("message.txt")
# ['1: Bonjour', '2: ', "3: La programmation, c'est sympa !"]

numeroter("message.txt", sauter_vides=True)
# ['1: Bonjour', "3: La programmation, c'est sympa !"]
```

- Les retours à la ligne ne font pas partie du résultat, mais les autres espaces sont gardés tels quels.
- Avec `sauter_vides=True`, les lignes vides (ou faites uniquement d'espaces) sont retirées, mais les autres lignes gardent **leur vrai numéro** dans le fichier.
- La dernière ligne du fichier peut ne pas se terminer par un retour à la ligne.
