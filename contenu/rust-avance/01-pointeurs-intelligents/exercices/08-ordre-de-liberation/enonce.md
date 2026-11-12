# L'ordre de libération

Ce programme crée quatre étiquettes, dont une dans une `Box`. Pour l'instant, il n'affiche rien quand elles disparaissent.

Ajoute le trait `Drop` à `Etiquette` pour qu'elle affiche `Libération de <nom>` en disparaissant. Tu n'as rien d'autre à changer : lance le programme et observe dans quel ordre Rust libère les valeurs.

Le programme doit afficher exactement :

```text
dans le bloc
Libération de b
Libération de c
après drop de c
fin du main
Libération de d
Libération de a
```

> [!info] À observer
> `b` disparaît à la fin de son bloc, `c` au moment du `drop(c)`, puis `d` et `a` à la fin de `main`, **dans l'ordre inverse de leur création**.
