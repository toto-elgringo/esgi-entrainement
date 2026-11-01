Un fichier contient une personne par ligne, au format `nom:âge` (par exemple `Ana:20`). Les espaces autour du nom et de l'âge ne comptent pas.

Écris ces fonctions en **enchaînant** les méthodes de `Option` et `Result` (`map`, `and_then`, `filter`, `ok`, `ok_or`, `map_err`, `?`), sans `match` ni `if let` (les tests ne vérifient que les résultats : à toi de jouer le jeu).

1. `extraire_age(ligne)` : l'âge, ou `None` si la ligne n'a pas de `:` ou si l'âge n'est pas un entier positif.
2. `lire_personne(ligne)` : la `Personne` lue, ou la **première** erreur trouvée, dans cet ordre :
   - pas de `:` → `ErreurLecture::SeparateurManquant` ;
   - nom vide (une fois les espaces enlevés) → `ErreurLecture::NomVide` ;
   - âge qui n'est pas un entier positif → `ErreurLecture::AgeInvalide`.
3. `lire_toutes(lignes)` : toutes les personnes, ou la première erreur rencontrée.
4. `noms_des_majeurs(lignes)` : les noms des personnes de 18 ans ou plus, dans l'ordre, en **ignorant** les lignes invalides.

| Appel | Résultat |
|---|---|
| `extraire_age("Ana: 20")` | `Some(20)` |
| `extraire_age("Ana")` | `None` |
| `lire_personne(" Léo :19")` | `Ok(Personne { nom: "Léo", age: 19 })` |
| `lire_personne(" :19")` | `Err(NomVide)` |
| `lire_personne("Mia:vingt")` | `Err(AgeInvalide)` |
| `lire_toutes(&["Ana:20", "Léo"])` | `Err(SeparateurManquant)` |
| `noms_des_majeurs(&["Ana:20", "Léo:15", "???", "Mia:18"])` | `["Ana", "Mia"]` |

> [!tip] Rappels
> - `ok_or(erreur)` transforme une `Option` en `Result`, et `ok()` fait l'inverse.
> - `x?` donne la valeur si tout va bien, sinon il **sort de la fonction** avec l'erreur.
> - `collect()` vers un `Result<Vec<_>, _>` s'arrête à la première erreur.
