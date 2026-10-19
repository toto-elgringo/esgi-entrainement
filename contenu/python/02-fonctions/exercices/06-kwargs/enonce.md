Écris trois fonctions :

- `fiche(nom, **infos)` : renvoie le nom seul s'il n'y a pas d'information, sinon le nom suivi des informations entre parenthèses, **dans l'ordre où elles ont été données** :
  - `fiche("Tom")` → `"Tom"`
  - `fiche("Tom", age=20, ville="Paris")` → `"Tom (age=20, ville=Paris)"`
- `compter_arguments(*args, **kwargs)` : renvoie le tuple `(nombre d'arguments par position, nombre d'arguments par mot-clé)`. `compter_arguments(1, 2, a=3)` → `(2, 1)` ;
- `appeler(func, *args, **kwargs)` : appelle `func` avec tous les autres arguments et renvoie son résultat. `appeler(pow, 2, 10)` → `1024`.
