Écris deux fonctions :

- `compter_mots(chemin)` : renvoie un dictionnaire mot → nombre d'apparitions dans le fichier. Les mots sont mis en **minuscules**, et la ponctuation `. , ; : ! ?` collée au début ou à la fin d'un mot est enlevée. Si le fichier n'existe pas, renvoie `{}` ;
- `mots_frequents(chemin, k)` : renvoie la liste des `k` mots les plus fréquents, sous forme de tuples `(mot, nombre)`, du plus fréquent au moins fréquent. En cas d'égalité, par ordre alphabétique.

Avec un fichier qui contient :

```text
Le chat dort. Le chien aussi !
le chat mange.
```

`compter_mots` renvoie `{"le": 3, "chat": 2, "dort": 1, "chien": 1, "aussi": 1, "mange": 1}` et `mots_frequents(chemin, 3)` renvoie `[("le", 3), ("chat", 2), ("aussi", 1)]`.
