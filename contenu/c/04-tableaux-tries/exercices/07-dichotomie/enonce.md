Écris `dichotomie(tab, n, valeur)` qui cherche `valeur` dans un tableau **trié dans l'ordre croissant** de `n` entiers **tous différents**. Elle renvoie la position de la valeur, ou `-1` si elle est absente.

```c
int tab[] = {-4, 3, 6, 42};
dichotomie(tab, 4, 6);
dichotomie(tab, 4, 2);
```

renvoient `2` et `-1`.

Méthode : on regarde la case du **milieu** de la zone encore possible. Si c'est la valeur, on a fini. Si la valeur est plus petite, on ne garde que la moitié gauche, sinon la moitié droite. On s'arrête quand la zone est vide.

La fonction doit être en **O(log n)** : un test fait deux millions de recherches dans un tableau d'un million de cases. Une recherche case par case dépasse le temps permis.

> [!warning] Les cas qui piègent
> Une valeur plus petite que toutes les autres (la zone se réduit vers la gauche jusqu'à la position 0), plus grande que toutes les autres, un tableau d'une seule case et le tableau vide (`NULL`, `n = 0`). Teste-les tous.
