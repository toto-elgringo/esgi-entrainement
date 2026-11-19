Un ordinateur a un seul processeur, mais plusieurs programmes (des **tâches**) veulent travailler en même temps. Pour être juste, il les fait passer **à tour de rôle** :

- les tâches attendent dans une **file**, au départ dans l'ordre 0, 1, 2, … ;
- la tâche en tête de file travaille pendant au plus `quantum` unités de temps (moins si elle a fini avant) ;
- si elle n'a pas fini, elle retourne **à la fin** de la file ; sinon, elle quitte la file et on note l'heure à laquelle elle a fini.

C'est l'algorithme du **tourniquet** (*round robin*). Écris `tourniquet(durees, n, quantum, fin)` : `durees[i]` est le temps de travail total de la tâche `i` (au moins 1), et la fonction range dans `fin[i]` l'heure à laquelle la tâche `i` se termine. L'horloge part de 0. `n` peut valoir 0.

Exemple avec `durees = {5, 2, 4}` et `quantum = 2` :

| Heure | File avant | Qui travaille | Reste après | Heure après |
|---|---|---|---|---|
| 0 | 0 1 2 | tâche 0, 2 unités | 3 | 2 |
| 2 | 1 2 0 | tâche 1, 2 unités | 0 : finie | 4 |
| 4 | 2 0 | tâche 2, 2 unités | 2 | 6 |
| 6 | 0 2 | tâche 0, 2 unités | 1 | 8 |
| 8 | 2 0 | tâche 2, 2 unités | 0 : finie | 10 |
| 10 | 0 | tâche 0, 1 unité | 0 : finie | 11 |

`fin` vaut `{11, 4, 10}`.

Utilise la file dans un tableau circulaire fournie (`enfiler`, `defiler`). Les tests vérifient aussi que toute la mémoire réservée est rendue.

> [!info] Pourquoi une file ?
> Chaque tâche attend au plus `n - 1` tours avant de retravailler : aucune n'est oubliée, et une tâche très longue ne bloque pas les autres. C'est la même idée que les *workers* d'un serveur qui piochent dans une file de demandes.
