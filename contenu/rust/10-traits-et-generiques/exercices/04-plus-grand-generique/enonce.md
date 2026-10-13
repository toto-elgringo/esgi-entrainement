La fonction `plus_grand` ne marche qu'avec des `i32`. Les tests l'appellent aussi avec des `f64`, des `&str` et des `char` : le code **ne compile pas**.

1. Rends `plus_grand` **générique** pour qu'elle marche avec n'importe quel type comparable.
2. Écris `plus_grand_de_la_liste(liste)` qui renvoie le plus grand élément d'une tranche, ou `None` si elle est vide.

| Appel | Résultat |
|---|---|
| `plus_grand(3, 7)` | `7` |
| `plus_grand(2.5, 1.5)` | `2.5` |
| `plus_grand("pomme", "banane")` | `"pomme"` (ordre alphabétique) |
| `plus_grand_de_la_liste(&[3, 9, 2])` | `Some(9)` |
| `plus_grand_de_la_liste(&['x', 'b'])` | `Some('x')` |

> [!tip] La contrainte
> `T: PartialOrd` veut dire « `T` peut être n'importe quel type qui sait se comparer avec `<` et `>` ».
