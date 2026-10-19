Écris la fonction **récursive** `afficherEnvers(c)` qui affiche les valeurs de la liste **de la dernière à la première**, chacune suivie d'une espace. Interdits : modifier la liste, utiliser un tableau.

Le `main` fourni affiche trois listes : `1 -> 2 -> 3 -> 4`, `42`, et la liste vide. Le programme doit afficher :

```text
à l'envers : 4 3 2 1
à l'envers : 42
à l'envers :
```

(Les espaces en fin de ligne ne comptent pas.)

> [!tip] L'ordre des deux lignes
> Dans une fonction récursive, ce qu'on fait **avant** l'appel récursif se passe à l'aller (dans l'ordre de la liste), ce qu'on fait **après** se passe au retour (dans l'ordre inverse).
