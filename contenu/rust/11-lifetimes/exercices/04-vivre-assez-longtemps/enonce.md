Deux fonctions ne compilent pas, car une référence survit à la valeur qu'elle emprunte. **Ne change pas leur signature**, réorganise seulement le code à l'intérieur.

1. `longueur_du_plus_long(texte_1, texte_2)` : la longueur du plus long des deux textes mis en majuscules.
   Erreur **E0597** : « `second` does not live long enough ».
2. `premier_mot_en_majuscules(texte)` : le premier mot du texte, en majuscules (`""` s'il n'y a aucun mot).
   Erreur **E0716** : « temporary value dropped while borrowed ».

| Appel | Résultat |
|---|---|
| `longueur_du_plus_long("bonjour", "salut")` | `7` |
| `premier_mot_en_majuscules("bonjour le monde")` | `"BONJOUR"` |

> [!warning] Valeur temporaire
> `texte.to_uppercase()` crée une nouvelle `String` **temporaire** : si on ne la range pas dans une variable, elle est détruite à la fin de la ligne.
