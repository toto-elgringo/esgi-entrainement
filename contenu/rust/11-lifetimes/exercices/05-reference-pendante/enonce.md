Deux fonctions essaient de renvoyer une **référence vers une variable locale** : erreur **E0515**.

- `creer_salutation(nom)` doit renvoyer `"Bonjour, <nom> !"` ;
- `repeter(mot, fois)` doit renvoyer `mot` répété `fois` fois (`repeter("ha", 3)` donne `"hahaha"`).

Corrige-les.

> [!tip] Rappel
> Une variable créée dans une fonction meurt à la fin de la fonction. Pour la donner à l'appelant, on la **renvoie par valeur** : l'appelant en devient le propriétaire.
