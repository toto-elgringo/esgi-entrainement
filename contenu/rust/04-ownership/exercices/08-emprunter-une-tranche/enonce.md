`somme(nombres)` additionne une liste de nombres, `moyenne(nombres)` calcule leur moyenne.

Le code ne compile pas : la liste est **déplacée** dans `somme`, puis réutilisée.

Corrige les deux signatures pour qu'elles **empruntent** une tranche `&[i32]`, puis adapte les appels. Les tests appellent par exemple `somme(&[1, 2, 3])` et `moyenne(&notes)`.

> [!tip] `&[i32]`
> `&[i32]` est à `Vec<i32>` ce que `&str` est à `String` : un emprunt en lecture d'une suite d'éléments. Il accepte un `&Vec<i32>`, un tableau `&[1, 2, 3]` ou un morceau de liste `&v[1..3]`.
