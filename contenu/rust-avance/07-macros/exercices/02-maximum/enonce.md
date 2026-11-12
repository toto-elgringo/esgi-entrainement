Écris la macro `maximum!` qui renvoie la plus grande de **1 ou plusieurs** valeurs.

| Appel | Résultat |
|---|---|
| `maximum!(7)` | `7` |
| `maximum!(3, 8)` | `8` |
| `maximum!(4, 9, 2, 6)` | `9` |

La macro doit être **récursive** : elle s'appelle sur la fin de la liste.

> [!info] Les deux bras
> 1. Une seule valeur : on la renvoie (cas de base).
> 2. Une valeur puis d'autres : on compare la première avec le maximum des autres.
