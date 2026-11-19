Écris le tri par tas **sans rien de fourni** à part `echanger` :

- `descendre(t, taille, i)` : fait descendre la case `i` dans le tas formé par les `taille` premières cases ;
- `triParTas(t, n)` : trie les `n` cases de `t` dans l'ordre **croissant**, **en place** (aucun tableau en plus, aucun `malloc`) et en **O(n log n)** dans tous les cas.

```text
5 9 1 8 3          tableau de départ
9 8 1 5 3          1. construction du tas max (en partant du bas)
8 5 1 3 | 9        2. la racine part à la fin, le tas rétrécit
5 3 1 | 8 9
3 1 | 5 8 9
1 | 3 5 8 9        trié : 1 3 5 8 9
```

Les tests trient 300 000 valeurs : un tri en O(n²) dépasse le temps permis.

> [!warning] Deux bornes à soigner
> La construction doit aussi faire descendre la **racine** (case 0). Pendant la deuxième étape, la descente ne doit jamais toucher les cases déjà rangées à la fin.
