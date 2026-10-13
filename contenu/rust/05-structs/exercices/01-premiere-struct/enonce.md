Complète la struct `Livre` avec deux champs :

- `titre`, de type `String` ;
- `pages`, de type `u32`.

Puis écris :

1. `creer_livre(titre, pages)` qui fabrique et renvoie un `Livre` ;
2. `est_long(livre)` qui renvoie `true` si le livre a **plus de 300 pages**.

| Appel | Résultat |
|---|---|
| `est_long(&creer_livre("Dune", 896))` | `true` |
| `est_long(&creer_livre("Le Petit Prince", 96))` | `false` |
| `est_long(&creer_livre("Pile", 300))` | `false` |

> [!info] `&Livre`
> `est_long` reçoit `&Livre` : elle **emprunte** le livre pour le lire, sans le prendre.
