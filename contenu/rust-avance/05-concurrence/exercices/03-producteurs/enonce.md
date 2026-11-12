Écris `collecter(producteurs, par_producteur)` :

- elle lance `producteurs` threads ;
- le thread numéro `id` (de `0` à `producteurs - 1`) envoie par un canal les `par_producteur` nombres `id * 100 + i`, pour `i` de `0` à `par_producteur - 1` ;
- la fonction reçoit tous les messages, attend les threads, puis renvoie les nombres **triés** (l'ordre d'arrivée change d'une exécution à l'autre).

| Appel | Résultat |
|---|---|
| `collecter(3, 2)` | `vec![0, 1, 100, 101, 200, 201]` |
| `collecter(1, 3)` | `vec![0, 1, 2]` |
| `collecter(0, 5)` | `vec![]` |

> [!warning] Piège
> Le canal ne se ferme que quand **tous** les émetteurs sont détruits, même celui du thread principal. Pense à `drop(tx)`, sinon le programme reste bloqué.
