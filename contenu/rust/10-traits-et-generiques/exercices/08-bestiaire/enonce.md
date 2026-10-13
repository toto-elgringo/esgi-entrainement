Le bestiaire contient un chien et un chat, rangés dans un `Vec<Box<dyn Animal>>`.

Ajoute un **perroquet** nommé `Coco` qui a appris le mot `Bonjour` :

1. implémente le trait `Animal` pour la structure `Perroquet` (son espèce est `perroquet`, son cri est le mot qu'il a appris) ;
2. ajoute-le à la fin du bestiaire.

La sortie doit être **exactement** :

```text
Rex le chien dit Wouf
Felix le chat dit Miaou
Coco le perroquet dit Bonjour
3 animaux dans le bestiaire
```

> [!tip] La force de `dyn`
> La boucle ne sait pas quel animal elle manipule : chaque `Box<dyn Animal>` appelle les méthodes de son vrai type.
