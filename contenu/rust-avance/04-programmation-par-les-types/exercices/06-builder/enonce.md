Une `Requete` a une adresse, une méthode (`GET` par défaut), un délai en secondes (30 par défaut) et des en-têtes. Plutôt qu'un constructeur à quatre paramètres, on écrit un **builder** qu'on remplit pas à pas.

Complète `RequeteBuilder` :

1. `nouveau()` : pas d'adresse, méthode `"GET"`, délai `30`, aucun en-tête.
2. `url(..)`, `methode(..)`, `delai(..)` et `en_tete(nom, valeur)` : chacune **prend `self` et le rend** pour pouvoir enchaîner les appels. `en_tete` ajoute à la liste (l'ordre est gardé).
3. `construire()` renvoie un `Result<Requete, String>` :
   - sans adresse : `Err("l'adresse est obligatoire")`
   - avec un délai de `0` : `Err("le délai doit être positif")`
   - sinon `Ok(Requete)`.

```rust
let requete = RequeteBuilder::nouveau()
    .url("https://exemple.fr")
    .methode("POST")
    .en_tete("Accept", "json")
    .construire();
```

> [!info] Pourquoi un `Result` à la fin ?
> Le builder peut être incomplet pendant qu'on le remplit. Seule la méthode `construire` vérifie : une `Requete` qui existe est donc toujours valide.
