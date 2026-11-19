Écris `construireTas(t, n)` : la fonction réorganise les `n` cases de `t` pour qu'elles forment un **tas max**, en **O(n)**, avec la méthode « en partant du bas » :

- les cases sans enfant (les feuilles) sont déjà des tas d'une case ;
- on fait **descendre** chaque case qui a au moins un enfant, de la **dernière** jusqu'à la **racine**.

```text
construireTas sur  1 2 3 4 5 6 7     (n = 7, on commence à la case n / 2 - 1 = 2)

case 2 : 3 descend sous 7      1 2 7 4 5 6 3
case 1 : 2 descend sous 5      1 5 7 4 2 6 3
case 0 : 1 descend sous 7,     7 5 1 4 2 6 3
         puis sous 6           7 5 6 4 2 1 3
```

La fonction `descendre(t, taille, i)` de l'exercice précédent est fournie.

> [!info] Pas par insertions
> Insérer les cases une par une (avec la remontée) donne aussi un tas, mais un **autre** : `7 4 6 1 3 2 5` pour cet exemple, et en O(n log n). Les tests attendent exactement le tas obtenu en partant du bas.
