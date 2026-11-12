# Un arbre binaire de recherche

Dans un **arbre binaire de recherche**, chaque nœud a une valeur, un enfant à gauche (valeurs plus petites) et un enfant à droite (valeurs plus grandes). Un enfant peut manquer, d'où `Option<Box<Noeud>>`.

Écris :

- `inserer(arbre, valeur)` : renvoie l'arbre avec la valeur ajoutée (si elle existe déjà, l'arbre ne change pas) ;
- `contient(arbre, valeur)` : cherche la valeur ;
- `hauteur(arbre)` : nombre de niveaux (0 pour un arbre vide, 1 pour un seul nœud) ;
- `en_ordre(arbre)` : toutes les valeurs triées par ordre croissant.

> [!info] Parcours en ordre
> On visite d'abord le sous-arbre gauche, puis le nœud, puis le sous-arbre droit. Dans un arbre de recherche, cela donne les valeurs triées.
