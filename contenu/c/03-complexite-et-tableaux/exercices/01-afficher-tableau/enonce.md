Écris la fonction `afficher(tab, n)` qui affiche les `n` valeurs du tableau entre crochets, séparées par une virgule et un espace, puis passe à la ligne :

```text
[4, -2, 9, 0]
```

Il ne doit y avoir **aucun séparateur en trop** : ni avant la première valeur, ni après la dernière. Un tableau vide (`n == 0`) affiche `[]`.

Le `main` affiche un tableau vide, le tableau `7`, puis le tableau `4 -2 9 0`. Le programme doit afficher exactement :

```text
[]
[7]
[4, -2, 9, 0]
```

> [!info] Tableau vide
> En C, on ne peut pas déclarer un tableau de 0 case : le `main` passe `NULL` avec `n = 0`. Ta fonction ne doit donc lire **aucune** case quand `n` vaut 0.
