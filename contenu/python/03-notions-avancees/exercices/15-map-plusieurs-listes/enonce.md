Écris ces fonctions avec `map` (et des `lambda` quand il le faut), **en une ligne** chacune :

| Fonction | Renvoie | Exemple |
|---|---|---|
| `lire_entiers(texte, sep=";")` | le **tuple** des entiers du texte ; les morceaux vides sont ignorés | `lire_entiers("4; 8;;15")` → `(4, 8, 15)` |
| `parite(nombres)` | le **tuple** `"pair"` / `"impair"` de chaque nombre | `parite([3, 4])` → `("impair", "pair")` |
| `maximums(a, b)` | la **liste** du plus grand des deux, rang par rang | `maximums([1, 9, 3], [4, 2, 3])` → `[4, 9, 3]` |
| `appliquer_remises(prix, remises)` | la **liste** des prix après remise (en %), arrondis à 2 décimales | `appliquer_remises([20, 9.99], [10, 0])` → `[18.0, 9.99]` |
| `noms_complets(prenoms, noms)` | la **liste** « Prénom NOM » (première lettre du prénom en majuscule, nom en majuscules) | `noms_complets(["ada"], ["lovelace"])` → `["Ada LOVELACE"]` |
