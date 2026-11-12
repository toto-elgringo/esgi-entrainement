Un serveur reçoit une ligne comme `GET /users/42`. Écris `analyser` qui la transforme en `Requete`.

| Ligne | Résultat |
|---|---|
| `GET /users/42` | `Some(Requete { methode: "GET", chemin: "/users/42" })` |
| `GET` | `None` (pas de chemin) |
| `GET /a /b` | `None` (trop de mots) |
| `GET users` | `None` (le chemin doit commencer par `/`) |

> [!tip] L'opérateur `?`
> Dans une fonction qui renvoie `Option`, `mots.next()?` sort avec `None` quand il n'y a plus de mot.
