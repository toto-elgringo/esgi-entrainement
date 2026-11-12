Le programme doit calculer la somme des nombres de `1` à `12`, en les découpant en **morceaux de 4** : chaque morceau est additionné par son propre thread.

Complète la ligne `let sommes: Vec<u32> = todo!();` pour qu'elle :

1. lance un thread par morceau avec `thread::scope` ;
2. attende les threads et rassemble les sommes **dans l'ordre des morceaux**.

L'affichage reste dans `main`, après les threads : il est donc toujours dans le même ordre. La sortie doit être **exactement** :

```text
Morceau 1 : 10
Morceau 2 : 26
Morceau 3 : 42
Total : 78
```

> [!tip] Pourquoi afficher à la fin ?
> Si chaque thread affichait lui-même son résultat, l'ordre changerait d'une exécution à l'autre. En renvoyant les résultats puis en affichant dans le thread principal, la sortie est toujours identique.
