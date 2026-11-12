Une boutique donne le prix d'un article avec la fonction asynchrone `prix` (pain : 2, lait : 1, fromage : 5, autre : 0).

Écris deux fonctions asynchrones :

1. `total_panier(articles)` : la somme des prix de tous les articles ;
2. `plus_cher(articles)` : le prix le plus élevé (`0` si la liste est vide).

| Appel | Résultat |
|---|---|
| `total_panier(&["pain", "lait", "pain"])` | `5` |
| `plus_cher(&["pain", "fromage", "lait"])` | `5` |
| `plus_cher(&[])` | `0` |

> [!info] Séquence
> Chaque `.await` attend la fin du précédent : les prix sont demandés l'un après l'autre.
