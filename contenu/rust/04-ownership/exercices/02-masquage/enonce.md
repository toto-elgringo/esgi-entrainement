`doubler_texte(saisie)` reçoit un nombre écrit en texte (par exemple `" 21 "`) et renvoie son double (`42`).

Le code ne compile pas. Corrige-le avec le **masquage** (*shadowing*) : un nouveau `let` qui réutilise le nom `saisie`, avec le type `u32`.

> [!tip] Rappel
> Écrire `let x = ...;` une deuxième fois ne modifie pas l'ancienne variable : c'est une **nouvelle** variable qui cache l'ancienne, et elle peut avoir un **autre type**.

`.trim()` enlève les espaces au début et à la fin. `.parse().unwrap()` transforme un texte en nombre (et fait planter le programme si le texte n'est pas un nombre).
