`fold` sait tout faire. Écris chaque fonction avec **un seul `fold`**, sans `sum`, `max`, `count`, `rev` ni boucle `for` (les tests ne vérifient que les résultats : à toi de jouer le jeu).

1. `somme_des_carres(nombres)` : la somme des carrés des nombres.
2. `compter_voyelles(texte)` : le nombre de voyelles minuscules sans accent (`a`, `e`, `i`, `o`, `u`, `y`).
3. `inverser(texte)` : le texte écrit à l'envers.
4. `maximum(nombres)` : le plus grand nombre, ou `None` si la liste est vide.
5. `moyenne(notes)` : la moyenne, ou `None` si la liste est vide. Un seul passage sur la liste : l'accumulateur est une paire `(somme, nombre de notes)`.

| Appel | Résultat |
|---|---|
| `somme_des_carres(&[1, 2, 3])` | `14` |
| `compter_voyelles("programmation")` | `5` |
| `inverser("rust")` | `"tsur"` |
| `maximum(&[3, -1, 8])` | `Some(8)` |
| `moyenne(&[12.0, 15.0, 9.0])` | `Some(12.0)` |

> [!tip] Bien choisir le départ
> La valeur de départ est le résultat pour une liste **vide** : `0` pour une somme, `String::new()` pour un texte, `None` quand il n'y a pas de réponse possible.
