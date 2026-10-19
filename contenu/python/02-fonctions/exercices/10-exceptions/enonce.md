Écris quatre fonctions :

- `division_sure(a, b)` : renvoie `a / b`, ou `None` si `b` vaut zéro (intercepte `ZeroDivisionError`) ;
- `lire_entier(texte, defaut=0)` : renvoie `int(texte)`, ou `defaut` si le texte n'est pas un entier (intercepte `ValueError`) ;
- `acces_sur(conteneur, cle)` : renvoie `conteneur[cle]`, ou `None` si la clé (dictionnaire) ou l'indice (liste) n'existe pas. Utilise **un seul** `except` ;
- `need_positive_number(n)` : renvoie `n` s'il est positif ou nul, sinon **lève** une `ValueError` avec le message `"need to be positive"`.

N'utilise pas de `if` pour éviter les erreurs dans les trois premières : laisse l'exception se produire et intercepte-la.
