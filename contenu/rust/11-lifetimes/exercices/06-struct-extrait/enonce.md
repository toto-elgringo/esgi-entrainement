Un `Extrait` regarde un morceau de texte **sans le copier** : il contient une référence.

Le code ne compile pas (E0106 sur le champ `texte`). Ajoute la durée de vie à la struct et au bloc `impl`, puis écris :

- `Extrait::nouveau(texte)` : crée l'extrait ;
- `premiere_phrase(&self)` : le texte avant le premier `.`, sans espaces autour (tout le texte s'il n'y a pas de point) ;
- `nombre_de_mots(&self)` : le nombre de mots (séparés par des espaces).

Avec `"Il était une fois un crabe. Il aimait Rust. Fin."` :

| Appel | Résultat |
|---|---|
| `premiere_phrase()` | `"Il était une fois un crabe"` |
| `nombre_de_mots()` | `10` |

> [!warning] Le piège
> Un test garde la phrase renvoyée **après** la destruction de l'`Extrait` (mais pas du texte). Pour que ce soit permis, `premiere_phrase` doit renvoyer un `&'a str` : une vue sur le **texte**, pas sur l'extrait.
