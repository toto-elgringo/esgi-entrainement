Rust n'a pas d'opérateur pipe, mais un **trait d'extension** peut en offrir un sur n'importe quelle valeur : `valeur.pipe(f)` vaut `f(valeur)`, ce qui permet de lire un enchaînement de gauche à droite.

1. Complète la méthode `pipe` du trait `Pipe`.
2. Écris `etiquette(texte)` qui enchaîne avec `pipe` : enlever les espaces autour, passer en majuscules, puis entourer de `<` et `>`.

| Appel | Résultat |
|---|---|
| `5.pipe(\|x\| x + 1).pipe(\|x\| x * 2)` | `12` |
| `etiquette("  rust ")` | `"<RUST>"` |

> [!tip] Point-free
> `str::trim` et `str::to_uppercase` peuvent être passés directement à `pipe`, sans closure.
