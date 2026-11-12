Un `Journal` garde des lignes de texte dans un `RefCell<Vec<String>>`. Toutes ses méthodes prennent `&self`.

1. `nouveau()` crée un journal vide.
2. `ecrire(texte)` ajoute une ligne à la fin.
3. `nombre()` renvoie le nombre de lignes.
4. `derniere()` renvoie la dernière ligne (`Option<String>`), ou `None` si le journal est vide.

| Appel | Résultat |
|---|---|
| `ecrire("a")` puis `ecrire("b")`, puis `nombre()` | `2` |
| `derniere()` | `Some("b".to_string())` |
| `derniere()` sur un journal vide | `None` |

> [!warning] Ne garde pas le garde
> `borrow()` et `borrow_mut()` renvoient un garde qui bloque les autres emprunts tant qu'il existe. Ici, chaque méthode emprunte, utilise la valeur, puis relâche tout de suite.
