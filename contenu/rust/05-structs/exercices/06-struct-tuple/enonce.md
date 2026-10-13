Deux **structs tuples** enveloppent un `f64` : `Celsius(f64)` et `Fahrenheit(f64)`. Ce sont deux types différents : impossible de passer des Fahrenheit à une fonction qui attend des Celsius.

Écris :

1. `vers_fahrenheit(c)` : F = C × 9 / 5 + 32 ;
2. `vers_celsius(f)` : C = (F − 32) × 5 / 9 ;
3. `est_gele(c)` : `true` si la température est inférieure ou égale à 0 °C.

| Appel | Résultat |
|---|---|
| `vers_fahrenheit(Celsius(100.0)).0` | `212.0` |
| `vers_celsius(Fahrenheit(32.0)).0` | `0.0` |
| `est_gele(&Celsius(-5.0))` | `true` |

> [!warning] Nombres à virgule
> Écris `9.0`, `5.0`, `32.0` : Rust ne convertit pas tout seul un entier en `f64`.
