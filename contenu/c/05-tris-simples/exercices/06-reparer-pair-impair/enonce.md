Le **tri pair-impair** alterne deux phases : la phase paire compare les paires `(0, 1)`, `(2, 3)`, `(4, 5)`… ; la phase impaire compare `(1, 2)`, `(3, 4)`… À chaque fois, une paire dans le désordre est échangée.

La fonction `tri_pair_impair` ci-dessous a deux défauts :

1. sur certains tableaux, elle fait entrer dans le résultat une valeur qui n'en faisait **pas partie** ;
2. elle fait toujours `n` phases, même sur un tableau déjà trié : 1 000 valeurs triées demandent environ 500 000 comparaisons au lieu de 999.

```text
tableau de 5 cases dans une zone {5, 2, 9, 1, 7, -100}
attendu : 1 2 5 7 9       obtenu : -100 1 2 5 7 (le -100 était hors du tableau)
```

Corrige-la : elle doit trier, ne lire que les `n` cases du tableau, et s'arrêter dès qu'un **tour complet** (phase paire puis phase impaire) n'a fait aucun échange. Garde `plus_grand` pour chaque comparaison : les tests comptent les comparaisons.

> [!warning] Un tour, pas une phase
> Une phase paire sans échange ne suffit pas pour conclure : la phase impaire peut encore trouver des voisins dans le désordre. On ne s'arrête qu'après les deux phases.
