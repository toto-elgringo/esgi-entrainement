Écris ces fonctions **sans boucle `for`** (les tests ne vérifient que les résultats : à toi de jouer le jeu). Les deux premières se font avec `filter_map`, les deux dernières avec `flat_map`.

1. `extraire_nombres(texte)` : les nombres entiers positifs écrits dans le texte (les mots sont séparés par des espaces). Les autres mots sont ignorés.
2. `domaines(emails)` : le domaine de chaque adresse (ce qui suit le `@`). Une adresse sans `@`, ou sans rien après le `@`, est ignorée.
3. `tous_les_mots(phrases)` : tous les mots de toutes les phrases, en minuscules, dans l'ordre.
4. `cases(colonnes, lignes)` : le nom de chaque case d'une grille, colonne par colonne. Pour chaque lettre de `colonnes`, les numéros vont de `1` à `lignes`.

| Appel | Résultat |
|---|---|
| `extraire_nombres("j'ai 3 chats et 12 poissons")` | `[3, 12]` |
| `domaines(&["ana@esgi.fr", "pas-un-email", "leo@mail.com"])` | `["esgi.fr", "mail.com"]` |
| `tous_les_mots(&["Le chat", "dort ICI"])` | `["le", "chat", "dort", "ici"]` |
| `cases("ab", 3)` | `["a1", "a2", "a3", "b1", "b2", "b3"]` |

> [!tip] Lequel choisir ?
> | La closure renvoie | Méthode | Pour chaque élément, on obtient |
> |---|---|---|
> | une valeur | `map` | exactement 1 élément |
> | une `Option` | `filter_map` | 0 ou 1 élément |
> | un itérateur | `flat_map` | 0, 1 ou plusieurs éléments |
