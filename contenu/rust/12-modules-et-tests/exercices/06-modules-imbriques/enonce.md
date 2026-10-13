Une station météo reçoit des températures en degrés **Fahrenheit** et doit lancer des alertes.

Dans le module `meteo` :

1. `conversion::celsius_vers_fahrenheit(c)` : `c × 9 / 5 + 32`.
2. `conversion::fahrenheit_vers_celsius(f)` : `(f − 32) × 5 / 9`.
3. `alerte::niveau(f)` : convertit `f` en Celsius **en réutilisant** le module `conversion`, puis renvoie :

| Température en Celsius | Niveau |
|---|---|
| moins de 0 | `"gel"` |
| de 0 à moins de 25 | `"normal"` |
| de 25 à moins de 35 | `"chaud"` |
| 35 et plus | `"canicule"` |

4. `main` (et les tests) appellent directement `niveau(...)`, sans chemin. Rends-le possible avec un **réexport** à la racine.

> [!tip] Réexport
> `pub use chemin::vers::fonction;` rend la fonction accessible depuis le module où on écrit cette ligne.
