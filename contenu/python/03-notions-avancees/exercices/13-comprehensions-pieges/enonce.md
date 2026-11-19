Écris chaque fonction en **une ligne**, avec une compréhension. Le code de départ contient deux versions qui ont l'air justes, mais qui se trompent : corrige-les.

| Fonction | Renvoie | Exemple |
|---|---|---|
| `inverser_mots(phrase)` | chaque mot écrit à l'envers, séparés par un seul espace | `"Salut  les gens"` → `"tulaS sel sneg"` |
| `mots_en_minuscules(phrase)` | une chaîne avec seulement les mots faits **uniquement** de lettres minuscules | `"la guerre de 14-18 a1"` → `"la guerre de"` |
| `abs_des_pairs(l)` | la valeur absolue des nombres **pairs** de la liste | `abs_des_pairs([-4, 3, 2, -1])` → `[4, 2]` |
| `grille(lignes, colonnes, valeur)` | un tableau 2D (liste de listes) rempli de `valeur` | `grille(2, 3, 0)` → `[[0, 0, 0], [0, 0, 0]]` |

> [!warning] Des lignes indépendantes
> Après `g = grille(2, 3, 0)` puis `g[0][0] = 5`, la grille doit valoir `[[5, 0, 0], [0, 0, 0]]` : seule la première ligne change.
