`retirerRacine(t, taille)` doit retirer le **maximum** d'un tas max de `*taille` cases :

1. échanger la racine avec la dernière case du tas ;
2. diminuer `*taille` de 1 : l'ancien maximum reste dans le tableau, **juste après** le tas ;
3. faire descendre la nouvelle racine (échange avec le plus grand des enfants tant qu'il est plus grand) ;
4. renvoyer la valeur retirée.

Cette version se trompe sur certains tas :

```text
tas : 9 5 8 1 2 7          (taille 6)
attendu : 8 5 7 1 2 | 9    renvoie 9, taille 5
obtenu  : 8 5 9 1 2 | 7    renvoie 7
```

Trouve l'erreur et corrige-la.
