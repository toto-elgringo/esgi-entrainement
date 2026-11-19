Presque tous les tris échangent deux cases. Écris la fonction `echanger(a, b)` qui échange le contenu des deux variables dont elle reçoit les **adresses**.

```c
int x = 3;
int y = 8;
echanger(&x, &y);
```

Après l'appel, `x` vaut 8 et `y` vaut 3. Pour échanger deux cases d'un tableau : `echanger(&tab[i], &tab[j])`.

Échanger une case avec elle-même (`echanger(&x, &x)`) ne doit rien changer.

> [!info] Pourquoi des adresses ?
> En C, une fonction reçoit des **copies** de ses paramètres. Avec `void echanger(int a, int b)`, seules les copies seraient échangées : les variables de l'appelant ne bougeraient pas.
