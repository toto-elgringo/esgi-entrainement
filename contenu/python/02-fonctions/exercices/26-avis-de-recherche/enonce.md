Écris une fonction `avis(...)` qui fabrique le texte d'un avis de recherche. Toutes ses options sont **facultatives** et se donnent **uniquement par mot-clé** : `sexe`, `taille` (un entier, en cm), `yeux`, `couleur` (des cheveux) et `coiffure`.

Le texte renvoyé contient une ligne par information, séparées par `"\n"`, **sans espace en trop** :

1. `Recherché : homme` si `sexe="h"`, `Recherché : femme` si `sexe="f"`, `Recherché : personne` si le sexe n'est pas donné. Si `taille` est donnée, elle est ajoutée sur la même ligne : `Recherché : femme (172 cm)` ;
2. si `yeux` est donné : `- yeux <yeux>` ;
3. si `couleur` et/ou `coiffure` sont donnés : `- cheveux <couleur> <coiffure>`, ou seulement celui qui est donné.

```python
print(avis(sexe="f", taille=172, yeux="verts", couleur="bruns", coiffure="bouclés"))
# Recherché : femme (172 cm)
# - yeux verts
# - cheveux bruns bouclés

print(avis(coiffure="courts"))
# Recherché : personne
# - cheveux courts
```

Les appels incorrects sont refusés :

- un argument donné par position (`avis("f")`) ou un mot-clé inconnu (`avis(age=30)`) : `TypeError` ;
- un sexe autre que `"h"` ou `"f"` : `ValueError`.
