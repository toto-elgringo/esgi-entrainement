Écris `bienParenthesee(texte)`, qui renvoie `1` si les parenthèses, crochets et accolades du texte sont **bien équilibrés**, `0` sinon. La pile dans un tableau est déjà écrite.

Un texte est bien équilibré si chaque ouvrante `(`, `[`, `{` est refermée par la fermante **du même type**, dans le bon ordre. Les autres caractères ne comptent pas.

| Texte | Résultat | Pourquoi |
|---|---|---|
| `"(a[i] + {b})"` | 1 | tout est fermé dans l'ordre |
| `""` | 1 | rien à fermer |
| `"([)]"` | 0 | `)` arrive alors que `[` est encore ouvert |
| `"(()"` | 0 | une `(` n'est jamais fermée |
| `"())"` | 0 | une `)` n'a pas d'ouvrante |

Le texte fait au plus 99 caractères.

> [!info] Où on s'en sert
> C'est ce que fait un éditeur de code pour colorer la parenthèse qui correspond, et un compilateur pour signaler une parenthèse oubliée.
