Écris la fonction `inverser(start)` qui inverse l'ordre de la liste **sans créer de nouveau maillon** (on réutilise les mêmes maillons en changeant leurs `next`) et renvoie le nouveau premier maillon.

```c
liste = inverser(liste);
```

`1 -> 2 -> 3 -> 4` devient `4 -> 3 -> 2 -> 1`. L'ancien premier maillon devient le dernier (son `next` vaut `NULL`).

```text
avant :  NULL     [1|*] --> [2|*] --> [3|*] --> NULL
après :  NULL <-- [1|*] <-- [2|*] <-- [3|*]
```

> [!warning] Ne pas perdre la suite
> Dès qu'on écrit `cur->next = ...`, l'adresse de la suite de la liste est écrasée. Il faut l'avoir rangée **avant** dans une variable.
