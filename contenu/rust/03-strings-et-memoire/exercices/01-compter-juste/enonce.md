Écris deux fonctions :

- `nb_octets(s)` : le nombre d'**octets** du texte ;
- `nb_caracteres(s)` : le nombre de **caractères**.

| Texte | Octets | Caractères |
|---|---|---|
| `"Hello"` | 5 | 5 |
| `"Hé"` | 3 | 2 |
| `"Hello, 🦀"` | 11 | 8 |
| `""` | 0 | 0 |

> [!tip] Rappel
> Le paramètre est un `&str` : la fonction **emprunte** le texte pour le lire, sans le posséder.
