`somme_grand_tableau()` crée un tableau de 9 millions d'octets valant tous 1, puis les additionne. Résultat attendu : `9000000`.

Le code compile, mais la **pile déborde** (*stack overflow*) : le programme est tué net, sans même pouvoir afficher une panique.

Change **une seule ligne** pour ranger le tableau sur le **tas**.

> [!info] `for x in &tableau`
> Le `&` parcourt le tableau **sans le consommer** : `x` est une référence vers chaque case, et `*x` lit la valeur. On détaille les références au chapitre suivant.
