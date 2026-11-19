Écris ces fonctions en une ligne avec `sorted`, `min` et le paramètre `key` :

- `items_tries(d)` : la liste des couples `(clé, valeur)` triés par clé. `items_tries({"b": 1, "a": 2})` → `[("a", 2), ("b", 1)]` ;
- `cles_par_valeur(d)` : la liste des clés, de la plus grande valeur à la plus petite, puis par ordre alphabétique en cas d'égalité. `cles_par_valeur({"kiwi": 3, "abricot": 5, "fraise": 3})` → `["abricot", "fraise", "kiwi"]` ;
- `trier_par_somme(listes)` : les listes rangées de la plus petite somme à la plus grande. `trier_par_somme([[5, 5], [1], [2, 3]])` → `[[1], [2, 3], [5, 5]]` ;
- `trier_sans_casse(mots)` : les mots par ordre alphabétique **sans tenir compte des majuscules** (les mots ne sont pas modifiés). `trier_sans_casse(["banane", "Abricot", "cerise"])` → `["Abricot", "banane", "cerise"]` ;
- `plus_proche(nombres, cible)` : le nombre le plus proche de `cible` (le plus petit des deux en cas d'égalité), `None` si la liste est vide. `plus_proche([2, 9, 6], 7)` → `6`.
