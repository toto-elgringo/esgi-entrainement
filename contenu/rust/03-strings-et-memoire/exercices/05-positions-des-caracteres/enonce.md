Écris deux fonctions :

1. `positions(s)` : la liste des positions (en **octets**) où commence chaque caractère.
2. `nb_caracteres_speciaux(s)` : le nombre de caractères qui prennent **plus d'un octet**.

Exemple avec `"Hé, 🦀 !"` :

| Caractère | `H` | `é` | `,` | espace | `🦀` | espace | `!` |
|---|---|---|---|---|---|---|---|
| Position | 0 | 1 | 3 | 4 | 5 | 9 | 10 |
| Octets | 1 | 2 | 1 | 1 | 4 | 1 | 1 |

- `positions("Hé, 🦀 !")` → `[0, 1, 3, 4, 5, 9, 10]`
- `nb_caracteres_speciaux("Hé, 🦀 !")` → `2` (le `é` et le crabe)

> [!info] `Vec`
> `Vec<usize>` est une liste de nombres qui peut grandir. `Vec::new()` crée une liste vide, `.push(x)` ajoute `x` à la fin. On l'étudie en détail plus tard.
