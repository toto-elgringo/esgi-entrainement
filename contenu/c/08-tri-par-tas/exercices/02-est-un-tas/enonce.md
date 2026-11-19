Écris deux fonctions qui renvoient `1` si les `n` cases de `t` forment un tas, `0` sinon :

- `estTasMax(t, n)` : chaque case est **plus grande ou égale** à ses enfants ;
- `estTasMin(t, n)` : chaque case est **plus petite ou égale** à ses enfants.

| `t` | `estTasMax` | `estTasMin` | Pourquoi |
|---|---|---|---|
| `53 29 12 4 15 3 9 1` | 1 | 0 | |
| `9 5 8 6 1` | 0 | 0 | 6 (case 3) est plus grand que son parent 5 (case 1) |
| `1 3 2 7 4` | 0 | 1 | |
| `7 7 7` | 1 | 1 | les égalités sont permises |

Un tableau vide ou d'une seule case est un tas (max et min).

> [!tip] Rappel
> Le parent de la case `i` est la case `(i - 1) / 2`, ses enfants sont `2 * i + 1` et `2 * i + 2`.
