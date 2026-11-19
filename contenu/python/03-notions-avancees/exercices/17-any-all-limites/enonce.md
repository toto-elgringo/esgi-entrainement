Écris ces fonctions avec `any`, `all` (ou `not any`), sans boucle `for` classique. Chacune renvoie `True` ou `False` :

- `mots_courts(phrase, taille=6)` : tous les mots font **au plus** `taille` caractères ;
- `contient_nombre(phrase)` : au moins un mot n'est composé **que de chiffres** (`"a 12 b"` oui, `"a1 b2"` non) ;
- `aucun_negatif(valeurs)` : aucune valeur n'est strictement négative ;
- `tous_differents(valeurs)` : aucune valeur n'apparaît deux fois ;
- `matrice_rectangulaire(m)` : toutes les lignes de la liste de listes `m` ont la même longueur. Une matrice vide est rectangulaire.

> [!warning] La limite compte
> `mots_courts("Bonjour à tous", 7)` vaut `True` : « Bonjour » fait **exactement** 7 lettres, ce qui est permis par « au plus 7 ». Le code de départ se trompe sur ce cas : corrige-le.
