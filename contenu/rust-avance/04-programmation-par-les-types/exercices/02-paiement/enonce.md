Un paiement a trois états : en attente, payé (avec un montant), remboursé (avec un montant et un motif). Une `enum` interdit les combinaisons absurdes qu'autoriseraient deux booléens `paye` et `rembourse`.

Complète trois fonctions :

1. `libelle(&Paiement)` renvoie un texte :
   - `"en attente"`
   - `"payé : 30 euros"`
   - `"remboursé : 30 euros (doublon)"`
2. `montant_encaisse(&Paiement)` renvoie le montant d'un paiement **payé**, et `0` dans tous les autres cas.
3. `rembourser(paiement, motif)` transforme un paiement payé en paiement remboursé. Pour les autres états, elle renvoie `Err("seul un paiement payé peut être remboursé".to_string())`.
