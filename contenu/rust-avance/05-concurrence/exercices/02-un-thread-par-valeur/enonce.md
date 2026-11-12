Écris `doubler(valeurs)` : elle lance **un thread par valeur** ; chaque thread double sa valeur. La fonction renvoie les résultats **dans le même ordre** que les valeurs de départ.

| Appel | Résultat |
|---|---|
| `doubler(vec![1, 2, 3])` | `vec![2, 4, 6]` |
| `doubler(vec![])` | `vec![]` |

> [!tip] Deux passes
> Si tu fais `join` juste après chaque `spawn`, les threads s'exécutent l'un après l'autre : aucun intérêt. Lance d'abord tous les threads, puis attends-les dans l'ordre.

> [!info] Pourquoi `move` ?
> Chaque thread a besoin de sa propre valeur. `move` la lui donne.
