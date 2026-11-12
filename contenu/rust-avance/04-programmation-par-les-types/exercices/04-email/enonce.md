Crée un type `Email` qui ne peut contenir qu'une adresse **valide**. Le constructeur renvoie un `Result` avec une erreur précise (une `enum`).

`Email::new(texte)` vérifie dans cet ordre :

1. Il y a un `@`, sinon `ErreurEmail::SansArobase`.
2. Il y a du texte avant **et** après le `@`, sinon `ErreurEmail::PartieVide`.
3. La partie après le `@` contient un `.`, sinon `ErreurEmail::DomaineSansPoint`.

Si tout va bien, on obtient `Ok(Email)`. Ajoute aussi :

- `adresse()` : l'adresse complète (`&str`).
- `domaine()` : la partie après le `@` (`&str`).

| Texte | Résultat |
|---|---|
| `"alice.fr"` | `Err(SansArobase)` |
| `"@ecole.fr"` | `Err(PartieVide)` |
| `"alice@ecole"` | `Err(DomaineSansPoint)` |
| `"alice@ecole.fr"` | `Ok`, domaine `"ecole.fr"` |

> [!tip] `?` dans une fonction qui renvoie un `Result`
> `option.ok_or(erreur)?` sort de la fonction avec `Err(erreur)` si l'option est vide, sinon donne la valeur.
