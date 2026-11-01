La suite de Fibonacci commence par `0` et `1`, puis chaque nombre est la somme des deux précédents : `0, 1, 1, 2, 3, 5, 8, 13, 21...`

1. Complète `impl Iterator for Fibonacci` : la méthode `next` renvoie le nombre actuel et fait avancer la suite. Elle ne renvoie jamais `None` : la suite est **infinie**.
2. `fibonacci_premiers(n)` : les `n` premiers nombres de la suite.
3. `fibonacci_pairs(n)` : les `n` premiers nombres **pairs** de la suite.
4. `fibonacci_sous(limite)` : tous les nombres de la suite strictement inférieurs à `limite`.
5. `chiffres(n)` : un itérateur sur les chiffres de `n`, **de droite à gauche** (les unités d'abord). Il est paresseux : rien n'est calculé tant qu'on ne le consomme pas.

Les fonctions 2 à 4 utilisent ton itérateur `Fibonacci` avec les méthodes que tu connais (`take`, `filter`, `take_while`...), sans boucle.

| Appel | Résultat |
|---|---|
| `fibonacci_premiers(7)` | `[0, 1, 1, 2, 3, 5, 8]` |
| `fibonacci_pairs(4)` | `[0, 2, 8, 34]` |
| `fibonacci_sous(20)` | `[0, 1, 1, 2, 3, 5, 8, 13]` |
| `chiffres(4072).collect::<Vec<u64>>()` | `[2, 7, 0, 4]` |
| `chiffres(4072).sum::<u64>()` | `13` |

> [!tip] Le code de départ
> `chiffres` renvoie `std::iter::empty()`, un itérateur vide, pour que le code compile : remplace-le. Le type de retour `impl Iterator<Item = u64>` veut dire « un itérateur qui donne des `u64` ».

> [!warning] Les nombres de Fibonacci grandissent vite
> Au-delà d'environ 90 nombres, la suite ne tient plus dans un `u64` : en mode debug, l'addition provoque alors une panique. Les tests restent bien en dessous.
