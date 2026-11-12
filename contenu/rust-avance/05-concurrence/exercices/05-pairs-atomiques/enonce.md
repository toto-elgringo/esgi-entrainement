Écris `compter_pairs(nombres, taille)` : elle découpe le tableau en morceaux de `taille` éléments (le dernier peut être plus court). Chaque morceau est traité par **son propre thread** qui compte les nombres pairs et les ajoute à un **compteur atomique** commun. La fonction renvoie le total.

Tu peux supposer que `taille` est au moins `1`.

| Appel | Résultat |
|---|---|
| `compter_pairs(&[1, 2, 3, 4, 5, 6], 2)` | `3` |
| `compter_pairs(&[1, 3, 5], 2)` | `0` |
| `compter_pairs(&[], 4)` | `0` |

> [!tip] `thread::scope`
> Dans un `scope`, les threads sont attendus à la sortie du bloc : ils peuvent donc emprunter `nombres` sans le cloner ni passer par `Arc`.

> [!info] Atomique
> `fetch_add(n, Ordering::Relaxed)` ajoute `n` en une seule opération indivisible, sans `Mutex`.
