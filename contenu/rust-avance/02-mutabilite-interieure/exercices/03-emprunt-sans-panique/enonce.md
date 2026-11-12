Avec `borrow_mut()`, un emprunt déjà actif fait **paniquer** le programme. Écris deux fonctions qui, à la place, **préviennent** sans paniquer.

1. `ajouter_si_libre(liste, valeur)` : ajoute `valeur` à la liste et renvoie `true`. Si la liste est déjà empruntée, ne fait rien et renvoie `false`.
2. `lire_premier(liste)` : renvoie le premier élément (`Option<i32>`). Renvoie `None` si la liste est vide **ou** si elle est empruntée en écriture.

| Situation | `ajouter_si_libre` | `lire_premier` |
|---|---|---|
| Liste libre `[7]` | `true` | `Some(7)` |
| Un `borrow()` est actif | `false` | `Some(7)` |
| Un `borrow_mut()` est actif | `false` | `None` |

> [!info] Plusieurs lectures sont permises
> Quand un `borrow()` est actif, `try_borrow()` réussit aussi (plusieurs lectures en même temps). Seule l'écriture est refusée.
