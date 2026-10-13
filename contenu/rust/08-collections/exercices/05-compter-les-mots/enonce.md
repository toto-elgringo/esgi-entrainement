Le grand classique de la `HashMap` : compter combien de fois chaque mot apparaît.

1. `compter_mots(texte)` renvoie une `HashMap` qui associe chaque mot (en **minuscules**) à son nombre d'apparitions.
2. `nombre_de(compteur, mot)` renvoie le nombre d'apparitions de `mot`, ou `0` s'il n'apparaît pas.

```rust
let compteur = compter_mots("Le chat et le chien");
// {"le": 2, "chat": 1, "et": 1, "chien": 1}
nombre_de(&compteur, "le");      // 2
nombre_de(&compteur, "souris");  // 0
```

> [!tip] Rappel
> `entry(cle).or_insert(0)` donne la case de la clé, créée à `0` si elle n'existait pas.
