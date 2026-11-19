Un tableau plein de **valeurs égales** est un pire cas pour la partition à deux côtés : toutes les valeurs égales au pivot partent du même côté, et le tri rapide passe en O(n²).

Écris `partitionTroisZones(t, debut, fin, pivot, finPetits, debutGrands)`. Elle range **en place**, en un seul parcours, la portion `[debut, fin)` en trois zones, puis écrit deux indices aux adresses reçues :

```text
[ < pivot | = pivot | > pivot ]
 debut   *finPetits  *debutGrands  fin
```

- `[debut, *finPetits)` : les valeurs plus petites que `pivot` ;
- `[*finPetits, *debutGrands)` : les valeurs égales à `pivot` (cette zone peut être vide) ;
- `[*debutGrands, fin)` : les valeurs plus grandes.

```c
int t[] = {5, 2, 5, 9, 5, 1, 7};
int p, g;
partitionTroisZones(t, 0, 7, 5, &p, &g);
```

Par exemple `t` devient `2 1 5 5 5 7 9` (l'ordre à l'intérieur d'une zone peut être différent), `p` vaut 2 et `g` vaut 5.

Le tri rapide fourni (`triRapide3`) utilise ta fonction et ne trie plus que les deux zones extérieures. Les tests trient ensuite 200 000 valeurs **toutes égales**, puis 200 000 valeurs qui ne valent que 0, 1 ou 2.
