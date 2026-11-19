Le programme lit **une seule ligne** au clavier : des morceaux séparés par des espaces. Certains sont des entiers (éventuellement négatifs), d'autres non.

Avec des listes en compréhension, il affiche :

1. la liste des entiers lus (les autres morceaux sont ignorés) ;
2. les entiers strictement positifs ;
3. la valeur absolue de chaque entier ;
4. la valeur absolue des entiers pairs ;
5. la somme des entiers.

Avec l'entrée :

```text
4 -7 abc 12 0 3.5 -2 9
```

le programme doit afficher **exactement** :

```text
Entiers : [4, -7, 12, 0, -2, 9]
Positifs : [4, 12, 9]
Valeurs absolues : [4, 7, 12, 0, 2, 9]
Pairs en valeur absolue : [4, 12, 0, 2]
Somme : 16
```

> [!warning] Un seul `input()`
> Toute la ligne arrive d'un coup : pas de boucle sur `input()`. Et pas de texte dans `input()`, sinon il s'afficherait.
