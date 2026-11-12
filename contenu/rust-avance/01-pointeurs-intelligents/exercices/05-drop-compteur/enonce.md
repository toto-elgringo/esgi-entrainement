# Compter les libérations avec Drop

Un `Jeton` garde un compteur partagé (`Rc<Cell<u32>>`). On veut que ce compteur augmente de 1 **à chaque fois qu'un jeton est libéré**.

> [!info] `Cell` en une ligne
> `Cell<u32>` est une boîte qu'on peut modifier avec `set` même quand on n'a qu'une référence non mutable. `get()` lit la valeur. `Rc` permet de partager le même compteur entre le programme et tous les jetons.

À faire :

1. Implémente le trait `Drop` pour `Jeton` : dans `drop`, ajoute 1 au compteur.
2. Écris `creer_et_perdre(compteur, n)` : crée `n` jetons l'un après l'autre, chacun étant libéré à la fin de son tour de boucle.

Les tests vérifient qu'un jeton vivant ne change pas le compteur, que `drop(jeton)` ou la fin d'une portée l'augmente, et que les jetons rangés dans une `Box` sont aussi comptés.
