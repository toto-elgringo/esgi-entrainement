Écris `somme_en_thread(n)` : elle calcule la somme des entiers de `1` à `n` **dans un thread séparé**, puis renvoie le résultat.

1. Lance le calcul avec `thread::spawn`.
2. Attends la fin du thread avec `join` et renvoie sa valeur.

| Appel | Résultat |
|---|---|
| `somme_en_thread(10)` | `55` |
| `somme_en_thread(100)` | `5050` |
| `somme_en_thread(0)` | `0` |

> [!info] `join`
> `join()` attend la fin du thread. Il renvoie un `Result` : `unwrap()` donne la valeur ou fait paniquer si le thread a paniqué.
