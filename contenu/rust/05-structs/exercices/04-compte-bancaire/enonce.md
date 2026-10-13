Complète le compte bancaire :

1. `CompteBancaire::new(titulaire)` : crée un compte avec un solde de 0 ;
2. `deposer(&mut self, montant)` : ajoute le montant au solde ;
3. `retirer(&mut self, montant) -> bool` : si le solde suffit, retire le montant et renvoie `true` ; sinon **ne change rien** et renvoie `false` ;
4. `solde(&self) -> u32` : renvoie le solde.

> [!tip] Même nom, deux choses
> Une méthode peut porter le même nom qu'un champ. Les parenthèses font la différence : `compte.solde` est le champ, `compte.solde()` est la méthode.
