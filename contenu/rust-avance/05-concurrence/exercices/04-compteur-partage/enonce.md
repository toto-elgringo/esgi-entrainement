Écris `compter(nb_threads, increments)` : elle lance `nb_threads` threads qui ajoutent chacun `1` `increments` fois à **un même compteur partagé**. Elle renvoie la valeur finale du compteur.

| Appel | Résultat |
|---|---|
| `compter(4, 1000)` | `4000` |
| `compter(1, 5)` | `5` |
| `compter(0, 100)` | `0` |

> [!info] `Arc<Mutex<T>>`
> `Arc` permet à plusieurs threads de posséder le compteur. `Mutex` fait passer un thread à la fois pour le modifier.

> [!warning] Piège
> Attends **tous** les threads (`join`) avant de lire le résultat, sinon tu risques de lire une valeur incomplète.
