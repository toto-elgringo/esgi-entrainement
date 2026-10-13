Ici, les méthodes prennent `self` **par valeur** : elles **consomment** la commande.

1. `Commande::new()` : une commande vide (0 plat, total 0) ;
2. `ajouter(self, prix) -> Self` : renvoie la commande avec un plat de plus et le prix ajouté au total ;
3. `payer(self, numero) -> Ticket` : transforme la commande en ticket (le montant est le total).

Comme `ajouter` renvoie `Self`, on peut **enchaîner** les appels :

```rust
let ticket = Commande::new().ajouter(12).ajouter(5).payer(1);
// Ticket { numero: 1, montant: 17 }
```

> [!tip] Pourquoi `self` ?
> Après `payer`, la commande n'existe plus : impossible d'ajouter un plat à une commande déjà payée. Ce n'est pas une règle à retenir, c'est le **compilateur** qui l'interdit.
