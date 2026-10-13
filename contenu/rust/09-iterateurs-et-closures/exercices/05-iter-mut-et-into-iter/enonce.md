Trois façons de parcourir une liste, trois fonctions :

1. `augmenter_tous(v, montant)` ajoute `montant` à chaque élément **sur place**. Le code est écrit mais **ne compile pas** : corrige-le.
2. `en_majuscules(mots)` reçoit une liste de `String` (elle en devient propriétaire) et renvoie les mêmes mots en majuscules.
3. `noms_des_majeurs(personnes)` reçoit des couples `(nom, age)` et renvoie les noms des personnes de 18 ans ou plus.

| Méthode | Donne | Usage |
|---|---|---|
| `iter()` | `&T` | lire |
| `iter_mut()` | `&mut T` | modifier sur place |
| `into_iter()` | `T` | consommer la liste et réutiliser ses éléments |

```rust
let personnes = vec![("Léa".to_string(), 17), ("Tom".to_string(), 30)];
noms_des_majeurs(personnes);   // ["Tom"]
```

> [!tip] Pourquoi `into_iter` ?
> Pour renvoyer les `String` des noms sans les copier, il faut les **sortir** de la liste : c'est possible seulement si on la consomme.
