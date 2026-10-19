Écris ces fonctions avec `sorted`, `max` et le paramètre `key` :

- `trier_par_longueur(mots)` : les mots du plus court au plus long (à longueur égale, l'ordre d'origine est gardé) ;
- `classement(eleves)` : `eleves` est une liste de tuples `(nom, note)`. Renvoie la liste triée par **note décroissante**, puis par **nom** en cas d'égalité ;
- `plus_long(mots)` : le mot le plus long (le premier en cas d'égalité), `""` si la liste est vide ;
- `mediane(nombres)` : la valeur du milieu de la liste triée (la moyenne des deux valeurs du milieu si la taille est paire). La liste d'origine ne doit **pas** être modifiée.

```python
print(classement([("Tom", 12), ("Ana", 15), ("Bob", 15)]))
# [('Ana', 15), ('Bob', 15), ('Tom', 12)]
```
