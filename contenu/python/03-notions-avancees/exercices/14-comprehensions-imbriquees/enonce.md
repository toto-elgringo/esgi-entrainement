Écris chaque fonction en **une ligne**, avec une compréhension (liste ou dictionnaire) :

- `lettres(prenoms)` : la liste de toutes les lettres des prénoms, en minuscules, dans l'ordre. `lettres(["Ana", "Bo"])` → `["a", "n", "a", "b", "o"]` ;
- `noms_alliteres(prenoms, noms)` : toutes les combinaisons « prénom nom » dont le prénom et le nom commencent par la **même lettre** (majuscules ignorées), dans l'ordre des deux boucles. `noms_alliteres(["Peter", "Bruce"], ["Parker", "Banner", "Wayne"])` → `["Peter Parker", "Bruce Banner"]` ;
- `aplatir(matrice)` : tous les éléments d'une liste de listes, à la suite. `aplatir([[1, 2], [3], []])` → `[1, 2, 3]` ;
- `transposer(matrice)` : les lignes deviennent les colonnes, avec `zip`. `transposer([[1, 2, 3], [4, 5, 6]])` → `[[1, 4], [2, 5], [3, 6]]` ;
- `annuaire(personnes)` : `personnes` est une liste de tuples `(prénom, nom)`. Renvoie le dictionnaire initiales → nom complet. `annuaire([("Ada", "Lovelace")])` → `{"AL": "Ada Lovelace"}`.
