Le **tri à peigne** est un tri à bulles qui compare des cases **éloignées** : `tab[i]` et `tab[i + ecart]`. L'écart part de `n` et il est divisé par 1,3 au début de chaque passage, sans descendre sous 1. Les tortues font ainsi de grands sauts vers le début dès les premiers passages.

```text
n = 10 : écarts 7, 5, 3, 2, 1, 1, 1…
```

On s'arrête quand l'écart vaut 1 **et** qu'un passage n'a fait aucun échange : les derniers passages sont un tri à bulles classique, sur un tableau presque trié.

Écris `tri_peigne(tab, n)`. Calcule le nouvel écart en entiers : `ecart * 10 / 13`.

Les tests trient 200 000 valeurs au hasard : le tri à peigne y arrive en une fraction de seconde, alors qu'un tri à bulles ou par insertion dépasserait les 10 secondes permises.

> [!warning] Une fonction `void` ne renvoie rien
> Le tableau est trié **sur place**, par son adresse : l'appelant voit le résultat. Pas de `return tab;` à la fin, c'est une erreur de compilation dans une fonction `void`.
