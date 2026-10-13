`changer_derniere_lettre(s)` remplace la dernière lettre d'un texte par un `a` : `"Coco"` devient `"Coca"`.

Le code ne compile pas (erreur **E0382**, *borrow of moved value*) : la `String` est donnée à la fonction, qui la détruit à sa fin.

Corrige-le avec un **emprunt mutable** : la fonction modifie la `String` de l'appelant **sans la prendre**. Elle ne renvoie rien.

> [!tip] Rappel
> `s.pop()` retire le dernier caractère (un caractère entier, même un émoji) et renvoie `Some(caractère)`, ou `None` si le texte est vide.
