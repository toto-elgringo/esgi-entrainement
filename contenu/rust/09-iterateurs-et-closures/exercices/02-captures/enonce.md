Deux fonctions qui utilisent des closures **ne compilent pas**. Corrige-les en lisant les messages d'erreur.

1. `compter_appels()` crée une closure qui ajoute 1 à `compteur`, l'appelle trois fois, puis renvoie `compteur` (donc `3`).
2. `creer_salutation(nom)` renvoie une closure qui, à chaque appel, renvoie `"Bonjour <nom> !"`.

```rust
let saluer = creer_salutation("Ana".to_string());
saluer();   // "Bonjour Ana !"
saluer();   // "Bonjour Ana !"
```

> [!tip] Rappel
> Une closure qui **modifie** une variable capturée la capture en `&mut` : la variable doit être `mut`, et la closure aussi.
> Une closure qui doit **survivre** à la fonction qui la crée doit prendre possession de ses variables avec `move`.
