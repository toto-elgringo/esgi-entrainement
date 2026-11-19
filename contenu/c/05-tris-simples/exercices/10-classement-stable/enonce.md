Un professeur a une liste de fiches `{nom, note}` **rangée par ordre alphabétique**. Il veut un classement par note, de la **meilleure à la moins bonne**, et, à note égale, garder l'ordre alphabétique.

```text
départ : Alice 12, Bruno 15, Chloe 12, David 18
voulu  : David 18, Bruno 15, Alice 12, Chloe 12
```

Il suffit pour ça que le tri soit **stable** : deux fiches de même note restent dans leur ordre de départ.

La fonction `classer` fournie utilise un tri par sélection. Elle range bien les notes, mais elle donne `David 18, Bruno 15, Chloe 12, Alice 12` : en échangeant Alice avec David, elle l'a envoyée derrière Chloe. Réécris `classer` avec un tri **stable** (par exemple le tri par insertion), en place, sans tableau en plus.

> [!tip] Des structures dans un tableau
> `fiches[i].note` est la note de la fiche `i`. Une structure se copie en entier avec `=` : `Fiche f = fiches[i];` puis `fiches[j] = f;`.

> [!warning] Le signe qui décide de la stabilité
> Dans le tri par insertion, on décale tant que la fiche de gauche est **strictement** moins bonne. Avec `<=`, une fiche passerait par-dessus ses égales et le tri ne serait plus stable.
