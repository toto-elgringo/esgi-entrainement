Le tri fusion coupe un tableau en deux moitiés (`n / 2` cases à gauche, le reste à droite), puis recoupe chaque moitié, jusqu'à n'avoir que des morceaux de 1 case.

Écris la fonction **récursive** `nombreNiveaux(n)` qui renvoie le nombre de niveaux de découpage pour un tableau de `n` cases.

```text
8 cases : 8 -> 4 -> 2 -> 1       3 niveaux
5 cases : 5 -> 3 (et 2) -> 2 -> 1   3 niveaux (on suit la plus grande moitié)
1 case  : rien à couper          0 niveau
```

| n | 0 | 1 | 2 | 3 | 4 | 5 | 8 | 9 | 1000 | 1024 | 1025 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| niveaux | 0 | 0 | 1 | 2 | 2 | 3 | 3 | 4 | 10 | 10 | 11 |

Pas de boucle ni de `math.h` : la fonction doit s'appeler elle-même.

> [!tip] Le lien avec la complexité
> Ce nombre, c'est **log₂ n** arrondi au-dessus. À chaque niveau, les fusions coûtent n en tout : le tri fusion coûte donc n × log₂ n.
