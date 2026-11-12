Écris la macro `voir!` : pour chaque expression reçue, elle affiche le **code** de l'expression, un signe `=`, puis sa **valeur** au format `{:?}`.

Avec le `main` fourni, le programme doit afficher :

```text
x = 5
x * 2 + 1 = 11
nom = "Ada"
x > 3 = true
```

C'est impossible avec une fonction : elle ne voit pas le texte du code, seulement sa valeur.

> [!info] `stringify!`
> `stringify!(x * 2 + 1)` donne le texte `"x * 2 + 1"`. L'expression n'est pas calculée, juste écrite.
