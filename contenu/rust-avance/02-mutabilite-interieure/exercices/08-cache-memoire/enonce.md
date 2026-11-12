Un `Calculateur` calcule le carré d'un nombre, mais **retient** les résultats déjà trouvés dans un cache (`RefCell<HashMap<u64, u64>>`). Un compteur (`Cell<u32>`) note combien de vrais calculs ont été faits.

La méthode `carre` prend `&self` : de l'extérieur, le calculateur a l'air immuable, mais il se met à jour en cachette (c'est la mutabilité intérieure).

1. `carre(n)` renvoie `n * n`. Si `n` est dans le cache, on le renvoie directement **sans** compter de calcul. Sinon, on calcule, on compte, on range dans le cache.
2. `calculs()` renvoie le nombre de vrais calculs faits.

| Appels | `calculs()` |
|---|---|
| `carre(4)` | `1` |
| `carre(4)` puis `carre(4)` | `1` |
| `carre(4)`, `carre(5)`, `carre(4)` | `2` |

> [!warning] Ne garde pas la lecture
> Ne garde pas l'emprunt `borrow()` du cache pendant que tu appelles `borrow_mut()`. Termine la recherche, puis écris.
