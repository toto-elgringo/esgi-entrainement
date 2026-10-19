Écris la fonction `supprimerValeur(start, valeur)` qui retire de la liste le **premier** maillon dont la valeur vaut `valeur`, et libère sa mémoire. Si aucun maillon ne contient `valeur`, la liste ne change pas.

| Liste avant | Appel | Liste après |
|---|---|---|
| `1 -> 4 -> 2 -> 5` | `supprimerValeur(&l, 2)` | `1 -> 4 -> 5` |
| `1 -> 4 -> 5` | `supprimerValeur(&l, 1)` | `4 -> 5` |
| `4 -> 5` | `supprimerValeur(&l, 42)` | `4 -> 5` |
| `7 -> 3 -> 7` | `supprimerValeur(&l, 7)` | `3 -> 7` |

```text
prev s'arrête juste avant la cible, puis prev->next saute la cible :

start --> [1|*] --> [4|*] --> [2|*] --> [5|*] --> NULL
                     prev      cible
start --> [1|*] --> [4|*] -------------> [5|*] --> NULL
```

La fonction `supprimerDebut` est fournie : elle peut servir pour le cas du premier maillon.
