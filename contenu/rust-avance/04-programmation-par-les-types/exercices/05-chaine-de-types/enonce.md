Le type `Pourcentage` est déjà écrit. Tu construis la chaîne qui va du **texte brut** à une valeur **validée**, sans `if` imbriqués ni `unwrap`.

1. `lire_pourcentage(texte)` : enlève les espaces autour, convertit en `u8`, puis construit le `Pourcentage`.
   - Texte qui n'est pas un nombre entre 0 et 255 : `Err("« <texte> » n'est pas un nombre valide")` (le texte est repris tel quel, espaces compris).
   - Nombre supérieur à 100 : l'erreur de `Pourcentage::new` (`"150 dépasse 100"`).
2. `somme_pourcentages(&[&str])` : lit tous les textes et renvoie leur somme (`u32`). La première erreur rencontrée est renvoyée.
3. `premier_valide(&[&str])` : le premier texte qui donne un pourcentage valide, ou `None`.

| Appel | Résultat |
|---|---|
| `lire_pourcentage(" 45 ")` | `Ok(Pourcentage(45))` |
| `lire_pourcentage("abc")` | `Err("« abc » n'est pas un nombre valide")` |
| `lire_pourcentage("150")` | `Err("150 dépasse 100")` |
| `somme_pourcentages(&["10", "20"])` | `Ok(30)` |
| `premier_valide(&["x", "300", "40"])` | `Some(Pourcentage(40))` |

> [!info] `and_then` ou `map` ?
> `map(f)` convient quand `f` renvoie une valeur simple. Quand `f` renvoie elle-même un `Result` (comme `Pourcentage::new`), on utilise `and_then` pour ne pas obtenir un `Result` dans un `Result`.
