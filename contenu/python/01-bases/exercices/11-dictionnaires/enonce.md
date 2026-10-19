Écris quatre fonctions sur les dictionnaires :

- `compter_lettres(texte)` : renvoie un dictionnaire lettre → nombre d'apparitions, **sans compter les espaces**. `compter_lettres("ici")` → `{"i": 2, "c": 1}` ;
- `inverser(d)` : renvoie un nouveau dictionnaire où clés et valeurs sont échangées. `inverser({"a": 1, "b": 2})` → `{1: "a", 2: "b"}` ;
- `fusionner(d1, d2)` : renvoie un **nouveau** dictionnaire qui contient les items des deux ; si une clé est dans les deux, la valeur de `d2` gagne. `d1` et `d2` ne doivent **pas** être modifiés ;
- `prix_panier(panier, tarifs)` : `panier` associe un article à une quantité, `tarifs` un article à un prix. Renvoie le prix total ; un article absent des tarifs compte pour 0.
