Écris ces fonctions avec `scan`, `take_while`, `skip_while` et `std::iter::successors`, **sans boucle ni variable `mut`** (les tests ne vérifient que les résultats : à toi de jouer le jeu).

1. `soldes(depart, mouvements)` : le solde d'un compte après chaque mouvement (un dépôt est positif, un retrait négatif).
2. `soldes_avant_decouvert(depart, mouvements)` : les mêmes soldes, en s'arrêtant **juste avant** le premier solde négatif (même si le compte redevient positif ensuite).
3. `sans_zeros_au_debut(chiffres)` : la liste sans les zéros du début. Les zéros placés plus loin restent.
4. `collatz(n)` : la suite de Collatz qui part de `n` (`n` vaut au moins 1). Si le nombre est pair, on le divise par 2 ; sinon, on le multiplie par 3 et on ajoute 1. La suite s'arrête en arrivant à `1`, qui en fait partie.
5. `puissances_jusqu_a(base, limite)` : les puissances de `base` (`1`, `base`, `base²`...) inférieures ou égales à `limite` (`base` vaut au moins 2). Attention : avec `limite = u64::MAX`, la puissance suivante ne tient plus dans un `u64`, et le programme ne doit pas planter.

| Appel | Résultat |
|---|---|
| `soldes(100, &[-20, 50, -10])` | `[80, 130, 120]` |
| `soldes_avant_decouvert(50, &[-20, -40, 100])` | `[30]` |
| `sans_zeros_au_debut(&[0, 0, 4, 0, 7])` | `[4, 0, 7]` |
| `collatz(6)` | `[6, 3, 10, 5, 16, 8, 4, 2, 1]` |
| `puissances_jusqu_a(3, 100)` | `[1, 3, 9, 27, 81]` |

> [!info] `std::iter::successors`
> `successors(Some(premier), |precedent| ...)` calcule chaque élément à partir du précédent. La suite s'arrête dès que la closure renvoie `None`.
