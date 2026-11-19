Un serveur reçoit les temps de réponse de `n` requêtes et veut afficher les `k` plus rapides, **du plus petit au plus grand**. Trier tout le tableau serait du gaspillage quand `k` est petit : on utilise un **tas min** (chaque case est plus petite ou égale à ses enfants, le minimum est à la racine).

Écris :

- `descendreMin(t, taille, i)` : la descente, version tas min ;
- `kPlusPetits(t, n, k, resultat)` (avec `0 <= k <= n`) :
  1. transforme les `n` cases de `t` en tas min, en O(n) ;
  2. retire `k` fois la racine (échange avec la dernière case du tas, une case de moins, descente) et range chaque valeur retirée dans `resultat`, dans l'ordre.

```text
t = 7 2 9 4 1 8, k = 3

tas min :       1 2 8 4 7 9
retrait de 1 :  2 4 8 9 7 | 1       resultat : 1
retrait de 2 :  4 7 8 9 | 2 1       resultat : 1 2
retrait de 4 :  7 9 8 | 4 2 1       resultat : 1 2 4
```

Les tests vérifient aussi qu'à la fin, les `n - k` premières cases de `t` forment un **tas min**. Le tout coûte O(n + k log n).
