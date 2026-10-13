Un `u8` va de 0 à 255. Que faire quand `a + b` dépasse 255 ?

Le code actuel fait une addition simple : en mode debug, le programme **panique** en cas de débordement. Corrige les trois fonctions :

1. `ajouter_prudemment(a, b)` : `Some(somme)` si elle tient dans un `u8`, sinon `None`.
2. `ajouter_plafonne(a, b)` : la somme, mais bloquée à `255` au maximum.
3. `ajouter_en_boucle(a, b)` : la somme qui repart de zéro après 255 (250 + 10 donne 4).

| Méthode | Si ça déborde |
|---|---|
| `a.checked_add(b)` | `None` |
| `a.saturating_add(b)` | valeur maximale |
| `a.wrapping_add(b)` | repart de zéro |
