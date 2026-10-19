Un carnet de notes est un dictionnaire qui associe un nom d'élève à la liste de ses notes :

```python
carnet = {"Tom": [12, 15], "Ana": [18, 16, 17], "Bob": []}
```

Écris :

- `moyenne(notes)` : la moyenne d'une liste de notes, `0.0` si la liste est vide ;
- `moyennes(carnet)` : un dictionnaire nom → moyenne **arrondie à 2 décimales** (`round(x, 2)`) ;
- `meilleur_eleve(carnet)` : le nom de l'élève qui a la meilleure moyenne. En cas d'égalité, celui qui vient en premier dans l'ordre alphabétique. `None` si le carnet est vide ;
- `admis(carnet, seuil=10)` : la liste **triée** des noms dont la moyenne est supérieure ou égale au seuil ;
- `ajouter_note(carnet, nom, note)` : ajoute la note à l'élève (en créant l'élève s'il n'existe pas) et renvoie `True`. Si la note n'est pas entre 0 et 20, ne change rien et renvoie `False`.
