Écris ces fonctions en utilisant les **ensembles** (`set`) :

| Fonction | Renvoie | Exemple |
|---|---|---|
| `sans_doublons(l)` | la liste **triée** des valeurs, sans doublons | `[3, 1, 3, 2, 1]` → `[1, 2, 3]` |
| `communs(a, b)` | la liste triée des éléments présents dans les deux listes | `communs([1, 2, 3], [2, 3, 4])` → `[2, 3]` |
| `est_binaire(texte)` | `True` si le texte est non vide et ne contient que des `0` et des `1` | `est_binaire("1001")` → `True` |
| `sans_ponctuation(phrase)` | `True` si la phrase ne contient aucun des signes `! ? . , ; :` | `sans_ponctuation("Salut")` → `True` |
| `lettres_exclusives(mot1, mot2)` | l'**ensemble** des lettres présentes dans un seul des deux mots | `lettres_exclusives("chat", "chien")` → `{"a", "t", "i", "e", "n"}` |
