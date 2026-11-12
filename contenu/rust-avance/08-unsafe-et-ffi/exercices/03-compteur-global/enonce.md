Une variable globale modifiable est déclarée avec `static mut`.

Écris `suivant() -> u32` : elle ajoute 1 au `COMPTEUR` global puis renvoie sa nouvelle valeur. Les appels successifs renvoient donc 1, 2, 3...

> [!warning] Pourquoi c'est risqué
> Deux threads pourraient modifier `COMPTEUR` en même temps. Dans la vraie vie, on préfère `AtomicU32`. Ici, on s'entraîne au pouvoir n°3 d'`unsafe`.
