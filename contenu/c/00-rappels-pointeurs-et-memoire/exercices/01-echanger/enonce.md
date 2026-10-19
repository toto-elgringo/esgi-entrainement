Écris la fonction `echanger(a, b)` qui échange les valeurs de deux entiers. Elle reçoit leurs **adresses** :

```c
int x = 1;
int y = 2;
echanger(&x, &y);
```

Après l'appel, `x` vaut 2 et `y` vaut 1.

> [!tip] Rappel
> Si `a` est un `int *`, alors `*a` est l'entier qui se trouve à cette adresse : on peut le lire et le modifier.
