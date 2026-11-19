Écris la fonction `retirer(tab, n, valeur)` qui enlève du tableau **toutes** les cases égales à `valeur`, en gardant l'ordre des autres. Elle renvoie la nouvelle taille.

```c
int tab[] = {3, 0, 1, 0, 0, 2};
size_t n = retirer(tab, 6, 0);
```

Après l'appel, `n` vaut 3 et les trois premières cases contiennent `3 1 2` (le contenu des cases suivantes n'a pas d'importance).

La fonction doit être en **O(n)** : un des tests utilise un tableau de 400 000 cases dont la moitié est à retirer. Une méthode en O(n²) dépasse le temps permis.

> [!tip] Lire et écrire dans le même tableau
> L'indice d'écriture n'est jamais en avance sur l'indice de lecture : on n'écrase donc jamais une valeur qu'on n'a pas encore lue.
