Le module `banque` contient un `Compte` dont les champs sont **privés** : personne en dehors du module ne peut modifier le solde directement. Tout passe par des méthodes publiques.

Écris les méthodes :

- `Compte::ouvrir(titulaire)` : un nouveau compte avec un solde de 0 ;
- `titulaire()` : le nom du titulaire ;
- `solde()` : le solde actuel ;
- `deposer(montant)` : ajoute le montant ;
- `retirer(montant)` : retire le montant et renvoie `true`, **sauf** si le solde est insuffisant : dans ce cas rien ne change et elle renvoie `false`.

> [!tip] Expérience
> Une fois l'exercice réussi, ajoute `compte.solde = 1_000_000;` dans `main` et clique sur « Exécuter » : erreur **E0616**, le champ est privé. C'est le principe de l'**encapsulation** : le module garantit que le solde reste cohérent.
