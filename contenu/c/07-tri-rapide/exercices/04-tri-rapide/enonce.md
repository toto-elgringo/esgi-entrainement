Écris le tri rapide d'un tableau d'entiers, dans l'ordre croissant, **en place** :

| Fonction | Rôle |
|---|---|
| `trierRapidePartie(t, debut, fin)` | trier la portion `[debut, fin)` de `t` (récursive) |
| `triRapide(t, n)` | trier les `n` cases de `t` |

`echanger` et `partition(t, debut, fin, indicePivot)` (la partition du cours sur une portion) sont fournies : utilise-les.

- Prends comme pivot la case du **milieu** de la portion : `debut + (fin - debut) / 2`.
- Aucun tableau en plus : pas de `malloc`.
- Les tests trient jusqu'à 100 001 valeurs, et aussi un grand tableau **déjà trié** : un pivot en première ou dernière case serait trop lent.

```c
int t[] = {4, 9, 1, 6, 8, 2, 7};
triRapide(t, 7);
```

`t` contient alors `1 2 4 6 7 8 9`.
