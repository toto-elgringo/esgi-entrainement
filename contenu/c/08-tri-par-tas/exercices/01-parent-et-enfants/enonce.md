Un tas est un arbre complet rangé **niveau par niveau** dans un tableau :

```text
              53                     indice :  0   1   2   3   4   5   6   7
           /      \                  valeur : 53  29  12   4  15   3   9   1
         29        12
        /  \      /  \
       4    15   3    9
      /
     1
```

Écris les quatre fonctions :

| Fonction | Renvoie | Exemple |
|---|---|---|
| `enfantGauche(i)` | l'indice de l'enfant gauche de la case `i` | `enfantGauche(1)` vaut 3 |
| `enfantDroit(i)` | l'indice de l'enfant droit | `enfantDroit(1)` vaut 4 |
| `parent(i)` | l'indice du parent (`i` vaut au moins 1) | `parent(7)` vaut 3 |
| `valeurDuParent(t, i)` | la **valeur** du parent de la case `i` | avec le tableau ci-dessus, `valeurDuParent(t, 4)` vaut 29 |
