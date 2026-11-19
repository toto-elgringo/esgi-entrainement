Inverser un dictionnaire, c'est échanger clés et valeurs. Mais si **plusieurs clés ont la même valeur**, l'inversion simple en perd : il faut associer à chaque valeur la **liste** des clés qui l'avaient.

Écris trois fonctions (aucune ne modifie ce qu'elle reçoit) :

- `inverser_groupes(d)` : le dictionnaire valeur → **liste triée** des clés de `d` qui avaient cette valeur ;
- `familles_anagrammes(texte)` : les mots du texte sont séparés par des espaces. Renvoie le dictionnaire « lettres du mot triées » → **liste triée** des mots **différents** qui ont ces lettres ;
- `valeurs_partagees(d)` : la **liste triée** des valeurs qui appartiennent à au moins deux clés.

```python
print(inverser_groupes({"a": 1, "b": 1, "c": 2, "d": 3, "e": 2}))
# {1: ['a', 'b'], 2: ['c', 'e'], 3: ['d']}

print(familles_anagrammes("le chien de la chine aime la niche"))
# {'el': ['le'], 'cehin': ['chien', 'chine', 'niche'], 'de': ['de'], 'al': ['la'], 'aeim': ['aime']}

print(valeurs_partagees({"Ana": "B1", "Tom": "B2", "Eva": "B1"}))
# ['B1']
```

L'ordre des clés du dictionnaire renvoyé n'a pas d'importance, seul le contenu compte.

> [!warning] Le piège du code de départ
> `inverser_groupes` y est écrite avec une compréhension qui a l'air juste... lance les tests pour voir ce qu'elle perd.
