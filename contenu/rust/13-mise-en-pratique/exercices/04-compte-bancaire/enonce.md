Un compte bancaire qui garde l'**historique** des opérations réussies. Les types sont déjà écrits :

- `Operation` : un `Depot(montant)` ou un `Retrait(montant)` ;
- `ErreurBancaire` : `MontantNul` ou `SoldeInsuffisant { solde, demande }` ;
- `Compte` : un titulaire, un solde et l'historique (`Vec<Operation>`).

Écris les méthodes :

1. `Compte::nouveau(titulaire)` : solde 0, historique vide.
2. `titulaire()`, `solde()` et `historique()` (une vue `&[Operation]` sur la liste).
3. `appliquer(operation)` : renvoie `Ok(nouveau_solde)`, ou une erreur :
   - montant de 0 (dépôt ou retrait) : `Err(ErreurBancaire::MontantNul)` ;
   - retrait plus grand que le solde : `Err(ErreurBancaire::SoldeInsuffisant { solde, demande })`.

   Une opération refusée ne change **rien** (ni le solde, ni l'historique).
4. `appliquer_tout(operations)` : applique les opérations dans l'ordre et s'arrête à la **première erreur**, qu'elle renvoie (les opérations d'avant restent appliquées). Utilise `?`.
5. `total_depose()` : la somme de tous les dépôts de l'historique.

> [!tip] `#[derive(Clone, Copy)]`
> `Operation` est `Copy` : on peut la mettre dans l'historique **et** continuer à l'utiliser, comme un nombre.
