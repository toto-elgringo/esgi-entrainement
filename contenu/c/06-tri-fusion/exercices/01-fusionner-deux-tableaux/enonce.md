Écris la fonction `fusionner(a, na, b, nb, resultat)` qui reçoit deux tableaux **déjà triés** dans l'ordre croissant, `a` (de taille `na`) et `b` (de taille `nb`), et range toutes leurs valeurs, dans l'ordre croissant, dans `resultat`.

```c
int a[] = {1, 4, 9};
int b[] = {2, 3, 10, 11};
int resultat[7];
fusionner(a, 3, b, 4, resultat);
```

`resultat` contient alors `1 2 3 4 9 10 11`.

- `resultat` a exactement `na + nb` cases : n'écris pas plus loin.
- `na` ou `nb` peut valoir 0 (tableau vide).
- Les doublons sont gardés : `{2, 5}` et `{2}` donnent `{2, 2, 5}`.
- Ta fonction doit faire **un seul passage** : pas question de tout recopier puis de trier.

> [!tip] Avec des cartes
> Pose les deux paquets triés face visible. À chaque tour, prends la plus petite des deux cartes du dessus et pose-la sur ton tas résultat.
