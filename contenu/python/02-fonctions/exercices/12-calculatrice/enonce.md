Le programme lit des calculs, une ligne à la fois, jusqu'à la ligne `fin`. Écris la fonction `calculer(ligne)` qui **renvoie** le texte à afficher :

| Cas | Texte renvoyé |
|---|---|
| calcul correct | `"3 + 4 = 7"` (les deux nombres, l'opérateur, `=`, le résultat) |
| pas exactement 3 morceaux séparés par des espaces | `"Erreur : format attendu « a op b »"` |
| opérateur autre que `+ - * /` | `"Erreur : opération inconnue"` |
| un des deux nombres n'est pas un entier | `"Erreur : nombre invalide"` |
| division par zéro | `"Erreur : division par zéro"` |

Les vérifications se font **dans cet ordre**. Les opérations sont déjà rangées dans le dictionnaire `OPERATIONS`, qui associe chaque symbole à une fonction. Avec l'entrée :

```text
3 + 4
10 / 4
7 * 6
5 / 0
2 ^ 3
douze + 1
1 +
9 - 12
fin
```

le programme doit afficher :

```text
3 + 4 = 7
10 / 4 = 2.5
7 * 6 = 42
Erreur : division par zéro
Erreur : opération inconnue
Erreur : nombre invalide
Erreur : format attendu « a op b »
9 - 12 = -3
```
