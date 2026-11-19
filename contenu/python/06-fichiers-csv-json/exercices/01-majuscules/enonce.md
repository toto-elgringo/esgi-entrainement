Écris la fonction `copier_en_majuscules(source, cible)` :

- elle lit **tout** le contenu du fichier `source` ;
- elle l'écrit **en majuscules** dans le fichier `cible` (en remplaçant son contenu s'il existe déjà) ;
- elle renvoie le nombre de caractères écrits.

Le fichier `source` ne doit pas être modifié. Si `source` contient :

```text
Bonjour,
l'été arrive !
```

alors `cible` contient ensuite :

```text
BONJOUR,
L'ÉTÉ ARRIVE !
```

et la fonction renvoie `24`.

> [!tip] L'encodage
> Ouvre les deux fichiers avec `encoding="utf-8"` : sans ça, les accents peuvent être mal lus selon l'ordinateur.
