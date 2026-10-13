`tronquer(s, octets)` doit renvoyer le début du texte, **sans dépasser** `octets` octets.

Le code actuel coupe directement avec `&s[..octets]`. Il **panique** dans deux cas :

- la position tombe au milieu d'un caractère (`byte index 8 is not a char boundary`) ;
- la position dépasse la longueur du texte.

Corrige-le : si la coupe tombe au milieu d'un caractère, **recule** jusqu'au début de ce caractère.

| Appel | Résultat |
|---|---|
| `tronquer("Hello", 3)` | `"Hel"` |
| `tronquer("Hello, 🦀", 8)` | `"Hello, "` (le crabe ne rentre pas) |
| `tronquer("Hé", 2)` | `"H"` |
| `tronquer("Hé", 3)` | `"Hé"` |
| `tronquer("abc", 10)` | `"abc"` |

> [!tip] Pourquoi renvoyer `&str` ?
> Le résultat est un morceau du texte de départ : pas besoin de copier quoi que ce soit dans une nouvelle `String`.
