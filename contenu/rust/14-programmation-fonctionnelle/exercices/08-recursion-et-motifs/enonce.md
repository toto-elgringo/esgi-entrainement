Écris ces fonctions de façon **récursive** (elles s'appellent elles-mêmes), avec un `match` et des motifs de tranche, sans boucle ni itérateur (les tests ne vérifient que les résultats : à toi de jouer le jeu).

1. `produit(liste)` : le produit des nombres (`1` pour une liste vide).
2. `maximum(liste)` : le plus grand nombre, ou `None` pour une liste vide.
3. `est_croissante(liste)` : `true` si chaque nombre est inférieur ou égal au suivant. Une liste vide ou d'un seul élément est croissante.
4. `inverser(liste)` : une **nouvelle** liste, à l'envers.
5. `puissance(base, exposant)` : `base` à la puissance `exposant`, par **exponentiation rapide** :
   - un exposant `0` donne `1` ;
   - si l'exposant `e` est pair, on calcule une seule fois `base` puissance `e / 2`, puis on multiplie ce résultat par lui-même ;
   - sinon, c'est `base` × (`base` puissance `e - 1`).

| Appel | Résultat |
|---|---|
| `produit(&[2, 3, 4])` | `24` |
| `maximum(&[3, 9, 2])` | `Some(9)` |
| `est_croissante(&[1, 2, 2, 5])` | `true` |
| `inverser(&[1, 2, 3])` | `[3, 2, 1]` |
| `puissance(2, 10)` | `1024` |

> [!info] Rappel des motifs
> | Motif | Accepte |
> |---|---|
> | `[]` | une liste vide |
> | `[premier, reste @ ..]` | au moins 1 élément ; `reste` est la tranche qui suit |
> | `[debut @ .., dernier]` | au moins 1 élément ; `debut` est la tranche avant le dernier |
> | `[a, b, ..]` | au moins 2 éléments |

> [!warning] Pourquoi l'exponentiation rapide ?
> Avec la méthode lente (`base × puissance(base, e - 1)` à chaque fois), `puissance(1, 1_000_000)` ferait un million d'appels imbriqués : la pile déborde et le programme plante (« stack overflow »). La méthode rapide divise l'exposant par 2 tous les deux appels au plus : une quarantaine d'appels suffisent. Essaie les deux dans `main` avec **Exécuter** !
