Écris `inverser(s)` qui renvoie le texte à l'envers, **caractère par caractère** :

| Texte | Résultat |
|---|---|
| `"rust"` | `"tsur"` |
| `"Hé🦀"` | `"🦀éH"` |
| `""` | `""` |

La fonction renvoie une `String` : c'est un **nouveau** texte fabriqué, pas un morceau de `s`.

> [!warning] Piège
> Un caractère peut prendre plusieurs octets. Inverser octet par octet produirait des octets dans le mauvais ordre, donc un texte invalide.
