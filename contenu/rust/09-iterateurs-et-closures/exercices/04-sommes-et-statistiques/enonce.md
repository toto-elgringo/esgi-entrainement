Écris ces fonctions **sans boucle `for`**, avec les consommateurs d'itérateurs :

1. `total(prix)` : la somme des prix.
2. `nombre_de_mots_longs(mots, taille_min)` : combien de mots ont au moins `taille_min` octets.
3. `plus_grand(v)` : le plus grand élément, ou `None` si la liste est vide.
4. `produit(v)` : le produit de tous les éléments (`1` pour une liste vide), avec `fold`.
5. `moyenne(notes)` : la moyenne, ou `None` si la liste est vide.

| Appel | Résultat |
|---|---|
| `total(&[10, 25, 5])` | `40` |
| `nombre_de_mots_longs(&["un", "trois", "sept"], 4)` | `2` |
| `plus_grand(&[3, -1, 8])` | `Some(8)` |
| `produit(&[2, 3, 4])` | `24` |
| `moyenne(&[10.0, 15.0])` | `Some(12.5)` |
