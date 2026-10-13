Deux fonctions modifient une liste, et aucune ne compile (erreur **E0502**) :

1. `dupliquer_le_premier(v)` ajoute une copie du premier élément à la fin, puis renvoie ce premier élément.
   Avec `[1, 2, 3]` : la liste devient `[1, 2, 3, 1]` et la fonction renvoie `1`.
2. `ajouter_les_doubles(v)` ajoute à la fin le double de chaque élément de départ.
   Avec `[1, 2, 3]` : la liste devient `[1, 2, 3, 2, 4, 6]`.

Corrige-les. On suppose que la liste n'est jamais vide.

> [!warning] Pourquoi Rust refuse ?
> `push` peut avoir besoin d'agrandir la liste, donc de la **déplacer** ailleurs en mémoire. Une référence vers une ancienne case pointerait alors vers une zone libérée. En C++, c'est un bug silencieux ; en Rust, une erreur de compilation.
