Écris le tri fusion d'un tableau d'entiers, dans l'ordre croissant, en trois fonctions :

| Fonction | Rôle |
|---|---|
| `fusionnerParties(t, aux, debut, milieu, fin)` | les portions `[debut, milieu)` et `[milieu, fin)` de `t` sont triées : les fusionner pour que `[debut, fin)` soit trié |
| `trierPartie(t, aux, debut, fin)` | trier la portion `[debut, fin)` de `t` (récursive) |
| `triFusion(t, n)` | trier les `n` cases de `t` |

- `[debut, fin)` veut dire : de `debut` **compris** à `fin` **non compris** (taille `fin - debut`).
- `aux` est un tableau brouillon de `n` cases, réservé **une seule fois** dans `triFusion` avec `malloc`, puis libéré avec `free`.
- Si `n < 2`, il n'y a rien à trier : ne réserve rien.
- Les tests trient jusqu'à 100 001 valeurs : un tri en O(n²) serait trop lent.

```c
int t[] = {7, 3, 10, 2, 9, 3, 6, 2};
triFusion(t, 8);
```

`t` contient alors `2 2 3 3 6 7 9 10`.

```anim
tri
algo: fusion
```
