Écris des **fabriques de fonctions** : chacune renvoie une nouvelle fonction, prête à être appelée.

1. `additionneur(n)` : une fonction qui ajoute `n` au nombre qu'on lui donne.
2. `multiplicateur(n)` : une fonction qui multiplie par `n`.
3. `composer(f, g)` : une fonction qui applique `f`, **puis** `g` au résultat.
4. `operation(symbole)` : la fonction à deux paramètres qui correspond à `'+'`, `'-'` ou `'*'`. Pour tout autre symbole, une fonction qui renvoie toujours `0`.
5. `enchainer(etapes)` : une fonction qui applique toutes les étapes de la liste, dans l'ordre. Sans aucune étape, le nombre ne change pas.

| Appel | Résultat |
|---|---|
| `additionneur(5)(10)` | `15` |
| `multiplicateur(3)(7)` | `21` |
| `composer(additionneur(1), multiplicateur(10))(4)` | `50`, car (4 + 1) × 10 |
| `operation('*')(6, 7)` | `42` |
| `operation('?')(6, 7)` | `0` |
| `enchainer(etapes)(5)` avec les étapes « + 1 » puis « × 2 » | `12` |

> [!info] Pourquoi `Box<dyn Fn>` pour `operation` et `enchainer` ?
> Chaque closure a son propre type. Les closures des différentes branches du `match` n'ont donc pas le même type, et une liste ne peut contenir qu'un seul type. `Box<dyn Fn(...)>` leur donne un type commun.

> [!tip] Le code de départ
> `|_| todo!()` est une closure qui ne fait que planter : elle sert seulement à ce que le code compile. Remplace-la par la bonne closure.
