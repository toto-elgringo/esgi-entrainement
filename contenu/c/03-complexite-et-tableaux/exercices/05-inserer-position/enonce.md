Un tableau a une **capacité** (le nombre de cases réservées) et une **taille** (le nombre de cases utilisées, au début du tableau).

Écris la fonction `inserer(tab, n, capacite, position, valeur)` qui insère `valeur` à la case `position` en décalant les suivantes vers la droite.

- `n` est l'adresse de la taille : la fonction l'augmente de 1.
- `position` peut aller de `0` (devant la première case) à `*n` (après la dernière).
- Elle renvoie `1` si l'insertion a eu lieu, `0` si le tableau est plein ou si `position` est trop grande (rien ne change alors).

```c
int tab[8] = {1, 2, 3, 4, 5};
size_t n = 5;
inserer(tab, &n, 8, 2, 10);
```

Après l'appel, `n` vaut 6 et le tableau commence par `1 2 10 3 4 5`.

> [!warning] Le sens du décalage
> Si tu décales en partant de `position`, chaque copie écrase la valeur suivante avant qu'elle ait bougé. Fais l'essai sur papier.
