`n` personnes, numérotées de 1 à `n`, sont assises en cercle. On compte de 1 à `k` en tournant : la personne qui dit `k` est **éliminée**, et la suivante recommence à compter à partir de 1. On continue jusqu'à ce qu'il ne reste qu'une personne.

Écris `eliminer(n, k, ordre)` qui :

- range dans `ordre` les numéros des `n - 1` personnes éliminées, **dans l'ordre** de leur élimination ;
- renvoie le numéro de la personne qui reste.

Exemple avec `n = 6` et `k = 3` :

```text
file : 1 2 3 4 5 6    1 et 2 comptent, 3 éliminée
file : 4 5 6 1 2      4 et 5 comptent, 6 éliminée
file : 1 2 4 5        1 et 2 comptent, 4 éliminée
file : 5 1 2          5 et 1 comptent, 2 éliminée
file : 5 1            5 et 1 comptent, 5 éliminée
file : 1              il reste 1
```

`ordre` vaut `3 6 4 2 5` et la fonction renvoie `1`.

Utilise la file dans un tableau circulaire fournie (`enfiler`, `defiler`) : celui qui compte est toujours la tête. On a toujours `n >= 1` et `k >= 1`. Le tableau de la file doit être réservé avec `malloc` (sa taille dépend de `n`) et libéré avant de renvoyer le résultat.
