Écris la fonction `supprimer(tab, n, position)` qui retire la case `position` du tableau en décalant les suivantes vers la gauche.

- `n` est l'**adresse** de la taille : la fonction la diminue de 1 après une suppression.
- Elle renvoie `1` si la suppression a eu lieu, `0` si `position` ne correspond à aucune case (le tableau et la taille ne changent pas).
- L'ordre des autres valeurs est conservé.

```c
int tab[] = {1, 2, 3, 4, 5};
size_t n = 5;
supprimer(tab, &n, 2);
```

Après l'appel, `n` vaut 4 et les quatre premières cases contiennent `1 2 4 5`.

> [!tip] Pourquoi passer `&n` ?
> Si la fonction recevait `n` tout court, elle travaillerait sur une copie : l'appelant croirait que le tableau a toujours 5 cases. Avec l'adresse, la fonction met la taille à jour elle-même et l'appelant ne peut pas l'oublier.
