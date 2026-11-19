Écris `evaluer(calcul, &resultat)`, qui calcule une expression en **notation polonaise inverse** et renvoie un **code** :

| Code | Quand |
|---|---|
| `CALCUL_OK` | le calcul est correct : le résultat est rangé dans `*resultat` |
| `PAS_ASSEZ_DE_NOMBRES` | un opérateur arrive avec moins de deux nombres dans la pile, ou la pile est vide à la fin |
| `TROP_DE_NOMBRES` | il reste plus d'un nombre à la fin |
| `SYMBOLE_INCONNU` | un caractère n'est ni un espace, ni un chiffre, ni `+`, `-`, `x` |

Nouveauté par rapport à la calculette précédente : un nombre peut avoir **plusieurs chiffres** (`12 30 +` vaut 42). Les éléments sont séparés par au moins un espace. Les nombres écrits sont positifs, mais un résultat peut être négatif (`7 10 -` vaut -3).

En cas d'erreur, `*resultat` ne doit **pas** être modifié. Le calcul contient au plus 64 nombres ; la pile dans un tableau est déjà écrite.

| Calcul | Code | Résultat |
|---|---|---|
| `"12 30 +"` | `CALCUL_OK` | 42 |
| `"3 4 + 2 x"` | `CALCUL_OK` | 14 |
| `"5 +"` | `PAS_ASSEZ_DE_NOMBRES` | |
| `"1 2"` | `TROP_DE_NOMBRES` | |
| `"6 2 /"` | `SYMBOLE_INCONNU` | |
