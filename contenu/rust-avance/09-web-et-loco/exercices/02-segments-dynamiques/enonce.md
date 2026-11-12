Un routeur compare le chemin reçu à des **modèles** comme `/users/:id`. Écris `correspond(modele, chemin)` : elle renvoie les paramètres capturés, ou `None` si le chemin ne correspond pas.

| Modèle | Chemin | Résultat |
|---|---|---|
| `/users/:id` | `/users/42` | `Some([("id", "42")])` |
| `/users/:id` | `/posts/42` | `None` |
| `/users/:id/notes/:n` | `/users/7/notes/3` | `Some([("id", "7"), ("n", "3")])` |
| `/users` | `/users/42` | `None` (nombre de segments différent) |
| `/` | `/` | `Some([])` |

Les paramètres sont rendus dans l'ordre du modèle.
