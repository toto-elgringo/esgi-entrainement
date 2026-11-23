Écris `chaine(valeurs, capacite)`, une petite chaîne de traitement à deux étapes reliées par des **canaux bornés** (`mpsc::sync_channel(capacite)`) :

1. un thread **producteur** envoie chaque valeur de `valeurs` dans le premier canal ;
2. un thread **transformateur** lit le premier canal, double chaque valeur et l'envoie dans le second canal ;
3. la fonction lit le second canal, attend les deux threads et renvoie les valeurs reçues.

Avec un seul producteur, l'ordre est conservé : pas besoin de trier.

| Appel | Résultat |
|---|---|
| `chaine(vec![1, 2, 3], 2)` | `vec![2, 4, 6]` |
| `chaine(vec![5, -1], 0)` | `vec![10, -2]` |
| `chaine(vec![], 3)` | `vec![]` |

> [!info] Capacité `0`
> Avec `sync_channel(0)`, chaque `send` attend que l'autre thread soit prêt à recevoir. Ta chaîne doit quand même marcher, sans rester bloquée.
