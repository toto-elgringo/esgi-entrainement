Écris quatre petites fonctions, si possible **sans aucun `match`**, seulement avec `map` et `unwrap_or` :

1. `doubler(x)` : double la valeur si elle existe (`Some(4)` → `Some(8)`, `None` → `None`) ;
2. `valeur_ou_defaut(x, defaut)` : la valeur, ou `defaut` s'il n'y a rien ;
3. `longueur(texte)` : le nombre d'octets du texte (`.len()`), ou `0` s'il n'y a pas de texte ;
4. `appliquer_reduction(prix, reduction)` : le prix moins la réduction, **sans descendre sous 0** ; pas de prix → `None`.

| Appel | Résultat |
|---|---|
| `doubler(Some(4))` | `Some(8)` |
| `valeur_ou_defaut(None, 10)` | `10` |
| `longueur(Some("Rust"))` | `4` |
| `appliquer_reduction(Some(5), 8)` | `Some(0)` |

> [!info] Closure
> `|v| v * 2` est une petite fonction sans nom : `v` est la valeur contenue dans le `Some`.
