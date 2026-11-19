Ce tri rapide a été écrit trop vite. Les fonctions `echanger` et `partition` sont justes, mais `trierRapidePartie` contient **deux** erreurs :

- sur certains tableaux, le programme plante (débordement de la pile d'appels) ;
- sur d'autres, il se termine mais le tableau n'est pas trié.

Trouve-les et corrige-les. Le reste du code ne doit pas changer : le pivot reste la case du milieu de la portion.

> [!tip] Méthode
> Fais le tri à la main sur `{1, 2}` : quelle portion est triée au deuxième appel ? Puis sur la portion de droite d'un tableau de 7 cases : quel indice est donné comme pivot ?
