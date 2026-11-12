Le programme trie des joueurs avec `sort()`, ce qui demande d'implémenter `Ord`. Complète `cmp` pour que l'ordre soit :

1. le **score le plus haut d'abord** ;
2. à score égal, le **nom** dans l'ordre alphabétique.

Le programme doit afficher exactement :

```text
1. Ana (80)
2. Max (80)
3. Lea (50)
4. Zoe (20)
Meilleur : Ana
```

> [!tip] Rappel
> `a.cmp(&b)` renvoie `Less`, `Equal` ou `Greater`. Inverser les deux côtés inverse l'ordre.
