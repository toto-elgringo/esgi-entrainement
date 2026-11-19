Écris la fonction `minimum(tab, n)` qui renvoie la plus petite valeur d'un tableau **non trié** de `n` entiers. On suppose que `n > 0`.

```c
int tab[] = {42, -4, 6, 3};
minimum(tab, 4);
```

renvoie `-4`.

Ta fonction doit faire **un seul passage** sur le tableau (O(n)) : pas question de comparer chaque case à toutes les autres (O(n²)).

> [!tip] Un tableau qui grandit
> Si tu connais le minimum des premières cases, il suffit de le comparer à la case suivante pour connaître le minimum d'une case de plus.
