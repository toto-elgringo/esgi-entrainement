Écris ces fonctions sur les **ensembles** (`set`) :

- `chiffres_pairs()` : renvoie l'**ensemble** `{0, 2, 4, 6, 8}`, construit à partir d'un `range` ;
- `lettres_utilisees(texte)` : la **liste triée** des lettres différentes du texte, en minuscules, sans les espaces. `lettres_utilisees("Bob a ri")` → `["a", "b", "i", "o", "r"]` ;
- `inscrire(inscrits, nom)` : ajoute `nom` à l'ensemble `inscrits`. Renvoie `True` s'il n'y était pas encore, `False` s'il y était déjà ;
- `desinscrire(inscrits, noms)` : retire de `inscrits` tous les noms de la liste `noms` **qui y sont**. Un nom absent ne provoque pas d'erreur. Ne renvoie rien ;
- `vider(s)` : retire les éléments de `s` un par un jusqu'à ce qu'il soit vide, et renvoie la **liste triée** des éléments retirés.

Les fonctions `inscrire`, `desinscrire` et `vider` modifient l'ensemble **reçu**.
