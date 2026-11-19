Écris ces fonctions avec `sum` et une **expression génératrice** (sans liste intermédiaire) :

- `valeur_mot(mot)` : la somme des rangs des lettres dans l'alphabet (`a` = 1, `b` = 2... `z` = 26), sans tenir compte des majuscules. Les caractères qui ne sont pas des lettres de `a` à `z` comptent pour 0. `valeur_mot("Abc")` → `6` ;
- `somme_ponderee(valeurs)` : chaque valeur multipliée par sa position, **en comptant à partir de 1**. `somme_ponderee([5, 1, 2])` → `5×1 + 1×2 + 2×3 = 13` ;
- `moyenne_ponderee(notes, coefs)` : `somme(note × coef) / somme(coefs)`, ou `None` si la somme des coefficients vaut 0. `moyenne_ponderee([10, 16], [1, 3])` → `14.5` ;
- `cle_isbn(code)` : la clé (le dernier caractère) d'un ancien numéro de livre ISBN-10, à partir de ses 9 premiers chiffres donnés en texte.

> [!info] La clé ISBN-10
> On multiplie le 1er chiffre par 1, le 2e par 2... le 9e par 9, on additionne, et on prend le reste de la division par 11. Un reste de 10 s'écrit `"X"`. Exemple : `cle_isbn("207036002")` → `"4"`.
