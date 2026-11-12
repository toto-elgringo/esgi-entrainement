Le trait `Article` a pour **supertrait** `Display` : tout article doit savoir s'afficher. Sa méthode par défaut `etiquette` s'appuie dessus.

À écrire :

1. `Display` pour `Livre` : `Livre <titre>` (ex. `Livre Rust`).
2. `Display` pour `Stylo` : `Stylo <couleur>` (ex. `Stylo bleu`).
3. La méthode par défaut `etiquette` du trait : le nom de l'article, ` : `, puis le prix en euros avec **deux** décimales et ` €`.

Les prix sont donnés en centimes (`prix_centimes`).

| Article | `etiquette()` |
|---|---|
| `Livre` « Rust » à 2990 centimes | `Livre Rust : 29.90 €` |
| `Stylo` « bleu » à 150 centimes | `Stylo bleu : 1.50 €` |

> [!tip] Rappel
> Grâce au supertrait, `self` peut être mis directement dans un `{}` à l'intérieur du trait.
