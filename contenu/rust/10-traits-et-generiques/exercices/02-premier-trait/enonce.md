Le trait `Vehicule` a deux méthodes obligatoires (`nom`, `roues`) et une méthode **par défaut** (`presenter`).

1. Écris la méthode par défaut `presenter` : elle renvoie `"<nom> : <roues> roues"`.
2. Complète `impl Vehicule for Velo` : le nom est `"Vélo"`, il a `2` roues.
3. Le vélo **remplace** la méthode par défaut : son `presenter` renvoie `"Vélo : 2 roues, sans moteur"`.

| Appel | Résultat |
|---|---|
| `Voiture { marque: "Renault".to_string() }.presenter()` | `"Renault : 4 roues"` |
| `Velo.presenter()` | `"Vélo : 2 roues, sans moteur"` |

> [!info] `struct Velo;`
> Une structure sans champ. On crée une valeur simplement en écrivant `Velo`.
