Le compilateur refuse deux `&mut` sur le même tableau, même s'ils ne se touchent pas. Écris ta propre version de `split_at_mut` :

`couper_en_deux(t: &mut [i32], milieu: usize) -> (&mut [i32], &mut [i32])`

- Le premier morceau contient les `milieu` premiers éléments, le second le reste.
- Si `milieu` est plus grand que la longueur, la fonction **panique** (avec `assert!`).
- La fonction elle-même est **sûre** : le bloc `unsafe` reste à l'intérieur.

| Appel | Résultat |
|---|---|
| `couper_en_deux(&mut [1, 2, 3, 4, 5], 2)` | `([1, 2], [3, 4, 5])` |
| `couper_en_deux(&mut [1, 2], 0)` | `([], [1, 2])` |
