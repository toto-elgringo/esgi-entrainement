Un fichier JSON contient les notes d'une classe. Chaque élève a un nom et un dictionnaire de notes, qui peut être vide :

```json
{
  "eleves": [
    {"nom": "Ben", "notes": {"maths": 10, "physique": 15, "histoire": 20}},
    {"nom": "Sophie", "notes": {"maths": 12, "physique": 4, "histoire": 18}},
    {"nom": "Lou", "notes": {}},
    {"nom": "Ana", "notes": {"maths": 16, "physique": 13}}
  ]
}
```

Écris trois fonctions qui prennent le chemin du fichier :

- `moyennes(chemin)` : la liste des couples `(nom, moyenne)`, dans l'ordre du fichier, la moyenne arrondie à une décimale, ou `None` si l'élève n'a aucune note ;
- `classement(chemin)` : la liste des noms des élèves qui ont au moins une note, de la meilleure moyenne à la moins bonne (ordre alphabétique en cas d'égalité) ;
- `meilleurs_par_matiere(chemin)` : le dictionnaire matière → nom de l'élève qui a la meilleure note. En cas d'égalité, c'est le **premier** du fichier qui l'emporte.

```python
moyennes("classe.json")
# [('Ben', 15.0), ('Sophie', 11.3), ('Lou', None), ('Ana', 14.5)]
classement("classe.json")
# ['Ben', 'Ana', 'Sophie']
meilleurs_par_matiere("classe.json")
# {'maths': 'Ana', 'physique': 'Ben', 'histoire': 'Ben'}
```
