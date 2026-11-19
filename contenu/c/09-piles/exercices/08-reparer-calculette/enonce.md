La fonction `calculer(calcul)` évalue un calcul en **notation polonaise inverse** avec une pile, et affiche une ligne :

- chaque élément fait **un seul caractère** : un chiffre, `+`, `-` ou `x` (multiplier), séparés par des espaces ;
- le résultat, si le calcul est correct ;
- `PAS ASSEZ DE NOMBRES` si un opérateur arrive alors que la pile contient moins de deux nombres, ou si la pile est vide à la fin ;
- `TROP DE NOMBRES` s'il reste plus d'un nombre à la fin ;
- `SYMBOLE INCONNU` dès qu'on lit un caractère qui n'est ni un espace, ni un chiffre, ni un des trois opérateurs (le calcul s'arrête là).

Le code fourni a **deux bugs**. Le programme doit afficher exactement :

```text
3
12
5
PAS ASSEZ DE NOMBRES
PAS ASSEZ DE NOMBRES
TROP DE NOMBRES
SYMBOLE INCONNU
9
```

> [!tip] Méthode
> Fais tourner `calculer("1 2 +")` à la main jusqu'à la toute fin, en notant la valeur de `pile.size` après **chaque** ligne. Puis fais de même avec `4 2 /`.
