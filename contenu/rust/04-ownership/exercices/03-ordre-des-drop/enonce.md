Le type `Bruyant` affiche un message quand il est **créé** et quand il est **détruit** (`drop`).

Modifie **uniquement la fonction `main`** pour obtenir exactement :

```text
création de A
création de B
drop B
création de C
drop C
création de D
fin du main
drop D
drop A
```

Tes outils :

- un bloc `{ }` : ses variables sont détruites à la fin du bloc ;
- `drop(valeur)` : détruit la valeur tout de suite ;
- à la fin de `main`, les variables restantes sont détruites dans l'ordre **inverse** de création.

> [!warning] `_x` contre `_`
> `let _x = ...;` garde la valeur jusqu'à la fin du bloc. `let _ = ...;` la détruit **immédiatement**.
