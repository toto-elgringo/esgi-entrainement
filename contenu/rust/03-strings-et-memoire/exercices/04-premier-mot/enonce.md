Écris `premier_mot(s)` qui renvoie le premier mot d'une phrase : tout ce qui est **avant le premier espace**.

| Texte | Résultat |
|---|---|
| `"bonjour le monde"` | `"bonjour"` |
| `"été chaud"` | `"été"` |
| `"salut"` | `"salut"` |
| `""` | `""` |

La fonction renvoie un `&str` : un **morceau** du texte de départ, sans rien copier. Pas besoin de fabriquer une `String`.

> [!tip] Rappel
> `&s[..i]` est le morceau qui va du début jusqu'à la position `i` (exclue). Les positions sont en octets : avec `char_indices`, elles tombent toujours au début d'un caractère, donc la coupe ne panique jamais.
