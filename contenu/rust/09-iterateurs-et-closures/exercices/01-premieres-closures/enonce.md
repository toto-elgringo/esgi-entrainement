La fonction `compter_si(v, condition)` est déjà écrite : elle compte les éléments de `v` pour lesquels la closure `condition` renvoie `true`.

Complète les trois fonctions en remplaçant chaque `todo!()` par le corps de la closure :

1. `nombre_de_positifs(v)` : les éléments strictement positifs.
2. `nombre_de_pairs(v)` : les éléments pairs.
3. `nombre_superieurs_a(v, seuil)` : les éléments strictement plus grands que `seuil`.

| Appel | Résultat |
|---|---|
| `nombre_de_positifs(&[-2, 0, 3, 5])` | `2` |
| `nombre_de_pairs(&[1, 2, 4, 7])` | `2` |
| `nombre_superieurs_a(&[1, 5, 10, 20], 6)` | `2` |

> [!info] `impl Fn(i32) -> bool`
> Le type du paramètre `condition` veut dire « n'importe quelle closure qui prend un `i32` et renvoie un `bool` ».
