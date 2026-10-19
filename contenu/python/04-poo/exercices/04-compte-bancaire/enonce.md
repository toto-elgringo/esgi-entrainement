Écris la classe `Compte` :

- `Compte(titulaire, solde=0)` : le titulaire est public (attribut `titulaire`), le solde est **privé** (attribut `__solde`) ;
- `get_solde()` renvoie le solde ;
- `deposer(montant)` ajoute le montant au solde. Si le montant n'est pas strictement positif, lève une `ValueError("montant invalide")` ;
- `retirer(montant)` enlève le montant du solde. Lève une `ValueError("montant invalide")` si le montant n'est pas strictement positif, et une `ValueError("solde insuffisant")` s'il dépasse le solde.

En cas d'erreur, le solde ne doit **pas** changer.

```python
c = Compte("Ada", 100)
c.deposer(50)
c.retirer(30)
print(c.get_solde())   # 120
```
