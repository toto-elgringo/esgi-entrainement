Un petit jeu garde les scores de ses joueurs dans un fichier JSON. Écris trois fonctions :

- `sauvegarder(chemin, donnees)` : écrit les données dans le fichier en JSON **lisible** : indenté de 2 espaces, et avec les accents écrits tels quels (`Élodie`, pas `Élodie`) ;
- `charger(chemin, defaut)` : renvoie les données lues dans le fichier. Si le fichier **n'existe pas** ou ne contient **pas du JSON valide**, renvoie `defaut` au lieu de planter ;
- `ajouter_score(chemin, joueur, points)` : ajoute `points` au score du joueur (qui part de 0 s'il n'est pas encore dans le fichier), enregistre le fichier, et renvoie le nouveau score du joueur.

```python
ajouter_score("scores.json", "Élodie", 10)   # 10 (le fichier n'existait pas)
ajouter_score("scores.json", "Tom", 4)       # 4
ajouter_score("scores.json", "Élodie", 5)    # 15
charger("scores.json", {})                   # {'Élodie': 15, 'Tom': 4}
```

Le fichier contient alors :

```json
{
  "Élodie": 15,
  "Tom": 4
}
```
