Écris deux classes.

**`Produit(nom, prix, quantite)`**

- `prix` et `quantite` sont des **propriétés** : leur setter lève une `ValueError` si la valeur est négative (y compris à la création) ;
- `valeur()` renvoie `prix × quantite`.

**`Inventaire()`**

- `ajouter(produit)` : ajoute le produit. Si un produit **du même nom** est déjà présent, on augmente seulement sa quantité ;
- `retirer(nom, quantite)` : diminue le stock. Lève `KeyError` si le produit n'existe pas, `ValueError` si on demande plus que le stock (le stock ne change pas). Un produit à 0 reste dans l'inventaire ;
- `valeur_totale()` : la somme des valeurs de tous les produits ;
- `en_rupture()` : la liste **triée** des noms des produits dont la quantité vaut 0 ;
- `len(inventaire)` donne le nombre de produits différents, et `"pomme" in inventaire` teste si un produit est présent.

```python
inv = Inventaire()
inv.ajouter(Produit("pomme", 0.5, 10))
inv.ajouter(Produit("pain", 1.2, 2))
inv.ajouter(Produit("pomme", 0.5, 5))
inv.retirer("pain", 2)
print(len(inv), "pomme" in inv)    # 2 True
print(inv.valeur_totale())         # 7.5
print(inv.en_rupture())            # ['pain']
```
