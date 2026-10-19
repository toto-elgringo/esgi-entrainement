Écris ces fonctions avec des **expressions génératrices** (pas de liste intermédiaire) :

- `somme_carres(n)` : la somme `1² + 2² + ... + n²`. `somme_carres(3)` → `14` ;
- `nombre_voyelles(texte)` : le nombre de voyelles (`aeiouy`, majuscules comprises) ;
- `premier_long(mots, taille)` : le **premier** mot qui a au moins `taille` lettres, ou `None` s'il n'y en a pas ;
- `moyenne_positifs(nombres)` : la moyenne des nombres strictement positifs, `0` s'il n'y en a aucun.

> [!tip] Pourquoi un générateur ?
> `somme_carres(10_000_000)` ne doit pas créer une liste de dix millions de nombres : un générateur les calcule un par un.
