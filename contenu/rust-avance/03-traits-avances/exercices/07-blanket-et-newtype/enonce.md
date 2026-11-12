Deux outils à combiner :

1. **Newtype** : la structure `Liste(Vec<String>)` enveloppe un `Vec<String>`. Implémente `Display` pour elle : les éléments séparés par `, ` entre crochets (`[a, b, c]`, et `[]` si la liste est vide).
2. **Blanket impl** : implémente le trait `Resumer` pour **tous** les types qui implémentent `Display`. Sa méthode `resume` renvoie le texte affiché entouré de `<` et `>`.

| Appel | Résultat |
|---|---|
| `42_i32.resume()` | `"<42>"` |
| `"salut".resume()` | `"<salut>"` |
| `Liste(vec!["a", "b"]).to_string()` | `"[a, b]"` |
| `Liste(vec!["a", "b"]).resume()` | `"<[a, b]>"` |

> [!tip] Rappel
> Le newtype existe parce qu'on ne peut pas implémenter un trait étranger (`Display`) sur un type étranger (`Vec`).
