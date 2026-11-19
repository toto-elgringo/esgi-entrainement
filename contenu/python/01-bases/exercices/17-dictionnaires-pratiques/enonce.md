Quatre fonctions sur les dictionnaires :

- `traduire(phrase, lexique)` : remplace chaque mot de la phrase par sa traduction quand il est une clé de `lexique`, et garde les autres mots tels quels. `traduire("le chat noir", {"chat": "cat", "noir": "black"})` → `"le cat black"` ;
- `relier(classe_de, salle_de)` : `classe_de` associe un élève à sa classe, `salle_de` une classe à sa salle. Renvoie le dictionnaire élève → salle. Un élève dont la classe n'a pas de salle n'apparaît pas ;
- `regrouper_par_longueur(mots)` : le dictionnaire longueur → **liste triée** des mots **différents** de cette longueur. `regrouper_par_longueur(["bus", "car", "vélo", "bus"])` → `{3: ["bus", "car"], 4: ["vélo"]}` ;
- `retirer_cles(d, cles)` : supprime du dictionnaire **reçu** les clés de la liste `cles` qui y sont, et renvoie le nombre de clés supprimées.

```python
classe_de = {"Ana": "B1", "Tom": "B2", "Eva": "B3"}
salle_de = {"B1": "A101", "B2": "A204"}
print(relier(classe_de, salle_de))
# {'Ana': 'A101', 'Tom': 'A204'}
```
