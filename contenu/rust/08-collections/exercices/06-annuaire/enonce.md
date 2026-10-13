Un annuaire associe un **nom** à un **numéro** : `HashMap<String, String>`.

Écris trois fonctions :

1. `ajouter(annuaire, nom, numero)` : enregistre le numéro. Renvoie `true` si le nom est **nouveau**, `false` s'il existait déjà (son numéro est alors remplacé).
2. `chercher(annuaire, nom)` : renvoie `Some(numero)` ou `None` si le nom est inconnu.
3. `supprimer(annuaire, nom)` : retire le contact. Renvoie `true` s'il existait, `false` sinon.

```rust
let mut annuaire = HashMap::new();
ajouter(&mut annuaire, "Alice", "06 11 22 33 44");   // true
ajouter(&mut annuaire, "Alice", "07 00 00 00 00");   // false (numéro remplacé)
chercher(&annuaire, "Alice");                        // Some("07 00 00 00 00")
supprimer(&mut annuaire, "Bob");                     // false
```
