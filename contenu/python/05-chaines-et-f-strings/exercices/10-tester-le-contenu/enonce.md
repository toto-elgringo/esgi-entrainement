Écris trois fonctions avec les méthodes de test des chaînes (`isdigit`, `isalpha`, `isalnum`, `isupper`, `islower`, `find`, `endswith`) :

- `nature(mot)` : renvoie

| Le mot contient | Résultat | Exemple |
|---|---|---|
| uniquement des chiffres | `"nombre"` | `"2026"` |
| uniquement des lettres, toutes minuscules | `"minuscules"` | `"chat"` |
| uniquement des lettres, toutes majuscules | `"majuscules"` | `"ESGI"` |
| uniquement des lettres, mélangées | `"lettres"` | `"Python"` |
| des lettres et des chiffres (rien d'autre) | `"alphanumérique"` | `"Naruto93"` |
| autre chose (ou rien du tout) | `"autre"` | `"14-18"`, `""` |

- `apres(texte, repere)` : le texte qui suit la **première** apparition de `repere`, ou `""` s'il n'y est pas. `apres("nom=Ada=1", "=")` → `"Ada=1"` ;
- `images(noms)` : la liste des noms de fichiers qui finissent par `.png`, `.jpg` ou `.jpeg`, **majuscules comprises**, dans l'ordre. `images(["a.PNG", "b.txt", "c.jpg"])` → `["a.PNG", "c.jpg"]`.
