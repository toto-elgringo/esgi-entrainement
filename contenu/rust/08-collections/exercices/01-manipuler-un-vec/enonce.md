Pars de la liste `v = [3, 1, 4]` et effectue ces étapes, en affichant le résultat après chacune :

1. afficher la liste de départ ;
2. ajouter `1` à la fin avec `push`, puis afficher la liste ;
3. retirer le dernier élément avec `pop` et afficher ce que `pop` renvoie ;
4. trier la liste avec `sort`, puis l'afficher ;
5. afficher sa taille avec `len` ;
6. afficher `v.get(0)` puis `v.get(9)`.

La sortie doit être **exactement** :

```text
Départ : [3, 1, 4]
Après push(1) : [3, 1, 4, 1]
pop() renvoie : Some(1)
Après sort() : [1, 3, 4]
Taille : 3
get(0) : Some(1)
get(9) : None
```

> [!tip] Rappel
> `{:?}` est obligatoire pour afficher un `Vec` ou une `Option`.
