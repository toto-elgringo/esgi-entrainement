Dans le tri à bulles, une petite valeur placée à la fin (une **tortue**) ne recule que d'une case par passage. Le **tri cocktail** règle ça en alternant :

- un passage **aller** (de gauche à droite), qui fait remonter la plus grande valeur au bout de la zone ;
- un passage **retour** (de droite à gauche), qui fait descendre la plus petite au début de la zone.

```text
2 3 4 5 6 1
aller  : 2 3 4 5 1 | 6
retour : 1 | 2 3 4 5 | 6     la tortue 1 traverse tout d'un coup
aller  : aucun échange, c'est fini
```

Écris `tri_cocktail(tab, n)`. Commence **toujours** par l'aller. Après chaque passage, la zone à trier se resserre d'une case du côté où une valeur vient d'être placée, et on s'arrête dès qu'un passage ne fait aucun échange.

Utilise `plus_grand(a, b)` pour chaque comparaison et `echanger` : les tests vérifient qu'une tortue au bout d'un tableau de 100 cases est rangée en **moins de 300 comparaisons** (le tri à bulles en ferait près de 5 000).
