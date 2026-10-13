Un magasin suit son stock avec une `HashMap<String, u32>` (article → quantité).

Écris les méthodes de `Inventaire` :

1. `nouveau()` : un inventaire vide.
2. `ajouter(article, quantite)` : ajoute au stock (crée l'article s'il n'existe pas).
3. `retirer(article, quantite)` : renvoie `Ok(())` si c'est possible, sinon une erreur, **sans rien modifier** :
   - article absent : `ErreurStock::ArticleInconnu(article)` ;
   - pas assez de stock : `ErreurStock::StockInsuffisant { article, disponible, demande }`.

   Si la quantité tombe à 0, l'article **disparaît** de l'inventaire.
4. `quantite(article)` : la quantité en stock (0 si l'article est absent).
5. `a_reapprovisionner(seuil)` : les noms des articles dont la quantité est **strictement inférieure** au seuil, triés par ordre alphabétique.
6. Le trait `Display`, pour afficher l'inventaire avec `{}` : une ligne par article, `article : quantité`, triées par ordre alphabétique, **sans** retour à la ligne à la fin.

```text
banane : 12
pomme : 3
```

> [!info] `()` dans `Result<(), ErreurStock>`
> `Ok(())` veut dire « ça a marché, et il n'y a rien à renvoyer ».
