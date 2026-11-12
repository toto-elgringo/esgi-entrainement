Un `Vecteur` a deux coordonnées `x` et `y`. Rends-le utilisable avec les opérateurs de Rust en implémentant les traits de `std::ops` :

1. `Add` : `a + b` additionne les coordonnées.
2. `Sub` : `a - b` soustrait les coordonnées.
3. `Neg` : `-a` change le signe des deux coordonnées.
4. `Mul<f64>` : `a * k` multiplie les deux coordonnées par le nombre `k`.

| Expression | Résultat |
|---|---|
| `(1, 2) + (3, 4)` | `(4, 6)` |
| `(5, 5) - (2, 1)` | `(3, 4)` |
| `-(1, -2)` | `(-1, 2)` |
| `(1.5, 2) * 2.0` | `(3, 4)` |

> [!tip] Rappel
> Chaque `impl` contient `type Output = Vecteur;` : c'est le type du résultat.
