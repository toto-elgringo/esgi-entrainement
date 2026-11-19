Écris `tri_bulles(tab, n)` qui trie le tableau dans l'ordre croissant avec le **tri à bulles**, en allant du début vers la fin : on compare chaque case à sa voisine de droite et on les échange si elles sont dans le mauvais ordre.

```text
4 1 3 2
passage 1 : 1 3 2 | 4
passage 2 : 1 2 | 3 4
passage 3 : 1 | 2 3 4      aucun échange : on s'arrête
```

Deux améliorations sont demandées :

1. après un passage, la dernière case de la zone est à sa place : le passage suivant **s'arrête une case plus tôt** ;
2. **arrêt anticipé** : si un passage n'a fait aucun échange, le tableau est trié, on s'arrête tout de suite.

Utilise les deux fonctions fournies : `plus_grand(a, b)` (renvoie 1 si `a > b`) pour **chaque** comparaison, et `echanger`. Elles comptent leur travail dans `nb_comparaisons` et `nb_echanges`. Les tests vérifient qu'un tableau déjà trié de 1 000 cases ne demande que **999 comparaisons** (un seul passage), et qu'un tableau de 5 cases ne dépasse jamais 10 comparaisons.

> [!warning] Le voisin qui n'existe pas
> La boucle intérieure compare `tab[j]` et `tab[j + 1]` : `j + 1` doit rester dans la zone. Écris la borne `j + 1 < fin` plutôt que `j < fin - 1`, qui déborde quand `fin` vaut 0 (`size_t`).
