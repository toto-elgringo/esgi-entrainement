La fonction `contient(tab, n, valeur)` doit renvoyer `1` si `valeur` est quelque part dans le tableau, et `0` sinon.

Elle compile sans erreur, mais elle se trompe :

```text
contient({42, -4, 6, 3}, 4, 42) -> 1   juste
contient({42, -4, 6, 3}, 4, 6)  -> 0   faux, 6 est bien dans le tableau
```

Trouve pourquoi et corrige-la.

> [!warning] Une erreur très courante
> Ce bug apparaît dans beaucoup de premières versions d'une recherche. Il passe inaperçu tant qu'on ne teste qu'une valeur placée dans la première case.
