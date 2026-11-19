On veut mesurer le travail d'un tri au lieu de le deviner. Écris deux fonctions.

**1.** `compter_inversions(tab, n)` renvoie le nombre d'**inversions** du tableau : les paires de positions `i < j` telles que `tab[i] > tab[j]`. Le tableau n'est pas modifié.

```text
5 2 9 1 7   ->  5 inversions : (5,2) (5,1) (2,1) (9,1) (9,7)
1 2 3       ->  0
3 2 1       ->  3
2 2 1       ->  2   (deux valeurs égales ne forment pas une inversion)
```

**2.** `tri_bulles_compte(tab, n, &comparaisons, &echanges)` trie le tableau avec le **tri à bulles** (zone qui raccourcit d'une case à chaque passage, arrêt anticipé dès qu'un passage ne fait aucun échange) et écrit dans les deux variables dont elle reçoit les adresses le nombre de comparaisons et le nombre d'échanges faits.

```c
size_t comparaisons;
size_t echanges;
int tab[] = {5, 2, 9, 1, 7};
tri_bulles_compte(tab, 5, &comparaisons, &echanges);
```

Après l'appel : `comparaisons` vaut 10 (passages de 4, 3, 2 puis 1 comparaison) et `echanges` vaut 5.

Les tests vérifient aussi la règle du cours : le tri à bulles fait **exactement autant d'échanges qu'il y a d'inversions**.

> [!info] Renvoyer deux résultats
> Une fonction C ne renvoie qu'une valeur. Pour en donner deux, on passe l'**adresse** de variables de l'appelant et on écrit dedans, comme `echanger` le fait déjà.
