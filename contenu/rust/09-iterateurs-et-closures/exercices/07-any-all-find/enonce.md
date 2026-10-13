Des questions sur une liste, une méthode pour chacune :

1. `contient_negatif(v)` : y a-t-il **au moins un** nombre négatif ? (`any`)
2. `tous_majeurs(ages)` : **tout le monde** a-t-il 18 ans ou plus ? (`all`)
3. `premier_multiple(v, diviseur)` : le **premier** élément divisible par `diviseur`, ou `None`. (`find`)
4. `position_premier_mot_long(mots, taille)` : l'**indice** du premier mot d'au moins `taille` octets, ou `None`. (`position`)

| Appel | Résultat |
|---|---|
| `contient_negatif(&[3, -1, 4])` | `true` |
| `tous_majeurs(&[18, 40, 17])` | `false` |
| `premier_multiple(&[5, 9, 12, 18], 3)` | `Some(9)` |
| `position_premier_mot_long(&["a", "abc", "abcd"], 3)` | `Some(1)` |

> [!warning] `all` sur une liste vide
> `tous_majeurs(&[])` renvoie `true` : « tout le monde est majeur » est vrai quand il n'y a personne.
