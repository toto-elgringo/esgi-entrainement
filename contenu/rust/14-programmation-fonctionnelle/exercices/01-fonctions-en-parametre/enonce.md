Une fonction peut recevoir une autre fonction (ou une closure) en paramètre. Écris ces quatre fonctions **sans boucle `for`** (les tests ne vérifient que les résultats : à toi de jouer le jeu).

1. `appliquer_deux_fois(f, x)` : applique `f` à `x`, puis encore `f` au résultat.
2. `appliquer_a_tous(nombres, f)` : la liste des `f(n)` pour chaque `n` de `nombres`, dans l'ordre.
3. `compter_si(nombres, condition)` : combien de nombres vérifient la condition.
4. `appliquer_n_fois(f, n, x)` : applique `f` `n` fois de suite en partant de `x` (si `n` vaut `0`, on renvoie `x`).

| Appel | Résultat |
|---|---|
| `appliquer_deux_fois(\|x\| x + 3, 10)` | `16` |
| `appliquer_a_tous(&[1, 2, 3], \|x\| x * x)` | `[1, 4, 9]` |
| `compter_si(&[3, -1, 8, 0], \|x\| x > 0)` | `2` |
| `appliquer_n_fois(\|x\| x * 2, 3, 1)` | `8` |

> [!tip] Une fonction normale marche aussi
> Partout où une closure est attendue, tu peux donner le **nom** d'une fonction, sans parenthèses : `appliquer_a_tous(&[1, 2, 3], double)` avec la fonction `double` du code de départ.
