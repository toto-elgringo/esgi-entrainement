Écris quatre fonctions qui utilisent `with open(...)` :

- `ecrire_lignes(chemin, lignes)` : écrit chaque chaîne de la liste sur sa propre ligne (en **remplaçant** le contenu du fichier s'il existe) ;
- `ajouter_ligne(chemin, ligne)` : ajoute une ligne **à la fin** du fichier, sans effacer ce qui y est ;
- `lire_lignes(chemin)` : renvoie la liste des lignes du fichier, **sans** les retours à la ligne ;
- `compter_lignes(chemin)` : renvoie le nombre de lignes du fichier, ou `0` si le fichier n'existe pas (intercepte `FileNotFoundError`).

```python
ecrire_lignes("courses.txt", ["pain", "lait"])
ajouter_ligne("courses.txt", "œufs")
print(lire_lignes("courses.txt"))   # ['pain', 'lait', 'œufs']
```

Utilise `encoding="utf-8"` pour que les accents passent partout.
