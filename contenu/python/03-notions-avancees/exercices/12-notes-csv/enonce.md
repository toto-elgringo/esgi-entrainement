Un fichier contient une note par ligne, au format `nom;note` :

```text
Tom;12.5
Ana;17

Bob;abc
Léa;14;bonus
Eva;8
```

Écris trois fonctions :

- `lire_notes(chemin)` : renvoie le dictionnaire nom → note (en `float`). Les lignes **vides** et **invalides** (pas exactement deux morceaux, ou note qui n'est pas un nombre) sont ignorées. Ici : `{"Tom": 12.5, "Ana": 17.0, "Eva": 8.0}` ;
- `ecrire_rapport(notes, chemin)` : écrit un fichier avec une ligne par élève, **par ordre alphabétique**, au format `Ana : 17.0/20` (une décimale) ;
- `moyenne_classe(chemin)` : renvoie la moyenne des notes valides du fichier, ou `None` s'il n'y en a aucune.
