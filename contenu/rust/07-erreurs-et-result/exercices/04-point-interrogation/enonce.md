Écris deux fonctions qui lisent des nombres écrits en texte, en utilisant l'opérateur `?` (pas de `match`) :

1. `additionner(a, b)` : la somme des deux nombres ;
2. `moyenne_de_trois(a, b, c)` : la moyenne entière (division entière par 3).

Si un des textes n'est pas un nombre, la fonction renvoie l'erreur de `parse`.

| Appel | Résultat |
|---|---|
| `additionner("2", "40")` | `Ok(42)` |
| `additionner("2", "x")` | `Err(...)` |
| `moyenne_de_trois("10", "20", "30")` | `Ok(20)` |

> [!tip] Sans `?`, il faudrait écrire
> ```rust
> let x = match a.parse::<i32>() {
>     Ok(valeur) => valeur,
>     Err(erreur) => return Err(erreur),
> };
> ```
> Le `?` fait exactement ça en un caractère.
