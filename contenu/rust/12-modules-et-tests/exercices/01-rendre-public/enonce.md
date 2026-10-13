Le module `geometrie` contient trois fonctions, mais `main` n'arrive pas à les utiliser : **E0603**, « function is private ».

Rends publiques **uniquement** les fonctions utilisées en dehors du module :

- `aire_rectangle(largeur, hauteur)` : `largeur × hauteur` ;
- `perimetre_rectangle(largeur, hauteur)` : `2 × (largeur + hauteur)`.

La fonction `double` est une aide interne : elle peut rester privée.

> [!info] Privé par défaut
> En Rust, tout ce qui est dans un module est invisible de l'extérieur, sauf ce qui est marqué `pub`.
