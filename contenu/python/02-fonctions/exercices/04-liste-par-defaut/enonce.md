Ce code a un **bug** : lance-le et regarde la deuxième ligne affichée.

```python
print(ajouter_tache("courses"))
print(ajouter_tache("ménage"))
```

On s'attend à `['courses']` puis `['ménage']`, mais la deuxième liste contient aussi `'courses'` : la liste par défaut est **partagée** entre tous les appels. Le même problème touche `compter_mot`, qui utilise un dictionnaire par défaut.

Corrige les deux fonctions pour que chaque appel sans liste (ou sans dictionnaire) reparte de zéro, tout en continuant à modifier la liste ou le dictionnaire **quand on en donne un**.
