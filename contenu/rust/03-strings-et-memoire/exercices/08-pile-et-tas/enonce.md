Le programme doit afficher **exactement** :

```text
pile : 42
tas : 42
somme : 84
taille d'une Box : 8 octets
taille d'une String : 24 octets
taille d'un &str : 16 octets
```

Le code ne compile pas, et il manque deux lignes. Corrige-le :

1. répare la ligne de la somme (`sur_le_tas` est une **boîte**, pas un nombre) ;
2. ajoute les deux dernières lignes avec `std::mem::size_of::<T>()` : n'écris pas les nombres 24 et 16 à la main.

> [!info] Pourquoi ces tailles ?
> Sur une machine 64 bits, une adresse fait 8 octets. Une `Box` est une adresse. Un `&str` est une adresse + une longueur. Une `String` est une adresse + une longueur + une capacité.
