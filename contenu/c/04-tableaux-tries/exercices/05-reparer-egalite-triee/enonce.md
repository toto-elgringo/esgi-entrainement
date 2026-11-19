Deux tableaux **triés** sont égaux quand ils ont la même taille et les mêmes valeurs, le même nombre de fois. Comme ils sont triés, il suffit de les comparer case par case.

La fonction `egaux_tries(a, na, b, nb)` doit renvoyer `1` si les tableaux `a` (taille `na`) et `b` (taille `nb`) sont égaux, `0` sinon. Elle marche sur certains exemples, mais pas sur tous :

```text
{1, 2, 3} et {1, 2, 3}    -> 1   juste
{1, 2, 2} et {1, 3, 3}    -> 0   juste
{1, 2, 3} et {1, 2, 4}    -> 1   faux
{1, 2}    et {1, 2, 3}    -> 1   faux
```

Et avec deux tableaux vides, le programme plante. Corrige la fonction.

> [!tip] Tester les bords
> Les erreurs d'indice se cachent presque toujours dans la **première** case, la **dernière** case et le tableau **vide**. Ce sont les trois cas à essayer en premier.
