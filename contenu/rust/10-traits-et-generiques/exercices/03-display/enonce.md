Implémente le trait `Display` pour deux types, afin de pouvoir les afficher avec `{}` :

1. `Fraction` s'affiche `numerateur/denominateur` (`3/4`), sauf si le dénominateur vaut 1 : on affiche seulement le numérateur (`5`).
2. `Temperature` s'affiche avec **un** chiffre après la virgule, suivi de ` °C` (`21.5 °C`).

| Valeur | `format!("{}", ...)` |
|---|---|
| `Fraction { numerateur: 3, denominateur: 4 }` | `"3/4"` |
| `Fraction { numerateur: 5, denominateur: 1 }` | `"5"` |
| `Temperature { celsius: 21.456 }` | `"21.5 °C"` |
| `Temperature { celsius: -3.0 }` | `"-3.0 °C"` |

> [!tip] Bonus offert
> Dès qu'un type implémente `Display`, il obtient automatiquement la méthode `.to_string()`.
