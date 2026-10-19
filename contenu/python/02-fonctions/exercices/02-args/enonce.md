Écris trois fonctions qui acceptent un **nombre variable d'arguments** :

- `moyenne(*nombres)` : la moyenne de tous les nombres donnés, `0` s'il n'y en a aucun. `moyenne(4, 6, 8)` → `6.0` ;
- `maximum(premier, *autres)` : le plus grand des nombres donnés (il y en a au moins un), **sans** utiliser `max`. `maximum(3, 9, 2)` → `9` ;
- `concatener(*mots, sep=" ")` : relie tous les mots avec le séparateur. `concatener("a", "b", "c")` → `"a b c"` et `concatener("a", "b", sep="-")` → `"a-b"`.
