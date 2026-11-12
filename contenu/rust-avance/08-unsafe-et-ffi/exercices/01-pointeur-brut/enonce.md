Écris deux fonctions sûres qui utilisent un pointeur brut à l'intérieur :

1. `lire(x: &i32) -> i32` : convertit `x` en `*const i32` puis lit la valeur à travers le pointeur.
2. `ecrire(x: &mut i32, valeur: i32)` : convertit `x` en `*mut i32` puis y écrit `valeur`.

Garde le bloc `unsafe` aussi petit que possible.

> [!info] Rappel
> Créer un pointeur brut est sûr. Seul le déréférencement demande `unsafe`.
