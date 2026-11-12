Complète la structure `Compteur`. Ses méthodes prennent toutes `&self` (jamais `&mut self`) : c'est le `Cell` qui permet de modifier la valeur.

1. `nouveau()` crée un compteur à `0`.
2. `incrementer()` ajoute `1`.
3. `valeur()` renvoie la valeur actuelle.
4. `remettre_a_zero()` remet à `0` et **renvoie l'ancienne valeur**.

| Appel | Résultat |
|---|---|
| `nouveau()` puis `incrementer()` deux fois, puis `valeur()` | `2` |
| `remettre_a_zero()` quand la valeur est `2` | `2`, puis `valeur()` vaut `0` |

> [!info] `Cell::replace`
> `replace(nouvelle)` met la nouvelle valeur et rend l'ancienne en une seule opération.
