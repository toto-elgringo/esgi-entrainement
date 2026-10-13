Même problème que l'exercice précédent, **autre solution** : cette fois, sans référence.

La fonction **prend** la `String` (*move*), la modifie, puis la **rend** à l'appelant.

Signature attendue :

```rust
fn changer_derniere_lettre(mut s: String) -> String
```

Exemple : `changer_derniere_lettre(String::from("Coco"))` renvoie `"Coca"`.

> [!tip] Laquelle choisir ?
> La fonction modifie une valeur et rend la main : `&mut` (exercice précédent, le plus courant). Elle « consomme » une valeur pour en produire une autre : par valeur, comme ici.
