Une petite facture, avec des prix en **centimes** (pour éviter les nombres à virgule).

- `taux_tva()` (à la racine) : 20 %.
- `facture::tva(prix_ht)` : le montant de la TVA (`prix_ht × taux / 100`).
- `facture::prix_ttc(prix_ht)` : prix hors taxe + TVA.
- `facture::remise::appliquer(prix, pourcentage)` : enlève un pourcentage au prix.

1. Le code ne compile pas : **E0425**, « cannot find function `taux_tva` in this scope ». Un module ne voit pas automatiquement ce qui est dans son parent. Corrige avec `super`.
2. Écris `facture::remise::sur_prix_ttc(prix_ht, pourcentage)` : calcule le prix TTC **puis** applique la remise. Utilise `super` pour appeler `prix_ttc`.

| Appel | Résultat |
|---|---|
| `facture::prix_ttc(1000)` | `1200` |
| `facture::remise::sur_prix_ttc(1000, 10)` | `1080` |
