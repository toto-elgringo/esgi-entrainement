Une petite épicerie. Deux fonctions sont déjà écrites :

- `prix_unitaire(produit)` renvoie un `Option<u32>` (`None` si le produit n'existe pas) ;
- `stock(produit)` renvoie la quantité disponible.

Écris `commander(produit, quantite)` qui renvoie un `Result<u32, ErreurCommande>` :

1. produit inconnu → `Err(ErreurCommande::ProduitInconnu)` ;
2. pas assez de stock → `Err(ErreurCommande::StockInsuffisant)` ;
3. sinon → `Ok(prix total)`.

| Appel | Résultat |
|---|---|
| `commander("pomme", 3)` | `Ok(6)` |
| `commander("pain", 1)` | `Err(StockInsuffisant)` |
| `commander("chocolat", 1)` | `Err(ProduitInconnu)` |

> [!tip] `ok_or`
> `option.ok_or(erreur)` transforme un `Option` en `Result` : `Some(v)` devient `Ok(v)` et `None` devient `Err(erreur)`. On peut ensuite utiliser `?`.
