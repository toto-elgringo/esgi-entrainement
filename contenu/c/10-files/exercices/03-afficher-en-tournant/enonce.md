Écris deux fonctions d'affichage pour la file dans un tableau circulaire (`tab`, `start`, `size`, `capacity`) :

- `afficher(q)` affiche les valeurs de la **tête** jusqu'à la **fin** (l'ordre dans lequel elles sortiront) ;
- `afficherDepuisFin(q)` affiche les valeurs de la **fin** jusqu'à la **tête**.

Chaque fonction affiche toutes les valeurs **sur une seule ligne**, séparées par un espace, **puis passe à la ligne**. Une file vide affiche `(vide)`.

Le `main` affiche quatre files :

| Tableau | `start` | `size` | La file, de la tête à la fin |
|---|---|---|---|
| `[7][0][0][3][5]` | 3 | 3 | 3 5 7 |
| `[7][0][0][3][5]` | 3 | 0 | vide |
| `[4][5][1][2][3]` | 2 | 5 | 1 2 3 4 5 |
| `[7][0][0][3][5]` | 4 | 1 | 5 |

Le programme doit afficher exactement :

```text
3 5 7
7 5 3
(vide)
(vide)
1 2 3 4 5
5 4 3 2 1
5
```

> [!warning] Le piège du retour à la ligne
> « Sur une seule ligne » veut dire : toutes les valeurs, **puis** `\n`. Sans lui, la file suivante s'affiche au bout de la même ligne et la sortie est fausse.
